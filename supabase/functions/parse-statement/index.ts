import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");

const SYSTEM_PROMPT = `Eres un parser de cartolas bancarias chilenas.
Extrae TODAS las transacciones del siguiente texto.

Para cada transaccion devuelve:
- date: formato YYYY-MM-DD
- description: texto limpio (sin numeros de referencia ni codigos)
- amount: numero entero positivo (pesos chilenos, sin puntos ni $)
- type: "gasto" o "ingreso"

Detecta tambien:
- bank: nombre del banco o tarjeta
- account_type: "cuenta_corriente", "cuenta_vista", "tarjeta_credito"
- column_mapping: objeto con indices de columnas detectados (ej: {"fecha": 0, "desc": 2, "cargo": 3, "abono": 4})
- date_format: formato de fecha encontrado (ej: "DD/MM/YYYY")
- fingerprint_keywords: array con 2-4 palabras clave unicas del header que identifican este banco

Responde SOLO con JSON valido, sin markdown, sin explicaciones.
Formato: { "bank": "...", "account_type": "...", "column_mapping": {...}, "date_format": "...", "fingerprint_keywords": [...], "transactions": [{date, description, amount, type}, ...] }`;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  try {
    // Verify JWT
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "No authorization header" }), {
        status: 401,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    const { text, file_name } = await req.json();
    if (!text || typeof text !== "string") {
      return new Response(JSON.stringify({ error: "Missing text field" }), {
        status: 400,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    // Truncate to ~8000 chars to keep cost low
    const truncated = text.substring(0, 8000);

    // Call Claude Haiku
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20241022",
        max_tokens: 4096,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: `Texto de la cartola:\n${truncated}` }],
      }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.error("Anthropic API error:", errBody);
      return new Response(JSON.stringify({ error: "AI parse failed", detail: errBody }), {
        status: 502,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    const aiResult = await response.json();
    const rawText = aiResult.content?.[0]?.text || "";

    // Parse the JSON response from Claude
    let parsed;
    try {
      parsed = JSON.parse(rawText);
    } catch {
      return new Response(JSON.stringify({ error: "AI returned invalid JSON", raw: rawText.substring(0, 500) }), {
        status: 422,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    // Log the import (non-blocking)
    const safePreview = text.substring(0, 500).replace(/\d{5,}/g, "***");
    supabase.from("import_logs").insert({
      user_id: user.id,
      file_name: file_name || "unknown",
      detected_bank: parsed.bank || "unknown",
      parser_used: "ai",
      transactions_found: parsed.transactions?.length || 0,
      success: (parsed.transactions?.length || 0) > 0,
      error_message: null,
      text_preview: safePreview,
    }).then(() => {});

    // Save bank format for auto-learning (non-blocking)
    if (parsed.transactions?.length > 0 && parsed.fingerprint_keywords?.length > 0) {
      supabase.from("bank_formats").insert({
        bank_name: parsed.bank || "unknown",
        fingerprint_keywords: parsed.fingerprint_keywords,
        column_mapping: parsed.column_mapping || {},
        date_format: parsed.date_format || "",
        source_type: parsed.account_type === "tarjeta_credito" ? "tc" : "banco",
        sample_headers: [],
        times_used: 1,
      }).then(() => {});
    }

    return new Response(JSON.stringify(parsed), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  } catch (err) {
    console.error("Edge function error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }
});

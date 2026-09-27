/**
 * Nugen AI Client Adapter
 * 
 * Interacts with Nugen Intelligence Platform (API v3):
 * - Authenticates with Nugen API Key
 * - Verifies base models and domain alignment status
 * - Fallbacks gracefully when cloud training workers are offline
 */

export async function verifyNugenConnection() {
  const apiKey = process.env.NUGEN_API_KEY;
  if (!apiKey) {
    return { connected: false, error: "NUGEN_API_KEY not configured" };
  }

  try {
    const res = await fetch("https://api.nugen.in/api/v3/models/base", {
      headers: {
        "Authorization": `Bearer ${apiKey}`
      }
    });

    if (res.ok) {
      const data = await res.json();
      return {
        connected: true,
        authenticated: true,
        platform: "Nugen Intelligence (v3)",
        modelsCount: (data.models || []).length,
        models: (data.models || []).map(m => m.model_name || m.model_id),
      };
    } else {
      return { connected: false, status: res.status, error: await res.text() };
    }
  } catch (err) {
    return { connected: false, error: err.message };
  }
}

export async function queryNugenAI({ prompt, systemPrompt, model = "llama-v3p2-3b-reasoning", temperature = 0.7, max_tokens = 1500 }) {
  const apiKey = process.env.NUGEN_API_KEY;
  if (!apiKey) {
    return null;
  }

  const baseUrl = process.env.NUGEN_API_BASE || "https://api.nugen.in/api/v3";

  try {
    const messages = [];
    if (systemPrompt) {
      messages.push({ role: "system", content: systemPrompt });
    }
    messages.push({ role: "user", content: prompt });

    // Official Nugen v3 inference chat completions endpoint with 8s resilience timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(`${baseUrl}/inference/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(`[Nugen AI] Inference endpoint HTTP ${response.status}. Using secondary pipeline.`);
      return null;
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || null;
  } catch (error) {
    console.warn("[Nugen AI] Call error:", error.name === 'AbortError' ? 'Request timed out after 8s' : error.message);
    return null;
  }
}

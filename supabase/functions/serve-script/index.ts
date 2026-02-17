import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const scriptKey = url.searchParams.get("k");
    
    if (!scriptKey) {
      return new Response("Missing parameter", { status: 400, headers: corsHeaders });
    }

    const targetUrl = `https://www.highperformanceformat.com/${scriptKey}/invoke.js`;
    const response = await fetch(targetUrl);
    const scriptContent = await response.text();

    return new Response(scriptContent, {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/javascript",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    return new Response("Error", { status: 500, headers: corsHeaders });
  }
});

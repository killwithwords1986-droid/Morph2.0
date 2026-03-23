import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const editPromptTemplate = (stylePrompt: string) =>
  `Using this person's likeness (face and general appearance), generate a new photorealistic image of them styled as follows: ${stylePrompt}. You may change the pose, outfit, accessories, hairstyle, setting, and camera angle as needed to match the description. Make it look like high fashion editorial photography with professional lighting. The result MUST be a generated image.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64, stylePrompt } = await req.json();

    if (!imageBase64 || !stylePrompt) {
      return new Response(
        JSON.stringify({ error: "Missing imageBase64 or stylePrompt" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Ensure image is a proper data URI
    let imageUrl = imageBase64;
    if (!imageUrl.startsWith("data:")) {
      imageUrl = `data:image/jpeg;base64,${imageUrl}`;
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: "LOVABLE_API_KEY is not configured." }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const model = "google/gemini-3.1-flash-image-preview";
    console.log(`Lovable AI: Using model ${model}...`);

    const response = await fetch("https://ai.lovable.dev/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: editPromptTemplate(stylePrompt) },
              { type: "image_url", image_url: { url: imageUrl } },
            ],
          },
        ],
        modalities: ["image", "text"],
        stream: false,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.warn(`Lovable AI: ${response.status} — ${errText}`);
      let errorMessage = "Image generation failed. Please try again.";
      try {
        const parsed = JSON.parse(errText);
        errorMessage = parsed?.error?.message || errorMessage;
      } catch {
        if (errText) errorMessage = errText;
      }
      return new Response(
        JSON.stringify({ error: errorMessage, providerStatus: response.status }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const generatedImage = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    const textResponse = data.choices?.[0]?.message?.content;

    if (generatedImage) {
      console.log("Lovable AI: Success — image generated.");
      return new Response(
        JSON.stringify({ image: generatedImage, description: textResponse }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Some models return inline base64 in content
    if (typeof textResponse === "string" && textResponse.includes("data:image")) {
      const match = textResponse.match(/(data:image\/[^;]+;base64,[A-Za-z0-9+/=]+)/);
      if (match) {
        console.log("Lovable AI: Success — extracted inline image.");
        return new Response(
          JSON.stringify({ image: match[1], description: textResponse }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    console.warn("Lovable AI: No image in response.");
    return new Response(
      JSON.stringify({ error: "No image was generated. Please try again with a different style." }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("restyle error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

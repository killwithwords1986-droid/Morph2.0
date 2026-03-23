import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import ImageUpload from "@/components/ImageUpload";
import StyleSelector from "@/components/StyleSelector";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [stylePrompt, setStylePrompt] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handlePresetSelect = (id: string, prompt: string) => {
    setSelectedPreset(id);
    setStylePrompt(prompt);
    setCustomPrompt("");
  };

  const handleCustomChange = (value: string) => {
    setCustomPrompt(value);
    setStylePrompt(value);
    setSelectedPreset(null);
  };

  const activePrompt = customPrompt || stylePrompt;

  const handleGenerate = async () => {
    if (!uploadedImage || !activePrompt) {
      toast({ title: "Missing info", description: "Please upload a photo and choose a style.", variant: "destructive" });
      return;
    }

    setIsGenerating(true);
    setResultImage(null);

    try {
      const { data, error } = await supabase.functions.invoke("restyle", {
        body: { imageBase64: uploadedImage, stylePrompt: activePrompt },
      });

      if (error) throw error;

      if (data?.error) {
        toast({ title: "Generation failed", description: data.error, variant: "destructive" });
        return;
      }

      if (data?.image) {
        setResultImage(data.image);
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Something went wrong", variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen gradient-dark">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm">
        <div className="container max-w-5xl py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight">
              <span className="text-primary">MORPH</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-1">AI Style Experience</p>
          </div>
          <Sparkles className="w-6 h-6 text-primary" />
        </div>
      </header>

      {/* Main content */}
      <main className="container max-w-5xl py-8 md:py-12 space-y-10">
        {/* Step 1: Upload */}
        <section className="space-y-4 animate-fade-in">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full gradient-gold text-primary-foreground text-sm font-bold">1</span>
            <h2 className="text-xl font-display font-semibold text-foreground">Your Photo</h2>
          </div>
          <ImageUpload
            onImageSelect={setUploadedImage}
            currentImage={uploadedImage}
            onClear={() => { setUploadedImage(null); setResultImage(null); }}
          />
        </section>

        {/* Step 2: Style */}
        <section className="space-y-4 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full gradient-gold text-primary-foreground text-sm font-bold">2</span>
            <h2 className="text-xl font-display font-semibold text-foreground">Choose Your Vibe</h2>
          </div>
          <StyleSelector
            selectedPreset={selectedPreset}
            onSelectPreset={handlePresetSelect}
            customPrompt={customPrompt}
            onCustomPromptChange={handleCustomChange}
          />
        </section>

        {/* Generate button */}
        <div className="flex justify-center animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <Button
            variant="gold"
            size="lg"
            onClick={handleGenerate}
            disabled={!uploadedImage || !activePrompt || isGenerating}
            className="min-w-[220px]"
          >
            {isGenerating ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Look
              </>
            )}
          </Button>
        </div>

        {/* Result */}
        {resultImage && (
          <section className="space-y-4 animate-fade-in">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full gradient-gold text-primary-foreground text-sm font-bold">✓</span>
              <h2 className="text-xl font-display font-semibold text-foreground">Your New Look</h2>
            </div>
            <div className="rounded-lg overflow-hidden border border-border shadow-card">
              <img src={resultImage} alt="AI generated restyle" className="w-full object-contain" />
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default Index;

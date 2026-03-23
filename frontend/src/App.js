import React, { useState, useCallback } from 'react';
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import { Sparkles, Upload, X, ChevronDown } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Style categories data
const styleCategories = [
  {
    id: "sporty",
    label: "Sporty",
    emoji: "Running",
    presets: [
      { id: "sporty-tracksuit", label: "Modern Tracksuit", prompt: "wearing a modern tracksuit, fresh sneakers, sporty streetwear aesthetic" },
      { id: "sporty-jogger", label: "Jogger Set", prompt: "wearing slim-fit joggers, performance hoodie, running shoes, athleisure look" },
      { id: "sporty-tennis", label: "Tennis Chic", prompt: "wearing a white tennis skirt or shorts, polo shirt, clean white sneakers, tennis club style" },
      { id: "sporty-basketball", label: "Basketball Fit", prompt: "wearing basketball jersey, baggy shorts, high-top sneakers, NBA courtside style" },
      { id: "sporty-yoga", label: "Yoga Flow", prompt: "wearing fitted yoga pants, sports bra or tank top, barefoot, serene wellness aesthetic" },
      { id: "sporty-boxing", label: "Boxing Ready", prompt: "wearing boxing shorts, hand wraps, sports tank, boxing gym aesthetic" },
      { id: "sporty-retro", label: "Retro Athletic", prompt: "wearing vintage 80s athletic wear, headband, high-cut shorts, retro sneakers" },
      { id: "sporty-crossfit", label: "CrossFit", prompt: "wearing CrossFit shorts, muscle tank, lifting shoes, functional fitness look" },
    ],
  },
  {
    id: "office",
    label: "Professional",
    emoji: "Briefcase",
    presets: [
      { id: "office-tailored", label: "Tailored Suit", prompt: "wearing a perfectly tailored navy suit, polished dress shoes, professional corporate look" },
      { id: "office-power", label: "Power Suit", prompt: "wearing a bold power suit in black, sharp shoulders, stilettos or oxfords, CEO energy" },
      { id: "office-smart", label: "Smart Casual", prompt: "wearing chinos, blazer over a crew-neck sweater, loafers, smart casual office look" },
      { id: "office-creative", label: "Creative Director", prompt: "wearing all-black ensemble, designer glasses, minimalist jewelry, creative agency director" },
      { id: "office-startup", label: "Startup Founder", prompt: "wearing a fitted turtleneck, slim pants, clean sneakers, Silicon Valley tech founder look" },
      { id: "office-minimalist", label: "Minimalist Pro", prompt: "wearing a clean white shirt, tailored black trousers, simple leather belt, minimalist professional" },
      { id: "office-architect", label: "Architect Chic", prompt: "wearing black turtleneck, round glasses, tailored pants, architectural modernist aesthetic" },
      { id: "office-modern", label: "Modern Work", prompt: "wearing relaxed-fit blazer, cropped pants, white sneakers, modern hybrid office style" },
    ],
  },
  {
    id: "bold",
    label: "Sassy & Bold",
    emoji: "Flame",
    presets: [
      { id: "bold-leather", label: "Red Leather", prompt: "wearing a red leather jacket, stylish boots, bold street fashion, night out outfit" },
      { id: "bold-neon", label: "Neon Night", prompt: "wearing neon green outfit, platform boots, glow-in-the-dark accessories, rave fashion" },
      { id: "bold-leopard", label: "Leopard Print", prompt: "wearing head-to-toe leopard print, bold sunglasses, fierce stilettos, animal print fashion" },
      { id: "bold-chains", label: "Chain Heavy", prompt: "wearing heavy gold chains, leather pants, crop top, bold urban street style" },
      { id: "bold-punk", label: "Punk Rock", prompt: "wearing ripped fishnet stockings, combat boots, studded jacket, punk rock concert outfit" },
      { id: "bold-power", label: "Power Red", prompt: "wearing an all-red power outfit, red lips, red heels, commanding presence" },
      { id: "bold-corset", label: "Corset Queen", prompt: "wearing a structured corset top, high-waisted pants, bold earrings, corseted street style" },
      { id: "bold-western", label: "Western Bold", prompt: "wearing cowboy boots, fringed leather jacket, cowboy hat, bold Western saloon style" },
    ],
  },
  {
    id: "casual",
    label: "Casual Cool",
    emoji: "Sunglasses",
    presets: [
      { id: "casual-denim", label: "Denim Days", prompt: "wearing relaxed denim, vintage tee, casual effortless cool style" },
      { id: "casual-beach", label: "Beach Vibes", prompt: "wearing linen shorts, open Hawaiian shirt, sandals, beach vacation casual" },
      { id: "casual-cozy", label: "Cozy Knit", prompt: "wearing oversized knit sweater, leggings, fuzzy socks, cozy autumn look" },
      { id: "casual-streetwear", label: "Streetwear", prompt: "wearing oversized hoodie, cargo pants, chunky sneakers, urban streetwear style" },
      { id: "casual-brunch", label: "Brunch Date", prompt: "wearing sundress or casual button-up, white sneakers, tote bag, weekend brunch style" },
      { id: "casual-cottagecore", label: "Cottagecore", prompt: "wearing floral midi dress, straw hat, wicker basket, rustic countryside cottagecore" },
      { id: "casual-minimal", label: "Minimal Casual", prompt: "wearing plain white tee, well-fitted jeans, clean white sneakers, Scandinavian minimal casual" },
      { id: "casual-boho", label: "Boho Free", prompt: "wearing flowing bohemian skirt, crochet top, layered bracelets, free-spirit boho style" },
    ],
  },
  {
    id: "elegant",
    label: "Black Tie",
    emoji: "Sparkles",
    presets: [
      { id: "elegant-gown", label: "Evening Gown", prompt: "wearing an elegant floor-length evening gown, luxurious formal attire, red carpet ready" },
      { id: "elegant-tuxedo", label: "Classic Tuxedo", prompt: "wearing a classic black tuxedo, bow tie, patent leather shoes, James Bond gala style" },
      { id: "elegant-velvet", label: "Velvet Luxe", prompt: "wearing deep burgundy velvet suit or gown, gold accessories, old-money luxury" },
      { id: "elegant-crystal", label: "Crystal Embellished", prompt: "wearing a crystal-embellished gown, sparkling jewelry, diamond earrings, awards ceremony look" },
      { id: "elegant-gatsby", label: "Great Gatsby", prompt: "wearing 1920s Art Deco gown, fringe details, long pearl necklaces, Gatsby party style" },
      { id: "elegant-ballroom", label: "Ballroom", prompt: "wearing a grand ballroom gown, full skirt, elbow gloves, Cinderella ball aesthetic" },
      { id: "elegant-emerald", label: "Emerald Night", prompt: "wearing an emerald green silk gown, gold clutch, emerald jewelry, luxury gala night" },
      { id: "elegant-metallic", label: "Gold Metallic", prompt: "wearing a liquid gold metallic gown, statement cuff, gold heels, Oscars red carpet" },
    ],
  },
  {
    id: "fantasy",
    label: "Fantasy & Cosplay",
    emoji: "Sword",
    presets: [
      { id: "fantasy-wizard", label: "Wizard", prompt: "wearing flowing wizard robes, pointed hat, magical staff, enchanted forest sorcerer look" },
      { id: "fantasy-elf", label: "Elven Royalty", prompt: "wearing elven royal attire, pointed ears, silver circlet, ethereal forest elf aesthetic" },
      { id: "fantasy-pirate", label: "Pirate Captain", prompt: "wearing pirate captain coat, tricorn hat, sword, sailing ship captain swashbuckler look" },
      { id: "fantasy-steampunk", label: "Steampunk", prompt: "wearing steampunk outfit, brass goggles, clockwork accessories, Victorian industrial fantasy" },
      { id: "fantasy-superhero", label: "Superhero", prompt: "wearing custom superhero suit, cape, mask, comic book hero outfit, dynamic pose ready" },
      { id: "fantasy-vampire", label: "Vampire Lord", prompt: "wearing Victorian vampire attire, high collar cape, gothic jewelry, dark immortal elegance" },
      { id: "fantasy-knight", label: "Medieval Knight", prompt: "wearing full plate armor, sword and shield, medieval knight, crusader warrior look" },
      { id: "fantasy-cyborgpunk", label: "Cyborg", prompt: "wearing cybernetic implants, robotic arm, LED eyes, sci-fi cyborg fashion" },
    ],
  },
  {
    id: "decade",
    label: "Decades",
    emoji: "Radio",
    presets: [
      { id: "decade-20s", label: "Roaring 20s", prompt: "wearing 1920s flapper dress, Art Deco headband, fringe, jazz age style, Great Gatsby era" },
      { id: "decade-50s", label: "1950s Rock & Roll", prompt: "wearing 1950s poodle skirt, saddle shoes, letterman jacket, American Graffiti rock and roll" },
      { id: "decade-60s", label: "Swinging 60s", prompt: "wearing 1960s mod fashion, mini skirt, go-go boots, geometric prints, Twiggy-inspired" },
      { id: "decade-70s", label: "Groovy 70s", prompt: "wearing 1970s bell-bottoms, platform shoes, psychedelic print shirt, disco fever style" },
      { id: "decade-80s", label: "Neon 80s", prompt: "wearing 1980s neon colors, shoulder pads, leg warmers, big hair, MTV era fashion" },
      { id: "decade-90s", label: "Grunge 90s", prompt: "wearing 1990s grunge flannel, ripped jeans, Doc Martens, choker necklace, alternative 90s" },
      { id: "decade-y2k", label: "Y2K 2000s", prompt: "wearing early 2000s low-rise jeans, bedazzled top, Juicy Couture tracksuit, Y2K pop star" },
      { id: "decade-disco", label: "Studio 54", prompt: "wearing Studio 54 disco outfit, sequin halter, bell-bottom jumpsuit, disco ball glamour" },
    ],
  },
  {
    id: "luxury",
    label: "Luxury & Designer",
    emoji: "Crown",
    presets: [
      { id: "luxury-chanel", label: "Chanel Classic", prompt: "wearing classic Chanel tweed suit, pearl necklace, quilted handbag, Parisian luxury" },
      { id: "luxury-versace", label: "Versace Bold", prompt: "wearing bold Versace-inspired baroque print, gold Medusa accessories, Italian luxury" },
      { id: "luxury-gucci", label: "Gucci Eclectic", prompt: "wearing eclectic Gucci-inspired mix of patterns, retro glasses, maximalist luxury fashion" },
      { id: "luxury-dior", label: "Dior Couture", prompt: "wearing Dior-inspired new look, cinched waist, full skirt, elegant hat, Parisian couture" },
      { id: "luxury-hermes", label: "Hermes Equestrian", prompt: "wearing Hermes-inspired equestrian style, silk scarf, leather riding boots, understated luxury" },
      { id: "luxury-bottega", label: "Bottega Veneta", prompt: "wearing Bottega Veneta-inspired woven leather, muted green, quiet luxury aesthetic" },
      { id: "luxury-mcqueen", label: "McQueen Drama", prompt: "wearing Alexander McQueen-inspired dramatic fashion, skull motifs, dark couture, theatrical luxury" },
      { id: "luxury-old-money", label: "Old Money", prompt: "wearing old money quiet luxury, cashmere sweater, loafers, understated wealth, generational richness" },
    ],
  },
];

// Toast component
const Toast = ({ message, type, onClose }) => (
  <div className={`toast ${type === 'error' ? 'toast-error' : ''}`}>
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="font-medium text-sm">{type === 'error' ? 'Error' : 'Success'}</p>
        <p className="text-sm text-gray-400">{message}</p>
      </div>
      <button onClick={onClose} className="text-gray-400 hover:text-white">
        <X size={16} />
      </button>
    </div>
  </div>
);

// ImageUpload component
const ImageUpload = ({ onImageSelect, currentImage, onClear }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback((file) => {
    if (!file.type.startsWith("image/")) return;
    
    const img = new Image();
    img.onload = () => {
      const MAX = 768;
      let w = img.width;
      let h = img.height;
      if (w > MAX || h > MAX) {
        const scale = MAX / Math.max(w, h);
        w = Math.round(w * scale);
        h = Math.round(h * scale);
      }
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, w, h);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
      onImageSelect(dataUrl);
    };
    img.src = URL.createObjectURL(file);
  }, [onImageSelect]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  if (currentImage) {
    return (
      <div className="image-container" data-testid="uploaded-image-container">
        <img src={currentImage} alt="Your uploaded photo" />
        <button onClick={onClear} className="clear-button" data-testid="clear-image-btn">
          <X size={16} />
        </button>
      </div>
    );
  }

  return (
    <label
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`upload-zone ${isDragging ? 'dragging' : ''}`}
      data-testid="image-upload-zone"
    >
      <Upload className="w-10 h-10 text-gray-500 mb-4" />
      <p className="text-white font-medium mb-1">Drop your photo here</p>
      <p className="text-sm text-gray-400">or click to browse</p>
      <p className="text-xs text-gray-500 mt-2">Full-body photos work best</p>
      <input type="file" accept="image/*" onChange={handleChange} className="hidden" data-testid="image-input" />
    </label>
  );
};

// StyleSelector component
const StyleSelector = ({ selectedPreset, onSelectPreset, customPrompt, onCustomPromptChange }) => {
  const [expandedCategory, setExpandedCategory] = useState(null);

  return (
    <div className="space-y-4">
      {/* Category Accordion */}
      <div className="space-y-2">
        {styleCategories.map((category) => (
          <div key={category.id} className="rounded-lg border border-[hsl(var(--border))] overflow-hidden">
            <button
              onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
              className={`category-button ${expandedCategory === category.id ? 'active' : ''}`}
              data-testid={`category-${category.id}`}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{category.emoji === 'Sparkles' ? '✨' : category.emoji === 'Crown' ? '👑' : category.emoji === 'Radio' ? '📻' : category.emoji === 'Sword' ? '⚔️' : category.emoji === 'Sunglasses' ? '😎' : category.emoji === 'Flame' ? '🔥' : category.emoji === 'Briefcase' ? '💼' : '🏃'}</span>
                <span className="font-medium">{category.label}</span>
                <span className="text-xs text-gray-400">({category.presets.length} styles)</span>
              </div>
              <ChevronDown className={`chevron-icon ${expandedCategory === category.id ? 'open' : ''}`} size={16} />
            </button>

            {expandedCategory === category.id && (
              <div className="p-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-[300px] overflow-y-auto">
                {category.presets.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => onSelectPreset(preset.id, preset.prompt)}
                    className={`preset-button ${selectedPreset === preset.id ? 'selected' : ''}`}
                    data-testid={`preset-${preset.id}`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Custom prompt */}
      <div className="relative">
        <textarea
          value={customPrompt}
          onChange={(e) => onCustomPromptChange(e.target.value)}
          placeholder="Or describe your own style... e.g., 'White linen suit with gold accessories on a beach'"
          className="style-textarea"
          data-testid="custom-prompt-input"
        />
      </div>
    </div>
  );
};

// Main Index page
const Index = () => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [stylePrompt, setStylePrompt] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [resultImage, setResultImage] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const handlePresetSelect = (id, prompt) => {
    setSelectedPreset(id);
    setStylePrompt(prompt);
    setCustomPrompt("");
  };

  const handleCustomChange = (value) => {
    setCustomPrompt(value);
    setStylePrompt(value);
    setSelectedPreset(null);
  };

  const activePrompt = customPrompt || stylePrompt;

  const handleGenerate = async () => {
    if (!uploadedImage || !activePrompt) {
      showToast("Please upload a photo and choose a style.", "error");
      return;
    }

    setIsGenerating(true);
    setResultImage(null);

    try {
      const response = await axios.post(`${API}/restyle`, {
        imageBase64: uploadedImage,
        stylePrompt: activePrompt,
      });

      const data = response.data;

      if (data.error) {
        showToast(data.error, "error");
        return;
      }

      if (data.image) {
        setResultImage(data.image);
        showToast("Your new look is ready!", "success");
      }
    } catch (err) {
      showToast(err.message || "Something went wrong", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="gradient-dark">
      {/* Header */}
      <header className="border-b border-[hsl(var(--border))] glass">
        <div className="container py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight">
              <span className="text-[hsl(var(--primary))]">MORPH</span>
            </h1>
            <p className="text-sm text-gray-400 mt-1">AI Style Experience</p>
          </div>
          <Sparkles className="w-6 h-6 text-[hsl(var(--primary))]" />
        </div>
      </header>

      {/* Main content */}
      <main className="container py-8 md:py-12 space-y-10">
        {/* Step 1: Upload */}
        <section className="space-y-4 animate-fade-in" data-testid="upload-section">
          <div className="flex items-center gap-3">
            <span className="step-indicator">1</span>
            <h2 className="text-xl font-display font-semibold">Your Photo</h2>
          </div>
          <ImageUpload
            onImageSelect={setUploadedImage}
            currentImage={uploadedImage}
            onClear={() => { setUploadedImage(null); setResultImage(null); }}
          />
        </section>

        {/* Step 2: Style */}
        <section className="space-y-4 animate-fade-in" style={{ animationDelay: "0.1s" }} data-testid="style-section">
          <div className="flex items-center gap-3">
            <span className="step-indicator">2</span>
            <h2 className="text-xl font-display font-semibold">Choose Your Vibe</h2>
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
          <button
            onClick={handleGenerate}
            disabled={!uploadedImage || !activePrompt || isGenerating}
            className="btn-gold min-w-[220px]"
            data-testid="generate-btn"
          >
            {isGenerating ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Look
              </>
            )}
          </button>
        </div>

        {/* Result */}
        {resultImage && (
          <section className="space-y-4 animate-fade-in" data-testid="result-section">
            <div className="flex items-center gap-3">
              <span className="step-indicator">✓</span>
              <h2 className="text-xl font-display font-semibold">Your New Look</h2>
            </div>
            <div className="result-image">
              <img src={resultImage} alt="AI generated restyle" data-testid="result-image" />
            </div>
          </section>
        )}
      </main>

      {/* Toast */}
      {toast && (
        <div className="toast-container">
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        </div>
      )}
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="*" element={<Index />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

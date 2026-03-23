import { useState, useCallback } from "react";
import { Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  onImageSelect: (base64: string) => void;
  currentImage: string | null;
  onClear: () => void;
}

const ImageUpload = ({ onImageSelect, currentImage, onClear }: ImageUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    // Resize image to max 768px on longest side to reduce token cost
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
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, w, h);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
      onImageSelect(dataUrl);
    };
    img.src = URL.createObjectURL(file);
  }, [onImageSelect]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  if (currentImage) {
    return (
      <div className="relative group">
        <img
          src={currentImage}
          alt="Your uploaded photo"
          className="w-full max-h-[500px] object-contain rounded-lg"
        />
        <button
          onClick={onClear}
          className="absolute top-3 right-3 p-2 rounded-full bg-background/80 backdrop-blur-sm border border-border hover:border-primary/40 transition-colors"
        >
          <X className="w-4 h-4 text-foreground" />
        </button>
      </div>
    );
  }

  return (
    <label
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={cn(
        "flex flex-col items-center justify-center w-full min-h-[300px] rounded-lg border-2 border-dashed cursor-pointer transition-all duration-300",
        isDragging
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/40 hover:bg-muted/30"
      )}
    >
      <Upload className="w-10 h-10 text-muted-foreground mb-4" />
      <p className="text-foreground font-medium mb-1">Drop your photo here</p>
      <p className="text-sm text-muted-foreground">or click to browse</p>
      <p className="text-xs text-muted-foreground mt-2">Full-body photos work best</p>
      <input type="file" accept="image/*" onChange={handleChange} className="hidden" />
    </label>
  );
};

export default ImageUpload;

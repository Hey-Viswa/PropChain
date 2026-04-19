"use client";

import { useRef, useState } from "react";
import { UploadCloud, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface DocFile {
  name: string;
  size: number;
  type: string;
}

interface DocumentUploadZoneProps {
  title: string;
  required?: boolean;
  value: DocFile | null;
  onFileChange: (file: DocFile | null) => void;
}

export default function DocumentUploadZone({
  title,
  required,
  value,
  onFileChange,
}: DocumentUploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  function processFile(file: File) {
    const accepted = ["application/pdf", "image/jpeg", "image/png"];
    if (!accepted.includes(file.type)) {
      alert("Only PDF, JPG, and PNG files are accepted.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert("File must be under 10MB.");
      return;
    }
    onFileChange({ name: file.name, size: file.size, type: file.type });
  }

  return (
    <div className="bg-sand/30 dark:bg-card rounded-2xl p-6 space-y-4 border border-stone/50 dark:border-white/5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-on_surface dark:text-[#e8eaf0] uppercase tracking-widest opacity-80">{title}</p>
        {required ? (
          <span className="text-[10px] font-black uppercase text-error tracking-widest">Required</span>
        ) : (
          <span className="text-[10px] font-bold uppercase text-on_surface_variant dark:text-muted-foreground tracking-widest opacity-60">Optional</span>
        )}
      </div>

      {/* File selected: preview row */}
      {value ? (
        <div className="flex items-center gap-3 bg-white dark:bg-white/5 border border-stone/30 dark:border-white/5 rounded-xl px-4 py-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <FileText size={16} className="text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-on_surface dark:text-[#e8eaf0] truncate">{value.name}</p>
            <p className="text-[10px] font-bold text-on_surface_variant dark:text-muted-foreground uppercase opacity-60">{formatFileSize(value.size)}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onFileChange(null)}
            className="shrink-0 text-on_surface_variant dark:text-muted-foreground hover:text-error hover:bg-error/5"
          >
            <X size={16} />
          </Button>
        </div>
      ) : (
        /* Empty: dashed drop zone */
        <div
          className={cn(
            "border-2 border-dashed border-stone/50 dark:border-white/10 rounded-xl p-10",
            "flex flex-col items-center gap-4 cursor-pointer transition-all",
            dragOver
              ? "border-primary bg-primary/5"
              : "hover:border-primary/40 hover:bg-stone/5 dark:hover:bg-white/[0.02]"
          )}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            const file = e.dataTransfer.files[0];
            if (file) processFile(file);
          }}
          onClick={() => inputRef.current?.click()}
        >
          <div className="w-12 h-12 rounded-2xl bg-stone/10 dark:bg-white/5 flex items-center justify-center">
            <UploadCloud size={24} className="text-on_surface_variant dark:text-muted-foreground" />
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-on_surface dark:text-[#e8eaf0]">
              Initialize Document Upload
            </p>
            <p className="text-xs font-medium text-on_surface_variant dark:text-muted-foreground mt-1 opacity-60">
              PDF, JPG, PNG — max 10MB
            </p>
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) processFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}

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
    <div className="bg-surface_container_lowest rounded-xl p-5 xl:p-6 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-title-md font-medium text-on_surface">{title}</p>
        {required ? (
          <span className="text-label-sm text-error">Required</span>
        ) : (
          <span className="text-label-sm text-on_surface_variant">Optional</span>
        )}
      </div>

      {/* File selected: preview row */}
      {value ? (
        <div className="flex items-center gap-3 bg-surface_container rounded-lg px-4 py-3">
          <div className="w-8 h-8 rounded-lg bg-primary_fixed flex items-center justify-center shrink-0">
            <FileText size={15} className="text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-body-md font-medium text-on_surface truncate">{value.name}</p>
            <p className="text-label-sm text-on_surface_variant">{formatFileSize(value.size)}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onFileChange(null)}
            className="shrink-0 text-on_surface_variant hover:text-error hover:bg-error_container"
          >
            <X size={15} />
          </Button>
        </div>
      ) : (
        /* Empty: dashed drop zone */
        <div
          className={cn(
            "border-2 border-dashed border-outline_variant/40 rounded-xl p-8 xl:p-10",
            "flex flex-col items-center gap-3 cursor-pointer transition-colors",
            dragOver
              ? "border-primary/60 bg-primary_fixed/20"
              : "hover:border-primary/40 hover:bg-surface_container"
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
          <UploadCloud size={28} className="text-on_surface_variant" />
          <div className="text-center">
            <p className="text-title-md font-medium text-on_surface">
              Drop file here or click to upload
            </p>
            <p className="text-body-md text-on_surface_variant mt-0.5">
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

import React, { useRef } from "react";
import { Upload, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { validateFileSize, getFileSizeLimitMB } from "@/lib/registration-store";
import { cn } from "@/lib/utils";

export function FileUploadField({
  label,
  name,
  accept,
  value,
  onChange,
  error,
  multiple = false,
  className,
}) {
  const inputRef = useRef(null);
  const limitMB = getFileSizeLimitMB();
  const limitBytes = limitMB * 1024 * 1024;

  const handleChange = (e) => {
    const files = Array.from(e.target.files || []);
    const invalid = files.filter((f) => !validateFileSize(f));
    if (invalid.length > 0) {
      onChange?.({ files: [], error: `Maksimal ${limitMB}MB per berkas. Berkas yang melebihi batas tidak diunggah.` });
      return;
    }
    onChange?.({ files, error: null });
    e.target.value = "";
  };

  const removeFile = (index) => {
    const baseFiles = (value && value.files) ? value.files : [];
    const newFiles = baseFiles.filter((_, i) => i !== index);
    onChange?.({ files: newFiles, error: null });
  };

  const currentFiles = (value && value.files) ? value.files : [];
  const errMsg = (value && value.error != null) ? value.error : error;

  return (
    <div className={cn("space-y-2", className)}>
      <label className="block text-sm font-medium text-slate-700">{label}</label>
      <div className="flex flex-col gap-2">
        <div
          onClick={() => inputRef.current?.click()}
          className="flex items-center justify-center gap-2 h-24 border-2 border-dashed rounded-lg border-slate-200 bg-slate-50/50 cursor-pointer hover:bg-slate-100/50 transition-colors"
        >
          <Upload className="w-5 h-5 text-slate-400" />
          <span className="text-sm text-slate-500">
            Klik untuk unggah (maks. {limitMB}MB per file)
          </span>
          <input
            ref={inputRef}
            type="file"
            name={name}
            accept={accept}
            multiple={multiple}
            onChange={handleChange}
            className="hidden"
          />
        </div>
        {currentFiles.length > 0 && (
          <ul className="space-y-1">
            {currentFiles.map((file, i) => (
              <li
                key={i}
                className="flex items-center justify-between text-sm bg-slate-100 rounded px-3 py-2"
              >
                <span className="truncate">{file.name}</span>
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  className="text-red-600 hover:text-red-700 p-1"
                  aria-label="Hapus file"
                >
                  <X className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      {errMsg && <p className="text-sm text-red-600">{errMsg}</p>}
    </div>
  );
}

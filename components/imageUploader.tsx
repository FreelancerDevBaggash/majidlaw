"use client"

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { UploadButton } from "./UploadButton"; // المسار حسب مشروعك
import { LinkIcon, Trash2 } from "lucide-react";

interface ImageUploaderProps {
  label?: string;                     // اسم الحقل المعروض
  endpoint: keyof import("@/app/api/uploadthing/core").OurFileRouter;
  value?: string;                     // رابط الصورة الحالية
  onChange: (url: string) => void;    // لتحديث الصورة في الأب
  error?: string;                     // رسالة خطأ
  setError?: (msg: string) => void;   // تحديث رسالة الخطأ
}

export default function ImageUploader({
  label = "الصورة",
  endpoint,
  value,
  onChange,
  error,
  setError,
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);

  return (
    <div className="space-y-2">
      {/* عنوان الحقل */}
      <Label className="font-arabic text-base flex items-center gap-2">
        <LinkIcon className="w-4 h-4" />
        {label}
      </Label>

      {/* زر رفع الصورة */}
      <UploadButton
        endpoint={endpoint}
        onUploadBegin={() => setIsUploading(true)}
        onClientUploadComplete={(res) => {
          setIsUploading(false);
          if (res && res[0]?.url) onChange(res[0].url);
        }}
        onUploadError={(err) => {
          setIsUploading(false);
          setError?.("فشل في رفع الصورة: " + err.message);
        }}
      />

      {/* حالة التحميل */}
      {isUploading && (
        <p className="text-sm text-gray-500 animate-pulse mt-1">
          جارٍ رفع الصورة...
        </p>
      )}

      {/* عرض المعاينة وإزالة الصورة */}
      {value && (
        <div className="mt-3 relative">
          <img
            src={value}
            alt={label}
            className="w-full h-48 object-cover rounded border"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2 flex items-center gap-1"
            onClick={() => onChange("")}
          >
            <Trash2 className="w-4 h-4" />
            إزالة
          </Button>
        </div>
      )}

      {/* رسالة الخطأ */}
      {error && <p className="text-red-600 text-sm">{error}</p>}
    </div>
  );
}

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCallback, useRef, useState } from "react";
import { ImagePlus, Trash2, AlertCircle, Upload, Loader2 } from "lucide-react";
import { useListingStore } from "@/stores/useListingStore";
import { useRouter } from "next/navigation";
import StepWrapper from "./StepWrapper";
import Image from "next/image";
import { getPresignedUrls, uploadFileToS3 } from "@/features/listings/api/uploadApi";

const MIN_PHOTOS = 1;
const MAX_PHOTOS = 10;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

type UploadState = "idle" | "uploading" | "done" | "error";

interface PhotoItem {
  url: string;
  name: string;
  uploadState: UploadState;
}

export default function StepPhotos() {
  const router = useRouter();
  const { formData, updateFormData, nextStep } = useListingStore();
  const [photos, setPhotos] = useState<PhotoItem[]>(
    formData.photos.map((url) => ({ url, name: url.split("/").pop() ?? "ảnh", uploadState: "done" as UploadState }))
  );
  const [dragOver, setDragOver] = useState(false);
  const [globalError, setGlobalError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isUploading = photos.some((p) => p.uploadState === "uploading");
  const donePhotos = photos.filter((p) => p.uploadState === "done");
  const canProceed = donePhotos.length >= MIN_PHOTOS && !isUploading;

  const processFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      setGlobalError("");

      const filtered = fileArray.filter((f) => {
        if (!ACCEPTED_TYPES.includes(f.type)) {
          setGlobalError("Chỉ chấp nhận ảnh JPG, PNG, WebP, hoặc GIF.");
          return false;
        }
        if (f.size > MAX_FILE_SIZE) {
          setGlobalError("Mỗi ảnh tối đa 10MB.");
          return false;
        }
        return true;
      });

      const remaining = MAX_PHOTOS - photos.filter((p) => p.uploadState === "done").length;
      const toUpload = filtered.slice(0, remaining);

      if (toUpload.length === 0) return;

      // Add placeholder items with "uploading" state
      const placeholders: PhotoItem[] = toUpload.map((f) => ({
        url: URL.createObjectURL(f),
        name: f.name,
        uploadState: "uploading",
      }));
      setPhotos((prev) => [...prev, ...placeholders]);

      // Request presigned URLs for all files at once
      let presignedResults;
      try {
        presignedResults = await getPresignedUrls(
          toUpload.map((f) => ({ fileName: f.name, fileType: f.type })),
          "listings"
        );
      } catch {
        setPhotos((prev) =>
          prev.map((p) =>
            placeholders.some((pl) => pl.url === p.url)
              ? { ...p, uploadState: "error" }
              : p
          )
        );
        setGlobalError("Không thể kết nối tới server. Vui lòng thử lại.");
        return;
      }

      // Upload each file to S3 and update state per file
      await Promise.all(
        toUpload.map(async (file, i) => {
          const placeholder = placeholders[i];
          const { presignedUrl, publicUrl } = presignedResults[i];

          try {
            await uploadFileToS3(presignedUrl, file);
            // Replace placeholder url with final S3 public url
            setPhotos((prev) =>
              prev.map((p) =>
                p.url === placeholder.url
                  ? { url: publicUrl, name: file.name, uploadState: "done" }
                  : p
              )
            );
          } catch {
            setPhotos((prev) =>
              prev.map((p) =>
                p.url === placeholder.url
                  ? { ...p, uploadState: "error" }
                  : p
              )
            );
          }
        })
      );
    },
    [photos]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) processFiles(e.target.files);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.length) processFiles(e.dataTransfer.files);
  };

  const removePhoto = (url: string) => {
    setPhotos((prev) => prev.filter((p) => p.url !== url));
  };

  const handleNext = () => {
    updateFormData({ photos: donePhotos.map((p) => p.url) });
    nextStep();
    router.push("/host/listings/new?step=7");
  };

  return (
    <StepWrapper onNext={handleNext} nextDisabled={!canProceed}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        <div>
          <p className="text-sm font-semibold text-orange-500 uppercase tracking-widest mb-2">
            Bước 6
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            Thêm ảnh chỗ ở của bạn
          </h1>
          <p className="text-slate-500 text-lg">
            Tải lên ít nhất 1 ảnh. Tối đa {MAX_PHOTOS} ảnh, mỗi ảnh tối đa 10MB.
          </p>
        </div>

        {/* Upload zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`
            relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer
            transition-all duration-200 select-none
            ${dragOver
              ? "border-orange-500 bg-orange-50"
              : "border-slate-200 hover:border-orange-400 hover:bg-orange-50/50"
            }
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={ACCEPTED_TYPES.join(",")}
            onChange={handleFileChange}
            className="hidden"
          />
          <Upload className="mx-auto h-10 w-10 text-orange-400 mb-3" />
          <p className="font-semibold text-slate-700">
            Kéo & thả ảnh vào đây, hoặc nhấn để chọn file
          </p>
          <p className="text-sm text-slate-400 mt-1">
            JPG, PNG, WebP, GIF · Tối đa 10MB / ảnh
          </p>
        </div>

        {globalError && (
          <p className="flex items-center gap-1.5 text-sm text-red-500">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {globalError}
          </p>
        )}

        {/* Photo count progress */}
        {photos.length > 0 && (
          <div className="flex items-center gap-2">
            <div className="h-2 flex-1 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((donePhotos.length / 5) * 100, 100)}%` }}
              />
            </div>
            <span className="text-sm font-medium text-slate-500 tabular-nums">
              {donePhotos.length} / 5+ ảnh
            </span>
          </div>
        )}

        {/* Photo grid */}
        {photos.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <AnimatePresence>
              {photos.map((photo, index) => (
                <motion.div
                  key={photo.url}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="relative group aspect-[4/3] rounded-xl overflow-hidden bg-slate-100"
                >
                  <Image
                    src={photo.url}
                    alt={`Ảnh ${index + 1}`}
                    fill
                    unoptimized={photo.uploadState !== "done"}
                    className={`object-cover transition-opacity duration-300 ${
                      photo.uploadState === "uploading" ? "opacity-50" : "opacity-100"
                    }`}
                  />

                  {/* Upload overlay */}
                  {photo.uploadState === "uploading" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <Loader2 className="h-6 w-6 text-white animate-spin" />
                    </div>
                  )}

                  {/* Error overlay */}
                  {photo.uploadState === "error" && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-50/90 gap-1">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                      <span className="text-xs text-red-600 font-medium">Lỗi upload</span>
                    </div>
                  )}

                  {/* Cover badge */}
                  {index === 0 && photo.uploadState === "done" && (
                    <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      Ảnh bìa
                    </span>
                  )}

                  {/* Remove button */}
                  {photo.uploadState !== "uploading" && (
                    <button
                      onClick={(e) => { e.stopPropagation(); removePhoto(photo.url); }}
                      className="absolute top-2 right-2 w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-50"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-red-500" />
                    </button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Add more button */}
            {donePhotos.length < MAX_PHOTOS && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="aspect-[4/3] rounded-xl border-2 border-dashed border-slate-200 hover:border-orange-400 hover:bg-orange-50/50 flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-orange-500 transition-all duration-200"
              >
                <ImagePlus className="h-6 w-6" />
                <span className="text-xs font-medium">Thêm ảnh</span>
              </button>
            )}
          </div>
        )}
      </motion.div>
    </StepWrapper>
  );
}

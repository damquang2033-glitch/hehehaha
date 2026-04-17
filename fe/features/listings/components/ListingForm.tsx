"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { Listing } from "@/types/listing";

const listingSchema = z.object({
  title: z.string().min(5, "Tiêu đề tối thiểu 5 ký tự"),
  description: z.string().min(20, "Mô tả tối thiểu 20 ký tự"),
  price: z.string().refine((v) => !isNaN(Number(v)) && Number(v) > 0, "Giá phải lớn hơn 0"),
  location: z.string().min(3, "Địa điểm tối thiểu 3 ký tự"),
  imagesRaw: z.string().optional(),
  maxGuests: z.string().optional(),
  bedrooms: z.string().optional(),
  bathrooms: z.string().optional(),
});

type ListingFormValues = z.infer<typeof listingSchema>;

export interface ListingFormData {
  title: string;
  description: string;
  price: number;
  location: string;
  images: string[];
  maxGuests?: number;
  bedrooms?: number;
  bathrooms?: number;
}

interface ListingFormProps {
  defaultValues?: Listing;
  onSubmit: (data: ListingFormData) => void;
  isLoading: boolean;
  submitLabel: string;
}

const toOptionalInt = (v?: string): number | undefined => {
  if (!v || v.trim() === "") return undefined;
  const n = parseInt(v, 10);
  return isNaN(n) ? undefined : n;
};

export function ListingForm({ defaultValues, onSubmit, isLoading, submitLabel }: ListingFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ListingFormValues>({
    resolver: zodResolver(listingSchema),
    defaultValues: defaultValues
      ? {
          title: defaultValues.title,
          description: defaultValues.description,
          price: String(Number(defaultValues.price)),
          location: defaultValues.location,
          imagesRaw: defaultValues.images.join("\n"),
          maxGuests: defaultValues.maxGuests != null ? String(defaultValues.maxGuests) : "",
          bedrooms: defaultValues.bedrooms != null ? String(defaultValues.bedrooms) : "",
          bathrooms: defaultValues.bathrooms != null ? String(defaultValues.bathrooms) : "",
        }
      : undefined,
  });

  const handleFormSubmit = (values: ListingFormValues) => {
    const images = values.imagesRaw
      ? values.imagesRaw.split("\n").map((url) => url.trim()).filter(Boolean)
      : [];

    onSubmit({
      title: values.title,
      description: values.description,
      price: Number(values.price),
      location: values.location,
      images,
      maxGuests: toOptionalInt(values.maxGuests),
      bedrooms: toOptionalInt(values.bedrooms),
      bathrooms: toOptionalInt(values.bathrooms),
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Tiêu đề *</Label>
        <Input id="title" placeholder="VD: Căn hộ view biển tại Đà Nẵng" {...register("title")} />
        {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Địa điểm *</Label>
        <Input id="location" placeholder="VD: Đà Nẵng, Việt Nam" {...register("location")} />
        {errors.location && <p className="text-sm text-red-500">{errors.location.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">Giá / đêm (VNĐ) *</Label>
        <Input id="price" type="number" min={0} placeholder="VD: 500000" {...register("price")} />
        {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Mô tả *</Label>
        <Textarea
          id="description"
          rows={5}
          placeholder="Mô tả chi tiết về chỗ ở của bạn..."
          {...register("description")}
        />
        {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="maxGuests">Số khách tối đa</Label>
          <Input id="maxGuests" type="number" min={1} placeholder="VD: 4" {...register("maxGuests")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bedrooms">Phòng ngủ</Label>
          <Input id="bedrooms" type="number" min={0} placeholder="VD: 2" {...register("bedrooms")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bathrooms">Phòng tắm</Label>
          <Input id="bathrooms" type="number" min={0} placeholder="VD: 1" {...register("bathrooms")} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="imagesRaw">URLs ảnh (mỗi URL một dòng)</Label>
        <Textarea
          id="imagesRaw"
          rows={3}
          placeholder={"https://example.com/image1.jpg\nhttps://example.com/image2.jpg"}
          {...register("imagesRaw")}
        />
        <p className="text-xs text-slate-500">Dán URL ảnh, mỗi URL một dòng</p>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold rounded-xl h-11"
      >
        {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
        {submitLabel}
      </Button>
    </form>
  );
}

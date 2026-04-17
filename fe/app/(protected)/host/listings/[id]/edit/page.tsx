"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft, Pencil, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ListingForm, ListingFormData } from "@/features/listings/components/ListingForm";
import { useUpdateListing, useDeleteListing } from "@/features/listings/hooks/useListingMutations";
import { useListing } from "@/features/listings/hooks/useListings";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditListingPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();

  const { data: listing, isLoading, isError } = useListing(id);
  const { mutate: updateListing, isPending: isUpdating } = useUpdateListing(id);
  const { mutate: deleteListing, isPending: isDeleting } = useDeleteListing();

  const handleSubmit = (data: ListingFormData) => {
    updateListing(data, {
      onSuccess: () => {
        toast.success("Cập nhật thành công!");
        router.push(`/listings/${id}`);
      },
      onError: () => {
        toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
      },
    });
  };

  const handleDelete = () => {
    if (!confirm("Bạn có chắc muốn xóa chỗ ở này?")) return;
    deleteListing(id, {
      onSuccess: () => {
        toast.success("Đã xóa chỗ ở.");
        router.push("/rooms");
      },
      onError: () => {
        toast.error("Xóa thất bại. Vui lòng thử lại.");
      },
    });
  };

  if (isLoading) return <EditListingSkeleton />;

  if (isError || !listing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-slate-500">Không tìm thấy chỗ ở này.</p>
        <Link href="/rooms">
          <Button variant="outline">Quay lại danh sách</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Link
          href={`/listings/${id}`}
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-orange-600 transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại chi tiết
        </Link>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/10 to-amber-500/10 flex items-center justify-center">
                <Pencil className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Chỉnh sửa chỗ ở</h1>
                <p className="text-sm text-slate-500 mt-0.5 line-clamp-1">{listing.title}</p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-red-900 dark:hover:bg-red-900/20"
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              <span className="ml-1.5 hidden sm:inline">Xóa</span>
            </Button>
          </div>

          <ListingForm
            defaultValues={listing}
            onSubmit={handleSubmit}
            isLoading={isUpdating}
            submitLabel="Lưu thay đổi"
          />
        </div>
      </div>
    </div>
  );
}

function EditListingSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Skeleton className="h-4 w-32 mb-6" />
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-8 space-y-6">
          <Skeleton className="h-10 w-1/2" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
          <Skeleton className="h-11 w-full" />
        </div>
      </div>
    </div>
  );
}

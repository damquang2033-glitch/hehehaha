"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft, PlusCircle } from "lucide-react";
import { ListingForm, ListingFormData } from "@/features/listings/components/ListingForm";
import { useCreateListing } from "@/features/listings/hooks/useListingMutations";

export default function NewListingPage() {
  const router = useRouter();
  const { mutate: createListing, isPending } = useCreateListing();

  const handleSubmit = (data: ListingFormData) => {
    createListing(data, {
      onSuccess: (listing) => {
        toast.success("Đăng chỗ ở thành công!");
        router.push(`/listings/${listing!.id}`);
      },
      onError: () => {
        toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
      },
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Link
          href="/profile"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-orange-600 transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </Link>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/10 to-amber-500/10 flex items-center justify-center">
              <PlusCircle className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Đăng chỗ ở mới</h1>
              <p className="text-sm text-slate-500 mt-0.5">Điền thông tin để bắt đầu cho thuê</p>
            </div>
          </div>

          <ListingForm
            onSubmit={handleSubmit}
            isLoading={isPending}
            submitLabel="Đăng chỗ ở"
          />
        </div>
      </div>
    </div>
  );
}

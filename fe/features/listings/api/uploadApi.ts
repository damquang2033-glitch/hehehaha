import { apiClient } from "@/lib/apiClient";

interface PresignedUrlResult {
  presignedUrl: string;
  key: string;
  publicUrl: string;
}

export async function getPresignedUrls(
  files: { fileName: string; fileType: string }[],
  folder = "listings"
): Promise<PresignedUrlResult[]> {
  const { data } = await apiClient.post<{ data: PresignedUrlResult[] }>(
    "/upload/presigned-urls",
    { files, folder }
  );
  return data.data;
}

export async function uploadFileToS3(
  presignedUrl: string,
  file: File
): Promise<void> {
  await fetch(presignedUrl, {
    method: "PUT",
    body: file,
    headers: { "Content-Type": file.type },
  });
}

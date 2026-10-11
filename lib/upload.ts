import "server-only";

import { randomUUID } from "node:crypto";
import path from "node:path";
import { createSupabaseAdminClient } from "@/lib/supabase";
import { requireAdmin } from "@/lib/admin-auth";

export type UploadBucket = "media" | "posters" | "videos";
export type UploadCategory = "image" | "video" | "subtitle";

export interface UploadResult {
  bucket: UploadBucket;
  path: string;
  filename: string;
  contentType: string;
  sizeBytes: number;
  url: string | null;
  signedUrl?: string;
}

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const MAX_VIDEO_BYTES = 500 * 1024 * 1024;
const MAX_SUBTITLE_BYTES = 5 * 1024 * 1024;

const MIME_EXTENSIONS: Record<string, string[]> = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
  "image/avif": [".avif"],
  "image/gif": [".gif"],
  "video/mp4": [".mp4"],
  "video/x-matroska": [".mkv"],
  "application/x-subrip": [".srt"],
  "text/plain": [".srt"],
  "text/vtt": [".vtt"],
  "application/octet-stream": [".mkv", ".mp4", ".srt", ".vtt"]
};

function sanitizeFilename(filename: string): string {
  const basename = path.basename(filename).normalize("NFKC");
  const safe = basename
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^[.-]+|[.-]+$/g, "")
    .slice(0, 150);

  return safe || "upload.bin";
}

function inferCategory(contentType: string, filename: string): UploadCategory {
  const extension = path.extname(filename).toLowerCase();
  if (contentType.startsWith("image/")) {
    return "image";
  }
  if (contentType.startsWith("video/") || [".mp4", ".mkv"].includes(extension)) {
    return "video";
  }
  if (
    contentType === "text/vtt" ||
    contentType === "application/x-subrip" ||
    [".srt", ".vtt"].includes(extension)
  ) {
    return "subtitle";
  }
  throw new Error("Unsupported upload type. Allowed: images, MP4/MKV video, SRT/VTT subtitles.");
}

function validateUpload(file: File, category: UploadCategory): void {
  if (file.size <= 0) {
    throw new Error("The selected file is empty.");
  }

  const extension = path.extname(file.name).toLowerCase();
  const allowedExtensions = MIME_EXTENSIONS[file.type] ?? [];
  const extensionAllowed =
    allowedExtensions.includes(extension) ||
    (file.type === "application/octet-stream" &&
      [".mp4", ".mkv", ".srt", ".vtt"].includes(extension));

  if (!extensionAllowed) {
    throw new Error("File extension and MIME type do not match an allowed upload format.");
  }

  if (category === "image" && file.size > MAX_IMAGE_BYTES) {
    throw new Error("Images must be 10 MB or smaller.");
  }
  if (category === "video" && file.size > MAX_VIDEO_BYTES) {
    throw new Error("Videos must be 500 MB or smaller.");
  }
  if (category === "subtitle" && file.size > MAX_SUBTITLE_BYTES) {
    throw new Error("Subtitle files must be 5 MB or smaller.");
  }
}

function bucketForCategory(category: UploadCategory): UploadBucket {
  if (category === "image") {
    return "media";
  }
  if (category === "video") {
    return "videos";
  }
  return "media";
}

function normalizedContentType(file: File, category: UploadCategory): string {
  if (file.type && file.type !== "application/octet-stream") {
    return file.type;
  }
  const extension = path.extname(file.name).toLowerCase();
  if (extension === ".mkv") {
    return "video/x-matroska";
  }
  if (extension === ".mp4") {
    return "video/mp4";
  }
  if (extension === ".srt") {
    return "application/x-subrip";
  }
  if (extension === ".vtt") {
    return "text/vtt";
  }
  return category === "image" ? "image/jpeg" : "application/octet-stream";
}

export async function uploadAdminFile(file: File): Promise<UploadResult> {
  const admin = await requireAdmin();
  const category = inferCategory(file.type, file.name);
  validateUpload(file, category);

  const supabase = createSupabaseAdminClient();
  const bucket = bucketForCategory(category);
  const filename = sanitizeFilename(file.name);
  const storagePath = `${admin.id}/${new Date().toISOString().slice(0, 10)}/${randomUUID()}-${filename}`;
  const contentType = normalizedContentType(file, category);

  try {
    const bytes = new Uint8Array(await file.arrayBuffer());
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(storagePath, bytes, {
        contentType,
        cacheControl: "3600",
        upsert: false
      });

    if (uploadError) {
      throw new Error(uploadError.message);
    }

    let url: string | null = null;
    let signedUrl: string | undefined;

    if (bucket === "videos") {
      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(storagePath, 60 * 15);
      if (error) {
        throw new Error(error.message);
      }
      signedUrl = data.signedUrl;
    } else {
      const { data } = supabase.storage.from(bucket).getPublicUrl(storagePath);
      url = data.publicUrl;
    }

    const { error: metadataError } = await supabase.from("uploads").insert({
      filename,
      storage_path: storagePath,
      bucket,
      content_type: contentType,
      size_bytes: file.size,
      url,
      uploaded_by: admin.id
    });

    if (metadataError) {
      await supabase.storage.from(bucket).remove([storagePath]).catch(() => undefined);
      throw new Error(metadataError.message);
    }

    return {
      bucket,
      path: storagePath,
      filename,
      contentType,
      sizeBytes: file.size,
      url,
      ...(signedUrl ? { signedUrl } : {})
    };
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? `Upload failed: ${error.message}` : "Upload failed unexpectedly."
    );
  }
}

export async function deleteAdminUpload(bucket: UploadBucket, storagePath: string): Promise<void> {
  await requireAdmin();

  if (!["media", "posters", "videos"].includes(bucket)) {
    throw new Error("Invalid storage bucket.");
  }
  if (
    !storagePath ||
    storagePath.startsWith("/") ||
    storagePath.split("/").some((part) => part === "..") ||
    storagePath.length > 500
  ) {
    throw new Error("Invalid storage path.");
  }

  try {
    const supabase = createSupabaseAdminClient();
    const { error: storageError } = await supabase.storage.from(bucket).remove([storagePath]);
    if (storageError) {
      throw new Error(storageError.message);
    }

    const { error: metadataError } = await supabase
      .from("uploads")
      .delete()
      .eq("bucket", bucket)
      .eq("storage_path", storagePath);

    if (metadataError) {
      throw new Error(metadataError.message);
    }
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? `Unable to delete upload: ${error.message}` : "Unable to delete upload."
    );
  }
}

export async function createExternalImageUploadUrl(inputUrl: string): Promise<string> {
  await requireAdmin();

  let parsed: URL;
  try {
    parsed = new URL(inputUrl);
  } catch {
    throw new Error("Enter a valid image URL.");
  }

  if (parsed.protocol !== "https:") {
    throw new Error("External image URLs must use HTTPS.");
  }
  if (["localhost", "127.0.0.1", "::1"].includes(parsed.hostname.toLowerCase())) {
    throw new Error("Local network URLs are not allowed.");
  }

  return parsed.toString();
}

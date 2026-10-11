"use client";
import { X } from "lucide-react";
export default function TrailerModal({
  trailerKey,
  onClose,
}: {
  trailerKey: string;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute top-4 right-4"
      >
        <X />
      </button>
      <div
        className="w-full max-w-4xl aspect-video"
        onClick={(e) => e.stopPropagation()}
      >
        <iframe
          src={"https://www.youtube.com/embed/" + trailerKey + "?autoplay=1"}
          className="w-full h-full rounded-xl"
          allowFullScreen
          title="Trailer"
        />
      </div>
    </div>
  );
}

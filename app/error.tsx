"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    // router.replace("/");
  }, [error]);

  return (
    <div className="min-h-[40vh] flex justify-center items-center gap-3 flex-col">
      <h2 className="text-2xl font-medium">Something went wrong!</h2>
      <button
        className="bg-primary text-white px-4 py-1 rounded-md"
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </button>
    </div>
  );
}

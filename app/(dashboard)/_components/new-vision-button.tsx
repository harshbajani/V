"use client";

import { api } from "@/convex/_generated/api";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface NewVisionButtonProps {
  orgId: string;
  disabled?: boolean;
}

export const NewVisionButton = ({ orgId, disabled }: NewVisionButtonProps) => {
  const router = useRouter();
  const { mutate, pending } = useApiMutation(api.vision.create);
  const onClick = () => {
    mutate({
      orgId,
      title: "Untitled",
    })
      .then((id) => {
        toast.success("Vision created successfully");
        router.push(`/vision/${id}`);
      })
      .catch(() => toast.error("Vision creation failed"));
  };
  return (
    <button
      disabled={pending || disabled}
      onClick={onClick}
      className={cn(
        "col-span-1 aspect-[100/127] bg-blue-600 rounded-lg hover:bg-blue-800 flex flex-col items-center justify-center py-6",
        (pending || disabled) && "opacity-75 hover:bg-blue-600 cursor-not-allowed"
      )}
    >
      <div />
      <Plus className="h-12 w-1/2 text-white stroke-1" />
      <p className="text-xs text-white font-light">New Vision</p>
    </button>
  );
};

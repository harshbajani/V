"use client";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { useOrganization } from "@clerk/nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const EmptyVision = () => {
  const router = useRouter();
  const { mutate, pending } = useApiMutation(api.vision.create);
  const { organization } = useOrganization();
  const onClick = () => {
    if (!organization) return;
    mutate({
      orgId: organization.id,
      title: "Untitled",
    })
      .then((id) => {
        toast.success("Vision created successfully");
        router.push(`/vision/${id}`);
      })
      .catch(() => toast.error("Vision creation failed"));
  };
  return (
    <div className="h-full flex flex-col items-center justify-center">
      <Image src="/note.svg" height={110} width={110} alt="empty" />
      <h2 className="text-3xl font-semibold mt-6">Create your first vision</h2>
      <p className="text-muted-foreground text-sm mt-2">
        Start by creating a new vision for your organization
      </p>
      <div className="mt-6">
        <Button size="lg" disabled={pending} onClick={onClick}>
          Create Vision
        </Button>
      </div>
    </div>
  );
};

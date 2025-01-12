import Image from "next/image";

export const EmptyFavorites = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center">
      <Image src="/empty-favorites.svg" height={140} width={140} alt="empty" />
      <h2 className="text-3xl font-semibold mt-6">No favorite visions</h2>
      <p className="text-muted-foreground text-sm mt-2">
        Try favoriting a vision
      </p>
    </div>
  );
};

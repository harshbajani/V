"use client";

import { useQuery } from "convex/react";
import { EmptyFavorites } from "./empty-favorites";
import { EmptySearch } from "./empty-search";
import { EmptyVision } from "./empty-vision";
import { api } from "@/convex/_generated/api";
import { VisionCard } from "./vision-card";
import { NewVisionButton } from "./new-vision-button";

interface VisionListProps {
  orgId: string;
  query: {
    search?: string;
    favorites?: string;
  };
}
export const VisionList = ({ orgId, query }: VisionListProps) => {
  const data = useQuery(api.visions.get, { orgId, ...query });

  if (data === undefined) {
    return (
      <div>
        <h2 className="text-3xl">
          {query.favorites ? "Favorite Visions" : "Team Visions"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 mt-8 pb-10">
          <NewVisionButton orgId={orgId} disabled />
          <VisionCard.Skeleton />
          <VisionCard.Skeleton />
          <VisionCard.Skeleton />
          <VisionCard.Skeleton />

        </div>
      </div>
    );
  }

  if (!data?.length && query.search) {
    return <EmptySearch />;
  }
  if (!data?.length && query.favorites) {
    return <EmptyFavorites />;
  }

  if (!data?.length) {
    return <EmptyVision />;
  }
  return (
    <div>
      <h2 className="text-3xl">
        {query.favorites ? "Favorite Visions" : "Team Visions"}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 mt-8 pb-10">
        <NewVisionButton orgId={orgId} />
        {data?.map((vision) => (
          <VisionCard
            key={vision._id}
            id={vision._id}
            title={vision.title}
            imageUrl={vision.imageUrl}
            authorId={vision.authorId}
            authorName={vision.authorName}
            createdAt={vision._creationTime}
            orgId={vision.orgId}
            isFavorite={vision.isFavorite}
          />
        ))}
      </div>
    </div>
  );
};

"use client";

import * as React from "react";

import { onUpdatePosition } from "@/actions/updatePosition";
import { Ratings } from "./ui/rating";

interface ExcitementRatingsProps {
  rating: number;
  id: number;
}

export const ExcitementRatings = ({ rating, id }: ExcitementRatingsProps) => {
  return (
    <Ratings
      onRatingChange={(ratingValue) =>
        onUpdatePosition(id, { excitement: ratingValue })
      }
      rating={rating}
      variant="yellow"
      totalStars={5}
    />
  );
};

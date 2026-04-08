"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import FavoriteMatchCard from "@/components/match/FavoriteMatchCard";
import toast from "react-hot-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function Favorites() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/favorites")
      .then(setFavorites)
      .catch(() => toast.error("Failed to load favorites"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-6 space-y-4 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-foreground tracking-tight">Your Favorites</h1>
        <div className="flex flex-col gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-44 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
       <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-foreground tracking-tight">Your Favorites</h1>
      </div>
      <div className="flex flex-col gap-6">
        {favorites.map((m) => (
          <FavoriteMatchCard key={m.match_id} match={m} />
        ))}
      </div>
      {favorites.length === 0 && (
        <div className="text-center py-20 text-muted-foreground border-2 border-dashed rounded-2xl">
          <p className="text-lg">You have no favorite matches yet.</p>
        </div>
      )}
    </div>
  );
}

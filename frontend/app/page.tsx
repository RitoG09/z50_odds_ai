"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import MatchCard from "@/components/match/MatchCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [matches, setMatches] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    Promise.all([
      apiFetch("/matches"),
      apiFetch("/favorites").catch(() => []) // Default to empty if error
    ])
      .then(([matchesData, favData]) => {
        setMatches(matchesData);
        setFavorites(favData);
      })
      .catch((err) => {
        if (err.message.toLowerCase().includes("unauthorized") || err.message.toLowerCase().includes("missing token")) {
          localStorage.removeItem("token");
          router.push("/login");
        }
      })
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <h1 className="text-3xl font-bold mb-6 text-foreground tracking-tight">Today's Matches</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-48 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-foreground tracking-tight">Today's Matches</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {matches.map((m) => {
          const isFav = favorites.some((f: any) => f.matchId === m.match_id);
          return <MatchCard key={m.match_id} match={m} isFavorite={isFav} />;
        })}
      </div>
      {matches.length === 0 && (
        <div className="text-center py-20 text-muted-foreground border-2 border-dashed rounded-2xl">
          <p className="text-lg">No matches available right now.</p>
        </div>
      )}
    </div>
  );
}


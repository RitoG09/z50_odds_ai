"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import MatchCard from "@/components/match/MatchCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Home() {
  const router = useRouter();
  const [matches, setMatches] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [username, setUsername] = useState<string>("");
  const limit = 6;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/register");
      return;
    }

    try {
      const payloadBase64 = token.split('.')[1];
      const decodedJson = atob(payloadBase64);
      const decoded = JSON.parse(decodedJson);
      if (decoded.email) {
        setUsername(decoded.email.split('@')[0]);
      }
    } catch (e) {
      console.error("Failed to decode token for username", e);
    }

    setLoading(true);

    Promise.all([
      apiFetch(`/matches?page=${page}&limit=${limit}`),
      apiFetch("/favorites").catch(() => []) // Default to empty if error
    ])
      .then(([matchesData, favData]) => {
        if (matchesData.pagination) {
          setMatches(matchesData.matches);
          setTotalPages(matchesData.pagination.totalPages);
        } else {
          setMatches(matchesData);
        }
        setFavorites(favData);
      })
      .catch((err) => {
        if (err.message.toLowerCase().includes("unauthorized") || err.message.toLowerCase().includes("missing token")) {
          localStorage.removeItem("token");
          router.push("/register");
        }
      })
      .finally(() => setLoading(false));
  }, [router, page]);

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
      <div className="mb-8">
        {username && <h2 className="text-xl text-muted-foreground mb-2">Welcome back, <span className="font-semibold text-primary">{username}</span>!</h2>}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Today's Matches</h1>
        </div>
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
      
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center items-center space-x-4">
          <Button 
            variant="outline" 
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="text-sm font-medium">
            Page {page} of {totalPages}
          </span>
          <Button 
            variant="outline" 
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

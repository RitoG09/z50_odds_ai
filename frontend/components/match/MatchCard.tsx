"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import ProbabilityBar from "./ProbabilityBar";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import toast from "react-hot-toast";
import { Star, Clock, Trophy } from "@phosphor-icons/react";

export default function MatchCard({ match, isFavorite }: any) {
  const addFavorite = async () => {
    try {
      await apiFetch("/favorites", {
        method: "POST",
        body: JSON.stringify({ matchId: match.match_id }),
      });
      toast.success("Added to favorites");
      setTimeout(() => window.location.reload(), 1000);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const removeFavorite = async () => {
    try {
      await apiFetch(`/favorites/${match.match_id}`, {
        method: "DELETE",
      });
      toast.success("Removed from favorites");
      setTimeout(() => window.location.reload(), 1000);
    } catch {
      toast.error("Failed to remove");
    }
  };

  const [teamA, teamB] = match.teams?.split(" vs ") || ["Team A", "Team B"];

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-border group overflow-hidden bg-white">
      <CardHeader className="pb-3 bg-red-50/30">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2 text-primary font-medium text-sm">
            <Trophy weight="fill" size={16} />
            <span>{match.league || "Tournament"}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-medium bg-white px-2.5 py-1 rounded-full shadow-sm border">
            <Clock size={14} />
            <span>Upcoming</span>
          </div>
        </div>
        <CardTitle className="mt-3 text-xl font-bold flex flex-col gap-1 text-foreground leading-tight">
          <span>{teamA}</span>
          <span className="text-muted-foreground text-sm font-semibold">vs</span>
          <span>{teamB}</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-5 space-y-4">
        <div className="grid grid-cols-3 gap-2 bg-secondary/40 p-2 rounded-xl text-center border shadow-inner">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider block mb-0.5">1</span>
            <span className="font-bold text-[15px]">{match.odds?.teamA?.toFixed(2) || "-"}</span>
          </div>
          <div className="flex flex-col border-x">
            <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider block mb-0.5">X</span>
            <span className="font-bold text-[15px]">{match.odds?.draw?.toFixed(2) || "-"}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider block mb-0.5">2</span>
            <span className="font-bold text-[15px]">{match.odds?.teamB?.toFixed(2) || "-"}</span>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest text-center">Win Probability</p>
          <ProbabilityBar label={teamA} value={match.probabilities.teamA} />
          <ProbabilityBar label="Draw" value={match.probabilities.draw} />
          <ProbabilityBar label={teamB} value={match.probabilities.teamB} />
        </div>
      </CardContent>

      <CardFooter className="pt-2 pb-5 px-6">
        <Button 
          variant={isFavorite ? "secondary" : "default"}
          onClick={isFavorite ? removeFavorite : addFavorite}
          className="w-full gap-2 font-semibold shadow-sm transition-transform active:scale-[0.98]"
        >
          <Star weight={isFavorite ? "fill" : "bold"} className={isFavorite ? "text-primary" : ""} />
          {isFavorite ? "Saved to Favorites" : "Add to Favorites"}
        </Button>
      </CardFooter>
    </Card>
  );
}

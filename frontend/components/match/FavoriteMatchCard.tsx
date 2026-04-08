"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import toast from "react-hot-toast";
import { Star, Clock, Trophy, Strategy } from "@phosphor-icons/react";

export default function FavoriteMatchCard({ match }: any) {
  const removeFavorite = async () => {
    try {
      await apiFetch(`/favorites/${match.match_id}`, {
        method: "DELETE",
      });
      toast.success("Removed from favorites");
      setTimeout(() => window.location.reload(), 500);
    } catch {
      toast.error("Failed to remove");
    }
  };

  const [teamA, teamB] = match.teams?.split(" vs ") || ["Team A", "Team B"];

  return (
    <Card className="hover:shadow-md transition-all duration-300 border-border group overflow-hidden bg-white">
      <CardContent className="p-0 flex flex-col md:flex-row relative">
        {/* Left Side: Match Details */}
        <div className="flex-1 p-5 md:p-6 bg-red-50/20 md:border-r border-border flex flex-col justify-center relative">
           {/* Absolute badge */}
           <div className="absolute top-4 left-5 flex items-center gap-1.5 text-primary text-xs font-bold uppercase tracking-wider">
             <Star weight="fill" size={14} />
             <span>Tracked Match</span>
           </div>

          <div className="mt-8">
            <div className="flex items-center gap-2 text-muted-foreground font-medium text-sm mb-2">
              <Trophy weight="regular" size={16} />
              <span>{match.league || "Tournament"}</span>
              <span className="mx-1">•</span>
              <Clock size={16} />
              <span>Upcoming</span>
            </div>
            <div className="text-2xl font-bold flex flex-col md:flex-row md:items-center gap-1 md:gap-3 text-foreground leading-tight">
              <span>{teamA}</span>
              <span className="text-muted-foreground text-sm font-semibold hidden md:inline">vs</span>
              <span>{teamB}</span>
            </div>
          </div>
        </div>

        {/* Right Side: Odds and Controls */}
        <div className="flex-[0.8] p-5 md:p-6 bg-white flex flex-col justify-center space-y-5">
           
          {/* Odds Boxes */}
          <div>
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-2">
               <Strategy size={16} /> Current Market Odds
            </h4>
            <div className="flex gap-2">
              <div className="flex-1 flex justify-between items-center bg-secondary/30 p-2.5 rounded-lg border">
                <span className="text-xs text-muted-foreground font-semibold">1</span>
                <span className="font-bold text-base text-primary">{match.odds?.teamA?.toFixed(2) || "-"}</span>
              </div>
              <div className="flex-1 flex justify-between items-center bg-secondary/30 p-2.5 rounded-lg border">
                <span className="text-xs text-muted-foreground font-semibold">X</span>
                <span className="font-bold text-base">{match.odds?.draw?.toFixed(2) || "-"}</span>
              </div>
              <div className="flex-1 flex justify-between items-center bg-secondary/30 p-2.5 rounded-lg border">
                <span className="text-xs text-muted-foreground font-semibold">2</span>
                <span className="font-bold text-base text-primary">{match.odds?.teamB?.toFixed(2) || "-"}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
             <Button 
                variant="outline"
                onClick={removeFavorite}
                className="flex-1 gap-2 border-destructive/30 text-destructive hover:bg-destructive hover:text-white"
              >
                <Star weight="fill" />
                Unfavorite
              </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

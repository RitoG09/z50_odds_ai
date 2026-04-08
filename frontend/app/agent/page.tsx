"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { PaperPlaneRight, Robot, User } from "@phosphor-icons/react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AgentPage() {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "agent"; content: string }[]>([]);

  const ask = async () => {
    if (!query.trim()) return;
    
    const userMessage = query;
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setQuery("");
    setLoading(true);

    try {
      const res = await apiFetch("/agent/query", {
        method: "POST",
        body: JSON.stringify({ query: userMessage }),
      });

      setMessages((prev) => [...prev, { role: "agent", content: res.answer }]);
    } catch {
      setMessages((prev) => [...prev, { role: "agent", content: "Sorry, I couldn't process that request right now." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto h-[calc(100vh-6rem)] flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-primary/10 p-3 rounded-xl text-primary">
          <Robot weight="fill" size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Odds AI Agent</h1>
          <p className="text-muted-foreground text-sm">Ask anything about odds, matches, or sports statistics.</p>
        </div>
      </div>

      <Card className="flex-1 flex flex-col shadow-sm border-border">
        <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-4">
              <Robot size={64} className="opacity-20" />
              <p>How can I help you with your bets today?</p>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div key={i} className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`h-10 w-10 shrink-0 rounded-full flex items-center justify-center ${msg.role === "user" ? "bg-primary text-white" : "bg-secondary text-secondary-foreground"}`}>
                  {msg.role === "user" ? <User weight="fill" size={20} /> : <Robot weight="fill" size={20} />}
                </div>
                <div className={`max-w-[80%] rounded-2xl p-4 ${msg.role === "user" ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-secondary/50 text-foreground rounded-tl-sm border"}`}>
                  <p className="leading-relaxed">{msg.content}</p>
                </div>
              </div>
            ))
          )}
          {loading && (
            <div className="flex gap-4">
              <div className="h-10 w-10 shrink-0 rounded-full flex items-center justify-center bg-secondary text-secondary-foreground">
                <Robot weight="fill" size={20} />
              </div>
              <div className="max-w-[80%] bg-secondary/50 rounded-2xl p-4 rounded-tl-sm border space-y-2 w-64">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="p-4 bg-gray-50/50 border-t">
          <form 
            onSubmit={(e) => { e.preventDefault(); ask(); }} 
            className="flex w-full gap-2 items-center"
          >
            <Input 
              value={query} 
              onChange={(e) => setQuery(e.target.value)} 
              placeholder="Ask about a specific match..."
              className="flex-1 bg-white h-12 rounded-xl border-gray-300"
              disabled={loading}
            />
            <Button 
              type="submit" 
              size="icon" 
              className="h-12 w-12 shrink-0 rounded-xl rounded-l-none -ml-3 z-10" 
              disabled={loading || !query.trim()}
            >
              <PaperPlaneRight weight="fill" />
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}

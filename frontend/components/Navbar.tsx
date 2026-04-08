"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Star, ChatTeardrop, SignOut, Trophy } from "@phosphor-icons/react";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    router.push("/login");
  };

  if (!isAuthenticated && pathname === "/login") return null;

  return (
    <nav className="border-b bg-white">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
          <Trophy weight="fill" className="text-primary" size={28} />
          <span>OddsAI</span>
        </Link>
        
        {isAuthenticated && (
          <div className="flex items-center gap-4">
            <Link href="/favorites">
              <Button variant={pathname === "/favorites" ? "default" : "ghost"} size="sm" className="gap-2">
                <Star weight={pathname === "/favorites" ? "fill" : "regular"} />
                Favorites
              </Button>
            </Link>
            <Link href="/agent">
              <Button variant={pathname === "/agent" ? "default" : "ghost"} size="sm" className="gap-2">
                <ChatTeardrop weight={pathname === "/agent" ? "fill" : "regular"} />
                Agent AI
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2 text-destructive border-destructive hover:bg-destructive hover:text-white">
              <SignOut />
              Logout
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}

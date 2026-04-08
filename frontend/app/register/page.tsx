"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Trophy } from "@phosphor-icons/react";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const register = async () => {
    try {
      setLoading(true);
      await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      toast.success("Account created! Please log in.");
      window.location.href = "/login";
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <Card className="w-full max-w-md shadow-xl border-border/50">
        <CardHeader className="text-center pb-6">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-red-50 rounded-full">
              <Trophy weight="fill" className="text-primary text-4xl" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
          <CardDescription>Join OddsAI to get started</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Email</label>
            <Input 
              placeholder="you@example.com" 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              onKeyDown={(e) => e.key === "Enter" && register()}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium leading-none">Password</label>
              <button 
                type="button"
                className="text-xs text-primary hover:underline font-medium"
                onClick={() => { setEmail("tom@gmail.com"); setPassword("123456"); }}
              >
                Use Demo Account
              </button>
            </div>
            <Input 
              type="password" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
              onKeyDown={(e) => e.key === "Enter" && register()}
            />
          </div>
        </CardContent>
        <CardFooter className="pt-2 flex flex-col space-y-2">
          <Button className="w-full font-bold" onClick={register} disabled={loading || !email || !password}>
            {loading ? "Registering..." : "Register"}
          </Button>
          <Button variant="outline" className="w-full" onClick={() => window.location.href = "/login"}>
            Already have an account? Sign In
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

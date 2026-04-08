"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const register = async () => {
    try {
      await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      toast.success("Account created!");
      window.location.href = "/login";
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="p-10 space-y-4 max-w-sm mx-auto">
      <Input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <Input type="password" onChange={(e) => setPassword(e.target.value)} />
      <Button onClick={register}>Register</Button>
    </div>
  );
}

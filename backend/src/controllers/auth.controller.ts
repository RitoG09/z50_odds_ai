import { Request, Response } from "express";
import { registerSchema, loginSchema } from "../schemas/auth.schema";
import { registerUser, loginUser } from "../services/auth.service";

export async function register(req: Request, res: Response) {
  try {
    const data = registerSchema.parse(req.body);

    const user = await registerUser(data.email, data.password);

    res.json({ message: "User created", user });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const data = loginSchema.parse(req.body);

    const token = await loginUser(data.email, data.password);

    res.json({ token });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

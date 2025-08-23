import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../config/db";
import { User } from "../entities/User";

const userRepo = AppDataSource.getRepository(User);

export const register = async ({
  email,
  password,
  role = "user",
}: {
  email: string;
  password: string;
  role?: string;
}) => {
  const existing = await userRepo.findOne({ where: { email } });
  if (existing) throw new Error("User already exists");

  const hashed = await bcrypt.hash(password, 10);
  const user = userRepo.create({ email, password: hashed, role });
  return await userRepo.save(user);
};

export const login = async (email: string, password: string) => {
  const user = await userRepo.findOne({ where: { email } });
  if (!user) throw new Error("Invalid credentials");

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw new Error("Invalid credentials");

  const secret = process.env.JWT_SECRET || "supersecret";
  return jwt.sign({ id: user.id, email: user.email, role: user.role }, secret, {
    expiresIn: "1h",
  });
};

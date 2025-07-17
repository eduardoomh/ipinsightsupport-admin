// app/context/UserContext.tsx
import { createContext, useContext } from "react";

type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user"; // o lo que definas
};

export const UserContext = createContext<User | null>(null);

export function useUser() {
  const user = useContext(UserContext);
  if (!user) throw new Error("useUser must be used within a UserProvider");
  return user;
}
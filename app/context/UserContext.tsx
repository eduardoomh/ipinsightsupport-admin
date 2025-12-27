// app/context/UserContext.tsx
import { createContext, useContext } from "react";
import { UserI } from "~/features/Users/Interfaces/users.interface";

export const UserContext = createContext<UserI | null>(null);

export function useUser() {
  const user = useContext(UserContext);
  if (!user) throw new Error("useUser must be used within a UserProvider");
  return user;
}
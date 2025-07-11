export type UserRole = "film" | "actor" | "admin";

export interface AuthContextType {
    token: string | null;
    role: UserRole | null;
    logout: () => void;
}
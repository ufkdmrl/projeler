export type UserRole = "film" | "actor" | "admin";

export interface JwtPayload {
    exp?: number;
    iat?: number;
    nbf?: number;
    iss?: string;
    aud?: string;
    sub?: string;
    email?: string;
    name?: string;

    // Role claims with specific type
    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: UserRole;
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role"?: UserRole;
    role?: UserRole;

    // For other custom claims
    [key: string]: unknown;
}

export const parseJwt = (token: string): JwtPayload | null => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload) as JwtPayload;
    } catch (error) {
        console.error('JWT parsing error:', error);
        return null;
    }
};

export const isTokenValid = (token: string): boolean => {
    const decoded = parseJwt(token);
    if (!decoded?.exp) return false;

    const now = Date.now() / 1000;
    return decoded.exp > now;
};
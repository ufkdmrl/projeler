import React, { useEffect, useState } from "react";
import {
    BrowserRouter,
    Routes,
    Route,
    Link,
    Navigate,
    useNavigate,
} from "react-router-dom";
import { parseJwt, type JwtPayload, type UserRole } from "./utils/authUtils";

import LoginPage from "./components/LoginPage";
import PopularMovies from "./components/PopularMovies";
import PopularActors from "./components/PopularActors";
import MovieSuggest from "./components/MovieSuggest";
import MovieDetails from "./components/MovieDetails";

const RequireAuth: React.FC<{ children: React.ReactElement }> = ({ children }) => {
    const token = localStorage.getItem("token");
    return token ? children : <Navigate to="/login" replace />;
};

const AppRoutes: React.FC = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState<UserRole | null>(null);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const t = localStorage.getItem("token");
        setToken(t);

        if (t) {
            const decoded = parseJwt(t);
            const userRole = getRoleFromToken(decoded);
            setRole(userRole);

            if (window.location.pathname === "/login") {
                navigate(userRole === "actor" ? "/actors" : "/movies", { replace: true });
            }
        } else {
            setRole(null);
        }
    }, [navigate]);

    const getRoleFromToken = (decoded: JwtPayload | null): UserRole | null => {
        if (!decoded) return null;

        return (
            decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
            decoded["role"] ||
            decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role"] ||
            null
        );
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setRole(null);
        navigate("/login");
    };

    const linkStyle: React.CSSProperties = {
        textDecoration: "none",
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
    };

    const buttonStyle: React.CSSProperties = {
        marginLeft: 20,
        padding: "8px 16px",
        backgroundColor: "#ffffff",
        color: "#0047AB",
        border: "none",
        borderRadius: 5,
        fontWeight: "bold",
        cursor: "pointer",
        fontSize: 14,
    };

    return (
        <>
            {token && role && (
                <nav
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "40px",
                        padding: "15px 0",
                        background: "linear-gradient(to right, #0047AB, #007BFF)",
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        zIndex: 1000,
                        color: "white",
                        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                    }}
                >
                    {(role === "film" || role === "admin") && (
                        <Link to="/movies" style={linkStyle}>
                            Popüler Film Listele
                        </Link>
                    )}
                    {(role === "actor" || role === "admin") && (
                        <Link to="/actors" style={linkStyle}>
                            Popüler Oyuncu Listele
                        </Link>
                    )}
                    <Link to="/suggest" style={linkStyle}>
                        Film Öner
                    </Link>
                    <button onClick={logout} style={buttonStyle}>
                        Çıkış Yap
                    </button>
                </nav>
            )}

            <div style={{ marginTop: token && role ? "70px" : "0" }}>
                <Routes>
                    <Route
                        path="/login"
                        element={
                            token ? (
                                <Navigate to={role === "actor" ? "/actors" : "/movies"} replace />
                            ) : (
                                <LoginPage />
                            )
                        }
                    />

                    {(role === "film" || role === "admin") && (
                        <>
                            <Route
                                path="/movies"
                                element={
                                    <RequireAuth>
                                        <PopularMovies />
                                    </RequireAuth>
                                }
                            />
                            <Route
                                path="/movie/:id"
                                element={
                                    <RequireAuth>
                                        <MovieDetails />
                                    </RequireAuth>
                                }
                            />
                        </>
                    )}

                    {(role === "actor" || role === "admin") && (
                        <Route
                            path="/actors"
                            element={
                                <RequireAuth>
                                    <PopularActors />
                                </RequireAuth>
                            }
                        />
                    )}

                    <Route
                        path="/suggest"
                        element={
                            <RequireAuth>
                                <MovieSuggest />
                            </RequireAuth>
                        }
                    />

                    <Route
                        path="*"
                        element={<Navigate to={token ? (role === "actor" ? "/actors" : "/movies") : "/login"} replace />}
                    />
                </Routes>
            </div>
        </>
    );
};

const App: React.FC = () => (
    <BrowserRouter>
        <AppRoutes />
    </BrowserRouter>
);

export default App;
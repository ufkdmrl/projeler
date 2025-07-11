import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post("https://localhost:7119/api/auth/login", {
                username,
                password,
            });
            const token = response.data.token || response.data.Token;
            localStorage.setItem("token", token);
            navigate("/movies");
        } catch (err) {
            setError("Kullanıcı adı veya şifre yanlış");
            console.error("Login error:", err);
        }
    };

    const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
        try {
            if (!credentialResponse.credential) {
                throw new Error("No credential received");
            }

            const response = await axios.post("https://localhost:7119/api/auth/google-token", {
                tokenId: credentialResponse.credential
            });
            const token = response.data.token || response.data.Token;
            localStorage.setItem("token", token);
            navigate("/movies");
        } catch (err) {
            setError("Google ile giriş başarısız");
            console.error("Google login error:", err);
        }
    };

    const handleGoogleFailure = () => {
        setError("Google ile giriş başarısız");
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                width: "100vw",
                margin: 0,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "linear-gradient(135deg, #0047AB, #FFD700)",
            }}
        >
            <form
                onSubmit={handleLogin}
                style={{
                    backgroundColor: "#fff",
                    padding: "30px 40px",
                    borderRadius: "12px",
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "12px",
                    width: "100%",
                    maxWidth: "360px",
                    fontFamily: "'Segoe UI', sans-serif",
                }}
            >
                <h2 style={{ color: "#0047AB", marginBottom: "10px" }}>Giriş Yap</h2>

                <input
                    placeholder="Kullanıcı adı"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                        fontSize: "15px",
                        outlineColor: "#0047AB",
                        boxSizing: "border-box"
                    }}
                />

                <input
                    type="password"
                    placeholder="Şifre"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                        fontSize: "15px",
                        outlineColor: "#0047AB",
                        boxSizing: "border-box"
                    }}
                />

                <button
                    type="submit"
                    style={{
                        width: "100%",
                        backgroundColor: "#0047AB",
                        color: "white",
                        padding: "12px",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontWeight: "bold",
                        fontSize: "16px",
                        transition: "background-color 0.3s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#003080")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#0047AB")}
                >
                    Giriş
                </button>

                <div style={{ margin: '15px 0', width: '100%', textAlign: 'center' }}>
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleFailure}
                        useOneTap
                        size="large"
                        text="continue_with"
                        shape="rectangular"
                        width="300"
                    />
                </div>

                {error && (
                    <p style={{ color: "red", textAlign: "center", marginTop: "6px" }}>
                        {error}
                    </p>
                )}
            </form>
        </div>
    );
};

export default LoginPage;
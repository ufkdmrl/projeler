import React, { useState } from "react";
import api from "../services/api";

interface SuggestionResponse {
    message: string;
}

const MovieSuggest: React.FC = () => {
    const [filmName, setFilmName] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await api.post<SuggestionResponse>("/film/suggest", { filmName });
            setMessage(response.data.message);
            setFilmName("");
        } catch (error) {
            console.error("Film önerisi gönderilemedi:", error);
            setMessage("Film önerisi gönderilemedi.");
        }
    };

    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "linear-gradient(135deg, #0047AB, #FFD700)"
        }}>
            <form
                onSubmit={handleSubmit}
                style={{
                    backgroundColor: "white",
                    padding: 40,
                    borderRadius: 10,
                    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                    width: "90%",
                    maxWidth: 400
                }}
            >
                <h2 style={{ color: "#0047AB", marginBottom: 20, textAlign: "center" }}>Film Öner</h2>
                <input
                    type="text"
                    placeholder="Önerdiğiniz filmi yazın..."
                    value={filmName}
                    onChange={(e) => setFilmName(e.target.value)}
                    style={{
                        width: "100%",
                        padding: 12,
                        borderRadius: 5,
                        border: "1px solid #ccc",
                        marginBottom: 15,
                        fontSize: 16
                    }}
                    required
                />
                <button
                    type="submit"
                    style={{
                        backgroundColor: "#0047AB",
                        color: "white",
                        padding: 12,
                        borderRadius: 5,
                        border: "none",
                        cursor: "pointer",
                        width: "100%",
                        fontSize: 16,
                        fontWeight: "bold"
                    }}
                >
                    Gönder
                </button>
                {message && (
                    <p style={{
                        color: message.includes("başarı") ? "green" : "red",
                        marginTop: 15,
                        textAlign: "center"
                    }}>
                        {message}
                    </p>
                )}
            </form>
        </div>
    );
};

export default MovieSuggest;
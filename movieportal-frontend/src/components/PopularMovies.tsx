import React, { useEffect, useState } from "react";
import api from "../services/api";

interface Movie {
    id: number;
    title: string;
    poster_path: string;
    overview?: string;
    release_date?: string;
}

interface MoviesResponse {
    results: Movie[];
}

const PopularMovies: React.FC = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [ratings, setRatings] = useState<{ [key: number]: number }>({});
    const [notes, setNotes] = useState<{ [key: number]: string }>({});
    const [message, setMessage] = useState("");
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const limit = 20;

    const fetchMovies = async (searchQuery = "", pageNumber = 1) => {
        setLoading(true);
        try {
            const endpoint = searchQuery.trim() === ""
                ? `/film/popular?page=${pageNumber}&limit=${limit}`
                : `/film/search?query=${encodeURIComponent(searchQuery.trim())}&limit=100`;

            const response = await api.get<MoviesResponse>(endpoint);
            const results = response.data.results || [];

            if (searchQuery.trim() === "") {
                setMovies(prev => pageNumber === 1 ? results : [...prev, ...results]);
                setHasMore(results.length === limit);
            } else {
                setMovies(results);
                setHasMore(false);
            }
        } catch (error) {
            console.error("Filmler alınamadı:", error);
            setMessage("Filmler yüklenirken hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMovies("", 1);
    }, []);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        fetchMovies(query, 1);
    };

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchMovies(query, nextPage);
    };

    const handleSubmit = async (movieId: number) => {
        try {
            const rating = ratings[movieId];
            const note = notes[movieId];

            if (!rating || rating < 1 || rating > 10) {
                setMessage("Puan 1 ile 10 arasında olmalı");
                return;
            }

            await api.post(`/film/${movieId}/review`, { rating, note });
            setMessage("Puan ve not başarıyla kaydedildi.");
            setRatings(prev => ({ ...prev, [movieId]: 0 }));
            setNotes(prev => ({ ...prev, [movieId]: "" }));
        } catch (error) {
            console.error("Inceleme gönderilemedi:", error);
            setMessage("Zaten bu filme ait bir incelemeniz var.");
        }
    };

    return (
        <div style={{
            padding: "20px",
            paddingTop: "100px",
            background: "linear-gradient(135deg, #0047AB, #FFD700)",
            minHeight: "100vh",
            boxSizing: "border-box",
            width: "100vw"
        }}>
            <h2 style={{
                textAlign: "center",
                color: "white",
                marginBottom: 30,
                fontWeight: "bold",
                fontSize: 28,
            }}>
                Popüler Filmler
            </h2>

            <form onSubmit={handleSearchSubmit} style={{ textAlign: "center", marginBottom: 30 }}>
                <input
                    type="text"
                    placeholder="Film Adı"
                    value={query}
                    onChange={handleSearchChange}
                    style={{
                        padding: "10px",
                        width: "300px",
                        borderRadius: 6,
                        border: "1px solid #ccc",
                        fontSize: 16,
                    }}
                />
                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        marginLeft: 10,
                        padding: "10px 20px",
                        fontSize: 16,
                        backgroundColor: "#0047AB",
                        color: "white",
                        border: "none",
                        borderRadius: 6,
                        cursor: loading ? "default" : "pointer",
                        fontWeight: "bold",
                    }}
                >
                    {loading ? "Yükleniyor..." : "Ara"}
                </button>
            </form>

            {message && (
                <div style={{
                    textAlign: "center",
                    color: "white",
                    fontWeight: "bold",
                    marginBottom: 20,
                }}>
                    {message}
                </div>
            )}

            <div style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 20,
                justifyContent: "center",
            }}>
                {movies.map(movie => (
                    <div
                        key={movie.id}
                        style={{
                            width: 240,
                            backgroundColor: "white",
                            borderRadius: 10,
                            boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                            overflow: "hidden",
                            paddingBottom: 10,
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        <img
                            src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                            alt={movie.title}
                            style={{ width: "100%", height: 300, objectFit: "cover" }}
                        />
                        <div style={{ padding: "10px" }}>
                            <h4 style={{ fontSize: 16, margin: 0, color: "#0047AB" }}>
                                {movie.title}
                            </h4>
                            {movie.release_date && (
                                <p style={{ fontSize: 14, color: "#666", margin: "5px 0" }}>
                                    {new Date(movie.release_date).getFullYear()}
                                </p>
                            )}

                            <label style={{
                                fontSize: 14,
                                fontWeight: "bold",
                                color: "#333",
                                display: "block",
                                marginTop: 10,
                            }}>
                                Puan:
                            </label>
                            <input
                                type="number"
                                placeholder="1 - 10"
                                min={1}
                                max={10}
                                value={ratings[movie.id] || ""}
                                onChange={(e) => setRatings({
                                    ...ratings,
                                    [movie.id]: parseInt(e.target.value) || 0,
                                })}
                                style={{
                                    width: "100%",
                                    padding: 8,
                                    borderRadius: 4,
                                    border: "1px solid #ccc",
                                    fontSize: 14,
                                }}
                            />

                            <label style={{
                                fontSize: 14,
                                fontWeight: "bold",
                                color: "#333",
                                display: "block",
                                marginTop: 10,
                            }}>
                                Not:
                            </label>
                            <textarea
                                placeholder="Not yazınız..."
                                value={notes[movie.id] || ""}
                                onChange={(e) => setNotes({ ...notes, [movie.id]: e.target.value })}
                                style={{
                                    width: "100%",
                                    padding: 8,
                                    borderRadius: 4,
                                    border: "1px solid #ccc",
                                    fontSize: 14,
                                    minHeight: 60,
                                    resize: "vertical",
                                }}
                            />

                            <button
                                onClick={() => handleSubmit(movie.id)}
                                style={{
                                    marginTop: 12,
                                    backgroundColor: "#0047AB",
                                    color: "white",
                                    fontWeight: "bold",
                                    padding: 10,
                                    border: "none",
                                    borderRadius: 5,
                                    width: "100%",
                                    cursor: "pointer",
                                }}
                            >
                                Gönder
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {hasMore && query.trim() === "" && (
                <div style={{ textAlign: "center", marginTop: 40 }}>
                    <button
                        onClick={handleLoadMore}
                        disabled={loading}
                        style={{
                            padding: "10px 20px",
                            fontSize: 16,
                            backgroundColor: "#0047AB",
                            color: "white",
                            border: "none",
                            borderRadius: 6,
                            cursor: loading ? "default" : "pointer",
                            fontWeight: "bold",
                        }}
                    >
                        {loading ? "Yükleniyor..." : "Daha Fazla Göster"}
                    </button>
                </div>
            )}
        </div>
    );
};

export default PopularMovies;
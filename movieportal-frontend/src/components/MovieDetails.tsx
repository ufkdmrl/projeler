import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

interface Movie {
    id: number;
    title: string;
    poster_path: string;
    overview?: string;
    release_date?: string;
}

interface Review {
    rating: number;
    note: string;
}

interface MovieDetailsResponse {
    film: Movie;
    averageRating: number;
    userReview: Review | null;
}

const MovieDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [movie, setMovie] = useState<Movie | null>(null);
    const [average, setAverage] = useState(0);
    const [userReview, setUserReview] = useState<Review | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            try {
                const response = await api.get<MovieDetailsResponse>(`/film/${id}`);
                setMovie(response.data.film);
                setAverage(response.data.averageRating);
                setUserReview(response.data.userReview);
            } catch (error) {
                console.error("Film detayları alınamadı:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) return <p style={{ textAlign: "center" }}>Yükleniyor...</p>;
    if (!movie) return <p style={{ textAlign: "center" }}>Film bulunamadı.</p>;

    return (
        <div style={{
            padding: 30,
            maxWidth: 800,
            margin: "100px auto",
            fontFamily: "Arial",
            backgroundColor: "white",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
        }}>
            <h2 style={{ textAlign: "center", color: "#0047AB" }}>{movie.title}</h2>
            <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                style={{
                    width: "100%",
                    borderRadius: 10,
                    margin: "20px 0",
                    maxHeight: "500px",
                    objectFit: "contain"
                }}
            />
            {movie.overview && (
                <div style={{ marginBottom: 20 }}>
                    <h3 style={{ color: "#0047AB" }}>Özet</h3>
                    <p>{movie.overview}</p>
                </div>
            )}
            <p><strong>Ortalama Puan:</strong> {average.toFixed(2)}</p>
            {userReview && (
                <div style={{ marginTop: 20 }}>
                    <p><strong>Sizin Puanınız:</strong> {userReview.rating}</p>
                    <p><strong>Sizin Notunuz:</strong> {userReview.note}</p>
                </div>
            )}
        </div>
    );
};

export default MovieDetails;
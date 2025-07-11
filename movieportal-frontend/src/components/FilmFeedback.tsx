import React, { useState } from "react";
import axios from "axios";

interface Props {
  filmId: number;
  token: string | null;
  onFeedbackAdded: () => void;
}

const FilmFeedback: React.FC<Props> = ({ filmId, token, onFeedbackAdded }) => {
  const [puan, setPuan] = useState<number>(1);
  const [not, setNot] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return alert("Giriş yapmalısınız.");

    try {
      await axios.post(
        `https://localhost:7119/api/film/${filmId}/feedback`,
        { puan, not },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      alert("Geri bildirim kaydedildi.");
      setPuan(1);
      setNot("");
      onFeedbackAdded();
    } catch (error) {
      console.error("Hata:", error);
      alert("Hata oluştu.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Puan (1-10):</label>
      <select value={puan} onChange={(e) => setPuan(Number(e.target.value))}>
        {[...Array(10)].map((_, i) => (
          <option key={i + 1} value={i + 1}>
            {i + 1}
          </option>
        ))}
      </select>

      <label>Not:</label>
      <textarea
        value={not}
        onChange={(e) => setNot(e.target.value)}
        rows={3}
        placeholder="Notunuzu yazın"
      />

      <button type="submit">Gönder</button>
    </form>
  );
};

export default FilmFeedback;

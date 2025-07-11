using System.Collections.Generic;
using System.Linq;
using MoviePortal.Server.Models;

namespace MoviePortal.Server.Services
{
    public static class FilmReviewService
    {
        private static List<FilmReview> Reviews = new();

        public static void AddReview(FilmReview review)
        {
            Reviews.Add(review);
        }

        public static IEnumerable<FilmReview> GetReviewsForFilm(int filmId)
        {
            return Reviews.Where(r => r.FilmId == filmId);
        }

        public static FilmReview? GetUserReview(int filmId, string username)
        {
            return Reviews.SingleOrDefault(r => r.FilmId == filmId && r.Username == username);
        }
    }
}

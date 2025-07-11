using System.Net.Http.Headers;
using System.Text.Json;
using Microsoft.Extensions.Configuration;
using MoviePortal.Server.Models;
using System.Security.Claims;
using System.Linq;
using System;
using System.Collections.Generic;

namespace MoviePortal.Server.Services
{
    public class FilmService
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly string _apiKey;

        private static List<FilmReview> _reviews = new List<FilmReview>();

        public FilmService(IHttpClientFactory httpClientFactory, IConfiguration configuration)
        {
            _httpClientFactory = httpClientFactory;
            _apiKey = configuration["TheMovieDb:ApiKey"];
        }

        public async Task<JsonElement> GetPopularMoviesAsync(int page = 1)
        {
            var client = _httpClientFactory.CreateClient();
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var url = $"https://api.themoviedb.org/3/movie/popular?api_key={_apiKey}&language=en-US&page={page}";
            var response = await client.GetAsync(url);
            response.EnsureSuccessStatusCode();

            var jsonString = await response.Content.ReadAsStringAsync();
            var jsonDoc = JsonDocument.Parse(jsonString);

            return jsonDoc.RootElement;
        }

        public async Task<JsonElement> GetMovieByIdAsync(int id)
        {
            var client = _httpClientFactory.CreateClient();
            var url = $"https://api.themoviedb.org/3/movie/{id}?api_key={_apiKey}&language=en-US";

            var response = await client.GetAsync(url);
            if (!response.IsSuccessStatusCode)
                return default;

            var jsonString = await response.Content.ReadAsStringAsync();
            var jsonDoc = JsonDocument.Parse(jsonString);

            return jsonDoc.RootElement;
        }

        public void AddReview(FilmReview review)
        {
            if (review.Rating < 1 || review.Rating > 10)
                throw new ArgumentException("Rating must be between 1 and 10.");

            var existing = _reviews.FirstOrDefault(r => r.FilmId == review.FilmId && r.Username == review.Username);
            if (existing != null)
            {
                existing.Rating = review.Rating;
                existing.Note = review.Note;
            }
            else
            {
                _reviews.Add(review);
            }
        }

        public List<FilmReview> GetReviewsByMovieId(int movieId)
        {
            return _reviews.Where(r => r.FilmId == movieId).ToList();
        }

        public FilmReview? GetUserReviewForMovie(string username, int movieId)
        {
            return _reviews.FirstOrDefault(r => r.FilmId == movieId && r.Username == username);
        }

        public double GetAverageRating(int movieId)
        {
            var movieReviews = _reviews.Where(r => r.FilmId == movieId).ToList();
            if (!movieReviews.Any())
                return 0;

            return movieReviews.Average(r => r.Rating);
        }
        public async Task<JsonElement> SearchMoviesAsync(string query, int page = 1)
{
    var client = _httpClientFactory.CreateClient();
    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

    var url = $"https://api.themoviedb.org/3/search/movie?api_key={_apiKey}&language=en-US&query={Uri.EscapeDataString(query)}&page={page}";
    var response = await client.GetAsync(url);
    response.EnsureSuccessStatusCode();

    var jsonString = await response.Content.ReadAsStringAsync();
    var jsonDoc = JsonDocument.Parse(jsonString);

    return jsonDoc.RootElement;
}
public async Task AddFeedbackAsync(int filmId, string username, int puan, string? not)
{
    
    Console.WriteLine($"[Feedback] FilmId: {filmId}, User: {username}, Puan: {puan}, Not: {not}");

    
    await Task.CompletedTask;
}

    }
}

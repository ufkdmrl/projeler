using System.Net.Http.Headers;
using System.Text.Json;
using Microsoft.Extensions.Configuration;

namespace MoviePortal.Server.Services
{
    public class ActorService
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly string _apiKey;

        public ActorService(IHttpClientFactory httpClientFactory, IConfiguration configuration)
        {
            _httpClientFactory = httpClientFactory;
            _apiKey = configuration["TheMovieDb:ApiKey"];
        }

        public async Task<JsonElement> GetPopularActorsAsync(int page = 1)
        {
            var client = _httpClientFactory.CreateClient();
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var url = $"https://api.themoviedb.org/3/person/popular?api_key={_apiKey}&language=en-US&page={page}";
            var response = await client.GetAsync(url);
            response.EnsureSuccessStatusCode();

            var jsonString = await response.Content.ReadAsStringAsync();
            var jsonDoc = JsonDocument.Parse(jsonString);

            return jsonDoc.RootElement;
        }
        public async Task<JsonElement> SearchActorsAsync(string query, int page = 1)
{
    var client = _httpClientFactory.CreateClient();
    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

    var url = $"https://api.themoviedb.org/3/search/person?api_key={_apiKey}&language=en-US&query={Uri.EscapeDataString(query)}&page={page}&include_adult=false";
    var response = await client.GetAsync(url);
    response.EnsureSuccessStatusCode();

    var jsonString = await response.Content.ReadAsStringAsync();
    var jsonDoc = JsonDocument.Parse(jsonString);

    return jsonDoc.RootElement;
}

    }
}

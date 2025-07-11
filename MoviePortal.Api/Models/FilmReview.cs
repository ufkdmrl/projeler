namespace MoviePortal.Server.Models
{
    public class FilmReview
    {
        public int Id { get; set; }
        public int FilmId { get; set; }
        public string Username { get; set; } = "";
        public int Rating { get; set; }
        public string? Note { get; set; }
    }
}

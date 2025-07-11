namespace MoviePortal.Server.Models
{
    public class User
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty; // Added Name property
        public string AuthProvider { get; set; } = "Local"; // Added AuthProvider with default value
    }
}
namespace checkoutsys.api.Models
{
    public class SafeUser
    {
        public long Id { get; set; }

        public string Name { get; set; } = null!;

        public string Username { get; set; } = null!;

        public string Email { get; set; } = null!;

        public string Role { get; set; } = null!;
    }
}

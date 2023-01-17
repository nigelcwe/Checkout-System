namespace checkoutsys.api.Models
{
    public class AddProductRequest
    {
        public long AdminId { get; set; }

        public string Name { get; set; } = null!;

        public string Details { get; set; } = null!;

        public decimal Price { get; set; }

        public long Stock { get; set; }
    }
}

namespace checkoutsys.api.Models
{
    public class AddOrderRequest
    {
        public long CustomerId { get; set; }

        public DateTime Date { get; set; }

        public string IsCompleted { get; set; } = null!;
    }
}

namespace checkoutsys.api.Models
{
    public class OrderProductsRequest
    {
        public long OrderId { get; set; }

        public long ProductId { get; set; }

        public long ProductQty { get; set; }
    }
}

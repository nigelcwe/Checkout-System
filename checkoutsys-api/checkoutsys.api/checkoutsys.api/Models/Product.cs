using System;
using System.Collections.Generic;

namespace checkoutsys.api.Models;

public partial class Product
{
    public long Id { get; set; }

    public long AdminId { get; set; }

    public string Name { get; set; } = null!;

    public string Details { get; set; } = null!;

    public decimal Price { get; set; }

    public long Stock { get; set; }

    public virtual User Admin { get; set; } = null!;

    public virtual ICollection<OrderProducts> OrdersProducts { get; } = new List<OrderProducts>();
}

using System;
using System.Collections.Generic;

namespace checkoutsys.api.Models;

public partial class Order
{
    public long Id { get; set; }

    public long CustomerId { get; set; }

    public DateTime Date { get; set; }

    public string IsCompleted { get; set; } = null!;

    public virtual User Customer { get; set; } = null!;

    public virtual ICollection<OrdersProduct> OrdersProducts { get; } = new List<OrdersProduct>();

    public virtual Transaction? Transaction { get; set; }
}

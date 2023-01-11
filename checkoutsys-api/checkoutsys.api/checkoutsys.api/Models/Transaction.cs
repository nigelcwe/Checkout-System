using System;
using System.Collections.Generic;

namespace checkoutsys.api.Models;

public partial class Transaction
{
    public long Id { get; set; }

    public long OrderId { get; set; }

    public long CustomerId { get; set; }

    public DateTime DateTime { get; set; }

    public decimal TotalPrice { get; set; }

    public virtual User Customer { get; set; } = null!;

    public virtual Order Order { get; set; } = null!;
}

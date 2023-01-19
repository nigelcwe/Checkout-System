using System;
using System.Collections.Generic;

namespace checkoutsys.api.Models;

public partial class OrderProducts
{
    public long OrderId { get; set; }

    public long ProductId { get; set; }

    public long ProductQty { get; set; }

    public virtual Order Order { get; set; } = null!;

    public virtual Product Product { get; set; } = null!;
}

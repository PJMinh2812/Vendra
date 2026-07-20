using System;
using System.Collections.Generic;

namespace Vendra.DataAccess.Models;

public partial class OrderItem
{
    public int Id { get; set; }

    public int SubOrderId { get; set; }

    public int ProductId { get; set; }

    public string ProductName { get; set; } = null!;

    public decimal UnitPrice { get; set; }

    public int Quantity { get; set; }

    public virtual Product Product { get; set; } = null!;

    public virtual SubOrder SubOrder { get; set; } = null!;
}

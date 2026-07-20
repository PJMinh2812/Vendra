using System;
using System.Collections.Generic;

namespace Vendra.DataAccess.Models;

public partial class SubOrder
{
    public int Id { get; set; }

    public int OrderId { get; set; }

    public int ShopId { get; set; }

    public decimal Subtotal { get; set; }

    public string Status { get; set; } = null!;

    public virtual Order Order { get; set; } = null!;

    public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();

    public virtual Shop Shop { get; set; } = null!;
}

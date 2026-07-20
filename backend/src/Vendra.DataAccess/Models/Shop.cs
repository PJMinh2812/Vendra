using System;
using System.Collections.Generic;

namespace Vendra.DataAccess.Models;

public partial class Shop
{
    public int Id { get; set; }

    public string OwnerUserId { get; set; } = null!;

    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    public string Status { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public virtual ICollection<Product> Products { get; set; } = new List<Product>();

    public virtual ICollection<SubOrder> SubOrders { get; set; } = new List<SubOrder>();
}

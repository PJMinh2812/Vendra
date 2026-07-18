using System;
using System.Collections.Generic;

namespace Vendra.DataAccess.Models;

public partial class CartItem
{
    public int Id { get; set; }

    public string UserId { get; set; } = null!;

    public int ProductId { get; set; }

    public int Quantity { get; set; }

    public virtual Product Product { get; set; } = null!;
}

using System;
using System.Collections.Generic;

namespace Vendra.DataAccess.Models;

public partial class Order
{
    public int Id { get; set; }

    public string CustomerUserId { get; set; } = null!;

    public decimal TotalAmount { get; set; }

    public string ShippingAddress { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public virtual Payment? Payment { get; set; }

    public virtual ICollection<SubOrder> SubOrders { get; set; } = new List<SubOrder>();
}

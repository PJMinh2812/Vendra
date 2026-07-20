using System;
using System.Collections.Generic;

namespace Vendra.DataAccess.Models;

public partial class Payment
{
    public int Id { get; set; }

    public int OrderId { get; set; }

    public string Method { get; set; } = null!;

    public string Status { get; set; } = null!;

    public string? TransactionId { get; set; }

    public decimal Amount { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? PaidAt { get; set; }

    public virtual Order Order { get; set; } = null!;
}

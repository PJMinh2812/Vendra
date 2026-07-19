namespace Vendra.DataAccess.Identity;

public class RefreshToken
{
    public int Id {get; set;}
    public string UserId {get; set;} = string.Empty;
    public string Token {get; set; } = string.Empty;
    public DateTime ExpiresAt {get; set; }
    public DateTime CreatedAt {get; set; }
    public bool Revoked {get; set; } = false;
}
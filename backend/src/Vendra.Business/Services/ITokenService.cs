using Vendra.DataAccess.Identity;

namespace Vendra.Business.Services;

public interface ITokenService
{
    string GenerateAccessToken(ApplicationUser user, IList<string> roles);
    string GenerateRefreshToken();
}

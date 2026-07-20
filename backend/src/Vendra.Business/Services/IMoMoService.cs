using Vendra.Business.DTOs;

namespace Vendra.Business.Services;

public interface IMoMoService
{
    Task<string> CreatePaymentAsync(string orderId, long amount, string orderInfo);
    bool VerifyIpnSignature(MoMoIpnDto ipn);
}

using System.Net.Http.Json;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json.Serialization;
using Microsoft.Extensions.Options;
using Vendra.Business.DTOs;
using Vendra.Business.Settings;

namespace Vendra.Business.Services;

public class MoMoService : IMoMoService
{
    private readonly MoMoSettings _settings;
    private readonly HttpClient _httpClient;

    public MoMoService(IOptions<MoMoSettings> options, HttpClient httpClient)
    {
        _settings = options.Value;
        _httpClient = httpClient;
    }

    public async Task<string> CreatePaymentAsync(string orderId, long amount, string orderInfo)
    {
        var requestId = Guid.NewGuid().ToString();
        const string requestType = "payWithMethod";
        const string extraData = "";

        var rawSignature =
            $"accessKey={_settings.AccessKey}&amount={amount}&extraData={extraData}&ipnUrl={_settings.IpnUrl}" +
            $"&orderId={orderId}&orderInfo={orderInfo}&partnerCode={_settings.PartnerCode}" +
            $"&redirectUrl={_settings.RedirectUrl}&requestId={requestId}&requestType={requestType}";

        var signature = Sign(rawSignature, _settings.SecretKey);

        var payload = new
        {
            partnerCode = _settings.PartnerCode,
            partnerName = "Vendra",
            storeId = "VendraStore",
            requestId,
            amount,
            orderId,
            orderInfo,
            redirectUrl = _settings.RedirectUrl,
            ipnUrl = _settings.IpnUrl,
            lang = "vi",
            requestType,
            autoCapture = true,
            extraData,
            signature
        };

        var response = await _httpClient.PostAsJsonAsync(_settings.Endpoint, payload);
        var result = await response.Content.ReadFromJsonAsync<MoMoCreateResponse>();

        if (result is null || result.ResultCode != 0)
        {
            throw new InvalidOperationException(result?.Message ?? "MoMo không phản hồi hợp lệ.");
        }

        return result.PayUrl;
    }

    public bool VerifyIpnSignature(MoMoIpnDto ipn)
    {
        var rawSignature =
            $"accessKey={_settings.AccessKey}&amount={ipn.Amount}&extraData={ipn.ExtraData}&message={ipn.Message}" +
            $"&orderId={ipn.OrderId}&orderInfo={ipn.OrderInfo}&orderType={ipn.OrderType}&partnerCode={ipn.PartnerCode}" +
            $"&payType={ipn.PayType}&requestId={ipn.RequestId}&responseTime={ipn.ResponseTime}" +
            $"&resultCode={ipn.ResultCode}&transId={ipn.TransId}";

        var expectedSignature = Sign(rawSignature, _settings.SecretKey);
        return expectedSignature == ipn.Signature;
    }

    private static string Sign(string data, string key)
    {
        var keyBytes = Encoding.UTF8.GetBytes(key);
        var dataBytes = Encoding.UTF8.GetBytes(data);
        using var hmac = new HMACSHA256(keyBytes);
        var hashBytes = hmac.ComputeHash(dataBytes);
        return Convert.ToHexString(hashBytes).ToLowerInvariant();
    }
}

internal class MoMoCreateResponse
{
    [JsonPropertyName("resultCode")]
    public int ResultCode { get; set; }

    [JsonPropertyName("message")]
    public string Message { get; set; } = string.Empty;

    [JsonPropertyName("payUrl")]
    public string PayUrl { get; set; } = string.Empty;
}

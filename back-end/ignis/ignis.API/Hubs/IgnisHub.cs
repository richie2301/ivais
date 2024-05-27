using Microsoft.AspNetCore.SignalR;

public class IgnisHub : Hub
{
    public async Task SendMessage(string type, string message)
    {
        await Clients.All.SendAsync("ReceiveMessage", type, message);
    }
}
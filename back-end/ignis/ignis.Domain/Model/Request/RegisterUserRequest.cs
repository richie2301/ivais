namespace ignis.Domain.Model.Request
{
    public class RegisterUserRequest
    {
        public string email { get; set; }
        public string firstName { get; set; }
        public string lastName { get; set; }
        public string password { get; set; }
    }
}
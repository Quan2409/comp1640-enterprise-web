using BackEndC_.Models;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using MongoDB.Driver;
using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using System.Text;
using System.Security.Cryptography;
using System.Text.RegularExpressions;

namespace BackEndC_.Service
{
    public class AccountService : IAccountService
    {
        private readonly dbCRUD account;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public AccountService(dbCRUD database, IHttpContextAccessor httpContextAccessor)
        {
            account = database;
            _httpContextAccessor = httpContextAccessor;
        }

        public account Create(account accounts)
        {
            if (!IsValidEmail(accounts.Email) || accounts.Status != "Active")
            {
                return null;
            }

            //var accounts1 = new account();
            // Mã hóa mật khẩu
            accounts.Password = ConvertToHS256(accounts.Password);
            accounts.RetypePassword = ConvertToHS256(accounts.RetypePassword);

            // Tạo mã sinh viên mới
            accounts.Email = $"{accounts.Email.Split('@')[0]}{GenerateRandomStudentCode()}@{accounts.Email.Split('@')[1]}";

            account.accounthoho.InsertOne(accounts);
            return accounts;
        }


        private string GenerateRandomStudentCode()
        {
            // Sử dụng thời gian hiện tại để tạo một mã sinh viên duy nhất
            var timestamp = DateTime.Now.Ticks;

            // Chuyển đổi timestamp thành mã sinh viên bằng cách lấy các chữ số cuối cùng
            // Ví dụ: Nếu timestamp là 123456789, mã sinh viên sẽ là "56789"
            string studentCode = timestamp.ToString().Substring(timestamp.ToString().Length - 6);

            return studentCode;
        }


        public bool Delete(string id)
        {
            var check = account.accounthoho.DeleteOne(x => x.AccountId == id);
            return check.IsAcknowledged;
        }

        public  List<account> getAccounts()
        {
            var getaccount = account.accounthoho.Find(x => true).ToList();
            return getaccount;
        }
        // ObjectID
        public account GetAccountById(string accountId)
        {
            var getaccountId = account.accounthoho.Find(u => u.AccountId == accountId).FirstOrDefault();
            return getaccountId;
        }


        public async Task<accountDTO> Login(string email, string password)
        {
            var hashpw = ConvertToHS256(password);
            var auth = account.accounthoho.Find(x => x.Email == email && x.Password == hashpw).FirstOrDefault();

            //if (auth == null || auth.Status == "Disable")
            //{
            //    return null; 
            //}
            if (auth == null || auth.Status == "Disable")
            {
                return null;
            }

            var claim = new List<Claim>
    {
        new Claim(ClaimTypes.NameIdentifier, auth.AccountId.ToString()),
        new Claim(ClaimTypes.Role, auth.Role.ToString()),
        new Claim(ClaimTypes.Email, auth.Email.ToString()),
    };

            var identity = new ClaimsIdentity(claim, CookieAuthenticationDefaults.AuthenticationScheme);
            var principal = new ClaimsPrincipal(identity);
            // Công thức mắm ruốc trả COokie
            await _httpContextAccessor.HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal);
            //var userRole = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Role);
            var accountDto = new accountDTO
            {
                email = auth.Email,
                role = auth.Role
            };

            return await Task.FromResult(accountDto); ;
        }


        public void Logout()
        {
            _httpContextAccessor.HttpContext?.SignOutAsync();
        }

        public bool Update(string id, account accounts)
        {
            var accountss = account.accounthoho.Find(x => x.AccountId == id).FirstOrDefault();
            if (accountss == null)
            {
                return false;
            }

            accountss.Email = accounts.Email;
            accountss.Password = accounts.Password;
            accountss.RetypePassword = accounts.RetypePassword;
            accountss.Role = accounts.Role;
            accountss.Status = accounts.Status;

            accountss.createdAt = accounts.createdAt;
            accountss.updateAt = accounts.updateAt;

            var result = account.accounthoho.ReplaceOne(x => x.AccountId == id, accountss);

            return result.IsAcknowledged && result.ModifiedCount > 0;
        }

        private bool IsValidEmail(string email)
        {
            return Regex.IsMatch(email, @"^[a-zA-Z0-9_.+-]+@(fpt.edu.vn)$");
        }

        public string ConvertToHS256(string value)
        {
            string key = "duyanh69";
            byte[] keyByte = Encoding.UTF8.GetBytes(key);
            byte[] stringToByte = Encoding.UTF8.GetBytes(value);
            string Hashpw = "";

            using (HMACSHA256 Hm = new HMACSHA256(keyByte))
            {
                byte[] GiaiMaHoa = Hm.ComputeHash(stringToByte);
                Hashpw = Convert.ToBase64String(GiaiMaHoa);
            }

            return Hashpw;
        }

        
    }
}

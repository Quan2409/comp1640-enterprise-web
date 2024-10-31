using BackEndC_.Models;
using BackEndC_.Service;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BackEndC_.Controllers
{
    [Authorize(AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme)]
    //[Authorize(Roles = "admin")]
    //[Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly IAccountService account69;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly ICommentService commentService;

        public AccountController(IAccountService account6969, IHttpContextAccessor httpContextAccessor, ICommentService comment) {
            account69 = account6969;
            _httpContextAccessor = httpContextAccessor;
            commentService = comment;
        }
        [AllowAnonymous]
        //Auth
        [HttpPost, Route("/auth/login")]
        public async Task<IActionResult> login(string email, string password)
        {
            
            var check = await account69.Login(email, password);
            if (check != null)
            {
                var userRole = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Role);
                return Ok(check);
            }
            else
            {
                return BadRequest("Invalid email or password.");
            }
        }

        [HttpPost, Route("/auth/logout")]
        [Authorize(Roles = "admin")]
        public ActionResult logout()
        {
            account69.Logout();
            return Ok("Logout Successfully !!");
        }

        [AllowAnonymous]
        // Trong phương thức getAll
        [HttpGet, Route("/api/account")]
        [Authorize(Roles = "admin")]
        public ActionResult<List<account>> getAll()
        {
            var userRole = HttpContext.User.FindFirst(ClaimTypes.Role);
            return  account69.getAccounts();
        }

        // Trong phương thức create
        [HttpPost]
        [Route("/api/account/create")]
        [Authorize(Roles = "admin")]
        //[AllowAnonymous]
        public ActionResult<account> create( account accounts)
        {
            //var userRole = User.FindFirst(ClaimTypes.Role);
            //var createdAccount = account69.Create(accounts);
            //if (createdAccount == null)
            //{
            //    return BadRequest("Account creation failed !!!!");
            //}

            //return createdAccount;
            return account69.Create(accounts);

        }

        // Trong phương thức delete
        [HttpDelete]
        [Route("/api/account/delete")]
        [Authorize(Roles = "admin")]
        public ActionResult<bool> delete(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                return BadRequest("Account ID is required.");
            }

            var isDeleted = account69.Delete(id);
            if (!isDeleted)
            {
                return NotFound("Account not found.");
            }

            return Ok(true);
        }

        // Trong phương thức update
        [HttpPut]
        [Route("/api/account/update")]
        [Authorize(Roles = "admin")]
        public ActionResult<bool> update(account accounts, string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                return BadRequest("Account ID is required.");
            }

            var isUpdated = account69.Update(id, accounts);
            if (!isUpdated)
            {
                return NotFound("Account not found.");
            }

            return Ok(true);
        }

        // Trong phương thức update
        [HttpPost]
        [Route("/api/account/Email")]
        [Authorize(Roles = "admin")]
        public ActionResult Email(string email, string header, string content)
        {

            commentService.SendEmail(email, header, content);
            return Ok("Success");
        }




    }
}

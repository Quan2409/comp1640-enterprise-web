using BackEndC_.Models;
using BackEndC_.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;

namespace BackEndC_.Controllers
{
   // [Route("api/[controller]")]
    [ApiController]
    public class guestController : ControllerBase
    {
        private readonly IGuestService guest69;
        private readonly IFacultyService facultyService;
        private readonly IAccountService accountService;

        public guestController(IGuestService cmt6969, IFacultyService facultyService, IAccountService accountService)
        {
            guest69 = cmt6969;
            this.facultyService = facultyService;
            this.accountService = accountService;
        }

        [HttpGet]
        [Route("/api/guest")]
        public ActionResult<List<guest>> getAll()
        {
            return guest69.getGuests();
        }

       // [AllowAnonymous]
        [Authorize(Roles = "admin")]
        [HttpPost]
        [Route("api/guest/create")]
        public ActionResult<guest> create(guest guests, string facultyId, string accountId)
        {
            //
            ObjectId facultyIdObject = ObjectId.Parse(facultyId);
            guests.FacultyId = facultyIdObject;
            ObjectId accountIdObject = ObjectId.Parse(accountId);
            guests.AccountId = accountIdObject;
            // get important in4 from faculty and coordinator
            faculty facultyData = facultyService.GetFacultyById(facultyId);
            account accountData = accountService.GetAccountById(accountId);

            var facultyResponse = new
            {
                facultyData.FacultyName,


            };
            var accountResponse = new
            {
                accountData.Email,

            };

            guests.FacultyData = facultyResponse;
            guests.AccountData = accountResponse;

            return guest69.Create(guests);
        }

        [Authorize(Roles = "admin")]
        [HttpDelete]
        [Route("api/guest/delete")]
        public ActionResult<bool> delete(string id)
        {
            return guest69.Delete(id);
        }

        [Authorize(Roles = "admin")]
        [HttpPut]
        [Route("api/guest/update")]
        public ActionResult<bool> update(guestDTO guests, string id)
        {
            return guest69.Update(id, guests);
        }
    }
    }

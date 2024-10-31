using BackEndC_.Models;
using BackEndC_.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;

namespace BackEndC_.Controllers
{
  //  [Route("api/[controller]")]
    [ApiController]
    public class CoordinatorController : ControllerBase
    {
        private readonly ICoordinatorService coordinator69;
        private readonly IFacultyService facultyService;
        private readonly IAccountService accountService;

        public CoordinatorController(ICoordinatorService cmt6969, IFacultyService facultyService, IAccountService accountService)
        {
            coordinator69 = cmt6969;
            this.facultyService = facultyService;
            this.accountService = accountService;
        }

        [HttpGet]
        [Route("/api/coordinator")]
        public ActionResult<List<coordinator>> getAll()
        {
            return coordinator69.getCoordinators();
        }

        [AllowAnonymous]
        [Authorize(Roles = "admin")]
        [HttpPost]
        [Route("api/coordinator/create")]
        public ActionResult<coordinator> create(coordinator coordinators, string facultyId, string accountId)
        {
            //
            ObjectId facultyIdObject = ObjectId.Parse(facultyId);
            coordinators.FacultyId = facultyIdObject;
            ObjectId accountIdObject = ObjectId.Parse(accountId);
            coordinators.AccountId = accountIdObject;
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

            // 
            coordinators.FacultyData = facultyResponse;
            coordinators.AccountData = accountResponse;

            return coordinator69.Create(coordinators);
        }

        [Authorize(Roles = "admin")]
        [HttpDelete]
        [Route("api/coordinator/delete")]
        public ActionResult<bool> delete(string id)
        {
            return coordinator69.Delete(id);
        }

        [Authorize(Roles = "admin")]
        [HttpPut]
        [Route("api/coordinator/update")]
        public ActionResult<bool> update(coordinatorDTO coordinators, string id)
        {
            return coordinator69.Update(id, coordinators);
        }
    }
}

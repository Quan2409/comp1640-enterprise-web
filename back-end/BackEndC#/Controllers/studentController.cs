using BackEndC_.Models;
using BackEndC_.Service;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;

namespace BackEndC_.Controllers
{
    [Authorize(AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme)]
    [Route("api/[controller]")]
    [ApiController]
    public class studentController : ControllerBase
    {
        private readonly IStudentService student69;
        private readonly IFacultyService facultyService;
        private readonly IAccountService accountService;

        public studentController(IStudentService student6969, IFacultyService facultyService, IAccountService accountService)
        {
            student69 = student6969;
            this.facultyService = facultyService;
            this.accountService = accountService;
        }
        //api/student/
        [HttpGet]
        [Route("/api/student")]
        [Authorize(Roles = "admin")]
        public ActionResult<List<student>> getAll()
        {
            return student69.getStudents();
        }

        // api/student/create
        [Authorize(Roles = "admin")]
        [HttpPost]
        [Route(nameof(create))]
        public ActionResult<student> create(student students, string facultyId, string accountId)
        {
            //
            ObjectId facultyIdObject = ObjectId.Parse(facultyId);
            students.FacultyId = facultyIdObject;
            ObjectId accountIdObject = ObjectId.Parse(accountId);
            students.AccountId = accountIdObject;
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

            students.FacultyData = facultyResponse;
            students.AccountData = accountResponse;

            return student69.Create(students);
        }

        // api/student/delete
        [HttpDelete]
        [Route(nameof(delete))]
        [Authorize(Roles = "admin")]
        public ActionResult<bool> delete(string id)
        {
            return student69.Delete(id);

        }
        // api/student/update
        [HttpPut]
        [Route(nameof(update))]
        [Authorize(Roles = "admin")]
        public ActionResult<bool> update(studentDTO students, string id)
        {
            return student69.Update(id, students);
        }


    }
}

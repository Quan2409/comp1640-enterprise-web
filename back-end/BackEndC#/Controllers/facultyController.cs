using BackEndC_.Models;
using BackEndC_.Service;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BackEndC_.Controllers
{
    [Authorize(AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme)]
    [Route("api/[controller]")]
    [ApiController]
    public class facultyController : ControllerBase
    {
        private readonly IFacultyService faculty69;

        public facultyController(IFacultyService faculty6969)
        {
            faculty69 = faculty6969;
        }
        //api/faculty/getAll
        [HttpGet]
        [Route(nameof(getAll))]

        public ActionResult<List<faculty>> getAll()
        {
            return faculty69.getFaculties();
        }

        // api/faculty/create
        [Authorize(Roles = "admin")]
        [HttpPost]
        [Route("/api/faculty/create")]
        public ActionResult<faculty> create(faculty faculties)
        {
            return faculty69.Create(faculties);
        }

        // api/faculty/delete
        [HttpDelete]
        [Route("/api/faculty/delete")]
        [Authorize(Roles = "admin")]
        public ActionResult<bool> delete(string id)
        {
            return faculty69.Delete(id);

        }
        // api/faculty/update
        [HttpPut]
        [Route("/api/faculty/update")]
        [Authorize(Roles = "admin")]
        public ActionResult<bool> update(faculty faculties, string id)
        {
            return faculty69.Update(id, faculties);
        }

        
    }
}

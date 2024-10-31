// contributionController
using BackEndC_.Models;
using BackEndC_.Service;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using System.Threading.Tasks;

namespace BackEndC_.Controllers
{
    [Authorize(AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme)]
   // [Route("api/[controller]")]
    [ApiController]
    public class contributionController : ControllerBase
    {
        private readonly IContributionService contributionService;
        private readonly IStudentService studentService;
        private readonly IEventService eventService;

        public contributionController(IContributionService contributionService, IStudentService studentService, IEventService eventService)
        {
            this.contributionService = contributionService;
            this.studentService = studentService;
            this.eventService = eventService;
        }

        [HttpGet]
        [Route("/api/contribution")]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult<List<contribution>>> GetAll()
        {
            return await contributionService.GetContributions();
        }

        [HttpPost]
        [Route("/api/contribution/create")]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult<contribution>> Create([FromForm] contributionDTO contributions, string studentId, string eventId)
        {
            // Student, event ObjectId
            ObjectId studentIdObject = ObjectId.Parse(studentId);
            contributions.StudentId = studentIdObject;
            ObjectId eventIdObject = ObjectId.Parse(eventId);
            contributions.EventId = eventIdObject;
            // ObjectID đc truyền nhưng data không lấy dữ liệu từ OBjectID về
            // Get student and event data
            student studentData = studentService.GetStudentById(studentId);
            Event eventData = eventService.GetEventById(eventId);

            // Assign student and event data directly to contributionDTO propertiest
            contributions.StudentData = new
            {
                studentData.StudentName,
                studentData.StudentCode,
                studentData.StudentDob,
            };

            contributions.EventData = new
            {
                eventData.EventName,
            };

            

            return await contributionService.Create(contributions);
        }




        [HttpDelete]
        [Route("/api/contribution/delete")]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult<bool>> Delete(string id)
        {
            return await contributionService.Delete(id);
        }

        [HttpPut]
        [Route("/api/contribution/update")]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult<bool>> Update(contributionDTO contributions, string id)
        {
            return await contributionService.Update(id, contributions);
        }
    }
}

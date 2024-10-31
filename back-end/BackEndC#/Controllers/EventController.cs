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
    public class EventController : ControllerBase
    {
        private readonly IEventService Event69;
        private readonly IFacultyService facultyService;


        public EventController(IEventService Event6969, IFacultyService facultyService)
        {
            Event69 = Event6969;
            this.facultyService = facultyService;
        }
        //api/Event/getAll
        [HttpGet]
        [Route("/api/Event")]
        [Authorize(Roles = "admin")]
        public ActionResult<List<Event>> getAll()
        {
            return Event69.getEvents();
        }

        // api/Event/create
        [Authorize(Roles = "admin")]
        [HttpPost]
        [Route(nameof(create))]
        public ActionResult<Event> create(Event Events, string facultyId)
        {
            ObjectId facultyIdObject = ObjectId.Parse(facultyId);
            Events.FacultyId = facultyIdObject;
            faculty facultyData = facultyService.GetFacultyById(facultyId);
            var facultyResponse = new
            {
                facultyData.FacultyName,

            };
            Events.FacultyData = facultyResponse;

            return Event69.Create(Events);
        }

        // api/Event/delete
        [HttpDelete]
        [Route(nameof(delete))]
        [Authorize(Roles = "admin")]
        public ActionResult<bool> delete(string id)
        {
            return Event69.Delete(id);

        }
        // api/Event/update
        [HttpPut]
        [Route(nameof(update))]
        [Authorize(Roles = "admin")]
        public ActionResult<bool> update(Event Events, string id)
        {
            return Event69.Update(id, Events);
        }


    }
}

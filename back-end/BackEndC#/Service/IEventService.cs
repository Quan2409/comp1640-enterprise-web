using BackEndC_.Models;
using MongoDB.Driver;

namespace BackEndC_.Service
{
    public interface IEventService
    {
        List<Event> getEvents();

        // CRUD
        Event Create(Event Events);
        bool Update(string id, Event Events);
        bool Delete(string id);
        Event GetEventById(string eventId);
    }
}

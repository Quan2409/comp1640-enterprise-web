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
using MongoDB.Bson;

namespace BackEndC_.Service
{
    public class EventService : IEventService
    {
        private readonly dbCRUD Event;

        public EventService(dbCRUD database)
        {
            Event = database;
        }

        public Event Create(Event newEvent)
        {
            if (newEvent == null)
            {
                throw new ArgumentNullException(nameof(newEvent));
            }

            // Kiểm tra xem đã có Event nào khác có cùng eventName chưa
            var existingEvent = Event.Eventhoho.Find(e => e.EventName == newEvent.EventName).FirstOrDefault();

            if (existingEvent != null)
            {
                // Nếu đã tồn tại Event có cùng eventName, bạn có thể xử lý hoặc báo lỗi tại đây
                throw new InvalidOperationException($"An Event with the eventName '{newEvent.EventName}' already exists.");
            }

            // Nếu không có Event nào khác có cùng eventName, thực hiện thêm mới vào cơ sở dữ liệu
            newEvent.FacultyId = ObjectId.Parse(newEvent.FacultyId.ToString());
            Event.Eventhoho.InsertOne(newEvent);

            return newEvent;
        }

        public bool Delete(string id)
        {
            var result = Event.Eventhoho.DeleteOne(e => e.EventId == id);
            return result.DeletedCount > 0;
        }

        public Event GetEventById(string eventId)
        {
            var getEventId = Event.Eventhoho.Find(u => u.EventId == eventId).FirstOrDefault();
            return getEventId;
        }

        public List<Event> getEvents()
        {
            return Event.Eventhoho.Find(Event => true).ToList();
        }

        public bool Update(string id, Event Events)
        {
            var checkObjectId = Event.Eventhoho.Find(x => x.EventId == id).FirstOrDefault();
            var Eventss = new Event();
            Eventss.EventId = checkObjectId.EventId;
            Eventss.EventName = Events.EventName;
            // Kiểm tra xem đã có Event nào khác có cùng eventName chưa
            var existingEvent = Event.Eventhoho.Find(e => e.EventName == Events.EventName).FirstOrDefault();

            if (existingEvent != null)
            {
                // Nếu đã tồn tại Event có cùng eventName, bạn có thể xử lý hoặc báo lỗi tại đây
                throw new InvalidOperationException($"An Event with the eventName '{Events.EventName}' already exists.");
            }
            //Object ID 
            Eventss.FacultyData = checkObjectId.FacultyData;
            Eventss.FacultyId = checkObjectId.FacultyId;


            //Time
            Eventss.created_at = Events.created_at;
            Eventss.updated_at = Events.updated_at;
            //
            var result = Event.Eventhoho.ReplaceOne(x => x.EventId == id, Eventss);

            if (result.IsAcknowledged && result.ModifiedCount > 0)
            {
                return true;
            }
            else
            {
                return false;
            }
        }


    }
}

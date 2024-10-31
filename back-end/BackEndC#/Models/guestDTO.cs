using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace BackEndC_.Models
{
    public class guestDTO
    {
        public string GuestName { get; set; }
        public string GuestAvatar { get; set; }


        //public ObjectId FacultyId { get; set; }
        //public object? FacultyData { get; set; }


        // Time to create and update
        

        public DateTime? createdAt { get; set; }
        public DateTime? updatedAt { get; set; }


    }
}

using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
namespace BackEndC_.Models
{
    public class coordinatorDTO
    {
        public string CoordinatorAvatar { get; set; }


        //public ObjectId FacultyId { get; set; }
        //public object? FacultyData { get; set; }

        public DateTime? createdAt { get; set; }

        public DateTime? updateAt { get; set; }
    }
}

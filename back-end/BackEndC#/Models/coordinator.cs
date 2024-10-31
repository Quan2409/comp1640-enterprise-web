using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace BackEndC_.Models
{
    public class coordinator
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        // ID
        public string? CoordinatorId { get; set; }
        //Username

        [BsonElement("coordinatorName")]
        [BsonRequired]
        public string CoordinatorName { get; set; }

        [BsonElement("coordinatorAvatar")]
        [BsonRequired]
        public string CoordinatorAvatar { get; set; }
        [BsonRequired]
        [BsonRepresentation(BsonType.ObjectId)]
        public ObjectId AccountId { get; set; }
        public object? AccountData { get; set; } // Define UserData property to hold user data
        [BsonRequired]
        [BsonRepresentation(BsonType.ObjectId)]
        public ObjectId FacultyId { get; set; }
        public object? FacultyData { get; set; }


        // Time to create and update

        [BsonElement("createdAt")]
        [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]

        public DateTime? createdAt { get; set; }

        [BsonElement("updatedAt")]
        [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]

        public DateTime? updateAt { get; set; }

        [BsonElement("__v")]
        public int __v { get; set; }
    }
}

using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace BackEndC_.Models
{
    public class comment
    {

        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        // ID
        public string? CommentId { get; set; }
       

        [BsonRequired]
        [BsonRepresentation(BsonType.ObjectId)]
        public ObjectId ContributionId { get; set; }
        public object? ContributionData { get; set; } // Define UserData property to hold user data
        [BsonRequired]
        [BsonRepresentation(BsonType.ObjectId)]
        public ObjectId CoordinatorId { get; set; }
        public object? CoordinatorData { get; set; }

        //Username

        [BsonElement("review")]
        [BsonRequired]
        public string Review { get; set; }
        // Time to create and update

        [BsonElement("createdAt")]
        [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]

        public DateTime? createdAt { get; set; }

        [BsonElement("updatedAt")]
        [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]

        public DateTime? updatedAt { get; set; }

        [BsonElement("__v")]
        public int __v { get; set; }
    }
}

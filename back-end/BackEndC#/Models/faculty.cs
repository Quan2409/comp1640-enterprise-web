using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace BackEndC_.Models
{
    public class faculty
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        // ID
        public string? FacultyId { get; set; }
        //Username

        [BsonElement("facultyName")]
        [BsonRequired]
        public string FacultyName { get; set; }
      
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

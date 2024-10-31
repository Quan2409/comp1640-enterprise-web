using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace BackEndC_.Models
{
    public class student
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? StudentId { get; set; }

        [BsonElement("studentCode")]
        [BsonRequired]
        public string StudentCode { get; set; }

        [BsonElement("studentName")]
        [BsonRequired]
        public string StudentName { get; set; }

        [BsonElement("studentDob")]
        public DateTime StudentDob { get; set; }

        [BsonElement("studentAvatar")]
        [BsonRequired]
        public string StudentAvatar { get; set; }

        //
        [BsonRequired]
        [BsonRepresentation(BsonType.ObjectId)]
        public ObjectId FacultyId { get; set; }
        public object? FacultyData { get; set; }
        [BsonRequired]
        [BsonRepresentation(BsonType.ObjectId)]
        public ObjectId AccountId { get; set; }
        public object? AccountData { get; set; }
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


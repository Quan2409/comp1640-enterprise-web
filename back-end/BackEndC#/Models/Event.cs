using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;

namespace BackEndC_.Models
{
    public class Event
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? EventId { get; set; }

        public ObjectId FacultyId { get; set; }
        public object? FacultyData { get; set; }

        [BsonElement("eventName")]
        public string EventName { get; set; }

        [BsonElement("openDate")]
        [BsonDateTimeOptions(Kind = DateTimeKind.Utc)] 
        public DateTime openDate { get; set; }

        [BsonElement("closeDate")]
        [BsonDateTimeOptions(Kind = DateTimeKind.Utc)] 
        public DateTime closeDate { get; set; }

        [BsonElement("isClosed")]
        public bool isClosed { get; set; }

        [BsonElement("createdAt")]
        [BsonDateTimeOptions(Kind = DateTimeKind.Utc)] 
        public DateTime? created_at { get; set; }

        [BsonElement("updatedAt")]
        [BsonDateTimeOptions(Kind = DateTimeKind.Utc)] 
        public DateTime? updated_at { get; set; }
    }
}

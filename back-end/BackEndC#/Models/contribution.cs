using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.ComponentModel.DataAnnotations;

namespace BackEndC_.Models
{
    public class contribution
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        // ID
        public string? ContributionId { get; set; }

        // Object Id
        [BsonRequired]
        [BsonRepresentation(BsonType.ObjectId)]
        public ObjectId StudentId { get; set; }
        public object? StudentData { get; set; } // Define UserData property to hold user data
        [BsonRequired]
        [BsonRepresentation(BsonType.ObjectId)]
        public ObjectId EventId { get; set; }
        public object? EventData { get; set; }

        //submisstionDate
        [BsonElement("submissionDate")]
        [BsonRequired]
        public DateTime SubmissionDate { get; set; }
        

        [BsonRepresentation(BsonType.Binary)]
        [BsonElement("document")]
        [BsonRequired]
        // Lưu file băm ra mảng ByTE
        public byte[] Document { get; set; }
        //public IFormFile Document { get; set; }
        

        [BsonElement("image")]
        [BsonRequired]
        public string Image { get; set; }

        [BsonElement("IsPublished")]
        [BsonRequired]
        public bool isPublished { get; set; }

        
    }
}

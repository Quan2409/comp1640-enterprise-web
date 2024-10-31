using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.ComponentModel.DataAnnotations;

namespace BackEndC_.Models
{
    public class account
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? AccountId { get; set; }

        [BsonElement("email")]
        [BsonRequired]
        public string Email { get; set; }

        [BsonElement("password")]
        [BsonRequired]
        public string Password { get; set; }

        [BsonElement("retypePassword")]
        [BsonRequired]
        public string RetypePassword { get; set; }

        [BsonElement("role")]
        [BsonRequired]
        public string Role { get; set; }

        // Sử dụng bool để biểu thị trạng thái
        [BsonElement("status")]
        public string Status { get; set; } // : Active, : Disable


        [BsonElement("createdAt")]
        [BsonRequired]
        public DateTime? createdAt { get; set; }

        [BsonElement("updatedAt")]
        [BsonRequired]
        public DateTime? updateAt { get; set; }

        [BsonElement("__v")]
        public int __v { get; set; }
    }
}

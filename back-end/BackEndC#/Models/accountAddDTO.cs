using MongoDB.Bson.Serialization.Attributes;

namespace BackEndC_.Models
{
    public class accountAddDTO
    {
        public string email { get; set; }
        public string password { get; set; }
        public string retypePassword { get; set; }
        public string role { get; set; }
        public string status { get; set; }
        
        public DateTime? createdAt { get; set; }
        public DateTime? updatedAt { get; set; }


    }
}

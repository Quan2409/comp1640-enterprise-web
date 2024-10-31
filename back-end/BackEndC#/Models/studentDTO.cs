using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
namespace BackEndC_.Models
{
    public class studentDTO
    {
        public string StudentCode { get; set; }

      
        public string StudentName { get; set; }

        public DateTime StudentDob { get; set; }

        
        public string StudentAvatar { get; set; }

       
        //public ObjectId FacultyId { get; set; }
        //public object? FacultyData { get; set; }
       

        public DateTime? createdAt { get; set; }

        public DateTime? updateAt { get; set; }

    }
}

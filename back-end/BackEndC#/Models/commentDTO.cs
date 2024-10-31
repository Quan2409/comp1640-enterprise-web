using MongoDB.Bson.Serialization.Attributes;

namespace BackEndC_.Models
{
    public class commentDTO
    {
        public string Review { get; set; }


        public DateTime? createdAt { get; set; }

        public DateTime? updatedAt { get; set; }
    }
}

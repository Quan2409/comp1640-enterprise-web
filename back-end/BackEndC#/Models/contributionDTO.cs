using Microsoft.AspNetCore.Http;
using MongoDB.Bson;

namespace BackEndC_.Models
{
    

    public class contributionDTO
    {
        public string? ContributionId { get; set; }
        public DateTime SubmissionDate { get; set; }
        public IFormFile Document { get; set; }
        public string Image { get; set; }
        public bool isPublished { get; set; }
        public ObjectId StudentId { get; set; }
        public object? StudentData { get; set; }
        public ObjectId EventId { get; set; }
        public object? EventData { get; set; }
    }
}

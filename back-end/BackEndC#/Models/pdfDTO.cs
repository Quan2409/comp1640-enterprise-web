
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
// Ánh xạ dữ liệu(Been FE guiwr Veef)
namespace BackEndC_.Models
{
    public class pdfDTO
    {
        //Bên FE truyền dữ liệu vào đây
        //submisstionDate
        public DateTime SubmissionDate { get; set; }

        // Lưu file băm ra mảng ByTE
        public IFormFile Document { get; set; }

        public string Image { get; set; }

        public bool isPublished { get; set; }
    }
}

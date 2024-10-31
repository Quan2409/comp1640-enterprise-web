using BackEndC_.Models;
using MongoDB.Driver;

namespace BackEndC_.Service
{
    public interface ICommentService
    {
        List<comment> getComments();

        // CRUD
        comment Create(comment comments);
        bool Update(string id, commentDTO comments);
        bool Delete(string id);
        Task SendEmail(string notify, string review, string content);
    }
}

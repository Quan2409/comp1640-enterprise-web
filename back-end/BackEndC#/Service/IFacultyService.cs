using BackEndC_.Models;
using MongoDB.Driver;

namespace BackEndC_.Service
{
    public interface IFacultyService
    {
        List<faculty> getFaculties();

        // CRUD
        faculty Create(faculty faculties);
        bool Update(string id, faculty faculties);
        bool Delete(string id);
        faculty GetFacultyById(string facultyId);
    }
}

using BackEndC_.Models;
using MongoDB.Driver; 

namespace BackEndC_.Service
{
    public interface IStudentService
    {
        List<student> getStudents();

        // CRUD
        student Create(student students);
        bool Update(string id, studentDTO students);
        bool Delete(string id);
        student GetStudentById(string studentId);

        //
    }
}

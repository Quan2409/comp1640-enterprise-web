using BackEndC_.Models;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using MongoDB.Driver;
using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using MongoDB.Bson;
using System.Xml.Linq;

namespace BackEndC_.Service
{
    public class StudentService : IStudentService
    {
        private readonly dbCRUD student;
        // ctor : goi constructor
        public StudentService(dbCRUD database)
        {
            student = database;

        }


        public student Create(student students)
        {
            // Kiểm tra xem accountId đã tồn tại chưa
            var existingStudent = student.studenthoho.Find(x => x.AccountId == students.AccountId).FirstOrDefault();

            if (existingStudent != null)
            {
                // Nếu đã tồn tại student có cùng accountId, bạn có thể xử lý hoặc báo lỗi tại đây
                throw new InvalidOperationException($"A student with the accountId '{students.AccountId}' already exists.");
            }

            // Chuyển đổi FacultyId và AccountId thành ObjectId (nếu cần)
            students.FacultyId = ObjectId.Parse(students.FacultyId.ToString());
            students.AccountId = ObjectId.Parse(students.AccountId.ToString());

            // Thêm mới student vào cơ sở dữ liệu
            student.studenthoho.InsertOne(students);

            return students;
        }


        public bool Delete(string id)
        {
            var check = student.studenthoho.DeleteOne(x => x.StudentId == id);
            if (check.IsAcknowledged)
            {
                return true;
            }
            else
            {
                return false;
            }

        }

        public student GetStudentById(string studentId)
        {
            var getStudentId = student.studenthoho.Find(u => u.StudentId == studentId).FirstOrDefault();
            return getStudentId;
        }

        public List<student> getStudents()
        {
            var getstudent = student.studenthoho.Find(x => true).ToList();
            return getstudent;
        }

        

        public bool Update(string id, studentDTO students)
        {
            var checkObjectId = student.studenthoho.Find(x => x.StudentId == id).FirstOrDefault();
            var studentss = new student();

            studentss.StudentId = checkObjectId.StudentId;
            studentss.StudentName = students.StudentName;
            studentss.StudentCode = students.StudentCode;
            studentss.StudentDob = students.StudentDob;
            studentss.StudentAvatar = students.StudentAvatar;

            //Object ID 
            studentss.FacultyData = checkObjectId.FacultyData;
            studentss.AccountData = checkObjectId.AccountData;
            studentss.FacultyId = checkObjectId.FacultyId;
            studentss.AccountId = checkObjectId.AccountId;

            //Time
            studentss.createdAt = students.createdAt;
            studentss.updateAt = students.updateAt;
            //
            var result = student.studenthoho.ReplaceOne(x => x.StudentId == id, studentss);

            if (result.IsAcknowledged && result.ModifiedCount > 0)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        
        //
    }
}

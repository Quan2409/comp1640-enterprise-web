using BackEndC_.Models;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using MongoDB.Driver;
using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;

namespace BackEndC_.Service
{
    public class FacultyService : IFacultyService
    {
        private readonly dbCRUD faculty;
        // ctor : goi constructor
        public FacultyService(dbCRUD database)
        {
            faculty = database;

        }


        public faculty Create(faculty faculties)
        {
            var checkName = faculty.facultyhoho.Find(x => x.FacultyName == faculties.FacultyName).FirstOrDefault();
            if (checkName != null)
            {
                return null;
            }
            faculty.facultyhoho.InsertOne(faculties);


            return faculties;
        }

        public bool Delete(string id)
        {
            var check = faculty.facultyhoho.DeleteOne(x => x.FacultyId == id);
            if (check.IsAcknowledged)
            {
                return true;
            }
            else
            {
                return false;
            }

        }

        public List<faculty> getFaculties()
        {
            var getfaculty = faculty.facultyhoho.Find(x => true).ToList();
            return getfaculty;
        }
        // Get by Object ID

        public faculty GetFacultyById(string facultyId)
        {
            var getfacultyId = faculty.facultyhoho.Find(u => u.FacultyId == facultyId).FirstOrDefault();
            return getfacultyId;
        }

        public bool Update(string id, faculty faculties)
        {
            var facultiess = new faculty();
            facultiess.FacultyId = id;
            facultiess.FacultyName = faculties.FacultyName;

            facultiess.createdAt = faculties.createdAt;
            facultiess.updateAt = faculties.updateAt;
            //
            var result = faculty.facultyhoho.ReplaceOne(x => x.FacultyId == id, facultiess);

            if (result.IsAcknowledged && result.ModifiedCount > 0)
            {
                return true;
            }
            else
            {
                return false;
            }
        }



    }
    }

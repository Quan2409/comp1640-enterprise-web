using BackEndC_.Models;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using MongoDB.Driver;
using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using MongoDB.Bson;

namespace BackEndC_.Service
{
    public class GuestService : IGuestService
    {
        private readonly dbCRUD guest;
        // ctor : goi constructor
        public GuestService(dbCRUD database)
        {
            guest = database;

        }
        public guest Create(guest guests)
        {
            var checkName = guest.guesthoho.Find(x => x.GuestId == guests.GuestId).FirstOrDefault();
            if (checkName != null)
            {
                // Nếu đã tồn tại student có cùng accountId, bạn có thể xử lý hoặc báo lỗi tại đây
                throw new InvalidOperationException($"A student with the accountId '{guests.AccountId}' already exists.");
            }
            guests.AccountId = ObjectId.Parse(guests.AccountId.ToString());
            guests.FacultyId = ObjectId.Parse(guests.FacultyId.ToString());
            guest.guesthoho.InsertOne(guests);


            return guests;
        }

        public bool Delete(string id)
        {
            var check = guest.guesthoho.DeleteOne(x => x.GuestId == id);
            if (check.IsAcknowledged)
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        public List<guest> getGuests()
        {
            var getguest = guest.guesthoho.Find(x => true).ToList();
            return getguest;
        }

        public bool Update(string id, guestDTO guests)
        {
            var checkObjectId = guest.guesthoho.Find(x => x.GuestId == id).FirstOrDefault();
            var guestss = new guest();
            guestss.GuestId = checkObjectId.GuestId;
            guestss.GuestName = guests.GuestName;

            //Object ID 
            guestss.FacultyData = checkObjectId.FacultyData;
            guestss.AccountData = checkObjectId.AccountData;
            guestss.FacultyId = checkObjectId.FacultyId;
            guestss.AccountId = checkObjectId.AccountId;

            //Time
            guestss.createdAt = guests.createdAt;
            guestss.updateAt = guests.updatedAt;
            //
            var result = guest.guesthoho.ReplaceOne(x => x.GuestId == id, guestss);

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

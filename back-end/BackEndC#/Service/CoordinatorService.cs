using BackEndC_.Models;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;
using MongoDB.Driver;

namespace BackEndC_.Service
{
    public class CoordinatorService : ICoordinatorService
    {
        private readonly dbCRUD coordinator;
        // ctor : goi constructor
        public CoordinatorService(dbCRUD database)
        {
            coordinator = database;

        }
        public coordinator Create(coordinator coordinators)
        {
            var checkName = coordinator.coordinatorhoho.Find(x => x.CoordinatorId == coordinators.CoordinatorId).FirstOrDefault();
            if (checkName != null)
            {
                // Nếu đã tồn tại Event có cùng eventName, bạn có thể xử lý hoặc báo lỗi tại đây
                throw new InvalidOperationException($"An Event with the eventName '{checkName.AccountId}' already exists.");
            }
            coordinators.AccountId = ObjectId.Parse(coordinators.AccountId.ToString());
            coordinators.FacultyId = ObjectId.Parse(coordinators.FacultyId.ToString());
            coordinator.coordinatorhoho.InsertOne(coordinators);


            return coordinators;
        }

        public bool Delete(string id)
        {
            var check = coordinator.coordinatorhoho.DeleteOne(x => x.CoordinatorId == id);
            if (check.IsAcknowledged)
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        // get by ObjectId
        public coordinator GetCoordinatorById(string id)
        {
            var getCoordinatorId = coordinator.coordinatorhoho.Find(u => u.CoordinatorId == id).FirstOrDefault();
            return getCoordinatorId;
        }

        public List<coordinator> getCoordinators()
        {
            var getcoordinator = coordinator.coordinatorhoho.Find(x => true).ToList();
            return getcoordinator;
        }

        public bool Update(string id, coordinatorDTO coordinators)
        {
            var checkObjectId = coordinator.coordinatorhoho.Find(x => x.CoordinatorId == id).FirstOrDefault();
            var coordinatorss = new coordinator();
            coordinatorss.CoordinatorId = checkObjectId.CoordinatorId;
            //coordinatorss.CoordinatorName = coordinators.CoordinatorName;
            coordinatorss.CoordinatorAvatar = coordinators.CoordinatorAvatar;

            //Object ID 
            coordinatorss.FacultyData = checkObjectId.FacultyData;
            coordinatorss.AccountData = checkObjectId.AccountData;
            coordinatorss.FacultyId = checkObjectId.FacultyId;
            coordinatorss.AccountId = checkObjectId.AccountId;

            //Time
            coordinatorss.createdAt = coordinators.createdAt;
            coordinatorss.updateAt = coordinators.updateAt;
            //
            var result = coordinator.coordinatorhoho.ReplaceOne(x => x.CoordinatorId == id, coordinatorss);

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

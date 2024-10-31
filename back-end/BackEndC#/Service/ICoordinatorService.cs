using BackEndC_.Models;
using MongoDB.Driver;
namespace BackEndC_.Service
{
    public interface ICoordinatorService
    {
        //ObjectId
        coordinator GetCoordinatorById(string id);

        List<coordinator> getCoordinators();

        // CRUD
        coordinator Create(coordinator coordinators);
        bool Update(string id, coordinatorDTO coordinators);
        bool Delete(string id);
    }
}

using BackEndC_.Models;
using MongoDB.Driver;

namespace BackEndC_.Service
{
    public interface IGuestService
    {
        List<guest> getGuests();

        // CRUD
        guest Create(guest guests);
        bool Update(string id, guestDTO guests);
        bool Delete(string id);
    }
}

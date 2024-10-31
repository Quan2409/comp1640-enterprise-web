using BackEndC_.Models;
using MongoDB.Driver;

namespace BackEndC_.Service
{
    public interface IAccountService
    {
        List<account> getAccounts();

        // CRUD
        account Create(account accounts); 
        bool Update(string id, account accounts);
        bool Delete(string id);
        void Logout();
        // đổi sang email
        //account Login(string email, string password);
        Task<accountDTO> Login(string email, string password);
        account GetAccountById(string accountId);
    }



}

using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace BackEndC_.Models
{
    public class dbCRUD
    {
        private readonly IMongoDatabase database;
        private readonly Connect connect;

        //ctor
        public dbCRUD(IOptions<Connect> connect69)
        {
            connect = connect69.Value;
            var client = new MongoClient(connect.MongoDB);
            database = client.GetDatabase(connect.DatabaseName);
        }
        //
        public IMongoCollection<account> accounthoho => database.GetCollection<account>("account");
        public IMongoCollection<faculty> facultyhoho => database.GetCollection<faculty>("faculty");
        public IMongoCollection<student> studenthoho => database.GetCollection<student>("student");
        public IMongoCollection<Event> Eventhoho => database.GetCollection<Event>("Event");
        public IMongoCollection<contribution> contributionhoho => database.GetCollection<contribution>("contribution");
        public IMongoCollection<guest> guesthoho => database.GetCollection<guest>("guest");
        public IMongoCollection<coordinator> coordinatorhoho => database.GetCollection<coordinator>("coordinator");
        public IMongoCollection<comment> commenthoho => database.GetCollection<comment>("comment");
    }

}

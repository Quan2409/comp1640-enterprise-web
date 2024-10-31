using BackEndC_.Models;
using MongoDB.Driver;

namespace BackEndC_.Service
{
    public interface IDocumentService
    {

       Task<List<pdfDTO>>  getPDF();

        // CRUD
       Task<pdfDTO>  Create(pdfDTO pdfDTOs);
       Task <bool> Update(string id, pdfDTO pdfDTOs);
        Task<bool> Delete(string id);
        

    }
}

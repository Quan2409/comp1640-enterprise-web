using BackEndC_.Models;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using MongoDB.Driver;
using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using System.Text;
using System.Security.Cryptography;
using System.Text.RegularExpressions;

namespace BackEndC_.Service
{
    public class DocumentService : IDocumentService
    {
        private readonly dbCRUD contribution;
        public DocumentService(dbCRUD database)
        {
            contribution = database;

        }
        public async Task<pdfDTO> Create(pdfDTO pdfDTOs)
        {
            // Kiểm tra tính hợp lệ của dữ liệu đầu vào
            if (pdfDTOs == null)
                throw new ArgumentNullException(nameof(pdfDTOs));

            byte[] pdfContent;
            using (var memoryStream = new MemoryStream())
            {
                await pdfDTOs.Document.CopyToAsync(memoryStream);
                pdfContent = memoryStream.ToArray();
            }
            var pdf = new contribution()
            {
                //StudentId = "1",
                //FacultyId = "1",
                SubmissionDate = pdfDTOs.SubmissionDate,
                Document = pdfContent

            };
            // Thực hiện thêm mới vào cơ sở dữ liệu
            contribution.contributionhoho.InsertOne(pdf);


            return pdfDTOs;
        }

        public Task<bool> Delete(string id)
        {
            throw new NotImplementedException();
        }

        public Task<List<pdfDTO>> getPDF()
        {
            throw new NotImplementedException();
        }

        public Task<bool> Update(string id, pdfDTO pdfDTOs)
        {
            throw new NotImplementedException();
        }
    }
}

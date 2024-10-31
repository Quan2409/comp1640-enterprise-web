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
using MongoDB.Bson;

namespace BackEndC_.Service
{
    public class ContributionService : IContributionService
    {
        private readonly dbCRUD contribution;

        public ContributionService(dbCRUD database)
        {
            contribution = database;
        }

        public async Task<contribution> Create(contributionDTO contributions)
        {
            // Kiểm tra xem đối tượng contributions có null không
            if (contributions == null)
                throw new ArgumentNullException(nameof(contributions));

            // Đọc nội dung của tệp tin đính kèm và chuyển đổi thành mảng byte
            byte[] pdfContent;
            using (var memoryStream = new MemoryStream())
            {
                await contributions.Document.CopyToAsync(memoryStream);
                pdfContent = memoryStream.ToArray();
            }

            // Tạo một đối tượng contribution mới từ dữ liệu trong contributionDTO
            var contributionToAdd = new contribution
            {
                Document = pdfContent,
                SubmissionDate = contributions.SubmissionDate,
                Image = contributions.Image,
                isPublished = contributions.isPublished,
                // Chuyển đổi StudentId và EventId thành ObjectId
                StudentId = ObjectId.Parse(contributions.StudentId.ToString()),
                EventId = ObjectId.Parse(contributions.EventId.ToString())
            };

            // Thêm mới contribution vào cơ sở dữ liệu
            contribution.contributionhoho.InsertOne(contributionToAdd);

            return contributionToAdd;
        }




        public async Task<bool> Delete(string id)
        {
            // Thực hiện xóa contribution từ cơ sở dữ liệu
            var result = contribution.contributionhoho.DeleteOne(c => c.ContributionId == id);
            return result.DeletedCount > 0;
        }

        public contribution GetContributionById(string id)
        {
            var getcontributionOB = contribution.contributionhoho.Find(u => u.ContributionId == id).FirstOrDefault();
            return getcontributionOB;
        }

        public async Task<List<contribution>> GetContributions()
        {
            var getcontribution = contribution.contributionhoho.Find(x => true).ToList();
            return getcontribution;
        }

        public async Task<bool> Update(string id, contributionDTO contributions)
        {
            // Kiểm tra xem đối tượng contributions có null không
            if (contributions == null)
                throw new ArgumentNullException(nameof(contributions));

            // Tìm contribution dựa trên id
            var checkObjectId = contribution.contributionhoho.Find(x => x.ContributionId == id).FirstOrDefault();
            if (checkObjectId == null)
                return false; // Nếu không tìm thấy, trả về false

            // Tạo một đối tượng contribution mới từ dữ liệu trong contributionDTO
            var contributionToUpdate = new contribution
            {
                Document = checkObjectId.Document, // Giữ nguyên tệp tin đã có
                SubmissionDate = contributions.SubmissionDate,
                Image = contributions.Image,
                isPublished = contributions.isPublished,
                // Chuyển đổi StudentId và EventId thành ObjectId
                StudentId = ObjectId.Parse(contributions.StudentId.ToString()),
                EventId = ObjectId.Parse(contributions.EventId.ToString())
            };

            // Thực hiện cập nhật dữ liệu
            var result = contribution.contributionhoho.ReplaceOne(c => c.ContributionId == id, contributionToUpdate);

            return result.ModifiedCount > 0;
        }


    }
}

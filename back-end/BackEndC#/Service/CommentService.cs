using BackEndC_.Models;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using MongoDB.Driver;
using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting;
using MongoDB.Bson;
using SendGrid.Helpers.Mail;
using Microsoft.Extensions.Options;
using MailKit.Security;
using MimeKit;
using MailKit.Net.Smtp;

namespace BackEndC_.Service
{
    public class CommentService : ICommentService
    {
        private readonly dbCRUD comment;
        private readonly EmailSettings _emaiSetting;
        // ctor : goi constructor
        public CommentService(dbCRUD database, IOptions<EmailSettings> emailSetting)
        {
            comment = database;
            _emaiSetting = emailSetting.Value;

        }
        public comment Create(comment comments)
        {
            try
            {
                var checkPost = comment.commenthoho.Find(x => x.CommentId == comments.CommentId).FirstOrDefault();
                if (checkPost != null)
                {
                    return null; // cấm spam nhen
                }
                comments.ContributionId = ObjectId.Parse(comments.ContributionId.ToString());
                comments.CoordinatorId = ObjectId.Parse(comments.CoordinatorId.ToString());
                comment.commenthoho.InsertOne(comments);

                return comments;
            }
            catch (Exception ex)
            {
                // Xử lý lỗi nếu cần
                Console.WriteLine("Error creating Comment hahaha: " + ex.Message);
                return null;
            }
        }

        public bool Delete(string id)
        {
            var check = comment.commenthoho.DeleteOne(x => x.CommentId == id);
            if (check.IsAcknowledged)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        public async Task SendEmail(string notify, string review, string content)
        {

            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(_emaiSetting.SenderName, _emaiSetting.SenderEmail)); message.To.Add(new MailboxAddress("", notify));
            message.Subject = review;
            //message.Body = bodyBuilder.ToMessageBody();
            message.Body = new TextPart("html"){
                Text = content
            };
            using (var client = new SmtpClient())
            {
                await client.ConnectAsync(_emaiSetting.SmtpServer, _emaiSetting.Port, SecureSocketOptions.StartTls);
                await client.AuthenticateAsync(_emaiSetting.Username, _emaiSetting.Password); await client.SendAsync(message);
                await client.DisconnectAsync(true);
            }
        }
        public List<comment> getComments()
        {
            var getcmt = comment.commenthoho.Find(x => true).ToList();
            return getcmt;
        }

        public bool Update(string id, commentDTO comments)
        {
            var checkId = comment.commenthoho.Find(x => x.CommentId == id).FirstOrDefault();
            var commentss = new comment();
            commentss.CommentId = checkId.CommentId;
            commentss.ContributionData = checkId.ContributionData;
            commentss.CoordinatorData = checkId.CoordinatorData;
            commentss.ContributionId = checkId.ContributionId;
            commentss.CoordinatorId = checkId.CoordinatorId;
            commentss.Review = commentss.Review;

            //Time
            commentss.createdAt = commentss.createdAt;
            commentss.updatedAt = commentss.updatedAt;
            // 
            var result = comment.commenthoho.ReplaceOne(x => x.CommentId == id, commentss);

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

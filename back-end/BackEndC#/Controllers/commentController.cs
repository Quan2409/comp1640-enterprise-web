using BackEndC_.Models;
using BackEndC_.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;
using MongoDB.Bson;

namespace BackEndC_.Controllers
{
    //[Route("api/[controller]")]
    [ApiController]
    public class commentController : ControllerBase
    {
        private readonly ICommentService comment69;
        private readonly IContributionService contributionService;
        private readonly ICoordinatorService coordinatorService;

        public commentController(ICommentService cmt6969, IContributionService contributionService, ICoordinatorService coordinatorService)
        {
            comment69 = cmt6969;
            this.contributionService = contributionService;
            this.coordinatorService = coordinatorService;
        }

        [HttpGet]
        [Route("/api/comment")]
        public ActionResult<List<comment>> getAll()
        {
            return comment69.getComments();
        }

        //[AllowAnonymous]
        [Authorize(Roles = "admin")]
        [HttpPost]
        [Route("api/comment/create")]
        public ActionResult<comment> create(comment comments, string contributionId, string coordinatorId)
        {
            //
            ObjectId contributionIdObject = ObjectId.Parse(contributionId);
            comments.ContributionId = contributionIdObject;
            ObjectId coordinatorIdObject = ObjectId.Parse(coordinatorId);
            comments.CoordinatorId = coordinatorIdObject;
            // get important in4 from contribution and coordinator
            contribution contributionData = contributionService.GetContributionById(contributionId);
            coordinator coordinatorData = coordinatorService.GetCoordinatorById(coordinatorId);

            var contributionResponse = new
            {
                contributionData.Image,
                
            };
            var coordinatorResponse = new
            {
                coordinatorData.CoordinatorName,
                coordinatorData.CoordinatorAvatar,
                
            };

            // Thêm dữ liệu của user vào đối tượng comment trước khi lưu vào cơ sở dữ liệu
            comments.ContributionData = contributionResponse;
            comments.CoordinatorData = coordinatorResponse;

            return comment69.Create(comments);
        }

        [Authorize(Roles = "admin")]
        [HttpDelete]
        [Route("api/comment/delete")]
        public ActionResult<bool> delete(string id)
        {
            return comment69.Delete(id);
        }

        [Authorize(Roles = "admin")]
        [HttpPut]
        [Route("api/comment/update")]
        public ActionResult<bool> update(commentDTO comments, string id)
        {
            return comment69.Update(id, comments);
        }
    }
}

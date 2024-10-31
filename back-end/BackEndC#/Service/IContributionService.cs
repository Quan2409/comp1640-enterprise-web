using BackEndC_.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BackEndC_.Service
{
    public interface IContributionService
    {
        contribution GetContributionById(string id);
        Task<List<contribution>> GetContributions();
        Task<contribution> Create(contributionDTO contributions);
        Task<bool> Update(string id, contributionDTO contributions);
        Task<bool> Delete(string id);
    }
}

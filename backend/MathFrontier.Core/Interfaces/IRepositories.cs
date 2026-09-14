using MathFrontier.Core.DTOs;
using MathFrontier.Core.Entities;

namespace MathFrontier.Core.Interfaces;

public interface IProblemRepository
{
    Task<IEnumerable<Problem>> GetProblemsAsync(ProblemFilterDto filter);
    Task<Problem?> GetBySlugAsync(string slug);
    Task<IEnumerable<Problem>> GetRelatedProblemsAsync(string slug);
}

public interface IWonderRepository
{
    Task<IEnumerable<MathematicalWonder>> GetAllAsync();
    Task<MathematicalWonder?> GetBySlugAsync(string slug);
}

public interface IVisualizationRepository
{
    Task<IEnumerable<Visualization>> GetAllAsync();
    Task<Visualization?> GetBySlugAsync(string slug);
}

public interface ITimelineRepository
{
    Task<IEnumerable<TimelineEvent>> GetAllAsync();
}

public interface ISearchService
{
    Task<IEnumerable<SearchResultDto>> SearchAsync(string query);
}

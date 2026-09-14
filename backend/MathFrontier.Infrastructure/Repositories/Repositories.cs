using MathFrontier.Core.DTOs;
using MathFrontier.Core.Entities;
using MathFrontier.Core.Interfaces;
using MathFrontier.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace MathFrontier.Infrastructure.Repositories;

public class ProblemRepository : IProblemRepository
{
    private readonly MathFrontierDbContext _context;

    public ProblemRepository(MathFrontierDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Problem>> GetProblemsAsync(ProblemFilterDto filter)
    {
        var query = _context.Problems.Include(p => p.Category).AsQueryable();

        if (filter.Status.HasValue)
        {
            query = query.Where(p => p.Status == filter.Status.Value);
        }

        if (!string.IsNullOrWhiteSpace(filter.Category))
        {
            var catLower = filter.Category.ToLower();
            query = query.Where(p => p.Category != null && p.Category.Slug == catLower);
        }

        if (filter.Difficulty.HasValue)
        {
            query = query.Where(p => p.Difficulty == filter.Difficulty.Value);
        }

        if (!string.IsNullOrWhiteSpace(filter.Field))
        {
            var fieldLower = filter.Field.ToLower();
            query = query.Where(p => p.Field.ToLower().Contains(fieldLower));
        }

        if (filter.HasVisualization.HasValue)
        {
            query = filter.HasVisualization.Value
                ? query.Where(p => !string.IsNullOrEmpty(p.VisualizationSlug))
                : query.Where(p => string.IsNullOrEmpty(p.VisualizationSlug));
        }

        if (filter.HasExperiment.HasValue)
        {
            query = query.Where(p => p.HasExperiment == filter.HasExperiment.Value);
        }

        return await query.OrderBy(p => p.Id).ToListAsync();
    }

    public async Task<Problem?> GetBySlugAsync(string slug)
    {
        var slugLower = slug.ToLower();
        return await _context.Problems
            .Include(p => p.Category)
            .FirstOrDefaultAsync(p => p.Slug.ToLower() == slugLower);
    }

    public async Task<IEnumerable<Problem>> GetRelatedProblemsAsync(string slug)
    {
        var problem = await GetBySlugAsync(slug);
        if (problem == null || !problem.RelatedProblems.Any())
        {
            return Enumerable.Empty<Problem>();
        }

        var relatedSlugs = problem.RelatedProblems.Select(s => s.ToLower()).ToList();
        return await _context.Problems
            .Include(p => p.Category)
            .Where(p => relatedSlugs.Contains(p.Slug.ToLower()))
            .ToListAsync();
    }
}

public class WonderRepository : IWonderRepository
{
    private readonly MathFrontierDbContext _context;

    public WonderRepository(MathFrontierDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<MathematicalWonder>> GetAllAsync()
    {
        return await _context.Wonders.Include(w => w.Category).OrderBy(w => w.Id).ToListAsync();
    }

    public async Task<MathematicalWonder?> GetBySlugAsync(string slug)
    {
        var slugLower = slug.ToLower();
        return await _context.Wonders
            .Include(w => w.Category)
            .FirstOrDefaultAsync(w => w.Slug.ToLower() == slugLower);
    }
}

public class VisualizationRepository : IVisualizationRepository
{
    private readonly MathFrontierDbContext _context;

    public VisualizationRepository(MathFrontierDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Visualization>> GetAllAsync()
    {
        return await _context.Visualizations.OrderBy(v => v.Id).ToListAsync();
    }

    public async Task<Visualization?> GetBySlugAsync(string slug)
    {
        var slugLower = slug.ToLower();
        return await _context.Visualizations.FirstOrDefaultAsync(v => v.Slug.ToLower() == slugLower);
    }
}

public class TimelineRepository : ITimelineRepository
{
    private readonly MathFrontierDbContext _context;

    public TimelineRepository(MathFrontierDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<TimelineEvent>> GetAllAsync()
    {
        return await _context.TimelineEvents.OrderBy(t => t.Year).ToListAsync();
    }
}

public class SearchService : ISearchService
{
    private readonly MathFrontierDbContext _context;

    public SearchService(MathFrontierDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<SearchResultDto>> SearchAsync(string query)
    {
        if (string.IsNullOrWhiteSpace(query))
        {
            return Enumerable.Empty<SearchResultDto>();
        }

        var q = query.Trim().ToLower();
        var results = new List<SearchResultDto>();

        // Search Problems
        var matchingProblems = await _context.Problems
            .Include(p => p.Category)
            .Where(p => p.Title.ToLower().Contains(q) ||
                        p.ShortDescription.ToLower().Contains(q) ||
                        p.Field.ToLower().Contains(q) ||
                        p.Slug.ToLower().Contains(q))
            .ToListAsync();

        // Also check in-memory tags
        var problemResults = matchingProblems.Select(p => new SearchResultDto
        {
            Type = "Problem",
            Title = p.Title,
            Slug = p.Slug,
            Description = p.ShortDescription,
            Category = p.Category?.Name ?? p.Field,
            Status = p.Status.ToString(),
            Tags = p.Tags
        });
        results.AddRange(problemResults);

        // Search Wonders
        var matchingWonders = await _context.Wonders
            .Include(w => w.Category)
            .Where(w => w.Title.ToLower().Contains(q) ||
                        w.ShortDescription.ToLower().Contains(q) ||
                        w.Slug.ToLower().Contains(q))
            .ToListAsync();

        var wonderResults = matchingWonders.Select(w => new SearchResultDto
        {
            Type = "Wonder",
            Title = w.Title,
            Slug = w.Slug,
            Description = w.ShortDescription,
            Category = w.Category?.Name ?? "Wonder",
            Status = w.Status.ToString(),
            Tags = w.Tags
        });
        results.AddRange(wonderResults);

        // Search Mathematicians
        var matchingMathematicians = await _context.Mathematicians
            .Where(m => m.Name.ToLower().Contains(q) ||
                        m.Biography.ToLower().Contains(q) ||
                        m.Nationality.ToLower().Contains(q))
            .ToListAsync();

        var mathematicianResults = matchingMathematicians.Select(m => new SearchResultDto
        {
            Type = "Mathematician",
            Title = m.Name,
            Slug = m.Slug,
            Description = m.Biography,
            Category = m.Era,
            Status = "Mathematician",
            Tags = m.KeyContributions
        });
        results.AddRange(mathematicianResults);

        // Search Timeline Events
        var matchingEvents = await _context.TimelineEvents
            .Where(t => t.Title.ToLower().Contains(q) ||
                        t.Description.ToLower().Contains(q) ||
                        t.Significance.ToLower().Contains(q))
            .ToListAsync();

        var eventResults = matchingEvents.Select(t => new SearchResultDto
        {
            Type = "Timeline",
            Title = $"{t.Year} — {t.Title}",
            Slug = t.RelatedProblemSlug ?? t.RelatedWonderSlug ?? $"timeline-{t.Id}",
            Description = t.Description,
            Category = t.Category,
            Status = t.DateDisplay,
            Tags = new List<string> { t.Category, t.Year.ToString() }
        });
        results.AddRange(eventResults);

        return results;
    }
}

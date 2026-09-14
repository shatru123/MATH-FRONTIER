using MathFrontier.Core.DTOs;
using MathFrontier.Core.Enums;
using MathFrontier.Infrastructure.Data;
using MathFrontier.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;

namespace MathFrontier.Tests;

public class RepositoryAndSearchTests
{
    private async Task<MathFrontierDbContext> CreateContextAsync()
    {
        var options = new DbContextOptionsBuilder<MathFrontierDbContext>()
            .UseSqlite($"Data Source=file:{Guid.NewGuid()}?mode=memory&cache=shared")
            .Options;

        var context = new MathFrontierDbContext(options);
        await DatabaseSeeder.SeedAsync(context);
        return context;
    }

    [Fact]
    public async Task FilterByStatus_ReturnsOnlyMatchingProblems()
    {
        using var context = await CreateContextAsync();
        var repo = new ProblemRepository(context);

        var openProblems = await repo.GetProblemsAsync(new ProblemFilterDto { Status = ProblemStatus.OPEN });
        Assert.NotEmpty(openProblems);
        Assert.All(openProblems, p => Assert.Equal(ProblemStatus.OPEN, p.Status));

        var solvedProblems = await repo.GetProblemsAsync(new ProblemFilterDto { Status = ProblemStatus.SOLVED });
        Assert.NotEmpty(solvedProblems);
        Assert.All(solvedProblems, p => Assert.Equal(ProblemStatus.SOLVED, p.Status));
    }

    [Fact]
    public async Task FilterByCategory_ReturnsOnlyMatchingCategory()
    {
        using var context = await CreateContextAsync();
        var repo = new ProblemRepository(context);

        var numberTheoryProblems = await repo.GetProblemsAsync(new ProblemFilterDto { Category = "number-theory" });
        Assert.NotEmpty(numberTheoryProblems);
        Assert.All(numberTheoryProblems, p => Assert.Equal("number-theory", p.Category?.Slug));
    }

    [Fact]
    public async Task SearchService_FindsRelevantEntities()
    {
        using var context = await CreateContextAsync();
        var search = new SearchService(context);

        var riemannResults = await search.SearchAsync("riemann");
        Assert.NotEmpty(riemannResults);
        Assert.Contains(riemannResults, r => r.Slug == "riemann-hypothesis");

        var mobiusResults = await search.SearchAsync("mobius");
        Assert.NotEmpty(mobiusResults);
        Assert.Contains(mobiusResults, r => r.Slug == "mobius-strip");

        var turingResults = await search.SearchAsync("turing");
        Assert.NotEmpty(turingResults);
    }
}

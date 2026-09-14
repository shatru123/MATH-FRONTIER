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

    [Fact]
    public async Task SlugAliases_ResolveCorrectly()
    {
        using var context = await CreateContextAsync();
        var problemRepo = new ProblemRepository(context);
        var wonderRepo = new WonderRepository(context);
        var visRepo = new VisualizationRepository(context);

        var nsProblem = await problemRepo.GetBySlugAsync("navier-stokes");
        Assert.NotNull(nsProblem);
        Assert.Equal("navier-stokes-smoothness", nsProblem.Slug);

        var btWonder = await wonderRepo.GetBySlugAsync("banach-tarski");
        Assert.NotNull(btWonder);
        Assert.Equal("banach-tarski-paradox", btWonder.Slug);

        var btVis = await visRepo.GetBySlugAsync("banach-tarski-paradox");
        Assert.NotNull(btVis);
        Assert.Equal("banach-tarski", btVis.Slug);
    }

    [Fact]
    public async Task ZenosParadoxes_IsSeededAndConfigured()
    {
        using var context = await CreateContextAsync();
        var wonderRepo = new WonderRepository(context);

        var zeno = await wonderRepo.GetBySlugAsync("zenos-paradoxes");
        Assert.NotNull(zeno);
        Assert.Equal(ProblemStatus.PARADOX, zeno.Status);
        Assert.Equal("zenos-paradoxes", zeno.VisualizationSlug);
        Assert.True(zeno.HasExperiment);
        Assert.NotEmpty(zeno.Properties);
        Assert.NotEmpty(zeno.ConstructionSteps);
    }

    [Fact]
    public async Task AllRequiredWondersAndProblems_AreSeeded()
    {
        using var context = await CreateContextAsync();
        var wonders = await context.Wonders.ToListAsync();
        var problems = await context.Problems.ToListAsync();

        Assert.True(wonders.Count >= 18, $"Expected >= 18 wonders, found {wonders.Count}");
        Assert.True(problems.Count >= 13, $"Expected >= 13 problems, found {problems.Count}");

        var requiredWonderSlugs = new[]
        {
            "mobius-strip", "klein-bottle", "torus", "hilberts-hotel", "banach-tarski-paradox",
            "mandelbrot-set", "hyperbolic-geometry", "zenos-paradoxes", "projective-plane",
            "cantors-diagonal-argument", "birthday-paradox", "monty-hall-problem",
            "gabriels-horn", "julia-set", "sierpinski-triangle", "koch-snowflake",
            "cantor-set", "dragon-curve"
        };

        foreach (var slug in requiredWonderSlugs)
        {
            Assert.Contains(wonders, w => w.Slug == slug);
        }

        var requiredProblemSlugs = new[]
        {
            "riemann-hypothesis", "p-vs-np", "poincare-conjecture", "navier-stokes-smoothness",
            "collatz-conjecture", "goldbach-conjecture", "twin-prime-conjecture",
            "halting-problem", "continuum-hypothesis", "birch-swinnerton-dyer",
            "fermats-last-theorem", "hodge-conjecture", "yang-mills-mass-gap"
        };

        foreach (var slug in requiredProblemSlugs)
        {
            Assert.Contains(problems, p => p.Slug == slug);
        }
    }

    [Fact]
    public async Task DatabaseSeeder_IsIdempotent()
    {
        using var context = await CreateContextAsync();
        var wondersCountBefore = await context.Wonders.CountAsync();
        var problemsCountBefore = await context.Problems.CountAsync();

        // Run seed again on the same context
        await DatabaseSeeder.SeedAsync(context);

        var wondersCountAfter = await context.Wonders.CountAsync();
        var problemsCountAfter = await context.Problems.CountAsync();

        Assert.Equal(wondersCountBefore, wondersCountAfter);
        Assert.Equal(problemsCountBefore, problemsCountAfter);
    }
}

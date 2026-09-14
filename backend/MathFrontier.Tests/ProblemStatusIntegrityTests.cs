using MathFrontier.Core.Enums;
using MathFrontier.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace MathFrontier.Tests;

public class ProblemStatusIntegrityTests
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
    public async Task PoincareConjecture_MustBeSolved()
    {
        using var context = await CreateContextAsync();
        var poincare = await context.Problems.FirstOrDefaultAsync(p => p.Slug == "poincare-conjecture");

        Assert.NotNull(poincare);
        Assert.Equal(ProblemStatus.SOLVED, poincare.Status);
    }

    [Fact]
    public async Task RiemannHypothesis_MustBeOpen()
    {
        using var context = await CreateContextAsync();
        var riemann = await context.Problems.FirstOrDefaultAsync(p => p.Slug == "riemann-hypothesis");

        Assert.NotNull(riemann);
        Assert.Equal(ProblemStatus.OPEN, riemann.Status);
    }

    [Fact]
    public async Task HaltingProblem_MustBeUndecidable()
    {
        using var context = await CreateContextAsync();
        var halting = await context.Problems.FirstOrDefaultAsync(p => p.Slug == "halting-problem");

        Assert.NotNull(halting);
        Assert.Equal(ProblemStatus.UNDECIDABLE, halting.Status);
    }

    [Fact]
    public async Task ContinuumHypothesis_MustBeIndependent()
    {
        using var context = await CreateContextAsync();
        var ch = await context.Problems.FirstOrDefaultAsync(p => p.Slug == "continuum-hypothesis");

        Assert.NotNull(ch);
        Assert.Equal(ProblemStatus.INDEPENDENT, ch.Status);
    }

    [Fact]
    public async Task MobiusStrip_MustBePhenomenon()
    {
        using var context = await CreateContextAsync();
        var mobius = await context.Wonders.FirstOrDefaultAsync(w => w.Slug == "mobius-strip");

        Assert.NotNull(mobius);
        Assert.Equal(ProblemStatus.PHENOMENON, mobius.Status);
    }

    [Fact]
    public async Task BanachTarski_MustBeParadox()
    {
        using var context = await CreateContextAsync();
        var bt = await context.Wonders.FirstOrDefaultAsync(w => w.Slug == "banach-tarski-paradox");

        Assert.NotNull(bt);
        Assert.Equal(ProblemStatus.PARADOX, bt.Status);
    }

    [Fact]
    public async Task AllProblems_MustHaveRigorousStatusIntegrityMetadata()
    {
        using var context = await CreateContextAsync();
        var problems = await context.Problems.ToListAsync();

        Assert.NotEmpty(problems);
        foreach (var problem in problems)
        {
            Assert.False(string.IsNullOrWhiteSpace(problem.LastVerified), $"Problem {problem.Slug} is missing LastVerified.");
            Assert.False(string.IsNullOrWhiteSpace(problem.StatusSource), $"Problem {problem.Slug} is missing StatusSource.");
            Assert.False(string.IsNullOrWhiteSpace(problem.SourceType), $"Problem {problem.Slug} is missing SourceType.");
            Assert.False(string.IsNullOrWhiteSpace(problem.StatusNotes), $"Problem {problem.Slug} is missing StatusNotes.");
        }
    }
}

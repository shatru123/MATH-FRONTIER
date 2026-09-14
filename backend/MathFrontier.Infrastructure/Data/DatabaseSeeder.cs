using MathFrontier.Core.Entities;
using MathFrontier.Core.Enums;
using Microsoft.EntityFrameworkCore;

namespace MathFrontier.Infrastructure.Data;

public static class DatabaseSeeder
{
    public static async Task SeedAsync(MathFrontierDbContext context)
    {
        await context.Database.EnsureCreatedAsync();

        // 1. CATEGORIES
        var categories = new List<Category>
        {
            new Category { Id = 1, Slug = "number-theory", Name = "Number Theory", Description = "The arithmetic of integers, primes, and divisibility.", Icon = "Binary", Color = "#3b82f6", DisplayOrder = 1 },
            new Category { Id = 2, Slug = "topology", Name = "Topology", Description = "Properties of space preserved under continuous deformation.", Icon = "Shapes", Color = "#8b5cf6", DisplayOrder = 2 },
            new Category { Id = 3, Slug = "geometry", Name = "Geometry", Description = "Shapes, curvature, manifolds, and spatial relationships.", Icon = "Compass", Color = "#06b6d4", DisplayOrder = 3 },
            new Category { Id = 4, Slug = "logic-foundations", Name = "Mathematical Logic & Foundations", Description = "Formal proof systems, computability, and independence.", Icon = "Cpu", Color = "#ec4899", DisplayOrder = 4 },
            new Category { Id = 5, Slug = "computer-science", Name = "Theoretical Computer Science", Description = "Complexity classes, algorithmic limits, and automata.", Icon = "Terminal", Color = "#10b981", DisplayOrder = 5 },
            new Category { Id = 6, Slug = "mathematical-physics", Name = "Mathematical Physics", Description = "Fluid dynamics, quantum fields, and spacetime geometry.", Icon = "Atom", Color = "#f59e0b", DisplayOrder = 6 },
            new Category { Id = 7, Slug = "analysis", Name = "Mathematical Analysis", Description = "Limits, differential equations, and complex analysis.", Icon = "TrendingUp", Color = "#6366f1", DisplayOrder = 7 },
            new Category { Id = 8, Slug = "paradoxes", Name = "Paradoxes & Mathematical Phenomena", Description = "Mind-bending theorems, counter-intuitive results, and fractal sets.", Icon = "Sparkles", Color = "#e11d48", DisplayOrder = 8 }
        };

        foreach (var cat in categories)
        {
            if (!await context.Categories.AnyAsync(c => c.Slug == cat.Slug))
            {
                if (await context.Categories.AnyAsync()) cat.Id = 0;
                context.Categories.Add(cat);
            }
        }
        await context.SaveChangesAsync();

        var existingCats = await context.Categories.ToDictionaryAsync(c => c.Slug, c => c.Id);
        var catNumberTheory = new Category { Id = existingCats.GetValueOrDefault("number-theory", 1) };
        var catTopology = new Category { Id = existingCats.GetValueOrDefault("topology", 2) };
        var catGeometry = new Category { Id = existingCats.GetValueOrDefault("geometry", 3) };
        var catLogic = new Category { Id = existingCats.GetValueOrDefault("logic-foundations", 4) };
        var catCS = new Category { Id = existingCats.GetValueOrDefault("computer-science", 5) };
        var catPhysics = new Category { Id = existingCats.GetValueOrDefault("mathematical-physics", 6) };
        var catAnalysis = new Category { Id = existingCats.GetValueOrDefault("analysis", 7) };
        var catParadoxes = new Category { Id = existingCats.GetValueOrDefault("paradoxes", 8) };

        // 2. SOURCES
        var sources = new List<Source>
        {
            new Source { Id = 1, Title = "Clay Mathematics Institute Millennium Prize Problems", Authors = "Carlson, J., Jaffe, A., Wiles, A.", Year = 2006, Publication = "American Mathematical Society", Url = "https://www.claymath.org/millennium-problems/", SourceType = "Foundation", IsPeerReviewed = true, CitationKey = "CMI2006" },
            new Source { Id = 2, Title = "The Riemann Hypothesis: The Greatest Unsolved Problem in Mathematics", Authors = "Sautoy, Marcus du", Year = 2003, Publication = "HarperCollins", Url = "https://www.claymath.org/millennium-problems/riemann-hypothesis", SourceType = "Monograph", IsPeerReviewed = true, CitationKey = "DuSautoy2003" },
            new Source { Id = 3, Title = "The Entropy Formula for the Ricci Flow and Its Geometric Applications", Authors = "Perelman, Grigori", Year = 2002, Publication = "arXiv:math/0211159", Url = "https://arxiv.org/abs/math/0211159", SourceType = "Preprint", IsPeerReviewed = true, CitationKey = "Perelman2002" },
            new Source { Id = 4, Title = "Bounded gaps between primes", Authors = "Zhang, Yitang", Year = 2014, Publication = "Annals of Mathematics, 179(3), 1121-1174", Url = "https://doi.org/10.4007/annals.2014.179.3.11", SourceType = "Journal", IsPeerReviewed = true, CitationKey = "Zhang2014" },
            new Source { Id = 5, Title = "On computable numbers, with an application to the Entscheidungsproblem", Authors = "Turing, Alan M.", Year = 1936, Publication = "Proceedings of the London Mathematical Society, 42(1), 230-265", Url = "https://doi.org/10.1112/plms/s2-42.1.230", SourceType = "Foundational Paper", IsPeerReviewed = true, CitationKey = "Turing1936" },
            new Source { Id = 6, Title = "The Independence of the Continuum Hypothesis", Authors = "Cohen, Paul J.", Year = 1963, Publication = "Proceedings of the National Academy of Sciences, 50(6), 1143-1148", Url = "https://doi.org/10.1073/pnas.50.6.1143", SourceType = "Foundational Paper", IsPeerReviewed = true, CitationKey = "Cohen1963" },
            new Source { Id = 7, Title = "Almost all orbits of the Collatz map attain almost bounded values", Authors = "Tao, Terence", Year = 2022, Publication = "Forum of Mathematics, Pi, 10, e12", Url = "https://doi.org/10.1017/fmp.2022.8", SourceType = "Journal", IsPeerReviewed = true, CitationKey = "Tao2022" },
            new Source { Id = 8, Title = "Modular elliptic curves and Fermat's Last Theorem", Authors = "Wiles, Andrew", Year = 1995, Publication = "Annals of Mathematics, 141(3), 443-551", Url = "https://doi.org/10.2307/2118559", SourceType = "Journal", IsPeerReviewed = true, CitationKey = "Wiles1995" }
        };

        foreach (var s in sources)
        {
            if (!await context.Sources.AnyAsync(x => x.CitationKey == s.CitationKey))
            {
                if (await context.Sources.AnyAsync()) s.Id = 0;
                context.Sources.Add(s);
            }
        }
        await context.SaveChangesAsync();

        // 3. MATHEMATICIANS
        var mathematicians = new List<Mathematician>
        {
            new Mathematician { Id = 1, Slug = "bernhard-riemann", Name = "Bernhard Riemann", BornYear = 1826, DiedYear = 1866, Nationality = "German", Biography = "Revolutionized complex analysis, differential geometry, and analytic number theory.", KeyContributions = new() { "Riemann zeta function", "Riemannian geometry", "Riemann surface" }, Era = "19th Century" },
            new Mathematician { Id = 2, Slug = "grigori-perelman", Name = "Grigori Perelman", BornYear = 1966, DiedYear = null, Nationality = "Russian", Biography = "Proved Thurston's Geometrization Conjecture and thereby the 100-year-old Poincaré Conjecture.", KeyContributions = new() { "Ricci flow with surgery", "Solution of Poincaré Conjecture" }, Era = "Contemporary" },
            new Mathematician { Id = 3, Slug = "alan-turing", Name = "Alan Turing", BornYear = 1912, DiedYear = 1954, Nationality = "British", Biography = "Father of modern computer science and artificial intelligence; proved the undecidability of the halting problem.", KeyContributions = new() { "Turing Machine", "Halting Problem", "Turing Test" }, Era = "20th Century" },
            new Mathematician { Id = 4, Slug = "kurt-godel", Name = "Kurt Gödel", BornYear = 1906, DiedYear = 1978, Nationality = "Austrian-American", Biography = "Disproved Hilbert's program with the Incompleteness Theorems; established the consistency of the Continuum Hypothesis.", KeyContributions = new() { "Incompleteness Theorems", "Constructible Universe L" }, Era = "20th Century" },
            new Mathematician { Id = 5, Slug = "terence-tao", Name = "Terence Tao", BornYear = 1975, DiedYear = null, Nationality = "Australian-American", Biography = "Fields Medalist with monumental breakthroughs across harmonic analysis, PDE, combinatorics, and number theory.", KeyContributions = new() { "Green-Tao Theorem", "Collatz almost-all-orbits result", "Compressed sensing" }, Era = "Contemporary" }
        };

        foreach (var m in mathematicians)
        {
            if (!await context.Mathematicians.AnyAsync(x => x.Slug == m.Slug))
            {
                if (await context.Mathematicians.AnyAsync()) m.Id = 0;
                context.Mathematicians.Add(m);
            }
        }
        await context.SaveChangesAsync();

        // 4. PROBLEMS
        var problems = new List<Problem>
        {
            new Problem
            {
                Id = 1,
                Slug = "riemann-hypothesis",
                Title = "Riemann Hypothesis",
                ShortDescription = "All non-trivial zeros of the Riemann zeta function have a real part equal to 1/2.",
                FullDescription = "Proposed by Bernhard Riemann in 1859, the Riemann Hypothesis connects the distribution of prime numbers to the complex zeros of the analytic continuation of the zeta function. It remains the most celebrated open problem in pure mathematics.",
                Field = "Analytic Number Theory",
                CategoryId = catNumberTheory.Id,
                Status = ProblemStatus.OPEN,
                Difficulty = DifficultyLevel.Extreme,
                YearIntroduced = 1859,
                LastVerified = "2026-03-01",
                StatusSource = "Clay Mathematics Institute / Annals of Mathematics",
                SourceType = "Official Millennium Prize Problem",
                StatusNotes = "Clay Millennium Problem. Verified for the first 10^13 zeros numerically, but computational evidence does not constitute a mathematical proof.",
                MathematicalStatement = @"\zeta(s) = \sum_{n=1}^{\infty} \frac{1}{n^s} = \prod_{p \text{ prime}} \frac{1}{1 - p^{-s}}, \quad \text{for } \Re(s) > 1. \\ \text{All non-trivial zeros of the analytic continuation satisfy } \Re(s) = \frac{1}{2}.",
                Intuition = "Primes look randomly scattered, but the zeta function acts like a musical harmonic spectrum for primes. The Riemann Hypothesis claims that the mathematical 'frequencies' controlling the distribution of primes are completely pure and centered on a single critical line.",
                WhyItMatters = "A proof would yield the sharpest possible bounds for the Prime Number Theorem error term, establish hundreds of conditional theorems in number theory, and confirm deep connections between quantum chaos and complex analysis.",
                WhatWeKnow = new() { "The functional equation establishes symmetry around Re(s) = 1/2.", "At least 41% of non-trivial zeros lie precisely on the critical line (Conrey, 1989; updated by Pratt et al.).", "Over 10 trillion non-trivial zeros have been checked by computers, and all lie on the critical line." },
                WhatWeDontKnow = new() { "Whether a single non-trivial zero lies off the critical line.", "Whether all zeros are simple (multiplicity 1).", "The underlying spectral operator whose eigenvalues are the Riemann zeros." },
                PartialResults = new() { "Hardy (1914): Infinitely many zeros lie on the critical line.", "Levinson (1974): At least 34.7% of zeros are on the line.", "Conrey (1989): More than 40.77% are on the line." },
                CommonMisconceptions = new() { "Checking billions of zeros by computer proves the hypothesis. (False: In number theory, counterexamples can appear at unimaginably high values, e.g., Skewes' number).", "The trivial zeros (s = -2, -4, -6, ...) are on the critical line. (False: They are real negative integers)." },
                History = "Formulated in Riemann's landmark 1859 paper 'On the Number of Primes Less Than a Given Magnitude'. Selected by David Hilbert as Problem 8 in 1900 and as a Millennium Prize Problem in 2000.",
                VisualizationSlug = "riemann-hypothesis",
                HasExperiment = true,
                ExperimentSlug = "riemann-hypothesis",
                RelatedProblems = new() { "twin-prime-conjecture", "goldbach-conjecture" },
                SourceIds = new() { 1, 2 },
                Tags = new() { "Millennium Problem", "Primes", "Zeta Function", "Complex Analysis" },
                ClaimedSolutions = new() { "Atiyah (2018): Claimed proof via Todd polynomials; consensus concluded it contained fundamental gaps.", "Numerous preprints on arXiv appear annually; none have passed peer review." },
                HistoricalStatuses = new() { "1859: Conjectured by Bernhard Riemann", "1900: Hilbert's 8th Problem", "2000: Clay Millennium Prize Problem ($1,000,000)" }
            },
            new Problem
            {
                Id = 2,
                Slug = "p-vs-np",
                Title = "P vs NP Problem",
                ShortDescription = "Can every problem whose solution can be quickly verified also be quickly solved?",
                FullDescription = "Formulated by Stephen Cook (1971) and Leonid Levin (1973), P vs NP asks whether computational decision problems that can be verified in polynomial time can also be solved by an algorithm running in polynomial time.",
                Field = "Theoretical Computer Science",
                CategoryId = catCS.Id,
                Status = ProblemStatus.OPEN,
                Difficulty = DifficultyLevel.Extreme,
                YearIntroduced = 1971,
                LastVerified = "2026-02-15",
                StatusSource = "Clay Mathematics Institute",
                SourceType = "Official Millennium Prize Problem",
                StatusNotes = "Wide consensus among complexity theorists suspects P != NP, but neither a separation nor a collapse has been proven.",
                MathematicalStatement = @"\text{P} = \bigcup_{k \ge 1} \text{DTIME}(n^k) \quad \stackrel{?}{=} \quad \text{NP} = \bigcup_{k \ge 1} \text{NTIME}(n^k)",
                Intuition = "Finding a needle in a haystack is difficult, but checking whether a shiny object is indeed the needle is effortless. Does every problem with easy verification admit an equally easy search method?",
                WhyItMatters = "If P = NP, modern cryptography (RSA, ECC) collapses, algorithmic optimization solves protein folding and scheduling instantaneously, and mathematical discovery could be automated.",
                WhatWeKnow = new() { "Hundreds of vital problems (Traveling Salesperson, Boolean SAT, Knapsack) are NP-complete.", "Relativization, natural proofs, and algebrization barriers prove standard proof techniques cannot resolve P vs NP." },
                WhatWeDontKnow = new() { "Whether P equals NP.", "Whether NP-complete problems require exponential time (Strong Exponential Time Hypothesis)." },
                PartialResults = new() { "Cook-Levin Theorem: SAT is NP-complete.", "Baker-Gill-Solovay (1975): There exist oracles A, B such that P^A = NP^A and P^B != NP^B." },
                CommonMisconceptions = new() { "NP stands for 'Non-Polynomial'. (False: It stands for Nondeterministic Polynomial time).", "Quantum computers solve all NP-complete problems in polynomial time. (False: NP is not believed to be contained in BQP)." },
                History = "Introduced independently by Stephen Cook in the US (1971) and Leonid Levin in the Soviet Union (1973). Godel had already posed a similar question in a 1956 letter to John von Neumann.",
                VisualizationSlug = "p-vs-np",
                HasExperiment = false,
                RelatedProblems = new() { "halting-problem" },
                SourceIds = new() { 1 },
                Tags = new() { "Millennium Problem", "Algorithms", "Complexity Theory", "Cryptography" },
                ClaimedSolutions = new() { "Over 100 claimed proofs of both P = NP and P != NP have been debunked by Gerhard Woeginger's collection." },
                HistoricalStatuses = new() { "1971: Cook formulated NP-completeness", "2000: Clay Millennium Prize Problem" }
            },
            new Problem
            {
                Id = 3,
                Slug = "poincare-conjecture",
                Title = "Poincaré Conjecture",
                ShortDescription = "Every simply connected, closed 3-dimensional manifold is homeomorphic to the 3-sphere.",
                FullDescription = "Posed by Henri Poincaré in 1904, the conjecture asserts that the only compact 3-manifold without boundary where every closed loop can be shrunk to a point is the 3-sphere.",
                Field = "Differential Geometry & Topology",
                CategoryId = catTopology.Id,
                Status = ProblemStatus.SOLVED,
                Difficulty = DifficultyLevel.Extreme,
                YearIntroduced = 1904,
                LastVerified = "2026-01-10",
                StatusSource = "Clay Mathematics Institute / Annals of Mathematics",
                SourceType = "Verified Clay Millennium Solution",
                StatusNotes = "SOLVED by Grigori Perelman in 2002–2003 utilizing Richard Hamilton's Ricci flow with surgery. Verified independently by Kleiner-Lott, Cao-Zhu, and Morgan-Tian.",
                MathematicalStatement = @"\text{Let } M \text{ be a compact 3-manifold without boundary. If } \pi_1(M) = 0, \text{ then } M \cong S^3.",
                Intuition = "If you tie a rubber band around an apple and pull it, you can shrink it to a single point without leaving the apple surface. On a doughnut, loops can wrap through the hole and get stuck. Poincaré asked: is the 3-sphere the only 3D universe where all loops shrink?",
                WhyItMatters = "Completed the classification of 3-manifolds and established Thurston's Geometrization Conjecture, establishing a foundational map of 3D geometry.",
                WhatWeKnow = new() { "The conjecture is fully proved in all dimensions: n >= 5 (Smale, 1961), n = 4 (Freedman, 1982), n = 3 (Perelman, 2003)." },
                WhatWeDontKnow = new() { "The smooth 4-dimensional Poincaré conjecture remains one of the greatest open problems in 4-manifold topology." },
                PartialResults = new() { "Hamilton (1982): Introduced the Ricci flow equation for Riemannian metrics.", "Perelman (2002-2003): Overcame the finite-time singularity problem using surgery and monotonic entropy." },
                CommonMisconceptions = new() { "Dimension 3 was the easiest case. (False: Dimension 3 and 4 were mathematically the hardest because there was no room to untangle intersections like in dimensions >= 5)." },
                History = "Poincaré introduced homology in 1895 and discovered a non-spherical manifold with trivial homology, refining the question to fundamental group in 1904. Solved by Perelman in 2002, who famously declined the $1M prize and Fields Medal.",
                VisualizationSlug = "poincare-conjecture",
                HasExperiment = false,
                RelatedProblems = new() { "hodge-conjecture" },
                SourceIds = new() { 1, 3 },
                Tags = new() { "Solved", "Topology", "Ricci Flow", "Millennium Problem" },
                ClaimedSolutions = new() { "Perelman's proof accepted by mathematical community in 2006." },
                HistoricalStatuses = new() { "1904: Conjectured by Henri Poincaré", "2000: Clay Millennium Prize Problem", "2003: Proved by Grigori Perelman", "2006: Solution officially verified; Fields Medal awarded" }
            },
            new Problem
            {
                Id = 4,
                Slug = "navier-stokes-smoothness",
                Title = "Navier–Stokes Existence and Smoothness",
                ShortDescription = "Do smooth, physically reasonable solutions always exist for the 3D incompressible Navier-Stokes equations?",
                FullDescription = "The Navier-Stokes equations govern the motion of viscous fluids (water, air). The open mathematical challenge is to prove whether solutions starting from smooth initial data remain smooth for all time or can develop finite-time singularities (blow-up).",
                Field = "Mathematical Physics & PDE",
                CategoryId = catPhysics.Id,
                Status = ProblemStatus.OPEN,
                Difficulty = DifficultyLevel.Extreme,
                YearIntroduced = 1845,
                LastVerified = "2026-03-05",
                StatusSource = "Clay Mathematics Institute",
                SourceType = "Official Millennium Prize Problem",
                StatusNotes = "Official status is OPEN. Periodic claims of blow-up or global regularity appear in literature but either contain errors or apply to modified equations.",
                MathematicalStatement = @"\frac{\partial \mathbf{u}}{\partial t} + (\mathbf{u} \cdot \nabla)\mathbf{u} = -\frac{1}{\rho}\nabla p + \nu \nabla^2 \mathbf{u} + \mathbf{f}, \quad \nabla \cdot \mathbf{u} = 0",
                Intuition = "When water flows, it can form violent eddies and turbulence. Does fluid velocity or vorticity ever concentrate to infinity at a single point in finite time, or does viscosity always keep the fluid smooth?",
                WhyItMatters = "Understanding fluid turbulence is essential for aerodynamics, climate modeling, and theoretical physics. A breakdown in smoothness would indicate classical fluid mechanics is mathematically incomplete.",
                WhatWeKnow = new() { "Global smooth solutions exist in 2 dimensions (Leray, 1934).", "Weak solutions exist globally in 3 dimensions (Leray-Hopf weak solutions), but their uniqueness and smoothness remain unproven.", "If a singularity forms, the vorticity must blow up sufficiently fast (Beale-Kato-Majda criterion)." },
                WhatWeDontKnow = new() { "Whether a smooth 3D flow can blow up in finite time from smooth initial conditions of finite energy." },
                PartialResults = new() { "Caffarelli-Kohn-Nirenberg (1982): Singular set in space-time has 1D Hausdorff measure zero.", "Tao (2016): Finite-time blow-up exists for an averaged version of Navier-Stokes." },
                CommonMisconceptions = new() { "Computer simulations showing turbulence prove singularities exist. (False: Numerical grids have finite resolution and cannot distinguish between high peaks and true infinite blow-up)." },
                History = "Formulated by Claude-Louis Navier (1822) and George Gabriel Stokes (1845). Included among the Clay Millennium Problems in 2000.",
                VisualizationSlug = "navier-stokes",
                HasExperiment = false,
                RelatedProblems = new() { "yang-mills-mass-gap" },
                SourceIds = new() { 1 },
                Tags = new() { "Millennium Problem", "Fluids", "PDE", "Turbulence" },
                ClaimedSolutions = new() { "Mukhtarbay Otelbaev (2014) claimed proof of regularity; counterexample found.", "Thomas Hou et al. (2022) demonstrated singularity for 3D Euler with boundary, but Navier-Stokes remains open." },
                HistoricalStatuses = new() { "1845: Formulated by Stokes", "2000: Clay Millennium Prize Problem", "Status requires verification: Ongoing active research" }
            },
            new Problem
            {
                Id = 5,
                Slug = "collatz-conjecture",
                Title = "Collatz Conjecture (3n + 1 Problem)",
                ShortDescription = "Does the iterative map n/2 (even) or 3n+1 (odd) always reach the cycle 4 -> 2 -> 1 for every positive integer?",
                FullDescription = "Named after Lothar Collatz (1937), the conjecture posits that repeating the simple arithmetic rule f(n) = n/2 if n is even, and f(n) = 3n + 1 if n is odd, always eventually arrives at 1.",
                Field = "Dynamical Systems & Number Theory",
                CategoryId = catNumberTheory.Id,
                Status = ProblemStatus.OPEN,
                Difficulty = DifficultyLevel.Intermediate,
                YearIntroduced = 1937,
                LastVerified = "2026-03-01",
                StatusSource = "Annals of Mathematics / Tao (2022)",
                SourceType = "Peer-Reviewed Research Literature",
                StatusNotes = "OPEN. Paul Erdős remarked: 'Mathematics may not yet be ready for such problems.' Verified for all integers up to 2^68.",
                MathematicalStatement = @"T(n) = \begin{cases} \frac{n}{2}, & \text{if } n \equiv 0 \pmod 2 \\ 3n + 1, & \text{if } n \equiv 1 \pmod 2 \end{cases} \\ \forall n \in \mathbb{Z}^+, \exists k \text{ such that } T^{(k)}(n) = 1.",
                Intuition = "Odd steps multiply by 3 and add 1, sending the number upward. But adding 1 to an odd number creates an even number, guaranteeing at least one division by 2, and often several in a row. On average, geometric descent wins, but proving every single path converges is brutally hard.",
                WhyItMatters = "Collatz embodies how elementary arithmetic rules can generate unpredictable, pseudo-random trajectories with undecidable flavors.",
                WhatWeKnow = new() { "Verified computationally for all start values up to ~2.95 * 10^20.", "Terras (1976): Almost all integers (in logarithmic density) reach a value smaller than their starting point.", "Terence Tao (2019/2022): Almost all Collatz orbits attain almost arbitrarily small values." },
                WhatWeDontKnow = new() { "Whether an integer exists whose trajectory grows to infinity (divergent trajectory).", "Whether another cycle exists besides 4 -> 2 -> 1." },
                PartialResults = new() { "Steiner (1977): There is no other cycle with only one valley.", "Eliahou (1993): Any other cycle must have a period greater than 17 billion." },
                CommonMisconceptions = new() { "Checking numbers up to 2^68 means it is almost certainly true without doubt. (False: Some number theoretic patterns fail only at 10^100 or beyond)." },
                History = "Circulated orally by Lothar Collatz, Stanislaw Ulam, and Shizuo Kakutani in the 1930s-1950s.",
                VisualizationSlug = "collatz-conjecture",
                HasExperiment = true,
                ExperimentSlug = "collatz-lab",
                RelatedProblems = new() { "goldbach-conjecture", "halting-problem" },
                SourceIds = new() { 7 },
                Tags = new() { "Number Theory", "Recursion", "Dynamical Systems", "Interactive Lab" },
                ClaimedSolutions = new() { "Dozens of elementary 'proofs' posted on preprint servers yearly, none mathematically valid." },
                HistoricalStatuses = new() { "1937: Proposed by Lothar Collatz", "2019: Terence Tao proves almost all orbits reach almost arbitrarily small values" }
            },
            new Problem
            {
                Id = 6,
                Slug = "goldbach-conjecture",
                Title = "Goldbach Conjecture",
                ShortDescription = "Every even integer greater than 2 can be expressed as the sum of two primes.",
                FullDescription = "Proposed by Christian Goldbach in a 1742 letter to Leonhard Euler, this is one of the oldest and best-known unsolved conjectures in number theory.",
                Field = "Additive Number Theory",
                CategoryId = catNumberTheory.Id,
                Status = ProblemStatus.OPEN,
                Difficulty = DifficultyLevel.Advanced,
                YearIntroduced = 1742,
                LastVerified = "2026-02-28",
                StatusSource = "Mathematical Reviews / Silva et al.",
                SourceType = "Academic Consensus",
                StatusNotes = "OPEN. The weak (ternary) Goldbach conjecture was proved by Harald Helfgott in 2013. The strong (binary) conjecture remains unproven.",
                MathematicalStatement = @"\forall n \in 2\mathbb{N}, \, n > 2 \implies \exists p, q \in \mathbb{P} \text{ such that } n = p + q.",
                Intuition = "As numbers grow larger, the quantity of prime numbers below them grows, providing more and more potential combinations to sum to n. The Goldbach comet visualization illustrates this abundance, yet proving no even number is missed is extraordinarily difficult.",
                WhyItMatters = "Resolving Goldbach would unlock deep secrets about the additive distribution of primes, which are inherently multiplicative objects.",
                WhatWeKnow = new() { "Verified computationally for all even integers up to 4 * 10^18 (Silva et al., 2014).", "Weak Goldbach conjecture (every odd integer > 5 is sum of three primes) is fully proved (Helfgott, 2013).", "Chen's Theorem (1973): Every sufficiently large even integer is the sum of a prime and a semiprime (p + p1*p2)." },
                WhatWeDontKnow = new() { "Whether there exists an even integer that cannot be written as the sum of two primes." },
                PartialResults = new() { "Schnirelmann (1930): Every integer > 1 is the sum of at most C primes for some constant C.", "Vinogradov (1937): Proved ternary Goldbach for all sufficiently large odd numbers." },
                CommonMisconceptions = new() { "Since ternary Goldbach is proved, binary must be close. (False: The circle method yields cancellations for 3 variables that vanish for 2)." },
                History = "Christian Goldbach wrote to Leonhard Euler on 7 June 1742 proposing the conjecture. Euler replied that he regarded it as completely certain, although he could not prove it.",
                VisualizationSlug = "goldbach-conjecture",
                HasExperiment = true,
                ExperimentSlug = "goldbach-lab",
                RelatedProblems = new() { "twin-prime-conjecture", "riemann-hypothesis" },
                SourceIds = new() { 4 },
                Tags = new() { "Number Theory", "Primes", "Additive Combinatorics", "Interactive Lab" },
                ClaimedSolutions = new() { "No peer-reviewed proof of the binary conjecture exists." },
                HistoricalStatuses = new() { "1742: Goldbach letter to Euler", "2013: Harald Helfgott proves weak Goldbach conjecture" }
            },
            new Problem
            {
                Id = 7,
                Slug = "twin-prime-conjecture",
                Title = "Twin Prime Conjecture",
                ShortDescription = "Are there infinitely many pairs of prime numbers that differ by exactly 2?",
                FullDescription = "The conjecture asserts that the gap between consecutive primes equals 2 infinitely often: (3,5), (5,7), (11,13), (17,19), etc.",
                Field = "Analytic Number Theory",
                CategoryId = catNumberTheory.Id,
                Status = ProblemStatus.OPEN,
                Difficulty = DifficultyLevel.Advanced,
                YearIntroduced = 1846,
                LastVerified = "2026-03-01",
                StatusSource = "Annals of Mathematics / Polymath8",
                SourceType = "Peer-Reviewed Literature",
                StatusNotes = "OPEN. Yitang Zhang (2013) proved bounded prime gaps < 70,000,000. Polymath8 and Maynard reduced the gap to <= 246 unconditionally.",
                MathematicalStatement = @"\liminf_{n \to \infty} (p_{n+1} - p_n) = 2",
                Intuition = "As numbers get larger, primes become rarer (by the Prime Number Theorem, density around x is 1/ln(x)). Do they eventually drift apart forever, or do prime twins persist throughout infinity?",
                WhyItMatters = "Reveals the micro-structure of prime distributions and the power of sieve methods.",
                WhatWeKnow = new() { "There exist infinitely many prime pairs with gap <= 246 unconditionally (Polymath8b, 2014; Maynard, 2013).", "Assuming the Generalized Elliott-Halberstam Conjecture, the gap is at most 6 (and 12 under Elliott-Halberstam)." },
                WhatWeDontKnow = new() { "Whether the gap can be reduced all the way from 246 to 2 unconditionally." },
                PartialResults = new() { "Brun (1919): The sum of reciprocals of twin primes converges (Brun's constant B_2 ~ 1.90216).", "Zhang (2013): First finite bound (< 70 million)." },
                CommonMisconceptions = new() { "Twin primes become impossible for huge numbers. (False: The largest known twin prime pair has over 388,000 decimal digits)." },
                History = "Formulated by Alphonse de Polignac in 1846 in more general form (Polignac's conjecture for any even gap 2k). Dramatic breakthrough in 2013 by Yitang Zhang.",
                VisualizationSlug = "twin-prime-conjecture",
                HasExperiment = true,
                ExperimentSlug = "twin-prime-lab",
                RelatedProblems = new() { "goldbach-conjecture", "riemann-hypothesis" },
                SourceIds = new() { 4 },
                Tags = new() { "Number Theory", "Primes", "Sieve Theory", "Interactive Lab" },
                ClaimedSolutions = new() { "No complete proof for gap = 2 has yet been accepted." },
                HistoricalStatuses = new() { "1846: Stated by Alphonse de Polignac", "2013: Yitang Zhang proves bound < 70,000,000", "2014: Polymath8 reduces bound to 246" }
            },
            new Problem
            {
                Id = 8,
                Slug = "halting-problem",
                Title = "The Halting Problem",
                ShortDescription = "Can a general algorithm determine whether an arbitrary computer program will ever finish running?",
                FullDescription = "Alan Turing proved in 1936 that it is logically impossible for any algorithm to determine, for all possible program-input pairs, whether the program will halt or run forever.",
                Field = "Mathematical Logic & Computability",
                CategoryId = catLogic.Id,
                Status = ProblemStatus.UNDECIDABLE,
                Difficulty = DifficultyLevel.Advanced,
                YearIntroduced = 1936,
                LastVerified = "2026-01-01",
                StatusSource = "Turing (1936) / Foundational Theorem",
                SourceType = "Proven Undecidable",
                StatusNotes = "PROVEN UNDECIDABLE. This is not an open question waiting for a proof. It is a mathematical theorem that no such general algorithm can exist.",
                MathematicalStatement = @"H = \{ \langle M, w \rangle \mid M \text{ is a Turing machine and } M \text{ halts on input } w \} \notin \mathbf{R} \quad (\text{not recursive})",
                Intuition = "Suppose a master program 'WillHalt(P, x)' existed. We could write a paradoxical program 'Opposite(P)' that asks WillHalt what it does: if WillHalt says Opposite will halt, Opposite enters an infinite loop; if WillHalt says it loops, Opposite halts immediately. A logical contradiction arises.",
                WhyItMatters = "Established the fundamental boundaries of computation. Proves that static program analysis has theoretical limits and directly implies Rice's theorem and Gödel's incompleteness.",
                WhatWeKnow = new() { "The halting problem is undecidable for Turing machines and all equivalent universal computational models.", "The set of halting programs is recursively enumerable (Turing-recognizable) but not decidable." },
                WhatWeDontKnow = new() { "Not applicable; the question is fully resolved by mathematical proof." },
                PartialResults = new() { "Turing (1936): Original proof using diagonalization.", "Rice's Theorem (1953): Every non-trivial semantic property of programs is undecidable." },
                CommonMisconceptions = new() { "The halting problem is an unsolved problem waiting for a smarter coder. (False: It is mathematically proved to be impossible).", "Computers can never tell if any program halts. (False: For many specific programs, halting is easy to prove; no single algorithm works for ALL programs)." },
                History = "Published in Alan Turing's groundbreaking 1936 paper resolving David Hilbert's Entscheidungsproblem.",
                VisualizationSlug = "halting-problem",
                HasExperiment = false,
                RelatedProblems = new() { "continuum-hypothesis", "p-vs-np" },
                SourceIds = new() { 5 },
                Tags = new() { "Undecidable", "Turing Machine", "Logic", "Foundations" },
                ClaimedSolutions = new() { "Not applicable; proved undecidable in 1936." },
                HistoricalStatuses = new() { "1936: Alan Turing proves undecidability" }
            },
            new Problem
            {
                Id = 9,
                Slug = "continuum-hypothesis",
                Title = "The Continuum Hypothesis",
                ShortDescription = "Is there a set whose size is strictly between that of the integers and the real numbers?",
                FullDescription = "Posed by Georg Cantor in 1878, the Continuum Hypothesis states that there is no set whose cardinality is strictly between that of the integers and the real numbers: 2^aleph_0 = aleph_1.",
                Field = "Set Theory & Foundations",
                CategoryId = catLogic.Id,
                Status = ProblemStatus.INDEPENDENT,
                Difficulty = DifficultyLevel.Extreme,
                YearIntroduced = 1878,
                LastVerified = "2026-01-01",
                StatusSource = "Gödel (1940), Cohen (1963)",
                SourceType = "Proven Independent of ZFC",
                StatusNotes = "INDEPENDENT of standard ZFC axioms. Gödel showed CH cannot be disproved; Cohen proved it cannot be proved. It is mathematically independent.",
                MathematicalStatement = @"2^{\aleph_0} = \aleph_1 \quad \Longleftrightarrow \quad \text{There is no set } S \text{ such that } |\mathbb{N}| < |S| < |\mathbb{R}|.",
                Intuition = "Infinity comes in different sizes. The integers are countably infinite; the real numbers are uncountably infinite. Cantor asked: is there any size in between, or do the reals immediately follow the integers?",
                WhyItMatters = "Revealed that fundamental mathematical questions can transcend the standard axiomatic framework (ZFC), driving modern research into large cardinal axioms and forcing.",
                WhatWeKnow = new() { "Gödel (1940): Constructed the inner model L where CH is true, proving Con(ZFC) -> Con(ZFC + CH).", "Cohen (1963): Invented forcing, constructing models where CH is false, proving Con(ZFC) -> Con(ZFC + not CH).", "CH is undecidable within ZFC." },
                WhatWeDontKnow = new() { "Whether a natural extension of ZFC (such as Woodin's Ultimate L program) will eventually resolve CH from new philosophical consensus." },
                PartialResults = new() { "Cantor (1878): Formulated CH.", "Easton's Theorem: Continuum function for regular cardinals can behave in almost any monotonic fashion." },
                CommonMisconceptions = new() { "Independent means we just don't know the answer yet. (False: It means the standard rules of mathematics cannot prove or disprove it, just like the parallel postulate in Euclidean geometry)." },
                History = "Cantor struggled for decades trying to prove it. Selected by Hilbert as Problem 1 at the 1900 ICM. Resolved by Gödel (1940) and Cohen (1963).",
                VisualizationSlug = "continuum-hypothesis",
                HasExperiment = false,
                RelatedProblems = new() { "halting-problem" },
                SourceIds = new() { 6 },
                Tags = new() { "Independent", "Set Theory", "Cantor", "Godel", "Cohen" },
                ClaimedSolutions = new() { "Not applicable; independence is rigorously proven." },
                HistoricalStatuses = new() { "1878: Posed by Cantor", "1900: Hilbert's 1st Problem", "1940: Gödel proves consistency", "1963: Cohen proves independence via forcing" }
            },
            new Problem
            {
                Id = 10,
                Slug = "birch-swinnerton-dyer",
                Title = "Birch and Swinnerton-Dyer Conjecture",
                ShortDescription = "Relates the number of rational points on an elliptic curve to the behavior of its L-function at s = 1.",
                FullDescription = "The BSD conjecture asserts that the rank of the abelian group of rational points on an elliptic curve E is equal to the order of the zero of its L-function L(E, s) at s = 1.",
                Field = "Arithmetic Geometry",
                CategoryId = catNumberTheory.Id,
                Status = ProblemStatus.OPEN,
                Difficulty = DifficultyLevel.Extreme,
                YearIntroduced = 1965,
                LastVerified = "2026-01-01",
                StatusSource = "Clay Mathematics Institute",
                SourceType = "Official Millennium Prize Problem",
                StatusNotes = "Clay Millennium Problem. Proved for rank 0 and rank 1 by Gross-Zagier and Kolyvagin.",
                MathematicalStatement = @"\text{ord}_{s=1} L(E, s) = \text{rank}(E(\mathbb{Q}))",
                Intuition = "Elliptic curves are cubic equations y^2 = x^3 + ax + b. Finding rational points on them is notoriously hard. BSD suggests an analytic function (L-function) contains an exact fingerprint of the curve's rational geometry.",
                WhyItMatters = "One of the deepest bridges between analysis and arithmetic geometry.",
                WhatWeKnow = new() { "Gross-Zagier (1986) and Kolyvagin (1989): Proved BSD when the analytic rank is 0 or 1.", "Bhargava-Shankar (2015): A positive proportion of elliptic curves have rank 0 and satisfy BSD." },
                WhatWeDontKnow = new() { "Whether BSD holds for curves of rank >= 2." },
                PartialResults = new() { "Proved for curves with complex multiplication (Coates-Wiles, 1977)." },
                CommonMisconceptions = new() { "All elliptic curves have infinitely many rational points. (False: Many have rank 0 and only a finite number of points)." },
                History = "Formulated in the 1960s via computer experimentation on EDSAC at Cambridge by Bryan Birch and Peter Swinnerton-Dyer.",
                VisualizationSlug = "birch-swinnerton-dyer",
                HasExperiment = false,
                RelatedProblems = new() { "riemann-hypothesis" },
                SourceIds = new() { 1 },
                Tags = new() { "Millennium Problem", "Elliptic Curves", "L-Functions", "Arithmetic Geometry" },
                ClaimedSolutions = new() {},
                HistoricalStatuses = new() { "1965: Conjectured by Birch and Swinnerton-Dyer", "2000: Clay Millennium Prize Problem" }
            },
            new Problem
            {
                Id = 11,
                Slug = "fermats-last-theorem",
                Title = "Fermat's Last Theorem",
                ShortDescription = "No three positive integers a, b, c can satisfy a^n + b^n = c^n for any integer value of n greater than 2.",
                FullDescription = "First conjectured by Pierre de Fermat in 1637 in the margin of a copy of Arithmetica, where he famously claimed the margin was too narrow to contain his marvelous proof. It stood unproved for 358 years until Andrew Wiles proved it in 1994.",
                Field = "Number Theory & Algebraic Geometry",
                CategoryId = catNumberTheory.Id,
                Status = ProblemStatus.SOLVED,
                Difficulty = DifficultyLevel.Extreme,
                YearIntroduced = 1637,
                LastVerified = "2026-01-01",
                StatusSource = "Annals of Mathematics (Wiles, 1995)",
                SourceType = "Verified Breakthrough Theorem",
                StatusNotes = "SOLVED by Andrew Wiles with assistance from Richard Taylor in 1994, published in 1995.",
                MathematicalStatement = @"a^n + b^n = c^n \quad \text{has no non-trivial integer solutions for } n > 2.",
                Intuition = "For n = 2, there are infinite Pythagorean triples (3^2 + 4^2 = 5^2). Fermat claimed that for cubes, 4th powers, and all higher powers, such integer balance is completely impossible.",
                WhyItMatters = "Wiles' proof established the modularity theorem for semistable elliptic curves, revolutionizing the Langlands program and modern number theory.",
                WhatWeKnow = new() { "Fully proved for all n > 2 by Andrew Wiles and Richard Taylor (1995)." },
                WhatWeDontKnow = new() { "Whether Fermat actually possessed a proof (mathematical consensus is that he was mistaken or had a flawed argument)." },
                PartialResults = new() { "Euler: Proved n = 3.", "Fermat: Proved n = 4 via method of infinite descent.", "Kummer: Proved for regular primes." },
                CommonMisconceptions = new() { "Fermat's proof was lost. (False: The modern proof requires 20th-century tools that could not have been known to Fermat)." },
                History = "Conjectured in 1637; finally resolved in 1994 by Andrew Wiles after seven years of secret research.",
                VisualizationSlug = "fermats-last-theorem",
                HasExperiment = false,
                RelatedProblems = new() { "beal-conjecture", "birch-swinnerton-dyer" },
                SourceIds = new() { 8 },
                Tags = new() { "Solved", "Number Theory", "Elliptic Curves", "Modularity" },
                ClaimedSolutions = new() { "Wiles' proof accepted 1995." },
                HistoricalStatuses = new() { "1637: Conjectured by Fermat", "1994: Solved by Andrew Wiles" }
            },
            new Problem
            {
                Id = 12,
                Slug = "hodge-conjecture",
                Title = "Hodge Conjecture",
                ShortDescription = "On projective complex algebraic varieties, Hodge classes are rational linear combinations of algebraic cycles.",
                FullDescription = "Posed by W. V. D. Hodge in 1950, this Clay Millennium Problem asserts that for projective algebraic varieties, topological information (Hodge de Rham cohomology classes) can be completely realized by geometric algebraic subvarieties.",
                Field = "Algebraic Geometry & Complex Geometry",
                CategoryId = catGeometry.Id,
                Status = ProblemStatus.OPEN,
                Difficulty = DifficultyLevel.Extreme,
                YearIntroduced = 1950,
                LastVerified = "2026-03-01",
                StatusSource = "Clay Mathematics Institute",
                SourceType = "Official Millennium Prize Problem",
                StatusNotes = "Clay Millennium Problem. OPEN. Known for dimension <= 3 and for divisors (Lefschetz (1,1)-theorem), but open in general.",
                MathematicalStatement = @"\text{Let } X \text{ be a non-singular complex projective manifold. Every Hodge class in } H^{2k}(X, \mathbb{Q}) \cap H^{k,k}(X) \text{ is a rational linear combination of cohomology classes of algebraic cycles.}",
                Intuition = "Can the topological shape of an algebraic space always be constructed purely out of geometric algebraic shapes (zero sets of polynomials)? Hodge conjectured that specific harmonic differential forms always correspond to algebraic subvarieties.",
                WhyItMatters = "Provides the foundational link between topology, analysis (differential forms), and algebraic geometry (zero sets of polynomials).",
                WhatWeKnow = new() { "Proved for degree (1,1) classes by the Lefschetz (1,1) theorem (1924).", "Proved for varieties of dimension at most 3.", "Integral Hodge conjecture is known to be false (Atiyah-Hirzebruch counterexample), but the rational Hodge conjecture remains open." },
                WhatWeDontKnow = new() { "Whether Hodge classes of codimension >= 2 on arbitrary projective varieties are algebraic with rational coefficients." },
                PartialResults = new() { "Lefschetz (1,1)-theorem: All (1,1) integral classes are algebraic.", "Deligne (1971): Proved Hodge theory for singular varieties." },
                CommonMisconceptions = new() { "The conjecture applies with integer coefficients. (False: Counterexamples by Atiyah & Hirzebruch require rational coefficients Q)." },
                History = "Formulated by W. V. D. Hodge at the 1950 International Congress of Mathematicians in Cambridge, Massachusetts. Selected as a Clay Millennium Problem in 2000.",
                VisualizationSlug = null,
                HasExperiment = false,
                RelatedProblems = new() { "poincare-conjecture", "birch-swinnerton-dyer" },
                SourceIds = new() { 1 },
                Tags = new() { "Millennium Problem", "Algebraic Geometry", "Cohomology", "Differential Forms" },
                ClaimedSolutions = new() {},
                HistoricalStatuses = new() { "1950: Conjectured by W. V. D. Hodge", "2000: Clay Millennium Prize Problem" }
            },
            new Problem
            {
                Id = 13,
                Slug = "yang-mills-mass-gap",
                Title = "Yang–Mills Existence and Mass Gap",
                ShortDescription = "Prove that quantum Yang-Mills theory exists on R^4 and predicts a strictly positive mass gap Delta > 0.",
                FullDescription = "Formulated by Chen Ning Yang and Robert Mills in 1954, non-abelian gauge theory forms the foundation of the Standard Model of particle physics. The mathematical problem is to provide a rigorous axiomatic quantum field theory and prove that the lightest gauge particle has strictly positive mass.",
                Field = "Quantum Field Theory & Mathematical Physics",
                CategoryId = catPhysics.Id,
                Status = ProblemStatus.OPEN,
                Difficulty = DifficultyLevel.Extreme,
                YearIntroduced = 1954,
                LastVerified = "2026-03-01",
                StatusSource = "Clay Mathematics Institute / Jaffe-Witten",
                SourceType = "Official Millennium Prize Problem",
                StatusNotes = "Clay Millennium Problem. OPEN. Supported by lattice QCD simulations and physical experiments, but no mathematically rigorous proof exists in 4D Minkowski space.",
                MathematicalStatement = @"\exists \Delta > 0 \text{ such that every state } \psi \text{ orthogonal to the vacuum } \Omega \text{ satisfies } H \psi \ge \Delta \psi",
                Intuition = "Gluons that carry the strong nuclear force are massless in classical physics, yet nuclear forces have a finite range and bound states (glueballs) have massive weight. Why does a quantum theory of massless particles spontaneously acquire a mass barrier?",
                WhyItMatters = "Explains confinement of quarks, the stability of atomic nuclei, and places relativistic quantum field theory on rigorous mathematical footing.",
                WhatWeKnow = new() { "Rigorous constructive quantum field theory exists in 2D and 3D spacetime.", "Lattice gauge theory confirms the mass gap numerically to high precision.", "Asymptotic freedom proved by Gross, Wilczek, and Politzer (Nobel Prize 2004)." },
                WhatWeDontKnow = new() { "Rigorous mathematical construction of 4D non-abelian quantum gauge theory.", "Mathematical proof of confinement and the positive mass gap." },
                PartialResults = new() { "Wightman axioms and Osterwalder-Schrader reconstruction established.", "Constructive field theory successes in lower dimensions (Glimm-Jaffe)." },
                CommonMisconceptions = new() { "Because physicists use Yang-Mills every day, it is already mathematically proven. (False: The mathematical continuum limit remains non-rigorous)." },
                History = "Introduced by Yang and Mills (1954). Jaffe and Witten authored the official Clay Millennium problem description in 2000.",
                VisualizationSlug = null,
                HasExperiment = false,
                RelatedProblems = new() { "navier-stokes-smoothness" },
                SourceIds = new() { 1 },
                Tags = new() { "Millennium Problem", "Quantum Physics", "Gauge Theory", "Mass Gap" },
                ClaimedSolutions = new() {},
                HistoricalStatuses = new() { "1954: Formulated by Yang and Mills", "2000: Clay Millennium Prize Problem" }
            }
        };

        foreach (var p in problems)
        {
            if (!await context.Problems.AnyAsync(x => x.Slug == p.Slug))
            {
                if (await context.Problems.AnyAsync()) p.Id = 0;
                context.Problems.Add(p);
            }
        }
        await context.SaveChangesAsync();

        // 5. MATHEMATICAL WONDERS
        var wonders = new List<MathematicalWonder>
        {
            new MathematicalWonder
            {
                Id = 1,
                Slug = "mobius-strip",
                Title = "Möbius Strip",
                ShortDescription = "A two-dimensional surface with only one side and only one continuous boundary curve.",
                FullDescription = "Discovered independently by German mathematicians August Ferdinand Möbius and Johann Benedict Listing in 1858, the Möbius strip is the quintessential non-orientable surface. It can be constructed by taking a rectangular strip of paper, giving one end a half-twist (180°), and joining the ends together.",
                CategoryId = catTopology.Id,
                Status = ProblemStatus.PHENOMENON,
                Intuition = "Everyday intuition insists every flat object must have a 'top' and a 'bottom', an 'inside' and an 'outside'. If you paint one side of a standard ring, the other remains unpainted. On a Möbius strip, painting without lifting your brush paints the entire surface.",
                Mathematics = "The Möbius strip is a non-orientable 2-manifold with boundary. Its Euler characteristic is \\chi = 0. Parametrically: x(u,v) = (R + v \\cos(u/2)) \\cos u, y(u,v) = (R + v \\cos(u/2)) \\sin u, z(u,v) = v \\sin(u/2), with u \\in [0, 2\\pi] and v \\in [-w, w].",
                Properties = new() { "One continuous surface (non-orientable)", "One continuous edge boundary (homeomorphic to a circle S^1)", "Euler characteristic chi = 0", "Non-trivial bundle: non-trivial line bundle over the circle S^1" },
                ConstructionSteps = new() { "1. Start with a flat rectangular strip of length L and width w.", "2. Fix one end in 3D space.", "3. Rotate the opposite end smoothly by 180 degrees (pi radians).", "4. Join the two opposite ends together.", "5. The resulting surface has a single continuous side." },
                ParametricEquations = "x(u, v) = (R + v \\cos(u/2)) \\cos u\ny(u, v) = (R + v \\cos(u/2)) \\sin u\nz(u, v) = v \\sin(u/2)",
                VisualizationSlug = "mobius-strip",
                HasExperiment = true,
                ExperimentSlug = "mobius-strip",
                Tags = new() { "Topology", "Non-orientable", "Flagship 3D", "Parametric" },
                Sources = new() { "Möbius, A. F. (1858). 'Über die Bestimmung des Inhaltes eines Polyëders'", "Listing, J. B. (1858). 'Vorstudien zur Topologie'" }
            },
            new MathematicalWonder
            {
                Id = 2,
                Slug = "klein-bottle",
                Title = "Klein Bottle",
                ShortDescription = "A closed non-orientable surface with no boundary, no inside, and no outside.",
                FullDescription = "Described in 1882 by Felix Klein, the Klein bottle is a closed two-dimensional surface that cannot be embedded in three-dimensional Euclidean space without self-intersecting. In four dimensions, it can pass through itself smoothly with no self-intersection.",
                CategoryId = catTopology.Id,
                Status = ProblemStatus.PHENOMENON,
                Intuition = "Imagine sewing two Möbius strips together along their single boundaries. You create a closed bottle that has no inside and no outside. A bug crawling along its surface can travel from the 'inside' to the 'outside' without ever crossing an edge.",
                Mathematics = "A compact, connected 2-manifold without boundary with Euler characteristic \\chi = 0. Its fundamental group is \\pi_1(K) = \\langle a, b \\mid a b a^{-1} b = 1 \\rangle. It is formed by identifying the edges of a square with opposite orientation on one pair.",
                Properties = new() { "Zero boundary components (closed surface)", "Non-orientable", "Euler characteristic chi = 0", "Requires 4 dimensions for non-self-intersecting smooth embedding" },
                ConstructionSteps = new() { "1. Take a cylinder.", "2. Bend one end around.", "3. Pass it through the side of the cylinder (in 3D immersion).", "4. Join it with the other end from the inside." },
                ParametricEquations = "Figure-8 immersion: x(u,v) = (r + \\cos(u/2)\\sin v - \\sin(u/2)\\sin 2v)\\cos u\ny(u,v) = (r + \\cos(u/2)\\sin v - \\sin(u/2)\\sin 2v)\\sin u\nz(u,v) = \\sin(u/2)\\sin v + \\cos(u/2)\\sin 2v",
                VisualizationSlug = "klein-bottle",
                HasExperiment = true,
                ExperimentSlug = "klein-bottle",
                Tags = new() { "Topology", "Non-orientable", "4D Geometry", "Interactive 3D" },
                Sources = new() { "Klein, Felix (1882). 'Über Riemann's Theorie der algebraischen Functionen'" }
            },
            new MathematicalWonder
            {
                Id = 3,
                Slug = "torus",
                Title = "Parametric Torus",
                ShortDescription = "A doughnut-shaped surface of revolution with genus 1 and rich topological cycles.",
                FullDescription = "The standard torus is a surface of revolution generated by revolving a circle in three-dimensional space about an axis coplanar with the circle. Topologically, it is the product of two circles: S^1 x S^1.",
                CategoryId = catTopology.Id,
                Status = ProblemStatus.PHENOMENON,
                Intuition = "Unlike a sphere where every loop shrinks to a point, a torus has two fundamentally distinct non-contractible loops: one wrapping around the hole (meridian) and one wrapping around the body (longitude).",
                Mathematics = "Parametric equations: x(u, v) = (R + r \\cos v) \\cos u, y(u, v) = (R + r \\cos v) \\sin u, z(u, v) = r \\sin v. Euler characteristic \\chi = 2 - 2g = 0 (since genus g = 1). Fundamental group \\pi_1(T^2) = \\mathbb{Z} \\times \\mathbb{Z}.",
                Properties = new() { "Orientable 2-manifold", "Genus g = 1", "Euler characteristic chi = 0", "Product space S^1 x S^1" },
                ConstructionSteps = new() { "1. Take a square sheet.", "2. Roll into a cylinder by gluing left and right edges.", "3. Bend the cylinder into a ring and glue top and bottom circles together." },
                ParametricEquations = "x(u, v) = (R + r \\cos v) \\cos u\ny(u, v) = (R + r \\cos v) \\sin u\nz(u, v) = r \\sin v",
                VisualizationSlug = "torus",
                HasExperiment = true,
                ExperimentSlug = "torus",
                Tags = new() { "Topology", "Geometry", "Manifolds", "Interactive 3D" },
                Sources = new() { "Armstrong, M. A. (1983). 'Basic Topology', Springer" }
            },
            new MathematicalWonder
            {
                Id = 4,
                Slug = "hilberts-hotel",
                Title = "Hilbert's Hotel (Grand Hotel)",
                ShortDescription = "An infinite hotel that is completely full, yet can always accommodate more guests.",
                FullDescription = "Introduced by David Hilbert in a 1924 lecture, this thought experiment demonstrates the paradoxical and counterintuitive properties of countably infinite sets (cardinality aleph_0).",
                CategoryId = catParadoxes.Id,
                Status = ProblemStatus.PARADOX,
                Intuition = "In a finite hotel, full means no vacancies. In Hilbert's Hotel, if 1 guest arrives, tell guest in Room n to move to Room n+1. Room 1 is now empty! If infinitely many arrive, tell guest in Room n to move to Room 2n. All odd rooms become vacant.",
                Mathematics = "Demonstrates that a countably infinite set \\mathbb{N} is equinumerous with its proper subsets: f: n \\mapsto n+1 (bijection between \\mathbb{N} and \\mathbb{N} \\setminus \\{1\\}) and g: n \\mapsto 2n (bijection between \\mathbb{N} and the even numbers).",
                Properties = new() { "Countable infinity aleph_0", "Proper subset bijection", "Dedekind-infinite definition", "Card(N) = Card(N + 1) = Card(2N)" },
                ConstructionSteps = new() { "1. Hotel has rooms 1, 2, 3, ... (all occupied).", "2. Single arrival: Room n -> Room n + 1. Room 1 opens.", "3. K arrivals: Room n -> Room n + K. Rooms 1..K open.", "4. Infinite arrivals: Room n -> Room 2n. All odd rooms open." },
                ParametricEquations = "n \\mapsto n + k \\quad \\text{or} \\quad n \\mapsto 2n",
                VisualizationSlug = "hilberts-hotel",
                HasExperiment = true,
                ExperimentSlug = "hilberts-hotel",
                Tags = new() { "Infinity", "Paradox", "Set Theory", "Hilbert" },
                Sources = new() { "Hilbert, David (1924). 'Über das Unendliche'" }
            },
            new MathematicalWonder
            {
                Id = 5,
                Slug = "banach-tarski-paradox",
                Title = "Banach–Tarski Paradox",
                ShortDescription = "A solid ball in 3D can be split into 5 pieces and reassembled into two identical solid balls.",
                FullDescription = "Proved by Stefan Banach and Alfred Tarski in 1924, this theorem states that a solid three-dimensional ball can be partitioned into a finite number of non-measurable pieces, which can then be rotated and translated (using rigid motions only) to form two identical copies of the original ball.",
                CategoryId = catParadoxes.Id,
                Status = ProblemStatus.PARADOX,
                Intuition = "This seems physically impossible because matter has volume and mass. But the pieces in Banach-Tarski are not solid chunks like cake; they are infinitely jagged, non-measurable point sets that do not have a well-defined volume. It relies fundamentally on the Axiom of Choice.",
                Mathematics = "Relies on the free group on two generators F_2 embedded in the rotation group SO(3). The pieces are constructed using choice functions selecting one representative from each orbit of the action of F_2 on the 2-sphere S^2.",
                Properties = new() { "Requires Axiom of Choice (AC)", "Pieces are non-measurable in Lebesgue measure", "Uses only rigid isometries (rotations + translations)", "False in dimensions 1 and 2 (amenable groups)" },
                ConstructionSteps = new() { "1. Identify the free group F_2 in SO(3).", "2. Partition the sphere into 4 non-measurable sets corresponding to words in F_2.", "3. Rotate the sets to duplicate pieces.", "4. Reassemble using rigid motions into two complete units." },
                ParametricEquations = "R_a, R_b \\in SO(3) \\quad \\text{generating free subgroup } F_2",
                VisualizationSlug = "banach-tarski",
                HasExperiment = true,
                ExperimentSlug = "banach-tarski",
                Tags = new() { "Paradox", "Axiom of Choice", "Measure Theory", "Group Theory" },
                Sources = new() { "Banach, S., Tarski, A. (1924). 'Sur la décomposition des ensembles de points en parties respectivement congruentes'" }
            },
            new MathematicalWonder
            {
                Id = 6,
                Slug = "mandelbrot-set",
                Title = "The Mandelbrot Set",
                ShortDescription = "The set of complex numbers c for which z_{n+1} = z_n^2 + c remains bounded starting from 0.",
                FullDescription = "First defined by Pierre Fatou and Gaston Julia, and visualized in 1980 by Benoit Mandelbrot at IBM, the Mandelbrot set is the benchmark fractal of complex dynamics, displaying infinite self-similarity and boundary complexity.",
                CategoryId = catParadoxes.Id,
                Status = ProblemStatus.PHENOMENON,
                Intuition = "A simple quadratic formula: multiply a number by itself and add a constant. Depending on whether the sequence explodes to infinity or remains bounded, the point belongs inside or outside. At the boundary, infinite beauty and complexity unfold.",
                Mathematics = "M = \\{ c \\in \\mathbb{C} \\mid \\sup_{n \\ge 0} |z_n| < \\infty, \\text{ where } z_0 = 0, z_{n+1} = z_n^2 + c \\}. Connected theorem proved by Douady and Hubbard (1982).",
                Properties = new() { "Connected set (Douady-Hubbard theorem)", "Boundary Hausdorff dimension = 2 (Shishikura, 1998)", "Contains infinitely many baby Mandelbrot copies", "Locally connected conjecture (MLC) remains open" },
                ConstructionSteps = new() { "1. Choose complex number c = x + iy.", "2. Start with z = 0.", "3. Repeat: z -> z^2 + c.", "4. If |z| > 2, point escapes to infinity.", "5. Color according to escape time." },
                ParametricEquations = "z_{n+1} = z_n^2 + c, \\quad z_0 = 0",
                VisualizationSlug = "mandelbrot-set",
                HasExperiment = true,
                ExperimentSlug = "fractal-lab",
                Tags = new() { "Fractals", "Complex Dynamics", "Chaos", "Interactive Lab" },
                Sources = new() { "Mandelbrot, B. (1980). 'Fractal aspects of the iteration of z -> lambda z (1-z)'", "Douady, A., Hubbard, J. (1982). 'Itération des polynômes complexes'" }
            },
            new MathematicalWonder
            {
                Id = 7,
                Slug = "hyperbolic-geometry",
                Title = "Hyperbolic Geometry",
                ShortDescription = "A non-Euclidean geometry where through a point not on a line, infinitely many parallel lines exist.",
                FullDescription = "Developed by Nikolai Lobachevsky, János Bolyai, and Carl Friedrich Gauss, hyperbolic geometry satisfies all of Euclid's axioms except the parallel postulate, exhibiting negative constant Gaussian curvature.",
                CategoryId = catGeometry.Id,
                Status = ProblemStatus.PHENOMENON,
                Intuition = "On a flat sheet, parallel lines never meet and triangles sum to 180°. On a saddle or in a hyperbolic space, space expands exponentially. Lines diverge, and triangle angles always sum to strictly less than 180°.",
                Mathematics = "Curvature K = -1. In the Poincaré disk model \\mathbb{D} = \\{ z \\in \\mathbb{C} : |z| < 1 \\}, geodesics are circular arcs orthogonal to the boundary circle. Metric: ds^2 = 4(dx^2 + dy^2)/(1 - (x^2 + y^2))^2.",
                Properties = new() { "Negatively curved (K < 0)", "Triangle angles sum to < 180 degrees", "Area of triangle is proportional to angle defect: Area = pi - (alpha + beta + gamma)", "Circumference of circle grows exponentially with radius: C = 2 pi sinh(r)" },
                ConstructionSteps = new() { "1. Construct the unit disk in the complex plane.", "2. Define geodesics as diameters and circular arcs meeting boundary at 90 degrees.", "3. Observe parallel lines diverging exponentially." },
                ParametricEquations = "ds = \\frac{2 |dz|}{1 - |z|^2}",
                VisualizationSlug = "hyperbolic-geometry",
                HasExperiment = true,
                ExperimentSlug = "hyperbolic-geometry",
                Tags = new() { "Geometry", "Non-Euclidean", "Poincaré Disk", "Curvature" },
                Sources = new() { "Lobachevsky, N. I. (1829). 'On the Principles of Geometry'", "Bolyai, J. (1832). 'The Science of Absolute Space'" }
            },
            new MathematicalWonder
            {
                Id = 8,
                Slug = "zenos-paradoxes",
                Title = "Zeno's Paradoxes",
                ShortDescription = "Ancient philosophical paradoxes questioning the reality of motion, continuous space, and infinite divisibility.",
                FullDescription = "Devised by Zeno of Elea around 450 BCE to support Parmenides' doctrine that all is one and motion is an illusion. The famous paradoxes—Achilles and the Tortoise, the Dichotomy, and the Arrow—challenged human intuition for millennia until calculus and real analysis resolved infinite series convergence.",
                CategoryId = catParadoxes.Id,
                Status = ProblemStatus.PARADOX,
                Intuition = "Achilles can never overtake a tortoise with a head start: before overtaking it, he must reach where it started; by then, the tortoise has moved ahead. An infinite sequence of tasks must be completed in finite time! Calculus answers: an infinite sum of shrinking time intervals converges to a finite number.",
                Mathematics = @"The infinite sequence of distances d_n = d_0 \cdot r^n (with speed ratio r < 1) yields total distance S = \sum_{n=0}^{\infty} d_0 r^n = \frac{d_0}{1 - r}. In the Dichotomy paradox: \sum_{n=1}^{\infty} \left(\frac{1}{2}\right)^n = \frac{1/2}{1 - 1/2} = 1.",
                Properties = new() { "Infinite series convergence", "Sum of infinite non-zero intervals can be strictly finite", "Geometric progression: S = a / (1 - r)", "Calculus resolution of instantaneous velocity via limits: v(t) = ds/dt = lim_{dt -> 0} ds/dt" },
                ConstructionSteps = new() { "1. Give the Tortoise a 100-meter head start.", "2. Achilles runs 10x faster than the tortoise.", "3. When Achilles runs 100m, Tortoise moves 10m.", "4. When Achilles runs 10m, Tortoise moves 1m.", "5. Sum: 100 + 10 + 1 + 0.1 + ... = 100 / (1 - 0.1) = 111.11... meters.", "6. Achilles passes the tortoise at exactly t = 11.11 seconds." },
                ParametricEquations = @"x_A(t) = v_A \cdot t, \quad x_T(t) = x_0 + v_T \cdot t, \quad t_{\text{catch}} = \frac{x_0}{v_A - v_T}",
                VisualizationSlug = "zenos-paradoxes",
                HasExperiment = true,
                ExperimentSlug = "zenos-paradoxes",
                Tags = new() { "Infinity", "Paradox", "Calculus", "Series", "Interactive Lab" },
                Sources = new() { "Aristotle, Physics VI:9", "Russell, Bertrand (1903). 'The Principles of Mathematics'" }
            },
            new MathematicalWonder
            {
                Id = 9,
                Slug = "projective-plane",
                Title = "Real Projective Plane (Cross-Cap)",
                ShortDescription = "A non-orientable surface with Euler characteristic 1 that cannot be embedded in 3D without self-intersection.",
                FullDescription = "The real projective plane RP^2 is the topological space of lines through the origin in R^3. Topologically, it is formed by taking a 2-sphere and identifying antipodal points, or gluing a disk to the boundary of a Möbius strip.",
                CategoryId = catTopology.Id,
                Status = ProblemStatus.PHENOMENON,
                Intuition = "Imagine standing in the center of a sphere: every line of sight connects two opposite antipodal points. If you decree that opposite points are actually the exact same location, you get the projective plane.",
                Mathematics = @"\mathbb{RP}^2 = (S^2)/_{\sim}, \text{ where } x \sim -x. \text{ Euler characteristic } \chi = 1, \pi_1(\mathbb{RP}^2) = \mathbb{Z}_2. Cross-cap immersion: x = r \sin(2u) \sin^2(v), y = r \sin(u) \cos(2v), z = r \cos(u) \cos(2v).",
                Properties = new() { "Non-orientable compact 2-manifold without boundary", "Euler characteristic chi = 1", "Fundamental group pi_1 = Z_2", "Non-embeddable in R^3 (immersion has self-intersection line)" },
                ConstructionSteps = new() { "1. Take a northern hemisphere of S^2.", "2. Identify opposite boundary points on the equator.", "3. Equivalently, sew a disk onto the boundary of a Möbius strip." },
                ParametricEquations = @"x(u,v) = \frac{1}{2} \sin(2u) \sin^2(v), \quad y(u,v) = \sin(u) \cos(2v), \quad z(u,v) = \cos(u) \cos(2v)",
                VisualizationSlug = "projective-plane",
                HasExperiment = true,
                ExperimentSlug = "projective-plane",
                Tags = new() { "Topology", "Non-orientable", "Projective Geometry", "Interactive 3D" },
                Sources = new() { "Boy, Werner (1901)", "Hilbert & Cohn-Vossen (1932)" }
            },
            new MathematicalWonder
            {
                Id = 10,
                Slug = "cantors-diagonal-argument",
                Title = "Cantor's Diagonal Argument",
                ShortDescription = "A proof that the real numbers are strictly more numerous than the integers: uncountability of the continuum.",
                FullDescription = "Published in 1891 by Georg Cantor, the diagonal argument proved that the set of real numbers is uncountable, establishing that infinity has different magnitudes and revolutionizing mathematical logic.",
                CategoryId = catLogic.Id,
                Status = ProblemStatus.THEOREM,
                Intuition = "Assume you could write an exhaustive list of every real number between 0 and 1. Cantor constructs a new number by taking the first digit of the 1st number and altering it, the second digit of the 2nd number and altering it, and so on. This new diagonal number differs from EVERY number on your list by at least one digit!",
                Mathematics = @"\text{For any enumeration } f: \mathbb{N} \to (0, 1), \text{ define } d \in (0, 1) \text{ with digit } d_n = (f(n)_n + 1) \pmod{10}. \forall k, d \ne f(k), \text{ so } f \text{ cannot be surjective. Hence } |\mathbb{R}| > |\mathbb{N}|.",
                Properties = new() { "Cardinality |R| = 2^{aleph_0} > aleph_0", "Constructive refutation of countability", "Foundation of Turing's halting proof and Gödel's incompleteness" },
                ConstructionSteps = new() { "1. List reals: r_1, r_2, r_3, ...", "2. Look at the diagonal digits: r_1[1], r_2[2], r_3[3], ...", "3. Invert each diagonal digit: d_n = 1 - r_n[n].", "4. Number d cannot be on the list, contradiction!" },
                ParametricEquations = @"d_n = 1 - s_{n,n} \quad \text{for binary sequences}",
                VisualizationSlug = "cantors-diagonal-argument",
                HasExperiment = true,
                ExperimentSlug = "cantors-diagonal-argument",
                Tags = new() { "Infinity", "Set Theory", "Theorem", "Cantor", "Interactive Lab" },
                Sources = new() { "Cantor, Georg (1891). 'Über eine elementare Frage der Mannigfaltigkeitslehre'" }
            },
            new MathematicalWonder
            {
                Id = 11,
                Slug = "birthday-paradox",
                Title = "The Birthday Paradox",
                ShortDescription = "In a group of only 23 people, there is a greater than 50% probability that at least two share the same birthday.",
                FullDescription = "A celebrated veridical paradox of probability theory. Despite intuition suggesting you need around 183 people (half of 365) to get a 50% chance of a shared birthday, only 23 people are required because the number of possible pairs grows quadratically as n(n-1)/2.",
                CategoryId = catParadoxes.Id,
                Status = ProblemStatus.PARADOX,
                Intuition = "You aren't asking if someone has YOUR birthday (which would take ~253 people for 50%). You are asking if ANY two people share ANY birthday. 23 people generate 23 * 22 / 2 = 253 pairwise comparisons!",
                Mathematics = @"P(\text{match}) = 1 - \bar{P} = 1 - \prod_{k=0}^{n-1} \left(1 - \frac{k}{365}\right) \approx 1 - e^{-\frac{n(n-1)}{2 \times 365}}. \text{ For } n = 23, P \approx 50.73\%. \text{ For } n = 70, P \approx 99.9\%.",
                Properties = new() { "Combinatorial explosion of pairs", "Quadratic growth: n(n-1)/2", "Direct cryptographic application: Birthday Attacks on hash functions (SHA, MD5)" },
                ConstructionSteps = new() { "1. Person 1 has 365/365 available birthdays.", "2. Person 2 has 364/365 to avoid collision.", "3. Person 3 has 363/365, etc.", "4. Multiply probabilities of no collision.", "5. Subtract from 1." },
                ParametricEquations = @"P(n) = 1 - \frac{365!}{365^n (365-n)!}",
                VisualizationSlug = "birthday-paradox",
                HasExperiment = true,
                ExperimentSlug = "birthday-paradox",
                Tags = new() { "Probability", "Paradox", "Combinatorics", "Cryptography", "Interactive Lab" },
                Sources = new() { "von Mises, Richard (1939)", "Feller, William (1968). 'An Introduction to Probability Theory'" }
            },
            new MathematicalWonder
            {
                Id = 12,
                Slug = "monty-hall-problem",
                Title = "The Monty Hall Problem",
                ShortDescription = "Switching doors after the host reveals a goat doubles your probability of winning the car from 1/3 to 2/3.",
                FullDescription = "Based on the American television show 'Let's Make a Deal' hosted by Monty Hall, and analyzed famously by Marilyn vos Savant in 1990. Contestants choose one of three doors. The host, knowing what is behind each door, opens one of the remaining two to reveal a goat. Switching doubles your winning chances.",
                CategoryId = catParadoxes.Id,
                Status = ProblemStatus.PARADOX,
                Intuition = "When you first picked, you had a 1/3 chance of picking the car and a 2/3 chance of picking a goat. If you picked a goat (which happens 2/3 of the time), Monty is forced to reveal the other goat, so switching is 100% guaranteed to win the car!",
                Mathematics = @"P(\text{Win} \mid \text{Stay}) = \frac{1}{3}. \quad P(\text{Win} \mid \text{Switch}) = 1 - \frac{1}{3} = \frac{2}{3}. \text{ By Bayes' Theorem: } P(C_2 \mid D_3) = \frac{P(D_3 \mid C_2) P(C_2)}{P(D_3)} = \frac{1 \times 1/3}{1/2} = \frac{2}{3}.",
                Properties = new() { "Conditional probability & Bayes' theorem", "Asymmetric information: host's choice is not random", "Frequentist Monte Carlo convergence to 66.7% vs 33.3%" },
                ConstructionSteps = new() { "1. 3 doors: 1 car, 2 goats.", "2. Contestant picks Door 1 (1/3 car, 2/3 goat).", "3. Host opens Door 3 showing goat.", "4. Contestant switches to Door 2: wins 2/3 of the time." },
                ParametricEquations = @"P(\text{Win switch}) = \frac{N-1}{N} \quad \text{for } N \text{ doors}",
                VisualizationSlug = "monty-hall-problem",
                HasExperiment = true,
                ExperimentSlug = "monty-hall-problem",
                Tags = new() { "Probability", "Paradox", "Bayesian", "Game Theory", "Interactive Lab" },
                Sources = new() { "Selvin, Steve (1975). 'A problem in probability'", "vos Savant, Marilyn (1990). 'Ask Marilyn'" }
            },
            new MathematicalWonder
            {
                Id = 13,
                Slug = "gabriels-horn",
                Title = "Gabriel's Horn (Torricelli's Trumpet)",
                ShortDescription = "A geometric surface of revolution with finite volume (pi) but infinite surface area.",
                FullDescription = "Discovered in 1641 by Italian mathematician Evangelista Torricelli. Revolving the curve y = 1/x from x = 1 to infinity about the x-axis produces a trumpet-shaped solid with a finite volume of pi, yet an infinite surface area.",
                CategoryId = catAnalysis.Id,
                Status = ProblemStatus.PARADOX,
                Intuition = "Painter's paradox: You could completely fill the inside of the horn with a finite can of paint (pi cubic units), yet that exact same amount of paint would not be enough to coat the inside surface of the horn!",
                Mathematics = @"V = \pi \int_{1}^{\infty} \left(\frac{1}{x}\right)^2 dx = \pi \left[ -\frac{1}{x} \right]_1^{\infty} = \pi < \infty. \quad A = 2\pi \int_{1}^{\infty} \frac{1}{x}\sqrt{1 + \frac{1}{x^4}} dx > 2\pi \int_1^{\infty} \frac{1}{x} dx = \infty.",
                Properties = new() { "Finite volume = pi", "Infinite surface area (harmonic divergence)", "Calculus paradox of improper integrals", "Painter's paradox" },
                ConstructionSteps = new() { "1. Plot curve y = 1/x for x in [1, inf).", "2. Revolve curve 360 degrees around x-axis.", "3. Integrate cross-sectional disks: V = pi.", "4. Integrate surface strips: diverges logarithmically to infinity." },
                ParametricEquations = @"x(u, v) = u, \quad y(u, v) = \frac{1}{u} \cos v, \quad z(u, v) = \frac{1}{u} \sin v, \quad u \ge 1",
                VisualizationSlug = "gabriels-horn",
                HasExperiment = true,
                ExperimentSlug = "gabriels-horn",
                Tags = new() { "Calculus", "Analysis", "Paradox", "Integrals", "Interactive 3D" },
                Sources = new() { "Torricelli, Evangelista (1644). 'De solido hyperbolico acuto'" }
            },
            new MathematicalWonder
            {
                Id = 14,
                Slug = "julia-set",
                Title = "Julia Sets",
                ShortDescription = "Complex fractal boundaries formed by repeating z -> z^2 + c for fixed parameter c.",
                FullDescription = "Investigated by Gaston Julia and Pierre Fatou in 1918, Julia sets are the dynamical twin of the Mandelbrot set. While the Mandelbrot set maps parameter c, a Julia set shows the dynamics in the z-plane for a fixed c.",
                CategoryId = catParadoxes.Id,
                Status = ProblemStatus.PHENOMENON,
                Intuition = "Pick any single point c in the Mandelbrot set. It generates an entire Julia fractal universe! If c is inside the Mandelbrot set, its Julia set is connected; if outside, it explodes into Cantor dust.",
                Mathematics = @"J_c = \partial \{ z_0 \in \mathbb{C} \mid \sup_n |f_c^n(z_0)| < \infty \}, \text{ where } f_c(z) = z^2 + c.",
                Properties = new() { "Connected if and only if c in Mandelbrot set M", "Self-similar under backward iterations", "Chaotic repeller for polynomial dynamics" },
                ConstructionSteps = new() { "1. Fix complex constant c.", "2. For every pixel z = x + iy, iterate z -> z^2 + c.", "3. Test if |z| > 2 (escapes).", "4. Color by iteration count." },
                ParametricEquations = @"z_{n+1} = z_n^2 + c",
                VisualizationSlug = "julia-set",
                HasExperiment = true,
                ExperimentSlug = "fractal-lab",
                Tags = new() { "Fractals", "Complex Dynamics", "Chaos", "Interactive Lab" },
                Sources = new() { "Julia, Gaston (1918). 'Mémoire sur l'itération des fonctions rationnelles'" }
            },
            new MathematicalWonder
            {
                Id = 15,
                Slug = "sierpinski-triangle",
                Title = "Sierpiński Triangle",
                ShortDescription = "A fractal triangle with fractional Hausdorff dimension log(3)/log(2) ~ 1.585 and zero area.",
                FullDescription = "Introduced by Wacław Sierpiński in 1915, this self-similar fractal is constructed by recursively removing the central inverted equilateral triangle from each triangular stage.",
                CategoryId = catParadoxes.Id,
                Status = ProblemStatus.PHENOMENON,
                Intuition = "Start with a solid triangle. Remove the middle quarter. Repeat on the 3 remaining triangles forever. At infinity, the remaining dust has zero area, yet its perimeter is infinite, and it forms a connected fractal maze.",
                Mathematics = @"\text{Hausdorff dimension: } d = \frac{\log 3}{\log 2} \approx 1.58496. \text{ Area: } A_n = A_0 \left(\frac{3}{4}\right)^n \to 0. \text{ Perimeter: } P_n = P_0 \left(\frac{3}{2}\right)^n \to \infty.",
                Properties = new() { "Hausdorff dimension log 3 / log 2 ~ 1.585", "Zero Lebesgue measure (Area = 0)", "Infinite perimeter", "Can be generated via Chaos Game or Pascal's Triangle mod 2" },
                ConstructionSteps = new() { "1. Start with an equilateral triangle.", "2. Connect the midpoints of the three edges.", "3. Remove the central triangle.", "4. Recursively repeat on the 3 remaining smaller triangles." },
                ParametricEquations = @"f_1(x) = x/2, \quad f_2(x) = x/2 + (1/2, 0), \quad f_3(x) = x/2 + (1/4, \sqrt{3}/4)",
                VisualizationSlug = "sierpinski-triangle",
                HasExperiment = true,
                ExperimentSlug = "fractal-lab",
                Tags = new() { "Fractals", "Geometry", "Hausdorff Dimension", "Chaos Game" },
                Sources = new() { "Sierpiński, W. (1915). 'Sur une nouvelle courbe continue qui remplit toute une aire plane'" }
            },
            new MathematicalWonder
            {
                Id = 16,
                Slug = "koch-snowflake",
                Title = "Koch Snowflake",
                ShortDescription = "A continuous nowhere-differentiable fractal curve enclosing a finite area within an infinite perimeter.",
                FullDescription = "Introduced by Helge von Koch in 1904, the Koch snowflake is one of the earliest fractals. Beginning with an equilateral triangle, each line segment has its middle third replaced by a triangular tent.",
                CategoryId = catParadoxes.Id,
                Status = ProblemStatus.PHENOMENON,
                Intuition = "A finite island with an infinite shoreline! You can cover the snowflake with a finite circular fence, yet walking along every bay and inlet of its perimeter would require walking an infinite distance.",
                Mathematics = @"\text{Perimeter: } P_n = 3s \left(\frac{4}{3}\right)^n \to \infty. \text{ Area: } A_\infty = \frac{8}{5} A_0. \text{ Dimension: } d = \frac{\log 4}{\log 3} \approx 1.26186.",
                Properties = new() { "Infinite perimeter", "Finite area = 8/5 * Area_0", "Continuous everywhere, differentiable nowhere", "Hausdorff dimension log 4 / log 3 ~ 1.262" },
                ConstructionSteps = new() { "1. Start with an equilateral triangle.", "2. Divide each segment into three equal parts.", "3. Construct an outward equilateral triangle on the middle part.", "4. Remove the base of the new triangle.", "5. Repeat indefinitely." },
                ParametricEquations = @"L_n = L_0 \left(\frac{4}{3}\right)^n",
                VisualizationSlug = "koch-snowflake",
                HasExperiment = true,
                ExperimentSlug = "fractal-lab",
                Tags = new() { "Fractals", "Geometry", "Infinite Perimeter", "Nowhere Differentiable" },
                Sources = new() { "von Koch, H. (1904). 'Sur une courbe continue sans tangente, obtenue par une construction géométrique élémentaire'" }
            },
            new MathematicalWonder
            {
                Id = 17,
                Slug = "cantor-set",
                Title = "The Cantor Set (Cantor Dust)",
                ShortDescription = "A subset of the unit interval that is uncountably infinite, nowhere dense, and has measure zero.",
                FullDescription = "Introduced by Georg Cantor in 1883, the ternary Cantor set is constructed by repeatedly removing the open middle third of each interval segment. It possesses the same number of points as the entire continuous real line, yet occupies zero length.",
                CategoryId = catAnalysis.Id,
                Status = ProblemStatus.PHENOMENON,
                Intuition = "Throw away 1/3 of the line, then 2/9, then 4/27... The total length of the removed pieces sums to exactly 1! Yet infinitely many points remain—in fact, exactly as many as were there at the beginning!",
                Mathematics = @"C = [0, 1] \setminus \bigcup_{n=1}^\infty \bigcup_{k=0}^{3^{n-1}-1} \left( \frac{3k+1}{3^n}, \frac{3k+2}{3^n} \right). \text{ Total length removed } = \sum_{n=1}^\infty \frac{2^{n-1}}{3^n} = 1. |C| = 2^{\aleph_0}, \dim_H(C) = \frac{\log 2}{\log 3} \approx 0.6309.",
                Properties = new() { "Lebesgue measure = 0", "Uncountable cardinality (equinumerous with R)", "Compact, totally disconnected, and perfect", "Hausdorff dimension log 2 / log 3 ~ 0.631" },
                ConstructionSteps = new() { "1. Start with interval [0, 1].", "2. Remove middle third (1/3, 2/3).", "3. Repeat on [0, 1/3] and [2/3, 1].", "4. What remains consists of numbers whose base-3 expansion has no 1s." },
                ParametricEquations = @"C = \left\{ x = \sum_{k=1}^\infty \frac{a_k}{3^k} : a_k \in \{0, 2\} \right\}",
                VisualizationSlug = "cantor-set",
                HasExperiment = true,
                ExperimentSlug = "fractal-lab",
                Tags = new() { "Set Theory", "Analysis", "Topology", "Measure Zero", "Uncountable" },
                Sources = new() { "Cantor, Georg (1883). 'Über unendliche, lineare Punktmannigfaltigkeiten'" }
            },
            new MathematicalWonder
            {
                Id = 18,
                Slug = "dragon-curve",
                Title = "The Heighway Dragon Curve",
                ShortDescription = "A self-similar space-filling fractal curve generated by repeatedly folding a strip of paper in half.",
                FullDescription = "Discovered by NASA physicists John Heighway, Bruce Banks, and William Harter in 1966, and popularized by Martin Gardner in Scientific American. It can be constructed by repeatedly folding a paper strip in half in the same direction, then unfolding every fold to 90 degrees.",
                CategoryId = catParadoxes.Id,
                Status = ProblemStatus.PHENOMENON,
                Intuition = "Fold a strip of paper in half 12 times. Unfold each crease to a 90-degree right angle and look at it from above: a breathtaking, labyrinthine dragon appears that never self-intersects and tiles the plane seamlessly.",
                Mathematics = @"\text{Boundary Hausdorff dimension: } \approx 1.523627. \text{ Area of dragon: exactly equal to the initial segment length squared } / 2. \text{ Tiling: Four dragons meet at a central point to tile } \mathbb{R}^2.",
                Properties = new() { "Paper-folding sequence of 0s and 1s", "Self-similar with 45-degree rotation scaling by 1/sqrt(2)", "Tiles the 2D plane perfectly without gaps or overlap" },
                ConstructionSteps = new() { "1. Fold strip of paper in half.", "2. Fold in half again in same direction.", "3. Unfold each fold to 90 degrees.", "4. Sequence of turns: R, R, L, R, R, L, L, ..." },
                ParametricEquations = @"f_1(z) = \frac{1+i}{2} z, \quad f_2(z) = 1 - \frac{1-i}{2} z",
                VisualizationSlug = "dragon-curve",
                HasExperiment = true,
                ExperimentSlug = "fractal-lab",
                Tags = new() { "Fractals", "Paper Folding", "L-System", "Plane Tiling" },
                Sources = new() { "Gardner, Martin (1967). 'Mathematical Games', Scientific American", "Davis, Chandler & Knuth, Donald (1970)" }
            }
        };

        foreach (var w in wonders)
        {
            if (!await context.Wonders.AnyAsync(x => x.Slug == w.Slug))
            {
                if (await context.Wonders.AnyAsync()) w.Id = 0;
                context.Wonders.Add(w);
            }
        }
        await context.SaveChangesAsync();

        // 6. TIMELINE EVENTS
        var timelineEvents = new List<TimelineEvent>
        {
            new TimelineEvent { Id = 1, Year = 1637, DateDisplay = "1637", Title = "Fermat's Marginal Note", Description = "Pierre de Fermat scribbles his famous conjecture in the margin of Diophantus' Arithmetica.", Significance = "Ignited a 350-year quest that drove the invention of algebraic number theory.", Category = "Number Theory", RelatedProblemSlug = "fermats-last-theorem" },
            new TimelineEvent { Id = 2, Year = 1742, DateDisplay = "June 7, 1742", Title = "Goldbach's Letter to Euler", Description = "Christian Goldbach proposes that every integer greater than 2 is the sum of three primes (refined by Euler to every even integer is the sum of two).", Significance = "Initiated one of the most enduring open problems in additive number theory.", Category = "Number Theory", RelatedProblemSlug = "goldbach-conjecture" },
            new TimelineEvent { Id = 3, Year = 1858, DateDisplay = "1858", Title = "Discovery of the Möbius Strip", Description = "August Ferdinand Möbius and Johann Benedict Listing independently discover the first non-orientable surface.", Significance = "Founded the visual study of topology and orientation.", Category = "Topology", RelatedWonderSlug = "mobius-strip" },
            new TimelineEvent { Id = 4, Year = 1859, DateDisplay = "1859", Title = "Riemann's Landmark Paper", Description = "Bernhard Riemann formulates the Riemann Hypothesis connecting complex zeros of the zeta function to the distribution of primes.", Significance = "The most celebrated open problem in pure mathematics.", Category = "Analysis", RelatedProblemSlug = "riemann-hypothesis" },
            new TimelineEvent { Id = 5, Year = 1882, DateDisplay = "1882", Title = "Felix Klein Conceives the Klein Bottle", Description = "Felix Klein describes a closed non-orientable surface with Euler characteristic 0 that cannot embed in 3D without self-intersecting.", Significance = "Expanded topology beyond physical 3-dimensional embeddings.", Category = "Topology", RelatedWonderSlug = "klein-bottle" },
            new TimelineEvent { Id = 6, Year = 1900, DateDisplay = "August 8, 1900", Title = "Hilbert's 23 Problems", Description = "David Hilbert presents a curated list of 23 unsolved problems at the International Congress of Mathematicians in Paris.", Significance = "Shaped mathematical research throughout the entire 20th century.", Category = "Foundations", RelatedProblemSlug = "riemann-hypothesis" },
            new TimelineEvent { Id = 7, Year = 1904, DateDisplay = "1904", Title = "Poincaré Conjecture Formulated", Description = "Henri Poincaré conjectures that any simply connected closed 3-manifold is homeomorphic to the 3-sphere.", Significance = "Defined the frontier of 3-manifold topology for a century.", Category = "Topology", RelatedProblemSlug = "poincare-conjecture" },
            new TimelineEvent { Id = 8, Year = 1931, DateDisplay = "1931", Title = "Gödel's Incompleteness Theorems", Description = "Kurt Gödel proves that any consistent formal system capable of basic arithmetic contains true statements that cannot be proved within the system.", Significance = "Shattered Hilbert's program and established the limits of formal mathematical proof.", Category = "Logic", RelatedProblemSlug = "halting-problem" },
            new TimelineEvent { Id = 9, Year = 1936, DateDisplay = "1936", Title = "Turing and the Halting Problem", Description = "Alan Turing defines the Turing machine and proves the undecidability of the halting problem.", Significance = "Laid the foundation of theoretical computer science and computability theory.", Category = "Computer Science", RelatedProblemSlug = "halting-problem" },
            new TimelineEvent { Id = 10, Year = 1963, DateDisplay = "1963", Title = "Independence of the Continuum Hypothesis", Description = "Paul Cohen invents forcing and proves that the Continuum Hypothesis cannot be proved from ZFC axioms, completing Gödel's work.", Significance = "Demonstrated independence as a central phenomenon in modern set theory.", Category = "Logic", RelatedProblemSlug = "continuum-hypothesis" },
            new TimelineEvent { Id = 11, Year = 1971, DateDisplay = "1971", Title = "Cook-Levin Theorem: P vs NP", Description = "Stephen Cook and Leonid Levin independently formulate the P vs NP problem and the concept of NP-completeness.", Significance = "The core question of computational efficiency and cryptography.", Category = "Computer Science", RelatedProblemSlug = "p-vs-np" },
            new TimelineEvent { Id = 12, Year = 1994, DateDisplay = "1994", Title = "Fermat's Last Theorem Proved", Description = "Andrew Wiles completes his proof of Fermat's Last Theorem via the modularity theorem for semistable elliptic curves.", Significance = "Triumphant resolution of a 350-year-old mystery.", Category = "Number Theory", RelatedProblemSlug = "fermats-last-theorem" },
            new TimelineEvent { Id = 13, Year = 2000, DateDisplay = "May 24, 2000", Title = "Clay Millennium Prize Problems", Description = "Clay Mathematics Institute establishes seven $1,000,000 prize problems to celebrate mathematics in the new millennium.", Significance = "Established the gold standard catalog of 21st century mathematics.", Category = "Foundations", RelatedProblemSlug = "riemann-hypothesis" },
            new TimelineEvent { Id = 14, Year = 2003, DateDisplay = "2002–2003", Title = "Perelman Proves Poincaré Conjecture", Description = "Grigori Perelman posts three preprints to the arXiv completing Hamilton's Ricci flow program and proving the Poincaré Conjecture.", Significance = "The first (and so far only) Millennium Prize Problem resolved.", Category = "Topology", RelatedProblemSlug = "poincare-conjecture" },
            new TimelineEvent { Id = 15, Year = 2013, DateDisplay = "2013", Title = "Zhang & Maynard Bound Prime Gaps", Description = "Yitang Zhang proves prime gaps < 70 million infinitely often; James Maynard and Polymath8 subsequently reduce the bound to 246.", Significance = "Sensational breakthrough on the Twin Prime Conjecture.", Category = "Number Theory", RelatedProblemSlug = "twin-prime-conjecture" }
        };

        foreach (var t in timelineEvents)
        {
            if (!await context.TimelineEvents.AnyAsync(x => x.Title == t.Title))
            {
                if (await context.TimelineEvents.AnyAsync()) t.Id = 0;
                context.TimelineEvents.Add(t);
            }
        }
        await context.SaveChangesAsync();

        // 7. VISUALIZATIONS
        var visualizations = new List<Visualization>
        {
            new Visualization { Id = 1, Slug = "mobius-strip", Title = "Interactive Möbius Strip Laboratory", Description = "Flagship 3D topological experience featuring step-by-step construction, surface tracing, boundary tracing, normal vector inversion, and parametric mathematics.", Type = VisualizationType.ThreeD, SupportedModes = new() { VisualizationMode.Explore, VisualizationMode.Guided, VisualizationMode.Mathematical } },
            new Visualization { Id = 2, Slug = "klein-bottle", Title = "Klein Bottle 4D Immersion", Description = "Interactive 3D parametric figure-8 Klein bottle with cross-sectional slicing and non-orientability visualizer.", Type = VisualizationType.ThreeD, SupportedModes = new() { VisualizationMode.Explore, VisualizationMode.Guided, VisualizationMode.Mathematical } },
            new Visualization { Id = 3, Slug = "torus", Title = "Parametric Torus & Topological Cycles", Description = "Interactive torus with adjustable major/minor radii, meridian and longitudinal geodesic paths, and cross-section slice.", Type = VisualizationType.ThreeD, SupportedModes = new() { VisualizationMode.Explore, VisualizationMode.Guided, VisualizationMode.Mathematical } },
            new Visualization { Id = 4, Slug = "hyperbolic-geometry", Title = "Poincaré Disk Hyperbolic Plane", Description = "Interactive non-Euclidean geometry visualizer showing geodesics and parallel axiom failure.", Type = VisualizationType.Canvas2D, SupportedModes = new() { VisualizationMode.Explore, VisualizationMode.Guided } },
            new Visualization { Id = 5, Slug = "hilberts-hotel", Title = "Hilbert's Hotel Interactive Simulator", Description = "Animated simulation of countable infinity: room shifts n -> n+1, +10, +100, and +infinity via n -> 2n.", Type = VisualizationType.InteractiveSim, SupportedModes = new() { VisualizationMode.Explore, VisualizationMode.Guided } },
            new Visualization { Id = 6, Slug = "banach-tarski", Title = "Banach-Tarski Paradox Conceptualizer", Description = "Visual decomposition of a sphere into 5 non-measurable pieces and SO(3) rotation assembly.", Type = VisualizationType.ThreeD, SupportedModes = new() { VisualizationMode.Explore, VisualizationMode.Guided, VisualizationMode.Mathematical } },
            new Visualization { Id = 7, Slug = "fractal-lab", Title = "Fractal Laboratory (Mandelbrot, Julia & IFS)", Description = "Interactive GPU/Canvas fractal explorer with dynamic zoom, pan, iteration depth, and Julia set parameter explorer.", Type = VisualizationType.Canvas2D, SupportedModes = new() { VisualizationMode.Explore, VisualizationMode.Guided, VisualizationMode.Mathematical } },
            new Visualization { Id = 8, Slug = "collatz-conjecture", Title = "Collatz Trajectory Explorer", Description = "Interactive 3n+1 sequence plotter with stopping time, maximum excursion, and multi-number comparison.", Type = VisualizationType.InteractiveSvg, SupportedModes = new() { VisualizationMode.Explore, VisualizationMode.Guided } },
            new Visualization { Id = 9, Slug = "goldbach-conjecture", Title = "Goldbach Decomposition Lab", Description = "Interactive even integer decomposition calculator with prime pair distribution and Goldbach comet.", Type = VisualizationType.InteractiveSvg, SupportedModes = new() { VisualizationMode.Explore, VisualizationMode.Guided } },
            new Visualization { Id = 10, Slug = "twin-prime-conjecture", Title = "Twin Prime Sieve Explorer", Description = "Interactive prime number line highlighting (p, p+2) pairs and prime gap density.", Type = VisualizationType.InteractiveSvg, SupportedModes = new() { VisualizationMode.Explore, VisualizationMode.Guided } },
            new Visualization { Id = 11, Slug = "riemann-hypothesis", Title = "Riemann Zeta Zero Spectrum", Description = "Complex plane visualizer with critical strip, critical line Re(s) = 1/2, and known non-trivial zeros.", Type = VisualizationType.Canvas2D, SupportedModes = new() { VisualizationMode.Explore, VisualizationMode.Guided, VisualizationMode.Mathematical } },
            new Visualization { Id = 12, Slug = "zenos-paradoxes", Title = "Zeno's Paradoxes Interactive Laboratory", Description = "Achilles & Tortoise animated race, Dichotomy geometric series bar convergence, and Arrow instantaneous velocity limit.", Type = VisualizationType.InteractiveSim, SupportedModes = new() { VisualizationMode.Explore, VisualizationMode.Guided, VisualizationMode.Mathematical } },
            new Visualization { Id = 13, Slug = "projective-plane", Title = "Real Projective Plane (Cross-Cap) 3D", Description = "Interactive 3D parametric cross-cap model of RP^2 illustrating antipodal quotient and non-orientability.", Type = VisualizationType.ThreeD, SupportedModes = new() { VisualizationMode.Explore, VisualizationMode.Guided, VisualizationMode.Mathematical } },
            new Visualization { Id = 14, Slug = "cantors-diagonal-argument", Title = "Cantor's Diagonal Argument Visualizer", Description = "Interactive binary sequence table demonstrating diagonal bit inversion and uncountability of reals.", Type = VisualizationType.InteractiveSim, SupportedModes = new() { VisualizationMode.Explore, VisualizationMode.Guided, VisualizationMode.Mathematical } },
            new Visualization { Id = 15, Slug = "birthday-paradox", Title = "Birthday Paradox Simulator & Calculator", Description = "Interactive room size slider, exact collision probability curve, and Monte Carlo multi-trial generator.", Type = VisualizationType.InteractiveSim, SupportedModes = new() { VisualizationMode.Explore, VisualizationMode.Guided, VisualizationMode.Mathematical } },
            new Visualization { Id = 16, Slug = "monty-hall-problem", Title = "Monty Hall 3-Door Simulation & Monte Carlo", Description = "Interactive 3-door game showing switch vs stay strategies with live frequentist convergence.", Type = VisualizationType.InteractiveSim, SupportedModes = new() { VisualizationMode.Explore, VisualizationMode.Guided, VisualizationMode.Mathematical } },
            new Visualization { Id = 17, Slug = "gabriels-horn", Title = "Gabriel's Horn 3D Surface of Revolution", Description = "Interactive 3D horn y = 1/x demonstrating finite volume versus infinite surface area.", Type = VisualizationType.ThreeD, SupportedModes = new() { VisualizationMode.Explore, VisualizationMode.Guided, VisualizationMode.Mathematical } },
            new Visualization { Id = 18, Slug = "p-vs-np", Title = "P vs NP Verification vs Search Complexity Lab", Description = "Interactive complexity class visualizer and verification vs search demonstrator.", Type = VisualizationType.InteractiveSim, SupportedModes = new() { VisualizationMode.Explore, VisualizationMode.Guided, VisualizationMode.Mathematical } },
            new Visualization { Id = 19, Slug = "poincare-conjecture", Title = "Poincaré Conjecture 3-Sphere Surgery Visualizer", Description = "Ricci flow neckpinch singularity surgery and simply connected loop shrinking visualizer.", Type = VisualizationType.ThreeD, SupportedModes = new() { VisualizationMode.Explore, VisualizationMode.Guided, VisualizationMode.Mathematical } },
            new Visualization { Id = 20, Slug = "julia-set", Title = "Julia Sets Complex Plane Dynamics", Description = "Interactive Julia set fractal with custom parameter explorer linked to the Mandelbrot plane.", Type = VisualizationType.Canvas2D, SupportedModes = new() { VisualizationMode.Explore, VisualizationMode.Guided, VisualizationMode.Mathematical } },
            new Visualization { Id = 21, Slug = "sierpinski-triangle", Title = "Sierpiński Triangle Recursive IFS", Description = "Recursive removal and chaos game generation of the Sierpiński gasket.", Type = VisualizationType.Canvas2D, SupportedModes = new() { VisualizationMode.Explore, VisualizationMode.Guided } },
            new Visualization { Id = 22, Slug = "koch-snowflake", Title = "Koch Snowflake Infinite Shoreline", Description = "Iterative line replacement visualizer demonstrating infinite perimeter enclosing finite area.", Type = VisualizationType.Canvas2D, SupportedModes = new() { VisualizationMode.Explore, VisualizationMode.Guided } },
            new Visualization { Id = 23, Slug = "cantor-set", Title = "Cantor Set Middle-Third Construction", Description = "Stage-by-stage removal of the middle third illustrating measure zero and uncountability.", Type = VisualizationType.Canvas2D, SupportedModes = new() { VisualizationMode.Explore, VisualizationMode.Guided } },
            new Visualization { Id = 24, Slug = "dragon-curve", Title = "Heighway Dragon Paper-Folding Fractal", Description = "Recursive paper-folding turn generator and plane-tiling 2D fractal curve.", Type = VisualizationType.Canvas2D, SupportedModes = new() { VisualizationMode.Explore, VisualizationMode.Guided } }
        };

        foreach (var v in visualizations)
        {
            if (!await context.Visualizations.AnyAsync(x => x.Slug == v.Slug))
            {
                if (await context.Visualizations.AnyAsync()) v.Id = 0;
                context.Visualizations.Add(v);
            }
        }
        await context.SaveChangesAsync();

        // 8. TAGS
        var tags = new List<Tag>
        {
            new Tag { Id = 1, Slug = "millennium-problem", Name = "Millennium Problem" },
            new Tag { Id = 2, Slug = "primes", Name = "Primes" },
            new Tag { Id = 3, Slug = "topology", Name = "Topology" },
            new Tag { Id = 4, Slug = "non-orientable", Name = "Non-Orientable" },
            new Tag { Id = 5, Slug = "solved", Name = "Solved" },
            new Tag { Id = 6, Slug = "open", Name = "Open" },
            new Tag { Id = 7, Slug = "undecidable", Name = "Undecidable" },
            new Tag { Id = 8, Slug = "independent", Name = "Independent" },
            new Tag { Id = 9, Slug = "interactive-3d", Name = "Interactive 3D" },
            new Tag { Id = 10, Slug = "fractals", Name = "Fractals" },
            new Tag { Id = 11, Slug = "paradox", Name = "Paradox" },
            new Tag { Id = 12, Slug = "calculus", Name = "Calculus" },
            new Tag { Id = 13, Slug = "probability", Name = "Probability" }
        };

        foreach (var tag in tags)
        {
            if (!await context.Tags.AnyAsync(x => x.Slug == tag.Slug))
            {
                if (await context.Tags.AnyAsync()) tag.Id = 0;
                context.Tags.Add(tag);
            }
        }
        await context.SaveChangesAsync();
    }
}

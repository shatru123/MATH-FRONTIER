using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using MathFrontier.Core.Entities;
using MathFrontier.Core.Enums;

namespace MathFrontier.Infrastructure.Data;

public class MathFrontierDbContext : DbContext
{
    public MathFrontierDbContext(DbContextOptions<MathFrontierDbContext> options) : base(options)
    {
    }

    public DbSet<Problem> Problems => Set<Problem>();
    public DbSet<MathematicalWonder> Wonders => Set<MathematicalWonder>();
    public DbSet<Visualization> Visualizations => Set<Visualization>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Tag> Tags => Set<Tag>();
    public DbSet<Mathematician> Mathematicians => Set<Mathematician>();
    public DbSet<TimelineEvent> TimelineEvents => Set<TimelineEvent>();
    public DbSet<Source> Sources => Set<Source>();
    public DbSet<Experiment> Experiments => Set<Experiment>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // JSON value converters for lists
        var stringListConverter = new ValueConverter<List<string>, string>(
            v => JsonSerializer.Serialize(v, (JsonSerializerOptions?)null),
            v => JsonSerializer.Deserialize<List<string>>(v, (JsonSerializerOptions?)null) ?? new List<string>()
        );

        var stringListComparer = new ValueComparer<List<string>>(
            (c1, c2) => c1 != null && c2 != null ? c1.SequenceEqual(c2) : c1 == c2,
            c => c.Aggregate(0, (a, v) => HashCode.Combine(a, v.GetHashCode())),
            c => c.ToList()
        );

        var intListConverter = new ValueConverter<List<int>, string>(
            v => JsonSerializer.Serialize(v, (JsonSerializerOptions?)null),
            v => JsonSerializer.Deserialize<List<int>>(v, (JsonSerializerOptions?)null) ?? new List<int>()
        );

        var intListComparer = new ValueComparer<List<int>>(
            (c1, c2) => c1 != null && c2 != null ? c1.SequenceEqual(c2) : c1 == c2,
            c => c.Aggregate(0, (a, v) => HashCode.Combine(a, v.GetHashCode())),
            c => c.ToList()
        );

        var enumListConverter = new ValueConverter<List<VisualizationMode>, string>(
            v => JsonSerializer.Serialize(v.Select(e => e.ToString()).ToList(), (JsonSerializerOptions?)null),
            v => (JsonSerializer.Deserialize<List<string>>(v, (JsonSerializerOptions?)null) ?? new List<string>())
                .Select(s => Enum.Parse<VisualizationMode>(s)).ToList()
        );

        var enumListComparer = new ValueComparer<List<VisualizationMode>>(
            (c1, c2) => c1 != null && c2 != null ? c1.SequenceEqual(c2) : c1 == c2,
            c => c.Aggregate(0, (a, v) => HashCode.Combine(a, v.GetHashCode())),
            c => c.ToList()
        );

        // Problem configurations
        modelBuilder.Entity<Problem>(builder =>
        {
            builder.HasKey(p => p.Id);
            builder.HasIndex(p => p.Slug).IsUnique();
            builder.Property(p => p.Status).HasConversion<string>();
            builder.Property(p => p.Difficulty).HasConversion<string>();

            builder.Property(p => p.WhatWeKnow)
                .HasConversion(stringListConverter)
                .Metadata.SetValueComparer(stringListComparer);

            builder.Property(p => p.WhatWeDontKnow)
                .HasConversion(stringListConverter)
                .Metadata.SetValueComparer(stringListComparer);

            builder.Property(p => p.PartialResults)
                .HasConversion(stringListConverter)
                .Metadata.SetValueComparer(stringListComparer);

            builder.Property(p => p.CommonMisconceptions)
                .HasConversion(stringListConverter)
                .Metadata.SetValueComparer(stringListComparer);

            builder.Property(p => p.RelatedProblems)
                .HasConversion(stringListConverter)
                .Metadata.SetValueComparer(stringListComparer);

            builder.Property(p => p.Tags)
                .HasConversion(stringListConverter)
                .Metadata.SetValueComparer(stringListComparer);

            builder.Property(p => p.ClaimedSolutions)
                .HasConversion(stringListConverter)
                .Metadata.SetValueComparer(stringListComparer);

            builder.Property(p => p.HistoricalStatuses)
                .HasConversion(stringListConverter)
                .Metadata.SetValueComparer(stringListComparer);

            builder.Property(p => p.SourceIds)
                .HasConversion(intListConverter)
                .Metadata.SetValueComparer(intListComparer);

            builder.HasOne(p => p.Category)
                .WithMany(c => c.Problems)
                .HasForeignKey(p => p.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // Wonder configurations
        modelBuilder.Entity<MathematicalWonder>(builder =>
        {
            builder.HasKey(w => w.Id);
            builder.HasIndex(w => w.Slug).IsUnique();
            builder.Property(w => w.Status).HasConversion<string>();

            builder.Property(w => w.Properties)
                .HasConversion(stringListConverter)
                .Metadata.SetValueComparer(stringListComparer);

            builder.Property(w => w.ConstructionSteps)
                .HasConversion(stringListConverter)
                .Metadata.SetValueComparer(stringListComparer);

            builder.Property(w => w.Tags)
                .HasConversion(stringListConverter)
                .Metadata.SetValueComparer(stringListComparer);

            builder.Property(w => w.Sources)
                .HasConversion(stringListConverter)
                .Metadata.SetValueComparer(stringListComparer);

            builder.HasOne(w => w.Category)
                .WithMany(c => c.Wonders)
                .HasForeignKey(w => w.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // Visualization configurations
        modelBuilder.Entity<Visualization>(builder =>
        {
            builder.HasKey(v => v.Id);
            builder.HasIndex(v => v.Slug).IsUnique();
            builder.Property(v => v.Type).HasConversion<string>();
            builder.Property(v => v.SupportedModes)
                .HasConversion(enumListConverter)
                .Metadata.SetValueComparer(enumListComparer);
        });

        // Category configurations
        modelBuilder.Entity<Category>(builder =>
        {
            builder.HasKey(c => c.Id);
            builder.HasIndex(c => c.Slug).IsUnique();
        });

        // Tag configurations
        modelBuilder.Entity<Tag>(builder =>
        {
            builder.HasKey(t => t.Id);
            builder.HasIndex(t => t.Slug).IsUnique();
        });

        // Mathematician configurations
        modelBuilder.Entity<Mathematician>(builder =>
        {
            builder.HasKey(m => m.Id);
            builder.HasIndex(m => m.Slug).IsUnique();
            builder.Property(m => m.KeyContributions)
                .HasConversion(stringListConverter)
                .Metadata.SetValueComparer(stringListComparer);
        });

        // TimelineEvent configurations
        modelBuilder.Entity<TimelineEvent>(builder =>
        {
            builder.HasKey(t => t.Id);
        });

        // Source configurations
        modelBuilder.Entity<Source>(builder =>
        {
            builder.HasKey(s => s.Id);
        });

        // Experiment configurations
        modelBuilder.Entity<Experiment>(builder =>
        {
            builder.HasKey(e => e.Id);
            builder.HasIndex(e => e.Slug).IsUnique();
        });
    }
}

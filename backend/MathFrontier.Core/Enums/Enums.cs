namespace MathFrontier.Core.Enums;

public enum ProblemStatus
{
    OPEN,
    PARTIALLY_SOLVED,
    SOLVED,
    DISPROVED,
    UNDECIDABLE,
    INDEPENDENT,
    DISPUTED,
    CLAIMED_SOLUTION,
    PHENOMENON,
    THEOREM,
    PARADOX
}

public enum DifficultyLevel
{
    Introductory,
    Intermediate,
    Advanced,
    Extreme
}

public enum VisualizationType
{
    ThreeD,
    Canvas2D,
    InteractiveSvg,
    InteractiveSim
}

public enum VisualizationMode
{
    Explore,
    Guided,
    Mathematical
}

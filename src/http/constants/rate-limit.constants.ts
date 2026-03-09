export const RateLimitPolicies = {
    STRICT: {
        max: 3,
        timeWindow: "15 minutes",
        continueExceeding: true,
    },
    SENSITIVE: {
        max: 5,
        timeWindow: "1 minute",
    },
    STANDARD: {
        max: 60,
        timeWindow: "1 minute",
    },
} as const;

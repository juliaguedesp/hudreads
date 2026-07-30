import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// create a new ratelimit instance that allows 5 requests per 1 hour
export const reviewRatelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(5, "1 h"),
    analytics: true,
    prefix: "@upstash/ratelimit/reviews",
});
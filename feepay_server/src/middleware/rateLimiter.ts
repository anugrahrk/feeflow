
import rateLimit from 'express-rate-limit';

export const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    limit: 5, // Limit each IP to 5 requests per `window` (here, per 1 minute)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: "Too many requests, please try again in a minute."
})

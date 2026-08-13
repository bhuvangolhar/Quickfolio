export interface RetryOptions {
  /** Maximum number of retry attempts (default: 3) */
  retries?: number;
  /** Initial delay in milliseconds before the first retry (default: 1000) */
  delay?: number;
  /** Multiplier for exponential backoff (default: 2) */
  backoffFactor?: number;
  /** Maximum cap for delay in milliseconds (default: 10000) */
  maxDelay?: number;
  /** Optional predicate to filter retryable errors */
  shouldRetry?: (error: unknown) => boolean;
  /** Optional AbortSignal for task cancellation */
  signal?: AbortSignal;
}

/**
 * Retry wrapper for async functions with true exponential backoff,
 * HTTP status filtering, and AbortSignal support.
 */
export async function fetchWithRetry<T>(
  fn: () => Promise<T>,
  options?: RetryOptions
): Promise<T>;

/**
 * Backward-compatible overload for legacy positional arguments (fn, retries, delay)
 */
export async function fetchWithRetry<T>(
  fn: () => Promise<T>,
  retries?: number,
  delay?: number
): Promise<T>;

export async function fetchWithRetry<T>(
  fn: () => Promise<T>,
  optsOrRetries: RetryOptions | number = {},
  delayArg?: number
): Promise<T> {
  let retries = 3;
  let delay = 1000;
  let backoffFactor = 2;
  let maxDelay = 10000;
  let shouldRetry: ((error: unknown) => boolean) | undefined;
  let signal: AbortSignal | undefined;

  // Normalize legacy positional parameters vs modern options object
  if (typeof optsOrRetries === "number") {
    retries = optsOrRetries;
    if (typeof delayArg === "number") {
      delay = delayArg;
    }
  } else {
    retries = optsOrRetries.retries ?? 3;
    delay = optsOrRetries.delay ?? 1000;
    backoffFactor = optsOrRetries.backoffFactor ?? 2;
    maxDelay = optsOrRetries.maxDelay ?? 10000;
    shouldRetry = optsOrRetries.shouldRetry;
    signal = optsOrRetries.signal;
  }

  let currentDelay = delay;

  for (let attempt = 0; attempt <= retries; attempt++) {
    if (signal?.aborted) {
      throw new Error("Fetch operation aborted.");
    }

    try {
      return await fn();
    } catch (err: unknown) {
      const isLastAttempt = attempt === retries;

      // Stop retrying if attempts exhausted, signal aborted, or explicitly marked non-retryable
      if (isLastAttempt || signal?.aborted || (shouldRetry && !shouldRetry(err))) {
        throw err;
      }

      // Do not retry non-transient 4xx client errors (e.g. 401 Unauthorized, 403 Forbidden, 404 Not Found)
      if (err && typeof err === "object" && "status" in err) {
        const status = (err as { status: number }).status;
        if (status >= 400 && status < 500 && status !== 429) {
          throw err;
        }
      }

      // Wait out delay with AbortSignal cancellation listener
      await new Promise<void>((resolve, reject) => {
        const timer = setTimeout(resolve, currentDelay);

        if (signal) {
          signal.addEventListener(
            "abort",
            () => {
              clearTimeout(timer);
              reject(new Error("Fetch operation aborted during retry delay."));
            },
            { once: true }
          );
        }
      });

      // Calculate next backoff step with maximum delay cap
      currentDelay = Math.min(currentDelay * backoffFactor, maxDelay);
    }
  }

  throw new Error("Maximum retry limit reached.");
}
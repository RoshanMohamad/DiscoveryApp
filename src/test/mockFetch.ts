/* eslint-env jest */
/** Tiny fetch fake: queue one response per call, inspect the Requests afterwards. */
/** `delayMs` holds the reply back, so a test can observe the loading state. */
type Reply = { status?: number; body?: unknown; delayMs?: number } | Error;

/** Pass a queue (one reply per call, in order) or a function that answers by request. */
export const mockFetch = (replies: Reply[] | ((request: Request) => Reply)) => {
  const requests: Request[] = [];
  const queue = typeof replies === 'function' ? [] : [...replies];
  const fn = jest.fn(async (input: Request) => {
    requests.push(input);
    const next = typeof replies === 'function' ? replies(input) : queue.shift();
    if (next === undefined) {
      throw new Error(`Unexpected extra fetch to ${input.url}`);
    }
    if (next instanceof Error) {
      throw next;
    }
    if (next.delayMs) {
      await new Promise<void>(resolve => setTimeout(resolve, next.delayMs));
    }
    return new Response(JSON.stringify(next.body ?? {}), {
      status: next.status ?? 200,
      headers: { 'content-type': 'application/json' },
    });
  });
  globalThis.fetch = fn as unknown as typeof fetch;
  return { fn, requests };
};

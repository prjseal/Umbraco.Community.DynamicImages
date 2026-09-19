/**
 * A snapshot undo stack. Snapshots rather than inverse commands because the template is one
 * immutable document: cloning it is cheap at this size, and a 300-event drag collapses into a
 * single entry through the transaction pair instead of 300 inverse operations.
 */
export class History<T> {
  #past: T[] = [];
  #future: T[] = [];
  #transactionDepth = 0;
  #transactionSnapshot?: T;

  constructor(private readonly limit = 100) {}

  get canUndo(): boolean {
    return this.#past.length > 0;
  }

  get canRedo(): boolean {
    return this.#future.length > 0;
  }

  /** Records the state *before* a change. Ignored inside a transaction, which already took one. */
  push(state: T): void {
    if (this.#transactionDepth > 0) return;

    this.#past.push(structuredClone(state));
    if (this.#past.length > this.limit) this.#past.shift();

    // Any new change abandons the redo branch, as every editor does.
    this.#future = [];
  }

  /**
   * Starts a coalesced change. Nested calls are counted, so a drag that internally begins another
   * transaction still ends up as one undo entry.
   */
  begin(state: T): void {
    if (this.#transactionDepth === 0) this.#transactionSnapshot = structuredClone(state);
    this.#transactionDepth++;
  }

  /**
   * Ends it. <paramref name="changed"/> false discards the snapshot, so a click that selected a
   * layer without moving it does not leave an empty undo step behind.
   */
  end(changed = true): void {
    if (this.#transactionDepth === 0) return;

    this.#transactionDepth--;
    if (this.#transactionDepth > 0) return;

    if (changed && this.#transactionSnapshot !== undefined) {
      this.#past.push(this.#transactionSnapshot);
      if (this.#past.length > this.limit) this.#past.shift();
      this.#future = [];
    }

    this.#transactionSnapshot = undefined;
  }

  undo(current: T): T | undefined {
    const previous = this.#past.pop();
    if (previous === undefined) return undefined;

    this.#future.push(structuredClone(current));
    return previous;
  }

  redo(current: T): T | undefined {
    const next = this.#future.pop();
    if (next === undefined) return undefined;

    this.#past.push(structuredClone(current));
    return next;
  }

  clear(): void {
    this.#past = [];
    this.#future = [];
    this.#transactionDepth = 0;
    this.#transactionSnapshot = undefined;
  }
}

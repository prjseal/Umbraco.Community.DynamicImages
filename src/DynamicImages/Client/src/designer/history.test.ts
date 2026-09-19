import { describe, expect, it } from "vitest";
import { History } from "./history.js";

interface State {
  value: number;
}

describe("History", () => {
  it("undoes and redoes a single change", () => {
    const history = new History<State>();
    const first: State = { value: 1 };

    history.push(first);
    const second: State = { value: 2 };

    expect(history.undo(second)).toEqual({ value: 1 });
    expect(history.redo(first)).toEqual({ value: 2 });
  });

  it("has nothing to undo when nothing has changed", () => {
    const history = new History<State>();

    expect(history.canUndo).toBe(false);
    expect(history.undo({ value: 1 })).toBeUndefined();
  });

  it("collapses a whole transaction into one entry", () => {
    const history = new History<State>();

    history.begin({ value: 0 });
    for (let value = 1; value <= 300; value++) history.push({ value });
    history.end();

    expect(history.undo({ value: 300 })).toEqual({ value: 0 });
    expect(history.canUndo).toBe(false);
  });

  it("counts nested transactions so the outermost one wins", () => {
    const history = new History<State>();

    history.begin({ value: 0 });
    history.begin({ value: 5 });
    history.end();
    history.end();

    expect(history.undo({ value: 9 })).toEqual({ value: 0 });
    expect(history.canUndo).toBe(false);
  });

  it("leaves no entry behind for a transaction that changed nothing", () => {
    const history = new History<State>();

    history.begin({ value: 0 });
    history.end(false);

    expect(history.canUndo).toBe(false);
  });

  it("abandons the redo branch once a new change is made", () => {
    const history = new History<State>();

    history.push({ value: 1 });
    history.undo({ value: 2 });
    expect(history.canRedo).toBe(true);

    history.push({ value: 1 });
    expect(history.canRedo).toBe(false);
  });

  it("drops the oldest entries past its limit", () => {
    const history = new History<State>(3);

    for (let value = 0; value < 10; value++) history.push({ value });

    expect(history.undo({ value: 10 })).toEqual({ value: 9 });
    expect(history.undo({ value: 9 })).toEqual({ value: 8 });
    expect(history.undo({ value: 8 })).toEqual({ value: 7 });
    expect(history.canUndo).toBe(false);
  });

  it("snapshots deeply, so later mutation cannot corrupt the stack", () => {
    const history = new History<{ nested: { value: number } }>();
    const state = { nested: { value: 1 } };

    history.push(state);
    state.nested.value = 99;

    expect(history.undo({ nested: { value: 99 } })).toEqual({ nested: { value: 1 } });
  });
});

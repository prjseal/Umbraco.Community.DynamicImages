import { afterEach, describe, expect, it } from "vitest";
import { resetBody, settle } from "../testing/browser-fixtures.js";
import { INSPECTOR_BOUNDS } from "./number-bounds.js";
import "./di-number-field.element.js";

/**
 * A5, the half a unit test cannot reach: the clamped value has to land back **in the input** as
 * well as in the dispatched detail. Without that the field goes on showing 5 while the model
 * holds 1, which is worse than not clamping at all.
 */

async function mountField(value: number, min: number, max: number) {
  resetBody();

  const field = document.createElement("di-number-field");
  field.label = "Opacity";
  field.value = value;
  field.min = min;
  field.max = max;
  document.body.append(field);
  await settle(field, 2);

  const input = field.shadowRoot!.querySelector("input")!;
  const changes: (number | null)[] = [];
  field.addEventListener("change", (event) => {
    changes.push((event as CustomEvent<{ value: number | null }>).detail.value);
  });

  /** What a person typing into the field actually produces. */
  const type = async (text: string) => {
    input.value = text;
    input.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
    await settle(field, 1);
  };

  return { field, input, changes, type };
}

afterEach(() => {
  resetBody();
});

describe("di-number-field clamping", () => {
  const { min, max } = INSPECTOR_BOUNDS.opacity;

  it("clamps a typed value in the input as well as in the model", async () => {
    const { input, changes, type } = await mountField(1, min, max);

    await type("5");

    expect(changes).toEqual([1]);
    expect(input.value, "the field kept showing the out-of-range value").toBe("1");
  });

  it("clamps upwards too", async () => {
    const { input, changes, type } = await mountField(1, min, max);

    await type("-3");

    expect(changes).toEqual([0]);
    expect(input.value).toBe("0");
  });

  it("dispatches an in-range value untouched", async () => {
    const { input, changes, type } = await mountField(1, min, max);

    await type("0.4");

    expect(changes).toEqual([0.4]);
    expect(input.value).toBe("0.4");
  });

  it("reports an emptied field as null", async () => {
    const { changes, type } = await mountField(1, min, max);

    await type("");

    expect(changes).toEqual([null]);
  });

  it("sees letters as an empty field, because the native control sanitises them", async () => {
    const { input, changes, type } = await mountField(0.5, min, max);

    await type("abc");

    // Worth pinning rather than assuming: `<input type="number">` refuses to hold a value it
    // cannot parse and reports "" instead, so the element never sees "abc" at all and the
    // "keep the last good value" branch of clampNumber is unreachable from here. That branch
    // is still covered - by number-clamp.test.ts, against the function directly - because
    // anything else calling clampNumber has no such sanitising in front of it.
    expect(input.value).toBe("");
    expect(changes).toEqual([null]);
  });
});

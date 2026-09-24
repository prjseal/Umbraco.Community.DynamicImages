/**
 * True when a key event comes from somewhere the editor is typing - a field or an editable
 * region - so a designer shortcut must leave it alone. Reads the composed path, because a field
 * inside a shadow root retargets `event.target` to its host.
 */
export function isTypingTarget(event: Event): boolean {
  const target = event.composedPath()[0] as HTMLElement | undefined;
  if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return true;
  return target?.isContentEditable === true;
}

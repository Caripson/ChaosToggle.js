export function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export function deepMerge<T>(target: T, source: any): T {
  const out: any = { ...(target as any) };
  if (!isObject(source)) return out as T;
  for (const key of Object.keys(source)) {
    const srcVal = source[key];
    if (isObject(srcVal) && isObject(out[key])) {
      out[key] = deepMerge(out[key], srcVal);
    } else {
      out[key] = srcVal;
    }
  }
  return out as T;
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export function clamp(num: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, num));
}

export function createEl(tag: string, className?: string, styles?: Partial<CSSStyleDeclaration>): HTMLElement {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (styles) Object.assign(el.style, styles);
  return el;
}

export function normalizeCombo(combo: string): string | null {
  if (!combo || typeof combo !== 'string') return null;
  const parts = combo.split('+').map(p => p.trim().toLowerCase()).filter(Boolean);
  if (!parts.length) return null;
  const modifiers = ['ctrl', 'alt', 'shift', 'meta'];
  const out: string[] = [];
  for (const m of modifiers) {
    if (
      parts.includes(m) ||
      (m === 'ctrl' && parts.includes('control')) ||
      (m === 'meta' && (parts.includes('cmd') || parts.includes('command')))
    ) {
      out.push(m);
    }
  }
  const key = parts.find(p => !modifiers.includes(p) && p !== 'control' && p !== 'cmd' && p !== 'command');
  if (!key) return null;
  out.push(key);
  return out.join('+');
}

export function eventToCombo(event: KeyboardEvent): string {
  const out: string[] = [];
  if (event.ctrlKey) out.push('ctrl');
  if (event.altKey) out.push('alt');
  if (event.shiftKey) out.push('shift');
  if (event.metaKey) out.push('meta');
  out.push(String(event.key || '').toLowerCase());
  return out.join('+');
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export function pickEnabledSections<T>(
  base: T,
  incoming: any,
  parts: Record<string, boolean> | undefined,
  fallback?: any,
): T {
  const out: any = deepMerge({}, base);
  if (parts) {
    for (const key of Object.keys(parts)) {
      if (parts[key] !== false) continue;
      if (fallback && fallback[key] !== undefined) {
        out[key] = deepMerge({}, fallback[key]);
      } else {
        delete out[key];
      }
    }
  }
  if (incoming) {
    for (const key of Object.keys(incoming)) {
      if (parts && parts[key] === false) continue;
      if (isObject(incoming[key]) && isObject(out[key])) {
        out[key] = deepMerge(out[key], incoming[key]);
      } else {
        out[key] = incoming[key];
      }
    }
  }
  return out as T;
}
/* eslint-enable @typescript-eslint/no-explicit-any */

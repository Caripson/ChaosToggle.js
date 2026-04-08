import { normalizeCombo, eventToCombo } from './utils';

export type ShortcutAction = string | ((engine: unknown) => void);

export class ShortcutManager {
  private _map = new Map<string, ShortcutAction>();
  private _listener: ((e: KeyboardEvent) => void) | null = null;
  private _enabled = true;

  bind(shortcuts: Record<string, ShortcutAction>, onAction: (action: ShortcutAction) => void): () => void {
    this._map.clear();
    for (const [combo, action] of Object.entries(shortcuts)) {
      const norm = normalizeCombo(combo);
      if (norm) this._map.set(norm, action);
    }

    if (this._listener) {
      window.removeEventListener('keydown', this._listener);
    }

    this._listener = (event: KeyboardEvent) => {
      if (!this._enabled) return;
      const combo = eventToCombo(event);
      const action = this._map.get(combo);
      if (action === undefined) return;
      event.preventDefault();
      onAction(action);
    };

    window.addEventListener('keydown', this._listener);
    return () => {
      if (this._listener) {
        window.removeEventListener('keydown', this._listener);
        this._listener = null;
      }
    };
  }

  register(combo: string, action: ShortcutAction): void {
    const norm = normalizeCombo(combo);
    if (!norm) throw new Error(`Invalid shortcut combo: ${combo}`);
    this._map.set(norm, action);
  }

  unregister(combo: string): void {
    const norm = normalizeCombo(combo);
    if (norm) this._map.delete(norm);
  }

  setEnabled(enabled: boolean): void {
    this._enabled = enabled;
  }

  destroy(): void {
    if (this._listener) {
      window.removeEventListener('keydown', this._listener);
      this._listener = null;
    }
    this._map.clear();
  }
}

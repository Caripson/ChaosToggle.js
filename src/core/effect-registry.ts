import type { ChaosEffect } from './types';

export class EffectRegistry {
  private _effects = new Map<string, ChaosEffect>();

  register(effect: ChaosEffect): void {
    this._effects.set(effect.id, effect);
  }

  remove(id: string): boolean {
    return this._effects.delete(id);
  }

  get(id: string): ChaosEffect | undefined {
    return this._effects.get(id);
  }

  has(id: string): boolean {
    return this._effects.has(id);
  }

  list(): string[] {
    return Array.from(this._effects.keys());
  }

  all(): ChaosEffect[] {
    return Array.from(this._effects.values());
  }
}

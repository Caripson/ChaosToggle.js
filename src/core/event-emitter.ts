import type { ChaosEventName, ChaosEventHandler } from './types';

export class EventEmitter {
  private _handlers = new Map<ChaosEventName, Set<ChaosEventHandler>>();

  on(event: ChaosEventName, handler: ChaosEventHandler): void {
    if (!this._handlers.has(event)) this._handlers.set(event, new Set());
    this._handlers.get(event)!.add(handler);
  }

  off(event: ChaosEventName, handler: ChaosEventHandler): void {
    this._handlers.get(event)?.delete(handler);
  }

  emit(event: ChaosEventName, ...args: unknown[]): void {
    const handlers = this._handlers.get(event);
    if (!handlers) return;
    for (const handler of handlers) {
      try {
        handler(...args);
      } catch (err) {
        console.error(`[ChaosToggle] Event handler error (${event}):`, err);
      }
    }
  }
}

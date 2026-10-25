import { describe, it, expect } from 'vitest';
import { Notification } from '../../../src/common/notification/notification.js';

describe('Notification', () => {
  it('tracks errors', () => {
    const n = new Notification();
    expect(n.hasErrors()).toBe(false);
    n.addError('msg', 'ctx');
    expect(n.hasErrors()).toBe(true);
    expect(n.getMessages()).toEqual(['msg']);
    expect(n.getErrors()[0].context).toBe('ctx');
  });
});

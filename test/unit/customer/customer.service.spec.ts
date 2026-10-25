import { describe, it, expect } from 'vitest';
import { CustomerService } from '../../../src/customer/customer.service.js';

describe('CustomerService', () => {
  it('returns customer with given id', async () => {
    const svc = new CustomerService();
    const c = await svc.findById('cust-1');
    expect(c.id).toBe('cust-1');
  });

  it('throws when id empty', async () => {
    const svc = new CustomerService();
    await expect(svc.findById('')).rejects.toThrow();
  });
});

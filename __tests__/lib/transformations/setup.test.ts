/**
 * Setup verification test
 * This test verifies that Jest is configured correctly
 */

describe('Jest Setup', () => {
  it('should run tests successfully', () => {
    expect(true).toBe(true);
  });

  it('should have access to TextEncoder', () => {
    expect(typeof TextEncoder).toBe('function');
  });

  it('should have access to crypto.subtle', () => {
    expect(crypto).toBeDefined();
    expect(crypto.subtle).toBeDefined();
  });

  it('should resolve path aliases', async () => {
    // This will fail if path aliases aren't working
    const { toCamelCase } = await import('@/lib/transformations/naming-conventions');
    expect(typeof toCamelCase).toBe('function');
  });
});

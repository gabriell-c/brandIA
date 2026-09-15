describe('Basic Tests', () => {
  it('should pass true === true', () => {
    expect(true).toBe(true);
  });

  it('should pass array length', () => {
    const arr = [1, 2, 3];
    expect(arr.length).toBe(3);
  });

  it('should pass string includes', () => {
    expect('hello world').toContain('world');
  });

  it('should pass object property', () => {
    const obj = { name: 'test' };
    expect(obj.name).toBe('test');
  });
});
/* global expect */
describe('Dummy tests', () => {
  it('should test that 1 + 2 equals 3', () => {
    const n = 1 + 3;
    expect(n).toBe(4);
  });

  it('should test that 5 * 3 equals 15', () => {
    const f = 5 * 3;
    expect(f).toBe(15);
  });

  it('should test the boolean `true` to be truthy', () => {
    expect(true).toBeTruthy();
  });
});

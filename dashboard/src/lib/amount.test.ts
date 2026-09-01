import { describe, it, expect } from 'vitest';
import { sanitizeAmountInput } from '@/lib/amount';

describe('sanitizeAmountInput', () => {
  it('keeps digits and one decimal point', () => {
    expect(sanitizeAmountInput('1234')).toBe('1234');
    expect(sanitizeAmountInput('12.34')).toBe('12.34');
  });
  it('strips letters and symbols', () => {
    expect(sanitizeAmountInput('12e5')).toBe('125');
    expect(sanitizeAmountInput('-40')).toBe('40');
    expect(sanitizeAmountInput('+4 0')).toBe('40');
    expect(sanitizeAmountInput('abc')).toBe('');
    expect(sanitizeAmountInput('1,000')).toBe('1000');
  });
  it('collapses extra dots and caps decimals', () => {
    expect(sanitizeAmountInput('1.2.3')).toBe('1.23');
    expect(sanitizeAmountInput('1.2345')).toBe('1.23');
    expect(sanitizeAmountInput('.5')).toBe('.5');
  });
  it('leaves an empty field empty', () => {
    expect(sanitizeAmountInput('')).toBe('');
  });
});

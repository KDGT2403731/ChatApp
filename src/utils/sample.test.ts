import { describe, expect, it } from 'vitest';
import { add } from './sample';

describe('add 関数', () => {
    it('2つの数値を正しく加算する', () => {
        const result = add(2, 3);
        expect(result).toBe(5);
    });
    it('負の数も正しく加算する', () => {
        const result = add(2, -3);
        expect(result).toBe(-1);
    });
});
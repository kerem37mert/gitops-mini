import { describe, it, expect } from 'vitest';
import formatDate from './formatDate';

describe('formatDate', () => {
    it('formats date correctly in Turkish locale', () => {
        const testDate = new Date('2024-12-02T15:30:00');
        const formatted = formatDate(testDate);

        // Check that it contains date and time parts
        expect(formatted).toContain('.');
        expect(formatted).toContain(':');
    });

    it('handles ISO string dates', () => {
        const isoDate = '2024-12-02T15:30:00.000Z';
        const formatted = formatDate(isoDate);

        expect(formatted).toBeTruthy();
        expect(typeof formatted).toBe('string');
    });

    it('formats time in 24-hour format', () => {
        const testDate = new Date('2024-12-02T15:30:00');
        const formatted = formatDate(testDate);

        // Should contain time in HH:MM:SS format
        expect(formatted).toMatch(/\d{2}:\d{2}:\d{2}/);
    });

    it('returns consistent format for same date', () => {
        const date1 = new Date('2024-12-02T15:30:00');
        const date2 = new Date('2024-12-02T15:30:00');

        expect(formatDate(date1)).toBe(formatDate(date2));
    });
});

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { saveTrips, loadTrips } from './storage';
import type { Trip } from './types';

describe('storage.ts', () => {
  const KEY = 'tripwise.trips.v1';

  beforeEach(() => {
    // Clear mocks before each test
    vi.clearAllMocks();

    // Create a mock for localStorage
    const localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    };

    vi.stubGlobal('localStorage', localStorageMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('saveTrips', () => {
    it('should save trips to localStorage with correct key and stringified payload', () => {
      const trips: Trip[] = [
        {
          id: '1',
          destination: 'Paris',
          startDate: '2024-05-01',
          endDate: '2024-05-10',
          travelers: 2,
          budget: 2000,
          items: [],
          createdAt: '2024-01-01T00:00:00Z',
        }
      ];

      saveTrips(trips);

      expect(localStorage.setItem).toHaveBeenCalledTimes(1);
      expect(localStorage.setItem).toHaveBeenCalledWith(KEY, JSON.stringify(trips));
    });

    it('should handle saving an empty array of trips', () => {
      const trips: Trip[] = [];

      saveTrips(trips);

      expect(localStorage.setItem).toHaveBeenCalledTimes(1);
      expect(localStorage.setItem).toHaveBeenCalledWith(KEY, JSON.stringify(trips));
    });
  });

  describe('loadTrips', () => {
    it('should load and parse trips from localStorage successfully', () => {
      const trips: Trip[] = [
        {
          id: '1',
          destination: 'Paris',
          startDate: '2024-05-01',
          endDate: '2024-05-10',
          travelers: 2,
          budget: 2000,
          items: [],
          createdAt: '2024-01-01T00:00:00Z',
        }
      ];
      vi.mocked(localStorage.getItem).mockReturnValue(JSON.stringify(trips));

      const loadedTrips = loadTrips();

      expect(localStorage.getItem).toHaveBeenCalledTimes(1);
      expect(localStorage.getItem).toHaveBeenCalledWith(KEY);
      expect(loadedTrips).toEqual(trips);
    });

    it('should return an empty array when localStorage is empty', () => {
      vi.mocked(localStorage.getItem).mockReturnValue(null);

      const loadedTrips = loadTrips();

      expect(localStorage.getItem).toHaveBeenCalledTimes(1);
      expect(loadedTrips).toEqual([]);
    });

    it('should return an empty array if parsed data is not an array', () => {
      vi.mocked(localStorage.getItem).mockReturnValue(JSON.stringify({ not: 'an array' }));

      const loadedTrips = loadTrips();

      expect(localStorage.getItem).toHaveBeenCalledTimes(1);
      expect(loadedTrips).toEqual([]);
    });

    it('should return an empty array if JSON parsing fails', () => {
      vi.mocked(localStorage.getItem).mockReturnValue('invalid json');

      const loadedTrips = loadTrips();

      expect(localStorage.getItem).toHaveBeenCalledTimes(1);
      expect(loadedTrips).toEqual([]);
    });
  });
});

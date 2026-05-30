/**
 * API Client — Frontend se Backend se baat karne ke liye
 * 
 * Ye module saare backend API calls handle karta hai.
 * Production mein NEXT_PUBLIC_API_URL set karna hoga backend ke URL pe.
 */

import type {
  FlightSearchParams,
  HotelSearchParams,
  FlightResult,
  HotelResult,
  CurrencyRates,
  ApiResponse,
} from '@/types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

/**
 * Base fetch wrapper with error handling
 */
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      console.error(`API call failed [${endpoint}]:`, error.message);
      throw error;
    }
    throw new Error('An unexpected error occurred');
  }
}

/**
 * Flight Search APIs
 */
export const flightApi = {
  search: (params: FlightSearchParams) =>
    apiFetch<FlightResult[]>('/api/flights/search', {
      method: 'POST',
      body: JSON.stringify(params),
    }),

  getPopularRoutes: () =>
    apiFetch<FlightResult[]>('/api/flights/popular'),

  getPriceAlert: (routeId: string) =>
    apiFetch<{ currentPrice: number; trend: 'up' | 'down' | 'stable' }>(
      `/api/flights/price-alert/${routeId}`
    ),
};

/**
 * Hotel Search APIs
 */
export const hotelApi = {
  search: (params: HotelSearchParams) =>
    apiFetch<HotelResult[]>('/api/hotels/search', {
      method: 'POST',
      body: JSON.stringify(params),
    }),

  getPopularDestinations: () =>
    apiFetch<HotelResult[]>('/api/hotels/popular'),
};

/**
 * Currency & Exchange Rate APIs
 */
export const currencyApi = {
  getRates: () =>
    apiFetch<CurrencyRates>('/api/currency/rates'),

  convert: (amount: number, from: string, to: string) =>
    apiFetch<{ converted: number; rate: number }>(
      `/api/currency/convert?amount=${amount}&from=${from}&to=${to}`
    ),
};

/**
 * Health Check
 */
export const healthApi = {
  check: () =>
    apiFetch<{ status: string; timestamp: string }>('/api/health'),
};

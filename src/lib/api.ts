/**
 * API Client — Frontend to Backend communication
 * 
 * All backend API calls go through this module.
 * Set NEXT_PUBLIC_API_URL in production to your backend URL.
 */

import type {
  FlightSearchParams,
  HotelSearchParams,
  FlightResult,
  HotelResult,
  CurrencyRates,
  ApiResponse,
  SkyscannerAirportResult,
} from '@/types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

/**
 * Base fetch wrapper with error handling
 */
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
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

// ─── Skyscanner APIs ─────────────────────────────────────────

export const skyscannerApi = {
  /**
   * Explore cheapest flights from an origin to ALL destinations worldwide.
   * Great for "Explore" / "Inspiration" sections.
   */
  searchFlightsEverywhere: (params?: {
    originSkyId?: string;
    originEntityId?: string;
    oneWay?: string;
    currency?: string;
  }) => {
    const query = new URLSearchParams();
    if (params?.originSkyId) query.set('originSkyId', params.originSkyId);
    if (params?.originEntityId) query.set('originEntityId', params.originEntityId);
    if (params?.oneWay) query.set('oneWay', params.oneWay);
    if (params?.currency) query.set('currency', params.currency);

    const qs = query.toString();
    return apiFetch<any>(`/api/skyscanner/flights-everywhere${qs ? `?${qs}` : ''}`);
  },

  /**
   * Search flights on a specific route with detailed results.
   */
  searchFlights: (params: {
    originSkyId: string;
    destinationSkyId: string;
    originEntityId: string;
    destinationEntityId: string;
    date: string;
    returnDate?: string;
    cabinClass?: string;
    adults?: number;
    children?: number;
    infants?: number;
    currency?: string;
  }) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        query.set(key, String(value));
      }
    });

    return apiFetch<any>(`/api/skyscanner/flights?${query.toString()}`);
  },

  /**
   * Autocomplete search for airports and cities.
   */
  searchAirport: (query: string) =>
    apiFetch<SkyscannerAirportResult>(`/api/skyscanner/airports?query=${encodeURIComponent(query)}`),
};

// ─── Booking.com APIs ────────────────────────────────────────

export const bookingApi = {
  /**
   * Search destinations — returns cities, hotels, landmarks matching a query.
   */
  searchDestination: (query: string) =>
    apiFetch<any>(`/api/booking/destinations?query=${encodeURIComponent(query)}`),

  /**
   * Search hotels with live prices at a destination.
   */
  searchHotels: (params: {
    dest_id: string;
    search_type?: string;
    arrival_date: string;
    departure_date: string;
    adults?: number;
    children_age?: string;
    room_qty?: number;
    page_number?: number;
    currency_code?: string;
  }) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        query.set(key, String(value));
      }
    });

    return apiFetch<any>(`/api/booking/hotels?${query.toString()}`);
  },

  /**
   * Get detailed information about a specific hotel.
   */
  getHotelDetails: (params: {
    hotel_id: string;
    arrival_date: string;
    departure_date: string;
    adults?: number;
    room_qty?: number;
    currency_code?: string;
  }) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        query.set(key, String(value));
      }
    });

    return apiFetch<any>(`/api/booking/hotel-details?${query.toString()}`);
  },
};

// ─── Legacy APIs (keep for backward compatibility) ───────────

export const flightApi = {
  search: (params: FlightSearchParams) =>
    apiFetch<ApiResponse<FlightResult[]>>('/api/flights/search', {
      method: 'POST',
      body: JSON.stringify(params),
    }),

  getPopularRoutes: () =>
    apiFetch<ApiResponse<FlightResult[]>>('/api/flights/popular'),

  getPriceAlert: (routeId: string) =>
    apiFetch<ApiResponse<{ currentPrice: number; trend: 'up' | 'down' | 'stable' }>>(
      `/api/flights/price-alert/${routeId}`
    ),
};

export const hotelApi = {
  search: (params: HotelSearchParams) =>
    apiFetch<ApiResponse<HotelResult[]>>('/api/hotels/search', {
      method: 'POST',
      body: JSON.stringify(params),
    }),

  getPopularDestinations: () =>
    apiFetch<ApiResponse<HotelResult[]>>('/api/hotels/popular'),
};

export const currencyApi = {
  getRates: () =>
    apiFetch<ApiResponse<CurrencyRates>>('/api/currency/rates'),

  convert: (amount: number, from: string, to: string) =>
    apiFetch<ApiResponse<{ converted: number; rate: number }>>(
      `/api/currency/convert?amount=${amount}&from=${from}&to=${to}`
    ),
};

export const healthApi = {
  check: () =>
    apiFetch<ApiResponse<{ status: string; timestamp: string }>>('/api/health'),
};

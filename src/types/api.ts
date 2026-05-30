// Shared API types between frontend and backend

export interface FlightSearchParams {
  origin: string;
  destination: string;
  departDate: string;
  returnDate?: string;
  adults: number;
  children?: number;
  infants?: number;
  cabinClass: 'economy' | 'premium_economy' | 'business' | 'first';
  tripType: 'one_way' | 'round_trip';
}

export interface HotelSearchParams {
  destination: string;
  checkIn: string;
  checkOut: string;
  rooms: number;
  adults: number;
  children?: number;
}

export interface FlightResult {
  id: string;
  airline: string;
  airlineCode: string;
  origin: string;
  destination: string;
  departTime: string;
  arriveTime: string;
  duration: string;
  stops: number;
  price: number;
  currency: string;
  providers: ProviderPrice[];
  cabinClass: string;
}

export interface HotelResult {
  id: string;
  name: string;
  starRating: number;
  location: string;
  pricePerNight: number;
  currency: string;
  providers: ProviderPrice[];
  amenities: string[];
  imageUrl: string;
}

export interface ProviderPrice {
  name: string;
  price: number;
  deepLink: string;
  isCheapest?: boolean;
}

export interface CurrencyRates {
  base: string;
  rates: Record<string, number>;
  lastUpdated: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: {
    total: number;
    page: number;
    perPage: number;
  };
  error?: string;
}

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

// ─── Skyscanner Types ────────────────────────────────────────

export interface SkyscannerFlightEverywhereResponse {
  status: boolean;
  timestamp: number;
  data: {
    everywhereDestination?: SkyscannerDestination[];
  };
}

export interface SkyscannerDestination {
  id: string;
  name: string;
  country: string;
  flagUrl?: string;
  flightQuotes: SkyscannerFlightQuote[];
}

export interface SkyscannerFlightQuote {
  id: string;
  price: number;
  rawPrice: number;
  direct: boolean;
  departDate: string;
  returnDate?: string;
  originName?: string;
  destinationName?: string;
  carrierName?: string;
  carrierLogoUrl?: string;
}

export interface SkyscannerFlightSearchResponse {
  status: boolean;
  data: {
    itineraries?: SkyscannerItinerary[];
    context?: {
      status: string;
      totalResults: number;
    };
  };
}

export interface SkyscannerItinerary {
  id: string;
  price: {
    raw: number;
    formatted: string;
  };
  legs: SkyscannerLeg[];
  score: number;
  isSelfTransfer: boolean;
  tags?: string[];
}

export interface SkyscannerLeg {
  id: string;
  origin: {
    id: string;
    name: string;
    displayCode: string;
    city: string;
    country: string;
  };
  destination: {
    id: string;
    name: string;
    displayCode: string;
    city: string;
    country: string;
  };
  departure: string;
  arrival: string;
  durationInMinutes: number;
  stopCount: number;
  carriers: {
    marketing: Array<{
      id: number;
      name: string;
      logoUrl: string;
      alternateId: string;
    }>;
  };
}

export interface SkyscannerAirportResult {
  status: boolean;
  data: Array<{
    skyId: string;
    entityId: string;
    presentation: {
      title: string;
      subtitle: string;
      suggestionTitle: string;
    };
    navigation: {
      entityId: string;
      entityType: string;
      localizedName: string;
      relevantFlightParams: {
        skyId: string;
        entityId: string;
      };
    };
  }>;
}

// ─── Booking.com Types ───────────────────────────────────────

export interface BookingDestination {
  dest_id: string;
  search_type: string;
  name: string;
  label: string;
  city_name: string;
  country: string;
  region: string;
  image_url?: string;
  type: string;
  nr_hotels?: number;
  latitude?: number;
  longitude?: number;
}

export interface BookingHotel {
  hotel_id: number;
  accessibilityLabel: string;
  property: {
    name: string;
    photoUrls: string[];
    reviewScore: number;
    reviewScoreWord: string;
    reviewCount: number;
    priceBreakdown: {
      grossPrice: {
        value: number;
        currency: string;
      };
      strikethroughPrice?: {
        value: number;
        currency: string;
      };
    };
    checkin?: {
      fromTime: string;
      untilTime: string;
    };
    checkout?: {
      fromTime: string;
      untilTime: string;
    };
    wishlistName?: string;
    qualityClass?: number;
    latitude?: number;
    longitude?: number;
  };
}

export interface BookingHotelsResponse {
  status: boolean;
  message: string;
  data: {
    hotels: BookingHotel[];
    meta?: Array<{
      title: string;
    }>;
  };
}

export interface BookingDestinationResponse {
  status: boolean;
  message: string;
  data: BookingDestination[];
}

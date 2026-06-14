import { NextRequest, NextResponse } from "next/server";
import {
  generateFlights,
  generateHotels,
  generateBuses,
  generateCabs,
  generateTours,
  generatePackages,
} from "../chat/route";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { toolType, args, currency = "USD" } = body;
    const marker = process.env.TRAVELPAYOUTS_MARKER || "734132";

    let data: any = null;

    switch (toolType) {
      case "tool-searchFlights":
      case "searchFlights": {
        const { origin, destination, departureDate, returnDate, passengers, maxPrice } = args;
        data = {
          flights: generateFlights(
            origin || "",
            destination || "",
            departureDate || new Date().toISOString().split("T")[0],
            returnDate,
            passengers ? Number(passengers) : 1,
            marker,
            currency,
            maxPrice ? Number(maxPrice) : undefined
          ),
        };
        break;
      }
      case "tool-searchHotels":
      case "searchHotels": {
        const { destination, checkInDate, checkOutDate, guests, maxPrice } = args;
        data = {
          hotels: generateHotels(
            destination || "",
            checkInDate || new Date().toISOString().split("T")[0],
            checkOutDate || new Date().toISOString().split("T")[0],
            guests ? Number(guests) : 1,
            marker,
            currency,
            maxPrice ? Number(maxPrice) : undefined
          ),
        };
        break;
      }
      case "tool-searchBuses":
      case "searchBuses": {
        const { origin, destination, travelDate, passengers, maxPrice } = args;
        data = {
          buses: generateBuses(
            origin || "",
            destination || "",
            travelDate || new Date().toISOString().split("T")[0],
            passengers ? Number(passengers) : 1,
            marker,
            currency,
            maxPrice ? Number(maxPrice) : undefined
          ),
        };
        break;
      }
      case "tool-searchCabs":
      case "searchCabs": {
        const { pickupLocation, dropLocation, passengers, maxPrice } = args;
        data = {
          cabs: generateCabs(
            pickupLocation || "",
            dropLocation || "",
            passengers ? Number(passengers) : 1,
            marker,
            currency,
            maxPrice ? Number(maxPrice) : undefined
          ),
        };
        break;
      }
      case "tool-searchTours":
      case "searchTours": {
        const { destination, maxPrice } = args;
        data = {
          tours: generateTours(destination || "", marker, currency, maxPrice ? Number(maxPrice) : undefined),
        };
        break;
      }
      case "tool-searchPackages":
      case "searchPackages": {
        const { destination, duration, maxPrice } = args;
        data = {
          packages: generatePackages(destination || "", duration || "5D/4N", marker, currency, maxPrice ? Number(maxPrice) : undefined),
        };
        break;
      }
      default:
        return NextResponse.json({ error: "Unsupported search type" }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Search API error:", error);
    return NextResponse.json({ error: error.message || "Failed to search" }, { status: 500 });
  }
}

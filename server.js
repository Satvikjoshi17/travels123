const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// ---------------------------------------------------------
// AMADEUS API SETUP
// ---------------------------------------------------------
// Helper function to get Amadeus Access Token
async function getAmadeusToken() {
    try {
        const params = new URLSearchParams();
        params.append('grant_type', 'client_credentials');
        params.append('client_id', process.env.AMADEUS_CLIENT_ID);
        params.append('client_secret', process.env.AMADEUS_CLIENT_SECRET);

        const response = await axios.post(
            'https://test.api.amadeus.com/v1/security/oauth2/token',
            params,
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );
        return response.data.access_token;
    } catch (error) {
        console.error('Error fetching Amadeus token:', error.response?.data || error.message);
        throw new Error('Failed to authenticate with Amadeus');
    }
}

// Test Endpoint: Amadeus Flight Offers Search
app.get('/api/amadeus/flights', async (req, res) => {
    try {
        const { origin, destination, departureDate } = req.query;
        const token = await getAmadeusToken();

        // Amadeus requires dates to be in the future, so let's default to 30 days from today
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 30);
        const defaultDate = futureDate.toISOString().split('T')[0];

        const response = await axios.get('https://test.api.amadeus.com/v2/shopping/flight-offers', {
            headers: { Authorization: `Bearer ${token}` },
            params: {
                originLocationCode: origin || 'DEL',
                destinationLocationCode: destination || 'BOM',
                departureDate: departureDate || defaultDate,
                adults: 1,
                max: 5
            }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.response?.data || error.message });
    }
});

// ---------------------------------------------------------
// BOOKING.COM (RAPIDAPI) SETUP
// ---------------------------------------------------------
// Test Endpoint: Booking.com Destination Search
app.get('/api/booking/locations', async (req, res) => {
    try {
        const { query } = req.query;

        const response = await axios.get('https://booking-com.p.rapidapi.com/v1/hotels/locations', {
            params: {
                name: query || 'Mumbai',
                locale: 'en-gb'
            },
            headers: {
                'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
                'X-RapidAPI-Host': process.env.RAPIDAPI_HOST
            }
        });

        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.response?.data || error.message });
    }
});


// ---------------------------------------------------------
// SKY SCRAPPER (RAPIDAPI) SETUP
// ---------------------------------------------------------
// Test Endpoint: Sky Scrapper Flight Everywhere Details
app.get('/api/skyscanner/flights-everywhere', async (req, res) => {
    try {
        const { oneWay, currency, originSkyId, originEntityId } = req.query;

        const response = await axios.get('https://sky-scrapper.p.rapidapi.com/api/v2/flights/searchFlightEverywhere', {
            params: {
                originSkyId: originSkyId || 'NYCA',
                originEntityId: originEntityId || '27537542',
                oneWay: oneWay || 'false',
                currency: currency || 'USD'

            },
            headers: {
                'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
                'X-RapidAPI-Host': process.env.SKY_SCRAPPER_HOST || 'sky-scrapper.p.rapidapi.com'
            }
        });

        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.response?.data || error.message });
    }
});

// Alias for searchFlightEverywhere
app.get('/api/skyscanner/searchFlightEverywhere', async (req, res) => {
    try {
        const { oneWay, currency, originSkyId, originEntityId } = req.query;

        const response = await axios.get('https://sky-scrapper.p.rapidapi.com/api/v2/flights/searchFlightEverywhere', {
            params: {
                originSkyId: originSkyId || 'NYCA',
                originEntityId: originEntityId || '27537542',
                oneWay: oneWay || 'false',
                currency: currency || 'USD'
            },
            headers: {
                'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
                'X-RapidAPI-Host': process.env.SKY_SCRAPPER_HOST || 'sky-scrapper.p.rapidapi.com'
            }
        });

        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.response?.data || error.message });
    }
});

// Health Check Route
app.get('/', (req, res) => {
    res.send('Travel API Backend is running! Test /api/amadeus/flights or /api/booking/locations');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
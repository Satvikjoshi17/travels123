const https = require('https');
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'public', 'data');
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

const url = "https://raw.githubusercontent.com/mwgg/Airports/master/airports.json";

https.get(url, (res) => {
    let body = "";

    res.on("data", (chunk) => {
        body += chunk;
    });

    res.on("end", () => {
        try {
            const rawData = JSON.parse(body);
            const airportsArray = [];

            // The raw data is an object with ICAO codes as keys.
            // We want to filter for airports that have an IATA code (commercial airports).
            for (const key in rawData) {
                const airport = rawData[key];
                if (airport.iata && airport.iata !== "\\N" && airport.iata !== "0") {
                    airportsArray.push({
                        name: airport.name,
                        city: airport.city,
                        country: airport.country,
                        code: airport.iata
                    });
                }
            }

            fs.writeFileSync(path.join(dir, 'airports.json'), JSON.stringify(airportsArray));
            console.log(`Successfully saved ${airportsArray.length} commercial airports.`);
        } catch (error) {
            console.error("Error parsing JSON:", error.message);
        }
    });

}).on("error", (error) => {
    console.error("Error fetching data:", error.message);
});

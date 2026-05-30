const https = require('https');
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'public', 'data');

console.log("Fetching cities and countries...");

https.get("https://raw.githubusercontent.com/lutangar/cities.json/master/cities.json", (res) => {
    let body = "";
    res.on("data", chunk => body += chunk);
    res.on("end", () => {
        try {
            const data = JSON.parse(body);
            const citiesArray = data.map(c => `${c.name}, ${c.country}`).slice(0, 30000);
            fs.writeFileSync(path.join(dir, 'cities.json'), JSON.stringify(citiesArray));
            console.log(`Saved ${citiesArray.length} cities.`);
        } catch (e) {
            console.error("City error", e.message);
        }
    });
});

https.get("https://restcountries.com/v3.1/all", (res) => {
    let body = "";
    res.on("data", chunk => body += chunk);
    res.on("end", () => {
        try {
            const data = JSON.parse(body);
            const countriesArray = data.map(c => c.name.common).sort();
            fs.writeFileSync(path.join(dir, 'countries.json'), JSON.stringify(countriesArray));
            console.log(`Saved ${countriesArray.length} countries.`);
        } catch (e) {
            console.error("Country error", e.message);
        }
    });
});

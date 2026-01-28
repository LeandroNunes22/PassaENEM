const fs = require('fs');
const path = require('path');
const https = require('https');

// Load env
const envPath = path.join(__dirname, '..', '.env.local');
let apiKey = '';
try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/GOOGLE_API_KEY=(.*)/);
    if (match) {
        apiKey = match[1].trim();
    }
} catch (e) {
    console.error("Could not read .env.local", e);
    process.exit(1);
}

if (!apiKey) {
    console.error("API Key not found in .env.local");
    process.exit(1);
}

console.log(`Testing with API Key: ${apiKey.substring(0, 10)}...`);

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

console.log(`Sending GET request to: ${url}`);

const req = https.request(url, {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
}, (res) => {
    let responseBody = '';

    console.log(`Status Code: ${res.statusCode}`);

    res.on('data', (chunk) => {
        responseBody += chunk;
    });

    res.on('end', () => {
        try {
            const data = JSON.parse(responseBody);
            if (data.models) {
                console.log("MODELS_START");
                data.models.forEach(m => console.log(m.name.replace('models/', '')));
                console.log("MODELS_END");
            } else {
                console.log("ERROR_DATA:", data);
            }
        } catch (e) {
            console.log("PARSE_ERROR_BODY_LEN:", responseBody.length);
        }
    });
});

req.on('error', (e) => {
    console.error("Request Error:", e);
});

req.end();

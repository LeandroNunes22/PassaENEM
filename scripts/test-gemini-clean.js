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

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

console.log(`Checking Models... Key: ${apiKey.substring(0, 5)}...`);

const req = https.request(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
}, (res) => {
    let body = '';
    res.on('data', c => body += c);
    res.on('end', () => {
        try {
            const data = JSON.parse(body);
            if (data.error) {
                console.error("API Error:", JSON.stringify(data.error, null, 2));
            } else if (data.models) {
                console.log("--- FOUND MODELS ---");
                // Filter for gen-AI models only to keep list short
                const genModels = data.models.filter(m => m.name.includes('gemini'));
                genModels.forEach(m => console.log(m.name.replace('models/', '')));
                console.log("--------------------");
            } else {
                console.log("Unknown Response:", body);
            }
        } catch (e) {
            console.error("Parse Error. Body:", body);
        }
    });
});

req.on('error', (e) => console.error("Req Error:", e));
req.end();

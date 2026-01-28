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
    console.error("API Key not found");
    process.exit(1);
}

const models = [
    "gemini-1.5-flash",
    "gemini-1.5-flash-latest",
    "gemini-1.5-pro",
    "gemini-1.5-pro-latest",
    "gemini-pro",
    "gemini-1.0-pro",
    "gemini-2.0-flash-exp"
];

console.log(`Starting Model Discovery with Key: ${apiKey.substring(0, 5)}...`);

function checkModel(index) {
    if (index >= models.length) {
        console.log("All models failed.");
        return;
    }

    const modelName = models[index];
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
    const data = JSON.stringify({
        contents: [{ parts: [{ text: "Hi" }] }]
    });

    const req = https.request(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    }, (res) => {
        let body = '';
        res.on('data', c => body += c);
        res.on('end', () => {
            if (res.statusCode === 200) {
                console.log(`\n>>> SUCCESS! Working Model Found: ${modelName} <<<\n`);
            } else {
                console.log(`[Fail] ${modelName}: ${res.statusCode}`);
                checkModel(index + 1);
            }
        });
    });

    req.on('error', (e) => {
        console.log(`[Error] ${modelName}: ${e.message}`);
        checkModel(index + 1);
    });

    req.write(data);
    req.end();
}

checkModel(0);

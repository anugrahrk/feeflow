
import http from 'http';

const makeRequest = (i) => {
    const req = http.request({
        hostname: 'localhost',
        port: 3000,
        path: '/api/su/organizations', // Try a protected route (should be 401 or 429)
        method: 'GET',
    }, (res) => {
        console.log(`Request ${i}: Status ${res.statusCode}`);
        res.on('data', () => { }); // Consume API
    });

    req.on('error', (e) => {
        console.error(`Request ${i} error: ${e.message}`);
    });
    req.end();
};

console.log("Sending 10 requests...");
for (let i = 1; i <= 10; i++) {
    setTimeout(() => makeRequest(i), i * 100);
}

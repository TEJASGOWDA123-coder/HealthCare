// ===================================================================
// NETWORK CONFIGURATION
// ===================================================================
// If your server is unreachable on mobile, update the IP below to
// match your current local IP address (run `ipconfig` in CMD/PowerShell
// and look for your Wi-Fi IPv4 address).
// After changing, RESTART the frontend with `npm start`.
// ===================================================================

const LOCAL_IP = '172.16.40.236';

export const environment = {
    production: false,
    // Use local IP so mobile devices on same Wi-Fi can connect
    apiBaseUrl: `http://${LOCAL_IP}:8080`,
    // Mobile Auth URL used in QR codes
    appBaseUrl: `http://${LOCAL_IP}:4200`,
};

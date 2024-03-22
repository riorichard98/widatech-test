"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.request = void 0;
const http = __importStar(require("https"));
function request(url, method = 'GET', params = {}, body, options = {}) {
    // Check if the second parameter is an object, otherwise use an empty object
    if (typeof params !== 'object') {
        params = {};
    }
    // Build query string from params object
    const queryString = Object.entries(params)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');
    // Append query string to the URL if params exist
    const apiUrl = params ? `${url}?${queryString}` : url;
    // Make an HTTP request
    const requestOptions = Object.assign({ method, headers: {
            'Content-Type': 'application/json',
            // Add any additional headers if needed
        } }, options);
    return new Promise((resolve, reject) => {
        const req = http.request(apiUrl, requestOptions, (res) => {
            let data = '';
            // A chunk of data has been received.
            res.on('data', (chunk) => {
                data += chunk;
            });
            // The whole response has been received.
            res.on('end', () => {
                try {
                    // Parse the received data (assuming it's JSON)
                    const jsonData = JSON.parse(data);
                    const httpResponse = {
                        status: res.statusCode || 500,
                        data: jsonData,
                    };
                    resolve(httpResponse);
                }
                catch (error) {
                    reject(new Error('Error parsing JSON: ' + error.message));
                }
            });
        });
        // Handle errors in the request
        req.on('error', (error) => {
            reject(new Error('Request error: ' + error.message));
        });
        // Add the request body if provided
        // Add the request body if provided
        if (body) {
            if (body instanceof FormData) {
                // Handle FormData
                const boundary = '----WebKitFormBoundary' + Math.random().toString(16).slice(2);
                if (requestOptions.headers)
                    requestOptions.headers['Content-Type'] = `multipart/form-data; boundary=${boundary}`;
                for (const [key, value] of body.entries()) {
                    req.write(`--${boundary}\r\n`);
                    req.write(`Content-Disposition: form-data; name="${key}"\r\n\r\n`);
                    req.write(`${value}\r\n`);
                }
                req.write(`--${boundary}--\r\n`);
            }
            else {
                // For other types of bodies, write the body to the request
                const requestBody = JSON.stringify(body);
                if (requestOptions.headers)
                    requestOptions.headers['Content-Length'] = Buffer.from(requestBody).length.toString();
                req.write(requestBody);
            }
        }
        // End the request
        req.end();
    });
}
exports.request = request;

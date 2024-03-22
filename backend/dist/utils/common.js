"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.catchLogger = void 0;
function catchLogger(funct, error) {
    console.error(`[${new Date().toLocaleString()}] ERROR: ${error}`);
    console.error(`ERROR IN FUNCTION: ${funct.name}`);
}
exports.catchLogger = catchLogger;

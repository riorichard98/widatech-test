"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getEnv(envName) {
    const envVariable = process.env[envName];
    if (envVariable === undefined) {
        throw new Error(`Environment variable ${envName} is missing`);
    }
    return envVariable;
}
function terminateProcess(envName, envType) {
    throw new Error(`Environment variable ${envName} is not a ${envType}`);
}
const env = {
    getEnvString: getEnv,
    getEnvNumber: (envName) => {
        const env = getEnv(envName);
        const parsedNumber = Number(env);
        if (isNaN(parsedNumber)) {
            terminateProcess(envName, "number");
        }
        return parsedNumber;
    },
    getEnvBoolean: (envName) => {
        const env = getEnv(envName);
        if (env !== "true" && env !== "false") {
            terminateProcess(envName, "boolean");
        }
        return env === "true";
    },
};
exports.default = env;

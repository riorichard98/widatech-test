interface Env {
    getEnvString: (envName: string) => string;
    getEnvNumber: (envName: string) => number;
    getEnvBoolean: (envName: string) => boolean;
}

function getEnv(envName: string): string {
    const envVariable = process.env[envName];

    if (envVariable === undefined) {
        throw new Error(`Environment variable ${envName} is missing`);
    }

    return envVariable;
}

function terminateProcess(envName: string, envType: string): never {
    throw new Error(`Environment variable ${envName} is not a ${envType}`);
}

const env: Env = {
    getEnvString: getEnv,
    getEnvNumber: (envName: string) => {
        const env = getEnv(envName);
        const parsedNumber = Number(env);

        if (isNaN(parsedNumber)) {
            terminateProcess(envName, "number");
        }

        return parsedNumber;
    },
    getEnvBoolean: (envName: string) => {
        const env = getEnv(envName);

        if (env !== "true" && env !== "false") {
            terminateProcess(envName, "boolean");
        }

        return env === "true";
    },
};

export default env;

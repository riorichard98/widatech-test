export function catchLogger(funct: Function,error: unknown){
    console.error(`[${new Date().toLocaleString()}] ERROR: ${error}`);
    console.error(`ERROR IN FUNCTION: ${funct.name}`)
}
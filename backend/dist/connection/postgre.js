"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
class Pgsql {
    constructor(dbConf) {
        this.pool = new pg_1.Pool({
            user: dbConf.dbUsername,
            host: dbConf.dbHost,
            database: dbConf.dbName,
            port: dbConf.dbPort,
        });
    }
    validateConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.pool.query('SELECT 1');
                // if the db doesn't return any column means the db is invalid ,, which the code must not running
                result.rows.length || process.exit(1);
            }
            catch (error) {
                console.error('Error validating database connection:', error);
                process.exit(1);
            }
        });
    }
}
exports.default = Pgsql;

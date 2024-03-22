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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const invoice_1 = __importDefault(require("./usecase/invoice"));
const product_1 = __importDefault(require("./usecase/product"));
const getEnv_1 = __importDefault(require("./utils/getEnv"));
const postgre_1 = __importDefault(require("./connection/postgre"));
const invoice_repo_1 = require("./domain/invoice_repo");
const product_repo_1 = require("./domain/product_repo");
class Container {
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            const appName = getEnv_1.default.getEnvString("APP_NAME");
            const appPort = getEnv_1.default.getEnvNumber("APP_PORT");
            const appAddress = getEnv_1.default.getEnvString("APP_ADDRESS");
            const dbUsername = getEnv_1.default.getEnvString("PGSQL_USERNAME");
            const dbHost = getEnv_1.default.getEnvString("PGSQL_HOST");
            const dbName = getEnv_1.default.getEnvString("PGSQL_DBNAME");
            const dbPort = getEnv_1.default.getEnvNumber("PGSQL_PORT");
            this.appConf = {
                appName,
                appPort: appPort,
                appAddress: appAddress
            };
            this.dbConf = {
                dbUsername,
                dbHost,
                dbName,
                dbPort: Number(dbPort)
            };
            // databases
            const pgsqlDb = new postgre_1.default(this.dbConf);
            yield pgsqlDb.validateConnection();
            console.log("postgre database connected....");
            // repositories
            const invoiceRepo = new invoice_repo_1.InvoiceRepository(pgsqlDb.pool);
            const productRepo = new product_repo_1.ProductRepository(pgsqlDb.pool);
            // services
            this.invoiceService = new invoice_1.default(invoiceRepo);
            this.productService = new product_1.default(productRepo);
        });
    }
}
exports.default = Container;

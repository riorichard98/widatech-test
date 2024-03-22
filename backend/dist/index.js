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
const fastify_1 = __importDefault(require("fastify"));
const dotenv_1 = __importDefault(require("dotenv"));
const invoice_handler_1 = __importDefault(require("./http_handler/invoice/invoice_handler"));
const product_handler_1 = __importDefault(require("./http_handler/product/product_handler"));
const container_1 = __importDefault(require("./container"));
const loggerMiddleware_1 = require("./middleware/loggerMiddleware");
const ping_1 = __importDefault(require("./http_handler/ping"));
// import code banner 
const banner_1 = require("./assets/banner");
// Load environment variables from .env file
dotenv_1.default.config();
const app = (0, fastify_1.default)({
    logger: {
        level: 'info', // or your desired log level
    },
});
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        const container = new container_1.default();
        yield container.init();
        const invoiceHandler = (0, invoice_handler_1.default)(container);
        const productHandler = (0, product_handler_1.default)(container);
        app.get('/', ping_1.default);
        app.get('/ping', ping_1.default);
        // add middleware before hitting any endpoint except ping
        // app.addHook('preHandler', checkTokenMiddleware); // checking token and passing the decoded in request.user
        const logger = (0, loggerMiddleware_1.loggerMiddleware)();
        app.addHook('onRequest', logger.requestLogger); // logging request body
        app.addHook('onSend', logger.responseLogger); // loging response body
        // invoice routes
        app.post('/invoices', invoiceHandler.makeInvoiceHandler); // make invoice
        app.get('/invoices', invoiceHandler.getAllInvoiceProductHandler); // invoices list with product
        app.get('/invoices/summary', invoiceHandler.getInvoiceSummary); //invoices summary revenue
        // product routes
        app.post('/products', productHandler.getProductsHandler);
        yield app.listen({ port: container.appConf.appPort, host: container.appConf.appAddress });
        console.log(banner_1.banner);
        console.log(`service ${container.appConf.appName} is running`);
        console.log(`Server is running on http://${container.appConf.appAddress}:${container.appConf.appPort}`);
    });
}
start();

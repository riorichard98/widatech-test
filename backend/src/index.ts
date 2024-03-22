import fastify from 'fastify';
import dotenv from 'dotenv';
import InvoiceHandler from './http_handler/invoice/invoice_handler';
import ProductHandler from './http_handler/product/product_handler';
import Container from './container';
import { loggerMiddleware } from './middleware/loggerMiddleware';
import pingHandler from './http_handler/ping';

// import code banner 
import { banner } from './assets/banner';

// Load environment variables from .env file
dotenv.config();

const app = fastify({
    logger: {
        level: 'info', // or your desired log level
    },
});

async function start() {
    const container = new Container();
    await container.init();

    const invoiceHandler = InvoiceHandler(container);
    const productHandler = ProductHandler(container);
    
    app.get('/', pingHandler)
    app.get('/ping', pingHandler)

    // add middleware before hitting any endpoint except ping
    // app.addHook('preHandler', checkTokenMiddleware); // checking token and passing the decoded in request.user

    const logger = loggerMiddleware()
    app.addHook('onRequest', logger.requestLogger); // logging request body
    app.addHook('onSend', logger.responseLogger); // loging response body

    // invoice routes
    app.post('/invoices', invoiceHandler.makeInvoiceHandler); // make invoice
    app.get('/invoices', invoiceHandler.getAllInvoiceProductHandler); // invoices list with product
    app.get('/invoices/summary',invoiceHandler.getInvoiceSummary); //invoices summary revenue

    // product routes
    app.post('/products', productHandler.getProductsHandler)

    await app.listen({ port: container.appConf.appPort, host: container.appConf.appAddress });
    console.log(banner)
    console.log(`service ${container.appConf.appName} is running`)
    console.log(`Server is running on http://${container.appConf.appAddress}:${container.appConf.appPort}`);
}

start();
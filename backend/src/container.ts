import InvoiceService from "./usecase/invoice";
import ProductService from "./usecase/product";

import { DbConfig,AppConfig } from "./pkg/config";
import env from "./utils/getEnv";

import Pgsql from "./connection/postgre";
import { InvoiceRepository } from "./domain/invoice_repo";
import { ProductRepository } from "./domain/product_repo";

export default class Container {
    public dbConf!:DbConfig;  //ensure this are assigned before this are used
    public appConf!:AppConfig;  //ensure this are assigned before this are used
    public invoiceService!:InvoiceService; //ensure this are assigned before this are used
    public productService!:ProductService; //ensure this are assigned before this are used

    async init(){
        const appName = env.getEnvString("APP_NAME")
        const appPort = env.getEnvNumber("APP_PORT")
        const appAddress = env.getEnvString("APP_ADDRESS")
        const dbUsername = env.getEnvString("PGSQL_USERNAME")
        const dbHost = env.getEnvString("PGSQL_HOST")
        const dbName = env.getEnvString("PGSQL_DBNAME")
        const dbPort = env.getEnvNumber("PGSQL_PORT")
        this.appConf = {
            appName,
            appPort:appPort,
            appAddress:appAddress
        };

        this.dbConf = {
            dbUsername,
            dbHost,
            dbName,
            dbPort:Number(dbPort)
        };

        // databases
        const pgsqlDb = new Pgsql(this.dbConf);
        await pgsqlDb.validateConnection();
        console.log("postgre database connected....")

        // repositories
        const invoiceRepo = new InvoiceRepository(pgsqlDb.pool)
        const productRepo = new ProductRepository(pgsqlDb.pool)

        // services
        this.invoiceService = new InvoiceService(invoiceRepo)
        this.productService = new ProductService(productRepo)
    }
}
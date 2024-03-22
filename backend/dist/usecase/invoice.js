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
const response_1 = require("../pkg/response/response");
const responeCode_1 = require("../pkg/response/responeCode");
const common_1 = require("../utils/common");
class InvoiceService {
    constructor(invoiceRepo) {
        this.invoiceRepo = invoiceRepo;
    }
    MakeInvoice(requestData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const Invoice = this.invoiceRepo;
                let resp = (0, response_1.createResponse)(responeCode_1.responseCode.SUCCESS, "success", null);
                const newInvoiceData = {
                    date: new Date(),
                    customer_name: requestData.customer_name,
                    salesperson_name: requestData.salesperson_name,
                    notes: requestData.notes,
                    products: "[" + requestData.products.join(",") + "]"
                };
                yield Invoice.InsertInvoice(newInvoiceData);
                return resp;
            }
            catch (error) {
                (0, common_1.catchLogger)(this.MakeInvoice, error);
                return (0, response_1.serverErrorResponse)();
            }
        });
    }
    GetAllInvoiceProduct(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let pageNumber = Number(page);
                let limitNumber = Number(limit);
                // Check if pageNumber and limitNumber are valid numbers and greater than 0
                if (isNaN(pageNumber) || pageNumber < 1 || isNaN(limitNumber) || limitNumber < 1) {
                    pageNumber = 1;
                    limitNumber = 1;
                }
                const Invoice = this.invoiceRepo;
                const data = {
                    items: [],
                    total: 0
                };
                const invoices = yield Invoice.SelectAllInvoices(limitNumber, pageNumber);
                if (invoices.length > 0) {
                    data.total = invoices[0].total_count;
                    data.items = invoices;
                }
                let resp = (0, response_1.createResponse)(responeCode_1.responseCode.SUCCESS, "success", data);
                return resp;
            }
            catch (error) {
                (0, common_1.catchLogger)(this.GetAllInvoiceProduct, error);
                return (0, response_1.serverErrorResponse)();
            }
        });
    }
    GetInvoiceSummary(interval) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Validate the interval variable , is it including one of these "daily", "weekly", "monthly"
                if (!["daily", "weekly", "monthly"].includes(interval)) {
                    interval = "daily";
                }
                const Invoice = this.invoiceRepo;
                const summary = yield Invoice.SelectInvoiceRevenue(interval);
                let resp = (0, response_1.createResponse)(responeCode_1.responseCode.SUCCESS, "success", summary);
                return resp;
            }
            catch (error) {
                (0, common_1.catchLogger)(this.GetInvoiceSummary, error);
                return (0, response_1.serverErrorResponse)();
            }
        });
    }
}
exports.default = InvoiceService;

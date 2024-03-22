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
exports.ProductRepository = void 0;
const common_1 = require("../utils/common");
class ProductRepository {
    constructor(db) {
        if (!db) {
            console.log("DB IN INVOICE REPOSITORY IS INVALID, PROCESS EXIT...");
            process.exit(1);
        }
        this.db = db;
    }
    SelectProductsByIds(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (ids.length <= 1) {
                    return [];
                }
                const values = [];
                let selectProductSql = `SELECT * FROM PRODUCTS P WHERE P.ID IN (`;
                ids.forEach((e, i) => {
                    values.push(e);
                    selectProductSql += "$" + String(i + 1);
                    if (i < ids.length - 1) {
                        selectProductSql += ",";
                    }
                });
                selectProductSql += ")";
                const result = yield this.db.query(selectProductSql, values);
                return result.rows;
            }
            catch (error) {
                (0, common_1.catchLogger)(this.SelectProductsByIds, error);
                throw error;
            }
        });
    }
}
exports.ProductRepository = ProductRepository;

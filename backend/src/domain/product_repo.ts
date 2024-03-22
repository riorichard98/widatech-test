import { Pool, QueryResult } from 'pg';
import { catchLogger } from '../utils/common';

interface Product {
    id: number;
    name: string;
    picture_url?: string | null;
    stock: number;
    price: number;
}

export class ProductRepository {
    private db: Pool;

    constructor(db: Pool) {
        if (!db) {
            console.log("DB IN INVOICE REPOSITORY IS INVALID, PROCESS EXIT...")
            process.exit(1)
        }
        this.db = db;
    }

    async SelectProductsByIds(ids: string[]): Promise<Product[]> {
        try {
            if (ids.length<=1){
                return [] as Product[]
            }
            const values:string[] = []
            let selectProductSql = `SELECT * FROM PRODUCTS P WHERE P.ID IN (`
            ids.forEach((e,i)=>{
                values.push(e)
                selectProductSql += "$"+String(i+1)
                if (i < ids.length - 1){
                    selectProductSql += ","
                }
            })
            selectProductSql += ")"
            const result: QueryResult = await this.db.query(selectProductSql, values);
            return result.rows as Product[];
        } catch (error) {
            catchLogger(this.SelectProductsByIds, error);
            throw error;
        }
    }
}
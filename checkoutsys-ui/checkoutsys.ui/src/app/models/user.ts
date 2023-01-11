import { Order } from "./order";
import { Product } from "./product";
import { Transaction } from "./transaction";

export class User {
    id?: number;
    name = "";
    username = "";
    email = "";
    password = "";
    role = "";
    orders: Order[] = [];
    products: Product[] = [];
    transactions: Transaction[] = [];
}
import { Order } from "./order";
import { Product } from "./product";
import { Transaction } from "./transaction";

export class User {
    id: number = 0;
    name = "";
    username = "";
    email = "";
    password = "";
    role = "";
    orders: Order[] = [];
    products: Product[] = [];
    transactions: Transaction[] = [];
}
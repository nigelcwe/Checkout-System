import { OrderProducts } from "./order-products";
import { Transaction } from "./transaction";
import { User } from "./user";

export class Order {
    id: number = 0;
    customerId: number = 0;
    date: Date = new Date();
    isCompleted = "";
    user?: User;
    orderProducts: OrderProducts[] = [];
    transaction?: Transaction;
}
import { Order } from "./order";
import { User } from "./user";

export class Transaction {
    id: number = 0;
    orderId: number = 0;
    customerId: number = 0;
    date: Date = new Date();
    totalPrice: number = 0;
    customer?: User;
    order?: Order;
}
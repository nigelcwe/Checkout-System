import { Order } from "./order";
import { User } from "./user";

export class Transaction {
    id?: number;
    orderId?: number;
    customerId?: number;
    dateTime?: Date;
    totalPrice?: number;
    customer?: User;
    order?: Order;
}
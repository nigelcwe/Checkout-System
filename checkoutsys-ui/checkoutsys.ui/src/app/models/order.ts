import { OrderProducts } from "./order-products";
import { Transaction } from "./transaction";
import { User } from "./user";

export class Order {
    id?: number;
    customerId?: number;
    dateTime?: Date;
    isCompleted = "";
    user?: User;
    orderProducts?: OrderProducts[];
    transaction?: Transaction;
}
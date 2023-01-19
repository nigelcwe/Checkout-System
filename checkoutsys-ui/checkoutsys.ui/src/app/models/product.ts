import { OrderProducts } from "./order-products";
import { User } from "./user";

export class Product {
    id: number = 0;
    admindId: number = 0;
    name = "";
    details = "";
    price: number = 0;
    stock: number = 0;
    admin?: User;
    orderProducts: OrderProducts[] = [];
}
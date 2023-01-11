import { OrderProducts } from "./order-products";
import { User } from "./user";

export class Product {
    id?: number;
    admindId?: number;
    name = "";
    details = "";
    price?: number;
    stock?: number;
    admin?: User;
    orderProducts: OrderProducts[] = [];
}
import { Order } from "./order";
import { Product } from "./product";

export class OrderProducts {
    orderId: number = 0;
    productId: number = 0;
    productQty: number = 0;
    order?: Order;
    product?: Product;
}
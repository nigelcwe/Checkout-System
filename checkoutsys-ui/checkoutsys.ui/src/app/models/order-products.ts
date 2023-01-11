import { Order } from "./order";
import { Product } from "./product";

export class OrderProducts {
    orderId?: number;
    productId?: number;
    productQty?: number;
    order?: Order;
    product?: Product;
}
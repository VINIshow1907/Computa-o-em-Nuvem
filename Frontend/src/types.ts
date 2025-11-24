export interface Product {
    id: number;
    name: string;
    price: number;
}
export interface Client {
    id: number;
    name: string;
    email: string;
    cpf: string;
}
export interface CartItem {
    productId: number;
    productName: string;
    quantity: number;
    unitPrice: number;
}
export interface Sale {
    id: number;
    date: string;
    total: number;
    items: {
        productId: number;
        quantity: number;
        unitPrice: number;
    }[];
}
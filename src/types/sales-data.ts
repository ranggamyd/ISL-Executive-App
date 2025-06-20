export interface SalesData {
    id: string;
    date: string;
    amount: number;
    customer: string;
    product: string;
    salesperson: string;
    status: "completed" | "pending" | "cancelled";
}

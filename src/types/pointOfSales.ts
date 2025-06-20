export interface PointOfSales {
    dataOrder: number;
    ordertoday: number;
    point_of_sales: {
        periode_kontrak: string;
        total_penjualan: number;
    }[];
}

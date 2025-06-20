export interface SalesInReport {
    dataOrder: number;
    data: {
        tanggal_masuk: string;
        nominal: number;
        status: string;
    }[];
}

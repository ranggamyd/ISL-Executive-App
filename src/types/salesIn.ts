export interface SalesIn {
    id: number;
    no_dokumen: string;
    tanggal_masuk: string;
    nominal: number;
    type_pembayaran: string;
    type_rekening: string;
    keterangan: string;
    status: string;
    created_at: string;
    created_by: string;
    updated_at: string | null;
    updated_by: string | null;
}

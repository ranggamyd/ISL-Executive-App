export interface DailyQuote {
    sales_name: string;
    supervisor: {
        nama_lengkap: string;
    };
    manager: {
        nama_lengkap: string;
    };
    pelanggan_baru: number;
    pelanggan_lama: number;
    total_request_quotation: number;
    total_biaya_pelanggan_baru: number;
    total_biaya_pelanggan_lama: number;
    total_biaya_akhir: number;
}

// interface APIResponse {
//     recap_quotations: DailyQuote[];
// }

// interface APIError {
//     response: {
//         data: {
//             message: string;
//         };
//     };
// }

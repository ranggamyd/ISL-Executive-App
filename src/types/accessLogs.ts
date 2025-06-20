export interface AccessLogs {
    id: string;
    status: string;
    karyawan: {
        nama_lengkap: string;
    };
    device: {
        nama_device: string;
    };
    jam: string;
}

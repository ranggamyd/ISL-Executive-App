export interface Employee {
    id: string;
    nama_lengkap: string;
    email: string;
    no_telpon: string;
    department: string;
    jabatan: {
        nama_jabatan: string;
    };
    image: string;
    tgl_mulai_kerja: string;
    status_karyawan: "Permanent" | "Special" | "Probation" | "Freelance" | "Training" | "Contract" | "Kontrak" | "Magang/Intern";
}

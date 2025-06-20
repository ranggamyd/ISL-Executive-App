export interface Employee {
    id: string;
    nama_lengkap: string;
    jabatan: {
        nama_jabatan: string;
    };
    shio: string;
    elemen: string;
    status_karyawan: "Permanent" | "Special" | "Probation" | "Freelance" | "Training" | "Contract" | "Kontrak" | "Magang/Intern";
    nik_karyawan: string;
    tgl_mulai_kerja: string;
    tgl_berakhir_kontrak?: string;
    image?: string;
    jenis_kelamin: string;
    tempat_lahir: string;
    tanggal_lahir: string;
    email: string;
    email_pribadi?: string;
    no_telpon: string;
    nik_ktp: string;
    alamat: string;
    kota: string;
    provinsi: string;
    kode_pos: string;
    status_pernikahan: string;
    agama: string;
    kebangsaan: string;
    negara: string;
    department: string;
    grade: string;
    kategori_grade: string;
    status_pekerjaan: string;

    pendidikan?: string; // JSON string yang bisa di-parse ke Education[]
    pengalaman_kerja?: string; // JSON string yang bisa di-parse ke Experience[]
    skill?: string; // JSON string yang bisa di-parse ke Skill[]
    skill_bahasa?: string; // JSON string yang bisa di-parse ke Language[]
    organisasi?: string; // JSON string yang bisa di-parse ke Organization[]
    sertifikat?: string; // JSON string yang bisa di-parse ke Certificate[]
}

export interface Education {
    jenjang: string;
    institusi: string;
    jurusan: string;
    tahun_masuk: string;
    tahun_lulus: string;
}

export interface Experience {
    nama_perusahaan: string;
    lokasi_perusahaan: string;
    posisi_kerja: string;
    mulai_kerja: string;
    akhir_kerja: string;
}

export interface Organization {
    posisi: string;
    nama: string;
    tipe: string;
    mulai_org: string;
    akhir_org: string;
}

export interface Certificate {
    tipe: string;
    nama: string;
    deskripsi: string;
    tanggal_sertifikasi: string;
    tanggal_expired: string;
}

export interface Skill {
    keahlian: string;
    rate: string;
}

export interface Language {
    bahasa: string;
    baca: number;
    tulis: number;
    dengar: number;
    bicara: number;
}

export interface Candidate {
    id: string;
    nama_lengkap: string;
    email: string;
    foto_selfie: string;
    jabatan: {
        nama_jabatan: string;
    };
    pengalaman: string;
    status: "APPROVE INTERVIEW HRD" | "APPROVE OFFERING SALARY HRD";
    created_at: string;
    resume?: string;
    posisi_di_lamar: string;
    shio: string;
    elemen: string;
    months_of_experience: number;
    salary_user: number;
    review_recruitment: {
        kepercayaan_diri: number;
        pengetahuan_perusahaan: number;
        kemampuan_komunikasi: number;
        pengetahuan_jobs: number;
        antusias_perusahaan: number;
        motivasi_kerja: number;
        catatan: string;
        kesimpulan: string;
    };
    review_user: {
        user_competensi: number;
    };
    gender: string;
    umur: string;
    tempat_lahir: string;
    tanggal_lahir: string;
    no_hp: string;
    alamat_ktp: string;
    alamat_domisili: string;
    tgl_kerja: string;
    pendidikan: string;
    pengalaman_kerja: string;
    organisasi: string;
    sertifikat: string;
    skill: string;
    skill_bahasa: string;
    approve_hrd: {
        nama_lengkap: string;
    };
    approve_interview_hrd_by: string;
    approve_interview_hrd_at: string;
    offering_salary?: {
        gaji_pokok: number;
    };
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

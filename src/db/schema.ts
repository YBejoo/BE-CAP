// src/db/schema.ts
import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// ==================== PRODI ====================
export const prodi = sqliteTable('prodi', {
  id: text('id').primaryKey(),
  kode_prodi: text('kode_prodi').notNull().unique(),
  nama_prodi: text('nama_prodi').notNull(),
  fakultas: text('fakultas').notNull(),
  jenjang: text('jenjang', { enum: ['D3', 'D4', 'S1', 'S2', 'S3'] }).notNull(),
  akreditasi: text('akreditasi'),
  created_at: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updated_at: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

// ==================== USERS & AUTH ====================
export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  nama: text('nama').notNull(),
  role: text('role', { enum: ['admin', 'kaprodi', 'dosen'] }).notNull().default('dosen'),
  id_prodi: text('id_prodi').references(() => prodi.id),
  created_at: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updated_at: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

// ==================== KURIKULUM ====================
export const kurikulum = sqliteTable('kurikulum', {
  id: text('id').primaryKey(),
  nama_kurikulum: text('nama_kurikulum').notNull(),
  tahun_berlaku: integer('tahun_berlaku').notNull(),
  is_active: integer('is_active', { mode: 'boolean' }).notNull().default(false),
  id_prodi: text('id_prodi').notNull().references(() => prodi.id),
  created_at: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updated_at: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

// ==================== PROFIL LULUSAN ====================
export const profilLulusan = sqliteTable('profil_lulusan', {
  id: text('id').primaryKey(),
  kode_profil: text('kode_profil').notNull(), // PL-01, PL-02
  profil_lulusan: text('profil_lulusan').notNull(),
  deskripsi: text('deskripsi').notNull(),
  sumber: text('sumber').notNull(),
  id_kurikulum: text('id_kurikulum').notNull().references(() => kurikulum.id),
  created_at: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updated_at: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

// ==================== KOMPETENSI UTAMA LULUSAN (KUL) ====================
export const kompetensiUtama = sqliteTable('kompetensi_utama', {
  id: text('id').primaryKey(),
  kode_kul: text('kode_kul').notNull(), // S1, P1, KU1, KK1
  kompetensi_lulusan: text('kompetensi_lulusan').notNull(),
  aspek: text('aspek', { enum: ['S', 'P', 'KU', 'KK'] }).notNull(),
  id_kurikulum: text('id_kurikulum').notNull().references(() => kurikulum.id),
  created_at: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updated_at: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

// ==================== CPL (Capaian Pembelajaran Lulusan) ====================
export const cpl = sqliteTable('cpl', {
  id: text('id').primaryKey(),
  kode_cpl: text('kode_cpl').notNull(), // CPL-01 atau S1, P1
  deskripsi_cpl: text('deskripsi_cpl').notNull(),
  aspek: text('aspek', { enum: ['S', 'P', 'KU', 'KK'] }).notNull(),
  id_kurikulum: text('id_kurikulum').notNull().references(() => kurikulum.id),
  created_at: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updated_at: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

// ==================== MATRIX CPL-PL ====================
export const matrixCplPl = sqliteTable('matrix_cpl_pl', {
  id: text('id').primaryKey(),
  id_cpl: text('id_cpl').notNull().references(() => cpl.id, { onDelete: 'cascade' }),
  id_profil: text('id_profil').notNull().references(() => profilLulusan.id, { onDelete: 'cascade' }),
  created_at: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

// ==================== BAHAN KAJIAN ====================
export const bahanKajian = sqliteTable('bahan_kajian', {
  id: text('id').primaryKey(),
  kode_bk: text('kode_bk').notNull(), // BK-01, BK-02
  nama_bahan_kajian: text('nama_bahan_kajian').notNull(),
  aspek: text('aspek', { enum: ['S', 'P', 'KU', 'KK'] }).notNull(),
  ranah_keilmuan: text('ranah_keilmuan').notNull(),
  id_kurikulum: text('id_kurikulum').notNull().references(() => kurikulum.id),
  created_at: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updated_at: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

// ==================== MATRIX CPL-BK ====================
export const matrixCplBk = sqliteTable('matrix_cpl_bk', {
  id: text('id').primaryKey(),
  id_cpl: text('id_cpl').notNull().references(() => cpl.id, { onDelete: 'cascade' }),
  id_bk: text('id_bk').notNull().references(() => bahanKajian.id, { onDelete: 'cascade' }),
  created_at: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

// ==================== DOSEN ====================
export const dosen = sqliteTable('dosen', {
  id: text('id').primaryKey(),
  nip: text('nip').notNull().unique(),
  nama_dosen: text('nama_dosen').notNull(),
  email: text('email'),
  bidang_keahlian: text('bidang_keahlian'),
  jabatan_fungsional: text('jabatan_fungsional', { 
    enum: ['Tenaga Pengajar', 'Asisten Ahli', 'Lektor', 'Lektor Kepala', 'Guru Besar'] 
  }),
  id_prodi: text('id_prodi').references(() => prodi.id),
  id_user: text('id_user').references(() => users.id),
  created_at: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updated_at: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

// ==================== MATA KULIAH ====================
export const mataKuliah = sqliteTable('mata_kuliah', {
  id: text('id').primaryKey(),
  kode_mk: text('kode_mk').notNull().unique(),
  nama_mk: text('nama_mk').notNull(),
  sks: integer('sks').notNull(),
  semester: integer('semester').notNull(), // 1-8
  sifat: text('sifat', { enum: ['Wajib', 'Pilihan'] }).notNull(),
  deskripsi: text('deskripsi'),
  id_kurikulum: text('id_kurikulum').notNull().references(() => kurikulum.id),
  id_bahan_kajian: text('id_bahan_kajian').references(() => bahanKajian.id), // 1 BK per MK
  created_at: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updated_at: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

// ==================== MATRIX CPL-MK ====================
export const matrixCplMk = sqliteTable('matrix_cpl_mk', {
  id: text('id').primaryKey(),
  id_cpl: text('id_cpl').notNull().references(() => cpl.id, { onDelete: 'cascade' }),
  id_mk: text('id_mk').notNull().references(() => mataKuliah.id, { onDelete: 'cascade' }),
  created_at: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

// ==================== PENUGASAN DOSEN (MK-Dosen) ====================
export const penugasanDosen = sqliteTable('penugasan_dosen', {
  id: text('id').primaryKey(),
  id_mk: text('id_mk').notNull().references(() => mataKuliah.id, { onDelete: 'cascade' }),
  id_dosen: text('id_dosen').notNull().references(() => dosen.id, { onDelete: 'cascade' }),
  is_koordinator: integer('is_koordinator', { mode: 'boolean' }).notNull().default(false),
  tahun_akademik: text('tahun_akademik').notNull(), // 2024/2025
  semester_akademik: text('semester_akademik', { enum: ['Ganjil', 'Genap'] }).notNull(),
  created_at: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

// ==================== CPMK ====================
export const cpmk = sqliteTable('cpmk', {
  id: text('id').primaryKey(),
  kode_cpmk: text('kode_cpmk').notNull(), // CPMK-1, CPMK-2
  deskripsi_cpmk: text('deskripsi_cpmk').notNull(),
  bobot_persentase: real('bobot_persentase').notNull(),
  id_mk: text('id_mk').notNull().references(() => mataKuliah.id, { onDelete: 'cascade' }),
  id_cpl: text('id_cpl').notNull().references(() => cpl.id),
  created_at: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updated_at: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

// ==================== SUB-CPMK ====================
export const subCpmk = sqliteTable('sub_cpmk', {
  id: text('id').primaryKey(),
  kode_sub: text('kode_sub').notNull(), // L1.1, L1.2
  deskripsi_sub_cpmk: text('deskripsi_sub_cpmk').notNull(),
  indikator: text('indikator').notNull(),
  kriteria_penilaian: text('kriteria_penilaian').notNull(),
  id_cpmk: text('id_cpmk').notNull().references(() => cpmk.id, { onDelete: 'cascade' }),
  created_at: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updated_at: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

// ==================== RPS ====================
export const rps = sqliteTable('rps', {
  id: text('id').primaryKey(),
  id_mk: text('id_mk').notNull().references(() => mataKuliah.id),
  versi: integer('versi').notNull().default(1),
  tahun_akademik: text('tahun_akademik').notNull(),
  semester_akademik: text('semester_akademik', { enum: ['Ganjil', 'Genap'] }).notNull(),
  tgl_penyusunan: integer('tgl_penyusunan', { mode: 'timestamp' }),
  tgl_validasi: integer('tgl_validasi', { mode: 'timestamp' }),
  status: text('status', { enum: ['Draft', 'Menunggu Validasi', 'Terbit'] }).notNull().default('Draft'),
  deskripsi_mk: text('deskripsi_mk'),
  pustaka_utama: text('pustaka_utama'),
  pustaka_pendukung: text('pustaka_pendukung'),
  id_koordinator: text('id_koordinator').references(() => dosen.id),
  id_kaprodi: text('id_kaprodi').references(() => dosen.id),
  created_at: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updated_at: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

// ==================== RPS MINGGU ====================
export const rpsMinggu = sqliteTable('rps_minggu', {
  id: text('id').primaryKey(),
  id_rps: text('id_rps').notNull().references(() => rps.id, { onDelete: 'cascade' }),
  minggu_ke: integer('minggu_ke').notNull(),
  id_sub_cpmk: text('id_sub_cpmk').references(() => subCpmk.id),
  materi: text('materi').notNull(),
  metode_pembelajaran: text('metode_pembelajaran'), // JSON array
  waktu_menit: integer('waktu_menit').notNull().default(150),
  pengalaman_belajar: text('pengalaman_belajar'),
  bentuk_penilaian: text('bentuk_penilaian'), // JSON array
  bobot_penilaian: real('bobot_penilaian'),
  created_at: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updated_at: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

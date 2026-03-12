/**
 * SI-CAP Database Seeder
 * Seeds all entities with realistic data
 * 
 * Run: bun run scripts/seed.ts
 */

import { Database } from 'bun:sqlite';
import { drizzle } from 'drizzle-orm/bun-sqlite';
import * as schema from '../src/db/schema';
import { hashPassword } from '../src/utils/helpers';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';

// Find the actual D1 database file created by wrangler
function findD1Database(): string {
  const d1Dir = '.wrangler/state/v3/d1/miniflare-D1DatabaseObject';
  const files = readdirSync(d1Dir);
  
  // Find the database with the hash name (not db.sqlite)
  const dbFile = files.find((f: string) => f.endsWith('.sqlite') && f !== 'db.sqlite' && f !== 'db.sqlite-shm' && f !== 'db.sqlite-wal');
  
  if (!dbFile) {
    throw new Error('D1 database not found. Please run migrations first: bun run db:migrate');
  }
  
  return join(d1Dir, dbFile);
}

// Create SQLite database for seeding
const dbPath = findD1Database();
console.log(`📂 Using database: ${dbPath}\n`);
const sqlite = new Database(dbPath);
const db = drizzle(sqlite, { schema });

async function seed() {
  console.log('🌱 Starting database seeding...\n');

  try {
    // ============================================
    // 0. CLEAR EXISTING DATA
    // ============================================
    console.log('🗑️  Clearing existing data...');
    
    // Delete in reverse order of foreign key dependencies
    await db.delete(schema.rpsMinggu);
    await db.delete(schema.subCpmk);
    await db.delete(schema.cpmk);
    await db.delete(schema.rps);
    await db.delete(schema.penugasanDosen);
    await db.delete(schema.dosen);
    await db.delete(schema.matrixCplMk);
    await db.delete(schema.matrixCplBk);
    await db.delete(schema.matrixCplPl);
    await db.delete(schema.mataKuliah);
    await db.delete(schema.bahanKajian);
    await db.delete(schema.cpl);
    await db.delete(schema.kompetensiUtama);
    await db.delete(schema.profilLulusan);
    await db.delete(schema.kurikulum);
    await db.delete(schema.prodi);
    await db.delete(schema.users);
    
    console.log('✅ All existing data cleared\n');

    // ============================================
    // 1. SEED USERS (Auth)
    // ============================================
    console.log('👤 Seeding Users...');
    const hashedPassword = await hashPassword('password123');
    
    const users = await db.insert(schema.users).values([
      {
        id: 'user_admin_001',
        email: 'admin@sicap.ac.id',
        password: hashedPassword,
        nama: 'Administrator SI-CAP',
        role: 'admin',
      },
      {
        id: 'user_kaprodi_001',
        email: 'kaprodi.if@sicap.ac.id',
        password: hashedPassword,
        nama: 'Dr. Budi Santoso, M.Kom',
        role: 'kaprodi',
      },
      {
        id: 'user_kaprodi_002',
        email: 'kaprodi2.mi@sicap.ac.id',
        password: hashedPassword,
        nama: 'Dr. Ani Wijaya, M.Kom',
        role: 'kaprodi',
      },
      {
        id: 'user_dosen_001',
        email: 'dosen1@sicap.ac.id',
        password: hashedPassword,
        nama: 'Prof. Dr. Ahmad Dahlan, M.T.',
        role: 'dosen',
      },
      {
        id: 'user_dosen_002',
        email: 'dosen2@sicap.ac.id',
        password: hashedPassword,
        nama: 'Dr. Sri Mulyani, M.Kom',
        role: 'dosen',
      },
      {
        id: 'user_dosen_003',
        email: 'dosen3@sicap.ac.id',
        password: hashedPassword,
        nama: 'Bambang Sudrajat, M.Kom',
        role: 'dosen',
      },
    ]).returning();
    console.log(`✅ Created ${users.length} users\n`);

    // ============================================
    // 2. SEED PRODI
    // ============================================
    console.log('🏫 Seeding Program Studi...');
    const prodis = await db.insert(schema.prodi).values([
      {
        id: 'prodi_001',
        kode_prodi: 'MI',
        nama_prodi: 'Manajemen Informatika',
        fakultas: 'Fakultas Ilmu Komputer',
        jenjang: 'D3',
        akreditasi: 'Unggul',
      },
    ]).returning();
    console.log(`✅ Created ${prodis.length} program studi\n`);

    // ============================================
    // 3. SEED KURIKULUM
    // ============================================
    console.log('📖 Seeding Kurikulum...');
    const kurikulums = await db.insert(schema.kurikulum).values([
      {
        id: 'kurikulum_001',
        nama_kurikulum: 'Kurikulum OBE 2024 - Manajemen Informatika',
        tahun_berlaku: 2024,
        is_active: true,
        id_prodi: 'prodi_001',
      },
      {
        id: 'kurikulum_002',
        nama_kurikulum: 'Kurikulum MBKM 2023 - Manajemen Informatika',
        tahun_berlaku: 2023,
        is_active: false,
        id_prodi: 'prodi_001',
      },
    ]).returning();
    console.log(`✅ Created ${kurikulums.length} kurikulum\n`);

    // ============================================
    // 4. SEED PROFIL LULUSAN
    // ============================================
    console.log('👥 Seeding Profil Lulusan...');
    const profilLulusans = await db.insert(schema.profilLulusan).values([
      {
        id: 'profil_001',
        kode_profil: 'PL-01',
        profil_lulusan: 'Software Engineer',
        deskripsi: 'Mampu merancang, mengembangkan, dan mengelola sistem perangkat lunak yang berkualitas',
        sumber: 'Tracer Study & Industry Analysis 2023',
        id_kurikulum: 'kurikulum_001',
      },
      {
        id: 'profil_002',
        kode_profil: 'PL-02',
        profil_lulusan: 'Data Scientist',
        deskripsi: 'Mampu menganalisis data besar dan menghasilkan insight untuk pengambilan keputusan',
        sumber: 'Market Research & Industry Need',
        id_kurikulum: 'kurikulum_001',
      },
      {
        id: 'profil_003',
        kode_profil: 'PL-03',
        profil_lulusan: 'System Analyst',
        deskripsi: 'Mampu menganalisis kebutuhan sistem dan merancang solusi teknologi informasi',
        sumber: 'Stakeholder Survey 2023',
        id_kurikulum: 'kurikulum_001',
      },
      {
        id: 'profil_004',
        kode_profil: 'PL-04',
        profil_lulusan: 'IT Consultant',
        deskripsi: 'Mampu memberikan konsultasi dan solusi teknologi informasi untuk organisasi',
        sumber: 'Professional Body Recommendation',
        id_kurikulum: 'kurikulum_001',
      },
      {
        id: 'profil_005',
        kode_profil: 'PL-05',
        profil_lulusan: 'Web Developer',
        deskripsi: 'Mampu mengembangkan aplikasi berbasis web yang interaktif dan responsif',
        sumber: 'Industry Partnership & Job Market Analysis',
        id_kurikulum: 'kurikulum_001',
      },
      {
        id: 'profil_006',
        kode_profil: 'PL-06',
        profil_lulusan: 'Mobile App Developer',
        deskripsi: 'Mampu mengembangkan aplikasi mobile untuk platform Android dan iOS',
        sumber: 'Digital Industry Demand Survey 2023',
        id_kurikulum: 'kurikulum_001',
      },
      {
        id: 'profil_007',
        kode_profil: 'PL-07',
        profil_lulusan: 'Database Administrator',
        deskripsi: 'Mampu mengelola, mengoptimalkan, dan memelihara sistem basis data',
        sumber: 'Enterprise IT Survey',
        id_kurikulum: 'kurikulum_001',
      },
      {
        id: 'profil_008',
        kode_profil: 'PL-08',
        profil_lulusan: 'Network Administrator',
        deskripsi: 'Mampu merancang, mengimplementasikan, dan mengelola infrastruktur jaringan',
        sumber: 'IT Infrastructure Market Research',
        id_kurikulum: 'kurikulum_001',
      },
      {
        id: 'profil_009',
        kode_profil: 'PL-09',
        profil_lulusan: 'UI/UX Designer',
        deskripsi: 'Mampu merancang antarmuka pengguna yang intuitif dan pengalaman pengguna yang optimal',
        sumber: 'Creative Industry Partnership',
        id_kurikulum: 'kurikulum_001',
      },
      {
        id: 'profil_010',
        kode_profil: 'PL-10',
        profil_lulusan: 'DevOps Engineer',
        deskripsi: 'Mampu mengintegrasikan pengembangan dan operasional untuk delivery yang efisien',
        sumber: 'Agile Development Practice Study',
        id_kurikulum: 'kurikulum_001',
      },
      {
        id: 'profil_011',
        kode_profil: 'PL-11',
        profil_lulusan: 'Cyber Security Specialist',
        deskripsi: 'Mampu mengamankan sistem informasi dari ancaman siber dan serangan keamanan',
        sumber: 'National Cyber Security Framework',
        id_kurikulum: 'kurikulum_001',
      },
      {
        id: 'profil_012',
        kode_profil: 'PL-12',
        profil_lulusan: 'IT Project Manager',
        deskripsi: 'Mampu merencanakan, mengelola, dan mengevaluasi proyek teknologi informasi',
        sumber: 'Project Management Professional Standards',
        id_kurikulum: 'kurikulum_001',
      },
    ]).returning();
    console.log(`✅ Created ${profilLulusans.length} profil lulusan\n`);

    // ============================================
    // 5. SEED KOMPETENSI UTAMA LULUSAN (KUL)
    // ============================================
    console.log('🎯 Seeding Kompetensi Utama Lulusan...');
    const kuls = await db.insert(schema.kompetensiUtama).values([
      {
        id: 'kul_001',
        kode_kul: 'KUL-S-01',
        kompetensi_lulusan: 'Bertakwa kepada Tuhan Yang Maha Esa dan mampu menunjukkan sikap religius',
        aspek: 'S',
        id_kurikulum: 'kurikulum_001',
      },
      {
        id: 'kul_002',
        kode_kul: 'KUL-P-01',
        kompetensi_lulusan: 'Menguasai konsep teoretis sains alam, aplikasi matematika rekayasa',
        aspek: 'P',
        id_kurikulum: 'kurikulum_001',
      },
      {
        id: 'kul_003',
        kode_kul: 'KUL-KU-01',
        kompetensi_lulusan: 'Mampu menerapkan pemikiran logis, kritis, sistematis, dan inovatif',
        aspek: 'KU',
        id_kurikulum: 'kurikulum_001',
      },
      {
        id: 'kul_004',
        kode_kul: 'KUL-KK-01',
        kompetensi_lulusan: 'Mampu mengembangkan perangkat lunak dengan teknologi terkini',
        aspek: 'KK',
        id_kurikulum: 'kurikulum_001',
      },
    ]).returning();
    console.log(`✅ Created ${kuls.length} kompetensi utama lulusan\n`);

    // ============================================
    // 6. SEED CAPAIAN PEMBELAJARAN LULUSAN (CPL)
    // ============================================
    console.log('📝 Seeding Capaian Pembelajaran Lulusan...');
    const cpls = await db.insert(schema.cpl).values([
      {
        id: 'cpl_001',
        kode_cpl: 'CPL-S-01',
        deskripsi_cpl: 'Bertakwa kepada Tuhan Yang Maha Esa dan mampu menunjukkan sikap religius',
        aspek: 'S',
        id_kurikulum: 'kurikulum_001',
      },
      {
        id: 'cpl_002',
        kode_cpl: 'CPL-S-02',
        deskripsi_cpl: 'Menjunjung tinggi nilai kemanusiaan dalam menjalankan tugas',
        aspek: 'S',
        id_kurikulum: 'kurikulum_001',
      },
      {
        id: 'cpl_003',
        kode_cpl: 'CPL-P-01',
        deskripsi_cpl: 'Menguasai konsep teoretis bidang pengetahuan Informatika secara umum',
        aspek: 'P',
        id_kurikulum: 'kurikulum_001',
      },
      {
        id: 'cpl_004',
        kode_cpl: 'CPL-P-02',
        deskripsi_cpl: 'Menguasai konsep algoritma dan pemrograman',
        aspek: 'P',
        id_kurikulum: 'kurikulum_001',
      },
      {
        id: 'cpl_005',
        kode_cpl: 'CPL-KU-01',
        deskripsi_cpl: 'Mampu menerapkan pemikiran logis, kritis, sistematis dalam konteks pengembangan ilmu',
        aspek: 'KU',
        id_kurikulum: 'kurikulum_001',
      },
      {
        id: 'cpl_006',
        kode_cpl: 'CPL-KU-02',
        deskripsi_cpl: 'Mampu bekerja sama dalam tim multidisiplin',
        aspek: 'KU',
        id_kurikulum: 'kurikulum_001',
      },
      {
        id: 'cpl_007',
        kode_cpl: 'CPL-KK-01',
        deskripsi_cpl: 'Mampu merancang dan mengembangkan sistem perangkat lunak',
        aspek: 'KK',
        id_kurikulum: 'kurikulum_001',
      },
      {
        id: 'cpl_008',
        kode_cpl: 'CPL-KK-02',
        deskripsi_cpl: 'Mampu menganalisis dan memecahkan masalah komputasi',
        aspek: 'KK',
        id_kurikulum: 'kurikulum_001',
      },
    ]).returning();
    console.log(`✅ Created ${cpls.length} capaian pembelajaran lulusan\n`);

    // ============================================
    // 7. SEED CPL-PL MATRIX
    // ============================================
    console.log('🔗 Seeding CPL-Profil Lulusan Mapping...');
    const cplPlMappings = await db.insert(schema.matrixCplPl).values([
      { id: 'matrix_cpl_pl_001', id_cpl: 'cpl_001', id_profil: 'profil_001' },
      { id: 'matrix_cpl_pl_002', id_cpl: 'cpl_002', id_profil: 'profil_001' },
      { id: 'matrix_cpl_pl_003', id_cpl: 'cpl_003', id_profil: 'profil_001' },
      { id: 'matrix_cpl_pl_004', id_cpl: 'cpl_004', id_profil: 'profil_001' },
      { id: 'matrix_cpl_pl_005', id_cpl: 'cpl_007', id_profil: 'profil_001' },
      { id: 'matrix_cpl_pl_006', id_cpl: 'cpl_003', id_profil: 'profil_002' },
      { id: 'matrix_cpl_pl_007', id_cpl: 'cpl_004', id_profil: 'profil_002' },
      { id: 'matrix_cpl_pl_008', id_cpl: 'cpl_008', id_profil: 'profil_002' },
      { id: 'matrix_cpl_pl_009', id_cpl: 'cpl_005', id_profil: 'profil_003' },
      { id: 'matrix_cpl_pl_010', id_cpl: 'cpl_006', id_profil: 'profil_003' },
      { id: 'matrix_cpl_pl_011', id_cpl: 'cpl_003', id_profil: 'profil_003' },
      { id: 'matrix_cpl_pl_012', id_cpl: 'cpl_001', id_profil: 'profil_004' },
      { id: 'matrix_cpl_pl_013', id_cpl: 'cpl_005', id_profil: 'profil_004' },
      { id: 'matrix_cpl_pl_014', id_cpl: 'cpl_006', id_profil: 'profil_004' },
      { id: 'matrix_cpl_pl_015', id_cpl: 'cpl_004', id_profil: 'profil_005' },
      { id: 'matrix_cpl_pl_016', id_cpl: 'cpl_007', id_profil: 'profil_005' },
      { id: 'matrix_cpl_pl_017', id_cpl: 'cpl_005', id_profil: 'profil_005' },
      { id: 'matrix_cpl_pl_018', id_cpl: 'cpl_004', id_profil: 'profil_006' },
      { id: 'matrix_cpl_pl_019', id_cpl: 'cpl_007', id_profil: 'profil_006' },
      { id: 'matrix_cpl_pl_020', id_cpl: 'cpl_005', id_profil: 'profil_006' },
      { id: 'matrix_cpl_pl_021', id_cpl: 'cpl_003', id_profil: 'profil_007' },
      { id: 'matrix_cpl_pl_022', id_cpl: 'cpl_007', id_profil: 'profil_007' },
      { id: 'matrix_cpl_pl_023', id_cpl: 'cpl_008', id_profil: 'profil_007' },
      { id: 'matrix_cpl_pl_024', id_cpl: 'cpl_003', id_profil: 'profil_008' },
      { id: 'matrix_cpl_pl_025', id_cpl: 'cpl_007', id_profil: 'profil_008' },
      { id: 'matrix_cpl_pl_026', id_cpl: 'cpl_008', id_profil: 'profil_008' },
      { id: 'matrix_cpl_pl_027', id_cpl: 'cpl_004', id_profil: 'profil_009' },
      { id: 'matrix_cpl_pl_028', id_cpl: 'cpl_005', id_profil: 'profil_009' },
      { id: 'matrix_cpl_pl_029', id_cpl: 'cpl_006', id_profil: 'profil_009' },
      { id: 'matrix_cpl_pl_030', id_cpl: 'cpl_001', id_profil: 'profil_010' },
      { id: 'matrix_cpl_pl_031', id_cpl: 'cpl_007', id_profil: 'profil_010' },
      { id: 'matrix_cpl_pl_032', id_cpl: 'cpl_005', id_profil: 'profil_010' },
      { id: 'matrix_cpl_pl_033', id_cpl: 'cpl_006', id_profil: 'profil_010' },
      { id: 'matrix_cpl_pl_034', id_cpl: 'cpl_003', id_profil: 'profil_011' },
      { id: 'matrix_cpl_pl_035', id_cpl: 'cpl_007', id_profil: 'profil_011' },
      { id: 'matrix_cpl_pl_036', id_cpl: 'cpl_008', id_profil: 'profil_011' },
      { id: 'matrix_cpl_pl_037', id_cpl: 'cpl_002', id_profil: 'profil_012' },
      { id: 'matrix_cpl_pl_038', id_cpl: 'cpl_005', id_profil: 'profil_012' },
      { id: 'matrix_cpl_pl_039', id_cpl: 'cpl_006', id_profil: 'profil_012' },
    ]).returning();
    console.log(`✅ Created ${cplPlMappings.length} CPL-PL mappings\n`);

    // ============================================
    // 8. SEED BAHAN KAJIAN
    // ============================================
    console.log('📚 Seeding Bahan Kajian...');
    const bahanKajians = await db.insert(schema.bahanKajian).values([
      {
        id: 'bk_001',
        kode_bk: 'BK-01',
        nama_bahan_kajian: 'Dasar Pemrograman',
        aspek: 'P',
        ranah_keilmuan: 'Inti',
        id_kurikulum: 'kurikulum_001',
      },
      {
        id: 'bk_002',
        kode_bk: 'BK-02',
        nama_bahan_kajian: 'Struktur Data dan Algoritma',
        aspek: 'KK',
        ranah_keilmuan: 'Inti',
        id_kurikulum: 'kurikulum_001',
      },
      {
        id: 'bk_003',
        kode_bk: 'BK-03',
        nama_bahan_kajian: 'Basis Data',
        aspek: 'P',
        ranah_keilmuan: 'Inti',
        id_kurikulum: 'kurikulum_001',
      },
      {
        id: 'bk_004',
        kode_bk: 'BK-04',
        nama_bahan_kajian: 'Rekayasa Perangkat Lunak',
        aspek: 'KK',
        ranah_keilmuan: 'Inti',
        id_kurikulum: 'kurikulum_001',
      },
      {
        id: 'bk_005',
        kode_bk: 'BK-05',
        nama_bahan_kajian: 'Kecerdasan Buatan',
        aspek: 'KK',
        ranah_keilmuan: 'Pilihan',
        id_kurikulum: 'kurikulum_001',
      },
      {
        id: 'bk_006',
        kode_bk: 'BK-06',
        nama_bahan_kajian: 'Matematika Diskrit',
        aspek: 'P',
        ranah_keilmuan: 'Inti',
        id_kurikulum: 'kurikulum_001',
      },
      {
        id: 'bk_007',
        kode_bk: 'BK-07',
        nama_bahan_kajian: 'Jaringan Komputer',
        aspek: 'KK',
        ranah_keilmuan: 'Inti',
        id_kurikulum: 'kurikulum_001',
      },
      {
        id: 'bk_008',
        kode_bk: 'BK-08',
        nama_bahan_kajian: 'Sistem Operasi',
        aspek: 'P',
        ranah_keilmuan: 'Inti',
        id_kurikulum: 'kurikulum_001',
      },
      {
        id: 'bk_009',
        kode_bk: 'BK-09',
        nama_bahan_kajian: 'Pemrograman Web',
        aspek: 'KK',
        ranah_keilmuan: 'Inti',
        id_kurikulum: 'kurikulum_001',
      },
      {
        id: 'bk_010',
        kode_bk: 'BK-10',
        nama_bahan_kajian: 'Pemrograman Mobile',
        aspek: 'KK',
        ranah_keilmuan: 'Inti',
        id_kurikulum: 'kurikulum_001',
      },
      {
        id: 'bk_011',
        kode_bk: 'BK-11',
        nama_bahan_kajian: 'Keamanan Informasi',
        aspek: 'KK',
        ranah_keilmuan: 'Inti',
        id_kurikulum: 'kurikulum_001',
      },
      {
        id: 'bk_012',
        kode_bk: 'BK-12',
        nama_bahan_kajian: 'Sistem Informasi Manajemen',
        aspek: 'P',
        ranah_keilmuan: 'Inti',
        id_kurikulum: 'kurikulum_001',
      },
      {
        id: 'bk_013',
        kode_bk: 'BK-13',
        nama_bahan_kajian: 'Analisis dan Desain Sistem',
        aspek: 'KK',
        ranah_keilmuan: 'Inti',
        id_kurikulum: 'kurikulum_001',
      },
      {
        id: 'bk_014',
        kode_bk: 'BK-14',
        nama_bahan_kajian: 'Interaksi Manusia dan Komputer',
        aspek: 'P',
        ranah_keilmuan: 'Inti',
        id_kurikulum: 'kurikulum_001',
      },
      {
        id: 'bk_015',
        kode_bk: 'BK-15',
        nama_bahan_kajian: 'Machine Learning',
        aspek: 'KK',
        ranah_keilmuan: 'Pilihan',
        id_kurikulum: 'kurikulum_001',
      },
      {
        id: 'bk_016',
        kode_bk: 'BK-16',
        nama_bahan_kajian: 'Cloud Computing',
        aspek: 'KK',
        ranah_keilmuan: 'Pilihan',
        id_kurikulum: 'kurikulum_001',
      },
      {
        id: 'bk_017',
        kode_bk: 'BK-17',
        nama_bahan_kajian: 'Internet of Things',
        aspek: 'KK',
        ranah_keilmuan: 'Pilihan',
        id_kurikulum: 'kurikulum_001',
      },
      {
        id: 'bk_018',
        kode_bk: 'BK-18',
        nama_bahan_kajian: 'Manajemen Proyek TI',
        aspek: 'KU',
        ranah_keilmuan: 'Inti',
        id_kurikulum: 'kurikulum_001',
      },
    ]).returning();
    console.log(`✅ Created ${bahanKajians.length} bahan kajian\n`);

    // ============================================
    // 9. SEED CPL-BK MATRIX
    // ============================================
    console.log('🔗 Seeding CPL-Bahan Kajian Mapping...');
    const cplBkMappings = await db.insert(schema.matrixCplBk).values([
      { id: 'matrix_cpl_bk_001', id_cpl: 'cpl_003', id_bk: 'bk_001' },
      { id: 'matrix_cpl_bk_002', id_cpl: 'cpl_004', id_bk: 'bk_001' },
      { id: 'matrix_cpl_bk_003', id_cpl: 'cpl_004', id_bk: 'bk_002' },
      { id: 'matrix_cpl_bk_004', id_cpl: 'cpl_007', id_bk: 'bk_002' },
      { id: 'matrix_cpl_bk_005', id_cpl: 'cpl_003', id_bk: 'bk_003' },
      { id: 'matrix_cpl_bk_006', id_cpl: 'cpl_007', id_bk: 'bk_003' },
      { id: 'matrix_cpl_bk_007', id_cpl: 'cpl_007', id_bk: 'bk_004' },
      { id: 'matrix_cpl_bk_008', id_cpl: 'cpl_008', id_bk: 'bk_005' },
      { id: 'matrix_cpl_bk_009', id_cpl: 'cpl_003', id_bk: 'bk_006' },
      { id: 'matrix_cpl_bk_010', id_cpl: 'cpl_005', id_bk: 'bk_006' },
      { id: 'matrix_cpl_bk_011', id_cpl: 'cpl_003', id_bk: 'bk_007' },
      { id: 'matrix_cpl_bk_012', id_cpl: 'cpl_007', id_bk: 'bk_007' },
      { id: 'matrix_cpl_bk_013', id_cpl: 'cpl_008', id_bk: 'bk_007' },
      { id: 'matrix_cpl_bk_014', id_cpl: 'cpl_003', id_bk: 'bk_008' },
      { id: 'matrix_cpl_bk_015', id_cpl: 'cpl_004', id_bk: 'bk_008' },
      { id: 'matrix_cpl_bk_016', id_cpl: 'cpl_004', id_bk: 'bk_009' },
      { id: 'matrix_cpl_bk_017', id_cpl: 'cpl_007', id_bk: 'bk_009' },
      { id: 'matrix_cpl_bk_018', id_cpl: 'cpl_005', id_bk: 'bk_009' },
      { id: 'matrix_cpl_bk_019', id_cpl: 'cpl_004', id_bk: 'bk_010' },
      { id: 'matrix_cpl_bk_020', id_cpl: 'cpl_007', id_bk: 'bk_010' },
      { id: 'matrix_cpl_bk_021', id_cpl: 'cpl_005', id_bk: 'bk_010' },
      { id: 'matrix_cpl_bk_022', id_cpl: 'cpl_003', id_bk: 'bk_011' },
      { id: 'matrix_cpl_bk_023', id_cpl: 'cpl_007', id_bk: 'bk_011' },
      { id: 'matrix_cpl_bk_024', id_cpl: 'cpl_008', id_bk: 'bk_011' },
      { id: 'matrix_cpl_bk_025', id_cpl: 'cpl_003', id_bk: 'bk_012' },
      { id: 'matrix_cpl_bk_026', id_cpl: 'cpl_005', id_bk: 'bk_012' },
      { id: 'matrix_cpl_bk_027', id_cpl: 'cpl_006', id_bk: 'bk_012' },
      { id: 'matrix_cpl_bk_028', id_cpl: 'cpl_005', id_bk: 'bk_013' },
      { id: 'matrix_cpl_bk_029', id_cpl: 'cpl_007', id_bk: 'bk_013' },
      { id: 'matrix_cpl_bk_030', id_cpl: 'cpl_008', id_bk: 'bk_013' },
      { id: 'matrix_cpl_bk_031', id_cpl: 'cpl_003', id_bk: 'bk_014' },
      { id: 'matrix_cpl_bk_032', id_cpl: 'cpl_005', id_bk: 'bk_014' },
      { id: 'matrix_cpl_bk_033', id_cpl: 'cpl_006', id_bk: 'bk_014' },
      { id: 'matrix_cpl_bk_034', id_cpl: 'cpl_004', id_bk: 'bk_015' },
      { id: 'matrix_cpl_bk_035', id_cpl: 'cpl_008', id_bk: 'bk_015' },
      { id: 'matrix_cpl_bk_036', id_cpl: 'cpl_005', id_bk: 'bk_015' },
      { id: 'matrix_cpl_bk_037', id_cpl: 'cpl_004', id_bk: 'bk_016' },
      { id: 'matrix_cpl_bk_038', id_cpl: 'cpl_007', id_bk: 'bk_016' },
      { id: 'matrix_cpl_bk_039', id_cpl: 'cpl_008', id_bk: 'bk_016' },
      { id: 'matrix_cpl_bk_040', id_cpl: 'cpl_004', id_bk: 'bk_017' },
      { id: 'matrix_cpl_bk_041', id_cpl: 'cpl_007', id_bk: 'bk_017' },
      { id: 'matrix_cpl_bk_042', id_cpl: 'cpl_008', id_bk: 'bk_017' },
      { id: 'matrix_cpl_bk_043', id_cpl: 'cpl_005', id_bk: 'bk_018' },
      { id: 'matrix_cpl_bk_044', id_cpl: 'cpl_006', id_bk: 'bk_018' },
    ]).returning();
    console.log(`✅ Created ${cplBkMappings.length} CPL-BK mappings\n`);

    // ============================================
    // 10. SEED MATA KULIAH
    // ============================================
    console.log('📕 Seeding Mata Kuliah...');
    const mataKuliahs = await db.insert(schema.mataKuliah).values([
      {
        id: 'mk_001',
        kode_mk: 'IF101',
        nama_mk: 'Algoritma dan Pemrograman',
        sks: 4,
        semester: 1,
        sifat: 'Wajib',
        deskripsi: 'Mata kuliah dasar pemrograman dan algoritma',
        id_kurikulum: 'kurikulum_001',
        id_bahan_kajian: 'bk_001',
      },
      {
        id: 'mk_002',
        kode_mk: 'IF102',
        nama_mk: 'Matematika Diskrit',
        sks: 3,
        semester: 1,
        sifat: 'Wajib',
        deskripsi: 'Logika matematika dan struktur diskrit',
        id_kurikulum: 'kurikulum_001',
      },
      {
        id: 'mk_003',
        kode_mk: 'IF201',
        nama_mk: 'Struktur Data',
        sks: 4,
        semester: 2,
        sifat: 'Wajib',
        deskripsi: 'Struktur data dan implementasinya',
        id_kurikulum: 'kurikulum_001',
        id_bahan_kajian: 'bk_002',
      },
      {
        id: 'mk_004',
        kode_mk: 'IF202',
        nama_mk: 'Basis Data',
        sks: 3,
        semester: 2,
        sifat: 'Wajib',
        deskripsi: 'Konsep dan desain basis data',
        id_kurikulum: 'kurikulum_001',
        id_bahan_kajian: 'bk_003',
      },
      {
        id: 'mk_005',
        kode_mk: 'IF301',
        nama_mk: 'Rekayasa Perangkat Lunak',
        sks: 3,
        semester: 3,
        sifat: 'Wajib',
        deskripsi: 'Metodologi pengembangan perangkat lunak',
        id_kurikulum: 'kurikulum_001',
        id_bahan_kajian: 'bk_004',
      },
      {
        id: 'mk_006',
        kode_mk: 'IF401',
        nama_mk: 'Kecerdasan Buatan',
        sks: 3,
        semester: 4,
        sifat: 'Pilihan',
        deskripsi: 'Konsep dan aplikasi AI',
        id_kurikulum: 'kurikulum_001',
        id_bahan_kajian: 'bk_005',
      },
    ]).returning();
    console.log(`✅ Created ${mataKuliahs.length} mata kuliah\n`);

    // ============================================
    // 11. SEED CPL-MK MATRIX
    // ============================================
    console.log('🔗 Seeding CPL-Mata Kuliah Mapping...');
    const cplMkMappings = await db.insert(schema.matrixCplMk).values([
      { id: 'matrix_cpl_mk_001', id_cpl: 'cpl_004', id_mk: 'mk_001' },
      { id: 'matrix_cpl_mk_002', id_cpl: 'cpl_007', id_mk: 'mk_001' },
      { id: 'matrix_cpl_mk_003', id_cpl: 'cpl_003', id_mk: 'mk_002' },
      { id: 'matrix_cpl_mk_004', id_cpl: 'cpl_004', id_mk: 'mk_003' },
      { id: 'matrix_cpl_mk_005', id_cpl: 'cpl_007', id_mk: 'mk_003' },
      { id: 'matrix_cpl_mk_006', id_cpl: 'cpl_003', id_mk: 'mk_004' },
      { id: 'matrix_cpl_mk_007', id_cpl: 'cpl_007', id_mk: 'mk_005' },
      { id: 'matrix_cpl_mk_008', id_cpl: 'cpl_008', id_mk: 'mk_006' },
    ]).returning();
    console.log(`✅ Created ${cplMkMappings.length} CPL-MK mappings\n`);

    // ============================================
    // 12. SEED DOSEN
    // ============================================
    console.log('👨‍🏫 Seeding Dosen...');
    const dosens = await db.insert(schema.dosen).values([
      {
        id: 'dosen_001',
        nip: '197501012000031001',
        nama_dosen: 'Prof. Dr. Ahmad Dahlan, M.T.',
        email: 'ahmad.dahlan@sicap.ac.id',
        bidang_keahlian: 'Software Engineering',
        jabatan_fungsional: 'Guru Besar',
        id_prodi: 'prodi_001',
        id_user: 'user_dosen_001',
      },
      {
        id: 'dosen_002',
        nip: '198203152005012002',
        nama_dosen: 'Dr. Sri Mulyani, M.Kom',
        email: 'sri.mulyani@sicap.ac.id',
        bidang_keahlian: 'Data Science & AI',
        jabatan_fungsional: 'Lektor Kepala',
        id_prodi: 'prodi_001',
        id_user: 'user_dosen_002',
      },
      {
        id: 'dosen_003',
        nip: '198905202010121003',
        nama_dosen: 'Bambang Sudrajat, M.Kom',
        email: 'bambang.s@sicap.ac.id',
        bidang_keahlian: 'Database & Information System',
        jabatan_fungsional: 'Lektor',
        id_prodi: 'prodi_001',
        id_user: 'user_dosen_003',
      },
    ]).returning();
    console.log(`✅ Created ${dosens.length} dosen\n`);

    // ============================================
    // 13. SEED DOSEN PENGAMPU
    // ============================================
    console.log('👨‍🏫 Seeding Dosen Pengampu...');
    const dosenPengampus = await db.insert(schema.penugasanDosen).values([
      {
        id: 'penugasan_001',
        id_dosen: 'dosen_001',
        id_mk: 'mk_001',
        tahun_akademik: '2024/2025',
        semester_akademik: 'Ganjil',
        is_koordinator: true,
      },
      {
        id: 'penugasan_002',
        id_dosen: 'dosen_002',
        id_mk: 'mk_001',
        tahun_akademik: '2024/2025',
        semester_akademik: 'Ganjil',
        is_koordinator: false,
      },
      {
        id: 'penugasan_003',
        id_dosen: 'dosen_003',
        id_mk: 'mk_004',
        tahun_akademik: '2024/2025',
        semester_akademik: 'Ganjil',
        is_koordinator: true,
      },
      {
        id: 'penugasan_004',
        id_dosen: 'dosen_002',
        id_mk: 'mk_006',
        tahun_akademik: '2024/2025',
        semester_akademik: 'Ganjil',
        is_koordinator: true,
      },
    ]).returning();
    console.log(`✅ Created ${dosenPengampus.length} dosen pengampu\n`);

    // ============================================
    // 14. SEED RPS
    // ============================================
    console.log('📄 Seeding RPS...');
    const rpsData = await db.insert(schema.rps).values([
      {
        id: 'rps_001',
        id_mk: 'mk_001',
        versi: 1,
        tahun_akademik: '2024/2025',
        semester_akademik: 'Ganjil',
        tgl_penyusunan: new Date('2024-08-01'),
        deskripsi_mk: 'Mata kuliah ini membahas konsep dasar algoritma dan pemrograman',
        pustaka_utama: 'Introduction to Algorithms - Cormen',
        pustaka_pendukung: 'Clean Code - Robert Martin',
        status: 'Terbit',
        id_koordinator: 'dosen_001',
      },
      {
        id: 'rps_002',
        id_mk: 'mk_004',
        versi: 1,
        tahun_akademik: '2024/2025',
        semester_akademik: 'Ganjil',
        tgl_penyusunan: new Date('2024-08-05'),
        deskripsi_mk: 'Mata kuliah tentang konsep dan desain basis data',
        pustaka_utama: 'Database Systems - Elmasri',
        status: 'Draft',
        id_koordinator: 'dosen_003',
      },
      {
        id: 'rps_003',
        id_mk: 'mk_006',
        versi: 1,
        tahun_akademik: '2024/2025',
        semester_akademik: 'Ganjil',
        tgl_penyusunan: new Date('2024-08-10'),
        deskripsi_mk: 'Mata kuliah tentang konsep dan aplikasi kecerdasan buatan',
        pustaka_utama: 'Artificial Intelligence: A Modern Approach - Russell & Norvig',
        status: 'Menunggu Validasi',
        id_koordinator: 'dosen_002',
      },
    ]).returning();
    console.log(`✅ Created ${rpsData.length} RPS\n`);

    // ============================================
    // 15. SEED CPMK
    // ============================================
    console.log('✅ Seeding CPMK...');
    const cpmks = await db.insert(schema.cpmk).values([
      {
        id: 'cpmk_001',
        kode_cpmk: 'CPMK-01',
        deskripsi_cpmk: 'Mahasiswa mampu memahami konsep algoritma',
        bobot_persentase: 30,
        id_mk: 'mk_001',
        id_cpl: 'cpl_004',
      },
      {
        id: 'cpmk_002',
        kode_cpmk: 'CPMK-02',
        deskripsi_cpmk: 'Mahasiswa mampu mengimplementasikan algoritma dalam bahasa pemrograman',
        bobot_persentase: 40,
        id_mk: 'mk_001',
        id_cpl: 'cpl_007',
      },
      {
        id: 'cpmk_003',
        kode_cpmk: 'CPMK-03',
        deskripsi_cpmk: 'Mahasiswa mampu menganalisis kompleksitas algoritma',
        bobot_persentase: 30,
        id_mk: 'mk_001',
        id_cpl: 'cpl_008',
      },
      {
        id: 'cpmk_004',
        kode_cpmk: 'CPMK-01',
        deskripsi_cpmk: 'Mahasiswa mampu memahami model data',
        bobot_persentase: 25,
        id_mk: 'mk_004',
        id_cpl: 'cpl_003',
      },
      {
        id: 'cpmk_005',
        kode_cpmk: 'CPMK-02',
        deskripsi_cpmk: 'Mahasiswa mampu merancang basis data',
        bobot_persentase: 40,
        id_mk: 'mk_004',
        id_cpl: 'cpl_007',
      },
      {
        id: 'cpmk_006',
        kode_cpmk: 'CPMK-03',
        deskripsi_cpmk: 'Mahasiswa mampu mengimplementasikan basis data',
        bobot_persentase: 35,
        id_mk: 'mk_004',
        id_cpl: 'cpl_007',
      },
      {
        id: 'cpmk_007',
        kode_cpmk: 'CPMK-01',
        deskripsi_cpmk: 'Mahasiswa mampu memahami konsep logika matematika',
        bobot_persentase: 35,
        id_mk: 'mk_002',
        id_cpl: 'cpl_003',
      },
      {
        id: 'cpmk_008',
        kode_cpmk: 'CPMK-02',
        deskripsi_cpmk: 'Mahasiswa mampu menerapkan teori graf dan kombinatorik',
        bobot_persentase: 30,
        id_mk: 'mk_002',
        id_cpl: 'cpl_005',
      },
      {
        id: 'cpmk_009',
        kode_cpmk: 'CPMK-03',
        deskripsi_cpmk: 'Mahasiswa mampu menyelesaikan masalah diskrit',
        bobot_persentase: 35,
        id_mk: 'mk_002',
        id_cpl: 'cpl_008',
      },
      {
        id: 'cpmk_010',
        kode_cpmk: 'CPMK-01',
        deskripsi_cpmk: 'Mahasiswa mampu memahami berbagai struktur data',
        bobot_persentase: 30,
        id_mk: 'mk_003',
        id_cpl: 'cpl_004',
      },
      {
        id: 'cpmk_011',
        kode_cpmk: 'CPMK-02',
        deskripsi_cpmk: 'Mahasiswa mampu mengimplementasikan struktur data',
        bobot_persentase: 40,
        id_mk: 'mk_003',
        id_cpl: 'cpl_007',
      },
      {
        id: 'cpmk_012',
        kode_cpmk: 'CPMK-03',
        deskripsi_cpmk: 'Mahasiswa mampu menganalisis efisiensi struktur data',
        bobot_persentase: 30,
        id_mk: 'mk_003',
        id_cpl: 'cpl_008',
      },
      {
        id: 'cpmk_013',
        kode_cpmk: 'CPMK-01',
        deskripsi_cpmk: 'Mahasiswa mampu memahami SDLC dan metodologi pengembangan',
        bobot_persentase: 25,
        id_mk: 'mk_005',
        id_cpl: 'cpl_003',
      },
      {
        id: 'cpmk_014',
        kode_cpmk: 'CPMK-02',
        deskripsi_cpmk: 'Mahasiswa mampu merancang sistem dengan UML',
        bobot_persentase: 35,
        id_mk: 'mk_005',
        id_cpl: 'cpl_007',
      },
      {
        id: 'cpmk_015',
        kode_cpmk: 'CPMK-03',
        deskripsi_cpmk: 'Mahasiswa mampu mengelola proyek perangkat lunak',
        bobot_persentase: 40,
        id_mk: 'mk_005',
        id_cpl: 'cpl_006',
      },
      {
        id: 'cpmk_016',
        kode_cpmk: 'CPMK-01',
        deskripsi_cpmk: 'Mahasiswa mampu memahami konsep AI dan machine learning',
        bobot_persentase: 30,
        id_mk: 'mk_006',
        id_cpl: 'cpl_003',
      },
      {
        id: 'cpmk_017',
        kode_cpmk: 'CPMK-02',
        deskripsi_cpmk: 'Mahasiswa mampu mengimplementasikan algoritma AI',
        bobot_persentase: 40,
        id_mk: 'mk_006',
        id_cpl: 'cpl_008',
      },
      {
        id: 'cpmk_018',
        kode_cpmk: 'CPMK-03',
        deskripsi_cpmk: 'Mahasiswa mampu menganalisis dan mengevaluasi model AI',
        bobot_persentase: 30,
        id_mk: 'mk_006',
        id_cpl: 'cpl_008',
      },
    ]).returning();
    console.log(`✅ Created ${cpmks.length} CPMK\n`);

    // ============================================
    // 16. SEED SUB-CPMK
    // ============================================
    console.log('📋 Seeding Sub-CPMK...');
    const subCpmks = await db.insert(schema.subCpmk).values([
      {
        id: 'subcpmk_001',
        kode_sub: 'SUB-CPMK-01.1',
        deskripsi_sub_cpmk: 'Mahasiswa dapat menjelaskan definisi algoritma',
        indikator: 'Ketepatan dalam menjelaskan definisi algoritma',
        kriteria_penilaian: 'Kelengkapan dan kebenaran penjelasan',
        id_cpmk: 'cpmk_001',
      },
      {
        id: 'subcpmk_002',
        kode_sub: 'SUB-CPMK-01.2',
        deskripsi_sub_cpmk: 'Mahasiswa dapat membedakan jenis-jenis algoritma',
        indikator: 'Kemampuan membedakan berbagai jenis algoritma',
        kriteria_penilaian: 'Ketepatan dalam membedakan dan memberikan contoh',
        id_cpmk: 'cpmk_001',
      },
      {
        id: 'subcpmk_003',
        kode_sub: 'SUB-CPMK-02.1',
        deskripsi_sub_cpmk: 'Mahasiswa dapat menulis kode dalam bahasa pemrograman',
        indikator: 'Ketepatan sintaks dan logika program',
        kriteria_penilaian: 'Program berjalan tanpa error dan menghasilkan output yang benar',
        id_cpmk: 'cpmk_002',
      },
    ]).returning();
    console.log(`✅ Created ${subCpmks.length} Sub-CPMK\n`);

    // ============================================
    // 17. SEED RPS MINGGU
    // ============================================
    console.log('📅 Seeding RPS Minggu...');
    const rpsMinggu = await db.insert(schema.rpsMinggu).values([
      {
        id: 'rpsminggu_001',
        id_rps: 'rps_001',
        minggu_ke: 1,
        id_sub_cpmk: 'subcpmk_001',
        materi: 'Pengenalan Algoritma dan Pemrograman',
        metode_pembelajaran: 'Ceramah, Diskusi, Praktikum',
        waktu_menit: 150,
        pengalaman_belajar: 'Mahasiswa mengikuti penjelasan konsep dasar algoritma',
        bentuk_penilaian: 'Quiz',
        bobot_penilaian: 5,
      },
      {
        id: 'rpsminggu_002',
        id_rps: 'rps_001',
        minggu_ke: 2,
        id_sub_cpmk: 'subcpmk_002',
        materi: 'Jenis-jenis Algoritma',
        metode_pembelajaran: 'Ceramah, Studi Kasus',
        waktu_menit: 150,
        pengalaman_belajar: 'Mahasiswa mempelajari berbagai jenis algoritma',
        bentuk_penilaian: 'Tugas',
        bobot_penilaian: 10,
      },
      {
        id: 'rpsminggu_003',
        id_rps: 'rps_001',
        minggu_ke: 3,
        id_sub_cpmk: 'subcpmk_003',
        materi: 'Implementasi Algoritma dalam Bahasa Pemrograman',
        metode_pembelajaran: 'Project-Based Learning',
        waktu_menit: 150,
        pengalaman_belajar: 'Mahasiswa membuat program sederhana',
        bentuk_penilaian: 'Project',
        bobot_penilaian: 15,
      },
    ]).returning();
    console.log(`✅ Created ${rpsMinggu.length} RPS Minggu\n`);

    // ============================================
    // 18. SEED PENILAIAN (COMMENTED - Table not in schema)
    // ============================================
    // console.log('📊 Seeding Penilaian...');
    // const penilaians = await db.insert(schema.penilaian).values([
    //   {
    //     id: 'penilaian_001',
    //     id_rps: 'rps_001',
    //     jenis_penilaian: 'Quiz',
    //     bobot_persentase: 15,
    //     keterangan: 'Quiz dilaksanakan setiap minggu',
    //   },
    //   {
    //     id: 'penilaian_002',
    //     id_rps: 'rps_001',
    //     jenis_penilaian: 'Tugas',
    //     bobot_persentase: 25,
    //     keterangan: 'Tugas individu dan kelompok',
    //   },
    //   {
    //     id: 'penilaian_003',
    //     id_rps: 'rps_001',
    //     jenis_penilaian: 'UTS',
    //     bobot_persentase: 30,
    //     keterangan: 'Ujian Tengah Semester',
    //   },
    //   {
    //     id: 'penilaian_004',
    //     id_rps: 'rps_001',
    //     jenis_penilaian: 'UAS',
    //     bobot_persentase: 30,
    //     keterangan: 'Ujian Akhir Semester',
    //   },
    // ]).returning();
    // console.log(`✅ Created ${penilaians.length} penilaian\n`);

    // ============================================
    // SUMMARY
    // ============================================
    console.log('\n✨ Database seeding completed successfully!\n');
    console.log('📊 Summary:');
    console.log('├─ Users:', users.length);
    console.log('├─ Program Studi:', prodis.length);
    console.log('├─ Kurikulum:', kurikulums.length);
    console.log('├─ Profil Lulusan:', profilLulusans.length, '(12 profil)');
    console.log('├─ Kompetensi Utama:', kuls.length);
    console.log('├─ CPL:', cpls.length);
    console.log('├─ CPL-PL Mappings:', cplPlMappings.length, '(39 mappings)');
    console.log('├─ Bahan Kajian:', bahanKajians.length, '(18 bahan kajian)');
    console.log('├─ CPL-BK Mappings:', cplBkMappings.length, '(44 mappings)');
    console.log('├─ Mata Kuliah:', mataKuliahs.length);
    console.log('├─ CPL-MK Mappings:', cplMkMappings.length);
    console.log('├─ Dosen:', dosens.length);
    console.log('├─ Dosen Pengampu:', dosenPengampus.length);
    console.log('├─ RPS:', rpsData.length);
    console.log('├─ CPMK:', cpmks.length, '(18 CPMK untuk semua MK)');
    console.log('├─ Sub-CPMK:', subCpmks.length);
    console.log('└─ RPS Minggu:', rpsMinggu.length);
    console.log('\n🎉 All data seeded successfully!');
    console.log('\n📝 Default credentials:');
    console.log('   Admin:   admin@sicap.ac.id / password123');
    console.log('   Kaprodi: kaprodi.if@sicap.ac.id / password123');
    console.log('   Dosen:   dosen1@sicap.ac.id / password123');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    sqlite.close();
  }
}

// Run seeder
seed().catch(console.error);

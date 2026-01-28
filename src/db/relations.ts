// src/db/relations.ts
import { relations } from 'drizzle-orm';
import {
  users,
  prodi,
  kurikulum,
  profilLulusan,
  kompetensiUtama,
  cpl,
  matrixCplPl,
  bahanKajian,
  matrixCplBk,
  dosen,
  mataKuliah,
  matrixCplMk,
  penugasanDosen,
  cpmk,
  subCpmk,
  rps,
  rpsMinggu,
} from './schema';

// ==================== PRODI RELATIONS ====================
export const prodiRelations = relations(prodi, ({ many }) => ({
  users: many(users),
  kurikulum: many(kurikulum),
  dosen: many(dosen),
}));

// ==================== USERS RELATIONS ====================
export const usersRelations = relations(users, ({ one }) => ({
  prodi: one(prodi, {
    fields: [users.id_prodi],
    references: [prodi.id],
  }),
}));

// ==================== KURIKULUM RELATIONS ====================
export const kurikulumRelations = relations(kurikulum, ({ one, many }) => ({
  prodi: one(prodi, {
    fields: [kurikulum.id_prodi],
    references: [prodi.id],
  }),
  profilLulusan: many(profilLulusan),
  kompetensiUtama: many(kompetensiUtama),
  cpl: many(cpl),
  bahanKajian: many(bahanKajian),
  mataKuliah: many(mataKuliah),
}));

// ==================== PROFIL LULUSAN RELATIONS ====================
export const profilLulusanRelations = relations(profilLulusan, ({ one, many }) => ({
  kurikulum: one(kurikulum, {
    fields: [profilLulusan.id_kurikulum],
    references: [kurikulum.id],
  }),
  matrixCplPl: many(matrixCplPl),
}));

// ==================== KOMPETENSI UTAMA RELATIONS ====================
export const kompetensiUtamaRelations = relations(kompetensiUtama, ({ one }) => ({
  kurikulum: one(kurikulum, {
    fields: [kompetensiUtama.id_kurikulum],
    references: [kurikulum.id],
  }),
}));

// ==================== CPL RELATIONS ====================
export const cplRelations = relations(cpl, ({ one, many }) => ({
  kurikulum: one(kurikulum, {
    fields: [cpl.id_kurikulum],
    references: [kurikulum.id],
  }),
  matrixCplPl: many(matrixCplPl),
  matrixCplBk: many(matrixCplBk),
  matrixCplMk: many(matrixCplMk),
  cpmk: many(cpmk),
}));

// ==================== MATRIX CPL-PL RELATIONS ====================
export const matrixCplPlRelations = relations(matrixCplPl, ({ one }) => ({
  cpl: one(cpl, {
    fields: [matrixCplPl.id_cpl],
    references: [cpl.id],
  }),
  profilLulusan: one(profilLulusan, {
    fields: [matrixCplPl.id_profil],
    references: [profilLulusan.id],
  }),
}));

// ==================== BAHAN KAJIAN RELATIONS ====================
export const bahanKajianRelations = relations(bahanKajian, ({ one, many }) => ({
  kurikulum: one(kurikulum, {
    fields: [bahanKajian.id_kurikulum],
    references: [kurikulum.id],
  }),
  matrixCplBk: many(matrixCplBk),
  mataKuliah: many(mataKuliah),
}));

// ==================== MATRIX CPL-BK RELATIONS ====================
export const matrixCplBkRelations = relations(matrixCplBk, ({ one }) => ({
  cpl: one(cpl, {
    fields: [matrixCplBk.id_cpl],
    references: [cpl.id],
  }),
  bahanKajian: one(bahanKajian, {
    fields: [matrixCplBk.id_bk],
    references: [bahanKajian.id],
  }),
}));

// ==================== DOSEN RELATIONS ====================
export const dosenRelations = relations(dosen, ({ one, many }) => ({
  prodi: one(prodi, {
    fields: [dosen.id_prodi],
    references: [prodi.id],
  }),
  user: one(users, {
    fields: [dosen.id_user],
    references: [users.id],
  }),
  penugasan: many(penugasanDosen),
  rpsKoordinator: many(rps, { relationName: 'koordinator' }),
  rpsKaprodi: many(rps, { relationName: 'kaprodi' }),
}));

// ==================== MATA KULIAH RELATIONS ====================
export const mataKuliahRelations = relations(mataKuliah, ({ one, many }) => ({
  kurikulum: one(kurikulum, {
    fields: [mataKuliah.id_kurikulum],
    references: [kurikulum.id],
  }),
  bahanKajian: one(bahanKajian, {
    fields: [mataKuliah.id_bahan_kajian],
    references: [bahanKajian.id],
  }),
  matrixCplMk: many(matrixCplMk),
  penugasanDosen: many(penugasanDosen),
  cpmk: many(cpmk),
  rps: many(rps),
}));

// ==================== MATRIX CPL-MK RELATIONS ====================
export const matrixCplMkRelations = relations(matrixCplMk, ({ one }) => ({
  cpl: one(cpl, {
    fields: [matrixCplMk.id_cpl],
    references: [cpl.id],
  }),
  mataKuliah: one(mataKuliah, {
    fields: [matrixCplMk.id_mk],
    references: [mataKuliah.id],
  }),
}));

// ==================== PENUGASAN DOSEN RELATIONS ====================
export const penugasanDosenRelations = relations(penugasanDosen, ({ one }) => ({
  mataKuliah: one(mataKuliah, {
    fields: [penugasanDosen.id_mk],
    references: [mataKuliah.id],
  }),
  dosen: one(dosen, {
    fields: [penugasanDosen.id_dosen],
    references: [dosen.id],
  }),
}));

// ==================== CPMK RELATIONS ====================
export const cpmkRelations = relations(cpmk, ({ one, many }) => ({
  mataKuliah: one(mataKuliah, {
    fields: [cpmk.id_mk],
    references: [mataKuliah.id],
  }),
  cpl: one(cpl, {
    fields: [cpmk.id_cpl],
    references: [cpl.id],
  }),
  subCpmk: many(subCpmk),
}));

// ==================== SUB-CPMK RELATIONS ====================
export const subCpmkRelations = relations(subCpmk, ({ one, many }) => ({
  cpmk: one(cpmk, {
    fields: [subCpmk.id_cpmk],
    references: [cpmk.id],
  }),
  rpsMinggu: many(rpsMinggu),
}));

// ==================== RPS RELATIONS ====================
export const rpsRelations = relations(rps, ({ one, many }) => ({
  mataKuliah: one(mataKuliah, {
    fields: [rps.id_mk],
    references: [mataKuliah.id],
  }),
  koordinator: one(dosen, {
    fields: [rps.id_koordinator],
    references: [dosen.id],
    relationName: 'koordinator',
  }),
  kaprodi: one(dosen, {
    fields: [rps.id_kaprodi],
    references: [dosen.id],
    relationName: 'kaprodi',
  }),
  rpsMinggu: many(rpsMinggu),
}));

// ==================== RPS MINGGU RELATIONS ====================
export const rpsMingguRelations = relations(rpsMinggu, ({ one }) => ({
  rps: one(rps, {
    fields: [rpsMinggu.id_rps],
    references: [rps.id],
  }),
  subCpmk: one(subCpmk, {
    fields: [rpsMinggu.id_sub_cpmk],
    references: [subCpmk.id],
  }),
}));

CREATE TABLE `bahan_kajian` (
	`id` text PRIMARY KEY NOT NULL,
	`kode_bk` text NOT NULL,
	`nama_bahan_kajian` text NOT NULL,
	`aspek` text NOT NULL,
	`ranah_keilmuan` text NOT NULL,
	`id_kurikulum` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`id_kurikulum`) REFERENCES `kurikulum`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `cpl` (
	`id` text PRIMARY KEY NOT NULL,
	`kode_cpl` text NOT NULL,
	`deskripsi_cpl` text NOT NULL,
	`aspek` text NOT NULL,
	`id_kurikulum` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`id_kurikulum`) REFERENCES `kurikulum`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `cpmk` (
	`id` text PRIMARY KEY NOT NULL,
	`kode_cpmk` text NOT NULL,
	`deskripsi_cpmk` text NOT NULL,
	`bobot_persentase` real NOT NULL,
	`id_mk` text NOT NULL,
	`id_cpl` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`id_mk`) REFERENCES `mata_kuliah`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`id_cpl`) REFERENCES `cpl`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `dosen` (
	`id` text PRIMARY KEY NOT NULL,
	`nip` text NOT NULL,
	`nama_dosen` text NOT NULL,
	`email` text,
	`bidang_keahlian` text,
	`jabatan_fungsional` text,
	`id_prodi` text,
	`id_user` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`id_prodi`) REFERENCES `prodi`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`id_user`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `dosen_nip_unique` ON `dosen` (`nip`);--> statement-breakpoint
CREATE TABLE `kompetensi_utama` (
	`id` text PRIMARY KEY NOT NULL,
	`kode_kul` text NOT NULL,
	`kompetensi_lulusan` text NOT NULL,
	`aspek` text NOT NULL,
	`id_kurikulum` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`id_kurikulum`) REFERENCES `kurikulum`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `kurikulum` (
	`id` text PRIMARY KEY NOT NULL,
	`nama_kurikulum` text NOT NULL,
	`tahun_berlaku` integer NOT NULL,
	`is_active` integer DEFAULT false NOT NULL,
	`id_prodi` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`id_prodi`) REFERENCES `prodi`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `mata_kuliah` (
	`id` text PRIMARY KEY NOT NULL,
	`kode_mk` text NOT NULL,
	`nama_mk` text NOT NULL,
	`sks` integer NOT NULL,
	`semester` integer NOT NULL,
	`sifat` text NOT NULL,
	`deskripsi` text,
	`id_kurikulum` text NOT NULL,
	`id_bahan_kajian` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`id_kurikulum`) REFERENCES `kurikulum`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`id_bahan_kajian`) REFERENCES `bahan_kajian`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `mata_kuliah_kode_mk_unique` ON `mata_kuliah` (`kode_mk`);--> statement-breakpoint
CREATE TABLE `matrix_cpl_bk` (
	`id` text PRIMARY KEY NOT NULL,
	`id_cpl` text NOT NULL,
	`id_bk` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`id_cpl`) REFERENCES `cpl`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`id_bk`) REFERENCES `bahan_kajian`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `matrix_cpl_mk` (
	`id` text PRIMARY KEY NOT NULL,
	`id_cpl` text NOT NULL,
	`id_mk` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`id_cpl`) REFERENCES `cpl`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`id_mk`) REFERENCES `mata_kuliah`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `matrix_cpl_pl` (
	`id` text PRIMARY KEY NOT NULL,
	`id_cpl` text NOT NULL,
	`id_profil` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`id_cpl`) REFERENCES `cpl`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`id_profil`) REFERENCES `profil_lulusan`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `penugasan_dosen` (
	`id` text PRIMARY KEY NOT NULL,
	`id_mk` text NOT NULL,
	`id_dosen` text NOT NULL,
	`is_koordinator` integer DEFAULT false NOT NULL,
	`tahun_akademik` text NOT NULL,
	`semester_akademik` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`id_mk`) REFERENCES `mata_kuliah`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`id_dosen`) REFERENCES `dosen`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `prodi` (
	`id` text PRIMARY KEY NOT NULL,
	`kode_prodi` text NOT NULL,
	`nama_prodi` text NOT NULL,
	`fakultas` text NOT NULL,
	`jenjang` text NOT NULL,
	`akreditasi` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `prodi_kode_prodi_unique` ON `prodi` (`kode_prodi`);--> statement-breakpoint
CREATE TABLE `profil_lulusan` (
	`id` text PRIMARY KEY NOT NULL,
	`kode_profil` text NOT NULL,
	`profil_lulusan` text NOT NULL,
	`deskripsi` text NOT NULL,
	`sumber` text NOT NULL,
	`id_kurikulum` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`id_kurikulum`) REFERENCES `kurikulum`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `rps` (
	`id` text PRIMARY KEY NOT NULL,
	`id_mk` text NOT NULL,
	`versi` integer DEFAULT 1 NOT NULL,
	`tahun_akademik` text NOT NULL,
	`semester_akademik` text NOT NULL,
	`tgl_penyusunan` integer,
	`tgl_validasi` integer,
	`status` text DEFAULT 'Draft' NOT NULL,
	`deskripsi_mk` text,
	`pustaka_utama` text,
	`pustaka_pendukung` text,
	`id_koordinator` text,
	`id_kaprodi` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`id_mk`) REFERENCES `mata_kuliah`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`id_koordinator`) REFERENCES `dosen`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`id_kaprodi`) REFERENCES `dosen`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `rps_minggu` (
	`id` text PRIMARY KEY NOT NULL,
	`id_rps` text NOT NULL,
	`minggu_ke` integer NOT NULL,
	`id_sub_cpmk` text,
	`materi` text NOT NULL,
	`metode_pembelajaran` text,
	`waktu_menit` integer DEFAULT 150 NOT NULL,
	`pengalaman_belajar` text,
	`bentuk_penilaian` text,
	`bobot_penilaian` real,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`id_rps`) REFERENCES `rps`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`id_sub_cpmk`) REFERENCES `sub_cpmk`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `sub_cpmk` (
	`id` text PRIMARY KEY NOT NULL,
	`kode_sub` text NOT NULL,
	`deskripsi_sub_cpmk` text NOT NULL,
	`indikator` text NOT NULL,
	`kriteria_penilaian` text NOT NULL,
	`id_cpmk` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`id_cpmk`) REFERENCES `cpmk`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`nama` text NOT NULL,
	`role` text DEFAULT 'dosen' NOT NULL,
	`id_prodi` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`id_prodi`) REFERENCES `prodi`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);
CREATE TABLE `transactions` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `tanggal` DATE NOT NULL,
  `kategori` VARCHAR(50) NOT NULL,
  `jenis` ENUM('pemasukan','pengeluaran') NOT NULL,
  `nominal` INT(11) NOT NULL,
  `catatan` TEXT,
  PRIMARY KEY (`id`)
);
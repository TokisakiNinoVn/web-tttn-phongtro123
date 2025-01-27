
CREATE TABLE IF NOT EXISTS `amenities` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_post` int DEFAULT NULL,
  `fully_furnished` int DEFAULT '0' COMMENT 'Đầy đủ nội thất',
  `garret` int DEFAULT '0' COMMENT 'Có gác',
  `washing_machine` int DEFAULT '0' COMMENT 'Có máy giặt',
  `free_time` int DEFAULT '0' COMMENT 'Giờ giấc tự do',
  `fridge` int DEFAULT '0' COMMENT 'Có tủ lạnh',
  `protect` int DEFAULT '0' COMMENT 'Có bảo vệ 24/24',
  `kitchen_shelf` int DEFAULT '0' COMMENT 'Có kệ bếp',
  `elevator` int DEFAULT '0' COMMENT 'Có thang máy',
  `common_owner` int DEFAULT '0' COMMENT 'Không chung chủ',
  `air_conditioner` int DEFAULT '0' COMMENT 'Có máy lạnh',
  `parking` int DEFAULT '0' COMMENT 'Có hầm/chỗ để xe',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `files` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_post` int NOT NULL DEFAULT '0',
  `url` varchar(50) NOT NULL DEFAULT '0',
  `type` int NOT NULL DEFAULT '0' COMMENT 'Ảnh/Video',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `posts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_user_post` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `price` int NOT NULL,
  `likes` int DEFAULT '0',
  `type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `realaddress` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `owner` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `phone_owner` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `acreage` int NOT NULL COMMENT 'diện tích',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `active` int DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `saves_post` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_user` int NOT NULL DEFAULT '0',
  `id_post` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `types_post` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table phongtro_nhhoang.types_post: ~0 rows (approximately)
INSERT INTO `types_post` (`id`, `name`) VALUES
	(1, 'Phòng trọ'),
	(2, 'Căn hộ'),
	(3, 'Nhà nguyên căn'),
	(4, 'Phòng chia sẻ'),
	(5, 'Phòng dịch vụ'),
	(6, 'Chỗ ở sinh viên');

-- Dumping structure for table phongtro_nhhoang.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `phone` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `zalo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `fbUrl` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `avatar` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `verify` int DEFAULT '1',
  `bio` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `active` int DEFAULT '1',
  `status` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '1',
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table phongtro_nhhoang.users: ~14 rows (approximately)
INSERT INTO `users` (`id`, `phone`, `password`, `name`, `zalo`, `fbUrl`, `avatar`, `verify`, `bio`, `active`, `status`, `createdAt`, `updatedAt`) VALUES
	(1, '0912625257', '$2a$12$uMSVjVtNJ2iWEga2Va6dI.sHS6alFcn9bYNcT4uo5tFhZ1iN7WLV2', 'Anh Cảnh', '0912625257', NULL, NULL, 1, '', 1, '1', '2024-11-27 09:41:22', '2024-11-27 09:41:22'),
-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 15, 2026 at 08:51 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `mikonet`
--

-- --------------------------------------------------------

--
-- Table structure for table `audit_logs`
--

CREATE TABLE `audit_logs` (
  `id` int(11) NOT NULL,
  `level` enum('INFO','SUCCESS','WARNING','ERROR') NOT NULL DEFAULT 'INFO',
  `message` text NOT NULL,
  `actor` varchar(50) DEFAULT 'System',
  `meta` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`meta`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `audit_logs`
--

INSERT INTO `audit_logs` (`id`, `level`, `message`, `actor`, `meta`, `created_at`) VALUES
(1, 'SUCCESS', 'Provisioning succeeded for John Doe', 'System', NULL, '2026-06-10 20:24:35'),
(2, 'SUCCESS', 'Provisioning succeeded for Jane Smith', 'System', NULL, '2026-06-10 20:24:35'),
(3, 'ERROR', 'Provisioning failed for Charlie Davis: ONU authentication failed', 'System', NULL, '2026-06-10 20:24:35'),
(4, 'INFO', 'User \"admin\" logged in successfully.', 'admin', NULL, '2026-06-10 20:24:35'),
(5, 'WARNING', 'High bandwidth usage detected on olt-1/1/1', 'System', NULL, '2026-06-10 20:24:35'),
(6, 'SUCCESS', 'User \"admin\" logged in successfully.', 'admin', NULL, '2026-06-10 20:25:06'),
(7, 'SUCCESS', 'Connection test passed for \"mikrotik\".', 'admin', '{\"method\":\"POST\",\"url\":\"/api/credentials/mikrotik/test\",\"body\":{},\"params\":{\"type\":\"mikrotik\"}}', '2026-06-10 20:27:18'),
(8, 'SUCCESS', 'Connection test passed for \"olt\".', 'admin', '{\"method\":\"POST\",\"url\":\"/api/credentials/olt/test\",\"body\":{},\"params\":{\"type\":\"olt\"}}', '2026-06-10 20:27:22'),
(9, 'SUCCESS', 'Connection test passed for \"telegram\".', 'admin', '{\"method\":\"POST\",\"url\":\"/api/credentials/telegram/test\",\"body\":{},\"params\":{\"type\":\"telegram\"}}', '2026-06-10 20:27:25'),
(10, 'SUCCESS', 'User \"admin\" logged in successfully.', 'admin', NULL, '2026-06-10 21:08:27'),
(11, 'SUCCESS', 'User \"admin\" logged in successfully.', 'admin', NULL, '2026-06-11 04:48:08'),
(12, 'INFO', 'Provisioning retry initiated for \"Charlie Davis\" (ID: 5)', 'admin', NULL, '2026-06-11 04:48:27'),
(13, 'INFO', 'Provisioning retry initiated (ID: 5)', 'admin', '{\"method\":\"POST\",\"url\":\"/api/provisioning/5/retry\",\"body\":{},\"params\":{\"id\":\"5\"}}', '2026-06-11 04:48:27'),
(14, 'SUCCESS', 'Provisioning succeeded for \"Charlie Davis\" (ID: 5)', 'System', NULL, '2026-06-11 04:48:30'),
(15, 'INFO', 'Provisioning created for customer \"test\" (ID: 7)', 'admin', NULL, '2026-06-11 04:49:29'),
(16, 'SUCCESS', 'Provisioning created for \"test\"', 'admin', '{\"method\":\"POST\",\"url\":\"/api/provisioning\",\"body\":{\"customerName\":\"test\",\"customerUsername\":\"test\",\"oltPort\":\"olt-0/1/1\",\"serialNumber\":\"ZTEGCP7T69C\",\"profile\":\"50Mbps\"},\"params\":{}}', '2026-06-11 04:49:29'),
(17, 'SUCCESS', 'User \"admin\" logged in successfully.', 'admin', NULL, '2026-06-11 05:15:49'),
(18, 'SUCCESS', 'User \"admin\" logged in successfully.', 'admin', NULL, '2026-06-11 05:23:49'),
(19, 'SUCCESS', 'User \"admin\" logged in successfully.', 'admin', NULL, '2026-06-11 05:33:29'),
(20, 'INFO', 'Provisioning created for customer \"Test\" (ID: 8)', 'admin', NULL, '2026-06-11 05:41:16'),
(21, 'SUCCESS', 'Provisioning created for \"Test\"', 'admin', '{\"method\":\"POST\",\"url\":\"/api/provisioning\",\"body\":{\"customerName\":\"Test\",\"customerUsername\":\"test_pppoe\",\"oltPort\":\"olt-1/1/4:1\"},\"params\":{}}', '2026-06-11 05:41:16'),
(22, 'WARNING', 'Provisioning deleted: \"Test\" (ID: 8)', 'admin', NULL, '2026-06-11 05:42:44'),
(23, 'WARNING', 'Provisioning deleted (ID: 8)', 'admin', '{\"method\":\"DELETE\",\"url\":\"/api/provisioning/8\",\"params\":{\"id\":\"8\"}}', '2026-06-11 05:42:44'),
(24, 'INFO', 'Provisioning created for customer \"Test\" (ID: 9)', 'admin', NULL, '2026-06-11 05:42:51'),
(25, 'SUCCESS', 'Provisioning created for \"Test\"', 'admin', '{\"method\":\"POST\",\"url\":\"/api/provisioning\",\"body\":{\"customerName\":\"Test\",\"customerUsername\":\"test_pppoe\",\"oltPort\":\"olt-1/1/4:1\"},\"params\":{}}', '2026-06-11 05:42:51'),
(26, 'INFO', 'Provisioning created for customer \"Test\" (ID: 10)', 'admin', NULL, '2026-06-11 05:42:58'),
(27, 'SUCCESS', 'Provisioning created for \"Test\"', 'admin', '{\"method\":\"POST\",\"url\":\"/api/provisioning\",\"body\":{\"customerName\":\"Test\",\"customerUsername\":\"test_pppoe\",\"oltPort\":\"olt-1/1/4:1\"},\"params\":{}}', '2026-06-11 05:42:58'),
(28, 'INFO', 'Provisioning created for customer \"Test\" (ID: 11)', 'admin', NULL, '2026-06-11 05:43:01'),
(29, 'SUCCESS', 'Provisioning created for \"Test\"', 'admin', '{\"method\":\"POST\",\"url\":\"/api/provisioning\",\"body\":{\"customerName\":\"Test\",\"customerUsername\":\"test_pppoe\",\"oltPort\":\"olt-1/1/4:1\"},\"params\":{}}', '2026-06-11 05:43:01'),
(30, 'INFO', 'Provisioning created for customer \"Test\" (ID: 12)', 'admin', NULL, '2026-06-11 05:43:01'),
(31, 'SUCCESS', 'Provisioning created for \"Test\"', 'admin', '{\"method\":\"POST\",\"url\":\"/api/provisioning\",\"body\":{\"customerName\":\"Test\",\"customerUsername\":\"test_pppoe\",\"oltPort\":\"olt-1/1/4:1\"},\"params\":{}}', '2026-06-11 05:43:01'),
(32, 'INFO', 'Provisioning created for customer \"Test\" (ID: 13)', 'admin', NULL, '2026-06-11 05:43:02'),
(33, 'SUCCESS', 'Provisioning created for \"Test\"', 'admin', '{\"method\":\"POST\",\"url\":\"/api/provisioning\",\"body\":{\"customerName\":\"Test\",\"customerUsername\":\"test_pppoe\",\"oltPort\":\"olt-1/1/4:1\"},\"params\":{}}', '2026-06-11 05:43:02'),
(34, 'INFO', 'Provisioning created for customer \"andika\" (ID: 14)', 'admin', NULL, '2026-06-11 07:07:22'),
(35, 'SUCCESS', 'Provisioning created for \"andika\"', 'admin', '{\"method\":\"POST\",\"url\":\"/api/provisioning\",\"body\":{\"customerName\":\"andika\",\"customerUsername\":\"test_pppoe\",\"oltPort\":\"olt-1/1/4:1\"},\"params\":{}}', '2026-06-11 07:07:22'),
(36, 'INFO', 'Device credentials updated.', 'admin', NULL, '2026-06-11 07:09:02'),
(37, 'INFO', 'Device credentials updated.', 'admin', '{\"method\":\"PUT\",\"url\":\"/api/credentials\",\"body\":{\"mikrotik\":{\"host\":\"192.168.1.1\"}},\"params\":{}}', '2026-06-11 07:09:02'),
(38, 'WARNING', 'Provisioning deleted: \"andika\" (ID: 14)', 'admin', NULL, '2026-06-11 07:09:37'),
(39, 'WARNING', 'Provisioning deleted (ID: 14)', 'admin', '{\"method\":\"DELETE\",\"url\":\"/api/provisioning/14\",\"params\":{\"id\":\"14\"}}', '2026-06-11 07:09:37'),
(40, 'SUCCESS', 'User \"admin\" logged in successfully.', 'admin', NULL, '2026-06-11 07:10:07'),
(41, 'SUCCESS', 'User \"admin\" logged in successfully.', 'admin', NULL, '2026-06-17 00:57:24'),
(42, 'SUCCESS', 'User \"technician\" logged in successfully.', 'technician', NULL, '2026-06-17 02:38:40'),
(43, 'SUCCESS', 'User \"admin\" logged in successfully.', 'admin', NULL, '2026-06-22 13:27:03'),
(44, 'SUCCESS', 'User \"admin\" logged in successfully.', 'admin', NULL, '2026-06-22 20:47:51'),
(45, 'SUCCESS', 'User \"admin\" logged in successfully.', 'admin', NULL, '2026-06-22 21:31:03'),
(46, 'SUCCESS', 'User \"admin\" logged in successfully.', 'admin', NULL, '2026-06-22 21:33:44'),
(47, 'SUCCESS', 'User \"admin\" logged in successfully.', 'admin', NULL, '2026-06-22 21:35:38'),
(48, 'SUCCESS', 'User \"admin\" logged in successfully.', 'admin', NULL, '2026-06-22 21:35:55'),
(49, 'SUCCESS', 'User \"admin\" logged in successfully.', 'admin', NULL, '2026-06-23 20:59:07'),
(50, 'INFO', 'Provisioning created for customer \"Andika\" (ID: 15)', 'admin', NULL, '2026-06-24 02:25:17'),
(51, 'SUCCESS', 'Provisioning created for \"Andika\"', 'admin', '{\"method\":\"POST\",\"url\":\"/api/provisioning\",\"body\":{\"customerName\":\"Andika\",\"customerUsername\":\"03011004090804\",\"oltPort\":\"olt_2/2/2:1\",\"serialNumber\":\"ZTGCPL09AD23\",\"profile\":\"10Mbps\"},\"params\":{}}', '2026-06-24 02:25:17'),
(52, 'SUCCESS', 'User \"admin\" logged in successfully.', 'admin', NULL, '2026-06-24 02:41:53'),
(53, 'SUCCESS', 'Connection test passed for \"mikrotik\".', 'admin', '{\"method\":\"POST\",\"url\":\"/api/credentials/mikrotik/test\",\"body\":{},\"params\":{\"type\":\"mikrotik\"}}', '2026-06-24 02:43:20'),
(54, 'SUCCESS', 'Connection test passed for \"telegram\".', 'admin', '{\"method\":\"POST\",\"url\":\"/api/credentials/telegram/test\",\"body\":{},\"params\":{\"type\":\"telegram\"}}', '2026-06-24 02:43:48'),
(55, 'SUCCESS', 'User \"technician\" logged in successfully.', 'technician', NULL, '2026-06-24 02:55:52'),
(56, 'SUCCESS', 'User \"admin\" logged in successfully.', 'admin', NULL, '2026-06-24 03:05:24'),
(57, 'SUCCESS', 'User \"technician\" logged in successfully.', 'technician', NULL, '2026-06-24 03:11:40'),
(58, 'SUCCESS', 'User \"admin\" logged in successfully.', 'admin', NULL, '2026-07-08 21:35:41'),
(59, 'SUCCESS', 'User \"admin\" logged in successfully.', 'admin', NULL, '2026-07-13 12:29:53'),
(60, 'SUCCESS', 'User \"admin\" logged in successfully.', 'admin', NULL, '2026-07-13 12:35:10'),
(61, 'INFO', 'Password reset email sent to \"admin@mikonet.com\" (admin).', 'admin', NULL, '2026-07-13 13:44:05'),
(62, 'INFO', 'Password reset email sent to \"andikafiransyah1905@gmail.com\" (admin).', 'admin', NULL, '2026-07-13 13:47:27'),
(63, 'INFO', 'Password reset email sent to \"andikafiransyah1905@gmail.com\" (admin).', 'admin', NULL, '2026-07-13 13:53:04'),
(64, 'INFO', 'Password reset email sent to \"andikafiransyah1905@gmail.com\" (admin).', 'admin', NULL, '2026-07-13 13:53:37'),
(65, 'INFO', 'Password reset email sent to \"andikafiransyah1905@gmail.com\" (admin).', 'admin', NULL, '2026-07-14 00:20:18'),
(66, 'INFO', 'Password reset email sent to \"andikafiransyah1905@gmail.com\" (admin).', 'admin', NULL, '2026-07-14 00:36:22'),
(67, 'SUCCESS', 'Password has been reset successfully for user \"admin\".', 'admin', NULL, '2026-07-14 00:37:01'),
(68, 'SUCCESS', 'User \"admin\" logged in successfully.', 'admin', NULL, '2026-07-14 00:37:09'),
(69, 'INFO', 'Password reset email sent to \"andikafiransyah1905@gmail.com\" (admin).', 'admin', NULL, '2026-07-14 00:37:22'),
(70, 'SUCCESS', 'Password has been reset successfully for user \"admin\".', 'admin', NULL, '2026-07-14 00:37:50'),
(71, 'SUCCESS', 'User \"admin\" logged in successfully.', 'admin', NULL, '2026-07-14 00:38:01'),
(72, 'SUCCESS', 'User \"admin\" logged in successfully.', 'admin', NULL, '2026-07-14 01:23:01'),
(73, 'SUCCESS', 'User \"admin\" logged in successfully.', 'admin', NULL, '2026-07-14 01:23:53'),
(74, 'SUCCESS', 'User \"technician\" logged in successfully.', 'technician', NULL, '2026-07-14 01:52:18'),
(75, 'SUCCESS', 'User \"admin\" logged in successfully.', 'admin', NULL, '2026-07-14 01:52:35'),
(76, 'SUCCESS', 'User \"admin\" logged in successfully.', 'admin', NULL, '2026-07-14 01:52:42'),
(77, 'SUCCESS', 'User \"admin\" logged in successfully.', 'admin', NULL, '2026-07-14 01:54:14'),
(78, 'SUCCESS', 'User \"technician\" logged in successfully.', 'technician', NULL, '2026-07-14 01:54:36'),
(79, 'SUCCESS', 'User \"admin\" logged in successfully.', 'admin', NULL, '2026-07-14 04:10:19'),
(80, 'INFO', 'Password reset email sent to \"andikafiransyah1905@gmail.com\" (admin).', 'admin', NULL, '2026-07-14 17:02:29'),
(81, 'SUCCESS', 'Password has been reset successfully for user \"admin\".', 'admin', NULL, '2026-07-14 17:04:43'),
(82, 'SUCCESS', 'User \"admin\" logged in successfully.', 'admin', NULL, '2026-07-14 17:05:45'),
(83, 'INFO', 'User \"teknisi2\" created by \"admin\".', 'admin', NULL, '2026-07-14 17:06:13'),
(84, 'INFO', 'User \"teknisi2\" created.', 'admin', '{\"method\":\"POST\",\"url\":\"/api/users\",\"body\":{\"username\":\"teknisi2\",\"password\":\"teknisi2026\",\"role\":\"tech\",\"fullName\":\"Teknisi Dua\",\"email\":\"technician2@gmail.com\"},\"params\":{}}', '2026-07-14 17:06:13'),
(85, 'INFO', 'User \"teknisi2\" updated by \"admin\".', 'admin', NULL, '2026-07-14 17:07:25'),
(86, 'INFO', 'User #3 updated.', 'admin', '{\"method\":\"PUT\",\"url\":\"/api/users/3\",\"body\":{\"username\":\"technician2\",\"role\":\"tech\",\"fullName\":\"Teknisi Dua\",\"email\":\"technician2@gmail.com\"},\"params\":{\"id\":\"3\"}}', '2026-07-14 17:07:25'),
(87, 'INFO', 'User \"technician2\" deleted by \"admin\".', 'admin', NULL, '2026-07-14 17:08:14'),
(88, 'INFO', 'User #3 deleted.', 'admin', '{\"method\":\"DELETE\",\"url\":\"/api/users/3\",\"params\":{\"id\":\"3\"}}', '2026-07-14 17:08:14'),
(89, 'SUCCESS', 'User \"admin\" logged in successfully.', 'admin', NULL, '2026-07-14 17:45:58'),
(90, 'SUCCESS', 'Connection test passed for \"mikrotik\".', 'admin', '{\"method\":\"POST\",\"url\":\"/api/credentials/mikrotik/test\",\"body\":{},\"params\":{\"type\":\"mikrotik\"}}', '2026-07-14 19:10:47'),
(91, 'SUCCESS', 'Connection test passed for \"mikrotik\".', 'admin', '{\"method\":\"POST\",\"url\":\"/api/credentials/mikrotik/test\",\"body\":{},\"params\":{\"type\":\"mikrotik\"}}', '2026-07-14 19:10:51'),
(92, 'SUCCESS', 'Connection test passed for \"mikrotik\".', 'admin', '{\"method\":\"POST\",\"url\":\"/api/credentials/mikrotik/test\",\"body\":{},\"params\":{\"type\":\"mikrotik\"}}', '2026-07-14 19:10:52'),
(93, 'SUCCESS', 'Connection test passed for \"mikrotik\".', 'admin', '{\"method\":\"POST\",\"url\":\"/api/credentials/mikrotik/test\",\"body\":{},\"params\":{\"type\":\"mikrotik\"}}', '2026-07-14 19:10:52'),
(94, 'SUCCESS', 'Connection test passed for \"mikrotik\".', 'admin', '{\"method\":\"POST\",\"url\":\"/api/credentials/mikrotik/test\",\"body\":{},\"params\":{\"type\":\"mikrotik\"}}', '2026-07-14 19:10:53'),
(95, 'SUCCESS', 'Connection test passed for \"mikrotik\".', 'admin', '{\"method\":\"POST\",\"url\":\"/api/credentials/mikrotik/test\",\"body\":{},\"params\":{\"type\":\"mikrotik\"}}', '2026-07-14 19:10:54'),
(96, 'SUCCESS', 'Connection test passed for \"mikrotik\".', 'admin', '{\"method\":\"POST\",\"url\":\"/api/credentials/mikrotik/test\",\"body\":{},\"params\":{\"type\":\"mikrotik\"}}', '2026-07-14 20:06:48'),
(97, 'SUCCESS', 'Connection test passed for \"olt\".', 'admin', '{\"method\":\"POST\",\"url\":\"/api/credentials/olt/test\",\"body\":{},\"params\":{\"type\":\"olt\"}}', '2026-07-14 20:06:51'),
(98, 'SUCCESS', 'Connection test passed for \"telegram\".', 'admin', '{\"method\":\"POST\",\"url\":\"/api/credentials/telegram/test\",\"body\":{},\"params\":{\"type\":\"telegram\"}}', '2026-07-14 20:06:52'),
(99, 'SUCCESS', 'Connection test passed for \"mikrotik\".', 'admin', '{\"method\":\"POST\",\"url\":\"/api/credentials/mikrotik/test\",\"body\":{},\"params\":{\"type\":\"mikrotik\"}}', '2026-07-14 20:09:31'),
(100, 'INFO', '\"telegram\" credentials updated.', 'admin', NULL, '2026-07-14 20:31:43'),
(101, 'INFO', '\"telegram\" credentials updated.', 'admin', '{\"method\":\"PUT\",\"url\":\"/api/credentials/telegram\",\"body\":{\"botToken\":\"8844999873:AAGkEeGGDZSEpCtMsXf6Use8kVlXvT6tyIA\",\"chatId\":\"8698069656\"},\"params\":{\"type\":\"telegram\"}}', '2026-07-14 20:31:43'),
(102, 'INFO', '\"telegram\" credentials updated.', 'admin', NULL, '2026-07-14 20:34:09'),
(103, 'INFO', '\"telegram\" credentials updated.', 'admin', '{\"method\":\"PUT\",\"url\":\"/api/credentials/telegram\",\"body\":{\"botToken\":\"8844999873:AAGkEeGGDZSEpCtMsXf6Use8kVlXvT6tyIA\",\"chatId\":\"8698069656\"},\"params\":{\"type\":\"telegram\"}}', '2026-07-14 20:34:09'),
(104, 'SUCCESS', 'Connection test passed for \"telegram\".', 'admin', '{\"method\":\"POST\",\"url\":\"/api/credentials/telegram/test\",\"body\":{},\"params\":{\"type\":\"telegram\"}}', '2026-07-14 20:38:23'),
(105, 'SUCCESS', 'Connection test passed for \"telegram\".', 'admin', '{\"method\":\"POST\",\"url\":\"/api/credentials/telegram/test\",\"body\":{},\"params\":{\"type\":\"telegram\"}}', '2026-07-14 20:39:04'),
(106, 'SUCCESS', 'Connection test passed for \"telegram\".', 'admin', '{\"method\":\"POST\",\"url\":\"/api/credentials/telegram/test\",\"body\":{},\"params\":{\"type\":\"telegram\"}}', '2026-07-14 20:39:19'),
(107, 'SUCCESS', 'Connection test passed for \"telegram\".', 'admin', '{\"method\":\"POST\",\"url\":\"/api/credentials/telegram/test\",\"body\":{},\"params\":{\"type\":\"telegram\"}}', '2026-07-14 20:40:13'),
(108, 'SUCCESS', 'Connection test passed for \"telegram\".', 'admin', '{\"method\":\"POST\",\"url\":\"/api/credentials/telegram/test\",\"body\":{},\"params\":{\"type\":\"telegram\"}}', '2026-07-14 20:40:22'),
(109, 'INFO', '\"mikrotik\" credentials updated.', 'admin', NULL, '2026-07-14 22:03:05'),
(110, 'INFO', '\"mikrotik\" credentials updated.', 'admin', '{\"method\":\"PUT\",\"url\":\"/api/credentials/mikrotik\",\"body\":{\"host\":\"192.168.10.1\",\"username\":\"admin\",\"password\":\"admin\",\"port\":8728},\"params\":{\"type\":\"mikrotik\"}}', '2026-07-14 22:03:05'),
(111, 'SUCCESS', 'Connection test passed for \"mikrotik\".', 'admin', '{\"method\":\"POST\",\"url\":\"/api/credentials/mikrotik/test\",\"body\":{},\"params\":{\"type\":\"mikrotik\"}}', '2026-07-14 22:03:13'),
(112, 'SUCCESS', 'Connection test passed for \"olt\".', 'admin', '{\"method\":\"POST\",\"url\":\"/api/credentials/olt/test\",\"body\":{},\"params\":{\"type\":\"olt\"}}', '2026-07-14 22:03:51'),
(113, 'SUCCESS', 'Connection test passed for \"mikrotik\".', 'admin', '{\"method\":\"POST\",\"url\":\"/api/credentials/mikrotik/test\",\"body\":{},\"params\":{\"type\":\"mikrotik\"}}', '2026-07-14 22:03:55'),
(114, 'SUCCESS', 'Connection test passed for \"mikrotik\".', 'admin', '{\"method\":\"POST\",\"url\":\"/api/credentials/mikrotik/test\",\"body\":{},\"params\":{\"type\":\"mikrotik\"}}', '2026-07-14 22:04:00'),
(115, 'SUCCESS', 'Connection test passed for \"telegram\".', 'admin', '{\"method\":\"POST\",\"url\":\"/api/credentials/telegram/test\",\"body\":{},\"params\":{\"type\":\"telegram\"}}', '2026-07-14 22:04:03'),
(116, 'SUCCESS', 'Connection test passed for \"mikrotik\".', 'admin', '{\"method\":\"POST\",\"url\":\"/api/credentials/mikrotik/test\",\"body\":{},\"params\":{\"type\":\"mikrotik\"}}', '2026-07-14 22:04:15'),
(117, 'INFO', '\"olt\" credentials updated.', 'admin', NULL, '2026-07-14 22:22:58'),
(118, 'INFO', '\"olt\" credentials updated.', 'admin', '{\"method\":\"PUT\",\"url\":\"/api/credentials/olt\",\"body\":{\"host\":\"172.16.3.100\",\"username\":\"admin\",\"password\":\"\",\"port\":23},\"params\":{\"type\":\"olt\"}}', '2026-07-14 22:22:58'),
(119, 'SUCCESS', 'Connection test passed for \"mikrotik\".', 'admin', '{\"method\":\"POST\",\"url\":\"/api/credentials/mikrotik/test\",\"body\":{},\"params\":{\"type\":\"mikrotik\"}}', '2026-07-14 22:24:23'),
(120, 'SUCCESS', 'Connection test passed for \"mikrotik\".', 'admin', '{\"method\":\"POST\",\"url\":\"/api/credentials/mikrotik/test\",\"body\":{},\"params\":{\"type\":\"mikrotik\"}}', '2026-07-14 22:24:40'),
(121, 'SUCCESS', 'Connection test passed for \"mikrotik\".', 'admin', '{\"method\":\"POST\",\"url\":\"/api/credentials/mikrotik/test\",\"body\":{},\"params\":{\"type\":\"mikrotik\"}}', '2026-07-14 22:24:50'),
(122, 'SUCCESS', 'Connection test passed for \"mikrotik\".', 'admin', '{\"method\":\"POST\",\"url\":\"/api/credentials/mikrotik/test\",\"body\":{},\"params\":{\"type\":\"mikrotik\"}}', '2026-07-14 22:24:51'),
(123, 'SUCCESS', 'Connection test passed for \"mikrotik\".', 'admin', '{\"method\":\"POST\",\"url\":\"/api/credentials/mikrotik/test\",\"body\":{},\"params\":{\"type\":\"mikrotik\"}}', '2026-07-14 22:24:51'),
(124, 'SUCCESS', 'Connection test passed for \"mikrotik\".', 'admin', '{\"method\":\"POST\",\"url\":\"/api/credentials/mikrotik/test\",\"body\":{},\"params\":{\"type\":\"mikrotik\"}}', '2026-07-14 22:24:52'),
(125, 'SUCCESS', 'Connection test passed for \"mikrotik\".', 'admin', '{\"method\":\"POST\",\"url\":\"/api/credentials/mikrotik/test\",\"body\":{},\"params\":{\"type\":\"mikrotik\"}}', '2026-07-14 22:24:57'),
(126, 'SUCCESS', 'Connection test passed for \"mikrotik\".', 'admin', '{\"method\":\"POST\",\"url\":\"/api/credentials/mikrotik/test\",\"body\":{},\"params\":{\"type\":\"mikrotik\"}}', '2026-07-14 22:24:57'),
(127, 'SUCCESS', 'Connection test passed for \"mikrotik\".', 'admin', '{\"method\":\"POST\",\"url\":\"/api/credentials/mikrotik/test\",\"body\":{},\"params\":{\"type\":\"mikrotik\"}}', '2026-07-14 22:24:58'),
(128, 'SUCCESS', 'Connection test passed for \"mikrotik\".', 'admin', '{\"method\":\"POST\",\"url\":\"/api/credentials/mikrotik/test\",\"body\":{},\"params\":{\"type\":\"mikrotik\"}}', '2026-07-14 22:24:58'),
(129, 'SUCCESS', 'Connection test passed for \"mikrotik\".', 'admin', '{\"method\":\"POST\",\"url\":\"/api/credentials/mikrotik/test\",\"body\":{},\"params\":{\"type\":\"mikrotik\"}}', '2026-07-14 22:24:59'),
(130, 'SUCCESS', 'Connection test passed for \"mikrotik\".', 'admin', '{\"method\":\"POST\",\"url\":\"/api/credentials/mikrotik/test\",\"body\":{},\"params\":{\"type\":\"mikrotik\"}}', '2026-07-14 22:25:00'),
(131, 'SUCCESS', 'Connection test passed for \"mikrotik\".', 'admin', '{\"method\":\"POST\",\"url\":\"/api/credentials/mikrotik/test\",\"body\":{},\"params\":{\"type\":\"mikrotik\"}}', '2026-07-14 22:25:01'),
(132, 'SUCCESS', 'Connection test passed for \"mikrotik\".', 'admin', '{\"method\":\"POST\",\"url\":\"/api/credentials/mikrotik/test\",\"body\":{},\"params\":{\"type\":\"mikrotik\"}}', '2026-07-14 22:25:02'),
(133, 'SUCCESS', 'Connection test passed for \"mikrotik\".', 'admin', '{\"method\":\"POST\",\"url\":\"/api/credentials/mikrotik/test\",\"body\":{},\"params\":{\"type\":\"mikrotik\"}}', '2026-07-14 22:25:02'),
(134, 'SUCCESS', 'Connection test passed for \"mikrotik\".', 'admin', '{\"method\":\"POST\",\"url\":\"/api/credentials/mikrotik/test\",\"body\":{},\"params\":{\"type\":\"mikrotik\"}}', '2026-07-14 22:25:03'),
(135, 'SUCCESS', 'Connection test passed for \"mikrotik\".', 'admin', '{\"method\":\"POST\",\"url\":\"/api/credentials/mikrotik/test\",\"body\":{},\"params\":{\"type\":\"mikrotik\"}}', '2026-07-14 22:25:03'),
(136, 'SUCCESS', 'Connection test passed for \"mikrotik\".', 'admin', '{\"method\":\"POST\",\"url\":\"/api/credentials/mikrotik/test\",\"body\":{},\"params\":{\"type\":\"mikrotik\"}}', '2026-07-14 22:25:04'),
(137, 'SUCCESS', 'Connection test passed for \"mikrotik\".', 'admin', '{\"method\":\"POST\",\"url\":\"/api/credentials/mikrotik/test\",\"body\":{},\"params\":{\"type\":\"mikrotik\"}}', '2026-07-14 22:25:04'),
(138, 'SUCCESS', 'Connection test passed for \"mikrotik\".', 'admin', '{\"method\":\"POST\",\"url\":\"/api/credentials/mikrotik/test\",\"body\":{},\"params\":{\"type\":\"mikrotik\"}}', '2026-07-14 22:26:18'),
(139, 'SUCCESS', 'Connection test passed for \"telegram\".', 'admin', '{\"method\":\"POST\",\"url\":\"/api/credentials/telegram/test\",\"body\":{},\"params\":{\"type\":\"telegram\"}}', '2026-07-14 22:27:00'),
(140, 'SUCCESS', 'Connection test passed for \"mikrotik\".', 'admin', '{\"method\":\"POST\",\"url\":\"/api/credentials/mikrotik/test\",\"body\":{},\"params\":{\"type\":\"mikrotik\"}}', '2026-07-14 22:27:10'),
(141, 'SUCCESS', 'Connection test passed for \"mikrotik\".', 'admin', '{\"method\":\"POST\",\"url\":\"/api/credentials/mikrotik/test\",\"body\":{},\"params\":{\"type\":\"mikrotik\"}}', '2026-07-14 22:32:29'),
(142, 'INFO', '\"olt\" credentials updated.', 'admin', NULL, '2026-07-14 22:32:58'),
(143, 'INFO', '\"olt\" credentials updated.', 'admin', '{\"method\":\"PUT\",\"url\":\"/api/credentials/olt\",\"body\":{\"host\":\"172.16.4.100\",\"username\":\"zte\",\"password\":\"zte\",\"port\":23},\"params\":{\"type\":\"olt\"}}', '2026-07-14 22:32:58'),
(144, 'SUCCESS', 'Connection test passed for \"olt\".', 'admin', '{\"method\":\"POST\",\"url\":\"/api/credentials/olt/test\",\"body\":{},\"params\":{\"type\":\"olt\"}}', '2026-07-14 22:34:22'),
(145, 'INFO', '\"olt\" credentials updated.', 'admin', NULL, '2026-07-14 22:34:27'),
(146, 'INFO', '\"olt\" credentials updated.', 'admin', '{\"method\":\"PUT\",\"url\":\"/api/credentials/olt\",\"body\":{\"host\":\"172.16.4.10\",\"username\":\"zte\",\"password\":\"zte\",\"port\":23},\"params\":{\"type\":\"olt\"}}', '2026-07-14 22:34:27'),
(147, 'INFO', '\"olt\" credentials updated.', 'admin', NULL, '2026-07-14 22:35:40'),
(148, 'INFO', '\"olt\" credentials updated.', 'admin', '{\"method\":\"PUT\",\"url\":\"/api/credentials/olt\",\"body\":{\"host\":\"172.16.4.100\",\"username\":\"zte\",\"password\":\"zte\",\"port\":23},\"params\":{\"type\":\"olt\"}}', '2026-07-14 22:35:40'),
(149, 'SUCCESS', 'Connection test passed for \"olt\".', 'admin', '{\"method\":\"POST\",\"url\":\"/api/credentials/olt/test\",\"body\":{},\"params\":{\"type\":\"olt\"}}', '2026-07-14 22:35:45'),
(150, 'SUCCESS', 'Connection test passed for \"olt\".', 'admin', '{\"method\":\"POST\",\"url\":\"/api/credentials/olt/test\",\"body\":{},\"params\":{\"type\":\"olt\"}}', '2026-07-14 22:37:32'),
(151, 'SUCCESS', 'Connection test passed for \"telegram\".', 'admin', '{\"method\":\"POST\",\"url\":\"/api/credentials/telegram/test\",\"body\":{},\"params\":{\"type\":\"telegram\"}}', '2026-07-14 22:37:37'),
(152, 'SUCCESS', 'Connection test passed for \"olt\".', 'admin', '{\"method\":\"POST\",\"url\":\"/api/credentials/olt/test\",\"body\":{},\"params\":{\"type\":\"olt\"}}', '2026-07-14 22:37:53'),
(153, 'INFO', '\"olt\" credentials updated.', 'admin', NULL, '2026-07-14 22:38:20'),
(154, 'INFO', '\"olt\" credentials updated.', 'admin', '{\"method\":\"PUT\",\"url\":\"/api/credentials/olt\",\"body\":{\"host\":\"172.16.4.10\",\"username\":\"zte\",\"password\":\"zte\",\"port\":23},\"params\":{\"type\":\"olt\"}}', '2026-07-14 22:38:20'),
(155, 'INFO', '\"olt\" credentials updated.', 'admin', NULL, '2026-07-14 22:45:46'),
(156, 'INFO', '\"olt\" credentials updated.', 'admin', '{\"method\":\"PUT\",\"url\":\"/api/credentials/olt\",\"body\":{\"host\":\"172.16.4.100\",\"username\":\"zte\",\"password\":\"zte\",\"port\":23},\"params\":{\"type\":\"olt\"}}', '2026-07-14 22:45:46'),
(157, 'SUCCESS', 'Connection test passed for \"olt\".', 'admin', '{\"method\":\"POST\",\"url\":\"/api/credentials/olt/test\",\"body\":{},\"params\":{\"type\":\"olt\"}}', '2026-07-14 22:45:51'),
(158, 'INFO', '\"mikrotik\" credentials updated.', 'admin', NULL, '2026-07-14 22:51:45'),
(159, 'INFO', '\"mikrotik\" credentials updated.', 'admin', '{\"method\":\"PUT\",\"url\":\"/api/credentials/mikrotik\",\"body\":{\"host\":\"192.168.10.1\",\"username\":\"admin\",\"password\":\"\",\"port\":8728},\"params\":{\"type\":\"mikrotik\"}}', '2026-07-14 22:51:45'),
(160, 'INFO', '\"mikrotik\" credentials updated.', 'admin', NULL, '2026-07-14 22:51:54'),
(161, 'INFO', '\"mikrotik\" credentials updated.', 'admin', '{\"method\":\"PUT\",\"url\":\"/api/credentials/mikrotik\",\"body\":{\"host\":\"192.168.10.1\",\"username\":\"admin\",\"password\":\"admin\",\"port\":8728},\"params\":{\"type\":\"mikrotik\"}}', '2026-07-14 22:51:54'),
(162, 'SUCCESS', 'Connection test passed for \"mikrotik\".', 'admin', '{\"method\":\"POST\",\"url\":\"/api/credentials/mikrotik/test\",\"body\":{},\"params\":{\"type\":\"mikrotik\"}}', '2026-07-14 22:51:56'),
(163, 'INFO', 'Provisioning created for customer \"kokoy\" (ID: 16)', 'admin', NULL, '2026-07-14 23:11:27'),
(164, 'SUCCESS', 'Provisioning created for \"kokoy\"', 'admin', '{\"method\":\"POST\",\"url\":\"/api/provisioning\",\"body\":{\"customerName\":\"kokoy\",\"customerUsername\":\"kokonet\",\"oltPort\":\"0/0/1\",\"serialNumber\":\"ZTEGC45675533\",\"profile\":\"10Mbps\"},\"params\":{}}', '2026-07-14 23:11:27'),
(165, 'WARNING', 'Provisioning deleted: \"kokoy\" (ID: 16)', 'admin', NULL, '2026-07-14 23:11:44'),
(166, 'WARNING', 'Provisioning deleted (ID: 16)', 'admin', '{\"method\":\"DELETE\",\"url\":\"/api/provisioning/16\",\"params\":{\"id\":\"16\"}}', '2026-07-14 23:11:44'),
(167, 'SUCCESS', 'Provisioning succeeded for John Doe', 'System', NULL, '2026-07-15 00:17:07'),
(168, 'SUCCESS', 'Provisioning succeeded for Jane Smith', 'System', NULL, '2026-07-15 00:17:07'),
(169, 'ERROR', 'Provisioning failed for Charlie Davis: ONU authentication failed', 'System', NULL, '2026-07-15 00:17:07'),
(170, 'INFO', 'User \"admin\" logged in successfully.', 'admin', NULL, '2026-07-15 00:17:07'),
(171, 'WARNING', 'High bandwidth usage detected on olt-1/1/1', 'System', NULL, '2026-07-15 00:17:07'),
(172, 'INFO', 'Provisioning retry initiated for \"Charlie Davis\" (ID: 21)', 'admin', NULL, '2026-07-15 00:18:37'),
(173, 'INFO', 'Provisioning retry initiated (ID: 21)', 'admin', '{\"method\":\"POST\",\"url\":\"/api/provisioning/21/retry\",\"body\":{},\"params\":{\"id\":\"21\"}}', '2026-07-15 00:18:37'),
(174, 'ERROR', 'Provisioning failed for \"Charlie Davis\" (ID: 21): ', 'admin', NULL, '2026-07-15 00:18:39'),
(175, 'INFO', 'Provisioning created for \"dika\" (ID: 23)', 'admin', NULL, '2026-07-15 00:22:01'),
(176, 'SUCCESS', 'Provisioning created for \"dika\"', 'admin', '{\"method\":\"POST\",\"url\":\"/api/provisioning\",\"body\":{\"customerName\":\"dika\",\"customerUsername\":\"dika\",\"pppoePassword\":\"123456\",\"oltPort\":\"olt_2/2/2:1\",\"serialNumber\":\"ZTEGC435612312\",\"profile\":\"100Mbps\"},\"params\":{}}', '2026-07-15 00:22:01'),
(177, 'ERROR', 'Provisioning failed for \"dika\" (ID: 23): ', 'admin', NULL, '2026-07-15 00:22:03'),
(178, 'INFO', '\"mikrotik\" credentials updated.', 'admin', NULL, '2026-07-15 00:23:07'),
(179, 'INFO', '\"mikrotik\" credentials updated.', 'admin', '{\"method\":\"PUT\",\"url\":\"/api/credentials/mikrotik\",\"body\":{\"host\":\"192.168.1.1\",\"username\":\"admin\",\"password\":\"admin\",\"port\":8728},\"params\":{\"type\":\"mikrotik\"}}', '2026-07-15 00:23:07'),
(180, 'INFO', '\"olt\" credentials updated.', 'admin', NULL, '2026-07-15 00:23:45'),
(181, 'INFO', '\"olt\" credentials updated.', 'admin', '{\"method\":\"PUT\",\"url\":\"/api/credentials/olt\",\"body\":{\"host\":\"172.16.4.100\",\"username\":\"zte\",\"password\":\"zte\",\"port\":23},\"params\":{\"type\":\"olt\"}}', '2026-07-15 00:23:45'),
(182, 'INFO', '\"mikrotik\" credentials updated.', 'admin', NULL, '2026-07-15 00:24:23'),
(183, 'INFO', '\"mikrotik\" credentials updated.', 'admin', '{\"method\":\"PUT\",\"url\":\"/api/credentials/mikrotik\",\"body\":{\"host\":\"192.168.10.1\",\"username\":\"admin\",\"password\":\"admin\",\"port\":8728},\"params\":{\"type\":\"mikrotik\"}}', '2026-07-15 00:24:23'),
(184, 'SUCCESS', 'Connection test passed for \"mikrotik\".', 'admin', '{\"method\":\"POST\",\"url\":\"/api/credentials/mikrotik/test\",\"body\":{},\"params\":{\"type\":\"mikrotik\"}}', '2026-07-15 00:24:25'),
(185, 'SUCCESS', 'Connection test passed for \"olt\".', 'admin', '{\"method\":\"POST\",\"url\":\"/api/credentials/olt/test\",\"body\":{},\"params\":{\"type\":\"olt\"}}', '2026-07-15 00:24:33'),
(186, 'INFO', '\"telegram\" credentials updated.', 'admin', NULL, '2026-07-15 00:24:53'),
(187, 'INFO', '\"telegram\" credentials updated.', 'admin', '{\"method\":\"PUT\",\"url\":\"/api/credentials/telegram\",\"body\":{\"botToken\":\"8844999873:AAGkEeGGDZSEpCtMsXf6Use8kVlXvT6tyIA\",\"chatId\":\"8698069656\"},\"params\":{\"type\":\"telegram\"}}', '2026-07-15 00:24:53'),
(188, 'SUCCESS', 'Connection test passed for \"telegram\".', 'admin', '{\"method\":\"POST\",\"url\":\"/api/credentials/telegram/test\",\"body\":{},\"params\":{\"type\":\"telegram\"}}', '2026-07-15 00:24:56'),
(189, 'INFO', 'Provisioning retry initiated for \"dika\" (ID: 23)', 'admin', NULL, '2026-07-15 00:25:22'),
(190, 'INFO', 'Provisioning retry initiated (ID: 23)', 'admin', '{\"method\":\"POST\",\"url\":\"/api/provisioning/23/retry\",\"body\":{},\"params\":{\"id\":\"23\"}}', '2026-07-15 00:25:22'),
(191, 'ERROR', 'Provisioning failed for \"dika\" (ID: 23): input does not match any value of profile', 'admin', NULL, '2026-07-15 00:25:22'),
(192, 'INFO', 'Provisioning created for \"Andika\" (ID: 24)', 'admin', NULL, '2026-07-15 00:29:12'),
(193, 'SUCCESS', 'Provisioning created for \"Andika\"', 'admin', '{\"method\":\"POST\",\"url\":\"/api/provisioning\",\"body\":{\"customerName\":\"Andika\",\"customerUsername\":\"andika\",\"pppoePassword\":\"andika\",\"oltPort\":\"olt_2/2/2:2\",\"serialNumber\":\"ZTEGCCCCCCCCCCC\",\"profile\":\"100Mbps\"},\"params\":{}}', '2026-07-15 00:29:12'),
(194, 'ERROR', 'Provisioning failed for \"Andika\" (ID: 24): input does not match any value of profile', 'admin', NULL, '2026-07-15 00:29:12'),
(195, 'INFO', 'Provisioning retry initiated for \"Andika\" (ID: 24)', 'admin', NULL, '2026-07-15 00:31:07'),
(196, 'INFO', 'Provisioning retry initiated (ID: 24)', 'admin', '{\"method\":\"POST\",\"url\":\"/api/provisioning/24/retry\",\"body\":{},\"params\":{\"id\":\"24\"}}', '2026-07-15 00:31:07'),
(197, 'ERROR', 'Provisioning failed for \"Andika\" (ID: 24): input does not match any value of profile', 'admin', NULL, '2026-07-15 00:31:07'),
(198, 'INFO', 'Provisioning retry initiated for \"Andika\" (ID: 24)', 'admin', NULL, '2026-07-15 00:32:15'),
(199, 'INFO', 'Provisioning retry initiated (ID: 24)', 'admin', '{\"method\":\"POST\",\"url\":\"/api/provisioning/24/retry\",\"body\":{},\"params\":{\"id\":\"24\"}}', '2026-07-15 00:32:15'),
(200, 'ERROR', 'Provisioning failed for \"Andika\" (ID: 24): input does not match any value of profile', 'admin', NULL, '2026-07-15 00:32:15'),
(201, 'INFO', 'Provisioning retry initiated for \"Andika\" (ID: 24)', 'admin', NULL, '2026-07-15 00:32:27'),
(202, 'INFO', 'Provisioning retry initiated (ID: 24)', 'admin', '{\"method\":\"POST\",\"url\":\"/api/provisioning/24/retry\",\"body\":{},\"params\":{\"id\":\"24\"}}', '2026-07-15 00:32:27'),
(203, 'ERROR', 'Provisioning failed for \"Andika\" (ID: 24): input does not match any value of profile', 'admin', NULL, '2026-07-15 00:32:27'),
(204, 'INFO', 'Provisioning retry initiated for \"Andika\" (ID: 24)', 'admin', NULL, '2026-07-15 00:33:44'),
(205, 'INFO', 'Provisioning retry initiated (ID: 24)', 'admin', '{\"method\":\"POST\",\"url\":\"/api/provisioning/24/retry\",\"body\":{},\"params\":{\"id\":\"24\"}}', '2026-07-15 00:33:44'),
(206, 'ERROR', 'Provisioning failed for \"Andika\" (ID: 24): input does not match any value of profile', 'admin', NULL, '2026-07-15 00:33:44'),
(207, 'INFO', 'Provisioning retry initiated for \"Andika\" (ID: 24)', 'admin', NULL, '2026-07-15 00:34:01'),
(208, 'INFO', 'Provisioning retry initiated (ID: 24)', 'admin', '{\"method\":\"POST\",\"url\":\"/api/provisioning/24/retry\",\"body\":{},\"params\":{\"id\":\"24\"}}', '2026-07-15 00:34:01'),
(209, 'ERROR', 'Provisioning failed for \"Andika\" (ID: 24): input does not match any value of profile', 'admin', NULL, '2026-07-15 00:34:01'),
(210, 'INFO', 'Provisioning retry initiated for \"Andika\" (ID: 24)', 'admin', NULL, '2026-07-15 00:34:55'),
(211, 'INFO', 'Provisioning retry initiated (ID: 24)', 'admin', '{\"method\":\"POST\",\"url\":\"/api/provisioning/24/retry\",\"body\":{},\"params\":{\"id\":\"24\"}}', '2026-07-15 00:34:55'),
(212, 'ERROR', 'Provisioning failed for \"Andika\" (ID: 24): input does not match any value of profile', 'admin', NULL, '2026-07-15 00:34:55'),
(213, 'INFO', 'Provisioning retry initiated for \"Andika\" (ID: 24)', 'admin', NULL, '2026-07-15 00:35:15'),
(214, 'INFO', 'Provisioning retry initiated (ID: 24)', 'admin', '{\"method\":\"POST\",\"url\":\"/api/provisioning/24/retry\",\"body\":{},\"params\":{\"id\":\"24\"}}', '2026-07-15 00:35:15'),
(215, 'ERROR', 'Provisioning failed for \"Andika\" (ID: 24): input does not match any value of profile', 'admin', NULL, '2026-07-15 00:35:16'),
(216, 'INFO', 'Provisioning retry initiated for \"Andika\" (ID: 24)', 'admin', NULL, '2026-07-15 00:37:10'),
(217, 'INFO', 'Provisioning retry initiated (ID: 24)', 'admin', '{\"method\":\"POST\",\"url\":\"/api/provisioning/24/retry\",\"body\":{},\"params\":{\"id\":\"24\"}}', '2026-07-15 00:37:10'),
(218, 'ERROR', 'Provisioning failed for \"Andika\" (ID: 24): input does not match any value of profile', 'admin', NULL, '2026-07-15 00:37:10'),
(219, 'INFO', 'Provisioning retry initiated for \"Andika\" (ID: 24)', 'admin', NULL, '2026-07-15 00:37:12'),
(220, 'INFO', 'Provisioning retry initiated (ID: 24)', 'admin', '{\"method\":\"POST\",\"url\":\"/api/provisioning/24/retry\",\"body\":{},\"params\":{\"id\":\"24\"}}', '2026-07-15 00:37:12'),
(221, 'ERROR', 'Provisioning failed for \"Andika\" (ID: 24): input does not match any value of profile', 'admin', NULL, '2026-07-15 00:37:12'),
(222, 'INFO', 'Provisioning retry initiated for \"Andika\" (ID: 24)', 'admin', NULL, '2026-07-15 00:39:47'),
(223, 'INFO', 'Provisioning retry initiated (ID: 24)', 'admin', '{\"method\":\"POST\",\"url\":\"/api/provisioning/24/retry\",\"body\":{},\"params\":{\"id\":\"24\"}}', '2026-07-15 00:39:47'),
(224, 'ERROR', 'Provisioning failed for \"Andika\" (ID: 24): input does not match any value of profile', 'admin', NULL, '2026-07-15 00:39:47'),
(225, 'INFO', 'Provisioning retry initiated for \"Andika\" (ID: 24)', 'admin', NULL, '2026-07-15 00:40:00'),
(226, 'INFO', 'Provisioning retry initiated (ID: 24)', 'admin', '{\"method\":\"POST\",\"url\":\"/api/provisioning/24/retry\",\"body\":{},\"params\":{\"id\":\"24\"}}', '2026-07-15 00:40:00'),
(227, 'ERROR', 'Provisioning failed for \"Andika\" (ID: 24): input does not match any value of profile', 'admin', NULL, '2026-07-15 00:40:00'),
(228, 'INFO', 'Provisioning retry initiated for \"Andika\" (ID: 24)', 'admin', NULL, '2026-07-15 00:40:03'),
(229, 'INFO', 'Provisioning retry initiated (ID: 24)', 'admin', '{\"method\":\"POST\",\"url\":\"/api/provisioning/24/retry\",\"body\":{},\"params\":{\"id\":\"24\"}}', '2026-07-15 00:40:03'),
(230, 'ERROR', 'Provisioning failed for \"Andika\" (ID: 24): input does not match any value of profile', 'admin', NULL, '2026-07-15 00:40:03'),
(231, 'INFO', 'Provisioning retry initiated for \"Andika\" (ID: 24)', 'admin', NULL, '2026-07-15 00:40:27'),
(232, 'INFO', 'Provisioning retry initiated (ID: 24)', 'admin', '{\"method\":\"POST\",\"url\":\"/api/provisioning/24/retry\",\"body\":{},\"params\":{\"id\":\"24\"}}', '2026-07-15 00:40:27'),
(233, 'ERROR', 'Provisioning failed for \"Andika\" (ID: 24): input does not match any value of profile', 'admin', NULL, '2026-07-15 00:40:27'),
(234, 'INFO', 'Provisioning retry initiated for \"Andika\" (ID: 24)', 'admin', NULL, '2026-07-15 00:44:04'),
(235, 'INFO', 'Provisioning created for \"Yudi\" (ID: 25)', 'admin', NULL, '2026-07-15 00:47:09'),
(236, 'SUCCESS', 'Provisioning created for \"Yudi\"', 'admin', '{\"method\":\"POST\",\"url\":\"/api/provisioning\",\"body\":{\"customerName\":\"Yudi\",\"customerUsername\":\"yudistira\",\"pppoePassword\":\"123456\",\"oltPort\":\"olt_1/1/1:2\",\"serialNumber\":\"ZTEGCPOASD123\",\"profile\":\"100Mbps\"},\"params\":{}}', '2026-07-15 00:47:09'),
(237, 'SUCCESS', 'PPPoE secret created for \"yudistira\" on MikroTik', 'admin', NULL, '2026-07-15 00:47:10'),
(238, 'SUCCESS', 'Provisioning completed for \"Yudi\" (ID: 25)', 'admin', NULL, '2026-07-15 00:47:12'),
(239, 'WARNING', 'Provisioning deleted: \"Yudi\" (ID: 25)', 'admin', NULL, '2026-07-15 00:48:44'),
(240, 'WARNING', 'Provisioning deleted (ID: 25)', 'admin', '{\"method\":\"DELETE\",\"url\":\"/api/provisioning/25\",\"params\":{\"id\":\"25\"}}', '2026-07-15 00:48:44'),
(241, 'WARNING', 'Provisioning deleted: \"Andika\" (ID: 24)', 'admin', NULL, '2026-07-15 00:48:47'),
(242, 'WARNING', 'Provisioning deleted (ID: 24)', 'admin', '{\"method\":\"DELETE\",\"url\":\"/api/provisioning/24\",\"params\":{\"id\":\"24\"}}', '2026-07-15 00:48:47'),
(243, 'WARNING', 'Provisioning deleted: \"dika\" (ID: 23)', 'admin', NULL, '2026-07-15 00:48:48'),
(244, 'WARNING', 'Provisioning deleted (ID: 23)', 'admin', '{\"method\":\"DELETE\",\"url\":\"/api/provisioning/23\",\"params\":{\"id\":\"23\"}}', '2026-07-15 00:48:48'),
(245, 'WARNING', 'Provisioning deleted: \"Charlie Davis\" (ID: 21)', 'admin', NULL, '2026-07-15 00:48:50'),
(246, 'WARNING', 'Provisioning deleted (ID: 21)', 'admin', '{\"method\":\"DELETE\",\"url\":\"/api/provisioning/21\",\"params\":{\"id\":\"21\"}}', '2026-07-15 00:48:50'),
(247, 'INFO', 'Provisioning created for \"dika\" (ID: 26)', 'admin', NULL, '2026-07-15 00:49:18'),
(248, 'SUCCESS', 'Provisioning created for \"dika\"', 'admin', '{\"method\":\"POST\",\"url\":\"/api/provisioning\",\"body\":{\"customerName\":\"dika\",\"customerUsername\":\"dika\",\"pppoePassword\":\"12345678\",\"oltPort\":\"olt_2/2/2:1\",\"serialNumber\":\"ZTEGC435612312\",\"profile\":\"100Mbps\"},\"params\":{}}', '2026-07-15 00:49:18'),
(249, 'SUCCESS', 'PPPoE secret created for \"dika\" on MikroTik', 'admin', NULL, '2026-07-15 00:49:19'),
(250, 'SUCCESS', 'Provisioning completed for \"dika\" (ID: 26)', 'admin', NULL, '2026-07-15 00:49:22'),
(251, 'WARNING', 'Provisioning deleted: \"dika\" (ID: 26)', 'admin', NULL, '2026-07-15 00:59:43'),
(252, 'WARNING', 'Provisioning deleted (ID: 26)', 'admin', '{\"method\":\"DELETE\",\"url\":\"/api/provisioning/26\",\"params\":{\"id\":\"26\"}}', '2026-07-15 00:59:43'),
(253, 'WARNING', 'Provisioning deleted: \"John Doe\" (ID: 17)', 'admin', NULL, '2026-07-15 00:59:51'),
(254, 'WARNING', 'Provisioning deleted (ID: 17)', 'admin', '{\"method\":\"DELETE\",\"url\":\"/api/provisioning/17\",\"params\":{\"id\":\"17\"}}', '2026-07-15 00:59:51'),
(255, 'INFO', 'Provisioning created for \"Andika\" (ID: 27)', 'admin', NULL, '2026-07-15 01:00:41'),
(256, 'SUCCESS', 'Provisioning created for \"Andika\"', 'admin', '{\"method\":\"POST\",\"url\":\"/api/provisioning\",\"body\":{\"customerName\":\"Andika\",\"customerUsername\":\"andika@miko.net\",\"pppoePassword\":\"123456\",\"oltPort\":\"2/1/1:1\",\"serialNumber\":\"ZTEGCPZ2TR6CC\",\"profile\":\"50Mbps\"},\"params\":{}}', '2026-07-15 01:00:41'),
(257, 'SUCCESS', 'PPPoE secret created for \"andika@miko.net\" on MikroTik', 'admin', NULL, '2026-07-15 01:00:42'),
(258, 'SUCCESS', 'Provisioning completed for \"Andika\" (ID: 27)', 'admin', NULL, '2026-07-15 01:00:45'),
(259, 'WARNING', 'Provisioning deleted: \"Andika\" (ID: 27)', 'admin', NULL, '2026-07-15 01:01:47'),
(260, 'WARNING', 'Provisioning deleted (ID: 27)', 'admin', '{\"method\":\"DELETE\",\"url\":\"/api/provisioning/27\",\"params\":{\"id\":\"27\"}}', '2026-07-15 01:01:47'),
(261, 'INFO', 'Provisioning created for \"Andika\" (ID: 28)', 'admin', NULL, '2026-07-15 01:02:22'),
(262, 'SUCCESS', 'Provisioning created for \"Andika\"', 'admin', '{\"method\":\"POST\",\"url\":\"/api/provisioning\",\"body\":{\"customerName\":\"Andika\",\"customerUsername\":\"andika@miko.net\",\"pppoePassword\":\"123456\",\"oltPort\":\"olt_1/1/1\",\"serialNumber\":\"ZTEGCPZ2TR6CC\",\"profile\":\"50Mbps\"},\"params\":{}}', '2026-07-15 01:02:22'),
(263, 'SUCCESS', 'PPPoE secret created for \"andika@miko.net\" on MikroTik', 'admin', NULL, '2026-07-15 01:02:23'),
(264, 'SUCCESS', 'Provisioning completed for \"Andika\" (ID: 28)', 'admin', NULL, '2026-07-15 01:02:26'),
(265, 'WARNING', 'Provisioning deleted: \"Andika\" (ID: 28)', 'admin', NULL, '2026-07-15 01:09:47'),
(266, 'WARNING', 'Provisioning deleted (ID: 28)', 'admin', '{\"method\":\"DELETE\",\"url\":\"/api/provisioning/28\",\"params\":{\"id\":\"28\"}}', '2026-07-15 01:09:47'),
(267, 'INFO', 'Provisioning created for \"Andika\" (ID: 29)', 'admin', NULL, '2026-07-15 01:10:39'),
(268, 'SUCCESS', 'Provisioning created for \"Andika\"', 'admin', '{\"method\":\"POST\",\"url\":\"/api/provisioning\",\"body\":{\"customerName\":\"Andika\",\"customerUsername\":\"andika@miko.net\",\"pppoePassword\":\"123456\",\"oltPort\":\"1/1/1\",\"serialNumber\":\"ZTEGCPZ2TR6CC\",\"profile\":\"50Mbps\"},\"params\":{}}', '2026-07-15 01:10:39'),
(269, 'SUCCESS', 'PPPoE secret created for \"andika@miko.net\" on MikroTik', 'admin', NULL, '2026-07-15 01:10:40'),
(270, 'SUCCESS', 'Provisioning completed for \"Andika\" (ID: 29)', 'admin', NULL, '2026-07-15 01:10:43'),
(271, 'SUCCESS', 'Provisioning succeeded for John Doe', 'System', NULL, '2026-07-15 01:17:34'),
(272, 'SUCCESS', 'Provisioning succeeded for Jane Smith', 'System', NULL, '2026-07-15 01:17:34'),
(273, 'ERROR', 'Provisioning failed for Charlie Davis: ONU authentication failed', 'System', NULL, '2026-07-15 01:17:34'),
(274, 'INFO', 'User \"admin\" logged in successfully.', 'admin', NULL, '2026-07-15 01:17:34'),
(275, 'WARNING', 'High bandwidth usage detected on olt-1/1/1', 'System', NULL, '2026-07-15 01:17:34'),
(276, 'INFO', '\"mikrotik\" credentials updated.', 'admin', NULL, '2026-07-15 01:19:40'),
(277, 'INFO', '\"mikrotik\" credentials updated.', 'admin', '{\"method\":\"PUT\",\"url\":\"/api/credentials/mikrotik\",\"body\":{\"host\":\"192.168.10.1\",\"username\":\"admin\",\"password\":\"admin\",\"port\":8728},\"params\":{\"type\":\"mikrotik\"}}', '2026-07-15 01:19:40'),
(278, 'SUCCESS', 'Connection test passed for \"mikrotik\".', 'admin', '{\"method\":\"POST\",\"url\":\"/api/credentials/mikrotik/test\",\"body\":{},\"params\":{\"type\":\"mikrotik\"}}', '2026-07-15 01:19:42'),
(279, 'INFO', '\"olt\" credentials updated.', 'admin', NULL, '2026-07-15 01:19:54'),
(280, 'INFO', '\"olt\" credentials updated.', 'admin', '{\"method\":\"PUT\",\"url\":\"/api/credentials/olt\",\"body\":{\"host\":\"172.16.4.100\",\"username\":\"zte\",\"password\":\"zte\",\"port\":23},\"params\":{\"type\":\"olt\"}}', '2026-07-15 01:19:54'),
(281, 'SUCCESS', 'Connection test passed for \"olt\".', 'admin', '{\"method\":\"POST\",\"url\":\"/api/credentials/olt/test\",\"body\":{},\"params\":{\"type\":\"olt\"}}', '2026-07-15 01:19:57'),
(282, 'INFO', '\"telegram\" credentials updated.', 'admin', NULL, '2026-07-15 01:20:24'),
(283, 'INFO', '\"telegram\" credentials updated.', 'admin', '{\"method\":\"PUT\",\"url\":\"/api/credentials/telegram\",\"body\":{\"botToken\":\"AAGkEeGGDZSEpCtMsXf6Use8kVlXvT6tyIA\",\"chatId\":\"8698069656\"},\"params\":{\"type\":\"telegram\"}}', '2026-07-15 01:20:24'),
(284, 'INFO', '\"telegram\" credentials updated.', 'admin', NULL, '2026-07-15 01:20:45'),
(285, 'INFO', '\"telegram\" credentials updated.', 'admin', '{\"method\":\"PUT\",\"url\":\"/api/credentials/telegram\",\"body\":{\"botToken\":\"8844999873:AAGkEeGGDZSEpCtMsXf6Use8kVlXvT6tyIA\",\"chatId\":\"8698069656\"},\"params\":{\"type\":\"telegram\"}}', '2026-07-15 01:20:45'),
(286, 'SUCCESS', 'Connection test passed for \"telegram\".', 'admin', '{\"method\":\"POST\",\"url\":\"/api/credentials/telegram/test\",\"body\":{},\"params\":{\"type\":\"telegram\"}}', '2026-07-15 01:20:47'),
(287, 'INFO', 'Provisioning created for \"Andika\" (ID: 36)', 'admin', NULL, '2026-07-15 01:24:32'),
(288, 'SUCCESS', 'Provisioning created for \"Andika\"', 'admin', '{\"method\":\"POST\",\"url\":\"/api/provisioning\",\"body\":{\"customerName\":\"Andika\",\"customerUsername\":\"andika@miko.net\",\"pppoePassword\":\"123456\",\"oltPort\":\"1/1/1\",\"serialNumber\":\"ZTEGCPZ2TR6CC\",\"profile\":\"100Mbps\",\"onuNumber\":\"6\"},\"params\":{}}', '2026-07-15 01:24:32'),
(289, 'SUCCESS', 'PPPoE secret created for \"andika@miko.net\" on MikroTik', 'admin', NULL, '2026-07-15 01:24:33'),
(290, 'SUCCESS', 'ONU configured on OLT for \"Andika\"', 'admin', NULL, '2026-07-15 01:24:34'),
(291, 'SUCCESS', 'Provisioning completed for \"Andika\" (ID: 36)', 'admin', NULL, '2026-07-15 01:24:34'),
(292, 'WARNING', 'Provisioning deleted: \"Andika\" (ID: 36)', 'admin', NULL, '2026-07-15 01:26:16'),
(293, 'WARNING', 'Provisioning deleted (ID: 36)', 'admin', '{\"method\":\"DELETE\",\"url\":\"/api/provisioning/36\",\"params\":{\"id\":\"36\"}}', '2026-07-15 01:26:16'),
(294, 'INFO', 'Provisioning created for \"dika\" (ID: 37)', 'admin', NULL, '2026-07-15 01:26:44'),
(295, 'SUCCESS', 'Provisioning created for \"dika\"', 'admin', '{\"method\":\"POST\",\"url\":\"/api/provisioning\",\"body\":{\"customerName\":\"dika\",\"customerUsername\":\"andika@miko.net\",\"pppoePassword\":\"123456\",\"oltPort\":\"1/1/1\",\"serialNumber\":\"ZTEGCB06FA79\",\"profile\":\"100Mbps\",\"onuNumber\":\"7\"},\"params\":{}}', '2026-07-15 01:26:44'),
(296, 'SUCCESS', 'PPPoE secret created for \"andika@miko.net\" on MikroTik', 'admin', NULL, '2026-07-15 01:26:45'),
(297, 'SUCCESS', 'ONU configured on OLT for \"dika\"', 'admin', NULL, '2026-07-15 01:26:47'),
(298, 'SUCCESS', 'Provisioning completed for \"dika\" (ID: 37)', 'admin', NULL, '2026-07-15 01:26:47'),
(299, 'WARNING', 'Provisioning deleted: \"dika\" (ID: 37)', 'admin', NULL, '2026-07-15 01:36:52'),
(300, 'WARNING', 'Provisioning deleted (ID: 37)', 'admin', '{\"method\":\"DELETE\",\"url\":\"/api/provisioning/37\",\"params\":{\"id\":\"37\"}}', '2026-07-15 01:36:52'),
(301, 'INFO', 'Provisioning created for \"Andika\" (ID: 38)', 'admin', NULL, '2026-07-15 01:37:30'),
(302, 'SUCCESS', 'Provisioning created for \"Andika\"', 'admin', '{\"method\":\"POST\",\"url\":\"/api/provisioning\",\"body\":{\"customerName\":\"Andika\",\"customerUsername\":\"andika@miko.net\",\"pppoePassword\":\"123456\",\"oltPort\":\"1/1/1\",\"serialNumber\":\"ZTEGCB06FA99\",\"profile\":\"100Mbps\",\"onuNumber\":\"8\"},\"params\":{}}', '2026-07-15 01:37:30'),
(303, 'SUCCESS', 'PPPoE secret created for \"andika@miko.net\" on MikroTik', 'admin', NULL, '2026-07-15 01:37:31'),
(304, 'SUCCESS', 'ONU configured on OLT for \"Andika\"', 'admin', NULL, '2026-07-15 01:37:33'),
(305, 'SUCCESS', 'Provisioning completed for \"Andika\" (ID: 38)', 'admin', NULL, '2026-07-15 01:37:33'),
(306, 'INFO', 'Provisioning created for \"Nisep Tampan\" (ID: 39)', 'admin', NULL, '2026-07-15 01:41:07'),
(307, 'SUCCESS', 'Provisioning created for \"Nisep Tampan\"', 'admin', '{\"method\":\"POST\",\"url\":\"/api/provisioning\",\"body\":{\"customerName\":\"Nisep Tampan\",\"customerUsername\":\"nisepgaul\",\"pppoePassword\":\"123456\",\"oltPort\":\"1/1/1\",\"onuNumber\":\"9\",\"serialNumber\":\"ZTEGCPL45R3EE\",\"profile\":\"100Mbps\"},\"params\":{}}', '2026-07-15 01:41:07'),
(308, 'SUCCESS', 'PPPoE secret created for \"nisepgaul\" on MikroTik', 'admin', NULL, '2026-07-15 01:41:08'),
(309, 'SUCCESS', 'Provisioning completed for \"Nisep Tampan\" (ID: 39)', 'admin', NULL, '2026-07-15 01:41:11'),
(310, 'SUCCESS', 'Connection test passed for \"telegram\".', 'admin', '{\"method\":\"POST\",\"url\":\"/api/credentials/telegram/test\",\"body\":{},\"params\":{\"type\":\"telegram\"}}', '2026-07-15 01:42:16'),
(311, 'INFO', 'Provisioning created for \"Polda Sumbar\" (ID: 40)', 'admin', NULL, '2026-07-15 01:43:21'),
(312, 'SUCCESS', 'Provisioning created for \"Polda Sumbar\"', 'admin', '{\"method\":\"POST\",\"url\":\"/api/provisioning\",\"body\":{\"customerName\":\"Polda Sumbar\",\"customerUsername\":\"poldasumbar@transnetsumbar.id\",\"pppoePassword\":\"123456\",\"oltPort\":\"1/1/1\",\"onuNumber\":\"10\",\"serialNumber\":\"ZTEGCCR7PL2\",\"profile\":\"100Mbps\"},\"params\":{}}', '2026-07-15 01:43:21'),
(313, 'SUCCESS', 'PPPoE secret created for \"poldasumbar@transnetsumbar.id\" on MikroTik', 'admin', NULL, '2026-07-15 01:43:22'),
(314, 'SUCCESS', 'Provisioning completed for \"Polda Sumbar\" (ID: 40)', 'admin', NULL, '2026-07-15 01:43:26'),
(315, 'WARNING', 'Provisioning deleted: \"Polda Sumbar\" (ID: 40)', 'admin', NULL, '2026-07-15 01:46:01'),
(316, 'WARNING', 'Provisioning deleted (ID: 40)', 'admin', '{\"method\":\"DELETE\",\"url\":\"/api/provisioning/40\",\"params\":{\"id\":\"40\"}}', '2026-07-15 01:46:01'),
(317, 'WARNING', 'Provisioning deleted: \"Nisep Tampan\" (ID: 39)', 'admin', NULL, '2026-07-15 01:46:03');
INSERT INTO `audit_logs` (`id`, `level`, `message`, `actor`, `meta`, `created_at`) VALUES
(318, 'WARNING', 'Provisioning deleted (ID: 39)', 'admin', '{\"method\":\"DELETE\",\"url\":\"/api/provisioning/39\",\"params\":{\"id\":\"39\"}}', '2026-07-15 01:46:03'),
(319, 'INFO', 'Provisioning created for \"Nisep\" (ID: 41)', 'admin', NULL, '2026-07-15 01:46:59'),
(320, 'SUCCESS', 'Provisioning created for \"Nisep\"', 'admin', '{\"method\":\"POST\",\"url\":\"/api/provisioning\",\"body\":{\"customerName\":\"Nisep\",\"customerUsername\":\"nispetampan@miko.net\",\"pppoePassword\":\"123456\",\"oltPort\":\"1/1/1\",\"serialNumber\":\"ZTEGCCR7Pl2\",\"profile\":\"100Mbps\",\"onuNumber\":\"9\"},\"params\":{}}', '2026-07-15 01:46:59'),
(321, 'SUCCESS', 'PPPoE secret created for \"nispetampan@miko.net\" on MikroTik', 'admin', NULL, '2026-07-15 01:47:01'),
(322, 'SUCCESS', 'Provisioning completed for \"Nisep\" (ID: 41)', 'admin', NULL, '2026-07-15 01:47:04'),
(323, 'WARNING', 'Provisioning deleted: \"Nisep\" (ID: 41)', 'admin', NULL, '2026-07-15 01:47:42'),
(324, 'WARNING', 'Provisioning deleted (ID: 41)', 'admin', '{\"method\":\"DELETE\",\"url\":\"/api/provisioning/41\",\"params\":{\"id\":\"41\"}}', '2026-07-15 01:47:42'),
(325, 'INFO', 'Provisioning created for \"Nisep\" (ID: 42)', 'admin', NULL, '2026-07-15 01:48:06'),
(326, 'SUCCESS', 'Provisioning created for \"Nisep\"', 'admin', '{\"method\":\"POST\",\"url\":\"/api/provisioning\",\"body\":{\"customerName\":\"Nisep\",\"customerUsername\":\"nispetampan@miko.net\",\"pppoePassword\":\"123456\",\"oltPort\":\"1/1/1\",\"serialNumber\":\"ZTEGCPZ2TR6CC\",\"profile\":\"100Mbps\",\"onuNumber\":\"9\"},\"params\":{}}', '2026-07-15 01:48:06'),
(327, 'SUCCESS', 'PPPoE secret created for \"nispetampan@miko.net\" on MikroTik', 'admin', NULL, '2026-07-15 01:48:07'),
(328, 'SUCCESS', 'Provisioning completed for \"Nisep\" (ID: 42)', 'admin', NULL, '2026-07-15 01:48:10'),
(329, 'WARNING', 'Provisioning deleted: \"Nisep\" (ID: 42)', 'admin', NULL, '2026-07-15 01:49:43'),
(330, 'WARNING', 'Provisioning deleted (ID: 42)', 'admin', '{\"method\":\"DELETE\",\"url\":\"/api/provisioning/42\",\"params\":{\"id\":\"42\"}}', '2026-07-15 01:49:43'),
(331, 'WARNING', 'Provisioning deleted: \"Andika\" (ID: 38)', 'admin', NULL, '2026-07-15 01:49:45'),
(332, 'WARNING', 'Provisioning deleted (ID: 38)', 'admin', '{\"method\":\"DELETE\",\"url\":\"/api/provisioning/38\",\"params\":{\"id\":\"38\"}}', '2026-07-15 01:49:45'),
(333, 'INFO', 'Provisioning created for \"Asep\" (ID: 43)', 'admin', NULL, '2026-07-15 01:50:26'),
(334, 'SUCCESS', 'Provisioning created for \"Asep\"', 'admin', '{\"method\":\"POST\",\"url\":\"/api/provisioning\",\"body\":{\"customerName\":\"Asep\",\"customerUsername\":\"asepgaul@miko.net\",\"pppoePassword\":\"123456\",\"oltPort\":\"1/1/1\",\"serialNumber\":\"ZTEGCB06FA98\",\"profile\":\"50Mbps\",\"onuNumber\":\"11\"},\"params\":{}}', '2026-07-15 01:50:26'),
(335, 'SUCCESS', 'PPPoE secret created for \"asepgaul@miko.net\" on MikroTik', 'admin', NULL, '2026-07-15 01:50:28'),
(336, 'SUCCESS', 'ONU configured on OLT for \"Asep\"', 'admin', NULL, '2026-07-15 01:50:30'),
(337, 'SUCCESS', 'Provisioning completed for \"Asep\" (ID: 43)', 'admin', NULL, '2026-07-15 01:50:30'),
(338, 'WARNING', 'Provisioning deleted: \"Asep\" (ID: 43)', 'admin', NULL, '2026-07-15 01:52:33'),
(339, 'WARNING', 'Provisioning deleted (ID: 43)', 'admin', '{\"method\":\"DELETE\",\"url\":\"/api/provisioning/43\",\"params\":{\"id\":\"43\"}}', '2026-07-15 01:52:33'),
(340, 'INFO', 'Provisioning created for \"Asep\" (ID: 44)', 'admin', NULL, '2026-07-15 01:53:24'),
(341, 'SUCCESS', 'Provisioning created for \"Asep\"', 'admin', '{\"method\":\"POST\",\"url\":\"/api/provisioning\",\"body\":{\"customerName\":\"Asep\",\"customerUsername\":\"asepgaul@miko.net\",\"pppoePassword\":\"123456\",\"oltPort\":\"1/1/1\",\"serialNumber\":\"ZTEGCB06FA97\",\"profile\":\"50Mbps\",\"onuNumber\":\"12\"},\"params\":{}}', '2026-07-15 01:53:24'),
(342, 'SUCCESS', 'PPPoE secret created for \"asepgaul@miko.net\" on MikroTik', 'admin', NULL, '2026-07-15 01:53:25'),
(343, 'SUCCESS', 'ONU configured on OLT for \"Asep\"', 'admin', NULL, '2026-07-15 01:53:27'),
(344, 'SUCCESS', 'Provisioning completed for \"Asep\" (ID: 44)', 'admin', NULL, '2026-07-15 01:53:27'),
(345, 'INFO', 'Provisioning created for \"andika\" (ID: 45)', 'admin', NULL, '2026-07-15 01:56:21'),
(346, 'SUCCESS', 'Provisioning created for \"andika\"', 'admin', '{\"method\":\"POST\",\"url\":\"/api/provisioning\",\"body\":{\"customerName\":\"andika\",\"customerUsername\":\"andika@miko.net\",\"pppoePassword\":\"123456\",\"oltPort\":\"1/1/2\",\"serialNumber\":\"ZTEGCB06FA66\",\"profile\":\"100Mbps\",\"onuNumber\":\"10\"},\"params\":{}}', '2026-07-15 01:56:21'),
(347, 'SUCCESS', 'PPPoE secret created for \"andika@miko.net\" on MikroTik', 'admin', NULL, '2026-07-15 01:56:22'),
(348, 'SUCCESS', 'ONU configured on OLT for \"andika\"', 'admin', NULL, '2026-07-15 01:56:24'),
(349, 'SUCCESS', 'Provisioning completed for \"andika\" (ID: 45)', 'admin', NULL, '2026-07-15 01:56:24'),
(350, 'WARNING', 'Provisioning deleted: \"andika\" (ID: 45)', 'admin', NULL, '2026-07-15 01:59:43'),
(351, 'WARNING', 'Provisioning deleted (ID: 45)', 'admin', '{\"method\":\"DELETE\",\"url\":\"/api/provisioning/45\",\"params\":{\"id\":\"45\"}}', '2026-07-15 01:59:43'),
(352, 'WARNING', 'Provisioning deleted: \"Asep\" (ID: 44)', 'admin', NULL, '2026-07-15 01:59:45'),
(353, 'WARNING', 'Provisioning deleted (ID: 44)', 'admin', '{\"method\":\"DELETE\",\"url\":\"/api/provisioning/44\",\"params\":{\"id\":\"44\"}}', '2026-07-15 01:59:45'),
(354, 'INFO', 'Provisioning created for \"ASEP GAUL\" (ID: 46)', 'admin', NULL, '2026-07-15 02:00:15'),
(355, 'SUCCESS', 'Provisioning created for \"ASEP GAUL\"', 'admin', '{\"method\":\"POST\",\"url\":\"/api/provisioning\",\"body\":{\"customerName\":\"ASEP GAUL\",\"customerUsername\":\"asepgaul@miko.net\",\"pppoePassword\":\"123456\",\"oltPort\":\"1/1/1\",\"serialNumber\":\"ZTEGCB06FA88\",\"profile\":\"100Mbps\",\"onuNumber\":\"13\"},\"params\":{}}', '2026-07-15 02:00:15'),
(356, 'SUCCESS', 'PPPoE secret created for \"asepgaul@miko.net\" on MikroTik', 'admin', NULL, '2026-07-15 02:00:17'),
(357, 'SUCCESS', 'ONU configured on OLT for \"ASEP GAUL\"', 'admin', NULL, '2026-07-15 02:00:18'),
(358, 'SUCCESS', 'Provisioning completed for \"ASEP GAUL\" (ID: 46)', 'admin', NULL, '2026-07-15 02:00:18'),
(359, 'INFO', 'Provisioning created for \"lamine\" (ID: 47)', 'admin', NULL, '2026-07-15 02:03:02'),
(360, 'SUCCESS', 'Provisioning created for \"lamine\"', 'admin', '{\"method\":\"POST\",\"url\":\"/api/provisioning\",\"body\":{\"customerName\":\"lamine\",\"customerUsername\":\"lamine\",\"pppoePassword\":\"123456\",\"oltPort\":\"1/1/1\",\"serialNumber\":\"ZTEGCB06FA07\",\"profile\":\"100Mbps\",\"onuNumber\":\"14\"},\"params\":{}}', '2026-07-15 02:03:02'),
(361, 'SUCCESS', 'PPPoE secret created for \"lamine\" on MikroTik', 'admin', NULL, '2026-07-15 02:03:03'),
(362, 'SUCCESS', 'ONU configured on OLT for \"lamine\"', 'admin', NULL, '2026-07-15 02:03:05'),
(363, 'SUCCESS', 'Provisioning completed for \"lamine\" (ID: 47)', 'admin', NULL, '2026-07-15 02:03:05'),
(364, 'SUCCESS', 'Connection test passed for \"mikrotik\".', 'admin', '{\"method\":\"POST\",\"url\":\"/api/credentials/mikrotik/test\",\"body\":{},\"params\":{\"type\":\"mikrotik\"}}', '2026-07-15 02:03:42'),
(365, 'SUCCESS', 'Connection test passed for \"telegram\".', 'admin', '{\"method\":\"POST\",\"url\":\"/api/credentials/telegram/test\",\"body\":{},\"params\":{\"type\":\"telegram\"}}', '2026-07-15 02:04:23'),
(366, 'INFO', 'Provisioning created for \"mbappe\" (ID: 48)', 'admin', NULL, '2026-07-15 02:08:39'),
(367, 'SUCCESS', 'Provisioning created for \"mbappe\"', 'admin', '{\"method\":\"POST\",\"url\":\"/api/provisioning\",\"body\":{\"customerName\":\"mbappe\",\"customerUsername\":\"mbappe\",\"pppoePassword\":\"123456\",\"oltPort\":\"1/1/1\",\"serialNumber\":\"ZTEGCB06FA07\",\"profile\":\"50Mbps\",\"onuNumber\":\"15\"},\"params\":{}}', '2026-07-15 02:08:39'),
(368, 'SUCCESS', 'PPPoE secret created for \"mbappe\" on MikroTik', 'admin', NULL, '2026-07-15 02:08:40'),
(369, 'SUCCESS', 'Provisioning completed for \"mbappe\" (ID: 48)', 'admin', NULL, '2026-07-15 02:08:44'),
(370, 'INFO', 'Provisioning created for \"mbappe\" (ID: 49)', 'admin', NULL, '2026-07-15 02:12:24'),
(371, 'SUCCESS', 'Provisioning created for \"mbappe\"', 'admin', '{\"method\":\"POST\",\"url\":\"/api/provisioning\",\"body\":{\"customerName\":\"mbappe\",\"customerUsername\":\"mbappe\",\"pppoePassword\":\"123456\",\"oltPort\":\"1/1/1\",\"serialNumber\":\"ZTEGCB06FA57\",\"profile\":\"50Mbps\",\"onuNumber\":\"15\"},\"params\":{}}', '2026-07-15 02:12:24'),
(372, 'SUCCESS', 'PPPoE secret created for \"mbappe\" on MikroTik', 'admin', NULL, '2026-07-15 02:12:25'),
(373, 'SUCCESS', 'ONU configured on OLT for \"mbappe\"', 'admin', NULL, '2026-07-15 02:12:27'),
(374, 'SUCCESS', 'Provisioning completed for \"mbappe\" (ID: 49)', 'admin', NULL, '2026-07-15 02:12:27'),
(375, 'INFO', 'Provisioning created for \"mbappe\" (ID: 50)', 'admin', NULL, '2026-07-15 02:14:44'),
(376, 'SUCCESS', 'Provisioning created for \"mbappe\"', 'admin', '{\"method\":\"POST\",\"url\":\"/api/provisioning\",\"body\":{\"customerName\":\"mbappe\",\"customerUsername\":\"mbappe\",\"pppoePassword\":\"123456\",\"oltPort\":\"1/1/1\",\"serialNumber\":\"ZTEGCB06FA61\",\"profile\":\"100Mbps\",\"onuNumber\":\"16\"},\"params\":{}}', '2026-07-15 02:14:44'),
(377, 'SUCCESS', 'PPPoE secret created for \"mbappe\" on MikroTik', 'admin', NULL, '2026-07-15 02:14:45'),
(378, 'SUCCESS', 'ONU configured on OLT for \"mbappe\"', 'admin', NULL, '2026-07-15 02:14:47'),
(379, 'SUCCESS', 'Provisioning completed for \"mbappe\" (ID: 50)', 'admin', NULL, '2026-07-15 02:14:47'),
(380, 'SUCCESS', 'Provisioning succeeded for John Doe', 'System', NULL, '2026-07-15 02:19:11'),
(381, 'SUCCESS', 'Provisioning succeeded for Jane Smith', 'System', NULL, '2026-07-15 02:19:11'),
(382, 'ERROR', 'Provisioning failed for Charlie Davis: ONU authentication failed', 'System', NULL, '2026-07-15 02:19:11'),
(383, 'INFO', 'User \"admin\" logged in successfully.', 'admin', NULL, '2026-07-15 02:19:11'),
(384, 'WARNING', 'High bandwidth usage detected on olt-1/1/1', 'System', NULL, '2026-07-15 02:19:12'),
(385, 'INFO', '\"mikrotik\" credentials updated.', 'admin', NULL, '2026-07-15 02:21:46'),
(386, 'INFO', '\"mikrotik\" credentials updated.', 'admin', '{\"method\":\"PUT\",\"url\":\"/api/credentials/mikrotik\",\"body\":{\"host\":\"192.168.10.1\",\"username\":\"admin\",\"password\":\"admin\",\"port\":8728},\"params\":{\"type\":\"mikrotik\"}}', '2026-07-15 02:21:46'),
(387, 'SUCCESS', 'Connection test passed for \"mikrotik\".', 'admin', '{\"method\":\"POST\",\"url\":\"/api/credentials/mikrotik/test\",\"body\":{},\"params\":{\"type\":\"mikrotik\"}}', '2026-07-15 02:21:48'),
(388, 'INFO', '\"olt\" credentials updated.', 'admin', NULL, '2026-07-15 02:22:00'),
(389, 'INFO', '\"olt\" credentials updated.', 'admin', '{\"method\":\"PUT\",\"url\":\"/api/credentials/olt\",\"body\":{\"host\":\"172.16.4.100\",\"username\":\"zte\",\"password\":\"zte\",\"port\":23},\"params\":{\"type\":\"olt\"}}', '2026-07-15 02:22:00'),
(390, 'SUCCESS', 'Connection test passed for \"olt\".', 'admin', '{\"method\":\"POST\",\"url\":\"/api/credentials/olt/test\",\"body\":{},\"params\":{\"type\":\"olt\"}}', '2026-07-15 02:22:04'),
(391, 'INFO', '\"telegram\" credentials updated.', 'admin', NULL, '2026-07-15 02:22:28'),
(392, 'INFO', '\"telegram\" credentials updated.', 'admin', '{\"method\":\"PUT\",\"url\":\"/api/credentials/telegram\",\"body\":{\"botToken\":\"AAGkEeGGDZSEpCtMsXf6Use8kVlXvT6tyIA\",\"chatId\":\"8698069656\"},\"params\":{\"type\":\"telegram\"}}', '2026-07-15 02:22:28'),
(393, 'INFO', '\"telegram\" credentials updated.', 'admin', NULL, '2026-07-15 02:22:51'),
(394, 'INFO', '\"telegram\" credentials updated.', 'admin', '{\"method\":\"PUT\",\"url\":\"/api/credentials/telegram\",\"body\":{\"botToken\":\"8844999873:AAGkEeGGDZSEpCtMsXf6Use8kVlXvT6tyIA\",\"chatId\":\"8698069656\"},\"params\":{\"type\":\"telegram\"}}', '2026-07-15 02:22:51'),
(395, 'SUCCESS', 'Connection test passed for \"telegram\".', 'admin', '{\"method\":\"POST\",\"url\":\"/api/credentials/telegram/test\",\"body\":{},\"params\":{\"type\":\"telegram\"}}', '2026-07-15 02:22:52'),
(396, 'INFO', 'Provisioning created for \"Mbappe\" (ID: 57)', 'admin', NULL, '2026-07-15 02:23:29'),
(397, 'SUCCESS', 'Provisioning created for \"Mbappe\"', 'admin', '{\"method\":\"POST\",\"url\":\"/api/provisioning\",\"body\":{\"customerName\":\"Mbappe\",\"customerUsername\":\"Mbappe\",\"pppoePassword\":\"123456\",\"oltPort\":\"1/1/1\",\"serialNumber\":\"ZTEGCB06FA47\",\"profile\":\"50Mbps\",\"onuNumber\":\"17\"},\"params\":{}}', '2026-07-15 02:23:29'),
(398, 'SUCCESS', 'PPPoE secret created for \"Mbappe\" on MikroTik', 'admin', NULL, '2026-07-15 02:23:30'),
(399, 'SUCCESS', 'ONU configured on OLT for \"Mbappe\"', 'admin', NULL, '2026-07-15 02:23:32'),
(400, 'SUCCESS', 'Provisioning completed for \"Mbappe\" (ID: 57)', 'admin', NULL, '2026-07-15 02:23:33'),
(401, 'INFO', 'Provisioning created for \"Nisep\" (ID: 58)', 'admin', NULL, '2026-07-15 04:42:59'),
(402, 'SUCCESS', 'Provisioning created for \"Nisep\"', 'admin', '{\"method\":\"POST\",\"url\":\"/api/provisioning\",\"body\":{\"customerName\":\"Nisep\",\"customerUsername\":\"nispetampan@miko.net\",\"pppoePassword\":\"123456\",\"oltPort\":\"1/1/1\",\"serialNumber\":\"ZTEGCB06FA37\",\"profile\":\"50Mbps\",\"onuNumber\":\"20\"},\"params\":{}}', '2026-07-15 04:42:59'),
(403, 'SUCCESS', 'PPPoE secret created for \"nispetampan@miko.net\" on MikroTik', 'admin', NULL, '2026-07-15 04:43:00'),
(404, 'SUCCESS', 'ONU configured on OLT for \"Nisep\"', 'admin', NULL, '2026-07-15 04:43:02'),
(405, 'SUCCESS', 'Provisioning completed for \"Nisep\" (ID: 58)', 'admin', NULL, '2026-07-15 04:43:03');

-- --------------------------------------------------------

--
-- Table structure for table `credentials`
--

CREATE TABLE `credentials` (
  `id` int(11) NOT NULL,
  `type` varchar(20) NOT NULL,
  `host` varchar(255) DEFAULT NULL,
  `username` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `port` int(11) DEFAULT NULL,
  `bot_token` varchar(255) DEFAULT NULL,
  `chat_id` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `credentials`
--

INSERT INTO `credentials` (`id`, `type`, `host`, `username`, `password`, `port`, `bot_token`, `chat_id`) VALUES
(1, 'mikrotik', '192.168.10.1', 'admin', 'admin', 8728, NULL, NULL),
(2, 'olt', '172.16.4.100', 'zte', 'zte', 23, NULL, NULL),
(3, 'telegram', NULL, NULL, NULL, NULL, '8844999873:AAGkEeGGDZSEpCtMsXf6Use8kVlXvT6tyIA', '8698069656');

-- --------------------------------------------------------

--
-- Table structure for table `provisioning`
--

CREATE TABLE `provisioning` (
  `id` int(11) NOT NULL,
  `customer_name` varchar(100) NOT NULL,
  `customer_username` varchar(50) NOT NULL,
  `pppoe_password` varchar(100) DEFAULT NULL,
  `olt_port` varchar(50) NOT NULL,
  `serial_number` varchar(50) DEFAULT NULL,
  `profile` varchar(50) DEFAULT NULL,
  `onu_number` int(11) DEFAULT NULL,
  `provisioning_step` varchar(100) DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `status` enum('IDLE','PENDING','PROVISIONING','ACTIVE','SUSPENDED','FAILED') NOT NULL DEFAULT 'IDLE',
  `error_message` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `provisioning`
--

INSERT INTO `provisioning` (`id`, `customer_name`, `customer_username`, `pppoe_password`, `olt_port`, `serial_number`, `profile`, `onu_number`, `provisioning_step`, `ip_address`, `status`, `error_message`, `created_at`, `updated_at`) VALUES
(1, 'John Doe', 'johndoe_pppoe', NULL, 'olt-1/1/1:1', 'ZTEGCA123456', '100M-Plan', NULL, NULL, '10.10.1.101', 'ACTIVE', NULL, '2026-06-10 20:24:35', '2026-06-10 20:24:35'),
(2, 'Jane Smith', 'janesmith_pppoe', NULL, 'olt-1/1/1:2', 'ZTEGCA789012', '50M-Plan', NULL, NULL, '10.10.1.102', 'ACTIVE', NULL, '2026-06-10 20:24:35', '2026-06-10 20:24:35'),
(3, 'Bob Wilson', 'bobwilson_pppoe', NULL, 'olt-1/1/2:1', 'ZTEGCB345678', '100M-Plan', NULL, NULL, NULL, 'PROVISIONING', NULL, '2026-06-10 20:24:35', '2026-06-10 20:24:35'),
(4, 'Alice Brown', 'alicebrown_pppoe', NULL, 'olt-1/1/2:3', 'ZTEGCC901234', '50M-Plan', NULL, NULL, NULL, 'PENDING', NULL, '2026-06-10 20:24:35', '2026-06-10 20:24:35'),
(5, 'Charlie Davis', 'charlie_pppoe', NULL, 'olt-1/1/3:1', 'ZTEGCD567890', '200M-Plan', NULL, NULL, NULL, 'ACTIVE', NULL, '2026-06-10 20:24:35', '2026-06-11 04:48:30'),
(6, 'Diana Evans', 'diana_pppoe', NULL, 'olt-1/1/3:2', 'ZTEGCE123789', '100M-Plan', NULL, NULL, '10.10.1.106', 'SUSPENDED', NULL, '2026-06-10 20:24:35', '2026-06-10 20:24:35'),
(7, 'test', 'test', NULL, 'olt-0/1/1', 'ZTEGCP7T69C', '50Mbps', NULL, NULL, NULL, 'PENDING', NULL, '2026-06-11 04:49:29', '2026-06-11 04:49:29'),
(9, 'Test', 'test_pppoe', NULL, 'olt-1/1/4:1', NULL, NULL, NULL, NULL, NULL, 'PENDING', NULL, '2026-06-11 05:42:51', '2026-06-11 05:42:51'),
(10, 'Test', 'test_pppoe', NULL, 'olt-1/1/4:1', NULL, NULL, NULL, NULL, NULL, 'PENDING', NULL, '2026-06-11 05:42:58', '2026-06-11 05:42:58'),
(11, 'Test', 'test_pppoe', NULL, 'olt-1/1/4:1', NULL, NULL, NULL, NULL, NULL, 'PENDING', NULL, '2026-06-11 05:43:00', '2026-06-11 05:43:00'),
(12, 'Test', 'test_pppoe', NULL, 'olt-1/1/4:1', NULL, NULL, NULL, NULL, NULL, 'PENDING', NULL, '2026-06-11 05:43:01', '2026-06-11 05:43:01'),
(13, 'Test', 'test_pppoe', NULL, 'olt-1/1/4:1', NULL, NULL, NULL, NULL, NULL, 'PENDING', NULL, '2026-06-11 05:43:02', '2026-06-11 05:43:02'),
(15, 'Andika', '03011004090804', NULL, 'olt_2/2/2:1', 'ZTGCPL09AD23', '10Mbps', NULL, NULL, NULL, 'PENDING', NULL, '2026-06-24 02:25:17', '2026-06-24 02:25:17'),
(18, 'Jane Smith', 'janesmith_pppoe', 'jane123', 'olt-1/1/1:2', 'ZTEGCA789012', '50M-Plan', NULL, NULL, '10.10.1.102', 'ACTIVE', NULL, '2026-07-15 00:17:06', '2026-07-15 00:17:06'),
(19, 'Bob Wilson', 'bobwilson_pppoe', 'bob123', 'olt-1/1/2:1', 'ZTEGCB345678', '100M-Plan', NULL, NULL, NULL, 'PROVISIONING', NULL, '2026-07-15 00:17:06', '2026-07-15 00:17:06'),
(20, 'Alice Brown', 'alicebrown_pppoe', 'alice123', 'olt-1/1/2:3', 'ZTEGCC901234', '50M-Plan', NULL, NULL, NULL, 'PENDING', NULL, '2026-07-15 00:17:06', '2026-07-15 00:17:06'),
(22, 'Diana Evans', 'diana_pppoe', 'diana123', 'olt-1/1/3:2', 'ZTEGCE123789', '100M-Plan', NULL, NULL, '10.10.1.106', 'SUSPENDED', NULL, '2026-07-15 00:17:06', '2026-07-15 00:17:06'),
(29, 'Andika', 'andika@miko.net', '123456', '1/1/1', 'ZTEGCPZ2TR6CC', '50Mbps', NULL, NULL, NULL, 'ACTIVE', NULL, '2026-07-15 01:10:39', '2026-07-15 01:10:43'),
(30, 'John Doe', 'johndoe_pppoe', 'johndoe123', 'olt-1/1/1:1', 'ZTEGCA123456', '100M-Plan', 1, NULL, '10.10.1.101', 'ACTIVE', NULL, '2026-07-15 01:17:34', '2026-07-15 01:17:34'),
(31, 'Jane Smith', 'janesmith_pppoe', 'jane123', 'olt-1/1/1:2', 'ZTEGCA789012', '50M-Plan', 2, NULL, '10.10.1.102', 'ACTIVE', NULL, '2026-07-15 01:17:34', '2026-07-15 01:17:34'),
(32, 'Bob Wilson', 'bobwilson_pppoe', 'bob123', 'olt-1/1/2:1', 'ZTEGCB345678', '100M-Plan', 3, NULL, NULL, 'PROVISIONING', NULL, '2026-07-15 01:17:34', '2026-07-15 01:17:34'),
(33, 'Alice Brown', 'alicebrown_pppoe', 'alice123', 'olt-1/1/2:3', 'ZTEGCC901234', '50M-Plan', 4, NULL, NULL, 'PENDING', NULL, '2026-07-15 01:17:34', '2026-07-15 01:17:34'),
(34, 'Charlie Davis', 'charlie_pppoe', 'charlie123', 'olt-1/1/3:1', 'ZTEGCD567890', '200M-Plan', 5, NULL, NULL, 'FAILED', 'ONU authentication failed', '2026-07-15 01:17:34', '2026-07-15 01:17:34'),
(35, 'Diana Evans', 'diana_pppoe', 'diana123', 'olt-1/1/3:2', 'ZTEGCE123789', '100M-Plan', 6, NULL, '10.10.1.106', 'SUSPENDED', NULL, '2026-07-15 01:17:34', '2026-07-15 01:17:34'),
(46, 'ASEP GAUL', 'asepgaul@miko.net', '123456', '1/1/1', 'ZTEGCB06FA88', '100Mbps', 13, NULL, NULL, 'ACTIVE', NULL, '2026-07-15 02:00:15', '2026-07-15 02:00:18'),
(47, 'lamine', 'lamine', '123456', '1/1/1', 'ZTEGCB06FA07', '100Mbps', 14, NULL, NULL, 'ACTIVE', NULL, '2026-07-15 02:03:02', '2026-07-15 02:03:05'),
(48, 'mbappe', 'mbappe', '123456', '1/1/1', 'ZTEGCB06FA07', '50Mbps', 15, NULL, NULL, 'ACTIVE', NULL, '2026-07-15 02:08:39', '2026-07-15 02:08:44'),
(49, 'mbappe', 'mbappe', '123456', '1/1/1', 'ZTEGCB06FA57', '50Mbps', 15, NULL, NULL, 'ACTIVE', NULL, '2026-07-15 02:12:24', '2026-07-15 02:12:27'),
(50, 'mbappe', 'mbappe', '123456', '1/1/1', 'ZTEGCB06FA61', '100Mbps', 16, NULL, NULL, 'ACTIVE', NULL, '2026-07-15 02:14:44', '2026-07-15 02:14:47'),
(51, 'John Doe', 'johndoe_pppoe', 'johndoe123', 'olt-1/1/1:1', 'ZTEGCA123456', '100M-Plan', 1, NULL, '10.10.1.101', 'ACTIVE', NULL, '2026-07-15 02:19:11', '2026-07-15 02:19:11'),
(52, 'Jane Smith', 'janesmith_pppoe', 'jane123', 'olt-1/1/1:2', 'ZTEGCA789012', '50M-Plan', 2, NULL, '10.10.1.102', 'ACTIVE', NULL, '2026-07-15 02:19:11', '2026-07-15 02:19:11'),
(53, 'Bob Wilson', 'bobwilson_pppoe', 'bob123', 'olt-1/1/2:1', 'ZTEGCB345678', '100M-Plan', 3, NULL, NULL, 'PROVISIONING', NULL, '2026-07-15 02:19:11', '2026-07-15 02:19:11'),
(54, 'Alice Brown', 'alicebrown_pppoe', 'alice123', 'olt-1/1/2:3', 'ZTEGCC901234', '50M-Plan', 4, NULL, NULL, 'PENDING', NULL, '2026-07-15 02:19:11', '2026-07-15 02:19:11'),
(55, 'Charlie Davis', 'charlie_pppoe', 'charlie123', 'olt-1/1/3:1', 'ZTEGCD567890', '200M-Plan', 5, NULL, NULL, 'FAILED', 'ONU authentication failed', '2026-07-15 02:19:11', '2026-07-15 02:19:11'),
(56, 'Diana Evans', 'diana_pppoe', 'diana123', 'olt-1/1/3:2', 'ZTEGCE123789', '100M-Plan', 6, NULL, '10.10.1.106', 'SUSPENDED', NULL, '2026-07-15 02:19:11', '2026-07-15 02:19:11'),
(57, 'Mbappe', 'Mbappe', '123456', '1/1/1', 'ZTEGCB06FA47', '50Mbps', 17, '✅ Completed', NULL, 'ACTIVE', NULL, '2026-07-15 02:23:29', '2026-07-15 02:23:33'),
(58, 'Nisep', 'nispetampan@miko.net', '123456', '1/1/1', 'ZTEGCB06FA37', '50Mbps', 20, '✅ Completed', NULL, 'ACTIVE', NULL, '2026-07-15 04:42:59', '2026-07-15 04:43:03');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','tech') NOT NULL DEFAULT 'tech',
  `full_name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `role`, `full_name`, `email`, `created_at`) VALUES
(1, 'admin', '$2b$10$vze2zt1EiveRFZVvpHK0I.KcJqgnxhCMAcx3fXNPF8FMSatUZM7yW', 'admin', 'Network Admin', 'andikafiransyah1905@gmail.com', '2026-06-10 20:24:35'),
(2, 'technician', '$2b$10$JQ1zonQvRHwjRjlO5QwY7uj0X4uzKV8NVqF1th/x4ts4A1aXo/fuq', 'tech', 'Field Technician', 'tech@mikonet.com', '2026-06-10 20:24:35');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `credentials`
--
ALTER TABLE `credentials`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `type` (`type`);

--
-- Indexes for table `provisioning`
--
ALTER TABLE `provisioning`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `audit_logs`
--
ALTER TABLE `audit_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=406;

--
-- AUTO_INCREMENT for table `credentials`
--
ALTER TABLE `credentials`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `provisioning`
--
ALTER TABLE `provisioning`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=59;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

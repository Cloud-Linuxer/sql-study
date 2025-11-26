-- MySQL dump 10.13  Distrib 8.0.44, for Linux (x86_64)
--
-- Host: localhost    Database: naver_financial
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `stores`
--

DROP TABLE IF EXISTS `stores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stores` (
  `id` int NOT NULL AUTO_INCREMENT,
  `col1` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `col2` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `col3` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `col4` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `col5` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `col6` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `col7` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `col8` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `col9` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `col10` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `col11` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `col12` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `col13` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `col14` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `col15` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `col16` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `col17` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `col18` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `col19` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `col20` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `col21` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `col22` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `col23` int DEFAULT NULL,
  `col24` int DEFAULT NULL,
  `col25` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `col26` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `col27` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `col28` int DEFAULT NULL,
  `col29` int DEFAULT NULL,
  `col30` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `col31` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `col32` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `col33` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `col34` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `col35` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `col36` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `col37` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `col38` decimal(15,12) DEFAULT NULL,
  `col39` decimal(15,12) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stores`
--

LOCK TABLES `stores` WRITE;
/*!40000 ALTER TABLE `stores` DISABLE KEYS */;
/*!40000 ALTER TABLE `stores` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-05  5:56:08

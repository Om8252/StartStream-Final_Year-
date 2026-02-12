-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 01, 2025 at 11:42 AM
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
-- Database: `sharktankinvestor`
--

-- --------------------------------------------------------

--
-- Table structure for table `appointments`
--

CREATE TABLE `appointments` (
  `id` int(11) NOT NULL,
  `Sender_id` int(11) NOT NULL,
  `Recived_id` int(11) NOT NULL,
  `appointment_date` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `location` varchar(255) NOT NULL,
  `status` tinyint(1) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `appointments`
--

INSERT INTO `appointments` (`id`, `Sender_id`, `Recived_id`, `appointment_date`, `location`, `status`, `created_at`) VALUES
(12, 25, 26, '2025-03-02 12:42:00', 'shirdi\n', 0, '2025-03-01 07:12:15'),
(13, 25, 24, '2025-03-04 14:42:00', 'rgerg', 0, '2025-03-01 09:12:09'),
(14, 25, 34, '2025-03-01 15:24:00', 'wioerhwaher\n\n', 0, '2025-03-01 09:54:16');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `Categories_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `Categories_name`) VALUES
(6, 'Technology'),
(7, 'Helth'),
(8, 'Medical'),
(11, 'Sports'),
(12, 'sfa');

-- --------------------------------------------------------

--
-- Table structure for table `message`
--

CREATE TABLE `message` (
  `id` int(255) NOT NULL,
  `Sender_id` int(255) NOT NULL,
  `Reciver_id` int(255) NOT NULL,
  `Content` varchar(10000) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `is_read` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `message`
--

INSERT INTO `message` (`id`, `Sender_id`, `Reciver_id`, `Content`, `timestamp`, `is_read`) VALUES
(252, 33, 24, '\n<div \n  data-payment-id=\"undefined\" \n  data-amount=\"2\"\n  style=\"border: 1px solid #ccc; border-radius: 8px; padding: 16px; max-width: 300px; margin: 0 auto;\"\n>\n  <div style=\"font-size: 18px; font-weight: bold; text-align: center; margin-bottom: 16px;\">\n    Payment Request: $2\n  </div>\n  <div style=\"text-align: center;\">\n    <img src=\"http://localhost:8081/uploads/qrcode/1739780346466.JPG\" alt=\"QR Code\" style=\"width: 100%; max-width: 200px; height: auto;\" />\n  </div>\n  <div style=\"margin-top: 16px;\">\n    <label class=\"text-light\">Payment Amount</label>\n    <input\n      type=\"text\"\n      placeholder=\"Enter payment Amount\"\n      class=\"payment-reference\"\n      style=\"width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; margin-bottom: 10px;\"\n    />\n    <label class=\"text-light\">Transaction Receipt</label>\n    <input\n      type=\"file\"\n      class=\"receipt-file\"\n      style=\"width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;\"\n      accept=\"image/*, .pdf\"\n    />\n    <button \n      class=\"btn btn-primary w-100 mt-2 pay-button\"\n      style=\"padding: 8px 16px; border-radius: 4px;\"\n    >\n      Pay Now\n    </button>\n  </div>\n</div>\n', '2025-02-17 08:19:06', 1),
(253, 33, 24, '\n<div \n  data-payment-id=\"undefined\" \n  data-amount=\"2\"\n  style=\"border: 1px solid #ccc; border-radius: 8px; padding: 16px; max-width: 300px; margin: 0 auto;\"\n>\n  <div style=\"font-size: 18px; font-weight: bold; text-align: center; margin-bottom: 16px;\">\n    Payment Request: $2\n  </div>\n  <div style=\"text-align: center;\">\n    <img src=\"http://localhost:8081/uploads/qrcode/1739786506968.JPG\" alt=\"QR Code\" style=\"width: 100%; max-width: 200px; height: auto;\" />\n  </div>\n  <div style=\"margin-top: 16px;\">\n    <label class=\"text-light\">Payment Amount</label>\n    <input\n      type=\"text\"\n      placeholder=\"Enter payment Amount\"\n      class=\"payment-reference\"\n      style=\"width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; margin-bottom: 10px;\"\n    />\n    <label class=\"text-light\">Transaction Receipt</label>\n    <input\n      type=\"file\"\n      class=\"receipt-file\"\n      style=\"width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;\"\n      accept=\"image/*, .pdf\"\n    />\n    <button \n      class=\"btn btn-primary w-100 mt-2 pay-button\"\n      style=\"padding: 8px 16px; border-radius: 4px;\"\n    >\n      Pay Now\n    </button>\n  </div>\n</div>\n', '2025-02-18 06:32:56', 1),
(254, 33, 24, '\n<div \n  data-payment-id=\"undefined\" \n  data-amount=\"22\"\n  style=\"border: 1px solid #ccc; border-radius: 8px; padding: 16px; max-width: 300px; margin: 0 auto;\"\n>\n  <div style=\"font-size: 18px; font-weight: bold; text-align: center; margin-bottom: 16px;\">\n    Payment Request: $22\n  </div>\n  <div style=\"text-align: center;\">\n    <img src=\"http://localhost:8081/uploads/qrcode/1739786681076.JPG\" alt=\"QR Code\" style=\"width: 100%; max-width: 200px; height: auto;\" />\n  </div>\n  <div style=\"margin-top: 16px;\">\n    <label class=\"text-light\">Payment Amount</label>\n    <input\n      type=\"text\"\n      placeholder=\"Enter payment Amount\"\n      class=\"payment-reference\"\n      style=\"width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; margin-bottom: 10px;\"\n    />\n    <label class=\"text-light\">Transaction Receipt</label>\n    <input\n      type=\"file\"\n      class=\"receipt-file\"\n      style=\"width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;\"\n      accept=\"image/*, .pdf\"\n    />\n    <button \n      class=\"btn btn-primary w-100 mt-2 pay-button\"\n      style=\"padding: 8px 16px; border-radius: 4px;\"\n    >\n      Pay Now\n    </button>\n  </div>\n</div>\n', '2025-02-18 06:32:56', 1),
(256, 33, 24, '\n<div \n  data-payment-id=\"undefined\" \n  data-amount=\"22\"\n  style=\"border: 1px solid #ccc; border-radius: 8px; padding: 16px; max-width: 300px; margin: 0 auto;\"\n>\n  <div style=\"font-size: 18px; font-weight: bold; text-align: center; margin-bottom: 16px;\">\n    Payment Request: $22\n  </div>\n  <div style=\"text-align: center;\">\n    <img src=\"http://localhost:8081/uploads/qrcode/1739786786969.JPG\" alt=\"QR Code\" style=\"width: 100%; max-width: 200px; height: auto;\" />\n  </div>\n  <div style=\"margin-top: 16px;\">\n    <label class=\"text-light\">Payment Amount</label>\n    <input\n      type=\"text\"\n      placeholder=\"Enter payment Amount\"\n      class=\"payment-reference\"\n      style=\"width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; margin-bottom: 10px;\"\n    />\n    <label class=\"text-light\">Transaction Receipt</label>\n    <input\n      type=\"file\"\n      class=\"receipt-file\"\n      style=\"width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;\"\n      accept=\"image/*, .pdf\"\n    />\n    <button \n      class=\"btn btn-primary w-100 mt-2 pay-button\"\n      style=\"padding: 8px 16px; border-radius: 4px;\"\n    >\n      Pay Now\n    </button>\n  </div>\n</div>\n', '2025-02-18 06:32:56', 1),
(257, 33, 24, '\n      <div class=\"payment-card\">\n        <div class=\"payment-header\">Payment Request: $2</div>\n        <div class=\"qr-code\">\n          <img src=\"http://localhost:8081/uploads/qrcode/1739788522625.JPG\" alt=\"QR Code\" />\n        </div>\n        <div class=\"payment-action\">\n          <button class=\"pay-button\">Pay</button>\n        </div>\n      </div>\n    ', '2025-02-18 06:32:56', 1),
(258, 33, 24, '\n      <div class=\"payment-card\">\n        <div class=\"payment-header\">Payment Request: $44</div>\n        <div class=\"qr-code\">\n          <img src=\"http://localhost:8081/uploads/qrcode/1739788912361.JPG\" alt=\"QR Code\" />\n        </div>\n        <div class=\"payment-action\">\n         <button\n                    className=\"btn btn-primary rounded\"\n                    type=\"button\"\n                    onClick={handleSendMessage}\n                  >\n                    <i className=\"bi bi-send fs-5\" />\n                  </button>\n        </div>\n      </div>\n    ', '2025-02-18 06:32:56', 1),
(259, 33, 24, '\n      <div class=\"payment-card\">\n        <div class=\"payment-header\">Payment Request: $3</div>\n        <div class=\"qr-code\">\n          <img src=\"http://localhost:8081/uploads/qrcode/1739788974067.JPG\" alt=\"QR Code\" />\n        </div>\n        <div class=\"payment-action\">\n        <button\n                            className=\"dropdown-item\"\n                            onClick={() => setIsPaymentModalOpen(true)}\n                          >\n                            Request for payment\n                          </button>\n        </div>\n      </div>\n    ', '2025-02-18 06:32:56', 1),
(260, 33, 24, '\n      <div class=\"payment-card\">\n        <div class=\"payment-header\">Payment Request: $2</div>\n        <div class=\"qr-code\">\n          <img src=\"http://localhost:8081/uploads/qrcode/1739789042726.JPG\" alt=\"QR Code\" />\n        </div>\n        <div class=\"payment-action\">\n          <button onclick={alert(\"hello\")}  class=\"pay-button\">Pay</button>\n        </div>\n      </div>\n    ', '2025-02-18 06:32:56', 1),
(261, 33, 24, '\n      <div class=\"payment-card\">\n        <div class=\"payment-header\">Payment Request: $2</div>\n        <div class=\"qr-code\">\n          <img src=\"http://localhost:8081/uploads/qrcode/1739789173228.JPG\" alt=\"QR Code\" />\n        </div>\n        <div class=\"payment-action\">\n          <button  onClick={() => setIsPaymentModalOpen(true)}  class=\"pay-button\">Pay</button>\n        </div>\n      </div>\n    ', '2025-02-18 06:32:56', 1),
(262, 33, 24, '\n      <div class=\"payment-card\">\n        <div class=\"payment-header\">Payment Request: $4</div>\n        <div class=\"qr-code\">\n          <img src=\"http://localhost:8081/uploads/qrcode/1739789206614.JPG\" alt=\"QR Code\" />\n        </div>\n        <div class=\"payment-action\">\n          <button  onClick={ setIsPaymentModalOpen(true)}  class=\"pay-button\">Pay</button>\n        </div>\n      </div>\n    ', '2025-02-18 06:32:56', 1),
(263, 33, 24, '                          </button>\n', '2025-02-18 06:32:56', 1),
(264, 33, 24, '  <button\n                            className=\"dropdown-item\"\n                            onClick={() => setIsPaymentModalOpen(true)}\n                          >\n                            Request for payment\n                          </button>', '2025-02-18 06:32:56', 1),
(265, 33, 24, '<button>hello</button>', '2025-02-18 06:32:56', 1),
(266, 33, 24, '<script>console.log(\"hello)</script>', '2025-02-18 06:32:56', 1),
(267, 33, 24, '<button onclick=\"setIsPaymentModalOpen(false)\">Click me</button>', '2025-02-18 06:32:56', 1),
(268, 33, 24, '<button onclick=\"isPaymentModalOpen()\">Click me</button>', '2025-02-18 06:32:56', 1),
(269, 33, 24, '<button onclick=\"PaymentModalOpen()\">Click me</button>', '2025-02-18 06:32:56', 1),
(270, 33, 24, '<button\n                            className=\"dropdown-item\"\n                            onClick={() => setIsPaymentModalOpen(true)}\n                          >\n                            Request for payment\n                          </button>', '2025-02-18 06:32:56', 1),
(271, 33, 24, '  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);', '2025-02-18 06:32:56', 1),
(272, 33, 24, '<script>  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);</script>\n\n<button\n                            className=\"dropdown-item\"\n                            onClick={() => setIsPaymentModalOpen(true)}\n                          >\n                            Request for payment\n                          </button>', '2025-02-18 06:32:56', 1),
(273, 33, 24, '<button\n                            className=\"dropdown-item\"\n                            onClick={ setIsPaymentModalOpen(true)}\n                          >\n                            Request for payment\n                          </button>', '2025-02-18 06:32:56', 1),
(274, 33, 24, '<button\n                            className=\"dropdown-item\"\n                            onClick= setIsPaymentModalOpen(true)\n                          >\n                            Request for payment\n                          </button>', '2025-02-18 06:32:56', 1),
(275, 33, 24, '\n      <div class=\"payment-card\">\n        <div class=\"payment-header\">Payment Request: $22</div>\n        <div class=\"qr-code\">\n          <img src=\"http://localhost:8081/uploads/qrcode/1739860013231.JPG\" alt=\"QR Code\" />\n        </div>\n        <div class=\"payment-action\">\n          <button onclick={alert(\"hello\")}  class=\"pay-button\">Pay</button>\n        </div>\n      </div>\n    ', '2025-02-18 06:32:56', 1),
(276, 33, 24, 'hii', '2025-02-18 06:53:59', 1),
(278, 26, 27, '\n    <div class=\"info\">\n  <div class=\"card\" style=\"width: 311px;\">\n    <div class=\"card-body\">\n      <h3 class=\"card-title\">ad</h3>\n      <p><strong>Category:</strong> Helth</p>\n      <p>\n        <strong>Description:</strong> \n        <span id=\"desc-12\">ad</span>\n        \n      </p>\n      <video controls class=\"w-100\">\n                  <source src=\"http://localhost:8081/uploads/pitch/1738167778044.webm\" type=\"video/mp4\" />\n               </video>\n           \n    </div>\n  </div>\n</div>\n<!-- Bootstrap JS (Ensure Bootstrap JS is included for collapse functionality) -->\n<script src=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js\"></script>\n', '2025-02-28 09:08:49', 1),
(280, 26, 27, '\n    <div class=\"info\">\n  <div class=\"card\" style=\"width: 311px;\">\n    <div class=\"card-body\">\n      <h3 class=\"card-title\">adsfafasdas</h3>\n      <p><strong>Category:</strong> Helth</p>\n      <p>\n        <strong>Description:</strong> \n        <span id=\"desc-21\">fasfsf</span>\n        \n      </p>\n      <span class=\"pitchimg1\"><img src=\"http://localhost:8081/uploads/pitch/1740736436500.jfif\" alt=\"Pitch Image\" class=\"img-fluid  mx-auto\" style=\"max-width: 100%; height: auto;\" /></span>\n           \n    </div>\n  </div>\n</div>\n<!-- Bootstrap JS (Ensure Bootstrap JS is included for collapse functionality) -->\n<script src=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js\"></script>\n', '2025-02-28 09:59:45', 1),
(281, 27, 26, '\n      <div class=\"payment-card\">\n        <div class=\"payment-header\">Payment Request: $50000</div>\n        <div class=\"qr-code\">\n          <img src=\"http://localhost:8081/uploads/qrcode/1740738777109.JPG\" alt=\"QR Code\" />\n        </div>\n        <div class=\"payment-action\">\n          <button onclick={alert(\"hello\")}  class=\"pay-button\">Pay</button>\n        </div>\n      </div>\n    ', '2025-02-28 10:35:43', 1),
(282, 27, 26, 'hey', '2025-02-28 10:37:22', 1),
(283, 27, 26, 'hello', '2025-02-28 10:37:29', 1),
(284, 26, 27, 'l=kay re dhaturya', '2025-02-28 10:37:35', 1),
(285, 26, 27, 'sagla chalta', '2025-02-28 10:37:59', 1),
(286, 26, 25, '\n    <div class=\"info\">\n  <div class=\"card\" style=\"width: 311px;\">\n    <div class=\"card-body\">\n      <h3 class=\"card-title\">Video</h3>\n      <p><strong>Category:</strong> Medical</p>\n      <p>\n        <strong>Description:</strong> \n        <span id=\"desc-11\">csaknask snksad</span>\n        \n      </p>\n      <video controls class=\"w-100\">\n                  <source src=\"http://localhost:8081/uploads/pitch/1738142978512.webm\" type=\"video/mp4\" />\n               </video>\n           \n    </div>\n  </div>\n</div>\n<!-- Bootstrap JS (Ensure Bootstrap JS is included for collapse functionality) -->\n<script src=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js\"></script>\n', '2025-03-01 06:10:13', 1),
(287, 25, 26, 'i want to know about this pitch', '2025-03-01 08:15:25', 1),
(288, 24, 25, '\n    <div class=\"info\">\n  <div class=\"card\" style=\"width: 311px;\">\n    <div class=\"card-body\">\n      <h3 class=\"card-title\">First Pitch</h3>\n      <p><strong>Category:</strong> Helth</p>\n      <p>\n        <strong>Description:</strong> \n        <span id=\"desc-9\">ohn Doe	A report on project almanac - Lorem ipsum dolor sit amet adipisicing elit...		8 mins ago\n\nJo</span>\n        \n          <span id=\"collapse-9\" class=\"collapse\">hn Doe	A report on some good project - Lorem ipsum dolor sit amet adipisicing elit...		15 mins ago\n\nJohn Doe	A report on project almanac - Lorem ipsum dolor sit amet adipisicing elit...		30 mins ago\n\nJohn Doe	A report on project almanac - Lorem ipsum dolor sit amet adipisicing elit...		25 December\n\nJohn Doe	A report on project almanac - Lorem ipsum dolor sit amet adipisicing elit...		20 December\n\nJohn Doe	A report on project almanac - Lorem ipsum dolor sit amet adipisicing elit...		20 December\n\nJohn Doe	A report on project almanac - Lorem ipsum dolor sit amet adipisicing elit...		20 December\n\nJohn Doe	A report on project almanac - Lorem ipsum dolor sit amet adipisicing elit...		20 December\n</span>\n          <button class=\"btn btn-link p-0\" data-bs-toggle=\"collapse\" data-bs-target=\"#collapse-9\">\n            Read More\n          </button>\n        \n      </p>\n      <span class=\"pitchimg1\"><img src=\"http://localhost:8081/uploads/pitch/1737614266088.jpg\" alt=\"Pitch Image\" class=\"img-fluid  mx-auto\" style=\"max-width: 100%; height: auto;\" /></span>\n           \n    </div>\n  </div>\n</div>\n<!-- Bootstrap JS (Ensure Bootstrap JS is included for collapse functionality) -->\n<script src=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js\"></script>\n', '2025-03-01 08:14:29', 1),
(289, 24, 25, '\n    <div class=\"info\">\n  <div class=\"card\" style=\"width: 311px;\">\n    <div class=\"card-body\">\n      <h3 class=\"card-title\">Video</h3>\n      <p><strong>Category:</strong> Medical</p>\n      <p>\n        <strong>Description:</strong> \n        <span id=\"desc-11\">csaknask snksad</span>\n        \n      </p>\n      <video controls class=\"w-100\">\n                  <source src=\"http://localhost:8081/uploads/pitch/1738142978512.webm\" type=\"video/mp4\" />\n               </video>\n           \n    </div>\n  </div>\n</div>\n<!-- Bootstrap JS (Ensure Bootstrap JS is included for collapse functionality) -->\n<script src=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js\"></script>\n', '2025-03-01 08:14:29', 1),
(290, 24, 27, '\n    <div class=\"info\">\n  <div class=\"card\" style=\"width: 311px;\">\n    <div class=\"card-body\">\n      <h3 class=\"card-title\">ad</h3>\n      <p><strong>Category:</strong> Helth</p>\n      <p>\n        <strong>Description:</strong> \n        <span id=\"desc-12\">ad</span>\n        \n      </p>\n      <video controls class=\"w-100\">\n                  <source src=\"http://localhost:8081/uploads/pitch/1738167778044.webm\" type=\"video/mp4\" />\n               </video>\n           \n    </div>\n  </div>\n</div>\n<!-- Bootstrap JS (Ensure Bootstrap JS is included for collapse functionality) -->\n<script src=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js\"></script>\n', '2025-03-01 06:56:55', 0),
(291, 24, 25, '\n    <div class=\"info\">\n  <div class=\"card\" style=\"width: 311px;\">\n    <div class=\"card-body\">\n      <h3 class=\"card-title\">First Pitch</h3>\n      <p><strong>Category:</strong> Helth</p>\n      <p>\n        <strong>Description:</strong> \n        <span id=\"desc-9\">ohn Doe	A report on project almanac - Lorem ipsum dolor sit amet adipisicing elit...		8 mins ago\n\nJo</span>\n        \n          <span id=\"collapse-9\" class=\"collapse\">hn Doe	A report on some good project - Lorem ipsum dolor sit amet adipisicing elit...		15 mins ago\n\nJohn Doe	A report on project almanac - Lorem ipsum dolor sit amet adipisicing elit...		30 mins ago\n\nJohn Doe	A report on project almanac - Lorem ipsum dolor sit amet adipisicing elit...		25 December\n\nJohn Doe	A report on project almanac - Lorem ipsum dolor sit amet adipisicing elit...		20 December\n\nJohn Doe	A report on project almanac - Lorem ipsum dolor sit amet adipisicing elit...		20 December\n\nJohn Doe	A report on project almanac - Lorem ipsum dolor sit amet adipisicing elit...		20 December\n\nJohn Doe	A report on project almanac - Lorem ipsum dolor sit amet adipisicing elit...		20 December\n</span>\n          <button class=\"btn btn-link p-0\" data-bs-toggle=\"collapse\" data-bs-target=\"#collapse-9\">\n            Read More\n          </button>\n        \n      </p>\n      <span class=\"pitchimg1\"><img src=\"http://localhost:8081/uploads/pitch/1737614266088.jpg\" alt=\"Pitch Image\" class=\"img-fluid  mx-auto\" style=\"max-width: 100%; height: auto;\" /></span>\n           \n    </div>\n  </div>\n</div>\n<!-- Bootstrap JS (Ensure Bootstrap JS is included for collapse functionality) -->\n<script src=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js\"></script>\n', '2025-03-01 08:14:29', 1),
(292, 25, 26, '\n            \n\n      <link href=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css\" rel=\"stylesheet\">\n\n      <div class=\"card border-secondary shadow-sm rounded-1\" style=\"width: fit-content; background-color: #f9f9f9; border-color: #ddd !important;\">\n        <div class=\"card-body p-3\">\n          <h5 class=\"card-title mb-3 text-dark\">Appointment Request</h5>\n          <p class=\"card-text mb-2\"><strong>Date:</strong> March 2, 2025</p>\n          <p class=\"card-text mb-2\"><strong>Time:</strong> 12:42 PM</p>\n          <p class=\"card-text mb-2\"><strong>Location:</strong> shirdi\n</p>\n          <p class=\"card-text mb-0\">Status: <span class=\"text-warning fw-bold\">Pending</span></p>\n        </div>\n      </div>\n\n      <script src=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js\"></script>\n      ', '2025-03-01 08:15:25', 1),
(293, 25, 24, '\n            \n\n      <link href=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css\" rel=\"stylesheet\">\n\n      <div class=\"card border-secondary shadow-sm rounded-1\" style=\"width: fit-content; background-color: #f9f9f9; border-color: #ddd !important;\">\n        <div class=\"card-body p-3\">\n          <h5 class=\"card-title mb-3 text-dark\">Appointment </h5>\n          <p class=\"card-text mb-2\"><strong>Date:</strong> March 4, 2025</p>\n          <p class=\"card-text mb-2\"><strong>Time:</strong> 02:42 PM</p>\n          <p class=\"card-text mb-2\"><strong>Location:</strong> rgerg</p>\n          \n        </div>\n      </div>\n\n      <script src=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js\"></script>\n      ', '2025-03-01 10:06:09', 1),
(294, 34, 25, '\n    <div class=\"info\">\n  <div class=\"card\" style=\"width: 311px;\">\n    <div class=\"card-body\">\n      <h3 class=\"card-title\">Video</h3>\n      <p><strong>Category:</strong> Medical</p>\n      <p>\n        <strong>Description:</strong> \n        <span id=\"desc-11\">csaknask snksad</span>\n        \n      </p>\n      <video controls class=\"w-100\">\n                  <source src=\"http://localhost:8081/uploads/pitch/1738142978512.webm\" type=\"video/mp4\" />\n               </video>\n           \n    </div>\n  </div>\n</div>\n<!-- Bootstrap JS (Ensure Bootstrap JS is included for collapse functionality) -->\n<script src=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js\"></script>\n', '2025-03-01 09:51:21', 1),
(295, 25, 34, 'hello Pranav', '2025-03-01 09:51:28', 1),
(296, 25, 34, 'saf', '2025-03-01 09:51:41', 1),
(297, 25, 34, '\n            \n\n      <link href=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css\" rel=\"stylesheet\">\n\n      <div class=\"card border-secondary shadow-sm rounded-1\" style=\"width: fit-content; background-color: #f9f9f9; border-color: #ddd !important;\">\n        <div class=\"card-body p-3\">\n          <h5 class=\"card-title mb-3 text-dark\">Appointment </h5>\n          <p class=\"card-text mb-2\"><strong>Date:</strong> March 1, 2025</p>\n          <p class=\"card-text mb-2\"><strong>Time:</strong> 03:24 PM</p>\n          <p class=\"card-text mb-2\"><strong>Location:</strong> wioerhwaher\n\n</p>\n          \n        </div>\n      </div>\n\n      <script src=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js\"></script>\n      ', '2025-03-01 09:54:16', 0);

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` int(11) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `sender_id` int(11) NOT NULL,
  `receiver_id` int(11) NOT NULL,
  `qr_code_url` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `Recipt` varchar(255) NOT NULL,
  `Paid` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`id`, `amount`, `sender_id`, `receiver_id`, `qr_code_url`, `created_at`, `Recipt`, `Paid`) VALUES
(33, 2.00, 33, 24, '/uploads/qrcode/1739780346466.JPG', '2025-02-17 08:19:06', '', 0),
(34, 2.00, 33, 24, '/uploads/qrcode/1739786506968.JPG', '2025-02-17 10:01:46', '', 0),
(35, 22.00, 33, 24, '/uploads/qrcode/1739786681076.JPG', '2025-02-17 10:04:41', '', 0),
(36, 2.00, 33, 24, '/uploads/qrcode/1739786745787.JPG', '2025-02-17 10:05:45', '', 0),
(37, 22.00, 33, 24, '/uploads/qrcode/1739786786969.JPG', '2025-02-17 10:06:26', '', 0),
(38, 2.00, 33, 24, '/uploads/qrcode/1739788522625.JPG', '2025-02-17 10:35:22', '', 0),
(39, 44.00, 33, 24, '/uploads/qrcode/1739788912361.JPG', '2025-02-17 10:41:52', '', 0),
(40, 3.00, 33, 24, '/uploads/qrcode/1739788974067.JPG', '2025-02-17 10:42:54', '', 0),
(41, 2.00, 33, 24, '/uploads/qrcode/1739789042726.JPG', '2025-02-17 10:44:02', '', 0),
(42, 2.00, 33, 24, '/uploads/qrcode/1739789173228.JPG', '2025-02-17 10:46:13', '', 0),
(43, 4.00, 33, 24, '/uploads/qrcode/1739789206614.JPG', '2025-02-17 10:46:46', '', 0),
(46, 50000.00, 27, 26, '/uploads/qrcode/1740738777109.JPG', '2025-02-28 10:32:57', '', 0);

-- --------------------------------------------------------

--
-- Table structure for table `pitch`
--

CREATE TABLE `pitch` (
  `id` int(11) NOT NULL,
  `pitch_title` varchar(60) NOT NULL,
  `description` varchar(1000) NOT NULL,
  `category` varchar(50) NOT NULL,
  `userid` varchar(1000) NOT NULL,
  `Accept` varchar(1000) DEFAULT NULL,
  `Reject` varchar(1000) NOT NULL,
  `File` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pitch`
--

INSERT INTO `pitch` (`id`, `pitch_title`, `description`, `category`, `userid`, `Accept`, `Reject`, `File`) VALUES
(9, 'First Pitch', 'ohn Doe	A report on project almanac - Lorem ipsum dolor sit amet adipisicing elit...		8 mins ago\n\nJohn Doe	A report on some good project - Lorem ipsum dolor sit amet adipisicing elit...		15 mins ago\n\nJohn Doe	A report on project almanac - Lorem ipsum dolor sit amet adipisicing elit...		30 mins ago\n\nJohn Doe	A report on project almanac - Lorem ipsum dolor sit amet adipisicing elit...		25 December\n\nJohn Doe	A report on project almanac - Lorem ipsum dolor sit amet adipisicing elit...		20 December\n\nJohn Doe	A report on project almanac - Lorem ipsum dolor sit amet adipisicing elit...		20 December\n\nJohn Doe	A report on project almanac - Lorem ipsum dolor sit amet adipisicing elit...		20 December\n\nJohn Doe	A report on project almanac - Lorem ipsum dolor sit amet adipisicing elit...		20 December\n', 'Helth', '25', '24', '', 'uploads/pitch/1737614266088.jpg'),
(11, 'Video', 'csaknask snksad', 'Medical', '25', '34', '', 'uploads/pitch/1738142978512.webm'),
(12, 'ad', 'ad', 'Helth', '27', '', '', 'uploads/pitch/1738167778044.webm'),
(14, 'helthcare ', 'nkasmdma d', 'Helth', '30', NULL, '', 'uploads/pitch/1738227357609.png'),
(15, 'aasdadasdsasd', 'aadsd', 'Medical', '30', NULL, '', 'uploads/pitch/1738227398363.webm'),
(17, 'adada', 'adsadad', 'Technology', '25', '', '24', 'uploads/pitch/1739210941833.jpg'),
(18, 'sasfa', 'afaf', 'Medical', '25', '', '', 'uploads/pitch/1739210972754.jpg'),
(20, 'anjalibuisness', 'askdjfbkfbjhbsaj', 'Sports', '33', '24', '', 'uploads/pitch/1739250041415.mp4'),
(21, 'adsfafasdas', 'fasfsf', 'Helth', '27', '26', '', 'uploads/pitch/1740736436500.jfif');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `ProfileImg` varchar(255) NOT NULL,
  `Username` varchar(255) NOT NULL,
  `fname` varchar(50) NOT NULL,
  `mname` varchar(50) NOT NULL,
  `lname` varchar(50) NOT NULL,
  `Phone` int(12) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(10) NOT NULL,
  `role` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `ProfileImg`, `Username`, `fname`, `mname`, `lname`, `Phone`, `email`, `password`, `role`) VALUES
(1, '', 'admin', 'Admin', 'admin2', 'admin3', 0, 'admin@gmail.com', 'admin@1234', 'admin'),
(24, '/uploads/Profile/1737614118531.jpg', 'Pranav_01', 'Pranav', 'Pravin', 'Pagare', 0, 'Pranav01@gmail.com', 'Pranav', 'Investor'),
(25, '/uploads/Profile/1737614165159.jpg', 'Pranav_02', 'Pranav', 'Pravin', 'Pagare', 0, 'Pranav02@gmail.com', 'Pranav', 'InvestorSeaker'),
(26, '/uploads/Profile/1738148102036.jpg', 'Yash_01', 'Yash', 'Sudam', 'Bhandare', 0, 'Yash@gmail.com', 'Yash', 'Investor'),
(27, '/uploads/Profile/1738162532752.JPG', 'Puja_01', 'Puja ', 'Pravin', 'Pagare', 0, 'Puja@gmail.com', 'Puja', 'InvestorSeaker'),
(28, '/uploads/Profile/1738223951803.png', 'Rokey_01', 'Rokey ', 'Fulchand', 'Bharti', 0, 'Rokey01@gmail.com', 'Rokey', 'Investor'),
(29, '/uploads/Profile/1738226834273.png', 'Samartha_01', 'Samartha', 'Sandip', 'Bhamare', 0, 'Samartha01@gmail.com', 'Samartha', 'Investor'),
(32, '/uploads/Profile/1738780058163.webp', 'pppp', 'pranjal', 'uday', 'barve', 2147483647, 'P@gmail.com', 'pp', 'Investor'),
(33, '/uploads/Profile/1739249832312.webp', 'Anjali_91', 'Anjali', 'Rajendra', 'tajne', 2147483647, 'Anjali@gmail.com', 'Anjali@123', 'InvestorSeaker'),
(34, '/uploads/Profile/1740822604031.webp', 'Tejas_01', 'Tejas', 'fkjsdabf', 'Gaikwad', 1123354655, 'Tejas@gmail.com', 'Tejas', 'Investor');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `appointments`
--
ALTER TABLE `appointments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `message`
--
ALTER TABLE `message`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pitch`
--
ALTER TABLE `pitch`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `appointments`
--
ALTER TABLE `appointments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `message`
--
ALTER TABLE `message`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=298;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- AUTO_INCREMENT for table `pitch`
--
ALTER TABLE `pitch`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

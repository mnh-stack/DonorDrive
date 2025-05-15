CREATE DATABASE IF NOT EXISTS donordrive;
USE donordrive;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  user_type ENUM('individual', 'organization') NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  verification_token VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  bio TEXT,
  contact VARCHAR(255) DEFAULT '',
  photo_url VARCHAR(255) DEFAULT '',
  visibility ENUM('public', 'private') DEFAULT 'public',
  verification_status ENUM('unverified', 'pending', 'verified', 'rejected') DEFAULT 'unverified'
); 

CREATE TABLE IF NOT EXISTS org_verification (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  document_path VARCHAR(255) NOT NULL,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reviewed_at TIMESTAMP NULL,
  reviewer_id INT DEFAULT NULL,
  review_notes TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS campaigns (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  goal_amount DECIMAL(12,2) NOT NULL,
  end_date DATE NOT NULL,
  category VARCHAR(100) NOT NULL,
  image_path VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS campaign_versions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  campaign_id INT NOT NULL,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  goal_amount DECIMAL(12,2) NOT NULL,
  end_date DATE NOT NULL,
  category VARCHAR(100) NOT NULL,
  image_path VARCHAR(255),
  version_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (campaign_id) REFERENCES campaigns(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS owners (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL
);

select * from users;
select * from org_verification;
SELECT * FROM users WHERE user_type = 'organization';
USE donordrive;
SHOW TABLES;
DESCRIBE users;
DESCRIBE org_verification;
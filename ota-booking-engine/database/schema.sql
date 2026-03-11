CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100),
  password TEXT,
  role VARCHAR(20)
);

CREATE TABLE hotels (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200),
  city VARCHAR(100),
  description TEXT,
  rating FLOAT
);

CREATE TABLE rooms (
  id SERIAL PRIMARY KEY,
  hotel_id INT,
  room_name VARCHAR(100),
  price INT,
  capacity INT,
  stock INT
);

CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  user_id INT,
  room_id INT,
  checkin DATE,
  checkout DATE,
  total_price INT,
  status VARCHAR(50)
);

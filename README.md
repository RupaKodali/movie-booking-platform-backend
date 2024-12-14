# Movie Ticket Booking Platform Backend

This backend serves as the API for a movie ticket booking platform. It handles theaters, movies, shows, bookings, and users, allowing users to browse theaters, view available movies and shows, and make bookings.

## Table of Contents

- [Movie Ticket Booking Platform Backend](#movie-ticket-booking-platform-backend)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Tech Stack](#tech-stack)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [📅 License](#-license)
  - [📥 Frontend Repository](#-frontend-repository)
  - [💬 Feedback](#-feedback)

---

## Features

- **Theater Search**: Users can search for theaters by name or location.
- **Movie Search**: Users can search for movies by title.
- **Show Details**: View available shows for movies in specific theaters.
- **Booking**: Make a booking for a show.
- **User Management**: Manage user details and authentication.
- **Payment Integration**: Handle payments for bookings.

## Tech Stack

- **Node.js** with **Express.js**: Web framework for the server.
- **MySQL**: Database for storing data.
- **Sequelize ORM**: Object-Relational Mapping for interacting with the database.
- **JWT Authentication**: Used for securing user authentication.
- **Multer**: For handling file uploads (if needed for media).
- **dotenv**: For environment variable management.

## Getting Started

### Prerequisites

Before you can run this project, ensure you have the following installed:

- **Node.js** (v14+)
- **MySQL** (or any supported SQL database)
- **npm** (or **yarn**)

## Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/RupaKodali/movie-booking-platform-backend
   cd movie-booking-platform-backend
   ```

2. Install dependencies:

  ```bash  
    npm install
    ```
3. Set up environment variables:  
   Copy the `.env_sample` to `.env` and configure the necessary values:  
   ```env  
    DB_HOST=dbhost
    ```  

4. Start the development server:  

    After setting up the environment variables, start the server using:

    ```bash  
        npm start
    ```

5. Access the API: The backend server will run on <http://localhost:8000>. You can use tools like Postman or CURL to interact with the API endpoints.

---

## ✅ Environment Variables

Create a `.env` file in the root directory and configure the following variables:  

```env  
DB_HOST=dbhost
DB_USER=username
DB_PASSWORD=password
DB_NAME=database
PORT=port_number
JWT_SECRET=JWT_SECRET
PAYPAL_CLIENT_ID=PAYPAL_CLIENT_ID
PAYPAL_SECRET=PAYPAL_SECRET
```  

---

## 📅 License  

This project is licensed under the MIT License.  

---

## 📥 Frontend Repository  

The frontend services for this application can be found [here](https://github.com/RupaKodali/movie-booking-platform-frontend).  

---

## 💬 Feedback

We welcome contributions and suggestions! If you'd like to report a bug or suggest an improvement, please create an issue or submit a pull request.  

# Trashly

Welcome to Trashly ! This repository contains the codebase for a comprehensive web application designed to facilitate efficient waste collection, recycling transactions, and user engagement through various features. The platform aims to promote environmental stewardship and sustainable practices by making waste management processes more accessible and user-friendly.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## Features

- **User Registration and Authentication**: Secure user registration and login system with Passport.js for Users, Traders, and Admins.
- **Waste Collection Scheduling**: Users can schedule waste pickups, upload images of waste, and specify pickup details.
- **Recycling Transactions**: Traders can manage recycling transactions, including accepting or rejecting waste assignments.
- **Event Management**: Admins can create and manage events such as waste drives. Users can register for these events.
- **User Dashboard**: Users can view their profiles, track their waste submissions, and monitor event registrations.
- **Admin Dashboard**: Admins can oversee all users, traders, orders, waste products, recycled products, and complaints.
- **RESTful API Integration**: Efficient data management through RESTful APIs for seamless backend operations.
- **Notification System**: Real-time notifications for transaction updates and event reminders.

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript, Bootstrap, EJS
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Authentication**: Passport.js
- **APIs**: Twilio for SMS notifications

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/waste-management-system.git
   cd waste-management-system
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory and add the following variables:
   ```
   DATABASE_URL=your_mongodb_connection_string
   TWILIO_ACCOUNT_SID=your_twilio_account_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   TWILIO_PHONE_NUMBER=your_twilio_phone_number
   ```

4. **Run the application**:
   ```bash
   npm start
   ```

5. **Access the application**:
   Open your web browser and navigate to `http://localhost:3000`.

## Usage

- **User Registration**: Sign up as a User, Trader, or Admin.
- **Waste Collection**: Users can upload images and schedule waste pickups.
- **Recycling Management**: Traders can manage waste assignments and update statuses.
- **Event Participation**: Users can register for upcoming waste drives and events.
- **Admin Control**: Admins can manage users, traders, orders, products, and complaints through the dashboard.

## API Documentation

The application provides a set of RESTful APIs for managing data. Below are some of the key endpoints:

- **User Registration**: `POST /user/register`
- **User Login**: `POST /user/login`
- **Create Waste Product**: `POST /wasteproducts`
- **Get All Waste Products**: `GET /wasteproducts`
- **Create Event**: `POST /events`
- **Register for Event**: `POST /events/:id/register`

For detailed API documentation, refer to the [API Documentation](docs/api.md).

## Contributing

Contributions are welcome! Please fork this repository and submit pull requests for any features, bug fixes, or enhancements.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a pull request

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.

---

Thank you for your interest in the Waste Management System project. We hope this platform contributes to a cleaner and more sustainable environment. If you have any questions or suggestions, feel free to open an issue or contact the project maintainers.

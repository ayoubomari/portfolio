## Overview

Lahagni addresses the transportation challenges in Southern Morocco by providing a digital solution that connects passengers with drivers. The platform solves several key problems:

- Limited accessibility to reliable transportation services
- Lack of standardized pricing for inter-city travel
- Difficulty in finding a taxi driver during off-peak hours
- Need for transparent and secure payment systems
- A ride-sharing system that works well for both taxi driveenrs and auto-entrepreneur
- simplifeid VAT for auto-entrepreneur

## Key Features

### Application Features:

- Real-time ride tracking and matching
- Multi-language support (Arabic, French, Spanish)
- Secure payment integration with multiple options
- Rating and review system
- Push notifications
- Emergency support system

### Dashboard Features:

- Real-time analytics and reporting
- User management and verification
- Dynamic pricing control
- Multi-language support (English, Arabic, French, Spanish)
- Revenue tracking
- Ansering users quesiton

## User Types and Interfaces

### 1. Passengers (Mobile App)

![Full service](/uploads/projects-images/1736541505192-Full%20service.webp)
![Looking for drivers](/uploads/projects-images/1736541959879-Looking%20for%20drivers.webp)
![chat](/uploads/projects-images/1736541505192-chat.webp)

- Ride booking interface
- Real-time tracking
- Drivers listing
- Trip history
- Profile management

### 2. Drivers (Mobile App)

![Wallet](/uploads/projects-images/1736541700633-Wallet.webp)

- Ride request management
- Earnings dashboard
- Navigation interface
- Status toggle
- Document and profile management

### 3. Administrators (Web Dashboard)

- User management
- Analytics overview
- Payment monitoring
- Service area control
- Support ticket management

## Application Flow

1. Ride Request: The user posts a ride request through the app, specifying their pickup location and destination.
2. Proposal Creation: Interested drivers create and submit proposals for the ride.
3. Proposal Display: The system displays the proposals to the user for review.
4. Proposal Acceptance: The user selects and accepts a proposal from the available options.
5. Ride Confirmation: The system confirms the ride with the selected driver.
6. Ride Initiation: The driver starts the ride and updates the system.
7. Ride Completion: Once the ride is completed, the driver marks it as finished in the app.
8. Payment Processing: If the driver has sufficient funds in their wallet, the platform will cut the fees.
9. Review Submission: The users (driver and rider) submits a review for the other user with a comment.

## Technology Stack

### Backend:

- Golang with Fiber framework
- PostgreSQL for primary database
- Redis for caching
- WebSocket for real-time communications

### Frontend:

- NextJS for web dashboard
- React Native for mobile apps

### DevOps & Tools:

- Docker for containerization
- Grafana for monitoring
- Go fmt for code formatting
- nilaway, golangci-lint and gocritic for code quality and **NullPointerExceptions**
- Golang test library for unit tests
- govulncheck for audit

## API Documentation

- Swagger integration for API documentation
- WebSocket endpoints for real-time features

## Cron Jobs

- Monthly payment processing
- Automated driver document expiration checks
- Driver's badges update
- Services expiration date
- Periodic backup scheduling

## Summary and Future Features

Lahagni is a ride-sharing platform addressing transportation challenges in Southern Morocco by connecting passengers with drivers. It offers real-time tracking, secure payments, and multi-language support, benefiting both drivers and passengers. Built with Golang, PostgreSQL, and React Native, the platform plans future features like fraud detection and a loyalty system.
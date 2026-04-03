# Personal Finance Tracker

A modern, full-stack web application designed to help users track their income and expenses, visualize financial trends, and manage their budget effectively.

![Main dashboard view](screenshot.png)

## Tech Stack

### Backend
- Java 17
- Spring Boot 3
- Spring Data JPA (Hibernate)
- PostgreSQL (Production-ready database)
- Maven (Dependency management)

### Frontend
- Angular 17+
- TypeScript
- Chart.js & ng2-charts (Data visualization)
- Reactive Forms (Input validation)
- CSS3 (Custom modern dashboard UI)

### Infrastructure
- Docker & Docker Compose (Full-stack orchestration)

## Key Features

- Full CRUD Operations: Add, view, edit, and delete transactions.
- Dynamic Balance: Real-time balance calculation based on your history.
- Financial Visualization:
  - Pie Charts: Breakdown of expenses and income by category.
  - Bar Charts: Cash flow trends with Monthly, Quarterly, and Yearly views.
- Advanced Filtering: Filter transactions by type (Income/Expense) to drill down into data.
- Responsive Design: Modern dashboard optimized for different screen sizes.
- Fully Containerized: The entire application (database, backend, frontend) runs in isolated Docker containers.

## Getting Started

### Prerequisites
- Git
- Docker Desktop

### Installation and Setup

1. Clone the repository
   ```bash
   git clone https://github.com/MarcinTyszka/personal-finance-tracker.git
   cd personal-finance-tracker
   ```
2. Build and run the application
In the root directory, run the following command to build the images and start all containers in the background:
    ```bash
    docker-compose up --build -d
   ```
3. Access the App
Open your browser and navigate to http://localhost:4200
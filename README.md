
## 🚀 Live Demo

**Live Application:** https://studenthub-tu6p.onrender.com

## 💻 Source Code

**GitHub Repository:** https://github.com/CharanReddy16474/StudentHub

# StudentHub — Student Management Portal

StudentHub is a full-stack student portal built using Java, Spring Boot, MySQL, HTML, CSS, and JavaScript. It allows students to register, securely log in, manage their profiles, change passwords, and manage their course enrollments through a simple, responsive interface.

## Project Overview

StudentHub provides students with a centralized place to view their academic information, update permitted profile details, and manage courses.

The application uses Spring Boot for backend services, Spring Security for authentication and session management, and MySQL for persistent data storage.

## Features

- **Student Registration:** Register a student account with personal and academic details.
- **Secure Login and Logout:** Authenticate users and manage authenticated sessions using Spring Security.
- **Student Dashboard:** Display the student's name, student number, department, semester, and enrolled-course count.
- **Personalized Welcome Banner:** Display a personalized greeting and a study-themed background image.
- **Profile Management:** View profile details and update the student's name and phone number.
- **Reset Profile Form:** Restore the most recently saved profile information in the edit form.
- **Password Management:** Change the password after verifying the current password.
- **Password Hashing:** Store passwords as BCrypt hashes rather than plain text.
- **Course Management:** View available courses and currently enrolled courses.
- **Course Enrollment:** Enroll in available courses and re-enroll after withdrawal.
- **Course Withdrawal:** Withdraw from an enrolled course while retaining its enrollment record.
- **Sticky Navigation:** Keep the sidebar visible while scrolling on desktop and provide sticky navigation on smaller screens.
- **Session Security:** Protect student pages and authenticated API endpoints.
- **CSRF Protection:** Protect state-changing requests using Spring Security's CSRF mechanism.

## Technologies Used

### Frontend
- HTML5
- CSS3
- JavaScript

### Backend
- Java 21
- Spring Boot
- Spring Web
- Spring Security
- Spring Data JPA
- Hibernate ORM
- Maven

### Database
- MySQL
- MySQL Connector/J

### Development Tools
- Eclipse IDE
- MySQL Workbench or MySQL command-line client
- Google Chrome
- Postman (optional, for API testing)

## Application Architecture

StudentHub follows a layered MVC-style backend design.

```text
StudentHub
|
|-- Frontend
|   |-- HTML pages
|   |-- CSS stylesheets
|   |-- JavaScript files
|
|-- Spring Boot Backend
|   |-- Controllers
|   |-- Services
|   |-- Repositories
|   |-- Models / Entities
|   |-- DTOs
|   |-- Security Configuration
|
|-- MySQL Database
    |-- users
    |-- student_profiles
    |-- courses
    |-- enrollments
```

### Architecture Responsibilities

- **Controllers:** Handle HTTP requests and return responses.
- **Services:** Implement business logic for authentication, profiles, dashboard information, and courses.
- **Repositories:** Access and manage database records using Spring Data JPA.
- **Models / Entities:** Represent database tables.
- **DTOs:** Transfer request and response data between the frontend and backend.
- **Spring Security:** Handle authentication, authorization, session management, password verification, and CSRF protection.

## Database Design

The application uses four primary tables.

| Table | Purpose |
|---|---|
| `users` | Stores account email addresses and password hashes. |
| `student_profiles` | Stores student numbers, names, contact information, department, and semester. |
| `courses` | Stores course details, credits, and active status. |
| `enrollments` | Tracks student course enrollments and withdrawal status. |

### Relationships

- A user has one student profile.
- Each student profile belongs to a user account.
- A student can enroll in multiple courses.
- A course can have multiple student enrollments.
- A student can have only one enrollment record per course; withdrawing changes the enrollment status rather than deleting the record.

## Prerequisites

Before running StudentHub, install and configure:

1. Java Development Kit (JDK) 21.
2. Eclipse IDE with Java support.
3. MySQL Server.
4. Maven, or use the Maven Wrapper included in the project if present.

## Database Setup

Open MySQL Workbench or your MySQL client and execute the following SQL script.

```sql
CREATE DATABASE IF NOT EXISTS studenthub_db;
USE studenthub_db;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(254) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS student_profiles (
    user_id INT PRIMARY KEY,
    student_number VARCHAR(30) NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    department VARCHAR(100) NOT NULL,
    semester TINYINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,
    CHECK (semester BETWEEN 1 AND 12),
    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_code VARCHAR(20) NOT NULL UNIQUE,
    course_name VARCHAR(150) NOT NULL,
    description TEXT,
    credits TINYINT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,
    CHECK (credits BETWEEN 1 AND 10)
);

CREATE TABLE IF NOT EXISTS enrollments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_user_id INT NOT NULL,
    course_id INT NOT NULL,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) NOT NULL DEFAULT 'ENROLLED',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE (student_user_id, course_id),
    CHECK (status IN ('ENROLLED', 'WITHDRAWN')),
    FOREIGN KEY (student_user_id)
        REFERENCES student_profiles(user_id)
        ON DELETE CASCADE,
    FOREIGN KEY (course_id)
        REFERENCES courses(id)
        ON DELETE RESTRICT
);

INSERT IGNORE INTO courses
    (course_code, course_name, description, credits)
VALUES
    ('JAVA101', 'Core Java',
     'Java programming fundamentals', 4),
    ('SQL101', 'SQL and Database',
     'SQL queries and database concepts', 3),
    ('WEB101', 'Web Development',
     'HTML, CSS and JavaScript', 4),
    ('SPRING101', 'Spring Boot',
     'Backend development using Spring Boot', 4);
```

**Important:** This SQL uses `CREATE TABLE IF NOT EXISTS`, so it does not recreate existing tables. The course statements use `INSERT IGNORE` to avoid duplicate course-code entries.

The application configuration uses `spring.jpa.hibernate.ddl-auto=none`, so the required database tables must exist before the application runs.

## Configuration

Open:

`src/main/resources/application.properties`

Configure the database connection using environment variables.

```properties
spring.application.name=studenthub

spring.datasource.url=${DB_URL:jdbc:mysql://localhost:3306/studenthub_db}
spring.datasource.username=${DB_USERNAME:root}
spring.datasource.password=${DB_PASSWORD:}
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.hibernate.ddl-auto=none
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.open-in-view=false

server.port=8080
```

### Environment Variables

Configure these variables in your local environment or deployment platform:

| Variable | Example value |
|---|---|
| `DB_URL` | `jdbc:mysql://localhost:3306/studenthub_db` |
| `DB_USERNAME` | Your MySQL username |
| `DB_PASSWORD` | Your MySQL password |

Do not put your actual database password in this README, source control, or any public repository.

The default configuration values are intended for local development. Use suitable credentials and a dedicated database account for production.

## Running the Application in Eclipse

1. Clone or import the project into Eclipse as an existing Maven project.
2. Make sure the required database exists in MySQL.
3. Configure the database environment variables.
4. Allow Maven to download the project's dependencies.
5. Locate `StudenthubApplication.java` in the main Java package.
6. Right-click the file and select **Run As → Java Application**.
7. Wait for the successful Spring Boot startup message in the Console.

Open the following URL in your browser:

```text
http://localhost:8080/
```

The login page can be accessed at:

```text
http://localhost:8080/login.html
```

Register a student account if you do not already have one, then log in to access the dashboard.

## Running with Maven

From the project root, use:

```bash
mvn spring-boot:run
```

On Windows, if the Maven Wrapper is included, you can use:

```bat
mvnw.cmd spring-boot:run
```

Configure the required database environment variables before starting the application.

## Main Application Pages

| Page | Purpose |
|---|---|
| `/` | Application landing page |
| `/register.html` | Student registration |
| `/login.html` | Student login |
| `/dashboard.html` | Student dashboard |
| `/profile.html` | Profile management, password changes, and course management |

## Main API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Register a student |
| GET | `/api/auth/csrf` | Obtain a CSRF token |
| GET | `/api/dashboard` | Retrieve authenticated student's dashboard data |
| GET | `/api/profile` | Retrieve the authenticated student's profile |
| PUT | `/api/profile` | Update permitted profile fields |
| POST | `/api/profile/change-password` | Change the account password |
| GET | `/api/courses` | List active courses and enrollment status |
| GET | `/api/courses/mine` | List currently enrolled courses |
| POST | `/api/courses/{courseId}/enroll` | Enroll in a course |
| POST | `/api/courses/{courseId}/withdraw` | Withdraw from a course |

Protected requests require an authenticated session. State-changing requests must also satisfy CSRF protection where applicable.

## Testing Checklist

The following features have been tested in the local development environment:

- Student registration and login.
- Dashboard loading and personalized student information.
- Profile loading, editing, and resetting.
- Password change and subsequent login.
- Course enrollment and withdrawal.
- Persistence of course enrollment status after refresh.
- Logout and access restrictions for protected pages.
- Sticky navigation and dashboard background image.

Repeat these checks after making changes or setting up the project on another computer.

## Future Improvements

Potential future enhancements include:

- Course search and filtering.
- Automated unit and integration tests.
- Pagination for larger course lists.
- Deployment to a cloud hosting platform.
- CI/CD integration.
- Additional monitoring and production logging.

## Author

**Project:** StudentHub — Student Management Portal

**Purpose:** Demonstration of full-stack web development using Java, Spring Boot, and MySQL.

---

StudentHub brings student information, account security, and course enrollment together in one application.

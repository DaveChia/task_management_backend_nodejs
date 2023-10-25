# Simple Task Management Backend Web App built with NodeJs(ExpressJs framework), MySQL and Docker

This is a template README file for a simple task management application for the customer
service operations department.

The application allows users to add a new task, view all tasks, and mark a task as completed.

## Getting Started

To get started with this project, follow these steps:

### Prerequisites

1. Node.js and npm installed on your machine.
2. Docker and Docker compose installed on your machine.

### Installation

1. Clone this repository to your local machine:

```
git clone https://github.com/DaveChia/task_management_backend_nodejs.git
cd task_management_backend_nodejs
```

2. Install the project dependencies

```
npm install
```

3. Set up the .env, copy .env.example into .env

```
DB_HOST=127.0.0.1 // This should be the MySql Docker instance's host
DB_USER=root
DB_PASSWORD=  //  This should be the MYSQL_ROOT_PASSWORD defined in docker-compose.yml
DB_NAME=task_manager   //  This should be the MYSQL_DATABASE defined in

API_KEY=yoursecretapikey    // This is the api key required by the backend API server to authorize api calls

FRONTEND_APP_URL=http://localhost:5173    // This is the url of the frontend web app that will call this server
```

4. Build and start the project using Docker Compose:

```
docker-compose up --build
```

This will start the Docker container, and app will be accessible at http://localhost:8082.

5. Create the tasks table in the database

```
CREATE TABLE `tasks` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `completed` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_tasks_completed` (`completed`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Docker Compose Services

The docker-compose.yml file defines two services:

- app: The Express.js application server.
- db: The MySQL database server.
  You can customize these services as needed in the docker-compose.yml file.

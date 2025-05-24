# Node.js Server with Firebase FCM + Dockerized Microservices

A scalable Node.js backend server integrated with Firebase Cloud Messaging (FCM) for push notifications. Containerized using Docker and orchestrated via Docker Compose with three primary services:

- **Server**: The main Node.js Express API.
- **Worker**: A background job processor.
- **Redis**: A Redis instance used for job queueing and caching.

---

## Features

- Node.js + Express backend
- Firebase FCM integration
- Background job processing with a worker service
- Redis-based queueing
- Environment configuration via `.env` files
- Fully containerized using Docker + Docker Compose

---

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js (v16+)](https://nodejs.org/)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- Firebase project with a **Service Account Key (JSON)**

---

## Environment Setup

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/your-username/your-nodejs-fcm-project.git
   cd your-nodejs-fcm-project
   ```

2. **Create `.env` File**:
    Copy the example environment file and update values accordingly.
   ```bash
   cp .env.example .env
   cd your-nodejs-fcm-project
   ```

3. **Firebase Setup:**:
    - Go to Firebase Console
    - Create or open a project
    - Navigate to Project Settings → Service accounts
    - Click "Generate new private key"
    - Download the JSON and save it as firebase-private-key.json in the root directory

    ***Do not commit firebase-private-key.json to prevent exposing the Service account key!***

---

## Running the App

### Option 1: Using Docker (Recommended)
1. **Start all services:**

    Copy the example environment file and update values accordingly.
   ```bash
   docker-compose up --build -d
   ```
2. **Shut Down:**
    ```bash
    docker-compose down
    ```

### Option 2: Without Docker
1. **Install Dependencies:**
    ```bash
    npm install
    ```
2. **Start Redis:**
    If not using Docker, ensure you have local Redis running

3. **Start Server and Worker:**
    Start Worker
    ```bash
    node workers/emailWorker.js
    ```

    Start Server
    ```bash
    node index.js
    ```

## License
This project is licensed under the GNU GPL License. See LICENSE for details.

## Contributing
Feel free to fork and submit pull requests. Issues and suggestions are always welcome!


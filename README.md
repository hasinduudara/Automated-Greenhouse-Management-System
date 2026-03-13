# Automated Greenhouse Management System (AGMS) 🌱

A cloud-native, microservice-based platform designed to automate greenhouse environments. Instead of manual monitoring, this system ingests live IoT telemetry, processes it using a custom rule engine, and triggers automated actions to maintain ideal growing conditions.

## 🏗️ Architecture & Technologies

This project follows a Polyglot Microservices Architecture, utilizing the best tools for specific domain services:

* **Infrastructure Services (Spring Cloud Ecosystem):**
    * **Service Registry:** Netflix Eureka for dynamic service discovery.
    * **API Gateway:** Spring Cloud Gateway (Entry point + JWT Authentication).
    * **Config Server:** Centralized configuration management ([Configuration Repository](https://github.com/hasinduudara/agms-config-repo.git)).
* **Domain Microservices:**
    * **Zone Management Service:** Spring Boot (Java) & PostgreSQL.
    * **Sensor Telemetry Service:** Python (Flask) & APScheduler.
    * **Automation & Control Service:** Node.js (Express/TypeScript).
    * **Crop Inventory Service:** Node.js (Express) & MongoDB.
* **Frontend Client:**
    * React.js (Vite), Tailwind CSS, Lucide Icons.

## 📂 Project Structure

```text
Automated-Greenhouse-Management-System/
├── frontend/
│   └── agms-client/              # React frontend application
├── infrastructure/
│   ├── api-gateway/              # Spring Cloud Gateway (Port 8080)
│   ├── config-server/            # Spring Cloud Config Server (Port 8888)
│   └── service-registry/         # Netflix Eureka Server (Port 8761)
├── microservices/
│   ├── automation-service/       # Node.js Rule Engine (Port 8083)
│   ├── crop-service/             # Node.js Inventory management (Port 8084)
│   ├── sensor-service/           # Python Data Fetcher (Port 8082)
│   └── zone-service/             # Spring Boot Zone Management (Port 8081)
├── Postman Collection/
│   └── AGMS.postman_collection.json # Full API testing collection
└── README.md
```

## 🚀 Getting Started (Run Instructions)

To ensure smooth operation, the services must be started in the following specific order:

### Phase 1: Infrastructure Startup

1. **Config Server (config-server):** Run this first so other services can fetch their configurations.
2. **Service Registry (service-registry):** Run this second. Wait until it fully starts (accessible at `http://localhost:8761`).
3. **API Gateway (api-gateway):** Run this third. It will register with Eureka and act as the main entry point (`http://localhost:8080`).

### Phase 2: Domain Microservices Startup

Once the infrastructure is up and running, you can start the domain services in any order:

- Start **zone-service** (Spring Boot).
- Start **crop-service** (Node.js - `npm start`).
- Start **automation-service** (Node.js - `npm start`).
- Start **sensor-service** (Python - `python app.py`).

> **Note:** Verify that all services are displayed as 'UP' in the Eureka Dashboard (`http://localhost:8761`).

### Phase 3: Frontend Startup

Navigate to the `frontend/agms-client` directory:

```bash
npm install
npm run dev
```

The AGMS Admin Dashboard will be available at `http://localhost:5173`.

## 🧪 API Testing

A complete Postman Collection is included in the repository (`Postman Collection/AGMS.postman_collection.json`).
Import this file into Postman to test the End-to-End data flow, including Zone creation, Sensor data fetching, and Automation log generation.

## 👨‍💻 Author

**M. Hasindu Udara**

📧 Email: hasiduudara@gmail.com

💼 LinkedIn: [linkedin.com/in/hasindu-udara](https://linkedin.com/in/hasindu-udara)

🌐 Portfolio: [hasinduudara.me](https://hasinduudara.me)

# 📄 Ticketing Microservices App

A **microservices-based ticket booking platform** for shows and concerts. Built as a learning project to dive deep into real-world **Microservices Architecture** with isolated databases, async communication via Kafka, and full containerized orchestration using Kubernetes.

<video src="./preview.mp4" width="50%" height="auto" controls></video>


## 📚 Project Structure

| Service     | Description                                                       |
|-------------|-------------------------------------------------------------------|
| `client`    | Frontend built with **React + Next.js + Bootstrap**               |
| `auth`      | Handles **authentication** and user management                    |
| `ticket`    | Users can **create/update tickets**                               |
| `order`     | Handles **orders** created from tickets                           |
| `payment`   | Connects with **ZarinPal** for payment processing                 |
| `expiration`| Expires unpaid orders after a specific time period                |

## 💻 Tech Stack

### 🔧 Backend
- **Express.js** (with TypeScript)
- **MongoDB** (each service has its own DB)
- **Redis** (handle expiration process)
- **Kafka** (for async messaging)
- **Kafka UI** (visualize Kafka topics/messages)
- **Docker** & **Kubernetes**
- **Skaffold** (for local development loop)
- **Ingress-NGINX** (for public access and load balancing)
- **CI/CD** (with GitHub Actions to run Jest tests)

### 🎨 Frontend
- **React** with **Next.js**
- **Bootstrap**
- JavaScript

## 🤝 Shared NPM Package

This project uses a **locally developed NPM package**, located in the `common/` directory, that contains shared TypeScript code such as:
- Custom error classes
- Middleware
- Request validation
- Kafka event types and publishers/subscribers

The package is published to NPM and can be installed using the command `npm i @kneonix-ticketing/common`.


## 🚀 Purpose

This app is designed to **learn microservices** by building a real-world system where services are **independently deployed and scaled**, with **separate databases**.  
The challenge lies in **race conditions**—ensuring that once a ticket is being ordered, **no one else can purchase it**, even under high concurrency.

## ⚙️ Development Setup

### ✅ Prerequisites

1. **Install Docker Desktop** (with Kubernetes enabled)
2. **Install Chocolatey** (Windows only)  
   👉 [https://chocolatey.org/install](https://chocolatey.org/install)
3. **Install Skaffold** via Chocolatey:
   
```bash
   choco install skaffold
```

---

### 🏃 Run in Dev Mode

1. Clone the repository:

   ```bash
   git clone https://github.com/smh-kneonix/ticketing.git
   cd ticketing
   ```

2. Start all services using Skaffold:

   ```bash
   skaffold dev
   ```

3. Edit your Windows `hosts` file:

   Open this file:

   ```
   C:\Windows\System32\drivers\etc\hosts
   ```

   Add the following line:

   ```
   127.0.0.1 ticketing.dev
   ```

4. Open your browser and go to:

   ```
   https://ticketing.dev
   ```

5. Watch Kafka UI:

    to watch kafka UI you can port forward it to one of your ports of your local machine like `8080`
    ```bash
    kubectl port-forward service/kafka-ui-srv 8080:8080
    ```
    now you can go to `http://localhost:8080` and monitor your kafka activities

> 💡 **HINT:** If you encounter an HTTPS warning, type `thisisunsafe` in the browser to bypass the error.

---

### ✨ Optional (Manual Apply Without Skaffold)

If you prefer not to use Skaffold:

```bash
cd infra/k8s
kubectl apply -f <each-config-file.yaml>
```

⚠️ Note: This manual setup is **time-consuming** and not recommended for fast development iteration.

---

## 🔗 License

This project is for educational purposes and is open-source.
Feel free to fork and build upon it!

you can access the Postman collection in the `./microservice.postman_collection.json` file and import it into your Postman app.


## 👤 Author

Made with ❤️ by a developer learning Microservices and distributed system challenges Kneonix
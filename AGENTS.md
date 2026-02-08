# Development Agent Guide

## Setup Commands

### Prerequisites Installation
1. Install Docker Desktop with Kubernetes enabled
2. Install Chocolatey (Windows only):
   ```bash
   # Follow instructions at https://chocolatey.org/install
   ```
3. Install Skaffold:
   ```bash
   choco install skaffold
   ```

### Initial Setup
- Configure hosts file:
   ```bash
   # Add to C:\Windows\System32\drivers\etc\hosts
   127.0.0.1 ticketing.dev
   ```

## Run Commands

### Development Mode
1. Start all services:
   ```bash
   skaffold dev
   ```

### Kafka UI Monitoring
1. Port forward Kafka UI:
   ```bash
   kubectl port-forward service/kafka-ui-srv 8080:8080
   ```
2. Access UI at: http://localhost:8080

### Manual Kubernetes Deployment (Alternative to Skaffold)
```bash
cd infra/k8s
kubectl apply -f auth-depl.yaml
kubectl apply -f auth-mongo-depl.yaml
kubectl apply -f client-depl.yaml
kubectl apply -f expiration-depl.yaml
kubectl apply -f expiration-redis-depl.yaml
kubectl apply -f ingress-srv.yaml
kubectl apply -f kafka-depl.yaml
kubectl apply -f kafka-ui-depl.yaml
kubectl apply -f order-depl.yaml
kubectl apply -f order-mongo-depl.yaml
kubectl apply -f payment-depl.yaml
kubectl apply -f payment-mongo-depl.yaml
kubectl apply -f ticket-depl.yaml
kubectl apply -f ticket-mongo-depl.yaml
kubectl apply -f zookeeper.dep.yaml
```

## Testing Instructions

### Running Tests
Each microservice has its own test suite. To run tests:

1. Navigate to the service directory:
   ```bash
   cd [service-name]  # auth, ticket, order, payment, or expiration
   ```

2. Run the test suite:
   ```bash
   npm run test
   ```

### Test Coverage
- Tests are written using Jest
- Each service has its own `jest.config.js`
- Test files are located in `src/routes/__test__/` and `src/tests/` directories
- Integration tests use in-memory MongoDB instances

### CI/CD Testing
- Tests are automatically run via GitHub Actions
- All tests must pass before merging to master branch

## Troubleshooting

1. HTTPS Warning:
   - If you see an HTTPS warning in the browser, type `thisisunsafe` to bypass

2. Service Dependencies:
   - Ensure Docker Desktop is running with Kubernetes enabled
   - Verify all required pods are running:
     ```bash
     kubectl get pods
     ```

3. Common Issues:
   - If services fail to start, check logs:
     ```bash
     kubectl logs [pod-name]
     ```
   - For database connection issues, verify MongoDB pods are running:
     ```bash
     kubectl get pods | grep mongo
     ```


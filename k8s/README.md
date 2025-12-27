# Kubernetes Deployment for Riverrun

This directory contains Kubernetes manifests for deploying Riverrun to cloud environments.

## Quick Start

### Prerequisites

- Kubernetes cluster (1.25+)
- kubectl configured
- Docker images built and pushed to registry

### Deploy to Kubernetes

```bash
# Create namespace
kubectl apply -f k8s/namespace.yml

# Create secrets (update with your values first!)
kubectl apply -f k8s/secrets.yml

# Create config maps
kubectl apply -f k8s/configmap.yml

# Deploy database
kubectl apply -f k8s/postgres-statefulset.yml

# Wait for database to be ready
kubectl wait --for=condition=ready pod -l app=postgres -n riverrun --timeout=120s

# Deploy backend
kubectl apply -f k8s/backend-deployment.yml

# Deploy frontend
kubectl apply -f k8s/frontend-deployment.yml

# Setup ingress (optional, for external access)
kubectl apply -f k8s/ingress.yml
```

### Verify Deployment

```bash
# Check all pods are running
kubectl get pods -n riverrun

# Check services
kubectl get svc -n riverrun

# Check logs
kubectl logs -f deployment/riverrun-backend -n riverrun
kubectl logs -f deployment/riverrun-frontend -n riverrun
```

## Configuration

### Secrets

Edit `k8s/secrets.yml` to set your database credentials:

```yaml
stringData:
  DATABASE_USERNAME: "your-username"
  DATABASE_PASSWORD: "your-secure-password"
```

**Important:** For production, use external secret management (AWS Secrets Manager, Azure Key Vault, etc.) or sealed-secrets.

### ConfigMap

Edit `k8s/configmap.yml` to configure your deployment:

```yaml
data:
  DATABASE_URL: "jdbc:postgresql://postgres:5432/riverrun"
  MULTI_TENANCY_ENABLED: "true"  # Set to "false" for single-tenant
  DEPLOYMENT_MODE: "production"
  DEFAULT_TENANT_ID: "00000000-0000-0000-0000-000000000001"
```

### Ingress

Update `k8s/ingress.yml` with your domain:

```yaml
spec:
  tls:
  - hosts:
    - your-domain.com  # Change this
  rules:
  - host: your-domain.com  # Change this
```

## Cloud Provider Specific Setup

### AWS EKS

```bash
# Create EKS cluster
eksctl create cluster --name riverrun --region us-west-2

# Use EBS for persistent volumes
kubectl apply -f https://raw.githubusercontent.com/kubernetes-sigs/aws-ebs-csi-driver/master/deploy/kubernetes/latest/public-ecr.yaml

# Setup Application Load Balancer
kubectl apply -f https://raw.githubusercontent.com/kubernetes-sigs/aws-load-balancer-controller/main/docs/install/v2_4_0_full.yaml
```

### Azure AKS

```bash
# Create AKS cluster
az aks create --resource-group riverrun-rg --name riverrun --node-count 2

# Get credentials
az aks get-credentials --resource-group riverrun-rg --name riverrun

# Use Azure Disk for persistent volumes (default in AKS)
```

### Google GKE

```bash
# Create GKE cluster
gcloud container clusters create riverrun --num-nodes=2 --zone us-central1-a

# Get credentials
gcloud container clusters get-credentials riverrun --zone us-central1-a
```

## Scaling

### Horizontal Pod Autoscaling

```bash
# Scale backend based on CPU
kubectl autoscale deployment riverrun-backend -n riverrun --cpu-percent=70 --min=2 --max=10

# Scale frontend
kubectl autoscale deployment riverrun-frontend -n riverrun --cpu-percent=70 --min=2 --max=5
```

### Manual Scaling

```bash
# Scale backend to 5 replicas
kubectl scale deployment riverrun-backend -n riverrun --replicas=5
```

## Monitoring

### Basic Health Checks

```bash
# Port-forward to access locally
kubectl port-forward svc/riverrun-backend 8080:8080 -n riverrun

# Check health endpoint
curl http://localhost:8080/api/actuator/health
```

### Logs

```bash
# Stream backend logs
kubectl logs -f deployment/riverrun-backend -n riverrun

# View last 100 lines
kubectl logs deployment/riverrun-backend -n riverrun --tail=100
```

## Backup and Recovery

### Database Backup

```bash
# Create backup
kubectl exec -it postgres-0 -n riverrun -- pg_dump -U riverrun riverrun > backup.sql

# Restore backup
kubectl exec -i postgres-0 -n riverrun -- psql -U riverrun riverrun < backup.sql
```

## Troubleshooting

### Pod Not Starting

```bash
# Describe pod to see events
kubectl describe pod <pod-name> -n riverrun

# Check events
kubectl get events -n riverrun --sort-by='.lastTimestamp'
```

### Database Connection Issues

```bash
# Test database connectivity from backend pod
kubectl exec -it deployment/riverrun-backend -n riverrun -- /bin/bash
# Inside pod:
# psql -h postgres -U riverrun -d riverrun
```

## Cleanup

```bash
# Delete all resources
kubectl delete namespace riverrun
```

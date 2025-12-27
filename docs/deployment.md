# Riverrun Deployment Guide

This guide covers deployment options for Riverrun in both cloud and on-premises environments.

## Deployment Options

1. **Development** - Docker Compose (local)
2. **Cloud** - Kubernetes (AWS EKS, Azure AKS, GCP GKE)
3. **On-Premises** - Docker Compose or Kubernetes

---

## 1. Development Deployment (Docker Compose)

Perfect for local development and testing.

### Prerequisites

- Docker 20.10+
- Docker Compose 2.0+

### Quick Start

```bash
# Clone repository
git clone https://github.com/your-org/riverrun.git
cd riverrun

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

Services will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080/api
- PostgreSQL: localhost:5432

### Configuration

Edit `docker-compose.yml` to customize:

```yaml
environment:
  - MULTI_TENANCY_ENABLED=false  # Single tenant for dev
  - DEPLOYMENT_MODE=development
```

---

## 2. Cloud Deployment (Kubernetes)

Production-ready deployment for cloud environments.

### Architecture

```
Internet
    ↓
Ingress (Load Balancer + TLS)
    ↓
    ├─→ Frontend Service (2+ replicas)
    └─→ Backend Service (2+ replicas)
         ↓
    PostgreSQL (StatefulSet + Persistent Volume)
```

### Prerequisites

- Kubernetes cluster (1.25+)
- kubectl configured
- Container registry (Docker Hub, ECR, ACR, GCR)

### Build and Push Images

```bash
# Backend
cd backend
docker build -t your-registry/riverrun-backend:latest .
docker push your-registry/riverrun-backend:latest

# Frontend
cd frontend
docker build -t your-registry/riverrun-frontend:latest .
docker push your-registry/riverrun-frontend:latest
```

### Deploy to Kubernetes

See detailed instructions in [k8s/README.md](../k8s/README.md)

```bash
# Quick deploy
kubectl apply -f k8s/namespace.yml
kubectl apply -f k8s/secrets.yml
kubectl apply -f k8s/configmap.yml
kubectl apply -f k8s/postgres-statefulset.yml
kubectl apply -f k8s/backend-deployment.yml
kubectl apply -f k8s/frontend-deployment.yml
kubectl apply -f k8s/ingress.yml
```

### Cloud-Specific Guides

#### AWS EKS

```bash
# Install eksctl
brew install eksctl  # macOS
# or follow: https://eksctl.io/

# Create cluster
eksctl create cluster --name riverrun --region us-west-2 --nodes 3

# Deploy
kubectl apply -f k8s/
```

**RDS Option:** Instead of in-cluster PostgreSQL, use Amazon RDS:

```yaml
# In configmap.yml
DATABASE_URL: "jdbc:postgresql://riverrun.xxxxx.us-west-2.rds.amazonaws.com:5432/riverrun"
```

#### Azure AKS

```bash
# Create resource group
az group create --name riverrun-rg --location eastus

# Create cluster
az aks create \
  --resource-group riverrun-rg \
  --name riverrun \
  --node-count 3 \
  --enable-managed-identity

# Get credentials
az aks get-credentials --resource-group riverrun-rg --name riverrun

# Deploy
kubectl apply -f k8s/
```

**Azure Database Option:** Use Azure Database for PostgreSQL:

```yaml
# In configmap.yml
DATABASE_URL: "jdbc:postgresql://riverrun.postgres.database.azure.com:5432/riverrun"
```

#### Google GKE

```bash
# Create cluster
gcloud container clusters create riverrun \
  --num-nodes=3 \
  --zone=us-central1-a

# Get credentials
gcloud container clusters get-credentials riverrun --zone us-central1-a

# Deploy
kubectl apply -f k8s/
```

**Cloud SQL Option:** Use Google Cloud SQL:

```yaml
# In configmap.yml
DATABASE_URL: "jdbc:postgresql://INSTANCE_CONNECTION_NAME/riverrun"
```

---

## 3. On-Premises Deployment

### Option A: Docker Compose (Recommended for Small/Medium)

Best for teams up to 50 users or single-tenant deployments.

#### Setup

```bash
# Create production docker-compose.yml
cp docker-compose.yml docker-compose.prod.yml

# Edit for production
nano docker-compose.prod.yml
```

**Production docker-compose.yml:**

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    restart: always
    environment:
      POSTGRES_DB: riverrun
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - /data/riverrun/postgres:/var/lib/postgresql/data
    networks:
      - riverrun-network

  backend:
    image: your-registry/riverrun-backend:1.0.0
    restart: always
    depends_on:
      - postgres
    environment:
      DATABASE_URL: jdbc:postgresql://postgres:5432/riverrun
      DATABASE_USERNAME: ${DB_USER}
      DATABASE_PASSWORD: ${DB_PASSWORD}
      MULTI_TENANCY_ENABLED: "true"
      DEPLOYMENT_MODE: production
    networks:
      - riverrun-network

  frontend:
    image: your-registry/riverrun-frontend:1.0.0
    restart: always
    depends_on:
      - backend
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /etc/ssl/certs:/etc/ssl/certs:ro
    networks:
      - riverrun-network

  nginx:
    image: nginx:alpine
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - /etc/letsencrypt:/etc/letsencrypt:ro
    depends_on:
      - frontend
      - backend
    networks:
      - riverrun-network

volumes:
  postgres-data:

networks:
  riverrun-network:
    driver: bridge
```

#### Deploy

```bash
# Create .env file
cat > .env << EOF
DB_USER=riverrun
DB_PASSWORD=$(openssl rand -base64 32)
EOF

# Start services
docker-compose -f docker-compose.prod.yml up -d

# Check status
docker-compose -f docker-compose.prod.yml ps
```

### Option B: On-Premises Kubernetes

For larger deployments (100+ users) or high availability requirements.

#### Prerequisites

- Kubernetes cluster (K3s, RKE2, or vanilla Kubernetes)
- Persistent storage solution (NFS, Ceph, local volumes)

#### Setup K3s (Lightweight Kubernetes)

```bash
# Install K3s on master node
curl -sfL https://get.k3s.io | sh -

# Get kubeconfig
sudo cat /var/lib/rancher/k3s/server/node-token
export KUBECONFIG=/etc/rancher/k3s/k3s.yaml

# Deploy Riverrun
kubectl apply -f k8s/
```

---

## Configuration Management

### Environment Variables

All deployments support these environment variables:

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | localhost:5432 | PostgreSQL connection URL |
| `DATABASE_USERNAME` | riverrun | Database username |
| `DATABASE_PASSWORD` | riverrun | Database password |
| `MULTI_TENANCY_ENABLED` | true | Enable multi-tenant mode |
| `DEFAULT_TENANT_ID` | 00000000... | Default tenant UUID |
| `DEPLOYMENT_MODE` | development | Deployment mode |

### Single-Tenant vs Multi-Tenant

**Single-Tenant** (one organization):
```yaml
MULTI_TENANCY_ENABLED: "false"
DEFAULT_TENANT_ID: "00000000-0000-0000-0000-000000000001"
```

**Multi-Tenant** (multiple organizations):
```yaml
MULTI_TENANCY_ENABLED: "true"
# Tenant ID passed via X-Tenant-ID header in requests
```

---

## Security Considerations

### Production Checklist

- [ ] Change default database password
- [ ] Enable TLS/HTTPS
- [ ] Configure firewall rules
- [ ] Set up database backups
- [ ] Enable audit logging
- [ ] Configure authentication (OAuth, SAML)
- [ ] Set resource limits
- [ ] Enable monitoring/alerting
- [ ] Review security headers

### TLS Setup

#### Using Let's Encrypt (Cloud)

```bash
# Install cert-manager
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml

# Create ClusterIssuer
kubectl apply -f - <<EOF
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: admin@example.com
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: nginx
EOF
```

#### Using Own Certificates (On-Prem)

```bash
# Create TLS secret
kubectl create secret tls riverrun-tls \
  --cert=path/to/cert.pem \
  --key=path/to/key.pem \
  -n riverrun
```

---

## Monitoring and Observability

### Health Checks

Backend provides health endpoints:

- `/api/actuator/health` - Overall health
- `/api/actuator/health/readiness` - Ready to serve traffic
- `/api/actuator/health/liveness` - Application is alive

### Logging

**View logs in Kubernetes:**

```bash
# Backend logs
kubectl logs -f deployment/riverrun-backend -n riverrun

# All pods
kubectl logs -f -l app=riverrun-backend -n riverrun
```

**View logs in Docker Compose:**

```bash
docker-compose logs -f backend
```

### Metrics (Future Enhancement)

Riverrun will support Prometheus metrics at `/api/actuator/prometheus`

---

## Backup and Recovery

### Database Backup

**Kubernetes:**

```bash
# Backup
kubectl exec -it postgres-0 -n riverrun -- \
  pg_dump -U riverrun riverrun > backup-$(date +%Y%m%d).sql

# Restore
kubectl exec -i postgres-0 -n riverrun -- \
  psql -U riverrun riverrun < backup-20231215.sql
```

**Docker Compose:**

```bash
# Backup
docker-compose exec postgres pg_dump -U riverrun riverrun > backup.sql

# Restore
docker-compose exec -T postgres psql -U riverrun riverrun < backup.sql
```

### Automated Backups

Create a CronJob for automated backups:

```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: postgres-backup
  namespace: riverrun
spec:
  schedule: "0 2 * * *"  # 2 AM daily
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: backup
            image: postgres:15-alpine
            command:
            - /bin/sh
            - -c
            - pg_dump -h postgres -U riverrun riverrun | gzip > /backups/backup-$(date +\%Y\%m\%d).sql.gz
            env:
            - name: PGPASSWORD
              valueFrom:
                secretKeyRef:
                  name: riverrun-secrets
                  key: DATABASE_PASSWORD
            volumeMounts:
            - name: backup-storage
              mountPath: /backups
          restartPolicy: OnFailure
          volumes:
          - name: backup-storage
            persistentVolumeClaim:
              claimName: backup-pvc
```

---

## Scaling

### Horizontal Scaling

**Kubernetes:**

```bash
# Scale backend
kubectl scale deployment riverrun-backend -n riverrun --replicas=5

# Auto-scaling
kubectl autoscale deployment riverrun-backend -n riverrun \
  --cpu-percent=70 --min=2 --max=10
```

### Database Scaling

For production, consider:
- **Read replicas** - Offload read queries
- **Connection pooling** - PgBouncer
- **Managed databases** - AWS RDS, Azure Database, Cloud SQL

---

## Troubleshooting

### Common Issues

**Pod won't start:**

```bash
kubectl describe pod <pod-name> -n riverrun
kubectl logs <pod-name> -n riverrun
```

**Database connection failed:**

```bash
# Test from backend pod
kubectl exec -it deployment/riverrun-backend -n riverrun -- /bin/bash
curl postgres:5432
```

**Out of memory:**

```bash
# Increase resource limits in deployment.yml
resources:
  limits:
    memory: "2Gi"
```

---

## Support

For issues and questions:
- GitHub Issues: https://github.com/your-org/riverrun/issues
- Documentation: https://docs.riverrun.io
- Community: https://community.riverrun.io

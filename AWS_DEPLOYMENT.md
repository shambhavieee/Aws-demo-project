# AWS Deployment Guide

This guide walks you through deploying your React/Vite frontend and Go backend application to AWS. Because this application currently uses a **SQLite database** (`examduty.db`), your deployment strategy should account for database persistence.

---

## 🚀 Option 1: Amazon EC2 with Docker Compose (Recommended for Cost & Simplicity)

This is the easiest and most cost-effective way to deploy your Dockerized application, keeping your SQLite database persistent on the host.

### Step 1: Launch an EC2 Instance
1. Go to the **AWS EC2 Console** and click **Launch Instance**.
2. **Name**: `ExamDuty-App`
3. **OS Image**: Select **Ubuntu Server 24.04 LTS** (Free-tier eligible).
4. **Instance Type**: Select `t3.micro` or `t2.micro` (Free-tier eligible).
5. **Key Pair**: Create a new one or select an existing one to SSH into the instance.
6. **Network Settings**:
   - Allow SSH traffic from **My IP** (recommended) or **Anywhere**.
   - Check **Allow HTTP traffic from the internet** (Port 80).
   - Check **Allow HTTPS traffic from the internet** (Port 443).
7. Click **Launch Instance**.

### Step 2: Install Docker and Docker Compose on EC2
SSH into your instance using your key pair:
```bash
ssh -i "your-key.pem" ubuntu@your-ec2-public-ip
```

Update packages and install Docker:
```bash
# Update repository lists
sudo apt-get update -y

# Install Docker
sudo apt-get install -y docker.io

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Add the ubuntu user to the docker group
sudo usermod -aG docker ubuntu
```
*Log out of the SSH session and log back in for docker group settings to take effect.*

### Step 3: Clone Code and Start the App
Clone your Git repository onto the EC2 instance:
```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name

# Start the application in detached (background) mode
docker-compose up --build -d
```
Your frontend is now live on `http://your-ec2-public-ip`!

---

## ☁️ Option 2: AWS App Runner (Backend) + AWS Amplify (Frontend)

This is a modern, fully managed, serverless option. It automatically scales and rebuilds whenever you push changes to Git.

### Part A: Deploy the Go Backend via AWS App Runner
1. Go to the **AWS App Runner Console** and click **Create service**.
2. **Repository type**: Select **Source code repository**.
3. Connect your GitHub account and select your repository.
4. **Deployment settings**: Choose **Automatic** (deploys on every git commit).
5. **Configure build**:
   - **Runtime**: Select **Custom** (uses the Dockerfile).
   - **Build command**: Leave blank.
   - **Start command**: Leave blank.
   - **Port**: Set to `8080`.
6. **Configure service**:
   - Add environment variables:
     - `PORT` = `8080`
     - `GIN_MODE` = `release`
     - `JWT_SECRET` = `your-custom-secure-secret`
     - `FRONTEND_URL` = `https://main.xxxxxx.amplifyapp.com` *(Update this after deploying the frontend)*
7. Click **Create & Deploy**. App Runner will build the Docker container and provide you with a secure HTTPS URL (e.g., `https://xxxxxx.us-east-1.awsapprunner.com`).

> [!WARNING]
> **Data Persistence Warning:** AWS App Runner instances are ephemeral. If the service scales down or restarts, any writes to the SQLite database will be lost. To run this in a production capacity, you should update the backend code to connect to **Amazon RDS (PostgreSQL/MySQL)**.

---

### Part B: Deploy the Vite Frontend via AWS Amplify
1. Go to the **AWS Amplify Console** and click **New App > Host web app**.
2. Select **GitHub** and authorize AWS Amplify.
3. Select your repository and the branch (e.g., `main`).
4. **Build Settings**:
   - Amplify will auto-detect the Vite project. Add your API URL as a build-time environment variable:
     - Click **Advanced settings** or edit the Amplify build spec to include:
       ```yaml
       frontend:
         phases:
           build:
             commands:
               - export VITE_API_URL="https://xxxxxx.us-east-1.awsapprunner.com/api"
               - npm run build
       ```
5. Click **Save and Deploy**. Amplify will compile your code and host it on a fast global CDN with a free SSL certificate.

---

## 💾 Migrating SQLite to PostgreSQL (For Serverless Scaling)
If you want to use Option 2 without losing database data, follow these steps to migrate to AWS RDS:

1. Create a PostgreSQL database instance in the **Amazon RDS Console**.
2. Install a PostgreSQL driver in Go (e.g., `gorm.io/driver/postgres`).
3. Update `backend/database/database.go` to connect to PostgreSQL if a `DATABASE_URL` environment variable is present:
   ```go
   // Example GORM connection
   dsn := os.Getenv("DATABASE_URL")
   db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
   ```
4. Set the `DATABASE_URL` environment variable in AWS App Runner.

# Railway Deployment Guide

This guide will help you deploy your Social Login application on Railway using Docker containers.

## Prerequisites

1. **Railway Account**: Sign up at [railway.app](https://railway.app)
2. **GitHub Repository**: Push your code to GitHub
3. **Docker**: Ensure Docker is installed locally for testing

## Project Structure

```
├── Social Login/           # Frontend React App
│   ├── Dockerfile         # Frontend container
│   ├── nginx.conf         # Nginx configuration
│   └── railway.json       # Railway configuration
├── Social Login Backend/   # Backend Node.js API
│   ├── Dockerfile         # Backend container
│   ├── railway.json       # Railway configuration
│   └── env.example        # Environment variables template
└── docker-compose.yml     # Local testing
```

## Step 1: Local Testing

Before deploying, test your Docker containers locally:

```bash
# Build and run both services
docker-compose up --build

# Test endpoints
curl http://localhost/health          # Frontend health check
curl http://localhost:5000/health     # Backend health check
```

## Step 2: Deploy Backend to Railway

1. **Create New Project**:
   - Go to [railway.app](https://railway.app)
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

2. **Configure Backend Service**:
   - Railway will auto-detect the Dockerfile
   - Set the following environment variables:
     ```
     PORT=5000
     NODE_ENV=production
     JWT_SECRET=your_secure_jwt_secret
     JWT_EXPIRES_IN=24h
     CORS_ORIGIN=https://your-frontend-domain.railway.app
     ```

3. **Deploy**:
   - Railway will build and deploy automatically
   - Note the generated domain (e.g., `https://your-backend.railway.app`)

## Step 3: Deploy Frontend to Railway

1. **Add New Service**:
   - In your Railway project, click "New Service"
   - Select "GitHub Repo"
   - Choose the same repository

2. **Configure Frontend Service**:
   - Set the root directory to `Social Login`
   - Set environment variables:
     ```
     VITE_BACKEND_URL=https://your-backend-domain.railway.app
     VITE_GOOGLE_CLIENT_ID=your_google_client_id
     VITE_GITHUB_CLIENT_ID=your_github_client_id
     ```

3. **Deploy**:
   - Railway will build and deploy the frontend
   - Note the generated domain (e.g., `https://your-frontend.railway.app`)

## Step 4: Update CORS Configuration

After both services are deployed:

1. **Update Backend CORS**:
   - Go to your backend service in Railway
   - Update `CORS_ORIGIN` to your frontend domain
   - Redeploy the backend service

## Step 5: Configure Custom Domains (Optional)

1. **Add Custom Domain**:
   - In Railway, go to your service settings
   - Click "Custom Domains"
   - Add your domain and configure DNS

2. **SSL Certificate**:
   - Railway automatically provides SSL certificates
   - No additional configuration needed

## Environment Variables Reference

### Backend (.env)
```bash
PORT=5000
NODE_ENV=production
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=24h
CORS_ORIGIN=https://your-frontend-domain.railway.app
```

### Frontend (.env)
```bash
VITE_BACKEND_URL=https://your-backend-domain.railway.app
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_GITHUB_CLIENT_ID=your_github_client_id
```

## Monitoring and Logs

1. **View Logs**:
   - In Railway dashboard, click on your service
   - Go to "Deployments" tab
   - Click on a deployment to view logs

2. **Health Checks**:
   - Both services include health check endpoints
   - Railway will monitor these automatically

## Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check Dockerfile syntax
   - Verify all dependencies are in package.json
   - Check Railway build logs

2. **Runtime Errors**:
   - Verify environment variables are set
   - Check service logs in Railway dashboard
   - Ensure ports are correctly configured

3. **CORS Issues**:
   - Verify CORS_ORIGIN matches your frontend domain
   - Check that backend is accessible from frontend

### Debug Commands

```bash
# Check container logs locally
docker-compose logs backend
docker-compose logs frontend

# Access container shell
docker-compose exec backend sh
docker-compose exec frontend sh

# Rebuild specific service
docker-compose build backend
docker-compose up backend
```

## Performance Optimization

1. **Multi-stage Builds**: Frontend uses multi-stage Docker build
2. **Nginx Caching**: Static assets are cached for 1 year
3. **Gzip Compression**: Enabled for all text-based content
4. **Health Checks**: Automatic health monitoring

## Security Features

1. **Non-root User**: Containers run as non-root users
2. **Security Headers**: Nginx includes security headers
3. **Environment Variables**: Sensitive data stored securely
4. **CORS Protection**: Restricted origin access

## Scaling

Railway automatically scales your services based on traffic. You can also:

1. **Manual Scaling**: Adjust CPU/memory allocation
2. **Auto-scaling**: Enable automatic scaling rules
3. **Load Balancing**: Multiple instances for high availability

## Cost Optimization

1. **Use Free Tier**: Start with Railway's free tier
2. **Monitor Usage**: Track resource consumption
3. **Optimize Images**: Use Alpine-based images
4. **Clean Up**: Remove unused services

## Next Steps

After successful deployment:

1. **Set up CI/CD**: Connect GitHub Actions for automatic deployment
2. **Add Database**: Integrate PostgreSQL or MongoDB
3. **Monitoring**: Set up external monitoring tools
4. **Backup**: Configure automatic backups
5. **SSL**: Verify SSL certificates are working

## Support

- **Railway Docs**: [docs.railway.app](https://docs.railway.app)
- **Community**: [discord.gg/railway](https://discord.gg/railway)
- **GitHub Issues**: Report bugs in your repository

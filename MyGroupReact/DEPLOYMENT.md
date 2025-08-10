
# MyGroup React - Production Deployment Guide

## Prerequisites

1. **Replit Account**: Ensure you have a Replit account with deployment access
2. **Wasabi Account**: Sign up for Wasabi cloud storage (S3-compatible)
3. **Domain (Optional)**: For custom domain setup

## Deployment Steps

### 1. Configure Environment Variables

Update the following in `MyGroupReact/backend/.env`:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=admin
DB_NAME=my_group
DB_PORT=3306

# Server Configuration
NODE_ENV=production
PORT=5000

# CORS Configuration
FRONTEND_URL=https://your-actual-app-name.replit.app
BACKEND_URL=https://your-actual-app-name.replit.app

# Wasabi S3 Configuration
WASABI_ACCESS_KEY_ID=your_actual_wasabi_access_key
WASABI_SECRET_ACCESS_KEY=your_actual_wasabi_secret_key
WASABI_BUCKET_NAME=mygroup-uploads
WASABI_REGION=us-east-1
WASABI_ENDPOINT=https://s3.wasabisys.com

# JWT Configuration
JWT_SECRET=your_production_secret_key_here
JWT_EXPIRES_IN=7d
```

### 2. Wasabi Setup

1. Create a Wasabi account at https://wasabi.com/
2. Create a new bucket named `mygroup-uploads`
3. Generate Access Keys in Wasabi console
4. Update the `.env` file with your Wasabi credentials

### 3. Deploy on Replit

1. Click the "Deploy" button in Replit
2. Choose "Autoscale Deployment" for scalability
3. Set the build command: `chmod +x build.sh && ./build.sh`
4. Set the run command: `cd MyGroupReact/backend && npm start`
5. Deploy the application

### 4. Post-Deployment Configuration

1. Update frontend `.env` with your actual Replit URL
2. Test file upload functionality
3. Configure custom domain (if needed)

## Features Included

- **Full-Stack React/Node.js Application**
- **MySQL Database Integration**
- **JWT Authentication**
- **File Upload to Wasabi Cloud Storage**
- **Production-Ready Configuration**
- **CORS and Security Headers**
- **Error Handling and Logging**

## API Endpoints

- `GET /api/health` - Health check
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/upload/single` - Upload single file
- `POST /api/upload/multiple` - Upload multiple files
- `GET /api/upload/signed-url/:key` - Get signed URL for file access
- `DELETE /api/upload/:key` - Delete file

## File Upload Usage

```javascript
// Frontend upload example
const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', 'profiles'); // Optional folder

  const response = await fetch('/api/upload/single', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });

  return response.json();
};
```

## Monitoring and Maintenance

- Monitor application logs in Replit console
- Check Wasabi storage usage regularly
- Update environment variables as needed
- Monitor database performance

## Support

For issues or questions:
1. Check Replit deployment logs
2. Verify Wasabi configuration
3. Test API endpoints individually
4. Review error logs for debugging

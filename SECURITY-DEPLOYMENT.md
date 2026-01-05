# 🔒 Secure Deployment Guide

This guide covers the security measures implemented for safe deployment of the Chitti Challenge platform.

## ✅ **Compiler Availability in Deployment**

**YES, all compilers WILL work in the deployed program!** 

The Docker container (`Dockerfile.executor`) automatically installs:
- **GCC** - C compiler
- **G++** - C++ compiler  
- **Python 3** - Python interpreter
- **OpenJDK 17** - Java compiler (javac) and runtime (java)

The secure executor includes **automatic compiler detection** that works in both development and production environments.

## 🛡️ Security Features Implemented

### 1. **Secure Code Execution**
- **Sandboxed Environment**: Code runs in isolated containers with resource limits
- **Input Validation**: Strict validation of code, language, and problem parameters
- **Dangerous Pattern Detection**: Blocks potentially harmful operations:
  - File system access (`import os`, `fopen`, `system`)
  - Process execution (`subprocess`, `exec`, `Runtime.getRuntime`)
  - Network operations and system calls
  - Memory manipulation functions

### 2. **Resource Limits**
- **Memory**: 256MB per container
- **CPU**: 0.5 CPU cores per container
- **Execution Time**: 5-second timeout per test case
- **Code Size**: Maximum 5000 characters
- **Output Size**: Limited to 10KB per execution
- **Process Limits**: Maximum 10 processes per user

### 3. **Rate Limiting**
- **General API**: 100 requests per 15 minutes per IP
- **Code Execution**: 10 executions per minute per IP
- **Automatic blocking** of excessive requests

### 4. **Network Security**
- **CORS Protection**: Only allows requests from configured origins
- **Request Size Limits**: 10KB maximum payload
- **Network Isolation**: Containers have no external network access
- **Privilege Dropping**: Runs with minimal user privileges

### 5. **Container Security**
- **Read-only filesystem** except for temporary execution directory
- **No new privileges** flag enabled
- **Capability dropping**: Removes all unnecessary Linux capabilities
- **Temporary filesystem**: Isolated `/tmp` with size limits
- **Automatic cleanup**: All temporary files removed after execution

## 🚀 Deployment Options

### Option 1: Docker Compose (Recommended)

```bash
# Build and start all services
docker-compose up --build

# Run in background
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

**Services:**
- **Frontend**: http://localhost:3001
- **Secure API**: http://localhost:3003

### Option 2: Manual Deployment

1. **Start Secure Executor**:
```bash
node server/secure-executor.js
```

2. **Start Frontend** (in another terminal):
```bash
npm run dev
```

## 🔧 Configuration

### Environment Variables

**Frontend (.env)**:
```
REACT_APP_API_URL=http://localhost:3003
```

**Secure Executor**:
```
PORT=3003
NODE_ENV=production
ALLOWED_ORIGINS=http://localhost:3001,https://yourdomain.com
```

### Docker Configuration

The `docker-compose.yml` includes:
- Resource limits (256MB RAM, 0.5 CPU)
- Security options (no-new-privileges, capability dropping)
- Network isolation
- Automatic restart policies

## 🧪 Testing Security

Run the security test suite:

```bash
# Verify deployment readiness (all compilers + security)
node verify-deployment.js

# Test security measures
node test-security.js

# Test all programming languages
node test-languages.js

# Test basic API functionality
node test-secure-api.js
```

**Expected Results:**
- ✅ All compilers detected and working
- ✅ Python, Java, C, C++ all executing correctly
- ✅ Dangerous code patterns blocked
- ✅ Rate limiting active
- ✅ Large payloads rejected
- ✅ Resource limits enforced

## 🚨 Security Checklist

Before deploying to production:

- [ ] **Update CORS origins** in docker-compose.yml
- [ ] **Set strong rate limits** for your expected traffic
- [ ] **Configure HTTPS** with proper SSL certificates
- [ ] **Set up monitoring** for resource usage and errors
- [ ] **Regular security updates** for base Docker images
- [ ] **Backup strategy** for user progress data
- [ ] **Log monitoring** for suspicious activities

## 📊 Monitoring

### Key Metrics to Monitor:
- API response times
- Memory and CPU usage
- Rate limit violations
- Failed code executions
- Container restart frequency

### Log Files:
- Secure executor logs: Container stdout/stderr
- Frontend logs: Browser console and server logs
- Docker logs: `docker-compose logs`

## 🔄 Updates and Maintenance

### Regular Tasks:
1. **Update Docker base images** monthly
2. **Review and update** dangerous pattern detection
3. **Monitor resource usage** and adjust limits if needed
4. **Test security measures** after any code changes
5. **Backup user progress** data regularly

### Emergency Procedures:
- **Immediate shutdown**: `docker-compose down`
- **Resource exhaustion**: Restart containers with `docker-compose restart`
- **Security breach**: Stop services, review logs, update patterns

## 🎯 Production Recommendations

### Infrastructure:
- Use a reverse proxy (nginx) for SSL termination
- Implement additional firewall rules
- Set up container orchestration (Kubernetes) for scaling
- Use managed databases for user data
- Implement centralized logging (ELK stack)

### Security Enhancements:
- Add user authentication and session management
- Implement IP whitelisting for admin functions
- Add audit logging for all code executions
- Set up intrusion detection systems
- Regular penetration testing

## 📞 Support

If you encounter security issues:
1. **Stop the services immediately**
2. **Review the logs** for suspicious activity
3. **Update the dangerous patterns** if needed
4. **Test thoroughly** before restarting

---

**Remember**: Security is an ongoing process. Regularly review and update these measures as new threats emerge.
# Tools

This folder contains utility scripts and tools for the My Job Track Admin project.

## Available Scripts

### 🚀 `deploy.sh`
Deployment script for various environments.

**Usage:**
```bash
./tools/deploy.sh [environment]
```

**Environments:**
- `development` (default)
- `staging` 
- `production`

**Features:**
- Automatically installs dependencies if needed
- Builds the project for the specified environment
- Handles environment-specific configurations
- Creates timestamped deployments

### 🛠️ `start-dev.sh`
Development environment startup script that runs both the main app and admin interface.

**Usage:**
```bash
./tools/start-dev.sh
```

**Features:**
- Starts the admin interface on port 3001
- Can coordinate with the main Job Track application
- Includes cleanup handling for graceful shutdown
- Validates project structure before starting

## Usage Notes

### Making Scripts Executable

If you get permission errors, make the scripts executable:

```bash
chmod +x tools/deploy.sh
chmod +x tools/start-dev.sh
```

### Running from Project Root

All scripts should be run from the project root directory:

```bash
# ✅ Correct
./tools/deploy.sh production

# ❌ Incorrect  
cd tools && ./deploy.sh production
```

## Development Workflow

1. **Start Development**: `./tools/start-dev.sh`
2. **Deploy to Staging**: `./tools/deploy.sh staging`
3. **Deploy to Production**: `./tools/deploy.sh production`

## Adding New Tools

When adding new scripts to this folder:

1. Make them executable: `chmod +x tools/new-script.sh`
2. Add documentation to this README
3. Include proper error handling and logging
4. Test with different environments

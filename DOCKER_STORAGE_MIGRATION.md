# Docker Storage Migration Guide

This guide explains how to move Docker images, containers, and volumes from your SSD to a different drive (HDD) on Windows.

## Method 1: Docker Desktop Settings (Recommended)

### Steps:

1. **Open Docker Desktop**
   - Make sure Docker Desktop is running

2. **Access Settings**
   - Click the gear icon (⚙️) in the top-right corner
   - Or go to: **Settings** from the Docker Desktop menu

3. **Navigate to Resources → Advanced**
   - In the left sidebar, click **Resources**
   - Click on **Advanced** tab

4. **Change Disk Image Location**
   - Find **Disk image location** section
   - Click **Browse** button
   - Select a folder on your HDD (e.g., `D:\DockerData` or `E:\Docker`)
   - **Important**: Create the folder first if it doesn't exist

5. **Apply Changes**
   - Click **Apply & Restart**
   - Docker Desktop will restart and migrate data to the new location

### Notes:

- This will move all Docker data (images, containers, volumes) to the new location
- The migration may take some time depending on the amount of data
- Make sure you have enough space on the target drive

## Method 2: WSL2 Data Directory (Alternative)

If Docker Desktop uses WSL2 backend, you can also move the WSL2 data:

1. **List WSL distributions**

   ```powershell
   wsl --list --verbose
   ```

2. **Export and reimport WSL distribution**

   ```powershell
   # Export current distribution
   wsl --export docker-desktop D:\WSL\docker-desktop.tar

   # Unregister old distribution
   wsl --unregister docker-desktop

   # Import to new location
   wsl --import docker-desktop D:\WSL\docker-desktop D:\WSL\docker-desktop.tar
   ```

3. **Clean up**
   ```powershell
   Remove-Item D:\WSL\docker-desktop.tar
   ```

## Method 3: Using Symlinks (Advanced)

If you can't use Docker Desktop settings:

1. **Stop Docker Desktop completely**

2. **Create target directory on HDD**

   ```powershell
   New-Item -ItemType Directory -Path "D:\DockerData"
   ```

3. **Move existing data** (if any)

   ```powershell
   # Default location is usually:
   # C:\Users\<YourUser>\AppData\Local\Docker
   Move-Item -Path "$env:LOCALAPPDATA\Docker" -Destination "D:\DockerData\Docker"
   ```

4. **Create symlink**

   ```powershell
   New-Item -ItemType SymbolicLink -Path "$env:LOCALAPPDATA\Docker" -Target "D:\DockerData\Docker"
   ```

5. **Restart Docker Desktop**

## Verification

After migration, verify the new location:

```powershell
# Check Docker info
docker info

# Check disk usage
docker system df
```

## Troubleshooting

### If Docker won't start after migration:

1. Check that the target folder exists and has proper permissions
2. Ensure the target drive has enough space
3. Try restarting Docker Desktop as Administrator
4. Check Docker Desktop logs: `%LOCALAPPDATA%\Docker\log.txt`

### If you need to revert:

1. Go back to Docker Desktop Settings
2. Change the disk image location back to default
3. Click **Apply & Restart**

## Space Savings

After migration, you can check space usage:

```powershell
# Check Docker disk usage
docker system df

# Clean up unused resources
docker system prune -a --volumes
```

## Recommended Folder Structure

```
D:\DockerData\          # or E:\DockerData\
├── Docker\            # Docker Desktop data
└── WSL\              # WSL2 distributions (if using)
```

---

**Note**: Always ensure Docker Desktop is fully stopped before moving data manually. The Settings method is the safest and recommended approach.

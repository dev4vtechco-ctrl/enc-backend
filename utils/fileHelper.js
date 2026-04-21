const fs = require('fs-extra');
const path = require('path');

// Delete a single file
const deleteFile = async (filePath) => {
  if (!filePath) return false;
  
  try {
    // Extract relative path from URL or use as is
    let relativePath = filePath;
    if (filePath.startsWith('/uploads/')) {
      relativePath = filePath.slice(1);
    } else if (filePath.startsWith('http')) {
      // If it's a full URL, extract the path
      const urlParts = filePath.split('/uploads/');
      if (urlParts.length > 1) {
        relativePath = 'uploads/' + urlParts[1];
      } else {
        return false;
      }
    }
    
    const fullPath = path.join(process.cwd(), relativePath);
    if (await fs.pathExists(fullPath)) {
      await fs.remove(fullPath);
      console.log(`Deleted file: ${fullPath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error deleting file ${filePath}:`, error);
    return false;
  }
};

// Delete multiple files
const deleteFiles = async (filePaths) => {
  const results = await Promise.all(filePaths.map(deleteFile));
  return results.filter(Boolean).length;
};

// Delete directory contents
const clearDirectory = async (dirPath) => {
  try {
    const fullPath = path.join(process.cwd(), dirPath);
    if (await fs.pathExists(fullPath)) {
      const files = await fs.readdir(fullPath);
      for (const file of files) {
        await fs.remove(path.join(fullPath, file));
      }
      console.log(`Cleared directory: ${fullPath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error clearing directory ${dirPath}:`, error);
    return false;
  }
};

// Get full URL for image
const getFullImageUrl = (req, filePath) => {
  if (!filePath) return null;
  if (filePath.startsWith('http')) return filePath;
  
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  return `${baseUrl}/${filePath}`;
};

// Get relative path from file object or URL
const getRelativePath = (fileOrUrl) => {
  if (!fileOrUrl) return null;
  if (typeof fileOrUrl === 'object' && fileOrUrl.path) {
    return fileOrUrl.path;
  }
  if (typeof fileOrUrl === 'string') {
    if (fileOrUrl.startsWith('/uploads/')) return fileOrUrl.slice(1);
    if (fileOrUrl.startsWith('uploads/')) return fileOrUrl;
  }
  return null;
};

module.exports = {
  deleteFile,
  deleteFiles,
  clearDirectory,
  getFullImageUrl,
  getRelativePath,
};
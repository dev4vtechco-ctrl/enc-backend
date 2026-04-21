const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');

// uploads must be there
const ensureDir = async (dir) => {
  await fs.ensureDir(dir);
};

//hii ni ya kucreate folder ya kuweka images za izi models unaona
const createStorage = (entityType) => {
  return multer.diskStorage({
    destination: async (req, file, cb) => {
      let folder = 'uploads/';
      switch (entityType) {
        case 'event':
          folder += 'events';
          break;
        case 'ministry':
          folder += 'ministries';
          break;
        case 'story':
          folder += 'stories';
          break;
        case 'weekly':
          folder += 'weekly-highlights';
          break;
        default:
          folder += 'misc';
      }
      await ensureDir(folder);
      cb(null, folder);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      cb(null, `${entityType}-${uniqueSuffix}${ext}`);
    },
  });
};

// hii ni ya kufilter images 
const imageFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'), false);
  }
};

// configuring one image
const uploadSingle = (entityType) => {
  return multer({
    storage: createStorage(entityType),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: imageFilter,
  }).single('main_photo');
};

// configuring many images
const uploadMultiple = (entityType, maxCount) => {
  return multer({
    storage: createStorage(entityType),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: imageFilter,
  }).array('photos', maxCount);
};

// vile unaweza upload weekly images apa
const uploadWeekly = () => {
  return multer({
    storage: createStorage('weekly'),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: imageFilter,
  }).array('images', 20);
};

module.exports = {
  uploadSingle,
  uploadMultiple,
  uploadWeekly,
};
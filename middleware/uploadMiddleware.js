const { uploadSingle, uploadMultiple, uploadWeekly } = require('../config/multer');

// Wrapper to handle multer errors
const handleUpload = (uploadFunction) => (req, res, next) => {
  uploadFunction(req, res, (err) => {
    if (err) {
      return next(err);
    }
    next();
  });
};

const uploadEventMainPhoto = handleUpload(uploadSingle('event'));
const uploadEventPhotos = handleUpload(uploadMultiple('event', 10));

const uploadMinistryMainPhoto = handleUpload(uploadSingle('ministry'));
const uploadMinistryPhotos = handleUpload(uploadMultiple('ministry', 10));

const uploadStoryPhotos = handleUpload(uploadMultiple('story', 3));

const uploadWeeklyImages = handleUpload(uploadWeekly());

module.exports = {
  uploadEventMainPhoto,
  uploadEventPhotos,
  uploadMinistryMainPhoto,
  uploadMinistryPhotos,
  uploadStoryPhotos,
  uploadWeeklyImages,
};
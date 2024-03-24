const cloudinary = require('../config/cloudinary.config.js');

module.exports.uploadCloudinaryByURL = async ({url, folder, fileName}) => {
  const res = await cloudinary.uploader.upload(url, {
    // upload_preset: 'presetName', 
    folder: folder,
    public_id: fileName,
    overwrite: true,
  });
  return res.secure_url;
};

module.exports.uploadSingleCloudinaryByBuffer = async ({file, folder}) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream({
      folder: folder,
      public_id: file.originalname,
      overwrite: true,
    }, (error, result) => {
      if (error) {
        console.error(error);
        reject(error);
      }
      resolve(result.secure_url);
    }).end(file.buffer);
  });
};

module.exports.uploadMultipleCloudinaryByBuffer = async ({files, folder}) => {
  const promises = files.map(file => {
    return this.uploadSingleCloudinaryByBuffer({file, folder});
  });
  return Promise.all(promises);
};
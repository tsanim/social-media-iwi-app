const env = process.env.NODE_ENV || 'development';

const GridFsStorage = require('multer-gridfs-storage');
const { mongoUrl } = require('./config')[env];
const crypto = require('crypto');
const path = require('path');

module.exports = new GridFsStorage({
    url: mongoUrl,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }

                if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'
                    || file.mimetype === 'image/jpg') {
                    const filename = buf.toString('hex') + path.extname(file.originalname);
                    const fileInfo = {
                        filename: filename
                    };

                    resolve(fileInfo);
                } else {
                    return reject(new Error('Must be a valid extension.(".png", ".jpeg", ".jpg")'));
                }
            });
        });
    }
})
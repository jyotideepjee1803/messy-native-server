const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
const secretKey = process.env.QR_SECRET_KEY;
const KEY_SIZE = 256 / 8;
const IV_SIZE = 128 / 8;

const decrypt = (encryptedText) => {
    const encrypted = Buffer.from(encryptedText, 'base64');

    // Check if it starts with 'Salted__'
    const saltedMarker = Buffer.from('Salted__');
    const salt = encrypted.slice(8, 16);

    // Derive key and IV using OpenSSL's EVP_BytesToKey method
    const keyIv = evpBytesToKey(Buffer.from(secretKey), salt, KEY_SIZE, IV_SIZE);
    const key = keyIv.key;
    const iv = keyIv.iv;

    // Actual encrypted data
    const encryptedData = encrypted.slice(16);

    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encryptedData, undefined, 'utf8');
    decrypted += decipher.final('utf8');

    return JSON.parse(decrypted);
}

function evpBytesToKey(password, salt, keySize, ivSize) {
    let data = Buffer.alloc(0);
    let d = Buffer.alloc(0);
  
    while (data.length < keySize + ivSize) {
      d = crypto.createHash('md5').update(Buffer.concat([d, password, salt])).digest();
      data = Buffer.concat([data, d]);
    }
  
    return {
      key: data.slice(0, keySize),
      iv: data.slice(keySize, keySize + ivSize),
    };
}
module.exports = {decrypt};
import * as crypto from 'crypto';

export const urlsafeBase64Encode = function (jsonFlags: string) {
  var encoded = Buffer.from(jsonFlags).toString('base64');
  return base64ToUrlSafe(encoded);
};

export const base64ToUrlSafe = function (v: string) {
  return v.replace(/\//g, '_').replace(/\+/g, '-');
};

export const hmacSha1 = function (encodedFlags, secretKey) {
  const hmac = crypto.createHmac('sha1', secretKey);
  hmac.update(encodedFlags);
  return hmac.digest('base64');
};

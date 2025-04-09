import { Injectable } from '@nestjs/common';
import { AES, enc, mode, pad } from 'crypto-js';

@Injectable()
export class HelperEncryptionService {
  cryptoCipher = (data: any, key: string, iv: string): string => {
    const crypto = AES.encrypt(JSON.stringify(data), key, {
      mode: mode.CBC,
      padding: pad.Pkcs7,
      iv: enc.Utf8.parse(iv),
    });

    return crypto.toString();
  };

  cryptoDecipher = <T = any>(cipher: string, key: string, iv: string): T => {
    const data = AES.decrypt(cipher, key, {
      mode: mode.CBC,
      padding: pad.Pkcs7,
      iv: enc.Utf8.parse(iv),
    });

    return JSON.parse(data.toString(enc.Utf8));
  };
}

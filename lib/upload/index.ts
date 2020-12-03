import * as fs from 'fs';
import * as formstream from 'formstream';
import * as mime from 'mime';
import * as path from 'path';
import * as getCrc32 from 'crc32';
import { IConfig, IPolicyOption } from '../../types';
import { Zone } from './Zone';

abstract class Uploader {
  protected _config: IConfig = null;
  protected _policyOption: IPolicyOption = null;
  protected _zone: Zone = new Zone()
  constructor(config: IConfig, policyOption: IPolicyOption) {
    this._config = config;
    this._policyOption = policyOption;
  }

  uploadByKey(key: string, filePath: string) {

  }

  uploadWithoutKey(filePath: string) {

  }

  protected abstract putStream(uploadToken: string, key: string, stream: fs.ReadStream, putExtra): void;
}

export class PutExtra {
  fname: string = "";
  params: Object = {};
  mimeType: string = null;
  crc32: string = null;
  checkCrc: boolean = true;
  constructor(fname: string = "", params: Object = {}, mimeType: string = null, crc32: string = null, checkCrc: boolean = true) {
    this.fname = fname || '';
    this.params = params || {};
    this.mimeType = mimeType || null;
    this.crc32 = crc32 || null;
    this.checkCrc = checkCrc || true;
  }
}


export class FormUploader extends Uploader {


  async putFile(uploadToken: string, key: string, filePath: string, putExtra: PutExtra) {
    var fsStream = fs.createReadStream(filePath);

    if (!putExtra.mimeType) {
      putExtra.mimeType = mime.getType(filePath);
    }

    if (!putExtra.fname) {
      putExtra.fname = path.basename(filePath);
    }

    await this.putStream(uploadToken, key, fsStream, putExtra);
  }

  protected async putStream(uploadToken: string, key: string, stream: fs.ReadStream, putExtra: PutExtra): Promise<void> {
    putExtra = putExtra || new PutExtra();
    if (!putExtra.mimeType) {
      putExtra.mimeType = 'application/octet-stream';
    }

    if (!putExtra.fname) {
      putExtra.fname = key || 'fname';
    }


    const postForm = await this.createMultipartForm(uploadToken, key, stream, putExtra);

    console.log("postForm:", postForm);
  }

  async createMultipartForm(uploadToken: string, key: string, stream: fs.ReadStream, putExtra: PutExtra) {
    return await new Promise(async (resolve, reject) => {
      stream.on('error', function (err) {
        reject(err);
      });

      const assectKey = this._config.uploadCertificate.accessKey;
      const bucket = this._policyOption.bocket.name;;
      const zoneInfo = await this._zone.getZoneInfo(assectKey, bucket);

      var postForm = new formstream();

      postForm.field('token', uploadToken);
      if (key != null) {
        postForm.field('key', key);
      }
      postForm.stream('file', stream, putExtra.fname, putExtra.mimeType);

      // putExtra params
      for (var k in putExtra.params) {
        if (k.startsWith('x:')) {
          postForm.field(k, putExtra.params[k].toString());
        }
      }

      var fileBody = [];

      stream.on('data', function (data) {
        fileBody.push(data);
      });

      stream.on('end', function () {
        if (putExtra.checkCrc) {
          if (putExtra.crc32 == null) {
            const finalFileBody = Buffer.concat(fileBody);
            var bodyCrc32 = parseInt('0x' + getCrc32(finalFileBody));
            postForm.field('crc32', bodyCrc32);
          } else {
            postForm.field('crc32', putExtra.crc32);
            console.error('end2', putExtra.crc32);
          }
        }

        resolve(postForm)
      });
    })
  }

  putReq(config, postForm, callbackFunc) {
    // set up hosts order
    var upHosts = [];

    if (config.useCdnDomain) {
      if (config.zone.cdnUpHosts) {
        config.zone.cdnUpHosts.forEach(function (host) {
          upHosts.push(host);
        });
      }
      config.zone.srcUpHosts.forEach(function (host) {
        upHosts.push(host);
      });
    } else {
      config.zone.srcUpHosts.forEach(function (host) {
        upHosts.push(host);
      });
      config.zone.cdnUpHosts.forEach(function (host) {
        upHosts.push(host);
      });
    }

    var scheme = config.useHttpsDomain ? 'https://' : 'http://';
    var upDomain = scheme + upHosts[0];
    // rpc.postMultipart(upDomain, postForm, callbackFunc);
  }
}

export { default as Policy } from './Policy';
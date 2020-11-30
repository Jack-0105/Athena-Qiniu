import { IConfig, IPolicy, IPolicyOption, IUploadCertificate } from "../../../types";
import { UploadCertificate } from "../../auth";
import * as utils from "../../utils/base64Util";

export default class Policy implements IPolicy {
  private _uploadCertificate: IUploadCertificate = null;
  scope: string = undefined;
  expires: number = 3600;
  constructor(option: IPolicyOption, config?: IConfig) {
    this.scope = option?.bocket?.name ?? undefined;
    this._uploadCertificate = new UploadCertificate(option?.accessKey, option?.secretKey);
  }

  public generageToken(): string {
    const flags = this.getFlags();
    const encodedFlags = utils.urlsafeBase64Encode(flags);
    const encoded = utils.hmacSha1(encodedFlags, this._uploadCertificate.secretKey);
    const encodedSign = utils.base64ToUrlSafe(encoded);
    const uploadToken = `${this._uploadCertificate.accessKey}:${encodedSign}:${encodedFlags}`;
    return uploadToken;
  }

  private getFlags = (): string => {
    const keys = Object.keys(this).filter(key => key !== 'expires');
    const flags = new Object();
    keys.forEach(key => this[key] && (flags[key] = this[key]));
    flags['deadline'] = this.expires + Math.floor(Date.now() / 1000);
    return JSON.stringify(flags);
  }
}
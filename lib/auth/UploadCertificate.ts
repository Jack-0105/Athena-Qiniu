import { IUploadCertificate } from "../../types";

/**
 * @description 上传凭证
 */
export default class UploadCertificate implements IUploadCertificate {
  accessKey: string = undefined;
  secretKey: string = undefined;

  constructor(accessKey: string, secretKey: string) {
    if (!accessKey || accessKey.length === 0) throw new Error('accessKey error');
    if (!secretKey || secretKey.length === 0) throw new Error('secretKey error');
    this.accessKey = accessKey;
    this.secretKey = secretKey;
  }
}
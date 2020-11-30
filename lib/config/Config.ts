import { IConfig, IOption, IUploadCertificate, IZone } from "../../types";
import { UploadCertificate } from "../auth";

export default class Config implements IConfig {
  useHttpsDomain: boolean = false;
  useCdnDomain: boolean = false;
  zone: IZone = null;
  zoneExpire: number = -1;
  uploadCertificate: IUploadCertificate;

  constructor(option?: IOption) {
    this.useHttpsDomain = option?.useHttpsDomain ?? false;
    this.useCdnDomain = option?.useCdnDomain ?? false;
    this.zone = option?.zone ?? null;
    this.zoneExpire = option?.zoneExpire ?? -1;
    this.uploadCertificate = new UploadCertificate(option.accessKey, option.secretKey);
  }
}
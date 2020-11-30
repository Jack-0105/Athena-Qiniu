declare namespace AthenaQiniu {
  interface IZone {
    srcUpHosts: any;
    cdnUpHosts: any;
    ioHost: string;
    rsHost: string;
    rsfHost: string;
    apiHost: string;
  }

  interface IOption {
    useHttpsDomain?: boolean;
    useCdnDomain?: boolean;

    zone?: IZone;
    /**
     * @default -1
     */
    zoneExpire?: number;

    accessKey: string;
    secretKey: string;
  }

  interface IConfig {
    uploadCertificate: IUploadCertificate;
  }
}
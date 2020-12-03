declare namespace AthenaQiniu {
  interface IPolicyOption {
    // 上传空间
    bocket: IBocket,

    UploadCertificate?: IUploadCertificate,

    accessKey: string,
    secretKey: string
  }

  interface IPolicy {
    scope?: string;
    expires?: number;

    generageToken(): string;
  }
}
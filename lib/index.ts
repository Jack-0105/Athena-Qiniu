import { IConfig, IPolicy, IPolicyOption } from '../types';
import { FormUploader, Policy, PutExtra } from './upload';
import { Zone } from './upload/Zone';

import * as path from 'path';

export * from './auth';
export * from './config'
export * from './upload';

export default class AthenaQiniu {
  // 配置选项
  _config: IConfig;
  // 上传策略选项
  _policyOption: IPolicyOption;
  // 上传策略
  _policy: IPolicy;

  _formUpLoader: FormUploader;

  _zone: Zone = new Zone();

  constructor(config: IConfig, policyOptionolicy: IPolicyOption) {
    this._config = config;
    this._policyOption = policyOptionolicy;

    this._policy = new Policy(policyOptionolicy, config);

    this._formUpLoader = new FormUploader(config, policyOptionolicy);
  }

  async upload(filePath: string) {
    // 生成上传的token
    const uploadToken = this._policy.generageToken();
    await this._formUpLoader.putFile(uploadToken, path.basename(filePath), filePath, new PutExtra())
  }
}
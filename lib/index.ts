import { IConfig, IPolicyOption } from '../types';

export * from './auth';
export * from './config'
export * from './upload';

export default class AthenaQiniu {
  _config: IConfig;
  _policyOption: IPolicyOption;

  constructor(config: IConfig, policyOptionolicy: IPolicyOption) {
    this._config = config;
    this._policyOption = policyOptionolicy;
  }

  upload() {

  }
}
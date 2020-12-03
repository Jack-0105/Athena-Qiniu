import * as util from 'util';
import axios from 'axios';

class ZoneInfo {
  srcUpHosts: string[] = [];
  cdnUpHosts: string[] = [];
  ioHost: string = "";
  rsHost: string = "";
  rsfHost: string = "";
  apiHost: string = "";
  constructor(srcUpHosts: string[], cdnUpHosts: string[], ioHost: string, rsHost?: string, rsfHost?: string, apiHost?: string) {
    this.srcUpHosts = srcUpHosts || [];
    this.cdnUpHosts = cdnUpHosts || [];
    this.ioHost = ioHost || '';
    this.rsHost = rsHost || 'rs.qiniu.com';
    this.rsfHost = rsfHost || 'rsf.qiniu.com';
    this.apiHost = apiHost || 'api.qiniu.com';
    var dotIndex = this.ioHost.indexOf('.');
    if (dotIndex != -1) {
      var ioTag = this.ioHost.substring(0, dotIndex);
      var zoneSepIndex = ioTag.indexOf('-');
      if (zoneSepIndex != -1) {
        var zoneTag = ioTag.substring(zoneSepIndex + 1);
        switch (zoneTag) {
          case 'z1':
            this.rsHost = 'rs-z1.qiniu.com';
            this.rsfHost = 'rsf-z1.qiniu.com';
            this.apiHost = 'api-z1.qiniu.com';
            break;
          case 'z2':
            this.rsHost = 'rs-z2.qiniu.com';
            this.rsfHost = 'rsf-z2.qiniu.com';
            this.apiHost = 'api-z2.qiniu.com';
            break;
          case 'na0':
            this.rsHost = 'rs-na0.qiniu.com';
            this.rsfHost = 'rsf-na0.qiniu.com';
            this.apiHost = 'api-na0.qiniu.com';
            break;
          case 'as0':
            this.rsHost = 'rs-as0.qiniu.com';
            this.rsfHost = 'rsf-as0.qiniu.com';
            this.apiHost = 'api-as0.qiniu.com';
            break;
          default:
            this.rsHost = 'rs.qiniu.com';
            this.rsfHost = 'rsf.qiniu.com';
            this.apiHost = 'api.qiniu.com';
            break;
        }
      }
    }
  }
}

export class Zone {
  getZoneInfo = async (accessKey: string, bucket: string): Promise<{
    zoneInfo,
    zoneExpire
  }> => {
    const apiAddr = util.format('https://uc.qbox.me/v2/query?ak=%s&bucket=%s', accessKey, bucket);

    console.log(util.format('https://uc.qbox.me/v2/query?ak=%s&bucket=%s', accessKey, bucket))
    try {
      const reponseInfo = await axios.request({ url: apiAddr })
      if (reponseInfo.status !== 200) {
        throw new Error(reponseInfo.data);
      }

      const data = reponseInfo.data;
      const zoneExpire = data.ttl;
      const srcUpHosts = data.up.src.main.map(host => host);

      if (data.up.src.backup)
        data.up.src.backup.forEach(host => srcUpHosts.push(host));

      // read acc hosts
      const cdnUpHosts = data.up.acc.main.map(host => host);
      if (data.up.acc.backup) data.up.acc.backup.map(host => cdnUpHosts.push(host));

      var ioHost = data.io.src.main[0];
      const zoneInfo = new ZoneInfo(srcUpHosts, cdnUpHosts, ioHost);

      return {
        zoneInfo,
        zoneExpire
      }
    } catch (e) {
      throw e;
    }
  }
}

export default new Zone();
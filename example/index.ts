import AthenaQiniu, { Config, Policy, UploadCertificate } from '../lib';
import * as path from 'path';

var accessKey = 'bvBVBT65W4OVNt0KSXPK1upMZUJztD063m7sTxKw';
var secretKey = '7yJ0UDN2tE2rSh5uIKnCQd_BjEqx4wWw6DpasVgW';

const policyOption = {
  bocket: {
    name: 'jake'
  },
  accessKey,
  secretKey
}

// const policy = new Policy(policyOption);

// Zone.getZoneInfo(accessKey, 'jake');

// console.error(policy.generageToken())

const config = new Config({ accessKey, secretKey });
const athenaQiniu = new AthenaQiniu(config, policyOption);

const filePath = path.join(__dirname, './index.ts');

athenaQiniu.upload(filePath)
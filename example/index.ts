import { Config, Policy, UploadCertificate } from '../lib';

var accessKey = 'bvBVBT65W4OVNt0KSXPK1upMZUJztD063m7sTxKw';
var secretKey = '7yJ0UDN2tE2rSh5uIKnCQd_BjEqx4wWw6DpasVgW';
const uploadCertificate = new UploadCertificate(accessKey, secretKey);

const policyOption = {
  bocket: {
    name: '123'
  },
  accessKey,
  secretKey
}

const policy = new Policy(policyOption);

console.error(policy.generageToken())
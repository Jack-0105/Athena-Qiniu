import * as fs from 'fs';

abstract class Uploader {
  uploadByKey(key: string, filePath: string) {

  }

  uploadWithoutKey(filePath: string) {

  }

  protected abstract putStream(stream: fs.ReadStream): void;
}

export class FormUploader extends Uploader {

  putFile(filePath: string) {
    var fsStream = fs.createReadStream(filePath);

    this.putStream(fsStream);
  }

  protected putStream(stream: fs.ReadStream): void {

  }
}

export { default as Policy } from './Policy';
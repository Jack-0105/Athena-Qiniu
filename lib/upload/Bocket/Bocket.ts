import { IBocket } from "../../../types";

export default class Bocket implements IBocket {
  name: string = undefined;

  constructor(name: string) {
    if (typeof name !== 'string') throw new Error('block name type error');
    if (!name || name.length === 0) throw new Error('bocket name error');
    this.name = name;
  }
}
import { padZero } from '../helpers';

export class Giveaway {
  constructor(data) {
    this.id = data.giveaway_id;
    this.entries = data.entries;
    this.bid = data.bid;
  }

  get URL() {
    return `https://www.steamgifts.com/giveaway/${this.id}/`;
  }

  get bidHTML() {
    return padZero(this.bid, 4);
  }

  get entriesHTML() {
    return padZero(this.entries, 3);
  }

  static from(data) {
    return new Giveaway(data);
  }
}

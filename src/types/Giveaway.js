export class Giveaway {
  constructor(data) {
    this.id = data.giveaway_id;
    this.entries = data.entries;
    this.bid = data.bid;
  }

  get URL() {
    return `https://www.steamgifts.com/giveaway/${this.id}/`;
  }

  static from(data) {
    return new Giveaway(data);
  }
}

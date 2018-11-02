import * as humanizeDuration from 'humanize-duration';

export class Thread {
  constructor(data) {
    this.id = data.round_id;
    this.threadId = data.thread_id;
    this.bid = data.bid;
    this.bidTime = data.last_bid ? new Date(data.last_bid) : null;
    this.timeAgo = this.getTimeAgo();
    this.winner = { steamid: data.steam_id, username: data.username };
    this.status = data.status;
  }

  getTimeAgo() {
    if (!this.bidTime) return 'no bids  yet';
    return humanizeDuration(this.bidTime - Date.now(), { round: true }) + ' ago';
  }

  get threadURL() {
    return `https://www.steamgifts.com/discussion/${this.threadId}/?page=999`;
  }

  get winnerURL() {
    return `http://steamgifts.com/go/user/${this.winner.steamid}`;
  }

  get isOver() {
    return this.status === 255;
  }

  static from(data) {
    return new Thread(data);
  }
}

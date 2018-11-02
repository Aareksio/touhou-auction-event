import * as humanizeDuration from 'humanize-duration';
import { padZero } from '../helpers';

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
    return humanizeDuration(this.bidTime - Date.now(), { round: true, units: ['m', 's'] }) + ' ago';
  }

  get bidLocaleTime() {
    return this.bidTime ? `${this.bidTime.toLocaleDateString()} ${this.bidTime.toLocaleTimeString()}` : null;
  }

  get threadURL() {
    return `https://www.steamgifts.com/discussion/${this.threadId}/`;
  }

  get winnerURL() {
    return `http://steamgifts.com/go/user/${this.winner.steamid}`;
  }

  get isOver() {
    return this.status === 255;
  }

  get idHTML() {
    return padZero(this.id, 3);
  }

  get bidHTML() {
    return padZero(this.bid, 4);
  }

  static from(data) {
    return new Thread(data);
  }
}

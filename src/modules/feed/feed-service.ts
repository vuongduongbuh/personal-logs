import { AppConstants } from '../../app-constant';
import { HttpClient } from 'aurelia-fetch-client';

export class FeedService {

  httpClient: any;
  constructor() {
    this.httpClient = new HttpClient();
  }

  getFeeds() {
    return this.httpClient.fetch(AppConstants.baseUrl + "api/v1/posts", {
      method: "get"
    }).then(data => data.json());
  }

  createNewFeed(feed) {
    return this.httpClient.fetch(AppConstants.baseUrl + "api/v1/posts", {
      method: "post",
      body: feed
    }).then(data => data.json());
  }
}
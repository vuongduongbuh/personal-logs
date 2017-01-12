import { AppConstants } from '../../app-constant';
import { HttpClient, json } from 'aurelia-fetch-client';

export class FeedService {

  httpClient: any;
  constructor() {
    this.httpClient = new HttpClient();
  }

  getFeeds() {
    return this.httpClient.fetch(AppConstants.baseUrl + "api/v1/feeds", {
      method: "get"
    }).then(data => data.json());
  }

  createNewFeed(feed) {
    let form = new FormData()
    form.append('text', feed.text)

    return this.httpClient.fetch(AppConstants.baseUrl + "api/v1/feeds", {
      method: 'post',
      body: form
    })
  }
}
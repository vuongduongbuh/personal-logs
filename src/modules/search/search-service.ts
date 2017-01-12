import { AppConstants } from '../../app-constant';
import { HttpClient, json } from 'aurelia-fetch-client';

export class SearchService {

  httpClient: any;
  constructor() {
    this.httpClient = new HttpClient();
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
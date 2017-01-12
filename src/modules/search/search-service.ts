import { AppConstants } from '../../app-constant';
import { HttpClient, json } from 'aurelia-fetch-client';

export class SearchService {

  httpClient: any;
  constructor() {
    this.httpClient = new HttpClient();
  }

  search(input) {
    console.log(input);
    // return this.httpClient.fetch(AppConstants.baseUrl + "api/v1/search", {
    //   method: 'post',
    //   body: form
    // })
  }
}
import { AppConstants } from '../../app-constant';
import { HttpClient } from 'aurelia-fetch-client';

export class FeedService {
  constructor() {


  }

  getFeeds() {
    let client = new HttpClient();
    console.log(client);
    client.fetch(AppConstants.baseUrl + "api/v1/posts", 
      {
        method: "get"
      }
    )
      .then(data => {
        console.log(data)
        return data;
      });
  }
}
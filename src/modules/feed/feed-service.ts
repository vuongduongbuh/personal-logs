import { AppConstants } from '../../app-constant';
import { HttpClient, json, Interceptor } from 'aurelia-fetch-client';

export class FeedService {

  httpClient: any;
  constructor() {
    this.httpClient = new HttpClient();

    this.httpClient.configure(config => {
      config.withInterceptor(new SimpleInterceptor());
    });
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

export class SimpleInterceptor implements Interceptor {
  request(request: Request) {
    console.log(`I am inside of the interceptor doing a new request to ${request.url}`);
    return request;
  }

  responseError(response: Response) {
    console.log('Some error has occured! Run!')
    return response;
  }
}
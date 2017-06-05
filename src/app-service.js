import { inject } from 'aurelia-framework';
import { AppConstants } from './app-constant';
import { HttpClient, json, Interceptor } from 'aurelia-fetch-client';
import { AuthService } from './services/authService/auth-service';
import * as _ from 'lodash';

@inject(AuthService)
export class AppService {
  constructor(AuthService) {
    this.httpClient = new HttpClient();
    this.httpClient.configure(config => {
      config
        .withBaseUrl(AppConstants.baseUrl)
        .withDefaults({
          credentials: 'same-origin',
          headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('id_token')
          }
        })
        .withInterceptor({
          request(request) {
            return request;
          },
          response(response) {
            if (response.status == 401) {
              AuthService.login();
            }
            return response;
          }
        });
    });
  }

  getFeed() {
    return this.httpClient.fetch('/v1/feed', {
      method: 'get'
    }).then(data => data.json());
  }

  createEntry(entry) {
    return this.httpClient.fetch('/v1/feed', {
      method: 'post',
      body: json(entry)
    }).then(data => data.json());
  }

  updateEntry(entry) {
    return this.httpClient.fetch('/v1/feed/' + feed.id, {
      method: 'put',
      body: json(entry)
    }).then(data => data.json());
  }

  deleteEntry(entryId) {
    return this.httpClient.fetch('/v1/feed/' + entryId, {
      method: 'delete'
    });
  }

  search(data) {
    let form = new FormData()
    _.forEach(data, (value, key) => {
      form.append(key, value);
    });
    return this.httpClient.fetch('feeds/search', {
      method: 'post',
      body: form
    }).then(data => data.json());
  }
}

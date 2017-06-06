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

  _parseFeedEntry(entry) {
    if (entry.tags && entry.tags != '') {
      entry.hashtags = entry.tags.split(',')
    }
    return entry;
  }

  getFeed() {
    return this.httpClient
      .fetch('/v1/feed', {
        method: 'GET'
      })
      .then(data => {
        return data.json();
      })
      .then(entries => {
        return entries
          .map(entry => {
            return this._parseFeedEntry(entry);
          });
      });
  }

  createEntry(entry) {
    return this.httpClient.fetch('/v1/feed', {
      method: 'POST',
      body: json(entry)
    }).then(data => data.json());
  }

  updateEntry(updateEntry) {
    return this.httpClient
      .fetch('/v1/feed/' + updateEntry.id, {
        method: 'PUT',
        body: json(updateEntry)
      })
      .then(data => {
        return data.json();
      })
      .then(entry => {
        return this._parseFeedEntry(entry);
      });
  }

  deleteEntry(entryId) {
    return this.httpClient.fetch('/v1/feed/' + entryId, {
      method: 'DELETE'
    });
  }

  search(data) {
    let form = new FormData()
    _.forEach(data, (value, key) => {
      form.append(key, value);
    });
    return this.httpClient.fetch('feeds/search', {
      method: 'POST',
      body: form
    }).then(data => data.json());
  }
}

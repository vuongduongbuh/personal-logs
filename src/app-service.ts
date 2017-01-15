import { inject } from 'aurelia-framework';
import { AppConstants } from './app-constant';
import { HttpClient, json, Interceptor } from 'aurelia-fetch-client';
import { AuthService } from './services/authService/auth-service';
import * as _ from 'lodash';

@inject(AuthService)
export class AppService {
    httpClient: any;
    constructor(AuthService) {
        this.httpClient = new HttpClient();
        this.httpClient.configure(config => {
            config
                .withBaseUrl(AppConstants.baseUrl)
                .withDefaults({
                    credentials: 'same-origin',
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem("id_token")
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

    getFeeds() {
        return this.httpClient.fetch("feeds", {
            method: "get"
        }).then(data => data.json());
    }

    createNewFeed(feed) {
        let form = new FormData()
        _.forEach(feed, (value, key) => {
            form.append(key, value);
        });

        return this.httpClient.fetch("feeds", {
            method: 'post',
            body: form
        }).then(data => data.json());
    }

    deleteFeed(id) {
        return this.httpClient.fetch("feeds/" + id, {
            method: "delete"
        });
    }

    search(input) {
        return this.httpClient.fetch("feeds/" + encodeURI(input), {
            method: 'get'
        }).then(data => data.json());
    }
}
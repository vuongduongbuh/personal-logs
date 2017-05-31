import {Router} from 'aurelia-router';
import {inject} from 'aurelia-dependency-injection';
import {AppService} from '../../app-service';
import {AppConstants} from '../../app-constant';

@inject(Router, AppService)
export class Search {
  constructor(router, appService) {
    this.router = router;
    this.appService = appService;
    this.assetsUrl = AppConstants.assetsUrl;
    this.searchModel = {};
  }

  search() {
    this.isSearching = true;
    this.appService.search(this.searchModel)
      .then((feeds) => {
        this.isSearching = false;
        this.feeds = feeds;
        console.log(feeds);
      })
  }

  esc() {
    this.router.navigate("feeds");
  }
}

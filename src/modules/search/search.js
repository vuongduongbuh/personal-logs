import { Router } from 'aurelia-router';
import { inject } from 'aurelia-dependency-injection';
import { AppService } from '../../app-service';
@inject(Router, AppService)
export class Search {
    constructor(router, appService) {
        this.router = router;
        this.appService = appService;
        this.searchModel = {};
    }

    search() {
        this.isSearching = true;
        this.appService.search(this.searchModel)
            .then((feeds) => {
                this.isSearching = false;
            })
    }

    esc() {
        this.router.navigate("feeds");
    }
}
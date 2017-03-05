import { Router } from 'aurelia-router';
import { inject } from 'aurelia-dependency-injection';

@inject(Router)
export class Search {
    constructor(router) {
        this.router = router;
        console.log("Search");
    }

    search() {
        console.log("Search");
    }

    esc() {
        this.router.navigate("feeds");
    }
}
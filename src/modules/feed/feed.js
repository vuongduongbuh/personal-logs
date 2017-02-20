import { inject } from 'aurelia-dependency-injection';
import { BindingEngine } from 'aurelia-binding';
import { DialogService } from 'aurelia-dialog';
import { AppService } from '../../app-service';
import { AddLinkModal } from './link/link';
import { ConfirmDeleteModal } from './delete/delete';

import "spin";
import "ladda";
let Ladda = require('ladda');

@inject(BindingEngine, AppService, DialogService)
export class Feed {

    constructor(bindingEngine, appService, dialogService) {
        this.appService = appService;
        this.dialogService = dialogService;
        this.newFeed = {};
        this.number = 250;
        this.bindingEngine = bindingEngine;
        // subscribe
        let subscription = bindingEngine.propertyObserver(this.newFeed, 'text')
            .subscribe((newValue, oldValue) => {
                this.number = 250 - newValue.length;
            });

        this.getFeeds();
    }

    getFeeds() {
        this.appService.getFeeds()
            .then((feeds) => {
                this.feeds = feeds;
                console.log(this.feeds);
                return this.feeds;
            })

    }

    showModalConfirmDelete() {
        this.dialogService.open({ viewModel: ConfirmDeleteModal }).then(response => {
            if (!response.wasCancelled) {
                this.deleteFeed(id, idx);
            }
        });
    }

    showModalAddLink() {
        this.dialogService.open({ viewModel: AddLinkModal }).then(response => {
            if (!response.wasCancelled) {
                console.log("Add link");
            }
        });
    }

    postNewFeed() {
        let laddaDoneBtn = Ladda.create(document.querySelector('.pl-btn--done'));
        laddaDoneBtn.start();
        this.appService.postNewFeed(this.newFeed)
            .then((feed) => {
                //laddaDoneBtn.stop();
                console.log(feed);
            })
    }

    deleteFeed() {
        console.log("Delete feed");
    }
}
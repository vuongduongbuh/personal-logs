import { inject } from 'aurelia-dependency-injection';
import { BindingEngine } from 'aurelia-binding';
import { DialogService } from 'aurelia-dialog';
import { AppService } from '../../app-service';
import { AppConstants } from '../../app-constant';
import { AddLinkModal } from './link/link';
import { ConfirmDeleteModal } from './delete/delete';
import * as _ from 'lodash';
import "spin";
import "ladda";
let Ladda = require('ladda');

import 'hashtags';
let HashTags = require('hashtags');

@inject(BindingEngine, AppService, DialogService)
export class Feed {

    constructor(bindingEngine, appService, dialogService) {
        this.appService = appService;
        this.dialogService = dialogService;
        this.assetsUrl = AppConstants.assetsUrl;
        this.newFeed = {};
        this.number = 250;
        this.bindingEngine = bindingEngine;
        // subscribe
        let subscription = bindingEngine.propertyObserver(this.newFeed, 'rawText')
            .subscribe((newValue, oldValue) => {
                this.number = 250 - newValue.length;
            });
        this.getFeeds();
    }

    getFeeds() {
        this.appService.getFeeds()
            .then((feeds) => {
                this.feeds = feeds;
                console.log(feeds);
                return this.feeds;
            });

    }

    postNewFeed() {
        let laddaDoneBtn = Ladda.create(document.querySelector('.pl-btn--done'));
        laddaDoneBtn.start();

        //Check if file is selected
        if (this.selectedFiles) {
            this.newFeed.file = this.selectedFiles[0];
        }

        //Convert rawText to hashTags & text
        this.newFeed.text = this.newFeed.rawText;
        if (HashTags(this.newFeed.rawText)) {
            this.newFeed.hashTags = HashTags(this.newFeed.rawText);
            _.forEach(this.newFeed.hashTags, (value, key) => {
                this.newFeed.text = _.replace(this.newFeed.text, " " + value, "");
                this.newFeed.hashTags[key] = _.replace(value, "#", "");
            });
            this.newFeed.hashTags = _.join(this.newFeed.hashTags, " ");
        }
        //Add new feed
        this.appService.postNewFeed(this.newFeed)
            .then((feed) => {
                this.newFeed = {};
                this.removeSelectedFile();
                this.removeLink();
                laddaDoneBtn.stop();
                this.feeds.push(feed);
            }, () => {
                laddaDoneBtn.stop();
            });
    }

    showModalConfirmDelete() {
        this.dialogService.open({ viewModel: ConfirmDeleteModal }).then(response => {
            if (!response.wasCancelled) {
                this.deleteFeed(id, idx);
            }
        });
    }

    showModalAddLink() {
        this.dialogService.open({ viewModel: AddLinkModal, model: this.addedUrl }).then(response => {
            if (!response.wasCancelled) {
                this.newFeed.url = response.output;
            }
        });
    }

    deleteFeed(id) {
        console.log(id);
        this.appService.deleteFeed(id)
            .then((success) => {
                console.log(success);
            })
    }

    removeSelectedFile() {
        this.selectedFiles = null;
        this.isFileSelected = false;
    }

    removeLink() {
        this.newFeed.url = "";
        this.addedUrl = "";
    }

    triggerClickInputFiles() {
        let input = document.querySelector(".pl-input--files");
        input.click();
    }
}
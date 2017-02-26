import { inject } from 'aurelia-dependency-injection';
import { BindingEngine } from 'aurelia-binding';
import { DialogService } from 'aurelia-dialog';
import { AppService } from '../../app-service';
import { AppConstants } from '../../app-constant';
import { ConfirmDeleteModal } from './delete/delete';
import "autolinker";
let Autolinker = require('autolinker');

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
        this.isOpenConnectedFeed = [];
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
                console.log(feeds);
                this.feeds = feeds;
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
                this.newFeed.text = _.replace(this.newFeed.text, value, "");
                this.newFeed.hashTags[key] = _.replace(value, "#", "");
            });
            this.newFeed.hashTags = _.join(this.newFeed.hashTags, " ");
        }

        let autoLinkerOptions = {
            email: false,
            phone: false
        };

        let autoLinker = new Autolinker(autoLinkerOptions);

        let urlParser = autoLinker.parse(this.newFeed.rawText);

        if (urlParser.length) {
            this.newFeed.url = urlParser[0].url;
            this.newFeed.text = _.replace(this.newFeed.text, this.newFeed.url, "");
            console.log(this.newFeed.url);
        }
        //Add new feed
        this.appService.postNewFeed(this.newFeed)
            .then((feed) => {
                this.newFeed = {};
                this.removeSelectedFile();
                laddaDoneBtn.stop();
                this.feeds.unshift(feed);
            }, () => {
                laddaDoneBtn.stop();
            });
    }

    // showModalAddLink() {
    //     this.dialogService.open({ viewModel: AddLinkModal, model: this.addedUrl }).then(response => {
    //         if (!response.wasCancelled) {
    //             this.newFeed.url = response.output;
    //         }
    //     });
    // }

    showModalConfirmDelete(id, idx) {
        this.dialogService.open({ viewModel: ConfirmDeleteModal }).then(response => {
            if (!response.wasCancelled) {
                this.deleteFeed(id, idx);
            }
        });
    }

    deleteFeed(id, idx) {
        this.appService.deleteFeed(id)
            .then((success) => {
                this.feeds.splice(idx, 1);
                console.log(success);
            })
    }

    removeSelectedFile() {
        this.selectedFiles = null;
        this.isFileSelected = false;
    }

    triggerClickInputFiles() {
        let input = document.querySelector(".pl-input--files");
        input.click();
    }
}
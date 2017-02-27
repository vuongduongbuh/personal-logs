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
        this.newConnector = {};
        this.newFeedLength = 250;
        this.newConnectorLength = 250;
        this.bindingEngine = bindingEngine;
        // subscribe
        bindingEngine.propertyObserver(this.newFeed, 'rawText')
            .subscribe((newValue, oldValue) => {
                this.newFeedLength = 250 - newValue.length;
            });

        bindingEngine.propertyObserver(this.newConnector, 'rawText')
            .subscribe((newValue, oldValue) => {
                this.newConnectorLength = 250 - newValue.length;
            });

        this.getFeeds();
    }

    getFeeds() {
        this.appService.getFeeds()
            .then((feeds) => {
                this.feeds = feeds;
                this.feeds = this.reArrangeFeedsWithConnections();
                console.log(this.feeds);
                //this.deleteAllFeeds();
                return this.feeds;
            });
    }

    postNewFeed() {
        let laddaDoneBtn = Ladda.create(document.querySelector('.pl-btn--done'));
        laddaDoneBtn.start();

        this.newFeed = this.convertRawFeedToFeed(this.newFeed);
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

    postNewConnector(feed, idx) {
        this.newConnector = this.convertRawFeedToFeed(this.newConnector);
        this.newConnector.connectTo = feed.id;
        //Add new feed
        this.appService.postNewFeed(this.newConnector)
            .then((connectedFeed) => {
                this.feeds[idx].isConnectionOpened = false;
                this.feeds[idx].hasConnection = true;
                this.newConnector = {};
                this.feeds.splice(idx + 1, 0, connectedFeed);
            }, () => {
            });
    }

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
            });
    }

    removeSelectedFile() {
        this.newFeed.selectedFiles = null;
        this.isFileSelected = false;
    }

    triggerClickInputFiles() {
        let input = document.querySelector(".pl-input--files");
        input.click();
    }

    convertRawFeedToFeed(rawFeed) {
        let feed = rawFeed;

        //Check if file is selected
        if (feed.selectedFiles) {
            feed.file = feed.selectedFiles[0];
        }

        //Convert rawText to hashTags & text
        feed.text = feed.rawText;
        if (HashTags(feed.rawText)) {
            feed.hashTags = HashTags(feed.rawText);
            _.forEach(feed.hashTags, (value, key) => {
                feed.text = _.replace(feed.text, value, "");
                feed.hashTags[key] = _.replace(value, "#", "");
            });
            feed.hashTags = _.join(feed.hashTags, " ");
        }

        let autoLinkerOptions = {
            email: false,
            phone: false
        };

        let autoLinker = new Autolinker(autoLinkerOptions);
        let urlParser = autoLinker.parse(feed.rawText);

        if (urlParser.length) {
            feed.url = urlParser[0].url;
            feed.text = _.replace(feed.text, feed.url, "");
        }

        return feed;
    }

    openConnectionToAFeed(feed) {
        _.forEach(this.feeds, (value, key) => {
            this.feeds[key].isConnectionOpened = false;
        });

        feed.isConnectionOpened = true;
        this.isInputOnFocus = false;
    }

    reArrangeFeedsWithConnections() {
        let resultFeeds = _.filter(this.feeds, (value) => {
            return !value.connectTo;
        });

        let connectorFeeds = _.filter(this.feeds, (value) => {
            return value.connectTo;
        });

        _.forEach(resultFeeds, (result, resultKey) => {
            _.forEachRight(connectorFeeds, (connector, conectorKey) => {
                if (connector.connectTo === result.id) {
                    result.hasConnection = true;
                    resultFeeds.splice(resultKey + 1, 0, connector);
                }
            });
        });

        return resultFeeds;
    }

    deleteAllFeeds() {
        _.forEach(this.feeds, (value, key) => {
            this.appService.deleteFeed(value.id)
                .then((success) => {
                    console.log(success);
                })
        })
    }
}
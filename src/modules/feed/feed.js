import { inject } from 'aurelia-dependency-injection';
import { Router } from 'aurelia-router';
import { BindingEngine } from 'aurelia-binding';
import { DialogService } from 'aurelia-dialog';
import { AppService } from '../../app-service';
import { AlertService } from '../../services/alertService/alert-service';
import { AppConstants } from '../../app-constant';
import Autolinker from "autolinker";
import * as _ from 'lodash';
import moment from 'moment';
import "spin";
import Ladda from 'ladda';
import HashTags from 'hashtags';

import tooltipster from "tooltipster";
const dateFormat = 'h:mm A - DD MMM YYYY';

@inject(BindingEngine, AppService, DialogService, AlertService, Router)
export class Feed {
    constructor(bindingEngine, appService, dialogService, alertService, router) {
        this.appService = appService;
        this.dialogService = dialogService;
        this.alertService = alertService;
        this.assetsUrl = AppConstants.assetsUrl;
        this.router = router;
        this.isOpenConnectedFeed = [];
        this.newFeedLength = 250;
        this.newEditedFeedLength = 250;
        this.newConnectorLength = 250;
        this.bindingEngine = bindingEngine;

        //Get feeds when init controller
        this.getFeeds();
        setTimeout(() => {
            $('.btn-tooltip').tooltipster({
                theme: 'tooltipster-shadow',
                trigger: 'click',
                interactive: true,
                side: 'bottom'
            });
        }, 1000)
    }

    getFeeds() {
        this.appService.getFeeds()
            .then((feeds) => {
                this.feeds = feeds;
                _.forEach(this.feeds, (value, key) => {
                    value.createdAt = moment(value.createdAt).format(dateFormat);
                });
                this.feeds = this.reArrangeFeedsWithConnections();
                this.resetValueAfterActions();
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
                this.isInputOnFocus = false;
                laddaDoneBtn.stop();
                this.getFeeds();

                this.alertService.success("Post new feed successfully!");
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
                this.getFeeds();
                this.alertService.success("Add new connector successfully!");
            }, () => {
            });
    }

    showEditedFeed(feed, idx) {
        this.isInputOnFocus = false;
        _.forEach(this.feeds, (value, key) => {
            value.isEdited = false;
        });
        this.editedFeed = _.clone(feed);
        feed.isEdited = true;
        this.newEditedFeedLength = 250 - this.editedFeed.rawText.length;
        this.bindingEngine.propertyObserver(this.editedFeed, 'rawText')
            .subscribe((newValue, oldValue) => {
                this.newEditedFeedLength = 250 - newValue.trim().length;
            });
        $('.btn-tooltip').tooltipster('close');
    }

    updateFeed(feed, idx) {
        this.editedFeed = this.convertRawFeedToFeed(this.editedFeed);
        //Update feed
        this.appService.editFeed(this.editedFeed)
            .then((editedFeed) => {
                this.getFeeds();
                this.alertService.success("Save feed successfully!");
            }, () => {
            });

    }

    search() {
        this.router.navigate("search");
    }

    showModalConfirmDelete(feed, idx) {
        this.alertService.confirmDelete().then(() => {
            this.deleteFeed(feed, idx);
        });
        $('.btn-tooltip').tooltipster('close');
    }

    deleteFeed(feed, idx) {
        this.appService.deleteFeed(feed.id)
            .then((success) => {
                this.getFeeds();
                this.alertService.success("Delete feed successfully!");
            });

    }

    triggerClickInputFiles(flag) {
        let input = document.querySelector(".pl-input--files--" + flag);
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

        let loop = 10;
        while (loop) {
            _.forEach(resultFeeds, (result, resultKey) => {
                _.forEachRight(connectorFeeds, (connector, conectorKey) => {
                    if (connector.connectTo === result.id) {
                        result.hasConnection = true;
                        resultFeeds.splice(resultKey + 1, 0, connector);
                        connectorFeeds.splice(conectorKey, 1);

                    }
                });
            });
            loop--;
        }

        return resultFeeds;
    }

    resetValueAfterActions() {
        this.newFeed = {};
        this.bindingEngine.propertyObserver(this.newFeed, 'rawText')
            .subscribe((newValue, oldValue) => {
                this.newFeedLength = 250 - newValue.trim().length;
            });

        this.newConnector = {};
        this.bindingEngine.propertyObserver(this.newConnector, 'rawText')
            .subscribe((newValue, oldValue) => {
                this.newConnectorLength = 250 - newValue.trim().length;
            });

        this.editedFeed = {};
        this.bindingEngine.propertyObserver(this.editedFeed, 'rawText')
            .subscribe((newValue, oldValue) => {
                this.newEditedFeedLength = 250 - newValue.trim().length;
            });
    }
}
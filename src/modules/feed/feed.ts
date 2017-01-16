import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { AppService } from '../../app-service';
import { DialogService } from 'aurelia-dialog';
import { AppConstants } from '../../app-constant';
import { Modal } from './modal';
import * as moment from 'moment';
import * as Autolinker from "autolinker";
import * as _ from 'lodash';

@inject(AppService, DialogService)
export class Feed {

  appService: any;
  dialogService: any;
  feeds: Object[];
  newFeed: Object;
  selectedFeed: Object;
  isInputOnFocus: boolean;
  inputNewFeed: "";
  isSearchButtonClick: boolean;
  selectedFiles: any;
  isFileSelected: boolean;
  searchValue: "";
  autolikerOptions: {};
  constructor(appService, dialogService) {
    this.autolikerOptions = { newWindow: true, truncate: 60, className: 'pl-hashtag' };
    this.appService = appService;
    this.dialogService = dialogService;
    this.getFeeds();
  }

  getFeeds() {
    this.appService.getFeeds()
      .then((data) => {
        this.feeds = data;
        _.forEach(this.feeds, (value) => {
          value = this.convertFeedToView(value);
        });

        return this.feeds;
      })
  }

  showModalConfirmDelete(id, idx) {
    this.dialogService.open({ viewModel: Modal }).then(response => {
      if (!response.wasCancelled) {
        this.deleteFeed(id, idx);
      }
    });
  }

  deleteFeed(id, idx) {
    this.appService.deleteFeed(id)
      .then((data) => {
        this.feeds.splice(idx, 1);
      });
  }

  addNewFeed() {
    if (this.selectedFiles) {
      this.newFeed['file'] = this.selectedFiles[0];
      this.newFeed['tags'] += "image";
    }

    if (this.parseStringToVideoUrl(this.newFeed['text'])) {
      this.newFeed['tags'] = " video";
    }

    this.appService.createNewFeed(this.newFeed)
      .then(data => {
        this.isInputOnFocus = false;
        this.isFileSelected = false;
        this.selectedFiles = null;
        data = this.convertFeedToView(data);
        this.feeds.unshift(data);
        this.newFeed = {};
      });
  }

  search() {
    this.appService.search(this.searchValue)
      .then((data) => {
        this.feeds = data;
        _.forEach(this.feeds, (value) => {
          value = this.convertFeedToView(value);
        });
      })
  }

  selectFeed(idx, $event) {
    this.feeds.forEach((value) => {
      value['isSelected'] = false;
    });

    this.feeds[idx]['isSelected'] = true;
    $event.stopPropagation();
  }

  triggerClickInputFiles() {
    let input = document.getElementById("pl-input--files");
    input.click();
    this.isInputOnFocus = true;
  }

  undoSelectedFiles() {
    this.selectedFiles = null;
    this.isFileSelected = false;
  }

  reloadNewFeeds() {
    this.getFeeds();
    this.isSearchButtonClick = false;
  }

  convertFeedToView(feed) {
    if (feed.media) {
      feed.media = AppConstants.assetsUrl + feed.media;
    } else {
      feed['videoUrl'] = this.parseStringToVideoUrl(feed.text);
      if (feed.videoUrl) {
        feed.text = _.replace(feed.text, "watch?v=", "v/");
        feed.text = _.replace(feed.text, feed.videoUrl, "");
      }
    }

    feed.createdAt = moment(feed.createdAt).format('h:mm A - Do MMM YYYY');
    feed.text = Autolinker.link(feed.text, this.autolikerOptions);

    return feed;
  }

  triggerSearchModule() {
    this.isSearchButtonClick = true;
    this.feeds = [];
  }

  parseStringToVideoUrl(string) {
    let autoLinker = new Autolinker();
    let resultUrl = null;
    let containYoutubeLink = false;
    let containVimeoLink = false;
    let autoLinkerParser = autoLinker.parse(string);
    _.forEach(autoLinkerParser, (value) => {
      if (value.url) {
        containYoutubeLink = value.url.includes("youtube.com");
        containVimeoLink = value.url.includes("vimeo.com");
        if (containYoutubeLink || containVimeoLink) {
          resultUrl = value.url;
          return true;
        }
      }
    });

    if (containYoutubeLink) {
      resultUrl = _.replace(resultUrl, "watch?v=", "v/");
    }

    if (containVimeoLink) {
      resultUrl = _.replace(resultUrl, "/vimeo.com/", "/player.vimeo.com/video/");
    }

    return resultUrl;
  }
}

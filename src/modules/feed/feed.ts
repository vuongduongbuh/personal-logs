import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { AppService } from '../../app-service';
import { DialogService } from 'aurelia-dialog';
import { Modal } from './modal';
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
  searchValue: "";
  autolikerOptions: {};
  constructor(appService, dialogService) {
    this.autolikerOptions = { newWindow: true, truncate: 25, hashtag: 'twitter' };
    this.appService = appService;
    this.dialogService = dialogService;
    this.getFeeds();
  }

  showModalConfirmDelete(id, idx) {
    this.dialogService.open({ viewModel: Modal}).then(response => {
      if (!response.wasCancelled) {
        this.deleteFeed(id, idx);
      }

    });
  }
  getFeeds() {
    this.appService.getFeeds()
      .then((data) => {
        this.feeds = data;
        _.forEach(this.feeds, (value) => {

          value['videoUrl'] = this.parseStringToVideoUrl(value.text);

          if (value.videoUrl) {
            value.text = _.replace(value.text, value.videoUrl, "");
          }

          value.text = Autolinker.link(value.text, this.autolikerOptions);
        });

        return this.feeds;
      })
  }

  selectFeed(idx, $event) {
    this.feeds.forEach((value) => {
      value['isSelected'] = false;
    });

    this.feeds[idx]['isSelected'] = true;
    $event.stopPropagation();
  }

  deleteFeed(id, idx) {
    console.log(id, idx);
    this.appService.deleteFeed(id)
      .then((data) => {
        this.feeds.splice(idx, 1);
      })
  }

  isInputChange() {
    this.isInputOnFocus = true;
  }

  triggerClickInputFiles() {
    let input = document.getElementById("pl-input--files");
    input.click();
  }

  addNewFeed() {
    if (this.selectedFiles) {
      this.newFeed['file'] = this.selectedFiles[0];
    }

    this.appService.createNewFeed(this.newFeed)
      .then(data => {
        this.isInputOnFocus = false;
        data['videoUrl'] = this.parseStringToVideoUrl(data.text);

        if (data.videoUrl) {
          data.text = _.replace(data.text, data.videoUrl, "");
        }

        data.text = Autolinker.link(data.text, this.autolikerOptions);

        this.feeds.unshift(data);
        this.newFeed = {};
      });
  }

  search() {
    this.appService.search(this.searchValue)
      .then((data) => {
        this.feeds = data;
        _.forEach(this.feeds, (value) => {
          value.text = Autolinker.link(value.text, this.autolikerOptions);
        })
      })
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

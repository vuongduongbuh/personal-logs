import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { FeedService } from './feed-service';
import * as _ from 'lodash';

@inject(FeedService)
export class Feed {

  feedService: any;
  feeds: Object[];
  newFeed: Object;
  selectedFeed: Object;
  isInputOnFocus: boolean;
  inputNewFeed: "";
  selectedFiles: any;
  constructor(FeedService) {

    let autolikerOptions = { newWindow: true, truncate: 25, hashtag: 'twitter' };
    this.feedService = FeedService;
    this.feedService.getFeeds()
      .then(data => {
        this.feeds = data;
        _.forEach(this.feeds, (value) => {
          console.log(value);
          value.text = Autolinker.link(value.text, autolikerOptions);
          value.createdAt = new Date();
        })
      })
  }

  selectFeed(idx, $event) {

    this.feeds.forEach((value) => {
      value['isSelected'] = false;
    });

    this.feeds[idx]['isSelected'] = true;

    $event.stopPropagation();

  }

  isInputChange() {
    this.isInputOnFocus = true;
  }

  uploadFiles() {
    let input = document.getElementById("pl-input--files");

    input.click();
  }

  addNewFeed() {
    if (this.selectedFiles) {
      this.newFeed['media'] = this.selectedFiles[0];
    }

    console.log(this.newFeed);
    this.feedService.createNewFeed(this.newFeed)
      .then(data => {
        console.log(data);
      });
  }
}

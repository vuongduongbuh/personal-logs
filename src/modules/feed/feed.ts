import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { FeedService } from './feed-service';
import * as _ from 'lodash';

@inject(FeedService)
export class Feed {

  feedService: any;
  feeds: Object[];
  selectedFeed: Object;
  isInputOnFocus: boolean;
  inputNewFeed: "";
  constructor(FeedService) {

    let autolikerOptions = { newWindow: true, truncate: 25, hashtag: 'twitter' };
    this.feedService = FeedService;
    this.feedService.getFeeds()
      .then(data => {
        this.feeds = data;
        _.forEach(this.feeds, (value) => {
          console.log(value);
          value.text = Autolinker.link("Đây là #google #Iphone5", autolikerOptions);
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

  addNewFeed() {
    console.log(this.inputNewFeed);

    this.feedService.createNewFeed({
      text: this.inputNewFeed
    }).then(data => {
      console.log(data);
    })
  }
}

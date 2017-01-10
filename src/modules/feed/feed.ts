import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { FeedService } from './feed-service';

@inject(FeedService)
export class Feed {

  feedService: any;
  feeds: Object[];
  selectedFeed: Object;
  isInputOnFocus: boolean;
  inputNewFeed: "";
  constructor(FeedService) {
    this.feedService = FeedService;
    this.feeds = [{ value: 1 }, { value: 2 }, { value: 3 }, { value: 4 }];
  }

  selectFeed(idx) {

    this.feeds.forEach((value) => {
      value['isSelected'] = false;
    });

    this.feeds[idx]['isSelected'] = true;
  }

  isInputChange() {
    this.isInputOnFocus = true;
  }

  addNewFeed() {
    console.log(this.inputNewFeed);
  }
}

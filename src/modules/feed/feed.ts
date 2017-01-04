import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {FeedService} from './feed-service';

@inject(FeedService)
export class Feed {
  
  feedService: any;
  feeds: any[];
  constructor(FeedService){
    this.feedService = FeedService;
  }
}

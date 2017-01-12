import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { SearchService } from './search-service';

@inject(SearchService)
export class Search {
  searchService: any;
  searchValue: string;
  constructor(SearchService){
    this.searchService = SearchService;
  }

  search(){
    this.searchService.search(this.searchValue);
  }
}

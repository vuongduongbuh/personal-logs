import { Router } from 'aurelia-router';
import { inject } from 'aurelia-dependency-injection';
import { AppService } from '../../app-service';
import { AppConstants } from '../../app-constant';
import moment from 'moment';
import Autolinker from 'autolinker';
import * as _ from 'lodash';
import 'tooltipster';

const autolinker = new Autolinker({
  urls: {
    schemeMatches: true,
    wwwMatches: true,
    tldMatches: true
  },
  email: true,
  phone: true,
  mention: false,
  hashtag: false,

  stripPrefix: true,
  stripTrailingSlash: true,
  newWindow: true,

  truncate: {
    length: 0,
    location: 'end'
  },

  className: ''
});

@inject(Router, AppService)
export class Search {
  constructor(router, appService) {
    this.router = router;
    this.appService = appService;
    this.assetsUrl = AppConstants.assetsUrl;
    this.searchValue = "";
  }

  search() {
    this.isSearching = true;
    this.appService.search(this.searchValue)
      .then((entries) => {
        this.isSearching = false;
        this.entries = entries
          .map(entry => {
            entry.createdAt = moment(entry.createdAt).format(AppConstants.dateFormat);
            return entry;
          });
        this.entries = this.parseFeedEntries();

        console.log(this.entries);

        setTimeout(() => {
          $('.btn-tooltip').tooltipster({
            theme: 'tooltipster-shadow',
            trigger: 'click',
            interactive: true,
            side: 'bottom'
          });
        }, 500);
      })
  }

  esc() {
    this.router.navigate("feeds");
  }

  onEntryEdit(entry, idx) {
    this.entries = this.entries
      .map(entry => {
        entry.isEdited = false;
        return entry;
      });

    this.entryClone = _.cloneDeep(entry);
    this.entryClone.content = this.entryClone.rawContent;

    entry.isEdited = true;
    this.entryLength = 250 - this.entryClone.content.length;
    $('.btn-tooltip').tooltipster('close');
  }

  updateEntry(entry, idx) {
    let parsedEntry = this.convertTextToFeedEntry(this.entryClone);
    return this.appService.updateEntry(parsedEntry)
      .then(() => {
        return this.search();
      });
  }

  onEntryDelete(feed, idx) {
    this.deleteEntry(feed, idx);
    $('.btn-tooltip').tooltipster('close');
  }

  deleteEntry(feed, idx) {
    return this.appService.deleteEntry(feed.id)
      .then(() => {
        return this.search();
      });
  }

  convertTextToFeedEntry(rawEntry) {
    let entry = rawEntry;

    //Check if file is selected
    if (entry.selectedFiles) {
      entry.file = entry.selectedFiles[0];
    }
    entry.rawContent = entry.content;

    //parse links
    entry.content = autolinker.link(entry.content);

    return entry;
  }

  parseFeedEntries() {
    let entriesWithoutRelations = this.entries
      .filter(entry => {
        return !entry.relatedTo;
      });
    let relatedEntries = this.entries
      .filter(entry => {
        return entry.relatedTo;
      });

    let entriesLoopIdx = 10;
    while (entriesLoopIdx) {
      _.forEach(entriesWithoutRelations, (entry, entryIdx) => {
        _.forEachRight(relatedEntries, (relatedEntry, relatedEntryIdx) => {
          if (relatedEntry.relatedTo !== entry.id) {
            return;
          }

          entry.hasRelatedEntries = true;
          entriesWithoutRelations.splice(entryIdx + 1, 0, relatedEntry);
          relatedEntries.splice(relatedEntryIdx, 1);
        });
      });
      entriesLoopIdx--;
    }

    return entriesWithoutRelations;
  }
}

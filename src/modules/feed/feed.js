import { inject } from 'aurelia-dependency-injection';
import { Router } from 'aurelia-router';
import { BindingEngine } from 'aurelia-binding';
import { DialogService } from 'aurelia-dialog';
import { AppService } from '../../app-service';
import { AlertService } from '../../services/alertService/alert-service';
import { AppConstants } from '../../app-constant';
import Autolinker from 'autolinker';
import * as _ from 'lodash';
import moment from 'moment';
import 'spin';
import Ladda from 'ladda';
import HashTags from 'hashtags';
import 'tooltipster';

const dateFormat = 'h:mm A - DD MMM YYYY';
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

@inject(BindingEngine, AppService, DialogService, AlertService, Router)
export class Feed {
  constructor(bindingEngine, appService, dialogService, alertService, router) {
    this.appService = appService;
    this.dialogService = dialogService;
    this.alertService = alertService;
    this.assetsUrl = AppConstants.assetsUrl;
    this.router = router;
    this.isOpenConnectedFeed = [];
    this.bindingEngine = bindingEngine;

    this.entryClone = {};
    this.entryLength = 250;

    //Get feeds when init controller
    this.getFeed();
  }

  getFeed() {
    this.appService.getFeed()
      .then((entries) => {
        this.entries = entries
          .map(entry => {
            entry.createdAt = moment(entry.createdAt).format(dateFormat);
            return entry;
          });

        //reattach tooltipster
        setTimeout(() => {
          $('.btn-tooltip').tooltipster({
            theme: 'tooltipster-shadow',
            trigger: 'click',
            interactive: true,
            side: 'bottom'
          });
        }, 500);

        this.entries = this.parseFeedEentries();
        this.resetValueAfterActions();
        return this.entries;
      });
  }

  createEntry() {
    let laddaDoneBtn = Ladda.create(document.querySelector('.pl-btn--done'));
    laddaDoneBtn.start();

    this.newEntry = this.convertTextToFeedEntry(this.newEntry);
    return this.appService.createEntry(this.newEntry)
      .then(feed => {
        this.isInputOnFocus = false;
        laddaDoneBtn.stop();
        return this.getFeed();
      })
      .catch(err => {
        laddaDoneBtn.stop();
      });
  }

  createConnectedEntry(entry, idx) {
    this.newConnectedEntry = this.convertTextToFeedEntry(this.newConnectedEntry);
    this.newConnectedEntry.relatedTo = entry.id;

    return this.appService
      .createEntry(this.newConnectedEntry)
      .then(connectedFeed => {
        return this.getFeed();
      });
  }

  onEntryEdit(entry, idx) {
    this.isInputOnFocus = false;

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
        return this.getFeed();
      });
  }

  onEntryDelete(feed, idx) {
    this.deleteEntry(feed, idx);
    $('.btn-tooltip').tooltipster('close');
  }

  deleteEntry(feed, idx) {
    return this.appService.deleteEntry(feed.id)
      .then(() => {
        return this.getFeed();
      });
  }

  search() {
    this.router.navigate('search');
  }

  triggerClickInputFiles(flag) {
    document.querySelector('.pl-input--files--' + flag).click();
  }

  convertTextToFeedEntry(rawEntry) {
    let entry = rawEntry;

    //Check if file is selected
    if (entry.selectedFiles) {
      entry.file = entry.selectedFiles[0];
    }
    entry.rawContent = entry.content;

    //parse hashtags
    entry.tags = '';
    entry.hashtags = [];

    let hashtags = HashTags(entry.content);
    if (hashtags && hashtags.length) {
      hashtags = hashtags
        .map((hashtag, idx) => {
          entry.content = _.replace(entry.content, hashtag, '');
          hashtag = _.replace(hashtag, '#', '');
          return hashtag;
        });
      entry.tags = hashtags.join(',');
    }

    //parse links
    entry.content = autolinker.link(entry.content);

    return entry;
  }

  onEntryConnect(entry) {
    this.entries = this.entries
      .map(entry => {
        entry.isConnectionOpened = false;
        return entry;
      });

    entry.isConnectionOpened = true;
    this.isInputOnFocus = false;
  }

  parseFeedEentries() {
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

  resetValueAfterActions() {
    this.newEntry = {};
    this.bindingEngine.propertyObserver(this.newEntry, 'content')
      .subscribe((newValue, oldValue) => {
        this.entryLength = 250 - newValue.trim().length;
      });

    this.newConnectedEntry = {};
    this.bindingEngine.propertyObserver(this.newConnectedEntry, 'content')
      .subscribe((newValue, oldValue) => {
        this.newConnectedEntryLength = 250 - newValue.trim().length;
      });

    this.editedFeed = {};
    this.bindingEngine.propertyObserver(this.editedFeed, 'content')
      .subscribe((newValue, oldValue) => {
        this.newEditedFeedLength = 250 - newValue.trim().length;
      });
  }
}

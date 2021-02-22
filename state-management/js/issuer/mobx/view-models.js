import { makeObservable, observable, action } from 'https://unpkg.com/mobx/dist/mobx.esm.js?module';

import { Issue, load, save } from '../models.js';


export class IssuesVM {
  data;

  constructor() {
    makeObservable(this, {
      data: observable,
      add: action,
      load: action
    });
    this.load();
  }

  add(issue) {
    this.data.issues.push(issue);
    this.save();
  }

  load() {
    this.data = load();
  }

  save() {
    save(this.data);
  }
}

export class App {
  currentIssue = null;
  issuesVM = new IssuesVM();

  constructor() {
    makeObservable(this, {
      currentIssue: observable,
      issuesVM: observable,
      goTo: action
    });
    // this.issuesVM = new IssuesVM(); // non-observable in itself
  }

  goTo(issue) {
    this.currentIssue = issue;
  }
}

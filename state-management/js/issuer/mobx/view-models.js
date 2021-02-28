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
    this.data = observable(load());
  }

  save() {
    save(this.data);
  }
}

export const ISSUE = 'issue';
export const EDIT  = 'edit';
export const LIST  = 'list';

const LIST_PAGE = {
  page: LIST,
  issue: null
};

const EDIT_PAGE = {
  page: EDIT,
  issue: null
};

export function issuePage(issue) {
  return {
    page: ISSUE,
    issue
  }
}

export function listPage() {
  return LIST_PAGE;
}

export function editPage(issue) {
  return EDIT_PAGE;
}

export class App {
  currentPage = LIST_PAGE;
  issuesVM = new IssuesVM();

  constructor() {
    makeObservable(this, {
      currentPage: observable,
      issuesVM: observable,
      goTo: action
    });
    // this.issuesVM = new IssuesVM(); // non-observable in itself
  }

  goTo(page) {
    this.currentPage = page;
  }
}

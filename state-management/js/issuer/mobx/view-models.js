import { makeObservable, observable, action } from 'https://unpkg.com/mobx/dist/mobx.esm.js?module';

import { load, save } from '../models.js';


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
  issues = [];

  constructor() {
    makeObservable(this, {
      currentPage: observable,
      issues: observable,
      add: action,
      load: action,
      goTo: action
    });
    this.load();
  }

  add(issue) {
    this.issues.push(issue);
    this.save();
  }

  load() {
    this.issues = load().issues;
  }

  save() {
    save({issues: this.issues});
  }

  goTo(page) {
    this.currentPage = page;
  }
}

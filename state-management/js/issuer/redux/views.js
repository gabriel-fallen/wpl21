import { LitElement, html } from 'https://unpkg.com/lit-element/lit-element.js?module';

import { Issue } from '../models.js';
import { issueAdded } from './issues.js';
import { LIST, ISSUE, EDIT, goTo } from './pages.js';

import store from './store.js';


class IssueLineView extends LitElement {
  static get properties() {
    return {
      index: { attribute: false }
    };
  }

  render() {
    const state = store.getState();
    const issue = state.issues.issues[this.index];

    return html`<a href="#" @click=${this.goTo}>${issue.title}</a>`;
  }

  goTo(e) {
    e.preventDefault();
    store.dispatch(goTo(ISSUE, this.index));
  }
}

customElements.define('issue-line-view-store', IssueLineView);


class IssueView extends LitElement {
  static get properties() {
    return {
      index: { attribute: false }
    };
  }

  render() {
    const state = store.getState();
    const issue = state.issues.issues[this.index];

    return html`
      <h2>${issue.title}</h2>
      <p><strong>${issue.assignee ? issue.assignee : "Unassigned"}</strong></p>
      <p>${issue.description}</p>
      <p><a href="#" @click=${this.goBack}>To list</a></p>
    `;
  }

  goBack(e) {
    e.preventDefault();
    store.dispatch(goTo(LIST));
  }
}

customElements.define('issue-view-store', IssueView);


class IssueEditView extends LitElement {
  render() {
    return html`
      <link rel="stylesheet" href="css/spectre.min.css">
      <form class="form-horizontal">
        <div class="form-group">
          <div class="col-1 col-sm-12">
            <label class="form-label" for="title">Title: </label>
          </div>
          <div class="col-2 col-sm-12">
            <input class="form-input" id="title" .value="" />
          </div>
        </div>
        <div class="form-group">
          <div class="col-1 col-sm-12">
            <label class="form-label" for="assignee">Assignee: </label>
          </div>
          <div class="col-2 col-sm-12">
            <input class="form-input" id="assignee" .value="" />
          </div>
        </div>
        <div class="form-group">
          <div class="col-1 col-sm-12">
            <label class="form-label" for="description">Description: </label>
          </div>
          <div class="col-2 col-sm-12">
            <textarea class="form-input" id="description" rows="4" .value=""></textarea>
          </div>
        </div>
        <div class="form-group">
          <div class="col-1 col-sm-4">
            <button class="btn btn-primary" @click=${this.save}>Add</button>
          </div>
        </div>
      </form>
    `;
  }

  save(e) {
    e.preventDefault();

    const title = this.shadowRoot.querySelector('#title').value;
    const assignee = this.shadowRoot.querySelector('#assignee').value;
    const description = this.shadowRoot.querySelector('#description').value;

    const issue = new Issue(title, description, assignee);
    // console.log(`issue-edit-view-store saving ${JSON.stringify(issue)}`);
    store.dispatch(issueAdded(issue));
  }
}

customElements.define('issue-edit-view-store', IssueEditView);


function renderList(issues) {
  return html`
    <ul>
      ${issues.map((_issue, index) => html`<li><issue-line-view-store .index="${index}"></issue-line-view-store></li>`)}
    </ul>
    <hr />
    <issue-edit-view-store></issue-edit-view-store>
  `;
}

function renderSingle(currentIndex) {
  return html`<issue-view-store .index="${currentIndex}"></issue-view-store>`;
}

class AppView extends LitElement {
  constructor() {
    super();
    store.subscribe(() => this.requestUpdate());
  }

  render() {
    const state = store.getState();
    const page  = state.currentIndex;

    return html`
      <h2>Issuer</h2>
      ${(page.page === ISSUE) ? renderSingle(page.index) : renderList(state.issues.issues)}
    `;
  }
}

customElements.define('store-view', AppView);

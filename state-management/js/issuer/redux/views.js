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


class ToList extends LitElement {
  render() {
    return html`<p><a href="#" @click=${this.goBack}>To list</a></p>`;
  }

  goBack(e) {
    e.preventDefault();
    store.dispatch(goTo(LIST));
  }
}

customElements.define('to-list', ToList);


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
      <to-list></to-list>
    `;
  }
}

customElements.define('issue-view-store', IssueView);


class IssueEditView extends LitElement {
  render() {
    return html`
      <link rel="stylesheet" href="css/spectre.min.css">
      <to-list></to-list>
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

    const title = this.shadowRoot.querySelector('#title');
    const assignee = this.shadowRoot.querySelector('#assignee');
    const description = this.shadowRoot.querySelector('#description');

    const issue = new Issue(title.value, description.value, assignee.value);
    // console.log(`issue-edit-view-store saving ${JSON.stringify(issue)}`);

    title.value = '';
    assignee.value = '';
    description.value = '';

    store.dispatch(issueAdded(issue));
  }
}

customElements.define('issue-edit-view-store', IssueEditView);


function renderList(issues) {
  return html`
    <ul>
      ${issues.map((_issue, index) => html`<li><issue-line-view-store .index="${index}"></issue-line-view-store></li>`)}
    </ul>
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

    const header = html`
      <h2>Issuer</h2>
      <p><a href="#" @click=${this.goEdit}>New issue</a></p>
      <hr />
    `;

    switch(page.page) {
      case ISSUE:
        return html`
          ${header}
          ${renderSingle(page.index)}
        `;
      case EDIT:
        return html`
          ${header}
          <issue-edit-view-store></issue-edit-view-store>
        `;
      default:
        return html`
          ${header}
          ${renderList(state.issues.issues)}
        `;
    }
  }

  goEdit(e) {
    e.preventDefault();
    store.dispatch(goTo(EDIT));
  }
}

customElements.define('store-view', AppView);

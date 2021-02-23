import { LitElement, html } from 'https://unpkg.com/lit-element/lit-element.js?module';

import { Issue } from '../models.js';
import { issueAdded } from './issues.js';
import { goTo } from './pages.js';

import store from './store.js';


export class IssueLineView extends LitElement {
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

  goTo() {
    store.dispatch(goTo(this.index));
  }
}

customElements.define('issue-line-view-store', IssueLineView);


export class IssueView extends LitElement {
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

  goBack() {
    store.dispatch(goTo(null));
  }
}

customElements.define('issue-view-store', IssueView);


export class IssueEditView extends LitElement {
  render() {
    return html`
      <form>
        <label for="title">Title: </label>
        <input id="title" .value="" />
        <label for="assignee">Assignee: </label>
        <input id="assignee" .value="" />
        <label for="description">Description: </label>
        <input id="description" .value="" />
        <button @click=${this.save}>Add</button>
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

export class AppView extends LitElement {
  constructor() {
    super();
    store.subscribe(() => this.requestUpdate());
  }

  render() {
    const state = store.getState();

    return html`
      <h2>Issuer</h2>
      ${(state.currentIndex !== null) ? renderSingle(state.currentIndex) : renderList(state.issues.issues)}
    `;
  }
}

customElements.define('store-view', AppView);

import { autorun } from 'https://unpkg.com/mobx/dist/mobx.esm.js?module';
import { LitElement, html } from 'https://unpkg.com/lit-element/lit-element.js?module';
import { MobxLitElement } from 'https://unpkg.com/@adobe/lit-mobx/lit-mobx.js?module';

import { Issue } from '../models.js';
import { App } from './view-models.js';


class IssueLineView extends MobxLitElement {
  static get properties() {
    return {
      app: { attribute: false },
      issue: { attribute: false }
    };
  }

  render() {
    return html`<a href="#" @click=${this.goTo}>${this.issue.title}</a>`;
  }

  goTo(e) {
    e.preventDefault();
    this.app.goTo(this.issue);
  }
}

customElements.define('issue-line-view', IssueLineView);


class IssueView extends MobxLitElement {
  static get properties() {
    return {
      app: { attribute: false },
      issue: { attribute: false }
    };
  }

  render() {
    return html`
      <h2>${this.issue.title}</h2>
      <p><strong>${this.issue.assignee ? this.issue.assignee : "Unassigned"}</strong></p>
      <p>${this.issue.description}</p>
      <p><a href="#" @click=${this.goBack}>To list</a></p>
    `;
  }

  goBack(e) {
    e.preventDefault();
    this.app.goTo(null);
  }
}

customElements.define('issue-view', IssueView);


class IssueEditView extends MobxLitElement {
  static get properties() {
    return {
      app: { attribute: false }
    };
  }

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
    // console.log(`issue-edit-view saving ${JSON.stringify(issue)}`);
    this.app.issuesVM.add(issue);
  }
}

customElements.define('issue-edit-view', IssueEditView);


function renderList(app, issues) {
  return html`
    <ul>
      ${issues.map(issue => html`<li><issue-line-view .app="${app}" .issue="${issue}"></issue-line-view></li>`)}
    </ul>
    <hr />
    <issue-edit-view .app="${app}"></issue-edit-view>
  `;
}

function renderSingle(app, currentIssue) {
  return html`<issue-view .app="${app}" .issue="${currentIssue}"></issue-view>`;
}

class AppView extends MobxLitElement {
  app = new App();

  constructor() {
    super();
    autorun(() => console.log(`Issues: [${this.app.issuesVM.data.issues.map(i => i.title).join(', ')}]`));
  }

  render() {
    return html`
      <h2>Issuer</h2>
      ${this.app.currentIssue ? renderSingle(this.app, this.app.currentIssue) : renderList(this.app, this.app.issuesVM.data.issues)}
    `;
  }
}

customElements.define('app-view', AppView);

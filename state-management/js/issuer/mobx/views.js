import { autorun } from 'https://unpkg.com/mobx/dist/mobx.esm.js?module';
import { LitElement, html } from 'https://unpkg.com/lit-element/lit-element.js?module';
import { MobxLitElement } from 'https://unpkg.com/@adobe/lit-mobx/lit-mobx.js?module';

import { Issue } from '../models.js';
import { editPage, issuePage, listPage, App, ISSUE, EDIT } from './view-models.js';


class IssueLineView extends MobxLitElement {
  static get properties() {
    return {
      app: { attribute: false },
      issue: { attribute: false }
    };
  }

  render() {
    if (this.issue.active)
      return html`<a href="#" @click=${this.goTo}>${this.issue.title}</a>`;

    return html`<a href="#" @click=${this.goTo}><strike><i>${this.issue.title}</i></strike></a>`;
  }

  goTo(e) {
    e.preventDefault();
    this.app.goTo(issuePage(this.issue));
  }
}

customElements.define('issue-line-view', IssueLineView);


class ToList extends LitElement {
  static get properties() {
    return {
      app: { attribute: false }
    };
  }

  render() {
    return html`<p><a href="#" @click=${this.goBack}>To list</a></p>`;
  }

  goBack(e) {
    e.preventDefault();
    this.app.goTo(listPage());
  }
}

customElements.define('to-list', ToList);


class IssueView extends MobxLitElement {
  static get properties() {
    return {
      app: { attribute: false },
      issue: { attribute: false }
    };
  }

  render() {
    return html`
      <to-list .app="${this.app}"></to-list>
      <h2>${this.issue.title}</h2>
      <p><strong>${this.issue.assignee ? this.issue.assignee : "Unassigned"}</strong></p>
      <div class="form-group">
        <label class="form-checkbox">
          <input type="checkbox" ?checked="${this.issue.active}" @click=${this.toggle} />
          <i class="form-icon"></i> Active
        </label>
      </div>
      <p>${this.issue.description}</p>
    `;
  }

  toggle() {
    this.issue.active = !this.issue.active;
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
      <to-list .app="${this.app}"></to-list>
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
    // console.log(`issue-edit-view saving ${JSON.stringify(issue)}`);

    title.value = '';
    assignee.value = '';
    description.value = '';

    this.app.add(issue);
  }
}

customElements.define('issue-edit-view', IssueEditView);


function renderList(app, issues) {
  return html`
    <ul>
      ${issues.map(issue => html`<li><issue-line-view .app="${app}" .issue="${issue}"></issue-line-view></li>`)}
    </ul>
  `;
}

function renderSingle(app, currentIssue) {
  return html`<issue-view .app="${app}" .issue="${currentIssue}"></issue-view>`;
}

class AppView extends MobxLitElement {
  app = new App();

  render() {
    const header = html`
      <h2>Issuer</h2>
      <p><a href="#" @click=${this.goEdit}>New issue</a></p>
      <hr />
    `;

    switch(this.app.currentPage.page) {
      case ISSUE:
        return html`
          ${header}
          ${renderSingle(this.app, this.app.currentPage.issue)}
        `;
      case EDIT:
        return html`
          ${header}
          <issue-edit-view .app="${this.app}"></issue-edit-view>
        `;
      default:
        return html`
          ${header}
          ${renderList(this.app, this.app.issues)}
        `;
    }
  }

  goEdit(e) {
    e.preventDefault();
    this.app.goTo(editPage());
  }
}

customElements.define('app-view', AppView);

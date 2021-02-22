/** Application models and Local Store access. */

export class Issue {
  constructor(title = 'New issue', description = 'Issue description', assignee) {
    this.title = title;
    this.description = description;
    this.assignee = assignee;
    this.active = true;
  }
}

export class Issues {
  constructor(issues = []) {
    this.issues = issues;
  }

  add(issue) {
    this.issues.push(issue);
  }
}


const namespace = "issues-management-example-wpl";

export function save(data) {
  if (data)
    localStorage[namespace] = JSON.stringify(data);
}

export function load() {
  let store = localStorage[namespace];
  let issues = store && JSON.parse(store) || { issues: [] };
  return new Issues(issues.issues);
}

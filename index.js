'use strict';

const heimdalljs = require('heimdalljs');
const chalk = require('chalk');

// TODO: unit test
function progress() {
  let current = heimdalljs.current;
  let stack = [current.id.name];
  while (current = current.parent) { // eslint-disable-line
    stack.push(current.id.name);
  }
  return stack.filter(x => x !== 'heimdall').reverse().join(' > ');
}

function formateProgress(progressText) {
  return chalk.green('building... ') + (progressText ? `[${progressText}]`: '');
}
module.exports = {
  name: require('./package').name,
  preBuild() {
    // TODO: extract and test
    if (this.ui.ci) { return; }
    this.ui.startProgress(formateProgress(progress()))
    clearInterval(this.interval);
    this.interval = setInterval(() => {
      this.ui.spinner.text = formateProgress(progress());
    }, this.ui.spinner.interval);
  },
  postBuild() {
    // TODO: extract and test
    if (this.ui.ci) { return; }
    this.ui.stopProgress();
    clearInterval(this.interval);
  },
  buildError() {
    // TODO: extract and test
    this.ui.stopProgress();
    clearInterval(this.interval);
  }
};

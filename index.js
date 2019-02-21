'use strict';

const heimdalljs = require('heimdalljs');
const chalk = require('chalk');

function progress() {
  let current = heimdalljs.current;
  let stack = [current.id.name];
  while (current = current.parent) { // eslint-disable-line
    stack.push(current.id.name);
  }
  return stack.filter(x => x !== 'heimdall' && x !== 'command' && x !== 'build').reverse().join(' > ')
}

module.exports = {
  name: require('./package').name,
  preBuild() {
    if (this.ui.ci ) { return; }
    this.ui.startProgress(progress())
    clearInterval(this.interval);
    this.interval = setInterval(() => {
      this.ui.spinner.text = chalk.green('building... ') + `[${progress()}]`;
    }, 1000/60);
  },
  postBuild() {
    if (this.ui.ci ) { return; }
    this.ui.stopProgress();
    clearInterval(this.interval);
  }
};

'use strict';

const heimdalljs = require('heimdalljs');
const chalk = require('chalk');
const ora = require('ora');

// TODO: unit test
function progress() {
  let current = heimdalljs.current;
  let stack = [current.id.name];
  while (current = current.parent) { // eslint-disable-line
    stack.push(current.id.name);
  }
  return stack.filter(x => x !== 'heimdall').reverse().join(' > ');
}

module.exports = {
  name: require('./package').name,
  preBuild() {
    // TODO: extract and test
    if (this.ui.ci) { return; }
    this.ui.stopProgress()
    this.spinner =  ora(chalk.green('building... ')).start();
    clearInterval(this.interval);
    this.interval = setInterval(() => {
      let progressText =  progress();
      this.spinner.text = chalk.green('building... ') + (progressText ? `[${progressText}]`: '');
    }, 1000/60);
  },
  postBuild() {
    // TODO: extract and test
    if (this.ui.ci) { return; }
    this.spinner.stop();
    clearInterval(this.interval);
  },
  buildError() {
    // TODO: extract and test
    this.spinner.stop();
    clearInterval(this.interval);
  }
};

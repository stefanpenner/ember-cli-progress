'use strict';

const heimdalljs = require('heimdalljs');
const chalk = require('chalk');
const ora = require('ora');

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
    if (this.ui.ci) { return; }
    this.ui.stopProgress()
    this.spinner =  ora(chalk.green('building... ')).start();
    clearInterval(this.interval);
    this.interval = setInterval(() => {
      this.spinner.text = chalk.green('building... ') + `[${progress()}]`;
    }, 1000/60);
  },
  postBuild() {
    if (this.ui.ci) { return; }
    this.spinner.stop();
    clearInterval(this.interval);
  }
};

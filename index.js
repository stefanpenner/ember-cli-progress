'use strict';

const heimdalljs = require('heimdalljs');
const chalk = require('chalk');

function progress() {
  let current = heimdalljs.current;
  let name = current.id.name;
  while (current = current.parent) {
    name = `${current.id.name} > ${name}\n`
  }
  return name;
}

module.exports = {
  name: require('./package').name,
  preBuild() {
    if (this.ui.ci) { return; }
    this.ui.startProgress(progress())
    clearInterval(this.interval);
    this.interval = setInterval(() => {
      this.ui.spinner.text = chalk.green('building... ') + progress();
    }, 1000/60);
  },
  postBuild() {
    if (this.ui.ci) { return; }
    this.ui.stopProgress();
    clearInterval(this.interval);
  }
};

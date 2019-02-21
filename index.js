'use strict';

const heimdalljs = require('heimdalljs');
const chalk = require('chalk');

function progress() {
  let current = heimdalljs.current;
  let name = current.id.name;
  do {
    name = `${current.id.name} > ${name}\n`
  } while (current = current.parent)
  return name;
}

module.exports = {
  name: require('./package').name,
  preBuild() {
    this.ui.startProgress(progress())
    clearInterval(this.interval);
    this.interval = setInterval(() => {
      this.ui.spinner.text = chalk.green('building... ') + progress();
    }, 1000/60);
  },
  postBuild() {
    this.ui.stopProgress();
    clearInterval(this.interval);
  }
};

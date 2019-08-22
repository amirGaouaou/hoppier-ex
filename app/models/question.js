// Example model


function Question (opts) {
  if(!opts) opts = {};
  this.title = opts.title || '';
  this.description = opts.description || '';
  this.link = opts.link || '';
}

module.exports = Question;


'use strict';
var util = require('util');
var path = require('path');
var sys = require('sys');
var exec = require('child_process').exec;
var fs = require('fs');
var yeoman = require('yeoman-generator');


var HashiramaGenerator = module.exports = function HashiramaGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.on('end', function () {
    this.installDependencies({ skipInstall: options['skip-install'] });
  });

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(HashiramaGenerator, yeoman.generators.Base);

HashiramaGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  // have Yeoman greet the user.
  console.log(this.yeoman);

  var prompts = [{
    type: 'checkbox',
    name: 'features',
    message: 'Select your features?',
    choices: [
      {
        name: 'SVN',
        value: 'svn'
      },
      {
        name: 'GIT',
        value: 'git',
        checked: true
      },
      {
        name: 'Compass Base',
        value: 'compassBase'
      }
    ]
  }];

  this.prompt(prompts, function (answers) {
    var features = answers.features;

    // manually deal with the response, get back and store the results.
    // we change a bit this way of doing to automatically do this in the self.prompt() method.
    this.git = features.indexOf('git') !== -1;
    this.svn = features.indexOf('svn') !== -1;
    this.compassBase = features.indexOf('compassBase') !== -1;

    cb();
  }.bind(this));

};

HashiramaGenerator.prototype.configs = function configs() {
  this.template('Gruntfile.js');

  this.copy('_package.json', 'package.json');
  this.copy('bowerrc', '.bowerrc');
  this.copy('_bower.json', 'bower.json');
  this.copy('_config.rb', 'config.rb');
};

HashiramaGenerator.prototype.projectfiles = function projectfiles() {
  this.copy('editorconfig', '.editorconfig');
  this.copy('jshintrc', '.jshintrc');
};

HashiramaGenerator.prototype.versionControl = function versionControl() {
  if (this.git) {
    this.copy('ignore', '.gitignore');
  }

  if (this.svn) {
    this.copy('ignore', '.svnignore');
    exec("svn propset svn:ignore -F .svnignore .", function(error, stdout, stderr) {
      sys.puts(stdout) 
    });
  }
};

HashiramaGenerator.prototype.boilerplate = function boilerplate() {
  this.mkdir('assets');

  this.mkdir('assets/src');
  this.mkdir('assets/src/js');
  this.mkdir('assets/src/js/app');
  this.mkdir('assets/src/css');

  this.mkdir('assets/build');
  this.mkdir('assets/build/js');
  this.mkdir('assets/build/css');  
  this.mkdir('assets/build/img');
  this.mkdir('assets/build/fonts');

  this.copy('main.js','assets/src/js/app/main.js');

  if(this.compassBase){
    this.mkdir('assets/src/css/base');
    this.copy('compassBase/_fallback.scss','assets/src/css/base/_fallback.scss');
    this.copy('compassBase/_layout.scss','assets/src/css/base/_layout.scss');
    this.copy('compassBase/_preset.scss','assets/src/css/base/_preset.scss');
    this.copy('compassBase/_print.scss','assets/src/css/base/_print.scss');
    this.copy('compassBase/_reset.scss','assets/src/css/base/_reset.scss');
    this.copy('compassBase/_typography.scss','assets/src/css/base/_typography.scss');
    this.copy('main.base.scss','assets/src/css/main.scss');
  }else{
    this.copy('main.scss','assets/src/css/main.scss');
  }

  this.copy('index.html','index.html');
};
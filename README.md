# Generator-hashirama
[![Build Status](https://secure.travis-ci.org/tisvasconcelos/generator-hashirama.png?branch=master)](https://travis-ci.org/tisvasconcelos/generator-hashirama)

A generator for Yeoman.

## Getting started
- Make sure you have [yo](https://github.com/yeoman/yo) installed:
    `npm install -g yo`
- Install the generator: `npm install -g generator-hashirama`
- Run: `yo hashirama`

## Options

### Grunt commands

- watch event:
	Run: `grunt w`
	This will start the watch event e build the files you are working when you save

- grunt server:
	Run: `grunt server`
	This will run the server um port 9000 (localhost:9000)

	Run: `grunt server:live` || `grunt server:livereload`
	This will run the server um port 9000 and reload on files update


- grunt build
	Run: `grunt build`
	This yill build all your project (comass and uglifyjs)

## License
[MIT License](http://en.wikipedia.org/wiki/MIT_License)

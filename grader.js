#!/usr/bin/env node
/*
Automatically grade files for the presence of specified HTML tags/attributes.
Uses commander.js and cheerio. Teaches command line application development
and basic DOM parsing.

References:

 + cheerio
   - https://github.com/MatthewMueller/cheerio
   - http://encosia.com/cheerio-faster-windows-friendly-alternative-jsdom/
   - http://maxogden.com/scraping-with-node.html

 + commander.js
   - https://github.com/visionmedia/commander.js
   - http://tjholowaychuk.com/post/9103188408/commander-js-nodejs-command-line-interfaces-made-easy

 + JSON
   - http://en.wikipedia.org/wiki/JSON
   - https://developer.mozilla.org/en-US/docs/JSON
   - https://developer.mozilla.org/en-US/docs/JSON#JSON_in_Firefox_2
*/

var fs = require('fs');
var program = require('commander');
var cheerio = require('cheerio');
var rest = require('restler');

var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";

var assertFileExists = function(infile) {    
	var instr = infile.toString();
	if(!fs.existsSync(instr)) {
		console.log("%s does not exist. Exiting.", instr);
		process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
	}    
	return instr;
};

var assertUrlExists = function(inurl) {
	// Add url checking code here
	return inurl;     
};

var cheerioHtmlFile = function(htmlfile) {
	return cheerio.load(fs.readFileSync(htmlfile));
};

var cheerioUrl = function(url) {
	return cheerio.load(url);
}

var loadChecks = function(checksfile) {
	return JSON.parse(fs.readFileSync(checksfile));
};

var showResults = function(checkJson) {
	var outJson = JSON.stringify(checkJson, null, 4);
	console.log(outJson);
}

var checkHtmlFile = function(htmlfile, checksfile) {
	console.log(htmlfile);
	$ = cheerioHtmlFile(htmlfile);
	var checks = loadChecks(checksfile).sort();
	var out = {};
	for(var ii in checks) {
		var present = $(checks[ii]).length > 0;
		out[checks[ii]] = present;
	}
	// return out;
	showResults(out);
};

var checkUrl = function(url, checksfile) {
	rest.get(url).on('complete', function(result, response) {
		if (result instanceof Error) {
			sys.puts('Error: ' + result.message);
			this.retry(5000); // try again after 5 seconds
		} else {
			// console.log(result);
			$ = cheerioUrl(result);
			var checks = loadChecks(checksfile).sort();
			var out = {};
			for(var ii in checks) {
				var present = $(checks[ii]).length > 0;
				out[checks[ii]] = present;
			}
			showResults(out);
		}
	});
};

var clone = function(fn) {
	// Workaround for commander.js issue.
	// http://stackoverflow.com/a/6772648
	return fn.bind({});
};

if(require.main == module) {
	program
		.option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
		.option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists))
		.option('-l, --url <url>', 'URL to parse', clone(assertUrlExists))
	.parse(process.argv);
	var file_input = program.file;
	var url_input = program.url;

	if (file_input) {
		checkHtmlFile(file_input, program.checks);
	} else if (url_input) {
		checkUrl(url_input, program.checks);
	}
} else {
	exports.checkHtmlFile = checkHtmlFile;
}

'use babel';

var https = require('https');
var url = require('url');
var zlib = require('zlib');

function httpsRequest(url : string, successCallback, errorCallback) {
  https.get(url, response => {
    if (response.statusCode != 200) {
      errorCallback('Status code ' + response.statusCode);
    } else {
      var stream = response;
      if (response.headers['content-encoding'] == 'gzip') {
        // Necessary for StackExchange API
        stream = zlib.createGunzip();
        response.pipe(stream);
      }

      var data = '';
      stream.on('data', chunk => {
        data += chunk;
      }).on('end', () => {
        var json;
        try {
          json = JSON.parse(data);
        } catch(e) {
          errorCallback(e);
        }

        successCallback(json);
      });
    }
  }).on('error', errorCallback);
}

function googleSearch(query : string, apiKey : string, successCallback, errorCallback) {
  var cx = '004822305282062059790:hzz7lcix1rg'; // contains only stackoverflow.com
  query = encodeURIComponent(query);
  var url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${query}`;
  httpsRequest(url, successCallback, errorCallback);
}

function fetchStackOverflowAnswers(questionIds, successCallback, errorCallback) {
  var questionIdsCsv = questionIds.join(',');
  var url = `https://api.stackexchange.com/2.2/questions/${questionIdsCsv}/answers?site=stackoverflow&pagesize=5&order=desc&sort=votes&filter=!)rwip0F8r6FJmLTI)O_T`;
  httpsRequest(url, successCallback, errorCallback);
}

function extractCodeSection(html : string) {
  var sections = [];
  var startTag = '<code>';
  var endTag = '</code>';
  do {
    var startIndex = html.indexOf(startTag);
    if (startIndex >= 0) {
      var endIndex = html.indexOf(endTag, startIndex);
      sections.push(decodeHTMLEntities(html.substring(startIndex + startTag.length, endIndex)));
      html = html.substring(endIndex + endTag.length);
    }
  } while (startIndex >= 0);

  if (sections.length == 0) {
    return undefined;
  } else if (sections.length == 1) {
    return sections[0];
  } else {
    // If multiple code sections exist, return the longest one
    var maxLength = 0;
    var maxLengthCode = sections[0];
    sections.map(code => {
      if (code.length > maxLength) {
        maxLength = code.length;
        maxLengthCode = code;
      }
    });

    return maxLengthCode;
  }
}

function decodeHTMLEntities(html) {
  return html.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
}

module.exports = function(query : string, googleAPIKey : string, successCallback, failureCallback, errorCallback) {
  googleSearch(query, googleAPIKey, results => {
    if (!results.items) {
      // No google results at all
      return failureCallback();
    }

    for (let result of results.items) {
      // Go through results, find the first one that links to a question and is not a google ad
      if ((result.kind == 'customsearch#result') && (result.link.indexOf('stackoverflow.com/questions/') >= 0)) {
        var urlObject = url.parse(result.link);
        var questionId = urlObject.pathname.split('/')[2];
        return fetchStackOverflowAnswers([ questionId ], answers => {
          if (answers.items.length == 0) {
            // No stackoverflow answers at all
            return failureCallback();
          }

          // Get top answer that contains a code section
          for (let answer of answers.items) {
            var code = extractCodeSection(answer.body);
            if (code) {
              return successCallback(code);
            }
          }

          // No answers had a code block
          failureCallback();
        }, errorCallback);
      }
    }

    // No valid google results
    failureCallback();
  }, errorCallback);
}

How do I code
=============

Atom package to shortcut the common developer flow:

1. "wait, how do i concat arrays in ios?"
2. google.com
3. click on first stackoverflow result
4. scroll to top comment, select code block, copy
5. go back to code editor, paste

Now, you can just write your query inline, press `Ctrl+?`, then see the code magically get autocompleted.

![Screencast](http://www.idevelop.ro/howdoi/example.gif)

It should work for any syntax that has reasonably good questions and answers on stackoverflow.com.

## Features

- **Language aware search**: the shortcut tries to return code in the programming language you're working in, by automatically appending the active syntax scheme name to the query; so instead of having to type "string lowercase in javascript", you would just type "string lowercase" and press `Ctrl+?`
- **Indentation level aware autocomplete**: the code block is indented to the current indentation level

## Important

This package uses the Google Custom Search API combined with the StackExchange API. To be able to use the Google API you need to set an API Key in Settings. 

Follow the steps under Custom Search Engine here: https://developers.google.com/custom-search/json-api/v1/introduction#identify_your_application_to_google_with_api_key. 

The free tier of the API is limited to 100 queries / day.

## Author

**Andrei Gheorghe**

* [About me](http://idevelop.ro)
* LinkedIn: [linkedin.com/in/idevelop](http://www.linkedin.com/in/idevelop)
* Twitter: [@idevelop](http://twitter.com/idevelop)

## License

- This package is licensed under the MIT License.
- This package is inspired by the [howdoi command line tool](https://github.com/gleitz/howdoi), but reimplemented in javascript, and made to not use proxies to get around Google's rate limitation
- I am providing code in this repository to you under an open source license. Because this is my personal repository, the license you receive to my code is from me and not from my employer (Facebook).

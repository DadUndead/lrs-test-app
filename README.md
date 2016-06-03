#Test TinCan LRS Application

>To test LRS just launch ./build/tincan_test/index.html

##How To Use It?
- Setup LRS: Specify your LRS and add in to lrs list to work with it
- TEST PUT STATEMENT: create your own statement from dropdown menus and try to send it.
- TEST POST STATEMENTS: create random statements and add them to statement list. And again - try to send it
- TEST SAVE STATE: try to send predefined object as state.

If LRS works well you will see it's endpoint in _successed_ block.
Otherwise, if LRS doesn't do what you want - it will appear in _errors_ block.

There are two LRS preconfigured - a valid scorm-cloud account and local webtutor server.
Obviously webtutor server won't work from external web, so it's ok.

Feel free to use your favorite browser developer tools to get addition information about data transfering.

##Install & Contribute
> you need to node.js 0.12.x to be installed https://nodejs.org/dist/latest-v0.12.x/
> you may need to have ruby installed http://rubyinstaller.org/downloads/

- clone this repo
- npm install
- bower install
- gulp do --id 0


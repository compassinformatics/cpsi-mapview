# cpsi-mapview 

[![Build Status](https://travis-ci.org/compassinformatics/cpsi-mapview.svg?branch=master)](https://travis-ci.org/compassinformatics/cpsi-mapview)
[![Coverage Status](https://coveralls.io/repos/compassinformatics/cpsi-mapview/badge.svg?branch=master&service=github)](https://coveralls.io/github/compassinformatics/cpsi-mapview?branch=master)

Check out the latest deployed version at https://compassinformatics.github.io/cpsi-mapview/

## Project setup

This steps assume you have Sencha CMD v6.6 installed on your system and a copy of ExtJS v6.2.0 downloaded.

Clone this repository

```
git clone https://github.com/compassinformatics/cpsi-mapview.git
cd cpsi-mapview
git submodule update --init --recursive
```

Ensure that Sencha Cmd is available on the command line. Examples for Windows:

Powershell:

```
$env:Path = "D:\Tools\Sencha\Cmd\6.6.0.13;" + $env:Path
```

Command prompt:

```
SET PATH=D:\Tools\Sencha\Cmd\6.6.0.13;%PATH%
```

Now add your ExtJS library. The project is tested with both 6.2 (GPL), and 6.7 (commercial license).

```
sencha app upgrade /path/to/local/extjs6.2
```

Start dev-server

```
sencha app watch
```

Open http://localhost:1841 in your browser.

## Docker install

If a simple local server is needed to omit CORS problems, you can use the one configured in `docker-compose.yml`.
Fill placeholders in `nginx.conf` with appropriate values and start nginx server beside sencha dev server simply by:

```
docker-compose up
```

The application is available via http://localhost:81/ afterwards.

For running tests various dependencies listed in package.json need to be installed. Run the following:

```
npm install
```

## Updating the online demo

1. Build the standalone version

    ```
    sencha app build
    ```

2. Publish using the [gh-pages](https://www.npmjs.com/package/gh-pages) Node module:

    ```
    npx gh-pages -d build/production/CpsiMapview/--dotfiles --repo https://github.com/compassinformatics/cpsi-mapview.git -b gh-pages
    ```

Note the `--dotfiles`` flag as `.nojekyll` is required on GitHub Pages to allow access to any JS files in the `node_modules` folder.

## Testing

Navigate to the project folder and run the following:

```
npm test
```

To have tests continually running while making changes:

```
npm run test:watch
```

To open in a browser and leave the browser open (to review UI components, debug, etc.).
`--auto-watch` prevents application JS files being cached. 

```
karma start --browsers Chrome --single-run=False --debug --auto-watch

```

See also https://glebbahmutov.com/blog/debugging-karma-unit-tests/


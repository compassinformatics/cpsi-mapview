# cpsi-mapview

[![Build Status](https://travis-ci.org/compassinformatics/cpsi-mapview.svg?branch=master)](https://travis-ci.org/compassinformatics/cpsi-mapview)
[![Coverage Status](https://coveralls.io/repos/compassinformatics/cpsi-mapview/badge.svg?branch=master&service=github)](https://coveralls.io/github/compassinformatics/cpsi-mapview?branch=master)

Check out the latest deployed version at https://compassinformatics.github.io/cpsi-mapview/

## Project setup

This steps assume you have Sencha CMD v7.8 (or the GPL version v7.2.0.84) installed on your system and a copy of ExtJS v7.0.0 downloaded (or
the commercial version ExtJS 7.8.0 if you have a licence).
The project has been tested using Node v20+ - this is the minimum recommended version.

Clone this repository

```
git clone https://github.com/compassinformatics/cpsi-mapview.git
cd cpsi-mapview
```

Ensure that Sencha Cmd is available on the command line. Examples for Windows:

Powershell:

```
$env:Path = "D:\Tools\Sencha\Cmd\7.8.0.59;" + $env:Path
```

Command prompt:

```
SET PATH=D:\Tools\Sencha\Cmd\7.8.0.59;%PATH%
```

Now add your ExtJS library. The project is tested with both 7.0 (GPL), and 7.8 (commercial license).

```
sencha app upgrade /path/to/local/extjs7.8
```

Alternatively place a junction (shortcut) to point to an existing ExtJS folder (recommended approach):

```
# Command Prompt
mklink /D ext D:\Tools\Sencha\ext-7.8.0

# PowerShell
new-item -itemtype symboliclink -path . -name ext -value D:\Tools\Sencha\ext-7.8.0
```

Install dependencies:

```
npm i
```


Start dev-server

```
sencha app watch
```

Open http://localhost:1841 in your browser.

## Override dependencies

To debug against the main branches (or a specific commit) of dependencies, update the `classpath` property in `app.json` to use the `lib` folder instead of `node_modules`,
and run the following command to clone git submodules:

```
git submodule update --init --recursive
```

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

## Testing

Navigate to the project folder and run the following:

```
npm test
```

Note - if there are errors such as `BasiGX not defined`, ensure that the submodules have been
created using `git submodule update --init --recursive`.

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

To run for single test file you can use the `grep` option:

```
karma start --single-run --grep 'CpsiMapview.factory.Layer'
karma start --single-run --grep 'CpsiMapview.util.Turf' --debug
```

## Production Builds

```
cd cpsi-mapview
sencha app build
cd build\production\CpsiMapview
python -m http.server 8888
http://localhost:8888
```

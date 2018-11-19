# cpsi-mapview [![Build Status](https://travis-ci.org/meggsimum/cpsi-mapview.svg?branch=master)](https://travis-ci.org/meggsimum/cpsi-mapview)

Check out the latest deployed version at https://meggsimum.github.io/cpsi-mapview/

## Project setup

This steps assume you have Sencha CMD v6.6 installed on your system and a copy of ExtJS v6.2.0 downloaded.

Clone this repository

```
git clone https://github.com/meggsimum/cpsi-mapview.git
cd cpsi-mapview
git submodule update --init --recursive
```

Add your ExtJS 6.2 library

```
sencha app upgrade /path/to/local/extjs6.2
```

Start dev-server

```
sencha app watch
```

Open http://localhost:1841 in your browser.

If a simple local server is needed to omit CORS problems, you can use the one configured in `docker-compose.yml`.
Fill placeholders in `nginx.conf` with appropriate values and start nginx server beside sencha dev server simply by:

```
docker-compose up
```
The application is available via http://localhost:81/ afterwards.

## Updating the deployed state

```
# 1. Build the standalone version
sencha app build
# 2. upstream remote should point to canonical repository
# 3. publish using black magic
npx gh-pages -d build/production/CpsiMapview/ -o upstream

```

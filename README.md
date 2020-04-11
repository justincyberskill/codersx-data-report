## Introduction
This repo is a Report Server of CodersX

It simplely query and aggregate data from database 

Then send those data to the Google Spreadsheet for Statistical and Analize Purpose.

## Installation requirements
Please ensure that you installed these things below
- [Node.js](https://nodejs.org/en/) - JavaScript Runtime

- [Yarn](https://classic.yarnpkg.com/en/docs/install/#mac-stable) - Package Management

- [Nodemon](https://www.npmjs.com/package/nodemon) - Node Script helper

## Steps to setup this project
1. Clone the project from Github Repository
2. Run `yarn` to **install** related packages in `package.json`
3. Add your `.env` file for apply environment variables. You can refer to `.env.example` file for needed information
3. Start your server with `yarn dev` for Development or `yarn start` for Production

## File structures
```Javascript
app.js // Main server file
cronjobs // Contain all our cron-jobs
models // model & schema for communicate with Database
utils // Utilities use for setup helpers or third-party packages
other files... // Configuation files
```
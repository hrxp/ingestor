# hrxp-ingester

Slack archive ingester for the HRX Portal

## Table of Contents

- [Requirements](#requirements)
- [Getting Started](#getting-started)
- [Files](#files)
  - [SRC Files](#src-files)

# Getting Started

- Insert unzipped archive in the src folder
- Rename the directory variable to the unzipped archive name in the processArchiveController.js file
- Run `npm i` from the command line
- Copy the file at /db/config.example.js -> and rename it to config.js. Then fill in the database string URI variable
- Run `npm ingest`

# Requirements

To get this project setup, you will need:

- [Node.js](https://nodejs.org/en/)
- [NPM](https://www.npmjs.com/get-npm)

# Files

## Src Files

| Name                              | Description                                                                       |
| --------------------------------- | --------------------------------------------------------------------------------- |
| `src/FileUtils.js`                | Singleton class for file operations                                               |
| `src/fileWalker.js`               | Walkes through the directory, finds files, reads file, and format file            |
| `src/messagesUtils.js`            | Utilities for formatting a message/thread/reply + finding all replies to a thread |
| `src/processArchiveController.js` | Controlles the flow of read a file and saving to the database                     |
| `src/util.js`                     | Utilities for unzipping a file + extra controller                                 |

## Versioning

- Git is used for versioning.

## Contributers

- [**John Sprague** - Software Engineer](https://linkedin.com/in/spraguejdev)
- [**Kyle Shockey** - Software Engineer](https://www.linkedin.com/in/kyleshockey/)

# Discord-Bot-Boi

[![Build Status](https://travis-ci.org/bdatdo0601/Discord-Bot-Boi.svg?branch=master)](https://travis-ci.org/bdatdo0601/Discord-Bot-Boi)
[![Coverage Status](https://coveralls.io/repos/github/bdatdo0601/Discord-Bot-Boi/badge.svg?branch=master)](https://coveralls.io/github/bdatdo0601/Discord-Bot-Boi?branch=master)
[![dependencies Status](https://david-dm.org/bdatdo0601/Discord-Bot-Boi/status.svg)](https://david-dm.org/bdatdo0601/Discord-Bot-Boi)
[![devDependencies Status](https://david-dm.org/bdatdo0601/Discord-Bot-Boi/dev-status.svg)](https://david-dm.org/bdatdo0601/Discord-Bot-Boi?type=dev)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

Utility Discord Bot (**DaBotBoi**) built for primarily for **The Gang** Discord channel.

# Prerequisites

**Some of these are opinionated!!**

If you know what you are doing, feel free to use your own tools

## Core

_Ensure you can run these programs from your terminal/shell_

- [Node (v10.12.0 or higher)](https://nodejs.org/en/): Allow running JavaScript code to run directly on computer instead of just through browser
- [Yarn Package Manager](https://yarnpkg.com/en/): Manage Node's libraries

## Development

_The Project is developed using [TypeScript](https://www.typescriptlang.org/), basically JavaScript with some twist_

- [Visual Studio Code](https://code.visualstudio.com/): IDE to develop. Have a tons of package to support writing ~~good~~ code

## Contribution

- [Git](https://git-scm.com/): Version control, allow seamless collaboration on projects

# Installation

1. Open your terminal/shell and clone (or Download and Unzip) the project

```shell
$ git clone https://github.com/bdatdo0601/Discord-Bot-Boi.git
```

2. Locate to the root of the project and install dependencies with **Yarn**

```shell
$ cd Discord-Bot-Boi/
$ yarn
```

3. setup `.env` at the root of the project to set required environment variable(refer to `.sample-env` for example)

# Usage

Below are availabe command for the project. Checkout `package.json` to see the exact command executed:

```shell
$ yarn lint # cleaning up source code
$ yarn data-initialization # one time work script for development mode
$ yarn data-initialize-production # one time work script for production mode
$ yarn start # start the project in development mode
$ test:specific # test specific file
$ yarn test # run test against the project
$ yarn build-server # compile project into production version
$ yarn coverage # update the coverage status of the project
$ yarn clean # clear build folder
$ yarn build # clear build folder and compile project to production version
$ yarn start-production # start the project in production mode
$ yarn deploy # build the project and start it in production mode
```

# Testing

To get coverage status for the project from local machine, setup `.coveralls.yml` with `repo_token` from [coveralls.io](https://coveralls.io)

# Testing Area

[This](https://discord.gg/BNu8uTe) is the testing area for the discord. By default, everyone who joins will be adminstrator so they can fully play around. With that being said, **please do not destroy the server**.

# Project Directory

```tree
.
├── LICENSE                                 # License for the project
├── Procfile                                # Heroku configuration (use for deployment)
├── README.md
├── build/                                  # Storing the production (compiled) version of the project
├── coverage/                               # Coverage Report (How well-tested the project is)
├── package.json                            # Project Configuration (declare dependencies, scripts, etc)
├── src/                                    # Source code folder
│   ├── commands/                           # commands that are available to use
│   │   ├── command.interface.ts            # Interfaces to ensure static typings
│   │   ├── index.ts                        # Starting point of this (sub)directory
│   │   ├── mock/                           # Example command
│   │   │   └── index.ts
│   ├── events/                             # Discord event management
│   │   ├── event.interface.ts
│   │   ├── index.ts
│   │   ├── message/                        # Example event
│   │   │   └── index.ts
│   ├── lib/                                # Utility functions
│   │   └── api/
│   │       └── reddit/                     # Example utility for RedditAPI
│   │           ├── index.ts
│   │           └── reddit.interface.ts
│   ├── res/                                # Static Resources
│   ├─── typings/                           # TypeScript Typings for external, untyped JS Module
│   │  └── declarations/                    # Declaration Files
│   │       └── json.d.ts
│   └─── index.ts                           # Starting point of the entire project
├── test/                                   # Automated testing
├── tsconfig.json                           # TypeScript Configuration
└── yarn.lock
```

# Contribution

Feel free to create issues to request new feature or fork the project and create pull requests.

# generator-express-component [![Build Status](https://secure.travis-ci.org/yo-components/generator-express-component.png?branch=master)](https://travis-ci.org/yo-components/generator-express-component)
[![Gitter](https://badges.gitter.im/Join Chat.svg)](https://gitter.im/yo-components/generator-express-component?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Generate various express components for [Yeoman](http://yeoman.io) generated apps.


## Getting Started

### Install yo

```bash
$ npm install -g yo
```

### Install generator-express-component

To install generator-express-component from npm, run:

```bash
$ npm install -g generator-express-component
```

### Initialize the generator

In your application folder run the following:

```bash
$ yo express-component
```

You will be promted for the various configurations values needed to generate express components.

Configuration:

    --skip-message             # Suppress generator messages                                  Default: false
    --force-config             # Force overwritting of previous config values                 Default: false
    --use-defaults             # Skip all prompts and use defaults
    --route-use-defaults       # Skip all route prompts and use defaults
    --controller-use-defaults  # Skip all controller prompts and use defaults

Also you can pass any sub-generator configuration option to use that value instead of being prompted.


## Usage

generator-express-component can generate various express components for your application. It does this through [composable](http://yeoman.io/authoring/composability.html) sub-generators that can be swapped in and out to customize your components however you like.

### Sub-Generators

- [`express-component:route`](#route)
- [`express-component:controller`](#controller)
- [`express-component:endpoint`](#endpoint)

#### Route

Generate an express route file, optionally have it registered in the main express app/router file.

Example:
```bash
yo express-component:route thing
? What will the url of your endpoint be? (/api/things)
```

Produces:

    server/api/thing/index.js

Configuration:

    --route-path      # Path to use for the route
    --route-register  # Whether or not to register the route
    --route-haystack  # Path to file that the route will be registered in
    --route-needle    # String in file to register the route below
    --route-express   # The variable name of express in the registered file
    --route-url       # Default url for routes
    --route-template  # Path to the route template

#### Controller

Generate an express route controller file, optionally have it required in a corresponding route file.

Example:
```bash
yo express-component:controller thing
```

Produces:

    server/api/thing/thing.controller.js

Configuration:

    --controller-path      # Path to use for the controller
    --controller-register  # Whether or not to register the controller
    --controller-haystack  # Path to file that the controller will be registered in
    --controller-needle    # String in file to register the controller below
    --controller-name      # Default variable name for the controller in registered file
    --controller-template  # Path to the controller template

#### Endpoint

A [`hookFor`](https://yeoman.github.io/generator/NamedBase.html#hookFor) `express-component:route` and `express-component:controller` by default.

Example:
```bash
yo express-component:endpoint thing
? What will the url of your endpoint be? (/api/things)
```

Produces:

    server/api/thing/index.js
    server/api/thing/thing.controller.js

Configuration:

    --express-component:route       # express-component:route to be invoked
    --express-component:controller  # express-component:controller to be invoked


## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)

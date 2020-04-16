## Overview

The **Glue42 CLI** is a command line tool designed to simplify your development process with **Glue42 Core**. The CLI provides the following basic commands:

- `init` - quickly sets up your project with the necessary configurations and dependencies;
- `serve` - launches a dev server which acts as a reverse proxy for your locally served applications;
- `build` - bundles all the necessary **Glue42 Core** files into one convenient folder that is ready for deployment;
- `version` - returns the currently installed version of the Glue42 CLI;

## Installation

Installing the Glue42 CLI using `npm`:

```cmd
npm install -g @glue42/cli-core
```

## Commands

The Glue42 Core CLI offers several basic commands with no additional parameters. All the necessary configuration options are taken either from the `glue.config.dev.json` file in the current working directory (see [Configuration](#configuration) below) or from the built-in defaults.

Below are described the available commands:

```javascript
gluec init
```

The `init` command will set up **Glue42 Core** for the current directory. This means that the CLI will:

- install with `npm` (and perform `npm init --yes` beforehand if no `package.json` file is found) all necessary dependencies that provide the [**Glue42 Environment**](../environment/index.html) files;
- create a `glue.config.dev.json` file with default settings and correct paths for all **Glue42 Core** assets;
- create a `glue.config.json` file with default settings so that you can easily customize (if you need to) the settings in it. The CLI will copy this file to the output directory when bundling your **Glue42 Core** files for deployment.

```javascript
gluec serve
```

The `serve` command launches a dev server using the configuration provided in the `glue.config.dev.json` file.

```javascript
gluec build
```

The `build` command collects all the necessary **Glue42 Core** assets and bundles them in a `./glue` directory ready for deployment.

```javascript
gluec version
```

The `version` command returns the currently installed version of the Glue42 CLI.

## Configuration

The configuration settings for the Glue42 CLI are located in the `glue.config.dev.json` file that is automatically created when initializing your **Glue42 Core** project with the `init` command. This file must be located at top-level of the working directory from which the CLI commands are executed. The settings and configurations in this file allow the Glue42 CLI to correctly serve your applications and compose the final **Glue42 Core** bundle ready for production.

Below is the default configuration in the `glue.config.dev.json` file:

```json
{
    "glueAssets": {
        "gateway": {
            "location": "./node_modules/@glue42/gateway-web/web/gateway-web.js"
        },
        "worker": "./node_modules/@glue42/worker-web/dist/worker.js",
        "config": "./glue.config.json",
        "route": "/glue"
    },
    "server": {
        "settings": {
            "port": 4242,
            "disableCache": true
        },
        "apps": [],
        "sharedAssets": []
    },
    "logging": "default"
}
```

Options that specify file locations can be set as absolute paths or as paths relative to the configuration file.

### Properties and Settings

Below are described all available properties and settings in the `glue.config.dev.json` file.

- #### glueAssets

*Optional*. Defines the locations of all scripts and configurations that are part of the [**Glue42 Environment**](../environment/index.html). These settings are used by the `serve` command to correctly host all required files and also by the `build` command, to correctly compose your **Glue42 Core** bundle. It has the following properties:

| Property | Type | Description | Required | Default |
|----------|------|-------------|----------|---------|
| `worker` | `string` | The location of the shared worker script file. | No | `"./node_modules/@glue42/worker-web/dist/worker.js"` |
| `gateway.location` | `string`| The location of the Glue42 Gateway script file. | No | `"./node_modules/@glue42/gateway-web/web/gateway-web.js"` |
| `gateway.gwLogAppender` | `string` | The location of a [custom log appender file](../../../getting-started/setting-environment/advanced/index.html#extending_the_gateway_logging) for the Glue42 Gateway. | No | `-` |
| `config` | `string`| The location of the `glue.config.json` file. | No | `"./glue.config.json"` |
| `route` | `string` | The base route where the [**Glue42 Environment**](../environment/index.html) files will be served by the dev server. | No | `"/glue"` |

In the example below, the user has created a `/lib` directory and has decided to put there the deployment-ready files of the shared worker and the Glue42 Gateway. The Glue42 CLI will use these locations (for serving the files during development and for building the final **Glue42 Core** bundle) and will fail with an error if any of the files is missing. The user has also changed the default `route` to `"/shared/glue"`. This can be useful for keeping all shared resources (like images, scripts, styles, etc.) and all **Glue42 Core** files under the same base path. However, now all [**Glue42 Clients**](../glue42-client/index.html) need to be instructed where to find the [**Glue42 Environment**](../environment/index.html) files (see [Initializing a Glue42 Client: Custom Configuration](../glue42-client/index.html#initializing_a_glue42_client-custom_configuration)).

```json
{
    "glueAssets": {
        "worker": "./lib/worker.js",
        "gateway": {
            "location": "./lib/gateway.js"
        },
        "route": "/shared/glue"
    },
    "server": ...,
    "logging": ...
}
```

- #### server

`server` is required when using the `serve` command and defines various command-specific settings.

`server.settings` defines dev server-specific settings:

|Property|Type|Description|Default|
|--------|----|-----------|-------|
|`port`|`number`|**Optional** The port at which the dev server will listen| Defaults to: 4242 |
|`disableCache`|`boolean`|**Optional** Toggles wether to disable server cache or not| Defaults to: true |

Example:
```json
{
    "glueAssets": ...,
    "server": {
        "settings": {
            "port": 9292,
            "disableCache": false
        }
    },
    "logging": ...
}
```


`server.apps` is an array of objects which define how the dev server should serve your apps: from a local directory or proxy to a localhost. The app object has the following properties:

|Property|Type|Description|Default|
|--------|----|-----------|-------|
|`route`|`string`|**Required** The route where to serve the app | no default |
|`localhost`|`{port: number; spa?: boolean}`| Used when your app is already served on localhost and the dev server should proxy to it |no default|
|`localhost.port`|`number`|**Required** The port at which the server serving your app listens to| no default |
|`localhost.spa`|`boolean`|**Optional** Toggles whether your app is a Single Page Application| Defaults to: true |
|`file`|`object`| Used when your app is not served and the dev server should serve it from the file system |no default|
|`file.path`|`string`|**Required** The location of your app's directory| no default |

Example:
```json
{
    "glueAssets": ...,
    "server": {
        "apps": [
            {
                "route": "/",
                "localhost": {
                    "port": 3000
                }
            },
            {
                "route": "/apptwo",
                "file": {
                    "path": "./apptwo-dist"
                }
            }
        ]
    },
    "logging": ...
}
```

In this example, the user has two applications which he needs to be served:
- At `http://localhost:4242` the dev server will proxy to the app served at `http://localhost:3000`
- At `http://localhost:4242/apptwo` the dev server will serve the app located in `./apptwo-dist`

`sharedAssets` is an array of objects describing assets shared between your applications, so that the dev server can serve them. Each object has the following properties:

|Property|Type|Description|Default|
|--------|----|-----------|-------|
|`route`|`string`|**Required** The route where to serve the shared asset| no default |
|`path`|`string`|**Required** The location of your shared asset| no default |

Example:
```json
{
    "glueAssets": ...,
    "server": {
        "apps": ...,
        "sharedAssets": [
            {
                "route": "/common",
                "path": "./common"
            },
            {
                "route": "/favicon.ico",
                "path": "./favicon.ico"
            }
        ]
    },
    "logging": ...
}
```

In this example the user declares a directory `common` which contains shared files and also a single common file `favicon.ico`. They will be served at:
- `http://localhost:4242/common`
- `http://localhost:4242/favicon.ico`


- #### logging

`logging` is an optional property and specifies the level of logging for the CLI.

When omitted the CLI will output informational logs and errors **only** to the console. Other possible settings are:
- `dev` - Again outputs only to the console, but this time includes trace information too.
- `full` - Outputs everything (info, trace, errors) to the console and to the log file at `./glue.core.cli.log`

Example:
```json
{
    "glueAssets": ...,
    "server": ...,
    "logging": "dev"
}
```

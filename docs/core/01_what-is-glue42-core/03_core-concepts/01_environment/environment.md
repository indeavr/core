## Overview

The **Glue42 Core** Environment is a set of JavaScript and JSON files. These files must be hosted at the same domain as your applications in order for your applications to have access to **Glue42 Core** functionalities. This set of files is not application-specific, but rather - domain-specific.

The environment consists of:

- [**Shared Worker**](#shared_worker) - a [shared worker](https://developer.mozilla.org/en-US/docs/Web/API/SharedWorker) that functions as a central point to which all [**Glue42 Clients**](../glue42-client/index.html) to connect;
- [**Glue42 Gateway**](#glue42_gateway) - a Glue42 Gateway that handles the communication between all [**Glue42 Clients**](../glue42-client/index.html);
- [**Configuration File**](#configuration_file) - an *optional* configuration file that is used to define **Glue42 Core** settings and defaults;

Environment requirements:

- all files must be hosted on the same domain as your applications;
- all files must be served from a path easily accessible by all [**Glue42 Clients**](../glue42-client/index.html);

*Due to the current limitations of the [Shared Worker](https://developer.mozilla.org/en-US/docs/Web/API/SharedWorker) interface, it is recommended that all three files reside in the same directory within your project.*

## Environment Setup

The **Glue42 Core** [**CLI**](../cli/index.html) tool greatly facilitates and simplifies the process of setting up your development environment and bundling it for deployment. For more information, see the detailed environment setup guides for [**single**](../../../getting-started/setting-environment/single-application/index.html) and [**multi application**](../../../getting-started/setting-environment/multiple-applications/index.html) projects.

If you need fine-grained control over the development and deployment of your project, see the [**Manual Setup**](../../../getting-started/setting-environment/manual/index.html) section where you can find a detailed guide for manually setting up the environment.

## Shared Worker

The [Shared Worker](https://developer.mozilla.org/en-US/docs/Web/API/SharedWorker)) instance is the central point to which all [**Glue42 Clients**](../glue42-client/index.html) connect when initializing the [Glue42 Web](../../../../reference/core/latest/glue42%20web/index.html) Javascript library. It is responsible for configuring, initializing and linking the [**Glue42 Clients**](../glue42-client/index.html) to the Glue42 Gateway. The shared worker retrieves the user-defined settings for the Glue42 Gateway from the `glue.config.json` configuration file.

*Note that the shared worker will expect to find the Glue42 Gateway script file and a configuration file that is named `glue.config.json` in the same directory. Due to the current limitations of the [Shared Worker](https://developer.mozilla.org/en-US/docs/Web/API/SharedWorker) interface, passing a different location for the files is impossible. Therefore, if a `glue.config.json` file is not found at that location, the worker will proceed with the default Glue42 Gateway settings.*

## Glue42 Gateway

The Glue42 Gateway is the backbone of the **Glue42 Core** environment. It facilitates the communication between all Glue42 Clients and is initialized by the shared worker. There are several configuration options for the Glue42 Gateway which you can set from the optional `glue.config.json` file.

## Configuration File

This is an *optional* JSON file containing a [`Config`](../../../../reference/core/latest/glue42%20web/index.html#!Config) object with general **Glue42 Core** settings, Glue42 Gateway settings and shared configuration settings to be used by all [**Glue42 Clients**](../glue42-client/index.html) on this domain. If you provide a configuration file, then it **must** be named `glue.config.json`. 

Each Glue42 Client app can initialize the [Glue42 Web](../../../../reference/core/latest/glue42%20web/index.html) library with its own [`Config`](../../../../reference/core/latest/glue42%20web/index.html#!Config) object which will override the default settings specified in the `glue.config.json` file (see [Initializing a Glue42 Client](../glue42-client/index.html#initializing_a_glue42_client)).

If a `glue.config.json` file is not present, then all Glue42 Clients will initialize using the default settings and will try to connect to the shared worker at the default location at `/glue/worker.js`. The shared worker will also try to connect to the Glue42 Gateway at the default location at `/glue/gateway.js`.

Below is the default configuration:

```json
{
    "glue": {
        "worker": "./worker.js",
        "layouts": {
            "autoRestore": false,
            "autoSaveWindowContext": false
        }
    },
    "gateway": {
        "location": "./gateway.js"
    }
}
```

- `glue` - An *optional* [`Config`](../../../../reference/core/latest/glue42%20web/index.html#!Config) object that is used as a common setting when the [**Glue42 Clients**](../glue42-client/index.html) on this domain initialize the Glue42 Web library. Each client can define its own [`Config`](../../../../reference/core/latest/glue42%20web/index.html#!Config) object with initialization options, which will override the common settings in the `glue.config.json`.

The `glue` top-level key has the following properties:

| Property | Type | Description | Required | Default |
|----------|------|-------------|----------|---------|
| `extends` | `string | false` | This property can be used by a [Glue42 Client](../glue42-client/index.html)) during initialization of the Glue42 Web library to specify a URL for the location of the `glue.config.json` file (e.g., if you want to change the default location of the configration file). The library will fetch it and use it to extend the built-in configuration defaults. It is recommended to set this to `false`, if no configuration file is available. Also set to `false` if you don't want the Glue42 Client app to use the defaults from an existing configuration file. *Note that if you define a custom URL for the configuration file, then the library will expect to find a `worker.js` file in the same directory.* | No | `"/glue/glue.config.json"` |
| `worker` | `string` | Specifies a shared worker location. It is recommended for a Glue42 Client app to use this property to define a custom location for the shared worker script, if `extends` has been set to `false` or if the `glue.config.json` file is not hosted at the default location. *Note that the shared worker script **must** be in the same directory as the `glue.config.json` file (if you have provided such file).* | No | `"./worker.js"` |
| `layouts` | `object` | Enable or disable auto restoring windows and/or auto saving window context. | No | `-` |
| `layouts.autoRestore` | `boolean` | If `true`, the set of windows opened by the application will be saved (in local storage) when the window is closed and restored when the application is started again. The saved data about each window includes URL, bounds and window context. | No | `false` |
| `layouts.autoSaveWindowContext` | `boolean` | If `true`, will automatically save the context of the window. | No | `false` |

- `gateway` - An *optional* configuration object that defines settings used by the shared worker in order to initialize the Glue42 Gateway.

The `gateway` top-level key has the following properties:

| Property | Type | Description | Required | Default |
|----------|------|-------------|----------|---------|
| `location` | `string` | The location of the Glue42 Gateway script. | No | `"./gateway.js"` |
| `logging` | `object` | Set the logging level and a log appender for the Glue42 Gateway. | No | `-` |
| `logging.level` | `string` | Defines the log level. Can be one of: `"trace" | "debug" | "info" | "warn" | "error"`. | No | `"info"` |
| `logging.appender` | `object` | Defines a custom log appender. | No | `-` |
| `appender.location` | `string` | The location of the log appender script. | Yes | `-` |
| `appender.name` | `string` | The name of the logging function defined in the log appender script. | Yes | `-` |

For more information on defining a custom log appender, see the [Advanced](../../../getting-started/setting-environment/advanced/index.html) section.
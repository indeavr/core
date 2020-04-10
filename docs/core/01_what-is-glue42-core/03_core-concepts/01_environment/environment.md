## Overview

The **Glue42 Core** Environment is a set of JavaScript and JSON files. These files must be hosted at the same domain as your applications in order for your applications to have access to **Glue42 Core** functionalities. This set of files is not application-specific, but rather - domain-specific.

The environment consists of:

- a [shared worker](https://developer.mozilla.org/en-US/docs/Web/API/SharedWorker) that functions as a central point to which all [**Glue42 Clients**](../glue42-client/index.html) to connect;
- a Glue42 Gateway that handles the communication between all [**Glue42 Clients**](../glue42-client/index.html);
- an *optional* configuration file that is used to define **Glue42 Core** settings and defaults;

The environment requires the following:

- all files must be hosted on the same domain as your applications;
- all files must be served from a path easily accessible by all [**Glue42 Clients**](../glue42-client/index.html);

## Environment Setup

The **Glue42 Core** [**CLI**](../cli/index.html) tool greatly facilitates and simplifies the process of setting up your development environment and bundling it for deployment. For more information, see the detailed environment setup guides for [**single**](../../../getting-started/setting-environment/single-application/index.html) and [**multi application**](../../../getting-started/setting-environment/multiple-applications/index.html) projects.

If you need fine-grained control over the development and deployment of your project, see the [**Manual Setup**](../../../getting-started/setting-environment/manual/index.html) section where you can find a detailed guide for manually setting up the environment.

## Configuration File

This is a simple JSON file containing general **Glue42 Core** settings, Glue42 Gateway settings and shared configuration settings used by all [**Glue42 Clients**](../glue42-client/index.html) on this domain.

If this file is not present, then all Glue42 Clients will initialize using the default settings and will try to connect to the shared worker at the default location at `/glue/worker.js`. The shared worker will also try to connect to the Glue42 Gateway at the default location at `/glue/gateway.js`.

If you provide a configuration file, then it **must** be named `glue.config.json`. The interface of the config is:

```javascript
interface Glue42CoreConfig {
    glue?: Glue42WebConfig;
    gateway?: GatewayConfig;
}
```

### Glue42WebConfig

This is an **optional** configuration object which when defined will be used as a common setting when all [**Glue42 Clients**](../glue42-client/index.html) on this domain initialize the Glue42 Web library. Every client can define it's own initialization options, which will overwrite the common settings in `glue.config.json`.

For more information on the Glue42WebConfig, head over to the [Glue42 Web](../../../../reference/core/latest/glue42%20web/index.html) reference documentation.

### GatewayConfig

This is an **optional** configuration object which defines settings used by the shared worker in order to initialize the gateway:

|Property|Type|Description|Default|
|--------|----|-----------|-------|
|`location`|`string`|**Optional** The location of the gateway script | Defaults to: "./gateway.js" |
|`logging`|`object`|**Optional** Set the logging level and appender for the gateway | -|
|`logging.level`|`"trace" | "debug" | "info" | "warn" | "error"`|**Optional** Defines the log level | Defaults to: `"info"` |
|`logging.appender`|`object`|**Optional** Defines a custom log appender | By default the gateway will log to the shared worker's console |
|`logging.appender.location`|`string`| The location of the appender script | no default |
|`logging.appender.name`|`string`| The name of the appender function defined in the appender script | No default |


#### Gateway log appender

You can overwrite the default logging configuration of the gateway from `glue.config.json`. For most cases this is not needed, because the gateway logs internal messages sent back and forth from [**Glue42 Clients**](../glue42-client/index.html). However, if you really need to, you can define:
- log level - accepts: `"trace" | "debug" | "info" | "warn" | "error"`, defaults to: `info`
- appender - a function that receives a **LogInfo** object. By default logs to the shared worker console, but your custom function can send those logs to a remote server, for example. The **LogInfo** object has a structure like this:

```javascript
{
    time: 2017-06-22T15:38:34.230Z,
    file: 'C:\\Users\\dimd00d\\AppData\\Local\\Temp\\form-init8247674603237706851.clj',
    output: 'DEBUG [gateway.local-node.core:55] - Sending message {:domain "global", :type :error, :request_id nil, :peer_id nil, :reason_uri "global.errors.authentication.failure", :reason "Unknown authentication method "} to local peer',
    level: 'debug',
    line: 55,
    stacktrace: null,
    namespace: 'gateway.local-node.core',
    message: 'Sending message {:domain "global", :type :error, :request_id nil, :peer_id nil, :reason_uri "global.errors.authentication.failure", :reason "Unknown authentication method "} to local peer'
}
```
The `output` key contains a processed message for direct output where the rest of the keys hold the details.

Example:

```json
{
    "glue": ...,
    "gateway": {
        "logging": {
            "level": "trace",
            "appender": {
                "location": "./gwLogAppender.js",
                "name": "log"
            }
        }
    }
}
```

```javascript
// ./gwLogAppender.js
self.log = (logInfo) => {
    // your custom log logic here
}
```

## Shared Worker

The shared worker is a script, which is used to create a Shared Web Worker. This is the central point to which all [**Glue42 Clients**](../glue42-client/index.html) connect when initializing the javascript glue library. It is responsible for configuring, initializing and linking [**Glue42 Clients**](../glue42-client/index.html) to the gateway.

The shared worker will use the `glue.config.json` to get user-defined settings for the gateway.

**Important!** The shared worker will expect to find a configuration file at `./glue.config.json`. Due to the current limitations of the Shared Web Worker interface, passing a different config file location is not an option. Therefore if this file is not found at that location, then the worker will proceed with default gateway settings.


## Gateway

The gateway is the backbone of the **Glue42 Core** environment. It facilitates all communication between all Glue42 Clients and is initialized by the shared worker. There are a few configuration options for the gateway, all exposed via the `glue.config.json` object.

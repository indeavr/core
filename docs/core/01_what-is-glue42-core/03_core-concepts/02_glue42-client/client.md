## Overview

A **Glue42 Client** is every application which initializes the [**Glue42 Web**](../../../../reference/core/latest/glue42%20web/index.html) library and connects to the [**Glue42 Core Environment**](../environment/index.html). There could be one or more Glue42 Clients connected to the same Glue42 Core Environment on a single domain, which gives them full access to the [Interop](../../../../reference/core/latest/interop/index.html), [Window Management](../../../../reference/core/latest/windows/index.html) and [Shared Contexts](../../../../reference/core/latest/shared%20contexts/index.html) functionalities offered by the **Glue42 Core** platform.

A Glue42 Client can be any web application using JavaScript, React, Angular or any other web framework.

## Initializing a Glue42 Client

Initializing a client application means to connect it to the [**Glue42 Core Environment**](../environment/index.html) using the [**Glue42 Web**](../../../../reference/core/latest/glue42%20web/index.html) library. 

Regardless of the web framework you use, you have to initialize the Glue42 Web library by invoking the exposed `GlueWeb()` factory function. It accepts an *optional* [`Config`](../../../../reference/core/latest/glue42%20web/index.html#!Config) object in which you can specify options regarding the shared worker, the Glue42 Gateway, as well as options related to saving and restoring the application window layout and context:

```javascript
const initOptions = {
    worker: "./lib/worker.js",
    layouts: {
        autoRestore: true,
        autoSaveWindowContext: true
    }
};

// Attach a `glue` object to the `window` object and access the Glue42 Web APIs through it.
window.glue = await GlueWeb(initOptions);
```

The section below explains how you can configure the initialization of the library and why you may need to do this.

*More detailed information on how to initialize the Glue42 Web library depending on the framework you are using, you can find in the [**JavaScript**](../../../getting-started/setting-application/javascript/index.html) and [**React**](../../../getting-started/setting-application/react/index.html) guides on how to set up your application.*

The interface of Glue42Web.Config looks like this:

```javascript
interface Glue42Web.Config {
    worker?: string;
    layouts?: {
        autoRestore?: boolean;
        autoSaveWindowContext?: boolean;
    };
    extends?: string | false;
}
```

The **extends** property can be used to disable fetching `glue.config.json` (by setting it to `false`) or to set a location of the file, different from the default (`/glue/glue.config.json`). This is advisable when you decide not to use a `glue.config.json`.

**Note** that if you set a different location for `glue.config.json`, then you need to make sure that the `worker.js` ([**Glue42 Core Environment**](../environment/index.html)) is located next to the config.
**Note** that if you set **extends** to `false`, then by default all clients will try to connect to the worker at `/glue/worker.js`. You need to set the **worker** property, if you want to overwrite the default.

The **layouts** property enables or disables auto-saving/restoring of windows' location and context on close.

## Glue.Config.JSON

We have covered the `glue.config.json` in the [**Glue42 Core Environment**](../environment/index.html) section where we explained all of it's properties. We have also explained how you can use this config to extend parts of the [**Glue42 Core Environment**](../environment/index.html) in the [**Single Application**](../../../getting-started/setting-environment/single-application/index.html) setup guide.

Right now we are interested in what can this config object do to help the Glue42 Clients. The interface of `glue.config.json` is:

```javascript
interface Glue42CoreConfig {
    glue?: Glue42Web.Config;
    gateway?: GatewayConfig;
}
```

We are interested in the `glue` property, which is of type [Glue42Web.Config](../../../../reference/core/latest/glue42%20web/index.html). The [Glue42Web.Config](../../../../reference/core/latest/glue42%20web/index.html) defined in property `glue` will be used (unless explicitly told not to) by all clients on the domain as a base config. This base config can be extended by each client and is helpful so that you don't have to declare the same object in all of your clients.

Example:
```json
// glue.config.json
{
    "glue": {
        "layouts": {
            "autoRestore": true,
            "autoSaveWindowContext": true
        }
    }
}
```
[Glue42Web.Config](../../../../reference/core/latest/glue42%20web/index.html)
Without any further configuration all Glue42 Clients will now auto-restore and auto-save their window contexts by default. If you wish a specific client to ignore this default, you can either:
- overwrite these properties in the client's [Glue42Web.Config](../../../../reference/core/latest/glue42%20web/index.html) object
- set `{"extends": false}` in the client's [Glue42Web.Config](../../../../reference/core/latest/glue42%20web/index.html) object

## Overview

**Glue42 Core** gives you the tools to enhance your traditional web apps and take your PWA apps to the next level. And all of this without requiring your users to install any additional software.

## Interop

The [Interop API](../../../reference/core/latest/interop/index.html) enables applications to:

- **offer functionality** to other applications by **registering** Interop methods;
- **discover applications which offer methods**;
- **invoke** (call) registered Interop methods;
- **stream and subscribe to real-time data** using the Interop Streaming API;

We call applications which offer methods and streams *Interop servers*, and applications which consume them - *Interop clients*, and collectively - **Interop instances**.

*For detailed information on the Interop API (methods, streams, discovery and more), see the [**Interop**](../../../glue42-concepts/data-sharing-between-apps/interop/javascript/index.html) documentation.*

## Window Management

Using the [Window Management API](../../../reference/core/latest/windows/index.html), your application can easily open and manipulate browser windows. This allows you to transform your traditional single-window web app into a multi-window native-like PWA application. The Window Management API enables applications to:

- **open multiple windows**;
- **manipulate the position and size** of opened windows;
- **pass context data upon opening new windows**;
- **listen for and handle events** related to opening and closing windows;
- **automatically save and restore** the positions and contexts of your application windows;

*For detailed information on the Window Management API, see the [**Window Management**](../../../glue42-concepts/windows/window-management/javascript/index.html) documentation.*

## Shared Contexts

A **Shared Context** is a named object (holding a `map` of `key`/`value` pairs) that stores cross application data. The context object can hold any cross-application data on your domain. Any application can update a context or subscribe for context update notifications (by using the name of the context). Apps can also react to context changes (by subscribing for context updates) or update the context at runtime.

The [Shared Contexts API](../../../reference/core/latest/shared%20contexts/index.html) offers a simple and effective solution for sharing data between the applications on the same domain. For instance, you have an application showing a list of clients (served at `/clients`) and an application showing a list of stocks (served at `/stocks`). You need your "Stocks" app to show all stocks by default, but if the "Clients" app is also opened (in a different window) and the user selects a client, then you want the "Stocks" app to only show stocks owned by the selected client. You can easily achieve this in a few simple steps by using the [Shared Contexts API](../../../reference/core/latest/shared%20contexts/index.html) API:

- instruct the "Clients" app to publish updates to a context object holding the `id` of the currently selected client;
- instruct the "Stocks" app to subscribe for updates of that same context object and specify how the "Stocks" app should handle the received data in order to update its current state;

*For detailed information on the Shared Contexts API, see the [**Shared Contexts**](../../../glue42-concepts/data-sharing-between-apps/shared-contexts/javascript/index.html) documentation.*
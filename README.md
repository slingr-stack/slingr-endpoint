# SLINGR endpoint

## Overview
The SLINGR endpoint allows to interact with another app built on the SLINGR platform through the REST API. Some features
of this endpoint are:

- Automatic handling of authentication process
- Shortcuts for the REST API
- Helpers to manipulate data
- Helpers to manipulate users
- Helpers to manipulate jobs
- Helpers to manipulate logs
- Helpers to manipulate files
- Webhook to receive events of other SLINGR apps

Apart from helpers you will see that in order to use the REST API of SLINGR you can make regular HTTP request to the 
REST API. For example:

```js
var res = app.endpoints.slingr.get('/data/companies');
```

For more information please refer to [docs](https://slingr-stack.github.io/platform/endpoints_slingr.html).

## About SLINGR

SLINGR is a low-code rapid application development platform that accelerates development, with robust architecture for integrations and executing custom workflows and automation.

[More info about SLINGR](https://slingr.io)

## License

This endpoint is licensed under the Apache License 2.0. See the `LICENSE` file for more details.


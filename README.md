---
title: SLINGR App endpoint
keywords: 
last_updated: March 1, 2018
tags: []
summary: "Detailed description of the API of the SLINGR App endpoint."
---

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

In most cases the provided helpers are enough. They are based on the SLINGR REST API so it is a good idea to check its
[documentation](https://slingr-stack.github.io/platform/app_development_apps_rest_api.html).

## Quick start

List records:

```js
var records = app.endpoints.slingr.data.find('companies', {type: 'TYPE_1'});
```

Get one record:

```js
var record = app.endpoints.slingr.data.findById('companies', '569de95ae4b077a87e90246b');
```

Create one record:

```js
var recordInfo = {
    name: 'ABC',
    type: 'TYPE_1',
    addresses: [
        {
            street: 'Example',
            city: 'Any',
            state: 'NY'
        },
        {
            street: 'Other',
            city: 'Some',
            state: 'AZ'
        }
    ],
    rating: 10
};
var createdRecord = app.endpoints.slingr.data.create('companies', recordInfo);
```

Update record:

```js
var updateInfo = {
    id: '569de95ae4b077a87e90246b',
    type: 'TYPE_2'
};
var updatedRecord = app.endpoints.slingr.data.update('companies', updateInfo);
```

Delete record:

```js
var deletedRecord = app.endpoints.slingr.data.delete('companies', '569de95ae4b077a87e90246b');
```

## Configuration

Before using the endpoint you need to create a user in the SLINGR app you want to access. Credentials of that user will
be used to configure the endpoint.

Keep in mind that permissions will apply so make sure you give enough permissions to that user to access the information
you need. If you try to access things that you don't have permissions, an exception will be thrown.

### User email

This is the email of user configured in your target SLINGR app. It is strongly recommended to create a user specifically 
for this instead of using an existing user account.

### User password

This is the password of the user configured in your target SLINGR app.

### App URL

This is the URL of the runtime. For example `https://myapp.slingrs.io/prod/runtime`.

If the target app has a custom domain, you can use it as well. For example `https://myappdomain.com`.

### Webhook token

String token to validate event requests coming form other SLINGR apps. By default a random hash is generated.

## Javascript API

The Javascript API provides direct access to the SLINGR REST API so you can make regular HTTP requests. You should check 
the [SLINGR REST API docs](https://slingr-stack.github.io/platform/app_development_apps_rest_api.html) to see what's 
available.

Additionally the endpoint has some shortcuts and helpers to simplify the usage of the REST API. This the preferred way
to use the endpoint. You should only resort to the raw REST API when there is something that cannot be done with the
shortcuts.

### HTTP requests

You can make a `GET`, `POST`, `PUT`, and `DELETE` request to the 
[SLINGR Apps API](https://slingr-stack.github.io/platform/app_development_apps_rest_api.html) like this:

```js
var company = app.endpoints.slingr.get('/data/companies/569de95ae4b077a87e90246b');
var newOne = app.endpoints.slingr.post('/data/companies', {name: 'ABC'});
```

Please take a look at the documentation of the [HTTP endpoint]({{site.baseurl}}/endpoints_http.html#javascript-api)
for more information.

### Users

Here we just provide a very brief description of the shortcuts available. For more information about available fields 
for filtering or expected responses check the [users API documentation](https://slingr-stack.github.io/platform/app_development_apps_rest_api.html#users).

#### Find

```js
var users = app.endpoints.slingr.users.find(params);
```

Allows to find users using a query map.

Samples:

```js
var userList = app.endpoints.slingr.users.find({external: true});
```

#### Find by ID

```js
var user = app.endpoints.slingr.users.findById(id);
```

Allows to find a specific user by unique identifier.

Samples:

```js
var user = app.endpoints.slingr.users.findById('595f99e694316a1aec97d4ff');
```

#### Find by email

```js
var user = app.endpoints.slingr.users.findByEmail(email);
```

Allows to find a specific user by email.

Samples:

```js
var user = app.endpoints.slingr.users.findByEmail('example@domain.com');
```

#### Create

```js
var createdUser = app.endpoints.slingr.users.create(userInfo);
```

Create a new user from an object with the user details.

Samples:

```js
var user = {
   firstName: 'Example',
   lastName: 'Test', 
   email: 'example@domain.com', 
   password: '12345678',
   groups: [
       {
           name: 'sales', 
           primary: true
       }
   ],
   external: true
};
var created = app.endpoints.slingr.users.create(user);
```

#### Update

```js
var updatedUser = app.endpoints.slingr.users.update(userInfoToUpdate);
```

Updates an existing user from an object with the fields to update.

Samples:

```js
var updateInfo = {
  id: '595f99e694316a1aec97d4ff',
  lastName: 'Updated'     
};
var updated = app.endpoints.slingr.users.update(updateInfo);
```

The ID should be in the fields.

#### Delete

```js
var deletedUser = app.endpoints.slingr.users.delete(idOrEmail);
```

Deletes a list of users by IDs or emails. This method can receive a string or an array of strings with IDs or emails.

Samples:

```js
var deletedUser = app.endpoints.slingr.users.delete('595f99e694316a1aec97d4ff');
var deletedUser = app.endpoints.slingr.users.delete('example@domain.com');
var deletedUsers = app.endpoints.slingr.users.delete(['595f99e694316a1aec97d4ff', 'example@domain.com']);
```

#### Activate

```js
var user = app.endpoints.slingr.users.activate(idOrEmail);
var users = app.endpoints.slingr.users.activate(arrayOfIdsOrEmails);
```

Reactivates inactive user(s). You can use the ID or email.

Samples:

```js
var user = app.endpoints.slingr.users.activate('595f99e694316a1aec97d4ff');
var user = app.endpoints.slingr.users.activate('example@domain.com');
var users = app.endpoints.slingr.users.activate(['595f99e694316a1aec97d4ff', '595f99e694316a1aec97d4f3']);
```

#### Deactivate

```js
var user = app.endpoints.slingr.users.deactivate(idOrEmail);
var users = app.endpoints.slingr.users.deactivate(arrayOfIdsOrEmails);
```

Deactivates active user(s). You can use the ID or email.

Samples:

```js
var user = app.endpoints.slingr.users.deactivate('595f99e694316a1aec97d4ff');
var user = app.endpoints.slingr.users.deactivate('example@domain.com');
var user = app.endpoints.slingr.users.deactivate(['595f99e694316a1aec97d4ff', '595f99e694316a1aec97d4f3']);
```

#### Unblock

```js
var user = app.endpoints.slingr.users.unblock(idOrEmail);
var user = app.endpoints.slingr.users.unblock(arrayOfIdsOrEmails);
```

Unblocks user(s). You can use the ID or email.

Samples:

```js
var user = app.endpoints.slingr.users.unblock('595f99e694316a1aec97d4ff');
var user = app.endpoints.slingr.users.unblock('example@domain.com');
var user = app.endpoints.slingr.users.unblock(['595f99e694316a1aec97d4ff', '595f99e694316a1aec97d4f3']);
```

#### Add identity provider

```js
var user = app.endpoints.slingr.users.addIdentityProvider(userIdOrEmail, providerIdOrName, externalId);
```

Adds an identity provider (by name or ID) with external ID to a user.

Samples:

```js
var user = app.endpoints.slingr.users.addIdentityProvider('595f99e694316a1aec97d4ff', 'slackSSO', 'user-123436');
var user = app.endpoints.slingr.users.addIdentityProvider('example@domain.com', '595f9a5f94316a1aec98a53b', 'user-123436');
```

#### Remove identity provider

```js
var user = app.endpoints.slingr.users.removeIdentityProvider(userIdOrEmail, providerIdOrName);
```

Removes an identity provider by name or ID from a user.

Samples:

```js
var user = app.endpoints.slingr.users.removeIdentityProvider('595f99e694316a1aec97d4ff', 'slackSSO');
var user = app.endpoints.slingr.users.removeIdentityProvider('example@domain.com', '595f9a5f94316a1aec98a53b');
```

#### Add group

```js
var user = app.endpoints.slingr.users.addGroup(userIdOrEmail, groupIdOrName, primary);
```

Adds a group (by name or ID) with primary indicator to a user.

Samples:

```js
var user = app.endpoints.slingr.users.addGroup('595f99e694316a1aec97d4ff', 'sales', true);
var user = app.endpoints.slingr.users.addGroup('example@domain.com', 'operations', false);
var user = app.endpoints.slingr.users.addGroup('595f99e694316a1aec97d4ff', '55e4d33ee4b03c6a12252904');
```

#### Remove group

```js
var user = app.endpoints.slingr.users.removeGroup(userIdOrEmail, groupIdOrName);
```

Removes a group by name or ID from a user.

Samples:

```js
var user = app.endpoints.slingr.users.removeGroup('595f99e694316a1aec97d4ff', 'operations');
var user = app.endpoints.slingr.users.removeGroup('example@domain.com', '55e4d33ee4b03c6a12252904');
```

### Data

Here we just provide a very brief description of the shortcuts available. For more information about available fields 
for filtering or expected responses check the [data API documentation](https://slingr-stack.github.io/platform/app_development_apps_rest_api.html#basic-operations).

#### Find

```js
var records = app.endpoints.slingr.data.find(entityName, query);
```

Finds records from an entity using a query.

Samples:

```js
var dataList = app.endpoints.slingr.data.find('companies', {type: 'TYPE_1'});
```

#### Find by id

```js
var record = app.endpoints.slingr.data.findById(entityName, recordId);
```

Finds one record by ID.

Samples:

```js
var data = app.endpoints.slingr.data.findById('companies', '569de95ae4b077a87e90246b');
```

#### Create

```js
var createdRecord = app.endpoints.slingr.data.create(entityName, recordInfo);
```

Creates a new record.

Samples:

```js
var recordInfo = {
    name: 'ABC',
    type: 'TYPE_1',
    addresses: [
        {
            street: 'Example',
            city: 'Any',
            state: 'NY'
        },
        {
            street: 'Other',
            city: 'Some',
            state: 'AZ'
        }
    ],
    rating: 10
};
var created = app.endpoints.slingr.data.create('companies', recordInfo);
```

#### Update

```js
var updatedRecord = app.endpoints.slingr.data.update(entityName, recordInfo);
```

Updates an existing record. Field `id` must by present in `recordInfo`.

Samples:

```js
var updateInfo = {
    id: '569de95ae4b077a87e90246b',
    type: 'TYPE_2',
    version:1
};
var updated = app.endpoints.slingr.data.update('companies', updateInfo);
```

```js
var original = app.endpoints.slingr.data.findById('companies', '569de95ae4b077a87e90246b');
original.type= 'TYPE_2';
var updated = app.endpoints.slingr.data.update('companies', original);
```

#### Delete

```js
var deletedRecordOrJob = app.endpoints.slingr.data.delete(entityName, recordId, async);
var deletedRecordsOrJob = app.endpoints.slingr.data.delete(entityName, arrayOfRecordIds, async);
var deletedRecordsOrJob = app.endpoints.slingr.data.delete(entityName, query, async);
```

Deletes a list of records by IDs from an entity. This method can receive a string or an array of strings with IDs. It is 
also possible to pass a query map. The last parameter is an indicator to make the operation asynchronous.

Samples:

```js
var deletedData = app.endpoints.slingr.data.delete('companies', '569de95ae4b077a87e90246b');
var deletedDataList = app.endpoints.slingr.data.delete('companies', ['569de95ae4b077a87e90246b', '569de95ae4b077a87e90246c']);
var deletedDataList = app.endpoints.slingr.data.delete('companies', {active: true});
var jobReponse = app.endpoints.slingr.data.delete('companies', {active: true}, true);
```

#### Execute action

```js
var updatedRecordOrJob = app.endpoints.slingr.data.executeAction(entityName, actionName, recordId, actionParams, async);
var updatedRecordsOrJob = app.endpoints.slingr.data.executeAction(entityName, actionName, arrayOfRecordIds, actionParams, async);
var updatedRecordsOrJob = app.endpoints.slingr.data.executeAction(entityName, actionName, query, actionParams, async);
```

Allows to execute actions over records. Parameters are:

- `entityName`: the name of the entity whose records and action belongs to.
- `actionName`: the name of the action to execute.
- `recordId` or `arrayOfRecordsIds` or `query`: indicates the records the action will be applied to.
- `actionParams`: the values for the parameters of the action.
- `async`: indicates that the action will be executed in background.

For more information see [API documentation](https://slingr-stack.github.io/platform/app_development_apps_rest_api.html#actions).

Samples:

```js
// using one record id
var updatedData = app.endpoints.slingr.data.executeAction('companies', 'action1', '569de95ae4b077a87e90246b', {param1: 'test', type: 'TYPE_3'});
```

```js
// using list of records
var response = app.endpoints.slingr.data.executeAction('companies', 'action1', ['569de95ae4b077a87e90246b', '569de95ae4b077a87e90736a'], {param1: 'test', type: 'TYPE_3'});
```

```js
// using query
var response = app.endpoints.slingr.data.executeAction('companies', 'action1', {type:'TYPE_1'}, {param1: 'test', type:'TYPE_3'});
```

```js
// executing asynchronously
var jobResponse = app.endpoints.slingr.data.executeAction('companies', 'action1', {active: true}, {param1: 'test', type: 'TYPE_3'}, true);
```

#### Aggregate

```js
var res = app.endpoints.slingr.data.aggregate(entityName, operations);
```

Allows to get aggregate information using [aggregated queries](https://slingr-stack.github.io/platform/app_development_apps_rest_api.html#aggregate-queries)

Samples:

```js
var res = app.endpoints.slingr.data.aggregate('companies',
    [
        {"project": "company,numberOfSkills"}, 
        {"group": {"by": "company", "totalSkills": "sum(numberOfSkills)"}}
    ]
);
```

#### Import

```js
var jobId = app.endpoints.slingr.data.import(entityName, fileId, options, waitForImport);
```

Imports records in the target application using an existing file in the source app (where this endpoint is running). Parameters are:

- `entityName`: the name of the entity where records will be imported.
- `fileId`: ID of the file from the source application that will be imported in the target application.
- `options`: options for the import process.
- `waitForImport`: indicates if the method should wait until the import is completed.

For more information see [API documentation](https://slingr-stack.github.io/platform/app_development_apps_rest_api.html#import-records).

Samples:

```js
// triggers an import and without waiting for completion
var job = app.endpoints.slingr.data.import('companies', record.field('file').id(), {updateRelationships: false});
```

```js
// does an import and waits until it is completed
var job = app.endpoints.slingr.data.import('companies', record.field('file').id(), {}, true);
```

#### Export

```js
var jobOrFile = app.endpoints.slingr.data.export(entityName, query, waitForExport, fileName);
```

Exports records from the target application and stores the result into a file in the source app (where this endpoint is 
running). Parameters are:

- `entityName`: the name of the entity.
- `query`: query object to filter exported records.
- `waitForExport`: this method will wait until results are exported and stored locally if this parameter is `true`.
- `fileName`: optional name for the result file into the source application (only used when `waitForExport` is `true`).

For more information see [API documentation](https://slingr-stack.github.io/platform/app_development_apps_rest_api.html#export-records).

Samples:

```js
// exports records from the target app
// you should get the file with `downloadExportedFile()` below
var job = app.endpoints.slingr.data.export('companies', {type: 'TYPE_1'});
```

```js
// synchronously it will return the file descriptor into the source app that contains the result
var file = app.endpoints.slingr.data.export('companies', {active: true}, true, 'companies-active.csv');
```

#### Download exported file

```js
var fileId = app.endpoints.slingr.data.downloadExportedFile(jobId, fileName)
```

Stores into the source app (where this endpoint is running) the result of an export job in the target app.

Samples:

```js
var jobId = app.endpoints.slingr.data.export('companies', {type: 'TYPE_1'});
var fileId = app.endpoints.slingr.data.downloadExportedFile(jobId, 'companies-type-1.csv')
```

### Files

Here we just provide a very brief description of the shortcuts available. For more information check the 
[files API documentation](https://slingr-stack.github.io/platform/app_development_apps_rest_api.html#files-handling).

#### Download

```js
var file = app.endpoints.slingr.files.downloadFile(fileId, fileName);
```

Stores into the source app (where this endpoint is running) a file stored in the target app using its identifier

Samples:

```js
var fileDescriptor = app.endpoints.slingr.files.downloadFile('595f9a5f94316a1aec98a539');
```

```js
// using optional name
var fileDescriptor = app.endpoints.slingr.files.downloadFile('595f9a5f94316a1aec98a539', 'local-version.txt');
```

#### Upload

```js
var remoteFile = app.endpoints.slingr.files.uploadFile(fileId);
```

Uploads a file into the target app using the content of a local file using its ID:

Samples:

```js
var remoteDescriptor = app.endpoints.slingr.files.uploadFile(record.field('file').id());
```

#### Share

```js
var sharedFile = app.endpoints.slingr.files.shareFile(fileId);
```

Shares a file stored in the target app using its ID.

```js
var sharedFile = app.endpoints.slingr.files.shareFile('595f9a5f94316a1aec98a539');
```

#### Fetch shared

```js
var file = app.endpoints.slingr.files.fetchSharedFile(sharedFileId)
```

Downloads (store a version into the source app) a previously shared file stored in the target app using its ID.

Samples:

```js
var sharedFile = app.endpoints.slingr.files.shareFile('595f9a5f94316a1aec98a539');
var localFileDescriptor = app.endpoints.slingr.files.fetchSharedFile(sharedFile.sharedFileId)
```


### Logs

Here we just provide a very brief description of the shortcuts available. For more information check the 
[logs API documentation](https://slingr-stack.github.io/platform/app_development_apps_rest_api.html#logs).

#### Find

```js
var logs = app.endpoints.slingr.logs.find(query);
```

Retrieves logs using a query.

Samples:

```js
var logsList = app.endpoints.slingr.logs.find({type:'EXTERNAL', level: 'ERROR'});
```

#### Create

```js
var createdLog = app.endpoints.slingr.logs.create(logInfo);
```

Creates a log using a level and a message. It also allows to send an additional info object.

Samples:

```js
var logInfo = {
    level: 'ERROR',
    message: 'Error with query',
    additionalInfo: {
        code: 404,
        map: {
            name: 'test',
            external: true
        }
    },
    external: true
};
var created = app.endpoints.slingr.logs.create(logInfo);
```

```js
var created = app.endpoints.slingr.logs.create({level: 'INFO', message:'Successful login'});
```

### Jobs

Here we just provide a very brief description of the shortcuts available. For more information about available fields 
for filtering or expected responses check the [jobs API documentation](https://slingr-stack.github.io/platform/app_development_apps_rest_api.html#jobs).

#### Find

```js
var jobs = app.endpoints.slingr.jobs.find(query);
```

Retrieves jobs using a query.

Sample:

```js
var jobsList = app.endpoints.slingr.jobs.find({status: 'PENDING'});
```

#### Find by id

```js
var job = app.endpoints.slingr.jobs.findById(jobId);
```

Retrieves a specific job using its ID.

Samples:

```js
var job = app.endpoints.slingr.jobs.findById('55e609bce4b03c6a124365a8');
```

#### Stop

```js
var job = app.endpoints.slingr.jobs.stop(jobId);
```

Stops a job.

Samples:

```js
var job = app.endpoints.slingr.jobs.stop('55e609bce4b03c6a124365a8');
```

#### Force stop

```js
var job = app.endpoints.slingr.jobs.forceStop(jobId);
```

Forces a job to stop.

Samples:

```js
var job = app.endpoints.slingr.jobs.forceStop('55e609bce4b03c6a124365a8');
```

#### Cancel

```js
var job = app.endpoints.slingr.jobs.cancel(jobId);
```

Cancels a job. It must be stopped.

Samples:

```js
var job = app.endpoints.slingr.jobs.cancel('55e609bce4b03c6a124365a8');
```

#### Resume

```js
var job = app.endpoints.slingr.jobs.resume(jobId);
```

Resumes a job that was stopped.

Samples:

```js
var job = app.endpoints.slingr.jobs.resume('55e609bce4b03c6a124365a8');
```

#### Restart

```js
var job = app.endpoints.slingr.jobs.restart(jobId);
```

Restarts (from the beginning) a job.

Samples:

```js
var job = app.endpoints.slingr.jobs.restart('55e609bce4b03c6a124365a8');
```

#### Wait for job

```js
var job = app.endpoints.slingr.jobs.waitForJob(jobId, desiredStatus, timeout);
var job = app.endpoints.slingr.jobs.waitForJob(jobId, arrayOfDesiredStatuses, timeout);
```

Waits until a job goes to one of the desired statuses or reaches a timeout (by default 1 hour).

Samples:

```js
var job = app.endpoints.slingr.jobs.waitForJob('55e609bce4b03c6a124365a8', 'FINISHED');
```

```js
// using timeout (5 minutes) and a list of statuses
var job = app.endpoints.slingr.jobs.waitForJob('55e609bce4b03c6a124365a8', ['FINISHED', 'CANCELLED', 'STOPPED'], 300000);
```

## About SLINGR

SLINGR is a low-code rapid application development platform that accelerates development, with robust architecture for integrations and executing custom workflows and automation.

[More info about SLINGR](https://slingr.io)

## License

This endpoint is licensed under the Apache License 2.0. See the `LICENSE` file for more details.


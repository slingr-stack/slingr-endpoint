/////////////////////
// Public API
/////////////////////
endpoint.data = {};
endpoint.users = {};
endpoint.files = {};
endpoint.logs = {};
endpoint.jobs = {};

//Users

endpoint.users.find = function (queryMap) {
    var params = convertParamsToString(queryMap);
    return endpoint.get('/users' + params);
};

endpoint.users.findById = function (userId) {
    if (!userId) {
        throw 'User identifier is required for this operation';
    }
    return endpoint.get('/users/' + userId);
};

endpoint.users.findByEmail = function (userEmail) {
    if (!userEmail) {
        throw 'User email is required for this operation';
    }
    return endpoint.get('/users/' + userEmail);
};

endpoint.users.create = function (userData) {
    if (!userData) {
        throw 'User body is required for this operation';
    }
    return endpoint.post('/users', userData);
};

endpoint.users.update = function (userData) {
    if (!userData) {
        throw 'User body is required for this operation';
    }
    if (!userData.id) {
        throw 'Record identifier is required for this operation';
    }
    return endpoint.put('/users/' + userData.id, userData);
};

endpoint.users.delete = function (idsOrEmails) {
    idsOrEmails = convertIdentifiersToString(idsOrEmails);
    if (!idsOrEmails) {
        throw 'User identifiers/emails are required for this operation';
    }
    return endpoint.delete('/users/' + idsOrEmails);
};

endpoint.users.activate = function (userIds) {
    if (!userIds) {
        throw 'Users identifiers are required for this operation';
    }
    userIds = convertIdentifiersToString(userIds);
    return endpoint.put('/users/' + userIds + '/reactivate');
};

endpoint.users.deactivate = function (userIds) {
    if (!userIds) {
        throw 'Users identifiers are required for this operation';
    }
    userIds = convertIdentifiersToString(userIds);
    return endpoint.put('/users/' + userIds + '/deactivate');
};

endpoint.users.unblock = function (userIds) {
    if (!userIds) {
        throw 'Users identifiers are required for this operation';
    }
    userIds = convertIdentifiersToString(userIds);
    return endpoint.put('/users/' + userIds + '/unblock');
};

endpoint.users.addIdentityProvider = function (userId, providerIdOrName, externalId) {
    if (!userId) {
        throw 'User identifier is required for this operation';
    }
    if (!providerIdOrName) {
        throw 'Provider identifier is required for this operation';
    }
    if (!externalId) {
        throw 'External identifier is required for this operation';
    }
    var data = {externalId: externalId};
    if (isObjectId(providerIdOrName)) {
        data.id = providerIdOrName;
    } else {
        data.name = providerIdOrName;
    }
    return endpoint.put('/users/' + userId + '/addIdentityProvider', data);
};

endpoint.users.removeIdentityProvider = function (userId, providerIdOrName) {
    if (!userId) {
        throw 'User identifier is required for this operation';
    }
    if (!providerIdOrName) {
        throw 'Provider identifier is required for this operation';
    }
    return endpoint.put('/users/' + userId + '/removeIdentityProvider/' + providerIdOrName);
};

endpoint.users.addGroup = function (userId, groupIdOrName, primary) {
    if (!userId) {
        throw 'User identifier is required for this operation';
    }
    if (!groupIdOrName) {
        throw 'Provider identifier is required for this operation';
    }

    var data = {primary: !!primary};
    if (isObjectId(groupIdOrName)) {
        data.id = groupIdOrName;
    } else {
        data.name = groupIdOrName;
    }
    return endpoint.put('/users/' + userId + '/addGroup', data);
};

endpoint.users.removeGroup = function (userId, groupIdOrName) {
    if (!userId) {
        throw 'User identifier is required for this operation';
    }
    if (!groupIdOrName) {
        throw 'Provider identifier is required for this operation';
    }
    return endpoint.put('/users/' + userId + '/removeGroup/' + groupIdOrName);
};

//Data

endpoint.data.aggregate = function (entityName, queryMap) {
    if (!entityName) {
        throw 'Entity name is required for this operation';
    }
    return endpoint.put('/data/' + entityName + '/aggregate', queryMap);
};

endpoint.data.find = function (entityName, queryMap) {
    if (!entityName) {
        throw 'Entity name is required for this operation';
    }
    var params = convertParamsToString(queryMap);
    return endpoint.get('/data/' + entityName + params);
};

endpoint.data.findById = function (entityName, id) {
    if (!entityName) {
        throw 'Entity name is required for this operation';
    }
    if (!id) {
        throw 'Record identifier is required for this operation';
    }
    return endpoint.get('/data/' + entityName + '/' + id);
};

endpoint.data.create = function (entityName, record) {
    if (!entityName) {
        throw 'Entity name is required for this operation';
    }
    if (!record) {
        throw 'Record body is required for this operation';
    }
    return endpoint.post('/data/' + entityName, record);
};

endpoint.data.update = function (entityName, record) {
    if (!entityName) {
        throw 'Entity name is required for this operation';
    }
    if (!record) {
        throw 'Record body is required for this operation';
    }
    if (!record.id) {
        throw 'Record identifier is required for this operation';
    }
    return endpoint.put('/data/' + entityName + '/' + record.id, record);
};

endpoint.data.delete = function (entityName, queryMapOrIds, async) {
    if (!entityName) {
        throw 'Entity name is required for this operation';
    }
    if (typeof queryMapOrIds == 'object') {
        var str = '';
        if (Array.isArray(queryMapOrIds)) {
            var first = true;
            for (var i in queryMapOrIds) {
                if (first) {
                    str += queryMapOrIds[i];
                    first = false;
                } else {
                    str += ',' + queryMapOrIds[i];
                }
            }
            queryMapOrIds = str;
        } else {
            for (var i in queryMapOrIds) {
                str += '&' + i + '=' + queryMapOrIds[i];
            }
            return endpoint.delete('/data/' + entityName + '?_async=' + (async ? 'true' : 'false') + str);
        }
    }
    if (!queryMapOrIds) {
        throw 'Record identifiers are required for this operation';
    }
    return endpoint.delete('/data/' + entityName + '/' + queryMapOrIds + (async ? '?_async=true' : ''));
};

endpoint.data.executeAction = function (entityName, actionName, queryMapOrIds, content, async) {
    if (!entityName) {
        throw 'Entity name is required for this operation';
    }
    if (!actionName) {
        throw 'Action name is required for this operation';
    }
    if (typeof queryMapOrIds == 'object') {
        var str = '';
        if (Array.isArray(queryMapOrIds)) {
            var first = true;
            for (var i in queryMapOrIds) {
                if (first) {
                    str += queryMapOrIds[i];
                    first = false;
                } else {
                    str += ',' + queryMapOrIds[i];
                }
            }
            queryMapOrIds = str;
        } else {
            for (var i in queryMapOrIds) {
                str += '&' + i + '=' + queryMapOrIds[i];
            }
            return endpoint.put('/data/' + entityName + '/' + actionName + '?_async=' + (async ? 'true' : 'false') + str, content);
        }
    }
    if (!queryMapOrIds) {
        throw 'Record identifiers are required for this operation';
    }
    return endpoint.put('/data/' + entityName + '/' + queryMapOrIds + '/' + actionName + (async ? '?_async=true' : ''), content);
};

endpoint.data.import = function (entityName, fileId, options, waitForImport) {
    if (!entityName) {
        throw 'Entity name is required for this operation';
    }
    if (!fileId) {
        throw 'File identifier is required for this operation';
    }
    var params = convertParamsToString(options);
    var response = endpoint.post({
        path: '/data/' + entityName + '/import' + params,
        multipart: true,
        parts: [
            {
                name: 'file',
                type: 'file',
                fileId: fileId
            }
        ]
    });
    if (waitForImport) {
        return endpoint.data.waitForJob(response.jobId, ['FINISHED', 'STOPPED', 'CANCELED']);
    } else {
        return response;
    }
};

endpoint.data.export = function (entityName, queryMap, waitForExport, fileName) {
    if (!entityName) {
        throw 'Entity name is required for this operation';
    }
    var params = convertParamsToString(queryMap);
    var response = endpoint.put('/data/' + entityName + '/export' + params);
    if (waitForExport) {
        return endpoint.data.downloadExportedFile(response.jobId, fileName);
    } else {
        return response;
    }
};

endpoint.data.downloadExportedFile = function (jobId, fileName) {
    if (!jobId) {
        throw 'Job identifier is required for this operation';
    }
    var job = endpoint.jobs.waitForJob(jobId, ['FINISHED', 'STOPPED', 'CANCELED']);
    if (job.status == 'STOPPED' || job.status == 'CANCELED') {
        throw 'Job for export [' + jobId + '] did not finished in a correct status';
    }
    return endpoint.files.downloadFile(job.results.fileId, fileName);
};

//Files

endpoint.files.downloadFile = function (fileId, fileName) {
    if (!fileId) {
        throw 'File identifier is required for this operation';
    }
    var request = {path: '/files/' + fileId, forceDownload: true, downloadSync: true};
    if (fileName) {
        request.fileName = fileName;
    }
    return endpoint.get(request);
};

endpoint.files.uploadFile = function (fileId) {
    if (!fileId) {
        throw 'File identifier is required for this operation';
    }
    return endpoint.post({
        path: '/files',
        multipart: true,
        parts: [
            {
                name: 'file',
                type: 'file',
                fileId: fileId
            }
        ]
    });
};

endpoint.files.shareFile = function (fileId) {
    if (!fileId) {
        throw 'File identifier is required for this operation';
    }
    return endpoint.put('/files/' + fileId + '/share');
};

endpoint.files.fetchSharedFile = function (sharedFileId, fileName) {
    if (!sharedFileId) {
        throw 'File identifier is required for this operation';
    }
    var request = {path: '/files/shared/' + sharedFileId, forceDownload: true, downloadSync: true};
    if (fileName) {
        request.fileName = fileName;
    }
    return endpoint.get(request);
};

//Logs

endpoint.logs.find = function (queryMap) {
    var params = convertParamsToString(queryMap);
    return endpoint.get('/status/logs' + params);
};

endpoint.logs.create = function (level, message, additionalInfo) {
    if (!level) {
        throw 'Level is required for this operation';
    }
    if (!message) {
        throw 'Message is required for this operation';
    }
    return endpoint.post('/status/logs', {level: level, message: message, additionalInfo: additionalInfo});
};

//Jobs

endpoint.jobs.find = function (queryMap) {
    var params = convertParamsToString(queryMap);
    return endpoint.get('/status/jobs' + params);
};

endpoint.jobs.findById = function (jobId) {
    if (!jobId) {
        throw 'Job identifier is required for this operation';
    }
    return endpoint.get('/status/jobs/' + jobId);
};

endpoint.jobs.stop = function (jobId) {
    if (!jobId) {
        throw 'Job identifier is required for this operation';
    }
    return endpoint.put('/status/jobs/' + jobId + '/stop');
};

endpoint.jobs.forceStop = function (jobId) {
    if (!jobId) {
        throw 'Job identifier is required for this operation';
    }
    return endpoint.put('/status/jobs/' + jobId + '/forceStop');
};

endpoint.jobs.cancel = function (jobId) {
    if (!jobId) {
        throw 'Job identifier is required for this operation';
    }
    return endpoint.put('/status/jobs/' + jobId + '/cancel');
};

endpoint.jobs.resume = function (jobId) {
    if (!jobId) {
        throw 'Job identifier is required for this operation';
    }
    return endpoint.put('/status/jobs/' + jobId + '/resume');
};

endpoint.jobs.restart = function (jobId) {
    if (!jobId) {
        throw 'Job identifier is required for this operation';
    }
    return endpoint.put('/status/jobs/' + jobId + '/restart');
};

endpoint.jobs.waitForJob = function (jobId, desiredStatus, maxTimeToWait) {
    if (!jobId) {
        throw 'Job identifier is required for this operation';
    }
    if (!desiredStatus) {
        throw 'Desired status is required for this operation';
    }

    var job = endpoint.jobs.findById(jobId);

    if (!job) {
        throw 'Job with id: [' + jobId + '] not found';
    }

    maxTimeToWait = maxTimeToWait || 3600000;
    var containsCurrentStatus = function (currentStatus, desiredStatus) {
        if (sys.internal.utils.isEmpty(currentStatus)) {
            return true;
        }
        if (Array.isArray(desiredStatus)) {
            for (var index in desiredStatus) {
                var status = desiredStatus[index];
                if (currentStatus == status) {
                    return true;
                }
            }
        } else {
            if (currentStatus == desiredStatus) {
                return true;
            }
        }
    };
    var accumulatedTime = 0;
    var currentStatus = job.status;
    while (accumulatedTime < maxTimeToWait && !containsCurrentStatus(currentStatus, desiredStatus)) {
        sys.utils.script.wait(sys.jobs.WAITING_STEP);
        accumulatedTime += sys.jobs.WAITING_STEP;
        job = endpoint.jobs.findById(jobId);
        currentStatus = job.status;
        if (accumulatedTime >= maxTimeToWait) {
            throw 'Maximum waiting time reached for job [' + jobId + ']';
        }
    }
    // return the latest version of the job
    return endpoint.jobs.findById(jobId);
};

///////////////////////////////////
// Public API - Generic Functions
/////////////////////////////////

endpoint.get = function (url) {
    var options = checkHttpOptions(url, {});
    return endpoint._get(options);
};

endpoint.post = function (url, options) {
    options = checkHttpOptions(url, options);
    return endpoint._post(options);
};

endpoint.put = function (url, options) {
    options = checkHttpOptions(url, options);
    return endpoint._put(options);
};

endpoint.delete = function (url) {
    var options = checkHttpOptions(url, {});
    return endpoint._delete(options);
};

/////////////////////////////////////
//  Private helpers
////////////////////////////////////

var convertParamsToString = function (queryMap) {
    var params = '';
    var first = true;
    if (queryMap && typeof queryMap == 'object') {
        for (var key in queryMap) {
            if (first) {
                params += '?' + key + '=' + queryMap[key];
                first = false;
            } else {
                params += '&' + key + '=' + queryMap[key];
            }
        }
    }
    return params;
};

var convertIdentifiersToString = function (identifiers) {
    if (typeof identifiers == 'object') {
        var str = '';
        if (Array.isArray(identifiers)) {
            var first = true;
            for (var i in identifiers) {
                if (first) {
                    str += identifiers[i];
                    first = false;
                } else {
                    str += ',' + identifiers[i];
                }
            }
            identifiers = str;
        }
    }
    return identifiers;
};

var isObjectId = function (value) {
    if (!value || typeof value !== 'string') {
        return false;
    }
    var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");
    return checkForHexRegExp.test(value);
};

var checkHttpOptions = function (url, options) {
    options = options || {};
    if (!!url) {
        if (isObject(url)) {
            // take the 'url' parameter as the options
            options = url || {};
        } else {
            if (!!options.path || !!options.params || !!options.body) {
                // options contains the http package format
                options.path = url;
            } else {
                // create html package
                options = {
                    path: url,
                    body: options
                }
            }
        }
    }
    return options;
};

var isObject = function (obj) {
    return !!obj && stringType(obj) === '[object Object]'
};

var stringType = Function.prototype.call.bind(Object.prototype.toString);
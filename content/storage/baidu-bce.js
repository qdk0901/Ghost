// # Local File System Image Storage module
// The (default) module for storing images, using the local file system

var express   = require('express'),
    fs        = require('fs-extra'),
    path      = require('path'),
    util      = require('util'),
    Promise   = require('bluebird'),
    errors    = require('../../core/server/errors'),
    config    = require('../../core/server/config'),
    utils     = require('../../core/server/utils'),
    baseStore = require('../../core/server/storage/base'),
	bce		= require('baidubce-sdk');

var client = new bce.BosClient(config.storage.config.baiduBce);
var bucket = config.storage.config.baiduBce.bucket;
var prefix = config.storage.config.baiduBce.objectUrlPrefix;

function LocalFileStore() {
}
util.inherits(LocalFileStore, baseStore);

// ### Save
// Saves the image to storage (the file system)
// - image is the express image object
// - returns a promise which ultimately returns the full url to the uploaded image
LocalFileStore.prototype.save = function (image, targetDir) {
	var key = image.name;
	
	console.log('#######' + image.path);
	return client.putObjectFromFile(bucket, key, image.path)
	.then(function() {
		return prefix + '/' + key;
	})
	.catch(function(error) {
		console.error(error);
		return Promise.reject(error);
	});
};

LocalFileStore.prototype.exists = function (filename) {
    return new Promise(function (resolve) {
        fs.stat(filename, function (err) {
            var exists = !err;
            resolve(exists);
        });
    });
};

LocalFileStore.prototype.serve = function () {
    return express['static'](config.paths.imagesPath, {maxAge: utils.ONE_YEAR_MS});
};

module.exports = LocalFileStore;

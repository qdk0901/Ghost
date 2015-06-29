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
	aly		= require('aliyun-sdk')

var oss = new aly.OSS(
	config.storage.config.aliyunOss
);

var bucket = config.storage.config.aliyunOss.bucket;
var prefix = config.storage.config.aliyunOss.objectUrlPrefix

function LocalFileStore() {
}
util.inherits(LocalFileStore, baseStore);

// ### Save
// Saves the image to storage (the file system)
// - image is the express image object
// - returns a promise which ultimately returns the full url to the uploaded image
LocalFileStore.prototype.save = function (image, targetDir) {

	return Promise.promisify(fs.readFile)(image.path).then(function (fileData) {
		return Promise.promisify(oss.putObject, oss)({
		  Bucket: bucket,
		  Key: image.name,
		  Body: fileData,
		  AccessControlAllowOrigin: '',
		  ContentType: 'image/xyz',
		  CacheControl: 'no-cache', 
		  ContentDisposition: '', 
		  ContentEncoding: 'utf-8',
		  Expires: new Date() 
		}).then(function (err, data) {
			  if (err) {
				console.log('error:', err);
				return Promise.reject(err);
			  }
			  
			  var url = prefix + "/" + image.name;
			  console.log('success uploaded: ' + url)
			  return url;
		});
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

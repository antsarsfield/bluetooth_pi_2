var bleno = require('bleno');
var os = require('os');
var util = require('util');
var fs = require('fs');
var dirTree = require('directory-tree');

var BlenoCharacteristic = bleno.Characteristic;

var deleteFilesCharacteristic = function() {
  deleteFilesCharacteristic.super_.call(this, {
    uuid: 'd361aadb-2982-4bf7-803d-36fa6de048fb',
    properties: ['read', 'write'],
    value: null
  });

  this._value = new Buffer(0);
};


deleteFilesCharacteristic.prototype.onReadRequest = function(offset, callback) {
  //return JSON of the file structure of the folder "file" structured like this:

  var tree = dirTree("/some/path");

  if(!offset){
    console.log(JSON.stringify(tree));
    this._value = new Buffer(JSON.stringify(tree));
  }
  callback(this.RESULT_SUCCESS, this._value.slice(offset, this._value.length));
};



deleteFilesCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback)
{
  console.log("recived delete request");
  if(!offset)
	{
  }
  var path = data.toString('ascii');
  console.log("deleting " + path);
  //delete file at the path
  callback(this.RESULT_SUCCESS);
};


util.inherits(deleteFilesCharacteristic, BlenoCharacteristic);
module.exports = deleteFilesCharacteristic;

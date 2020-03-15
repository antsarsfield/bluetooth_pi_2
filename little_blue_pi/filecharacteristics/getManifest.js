var bleno = require('bleno');
var os = require('os');
var util = require('util');
var fs = require('fs');
var dirTree = require('directory-tree');

var BlenoCharacteristic = bleno.Characteristic;

var getManifestCharacteristic = function() {
  getManifestCharacteristic.super_.call(this, {
    uuid: '19cbb8e3-a1c5-4b9a-b98c-3ba0f3b10dc3',
    properties: ['read'],
    value: null
  });

 this._value = new Buffer(0);
};

var fs_offset =0;
var file = null;

getManifestCharacteristic.prototype.onReadRequest = function(offset, callback) {
  //return JSON of the file structure of the folder "file" structured like this:

  var tree = dirTree("/some/path");

  if(!offset){
    console.log(JSON.stringify(tree));
    this._value = new Buffer(JSON.stringify(tree));
  }
  callback(this.RESULT_SUCCESS, this._value.slice(offset, this._value.length));
};

util.inherits(getManifestCharacteristic, BlenoCharacteristic);
module.exports = getManifestCharacteristic;
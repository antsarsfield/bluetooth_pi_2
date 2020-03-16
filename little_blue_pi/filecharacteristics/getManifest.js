var bleno = require('bleno');
var os = require('os');
var util = require('util');
var fs = require('fs');
var dirTree = require('directory-tree');

var BlenoCharacteristic = bleno.Characteristic;

var getManifestCharacteristic = function() {
  getManifestCharacteristic.super_.call(this, {
    uuid: '19cbb8e3-a1c5-4b9a-b98c-3ba0f3b10dc3',
    properties: ['read', 'write', 'notify'],
    value: null
  });

  this._value = new Buffer(0);
  this._updateValueCallback = null;
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



getManifestCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback)
{
  if(!offset)
	{
  }
  var stringData = data.toString('ascii');
  if(stringData == "CONTINUE")
  {
    if(fs_offset < this._value.length)
    {
      console.log(this._value.slice(fs_offset,fs_offset + bleno.mtu).toString());
      //this._value = new Buffer(file.slice(fs_offset,fs_offset + bleno.mtu).toString());
      this._updateValueCallback(this._value.slice(fs_offset,fs_offset + bleno.mtu).toString());
      fs_offset += bleno.mtu;
      callback(this.RESULT_SUCCESS);
    }
    else{
      this._updateValueCallback(new Buffer("DONE"));
    }
  }
  else
  {
    var tree = dirTree("/some/path");
    console.log(JSON.stringify(tree));
    this._value = new Buffer(JSON.stringify(tree));
    callback(this.RESULT_SUCCESS);
  }
};

getManifestCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
  console.log("getManifestCharacteristic - onSubscribe");
  //console.log('Began sending File');
  this._updateValueCallback = updateValueCallback;
};


getManifestCharacteristic.prototype.onUnsubscribe = function() {
  console.log('getManifestCharacteristic - onUnsubscribe');

  this._updateValueCallback = null;
};


util.inherits(getManifestCharacteristic, BlenoCharacteristic);
module.exports = getManifestCharacteristic;

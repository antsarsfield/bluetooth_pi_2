var bleno = require('bleno');
var os = require('os');
var util = require('util');
var fs = require('fs');
var dirTree = require('directory-tree');

var BlenoCharacteristic = bleno.Characteristic;

var pulseCharacteristic = function() {
  pulseCharacteristic.super_.call(this, {
    uuid: 'abb0994c-8312-480b-a253-57f3065c167d',
    properties: ['read', 'write'],
    value: null
  });

  this._value = new Buffer(0);
};

pulseCharacteristic.prototype.onReadRequest = function(offset, callback) {
  //return JSON of the file structure of the folder "file" structured like this:

  var tree = dirTree("/some/path");

  if(!offset){
    console.log(JSON.stringify(tree));
    this._value = new Buffer(JSON.stringify(tree));
  }
  callback(this.RESULT_SUCCESS, this._value.slice(offset, this._value.length));
};



pulseCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback)
{
  console.log("recived write request");
  if(!offset)
	{
  }
  var stringData = data.toString('ascii');
  console.log(stringData);
  if(stringData == "_START_")
  {
    //start pulse code
    callback(this.RESULT_SUCCESS);
  }
  else if(stringData == "_STOP_")
  {
    //stop pulse code
    callback(this.RESULT_SUCCESS);
  }
  else
  {
    //send annoation
    callback(this.RESULT_SUCCESS);
  }
};


util.inherits(pulseCharacteristic, BlenoCharacteristic);
module.exports = pulseCharacteristic;

var bleno = require('bleno');
var os = require('os');
var util = require('util');
var fs = require('fs');

var BlenoCharacteristic = bleno.Characteristic;

var FileShareCharacteristic = function() {
 FileShareCharacteristic.super_.call(this, {
    uuid: '4ab6dea3-5256-47d5-b240-cee16ec4c3b9',
    properties: ['read', 'write', 'notify'],
    value: null
  });

 this._value = new Buffer(0);
 this._updateValueCallback = null;
};

var fs_offset =0;
var file = null;

FileShareCharacteristic.prototype.onReadRequest = function(offset, callback) {

  callback(this.RESULT_SUCCESS, this._value);
};

FileShareCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback)
{
  if(!offset)
	{
  }
  var stringData = data.toString('ascii');
  if(stringData == "CONTINUE")
  {
    if(fs_offset < file.length)
    {
      console.log(file.slice(fs_offset,fs_offset + bleno.mtu).toString());
      this._value = new Buffer(file.slice(fs_offset,fs_offset + bleno.mtu).toString());
      this._updateValueCallback(this._value);
      fs_offset += bleno.mtu;
      callback(this.RESULT_SUCCESS);
    }
    else{
      this._updateValueCallback(new Buffer("DONE"));
    }
  }
  else
  {
    setFile(stringData)
    .then(function(){
      callback(this.RESULT_SUCCESS);
    }).catch(function(){
      callback(this.RESULT_UNLIKELY_ERROR);
    });
  }
};

FileShareCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
  console.log("FileShareCharacteristic - onSubscribe");
  console.log('Began sending File');
  this._updateValueCallback = updateValueCallback;
};


FileShareCharacteristic.prototype.onUnsubscribe = function() {
  console.log('FileShareCharacteristic - onUnsubscribe');

  this._updateValueCallback = null;
};

function setFile(path){
  return new Promise(function(resolve, reject){
    fs.readFile(path,'utf8', function (err, data) {
      if (err) {
          reject(err);
      }
      fs_offset =0;
      file = data;
      console.log("Got file");
      resolve("Got file");
    });
  });
}

util.inherits(FileShareCharacteristic, BlenoCharacteristic);
module.exports = FileShareCharacteristic;

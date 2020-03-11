var bleno = require('bleno');
var os = require('os');
var util = require('util');
const fs = require('fs');

var BlenoCharacteristic = bleno.Characteristic;

var FileShareCharacteristic = function() {
 LoadAverageCharacteristic.super_.call(this, {
    uuid: '4ab6dea3-5256-47d5-b240-cee16ec4c3b9',
    properties: ['read', 'write', 'indicate'],
  });

 this._value = new Buffer(0);
 this._updateValueCallback = null;
};

FileShareCharacteristic.prototype.onReadRequest = function(offset, callback) {

  if(!offset) {

    var loadAverage = os.loadavg().map(function(currentValue, index, array){

      return currentValue.toFixed(3);
    });

    this._value = new Buffer(JSON.stringify({
      'oneMin' : loadAverage[0],
      'fiveMin': loadAverage[1],
      'fifteenMin': loadAverage[2]
    }));
  }

  console.log('LoadAverageCharacteristic - onReadRequest: value = ' +
    this._value.slice(offset, offset + bleno.mtu).toString()
  );

  callback(this.RESULT_SUCCESS, this._value.slice(offset, this._value.length));
};

FileShareCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback)
{
  	if(!offset)
	{
		console.log(data.toString('ascii'));
		callback(this.RESULT_SUCCESS);
	}
};

FileShareCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
  console.log("FileShareCharacteristic - onSubscribe");
  console.log('Began sending File');
  this._updateValueCallback = updateValueCallback;
  sendFile();
};


FileShareCharacteristic.prototype.onUnsubscribe = function() {
  console.log('FileShareCharacteristic - onUnsubscribe');

  this._updateValueCallback = null;
};

function sendFile(){
  fs.readFile('./Sacramentorealestatetransactions.csv', function read(err, data) {
    if (err) {
        throw err;
    }
    const content = data;
    var offset = 0;

    while(offset<data.length)
    {
      this._updateValueCallback(content.slice(offset,offset + bleno.mtu));
      offset += bleno.mtu;
    }
    // Invoke the next step here however you like
    //console.log(content);
    this._updateValueCallback("DONE");   // Put all of the code here (not the best solution)
  });
};

util.inherits(LoadAverageCharacteristic, BlenoCharacteristic);
module.exports = LoadAverageCharacteristic;

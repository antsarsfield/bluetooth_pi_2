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

  // if(!offset) {

  //   var loadAverage = os.loadavg().map(function(currentValue, index, array){

  //     return currentValue.toFixed(3);
  //   });

  //   this._value = new Buffer(JSON.stringify({
  //     'oneMin' : loadAverage[0],
  //     'fiveMin': loadAverage[1],
  //     'fifteenMin': loadAverage[2]
  //   }));
  // }

  // console.log('LoadAverageCharacteristic - onReadRequest: value = ' +
  //   this._value.slice(offset, offset + bleno.mtu).toString()
  // );

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
      //callback(this.RESULT_SUCCESS);
      console.log(file.slice(fs_offset,fs_offset + bleno.mtu).toString());
      //wait(100);
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
  //sendFile();
};


FileShareCharacteristic.prototype.onUnsubscribe = function() {
  console.log('FileShareCharacteristic - onUnsubscribe');

  this._updateValueCallback = null;
};

function setFile(filename){
  return new Promise(function(resolve, reject){
    fs.readFile('bluetooth_pi_2/little_blue_pi/files/test.csv','utf8', function (err, data) {
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

function wait(ms)
{
var d = new Date();
var d2 = null;
do { d2 = new Date(); }
while(d2-d < ms);
}
// function sendFile(){
//   fs.readFile('Project/bluetooth_pi_2-master/little_blue_pi/filecharacteristics/test.csv','utf8', function (err, data) {
//     if (err) {
//         throw err;
//     }
//     const content = data;
//     var offset = 0;

//     while(offset<data.length)
//     {
//       this._updateValueCallback(content.slice(offset,offset + bleno.mtu));
//       offset += bleno.mtu;
//     }
//     // Invoke the next step here however you like
//     //console.log(content);
//     this._updateValueCallback("DONE");   // Put all of the code here (not the best solution)
//   });
// };

util.inherits(FileShareCharacteristic, BlenoCharacteristic);
module.exports = FileShareCharacteristic;

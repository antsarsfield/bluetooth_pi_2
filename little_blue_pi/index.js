var bleno = require('bleno');

var SystemInformationService = require('./systeminformationservice');

var systemInformationService = new SystemInformationService();
var fileService = new FileService();

bleno.on('stateChange', function(state) {
  console.log('on -> stateChange: ' + state);

  if (state === 'poweredOn') {

    bleno.startAdvertising("BLE: Alice DigitalLabs", [systemInformationService.uuid]);
  }
  else {

    bleno.stopAdvertising();
  }
});

bleno.on('advertisingStart', function(error) {

  console.log('on -> advertisingStart: ' +
    (error ? 'error ' + error : 'success')
  );

  if (!error) {

    bleno.setServices([
      systemInformationService,
      fileService
    ]);
  }
});

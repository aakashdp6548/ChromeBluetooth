/*
 * A chrome extension that connects to a device over bluetooth
 * and receives a file from the device
 *
 * Developed by Aakash Patel and Saad Mallick
 * Version 1.0
 * July 2018
 */

// dictionary to hold information about devices
var device_list = {};
var add_device = function(device) {
    device_list.push(device.address: device.name);
};
var remove_device = function(device) {
    delete device_list[device.address];
}

// information about connecting to a device
var uuid = '1105';
var id = 0;
var onConnectedCallback = function() {
    if (chrome.runtime.lastError) {
        console.log("Connection failed: " + chrome.runtime.lastError.message);
    } else {
        // do something else
    }
};

// converts a string to an array buffer
var stringToBuffer = function(str) {
    var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
    var bufView = new Uint16Array(buf);
    for (var i=0, strLen=str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}

// notify user when new device makes connection
chrome.bluetooth.onDeviceAdded.addListener(function(device) {
    console.log("New device found: " + device.address + " " + device.name);
    add_device(device);
});

// notify when connection is lost
chrome.bluetooth.onDeviceRemoved.addListener(function(device) {
    console.log("Device disconnected: " + device.address + " " + device.name);
    remove_device(device);
});

// start script on launch
chrome.app.runtime.onLaunched.addListener(function() {
    // creates a window
    chrome.app.window.create('window.html', {
        'outerBounds': {
            'width': 640,
            'height': 480
        }
    });

    // get adapter information
    chrome.bluetooth.getAdapterState(function(adapter) {
        console.log("Adapter " + adapter.address + ": " + adapter.name);
    });

    // find available devices
    chrome.bluetooth.getDevices(function(devices) {
        for (var i = 0; i < devices.length; i++) {
            // log address and name
            console.log(devices[i].address + ' ' + devices[i].name);
            // add the discovered device to the list
            add_device(devices[i]);
        }
    });

    // print devices to window
    for (var address in device_list) {
        var device_id = "device" + address;
        $("#devices-list").append("<div id=" + device_id + "><p>" +
            device_list[i].name + "</p><p>" + device_list[i].address
        )
    }

    var socket = -1;
    // create socket
    chrome.bluetoothSocket.create(function(createInfo) {
        socket = createInfo.socketId;
        try {
            chrome.bluetoothSocket.connect(createInfo.socketId,
                device_list[1]["address"], uuid, onConnectedCallback)
            console.log("Connected to device " + device_list[0]["name"] + " on socket " + socket);

            // try sending info to device
            chrome.bluetoothSocket.send(socket, stringToBuffer("hello"), function(bytes_sent) {
                if (chrome.runtime.lastError) {
                    console.log("Send failed: " + chrome.runtime.lastError.message);
                }
                else {
                    console.log("Sent " + bytes_sent + " bytes")
                }
            });
        }
        catch(error) {
            console.log("error: " + error.message);
        }
    });

});

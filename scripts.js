function searchBluetoothDevices() {
    console.log('Requesting Bluetooth Device...');
    var options = {};
    options.acceptAllDevices = true;
    navigator.bluetooth.requestDevice(options)
    .then(function(device) {
        
        var $heading = $("<h1>Device found:</h1>");

        // get device info
        var $name = $("<p>Name: " + device.name + "</p>");
        var $id = $("<p>Id: " + device.id + "</p>");
        var $connected = $("<p>Connected: " + device.gatt.connected + "</p>");

        // print device info to screen
        var $newDiv = $("<div id='device-info'></div>");
        $newDiv.append($heading, $name, $id, $connected);

        $("#device-info").replaceWith($newDiv);

    })
    .catch(function(error) {
        console.log("Error: " + error);
    });
}

// when the button is clicked, look for bluetooth devices
document.addEventListener('DOMContentLoaded', function() {
    //document.getElementById("check-devices").onclick = myFunction;
    $("#check-devices").on("click", searchBluetoothDevices);
});

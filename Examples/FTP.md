# FTP Functions Usage Example

```javascript

const remoteFolder = '/root/';

function pre() {
    script.log('process pre-execution parameters parsed.');

    // Ask for connection settings
    script.prompt('Protocol', 'protocol', 'sftp');
    script.prompt('Hostname', 'hostname', '');
    script.prompt('Port', 'portString', '22');
    script.prompt('Username', 'username', '');
    script.prompt('Password', 'password', '');
}

function begin() {
    // this function is called once at the start of the process
    script.log('process execution started.');

    console.log(`Connecting to: ${hostname}:${portString}`);
    const connection = ftp.Connect(protocol, hostname, parseInt(portString), username, password);

    if (connection.IsConnected()) {
        console.log('We are connected.');
        let directory = JSON.parse(connection.Directory(remoteFolder));
        console.log(directory);

        let result = connection.Upload('Test.xlsx', remoteFolder);
        console.log(`Uploading file result: ${result}`);

        result = connection.Download(`${remoteFolder}Test.xlsx`, 'Test2.xlsx');
        console.log(`Downloading file result: ${result}`);

        result = connection.Rename(`${remoteFolder}Test.xlsx`, `${remoteFolder}Test2.xlsx`);
        console.log(`Renaming file result: ${result}`);

        result = connection.Delete(`${remoteFolder}Test2.xlsx`);
        console.log(`Deleting file result: ${result}`);

        // Change directory
        directory = JSON.parse(connection.Directory(remoteFolder));
        console.log(directory);

        console.log(`Disconnecting: ${hostname}:${portString}`);
        connection.Disconnect();
    } else {
        console.log('Connection failed.');
    }
}

function data(record) {
    // this function is called once for each line of data on the second cycle
    // use this to build dimensions and push data into cubes
}

function end() {
    // this function is called once at the end of the process
    script.log('process execution finished.');
}
```
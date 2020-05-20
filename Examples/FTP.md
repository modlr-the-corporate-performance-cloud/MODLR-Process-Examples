# FTP Functions Usage Example

**NOTE**: FTP functions are available starting with Build 2.4.524.

First, we need to establish an FTP connection. Using a username and password:

```javascript
const client = ftp.Connect("sftp", "example.domain.com", 22, "janedoe", "mypassword");
```

If you need a keyfile to connect to the FTP server, use `ftp.ConnectWithKey()`:

```javascript
const client = ftp.Connect("sftp", "example.domain.com", 22, "abby", "/path/to/key_file");
```

To check if the connection succeeded, use the `IsConnected()` method:

```javascript
if (client.IsConnected()) {
	console.log("We're connected.");
} else {
	console.log("Connection failed.");
}
```

When connected, you can then get a list of files and directories in your FTP server.


```javascript
const list = JSON.parse(client.Directory('/remote/path'));
```

The method `Directory()` returns a JSON string representing an array of files and folders and looks like the following:

```json
[
    {
        "name": "a_folder",
        "isDirectory": true
    },
    {
        "name": "pub",
        "isDirectory": true
    },
    {
        "name": "readme.txt",
        "isDirectory": false
    }
]
```

Below is a sample process demonstrating what you can do with the new FTP features. To learn more about them, head over to the [MODLR documentation](https://docs.modlr.co/process-functions#ftp-functions).

## Sample Process Usage

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
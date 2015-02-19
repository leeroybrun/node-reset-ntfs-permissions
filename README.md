# Reset NTFS permissions

The user can enter a filepath to a folder he can't access.

On the backend, we check that the user can change permissions for this folder (check by regex and filepath length). In this example, the user can only change files/folders in a P:\ drive.

The system then use the "takeown" and "icacls" commands to reset permissions for this folder.

### Edit

If you want to use it for your own use, you need to customize it.

First, you need to [change the groups in the icacls commands in the lib/setPermissions.js file](https://github.com/leeroybrun/node-reset-ntfs-permissions/blob/master/lib/setPermissions.js#L43-L61).

Then, you need to update the [folder checking conditions in the "routes/api.js" file](https://github.com/leeroybrun/node-reset-ntfs-permissions/blob/master/routes/api.js#L25-L45).

### Install

Install dependencies :

    npm install

### Running the app

Runs like a typical express app:

    node app.js

### Screenshot

![](https://raw.githubusercontent.com/leeroybrun/node-reset-ntfs-permissions/master/screenshot.png)

## License
MIT

# Reset NTFS permissions

This present to the user a text box where he can enter a file/folder path.

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



## License
MIT

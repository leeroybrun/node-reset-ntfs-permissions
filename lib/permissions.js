var childProcess = require('child_process');
var fs = require('fs');
var path = require('path');
var async = require('async');

var rootPath = path.join(__dirname, '..');
var xcaclsPath = path.join(rootPath, 'dist', 'xxcacls', 'XCACLS.vbs');

function exec(command, callback) {
	callback = callback || function(){};

	childProcess.exec(command, function(err, stdout, stderr) {
		if(err || stderr) {
			console.log(err);
			console.log(stderr);
		}
		console.log('--------------------------------------');
		console.log(command);
		console.log(stdout);
		console.log('--------------------------------------');

		callback();
	}).stdin.end();
}

function setPermissionsXCACLS(filePath, callback) {
	callback = callback || function(){};

	async.series([
		function checkExists(cb) {
			fs.exists(filePath, function (exists) {
				if(exists) {
					cb();
				} else {
					console.log('Does not exists : '+ filePath);
					cb(new Error('Le fichier ou dossier n\'existe pas...'));
				}
			});
		},

		function executeXCACLS(cb) {
			exec('cscript //NoLogo "'+ xcaclsPath +'" "'+ filePath +'" /F /S /T /G "BATIPLUS\\Admins du domaine":F /G "SYSTEM":F /G "BATIPLUS\\Utilisa. du domaine":F /O "BATIPLUS\\Admins du domaine" /FO /I ENABLE /QQ', cb);
		}
	], function(err) {
		callback(err);
	});
}

function setPermissions(filePath, callback) {
	callback = callback || function(){};

	async.series([
		function checkExists(cb) {
			fs.exists(filePath, function (exists) {
				if(exists) {
					cb();
				} else {
					console.log('Does not exists : '+ filePath);
					cb(new Error('Le fichier ou dossier n\'existe pas...'));
				}
			});
		},

		function takeOwn(cb) {
			exec('TAKEOWN /F "'+ filePath +'" /R /D O', cb);
		},

		function resetPerms(cb) {
			exec('ICACLS "'+ filePath +'" /reset /T', cb);
		},

		function giveAdminPerms(cb) {
			exec('ICACLS "'+ filePath +'" /grant:r "Admins du domaine":(OI)(CI)F /T /Q', cb);
		},

		function giveCompanyAdminPerms(cb) {
			exec('ICACLS "'+ filePath +'" /grant:r "Administrateurs de l\'entreprise":(OI)(CI)F /T /Q', cb);
		},

		function giveSystemPerms(cb) {
			exec('ICACLS "'+ filePath +'" /grant:r "SYSTEM":(OI)(CI)F /T /Q', cb);
		},

		function giveUserPerms(cb) {
			exec('ICACLS "'+ filePath +'" /grant:r "Utilisa. du domaine":(OI)(CI)F /T /Q', cb);
		},

		function setAdminOwner(cb) {
			exec('ICACLS "'+ filePath +'" /setowner "Admins du domaine" /c /t /Q', cb);
		}
	], function(err) {
		callback(err);
	});
}

module.exports = {
	set: setPermissions,
	setXCACLS: setPermissionsXCACLS
};
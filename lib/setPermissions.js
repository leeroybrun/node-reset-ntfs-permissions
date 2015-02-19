var childProcess = require('child_process');
var fs = require('fs');
var async = require('async');

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
			exec('ICACLS "'+ filePath +'" /grant:r "Admins du domaine":(OI)(CI)F /T', cb);
		},

		function giveCompanyAdminPerms(cb) {
			exec('ICACLS "'+ filePath +'" /grant:r "Administrateurs de l\'entreprise":(OI)(CI)F /T', cb);
		},

		function giveSystemPerms(cb) {
			exec('ICACLS "'+ filePath +'" /grant:r "SYSTEM":(OI)(CI)F /T', cb);
		},

		function giveUserPerms(cb) {
			exec('ICACLS "'+ filePath +'" /grant:r "Utilisa. du domaine":(OI)(CI)F /T', cb);
		},

		function setAdminOwner(cb) {
			exec('ICACLS "'+ filePath +'" /setowner "Admins du domaine" /c /t', cb);
		}
	], function(err) {
		callback(err);
	});
}

module.exports = setPermissions;
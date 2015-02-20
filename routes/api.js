/*
 * Serve JSON to our AngularJS client
 */

 var fs = require('fs');

var permissions = require('../lib/permissions');

var rootPath = require('path').dirname(require.main.filename);

function log(file, message) {
	fs.appendFile(rootPath+file, (new Date()).toString() + ' - '+ message+'\n');
}

function escapeRegExp(string) {
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

function replaceAll(string, find, replace) {
  return string.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

exports.permission = function (req, res) {
	var filePath = req.param('filePath');
	if(!filePath || filePath.length <= 15) {
		log('/log/errors.log', 'Le chemin d\'accès est trop court : '+filePath);

		return res.json({
			result: false,
			error: 'Le chemin d\'accès est trop court...'
		});
	}

	filePath = replaceAll(filePath, '\\..', '');
	filePath = replaceAll(filePath, '/..', '');

	var checkIfPRegex = /^P:\\[^\\\/]+\\[^\\\/]+\\/;
	if(!checkIfPRegex.test(filePath)) {
		log('/log/errors.log', 'Chemin d\'accès non conforme : '+filePath);

		return res.json({
			result: false,
			error: 'Veuillez fournir un chemin d\'accès sous la forme "P:\\DOSSIER\\DOSSIER\\..."'
		});
	}

	permissions.setXCACLS(filePath, function(err) {
		if(err) {
			log('/log/errors.log', ((typeof err === 'object') ? err.message : err) +' : '+filePath);

			return res.json({
				result: false,
				error: (typeof err === 'object') ? err.message : err
			});
		} else {
			log('/log/success.log', filePath);
			
			return res.json({
				result: true
			});
		}
	});
};
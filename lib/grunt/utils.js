var fs = require('fs');
var shell = require('shelljs');
var grunt = require('grunt');
var spawn = require('child_process').spawn;
var semver = require('semver');
var version;

require('shelljs/global');

module.exports = {

	getVersion: function () {
		if (!which('git')) {
			echo('Sorry, this script requires git');
			exit(1);
		}

		if (version) return version;
		var package = JSON.parse(fs.readFileSync('package.json', 'UTF-8'));

		try {
			var gitTag = getTagOfCurrentCommit();
			var semVerVersion, codeName, fullVersion;
			JSON.stringify(gitTag, null, '\t');
			var debug = process.env.DEBUG? 'd': '';
			if (gitTag) {
				// tagged release
				semVerVersion = semver.valid(gitTag);
				fullVersion = semVerVersion + debug;
				codeName = getTaggedReleaseCodeName(gitTag);
			} else {
				// snapshot release
				semVerVersion = getSnapshotVersion();
				fullVersion = semVerVersion + debug + '-' + getSnapshotSuffix();
				codeName = 'snapshot';
			}

			var versionParts = semVerVersion.match(/(\d+)\.(\d+)\.(\d+)/);

			version = {
				full: fullVersion,
				major: versionParts[1],
				minor: versionParts[2],
				dot: versionParts[3],
				codename: codeName,
				cdn: package.cdnVersion
			};
			
			return version;

		} catch (e) {
			grunt.fail.warn(e);
		}

		function getTagOfCurrentCommit() {
			var gitTagResult = shell.exec('git describe --exact-match', { silent: true });
			var gitTagOutput = gitTagResult.output.trim();
			var branchVersionPattern = new RegExp(package.branchVersion.replace('.', '\\.').replace('*', '\\d+'));
			if (gitTagResult.code === 0 && gitTagOutput.match(branchVersionPattern)) {
				return gitTagOutput;
			} else {
				return null;
			}
		}

		function getTaggedReleaseCodeName(tagName) {
			var grep = 'grep';

			if (!which('grep')) {
				grep = 'findstr';
			}

			var tagMessage = shell.exec('git cat-file -p ' + tagName + ' | ' + grep + ' "codename"', { silent: true }).output;
			var codeName = tagMessage && tagMessage.match(/codename\((.*)\)/)[1];
			if (!codeName) {
				throw new Error("Could not extract release code name. The message of tag " + tagName +
				  " must match '*codename(some release name)*'");
			}
			return codeName;
		}

		function getSnapshotVersion() {
			var oldTags = shell.exec('git tag -l v' + package.branchVersion, { silent: true }).output.trim().split('\n');
			// ignore non semver versions.
			oldTags = oldTags.filter(function (version) {
				return version && semver.valid(version);
			});
			if (oldTags.length) {
				oldTags.sort(semver.compare);
				semVerVersion = oldTags[oldTags.length - 1];
				if (semVerVersion.indexOf('-') !== -1) {
					semVerVersion = semver.inc(semVerVersion, 'prerelease');
				} else {
					semVerVersion = semver.inc(semVerVersion, 'patch');
				}
			} else {
				semVerVersion = semver.valid(package.branchVersion.replace(/\*/g, '0'));
			}
			return semVerVersion;
		}

		function getSnapshotSuffix() {
			var jenkinsBuild = process.env.TRAVIS_BUILD_NUMBER || process.env.BUILD_NUMBER || 'local';
			var hash = shell.exec('git rev-parse --short HEAD', { silent: true }).output.replace('\n', '');
			return 'build.' + jenkinsBuild + '+sha.' + hash;
		}
	}
};

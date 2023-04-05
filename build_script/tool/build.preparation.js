const path = require('path');
const rimraf = require('rimraf');

module.exports = function()
{
    rimraf.sync(path.join(__dirname, '..', 'output'));
}

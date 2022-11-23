var os = require('os');
os.tmpDir = os.tmpdir;
module.exports = function (grunt)
{
    grunt.initConfig({
        nwjs: {
            options: {
                platforms: ['win64', 'linux64', 'osx64'], // win
                buildDir: './dist', // Where the build version of my NW.js app is saved
                version: '0.51.1',
                flavor: 'normal'
            },
            src: ['./build/**/*'] // Your NW.js app
        },
    })

    grunt.loadNpmTasks('grunt-nw-builder');

    grunt.registerTask('default', ['nwjs']);
};

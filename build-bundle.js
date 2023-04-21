const browserify = require('browserify')
const tsify      = require('tsify')
const babelify   = require('babelify')
const fs         = require('fs')

const opts = {
    standalone: 'DataMappingBundle',
    plugin    : [
        [tsify, {noImplicitAny: true}]
    ]
}

browserify('./src/index.ts', opts)
    .transform(babelify, {
        extensions: ['.tsx', '.ts', '.js'],
        global    : true,
        compact   : true,
        presets   : ['@babel/preset-env']
    })
    .bundle()
    .on('error', function (error) {
        console.error(error.toString())
    })
    .pipe(fs.createWriteStream('./bundle/bundle.js'))
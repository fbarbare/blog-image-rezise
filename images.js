var easyimg = require('easyimage');
var sizeOf = require('image-size');
var tinify = require('tinify');
var find = require('find');
var path = require('path');
var ncp = require('ncp').ncp;

var IMAGE_SIZE = 2000;
const pathOld = 'temp';
const pathNew = 'new';

tinify.key = 'UKpyBNkWmRUdHJxL6GBDG4EQF4GhsTlW';

function reziseImagesToFolder () {
  console.log('Rezising ...');
  find.eachfile(/\.(jpeg|jpg|JPG)$/, path.join(__dirname, pathOld), (location) => {
    console.log(location);

    sizeOf(location, (err, dimensions) => {
      if (err) {return console.error(err)}

      var destination = location.replace('/' + pathOld + '/', '/' + pathNew + '/');

      if (dimensions.width > IMAGE_SIZE) {
        easyimg
          .resize({
             src: location,
             dst: destination,
             width: IMAGE_SIZE,
             quality: 80
          })
          .then((image) => {
            console.log('Resized: ' + image.width + ' x ' + image.height + ': ' + image.path);
            // tinify.fromFile(image.path).toFile(image.path + '.tiny.jpg');
          }, (err) => {
            console.log(err);
          });
      } else {
        ncp(location, destination, (err) => {
          if (err) {return console.error(err)}

          console.log('Moved: ' + dimensions.width + ' x ' + dimensions.height + ': ' + destination);
        });
      }
    });
  });
}

function tinyImages() {
  // return new Promise((resolve, reject) => {
    find.eachfile(/\.(jpg|JPG)$/, path.join(__dirname, pathNew), (location) => {
      tinify.fromFile(location).toFile(location + '.min.jpg');
    });
  // });
}

reziseImagesToFolder();

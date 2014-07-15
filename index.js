var Hapi = require('hapi'),
  server = new Hapi.Server(3000),
  https = require('https');

server.route({
  method: 'GET',
  path: '/canvasMonge/{urlImagenPerfil}',
  handler: function (request, reply) {
    var Canvas = require('canvas');
    https.get(request.params.urlImagenPerfil, function(res) {
      var body = '';
      res.setEncoding('binary');
      res.on('data', function(chunk) { body += chunk; });
      res.on('end', function() {
        var img = new Canvas.Image;
        img.src = new Buffer(body, 'binary');
        canvas = new Canvas(img.width,img.height);
        ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        https.get('https://s3.amazonaws.com/monge/monge-logo.png',function(resLogo){
          var logoBody = '';
          resLogo.setEncoding('binary');
          resLogo.on('data', function(chunk) { logoBody += chunk; });
          resLogo.on('end', function() {
            var imgLogo = new Canvas.Image;
            imgLogo.src = new Buffer(logoBody, 'binary');
            ctx.drawImage(imgLogo, 0, (img.height-imgLogo.height));
            reply('<img src="' + canvas.toDataURL() + '" />');
          })
        });
      });
    });
  }
});

server.route({
  method: 'GET',
  path: '/{urlMarca}/{urlImagenPerfil}',
  handler: function (request, reply) {
    reply({
      urlMarca:request.params.urlMarca,
      urlImagenPerfil:request.params.urlImagenPerfil
    });
  }
});

server.start(function () {
  console.log('Server running at:', server.info.uri);
});
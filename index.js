var Hapi = require('hapi'),
  server = new Hapi.Server(3000),
  https = require('https'),
  Font = require('canvas').Font;

var nombreFont = new Font('nombreFont', path.join(__dirname,'/fonts/ufonts.com_gotham_black-1.ttf'));
nombreFont.addFace(path.join(__dirname,'/fonts/ufonts.com_gotham_black-1.ttf'),'bold');
nombreFont.addFace(path.join(__dirname,'/fonts/ufonts.com_gotham_black-1.ttf'),'normal','italic');
nombreFont.addFace(path.join(__dirname,'/fonts/ufonts.com_gotham_black-1.ttf'),'bold','italic');

server.route({
  method: 'GET',
  path: '/canvasMonge/{urlImagenPerfil}',
  handler: function (request, reply) {
    var Canvas = require('canvas');
    https.get(request.params.urlImagenPerfil, function(res) {
      var body = '',
        canvas,
        ctx;
      res.setEncoding('binary');
      res.on('data', function(chunk) { body += chunk; });
      res.on('end', function() {
        var img = new Canvas.Image;
        img.src = new Buffer(body, 'binary');
        canvas = new Canvas(img.width,img.height);
        ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        https.get('https://s3.amazonaws.com/monge/mamaPrimeroProfile.png',function(resLogo){
          var logoBody = '';
          resLogo.setEncoding('binary');
          resLogo.on('data', function(chunk) { logoBody += chunk; });
          resLogo.on('end', function() {
            var imgLogo = new Canvas.Image;
            imgLogo.src = new Buffer(logoBody, 'binary');
            ctx.drawImage(imgLogo, 0, (img.height-imgLogo.height));

            reply(new Buffer(
              canvas.toDataURL().replace(/^data:image\/\w+;base64,/, ''),
              'base64')
            );
          });
        });
      });
    });
  }
});

server.route({
  method: 'GET',
  path: '/cedulaMonge/{urlImagenPerfil}/{nombre}/{primerApellido}/{segundoApellido}/{cedula}',
  handler: function (request, reply) {
    var Canvas = require('canvas');
    https.get('https://s3.amazonaws.com/monge/cedula-monge-madre.png',function(res){
      var body = '',
        canvas,
        ctx;
      res.setEncoding('binary');
      res.on('data', function(chunk) { body += chunk; });
      res.on('end', function() {
        var imgCedula = new Canvas.Image;
        imgCedula.src = new Buffer(body, 'binary');
        canvas = new Canvas(imgCedula.width,imgCedula.height);
        ctx = canvas.getContext('2d');
        ctx.addFont(nombreFont);

        var imagenPerfil = request.params.urlImagenPerfil || 'http://www.laredso.com/wp-content/uploads/Sr.-Trololo.jpg';

        https.get(imagenPerfil,function(resPerfil){
          var perfilBody = '';
          resPerfil.setEncoding('binary');
          resPerfil.on('data', function(chunk) { perfilBody += chunk; });
          resPerfil.on('end', function() {
            var imgPerfil = new Canvas.Image;
            imgPerfil.src = new Buffer(perfilBody, 'binary');
            ctx.drawImage(imgPerfil,720,48,235,235);
            ctx.drawImage(imgCedula, 0, 0);
            ctx.font = 'normal 30px nombreFont';
            ctx.fillStyle = '#9cbc27';
            ctx.fillText('Quo Vaids?', 0, 280);
            reply(new Buffer(
                canvas.toDataURL().replace(/^data:image\/\w+;base64,/, ''),
                'base64')
            );
          });
        });
      })
    });

  }
  });

server.start(function () {
  console.log('Server running at:', server.info.uri);
});
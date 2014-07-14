var Hapi = require('hapi');
var server = new Hapi.Server(3000);


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
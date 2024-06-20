module.exports = function setupSocketIO(io, sessionMiddleware) {
    io.use((socket, next) => {
      sessionMiddleware(socket.request, {}, next);
    });
  
    io.on('connection', (socket) => {
      const session = socket.request.session;
      if (session) {
        console.log('Session ID:', session.id);
        socket.emit('message', 'Connecté au serveur');
      } else {
        console.log('Aucune session disponible');
      }
    });
  };
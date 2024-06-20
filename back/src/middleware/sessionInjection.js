const injectSession = (req, res, next) => {
    // Exemple de récupération de session (à ajuster selon votre mécanisme de stockage)
    const session = req.session; // Si la session est déjà dans `req`, on la garde.
  
    // Log pour déboguer
    console.log('Session injectée :', session);
  
    // Injecter la session dans `req`
    req.session = session || {}; // Assurez-vous qu'il y a toujours un objet session, même vide.
  
    // Passer au middleware suivant ou à la route
    next();
  };
  
  module.exports = injectSession;
  
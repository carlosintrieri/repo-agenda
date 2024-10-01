exports.middlewareGlobal = (req, res, next) => {
    if (req.body.cliente) {
  
      console.log();
  
      console.log(`Vi que você postou ${req.body.cliente}`);
  
      console.log();
  
    }
    next();
  };
  
  exports.outroMiddleware = (req, res, next) => {
    console.logI('Sou seu outro middleware.');
    next();
  };
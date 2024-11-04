const dashboard = (req, res) => {
  res.render('index/dashboard', {
      pagina: 'Dashboard',
      usuario: req.usuario.nombre,
      empresa: req.usuario.empresa,
      permisos: req.usuario.permisos,
  })
}

export { 
    dashboard,
};



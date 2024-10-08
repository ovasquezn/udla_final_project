const dashboard = (req, res) => {
  res.render('auth/dashboard', {
      pagina: 'Dashboard'
  })
}

export { 
    dashboard,
};



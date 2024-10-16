const dashboard = (req, res) => {
  res.render('index/dashboard', {
      pagina: 'Dashboard'
  })
}

export { 
    dashboard,
};



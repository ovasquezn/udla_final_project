import { Colaboradores, PagosColaboradores , Liquidaciones, Documentos } from '../models/relations.js';


const mostrar_colaboradores = async (req, res) => {
  const trabajadores = await Colaboradores.findAll({
    include: [
      { model: PagosColaboradores, as: 'pagos_colaboradores' },
      { model: Liquidaciones, as: 'liquidaciones' },
      { model: Documentos, as: 'documentos' },
    ],
  });

  res.render('recursos_humanos/colaboradores', { trabajadores });
};
  
  export { 
      mostrar_colaboradores,
  };
  
  
  
const Atendimento = require('../models/atendimentos');
module.exports = app => {
  app.get('/atendimentos',(req,res)=>res.send('rota de Atendimentos'));

  app.post('/atendimentos',(req,res)=>{
    const atendimento = req.body;
    Atendimento.adiciona(atendimento);
    res.send('ROTA POST');
  });
}
const conexao = require('../infraestrutura/conexao');
class Atendimento{
    adiciona(atendimento){
        const sql = 'INSERT INTO Atendimentos SET ?';
        conexao.query(sql,atendimento,(err)=>{
            if(err){
                console.log(err);
            }else{
                console.log(atendimento);
            }
        })
    }
}

module.exports = new Atendimento;
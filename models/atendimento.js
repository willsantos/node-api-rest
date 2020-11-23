const moment = require('moment');
const axios = require('axios');
const conexao = require('../infraestrutura/database/conexao');
const repositorio = require('../repositorios/atendimento');
class Atendimento{
    constructor(){
        this.dataEhValida = ({data,dataCriacao}) => moment(data).isSameOrAfter(dataCriacao);
        this.clienteEhValido = (tamanho) => tamanho.tamanho >= 5;
        

        this.valida = params => 
            this.validacoes.filter(campo =>{
                const {nome} = campo;
                const param = params[nome];

                return !campo.valido(param);
            })
        this.validacoes = [
            {
                nome:'cliente',
                valido: this.clienteEhValido,
                messagem: 'Cliente precisa ter mais de 5 letras'
            },
        
            {
                nome:'data',
                valido: this.dataEhValida,
                mesagem: 'Data deve ser maior ou igual a data atual'
            },
        ];    

        
    }

    adiciona(atendimento){
        const dataCriacao = moment().format('YYYY-MM-DD HH:mm:ss');
        const data = moment(atendimento.data,'DD/MM/YYYY').format('YYYY-MM-DD HH:mm:ss');
        
        

        const params = {
            data: {data,dataCriacao},
            cliente: {tamanho: atendimento.cliente.length}
        };

        

        const err = this.valida(params);
        const existemErros = err.length;

        

        if(existemErros){
            return new Promise((resolve,reject)=> reject(err));
            
        }else{
            const atendimentoDatado = {...atendimento,dataCriacao,data};
            
            return repositorio.adiciona(atendimentoDatado).then(resultados => {
                    const id = resultados.insertId;
                    return ({...atendimento,id});
                });
           
        }
    }

    lista(){
        return repositorio.lista();
    }

    buscaPorId(id,res){
        const sql = `SELECT * FROM Atendimentos WHERE id=${id}`;
        conexao.query(sql,async (err,resultados)=>{
        const atendimento = resultados[0];
        const cpf = atendimento.cliente;
            if(err){
                res.status(400).json(err);
            }else{
                const {data} = await axios.get(`http://localhost:8082/${cpf}`);
                atendimento.cliente = data;
                res.status(200).json(atendimento);
            }
        })
    }

    altera(id,valores,res){
        /**
         * @todo: No update ele não verifica se a data já passou.
         */

        if(valores.data){
            valores.data = moment(valores.data,'DD/MM/YYYY').format('YYYY-MM-DD HH:mm:ss');
        }
        const sql = 'UPDATE Atendimentos SET ? WHERE id=?';
        conexao.query(sql,[valores,id],(err,resultados)=>{
            if(err){
                res.status(400).json(err);
            }else{
                res.status(200).json({...valores,id});
            }
        })
    }

    deleta(id,res){
        const sql = 'DELETE FROM Atendimentos WHERE id=?';

        conexao.query(sql,id,(err,resultados)=>{
            if(err){
                res.status(400).json(err);
            }else{
                res.status(200).json({id});
            }
        })
    }
}

module.exports = new Atendimento;
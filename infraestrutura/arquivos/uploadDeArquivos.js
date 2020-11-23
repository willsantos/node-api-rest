const fs = require('fs');
const path = require('path');

module.exports = (caminho,nomeDoArquivo,callbackImagemCriada) => {
    const tiposValidos = ['jpg','png','jpeg'];
    const tipo = path.extname(caminho);
    const tipoEhValido = tiposValidos.indexOf(tipo.substring(1)) !== -1;

    if(!tipoEhValido){
        const err = "Tipo invalido!";
        console.log('Erro! tipo invalido!');
        callbackImagemCriada(err);
    }else{
        
        const novoCaminho = `./assets/imagens/${nomeDoArquivo}${tipo}`;
        fs.createReadStream(caminho)
            .pipe(fs.createWriteStream(novoCaminho))
            .on('finish',()=> callbackImagemCriada(false, novoCaminho));
    }
}
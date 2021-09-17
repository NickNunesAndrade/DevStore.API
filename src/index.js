import db from './db.js';
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/produto', async(req, resp) => {
    try {
        let ler = await db.tb_produto.findAll({order: [['id_produto', 'desc']]});
        resp.send(ler);
    } catch (e) {
        resp.send({error: e.toString()});
    }
});

app.post('/produto', async(req, resp) => {
    try {     
        let {nome, categoria, avaliacao, precoDe, precoPor, estoque, imgProduto, descricao} = req.body;

        let pesquisa = await db.tb_produto.findOne({
            where: {
                nm_produto: nome
            }
        });

        if(pesquisa != null) {
           return resp.send('Produto repetido !!');
        } else {
            let criar = await db.tb_produto.create({
                nm_produto: nome,
                ds_categoria: categoria,
                vl_avaliacao: avaliacao,
                vl_preco_de: precoDe,
                vl_preco_por: precoPor,
                qtd_estoque: estoque,
                img_produto: imgProduto,
                ds_produto: descricao
            });

            if(nome === "" || categoria === "" || avaliacao === "" || precoDe === "" || precoPor === "" || estoque === "" || imgProduto === "" || descricao === "") {
               return resp.send('Tem algum campo nulo !!');
            } else if( avaliacao <= 0 || precoDe <= 0 || precoPor <= 0 || estoque <= 0) {
               return resp.send('Algum campo nao pode ter numero negativo') 
            } else if((precoDe != Number(precoDe)) || (precoPor != Number(precoPor)) || (estoque != Number(estoque))) {
               return resp.send('Alguns campos podem somente numeros')
            } else {
                resp.send(criar);
            }
        } 
    } catch (e) {
        resp.send({error: e.toString()});
    }
});

app.put('/produto/:id', async(req, resp) => {
    try {
        let id = req.params.id;
        let {nome, categoria, avaliacao, precoDe, precoPor, estoque, descricao, imgProduto} = req.body;
        let editar = await db.tb_produto.update({
            nm_produto: nome,
            ds_categoria: categoria,
            vl_preco_de: precoDe,
            vl_preco_por: precoPor,
            vl_avaliacao: avaliacao,
            ds_produto: descricao,
            qtd_estoque: estoque,
            img_produto: imgProduto 
        }, {
            where: {
                id_produto: id
            }
        });
        resp.sendStatus(200);
    } catch (e) {
        resp.send({error: e.toString()});
    }
});

app.delete('/produto/:id', async(req, resp) => {
    try {
        let id = req.params.id;
        let remover = await db.tb_produto.destroy({
            where: {
                id_produto: id
            }
        });
        resp.sendStatus(200);
    } catch (e) {
        resp.send({error: e.toString()});
    }
});

app.listen(process.env.PORT, 
    x => console.log(`Subiuu !! ${process.env.PORT}`));

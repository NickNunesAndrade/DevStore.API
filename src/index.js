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

        if(nome == "" || categoria == "" || avaliacao == "" || precoDe == "" || precoPor == "" || estoque == "" || descricao == "" || imgProduto == "") {
            resp.send({error: 'Temos algum campo nulo !!'});
        } else if(avaliacao <= 0 || precoDe <= 0 || precoPor <= 0 || estoque <= 0) {
            resp.send({error: 'Algum campo nao pode ter numero negativo !!'});
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
            resp.send(criar);
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

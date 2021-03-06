const express = require("express");
const MercadoPago = require("mercadopago"); 
const { setTimeout } = require("timers");
const app = express();

MercadoPago.configure({
    sandbox: true,
    access_token: "TEST-454186915443095-092004-b8d3c1ca1d1c7b9e37b71060544d1087-345470388"
});


app.get("/", (req, res) => {



      MercadoPago.payment.search({
        //qs: filters
      }).then(function (data) {
        res.send(data);
      }).catch(function (error) {
        res.send(error);
      });

    
});

app.get("/pagar",async (req, res) => {

    // Pagamentos

    // id // codigo // pagador // status
    // 1 // 1593163315787 // arthru@gmail.com  // Não foi pago
    // 2 //  1593163315782 // teste@gmail.com // Pago

    var id = "" + Date.now();
    var emailDoPagador = "victordevtb@outlook.com";

    var dados = {
        items: [
            item = {
                id: id,
                title: "2x video games;3x camisas",
                quantity: 1,
                currency_id: 'BRL',
                unit_price: parseFloat(150)
            }
        ],
        payer:{
            email: emailDoPagador
        },
        external_reference: id
    }

    try{
        var pagamento = await MercadoPago.preferences.create(dados);
        //Banco.SalvarPagamento({id: id, pagador: emailDoPagador});
        return res.redirect(pagamento.body.init_point);
    }catch(err){
        return res.send(err.message);
    }
});

app.post("/not",(req, res) => {
    var id = req.query.id;

    setTimeout(() => {

        var filtro = {
            "order.id": id
        }

        MercadoPago.payment.search({
            qs: filtro
        }).then(data => {
            var pagamento = data.body.results[0];

            if(pagamento != undefined){
                console.log(pagamento.external_reference);
                console.log(pagamento.status); // approved
            }else{
                console.log("Pagamento não existe!");
            }
        }).catch(err => {
            console.log(err);
        });

    },20000)

    res.send("OK");
});


app.listen(80,(req, res) => {

    console.log("Servidor rodando!");

});

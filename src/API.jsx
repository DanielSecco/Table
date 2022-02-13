let token;
let user;
let ORCAMENTO = {};
let xhr = new XMLHttpRequest();
let block = true;
let url = new URL("https://hauszfy.hausz.com.br/api/v1/");
let Royalties = 5;
let TaxaNota = 9;
let TaxaLogistica = 0.0125;
let TaxaFormaDePagamento = 0;
let json = JSON.stringify({
  Email: "daniel.secco@hausz.com.br",
  UserAcesso: "daniel.secco@hausz.com.br",
  Senha: "123qweasdzxc"
});

let logs = {
  user: undefined,
  token: undefined,
  orcamento: {},
  logIn() {
    try {
      xhr.open("POST", url + "login");
      xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");
      xhr.send(json);
      xhr.onloadend = function (event) {
        console.log("log");
        if (event.target.status == 200) {
          let responseObj = JSON.parse(xhr.response);
          logs.token = responseObj.content.token;
          logs.user = responseObj?.content.user;
          logs.orcamento["user"] = { ...logs.user };
          // console.log(logs.token, logs.user);
          // console.log("finish");
        }
      };
      if (!!this.token) {
        return true;
      }
      return false;
    } catch (_) {
      console.log("eee");
      return false;
    }
  },
  getOrcament() {
    try {
      xhr.open("GET", url + "orcamento/24957");
      xhr.setRequestHeader("Authorization", `Bearer ${this.token}`);
      xhr.send();
      xhr.onloadend = function (event) {
        console.log("orcc");
        if (event.target.status == 200) {
          let responseObj = JSON.parse(xhr.response);
          Object.entries(Object.values(responseObj.data)).forEach(
            ([key, value]) => {
              logs.orcamento = Object.assign(logs.orcamento, {
                Orcamento: {
                  CodigoOrcamento: value.Pedido.CodigoOrcamento,
                  IdUnidade: value.Pedido.IdUnidade,
                  ValorTotal: value.Pedido.ValorTotal,
                  ValorCusto: value.Pedido.ValorCusto,
                  Frete: value.Pedido.Frete,
                  DescontoOrcamento: value.Pedido.DescontoOrcamento,
                  PrevisaoEntrega: value.Pedido.PrevisaoEntrega
                },
                Cliente: {
                  ...value.Pedido.cliente
                },
                Pagamento: {
                  ...value.Pagamento.values().next().value
                },
                Itens: value.Itens
              });
            }
          );
        }
      };
      if (!!this.orcamento.Itens) {
        //  console.log(this.orcamento);
        return true;
      }
      return false;
    } catch (_) {
      console.log("eee");
      return false;
    }
  },
  get SOMA() {
    return {
      ValorBruto: logs.orcamento.Itens.reduce(
        (acumulador, valorAtual) =>
          acumulador + valorAtual.Preco * valorAtual.Quantidade,
        0
      ),
      ValorCusto: logs.orcamento.Itens.reduce(
        (acumulador, valorAtual) =>
          acumulador + valorAtual.ValorCusto * valorAtual.Quantidade,
        0
      ),
      ValorVenda: logs.orcamento.Itens.reduce(
        (acumulador, valorAtual) =>
          acumulador +
          (valorAtual.Preco -
            valorAtual.Preco * (valorAtual.DescontoItem / 100)) *
            valorAtual.Quantidade,
        0
      ),
      ValorVendaComTaxa: logs.orcamento.Itens.reduce(
        (acumulador, valorAtual) =>
          acumulador +
          (valorAtual.Preco +
            (valorAtual.PrecoFrete +
              valorAtual.PrecoRoyalties +
              valorAtual.PrecoLogistica) -
            valorAtual.Preco * (valorAtual.DescontoItem / 100)) *
            valorAtual.Quantidade,
        0
      ),
      CustoFixo: logs.orcamento.Itens.reduce(
        (acumulador, valorAtual) =>
          acumulador +
          (valorAtual.ValorCusto +
            valorAtual.PrecoFrete +
            valorAtual.PrecoRoyalties +
            valorAtual.PrecoLogistica) *
            valorAtual.Quantidade,
        0
      ),
      SomaDasTaxa: logs.orcamento.Itens.reduce(
        (acumulador, valorAtual) =>
          acumulador +
          (valorAtual.PrecoFrete +
            valorAtual.PrecoRoyalties +
            valorAtual.PrecoLogistica) *
            valorAtual.Quantidade,
        0
      ),
      get PrecoNota() {
        return this.ValorVenda * (TaxaNota / 100);
      },
      get TaxaCartao() {
        return this.ValorVenda * (TaxaFormaDePagamento / 100);
      },
      get Split() {
        return (
          this.ValorVenda - this.CustoFixo - this.PrecoNota - this.TaxaCartao
        );
      }
    };
  }
};

export default { logs };

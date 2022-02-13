document.getElementById("root").innerHTML = `

<div >
<a id="nois"></a>
</div>
`;

function tables(s) {
  var cols = [];
  for (var k in s) {
    for (var c in s[k]) {
      if (cols.indexOf(c) === -1) cols.push(c);
    }
  }
  var html =
    "<table class=tftable><thead><tr>" +
    cols
      .map(function (c) {
        return "<th>" + c + "</th>";
      })
      .join("") +
    "</tr></thead><tbody>";
  for (var l in s) {
    html +=
      "<tr>" +
      cols
        .map(function (c) {
          return "<td>" + (s[l][c] || "") + "</td>";
        })
        .join("") +
      "</tr>";
  }
  html += "</tbody></table>";

  document.body.innerHTML += html;
}
let token;
let user;
let ORCAMENTO = {};
let xhr = new XMLHttpRequest();
let block = true;
let url = new URL("https://hauszfy.hausz.com.br/api/v1/");
xhr.open("POST", url + "login");
xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");

let json = JSON.stringify({
  Email: "daniel.secco@hausz.com.br",
  UserAcesso: "daniel.secco@hausz.com.br",
  Senha: "123qweasdzxc"
});

xhr.send(json);

xhr.onerror = function () {
  alert("Request failed");
};
xhr.onprogress = function (event) {
  // console.log(event);
  // alert(`Received ${event.loaded} bytes`); // no Content-Length
};

xhr.onreadystatechange = function () {
  if (xhr.readyState == 3) {
    // loading
    console.log("loading");
  }
  if (xhr.readyState == 4) {
    if (block) {
      let responseObj = JSON.parse(xhr.response);
      token = responseObj.content.token;
      user = responseObj?.content.user;
      if (!!token) {
        block = false;
        console.log({ user, token });
        console.log("finish");

        getO(token, user);
      }
    } // Hello, world!
  }
};
function getO(tokenx, userx) {
  xhr.open("GET", url + "orcamento/24957");
  xhr.setRequestHeader("Authorization", `Bearer ${tokenx}`);
  xhr.send();
  xhr.onreadystatechange = function () {
    ORCAMENTO["user"] = { ...userx };
    if (xhr.readyState == 4) {
      let responseObj = JSON.parse(xhr.response);

      Object.entries(Object.values(responseObj.data)).forEach(
        ([key, value]) => {
          ORCAMENTO = Object.assign(ORCAMENTO, {
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
          console.log(value);
        }
      );
      console.log(ORCAMENTO);
      function sds() {
        new tables({ U: ORCAMENTO.Cliente });
        new tables({ User: ORCAMENTO.user });
        new tables({ U: ORCAMENTO.Orcamento });
        new tables({ U: ORCAMENTO.Pagamento });
        for (let i of ORCAMENTO.Itens) {
          let {
            SKU,
            Custo,
            IdEstoque,
            JsonEstoque,
            Preco,
            Quantidade,
            DescontoItem,
            PrecoLogistica,
            PrecoBase,
            PrecoFrete,
            PrecoMinimo,
            PrecoRoyalties,
            ValorCusto,
            ValorTotalDescontado,
            ValorVenda
          } = i;
          new tables({
            U: {
              SKU,
              Custo,
              IdEstoque,
              Preco,
              Quantidade,
              DescontoItem,
              PrecoLogistica,
              PrecoBase,
              PrecoFrete,
              PrecoMinimo,
              PrecoRoyalties,
              ValorCusto,
              ValorTotalDescontado,
              ValorVenda
            }
          });
        }
        let Royalties = 5;
        let TaxaNota = 9;
        let TaxaLogistica = 0.0125;
        let TaxaFormaDePagamento = 0;
        let somas = {
          ValorBruto: ORCAMENTO.Itens.reduce(
            (acumulador, valorAtual) =>
              acumulador + valorAtual.Preco * valorAtual.Quantidade,
            0
          ),
          ValorCusto: ORCAMENTO.Itens.reduce(
            (acumulador, valorAtual) =>
              acumulador + valorAtual.ValorCusto * valorAtual.Quantidade,
            0
          ),
          ValorVenda: ORCAMENTO.Itens.reduce(
            (acumulador, valorAtual) =>
              acumulador +
              (valorAtual.Preco -
                valorAtual.Preco * (valorAtual.DescontoItem / 100)) *
                valorAtual.Quantidade,
            0
          ),
          ValorVendaComTaxa: ORCAMENTO.Itens.reduce(
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
          CustoFixo: ORCAMENTO.Itens.reduce(
            (acumulador, valorAtual) =>
              acumulador +
              (valorAtual.ValorCusto +
                valorAtual.PrecoFrete +
                valorAtual.PrecoRoyalties +
                valorAtual.PrecoLogistica) *
                valorAtual.Quantidade,
            0
          ),
          SomaDasTaxa: ORCAMENTO.Itens.reduce(
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
              this.ValorVenda -
              this.CustoFixo -
              this.PrecoNota -
              this.TaxaCartao
            );
          }
        };
        new tables({ U: somas });
      }
      sds();
      //   console.log(responseObj);
      xhr.abort();
    }
  };
}

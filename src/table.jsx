import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import API from "./API";
import { cardContentClasses } from "@mui/material";
const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  display: "flex",
  padding: theme.spacing(1),
  textAlign: "left",
  backgroundColor: "#FFF"
}));

export default function BasicGrid() {
  let oiu;
  let Headers = [];
  let [tok, setTok] = React.useState();
  let [usr, setUsr] = React.useState();
  let [ork, setOrk] = React.useState({});
  let [tab, setTab] = React.useState();
  let [puts, setPuts] = React.useState(false);
  let [rows, setROWS] = React.useState(false);
  let [somah, setSOMAH] = React.useState();
  let [soma, setSOMA] = React.useState();
  const [name, setName] = React.useState("");

  const handleChange = (event) => {
    setName(event.target.value);
  };
  React.useEffect(() => {
    API.logs.logIn();

    return () => {};
  }, []);
  React.useEffect(() => {
    // console.log(ork);
    return () => {};
  }, [ork, setOrk]);
  let log = () => {
    //  console.log(API.logs.token);
    setTok(API.logs.token);
    setUsr(API.logs.user);
  };
  let ORK = () => {
    API.logs.getOrcament();
    setOrk(API.logs.orcamento);
    // console.log(ork);
    ITS();
  };

  let ITS = () => {
    // console.log(API.logs.orcamento.Itens);

    let jiji = API.logs.orcamento.Itens.map(
      ({
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
      }) => ({
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
      })
    );

    Headers = [...jiji];

    oiu = Headers.map((x, i) => {
      return [
        i,
        Object.entries(x).map(([k, v]) => (
          <TableCell key={"" + k + i + v} align="center">
            {k}
          </TableCell>
        ))
      ];
    });
    let vvv = Headers.map((x, i) => {
      return (
        <TableRow
          key={x.SKU + i}
          sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
        >
          {Object.entries(x).map(([k, v]) => (
            <TableCell key={v + "_a" + i + k} align="center">
              {v}
            </TableCell>
          ))}
        </TableRow>
      );
    });

    function HeadsCell(OBJ) {
      return Object.entries(OBJ).map((x, i) => {
        return (
          <TableCell key={"" + x[0] + i} align="center">
            {x[0]}
          </TableCell>
        );
      });
    }

    function tabRowsOb(OBJ) {
      return (
        <TableRow
          key={"so"}
          sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
        >
          {Object.entries(OBJ).map(([k, v]) => {
            return (
              <TableCell key={v + "_a" + k} align="center">
                {v}
              </TableCell>
            );
          })}
        </TableRow>
      );
    }
    console.log(HeadsCell(API.logs.SOMA));
    console.log(tabRowsOb(API.logs.SOMA));
    setSOMA(tabRowsOb(API.logs.SOMA));
    setSOMAH(HeadsCell(API.logs.SOMA));
    setROWS(vvv);
    setTab(Object.fromEntries(oiu)[0]);
    setPuts(true);
  };
  function BasicTable(props) {
    if (API.logs.getOrcament() && puts)
      return (
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead sx={{ minWidth: 650, backgroundColor: "red" }}>
              <TableRow>{props.head}</TableRow>
            </TableHead>
            <TableBody>{props.rows}</TableBody>
          </Table>
        </TableContainer>
      );
    return (
      <>
        <div>NONE</div>
      </>
    );
  }
  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Item>
              <Button
                variant="outlined"
                onClick={log}
                sx={{ minWidth: 70, backgroundColor: "black" }}
              >
                Login
              </Button>
              <Button
                variant="outlined"
                onClick={ORK}
                sx={{ minWidth: 70, backgroundColor: "black" }}
              >
                Get
              </Button>

              <FormControl>
                <InputLabel htmlFor="component-outlined">
                  IdOrcamento
                </InputLabel>
                <OutlinedInput
                  id="component-outlined"
                  value={name}
                  onChange={handleChange}
                  label="Name"
                />
              </FormControl>
              <Button
                variant="outlined"
                onClick={ITS}
                sx={{ minWidth: 70, backgroundColor: "black" }}
              >
                CHG
              </Button>
            </Item>
          </Grid>
          <BasicTable head={tab} rows={rows} />
          <BasicTable head={somah} rows={soma} />
          {/* <div>
            {puts &&
              Headers.forEach((i) =>
                Object.entries(([k, v]) => {
                  <>
                    <div>{k}</div>
                    <p>{v}</p>
                  </>;
                })
              )}
          </div> */}
          {/* <Grid item xs={4}>
            <Item>xs=4</Item>
          </Grid>
          <Grid item xs={4}>
            <Item>xs=4</Item>
          </Grid>
          <Grid item xs={8}>
            <Item>xs=8</Item>
          </Grid> */}
        </Grid>
      </Box>
    </>
  );
}

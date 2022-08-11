import styled from "@emotion/styled";

/* Fin Estilos */
import React from "react";

function Index() {
  /* Estilos */
  const Select = styled.select`
    width: 100%;
    height: 2.3rem;
    background-color: #fff;
    font-size: 1em;
    border: none;
    border-radius: 5px;
    font-weight: 300;
    letter-spacing: 1px;
    box-sizing: border-box;
    direction: rtl;
    cursor: pointer;
  `;

  const ContainerTab = styled.div`
    height: 83vh;
    border-radius: 10px !important;
    padding: 30px 25px;
    background-color: #fff;
  `;

  const SubContainer = styled.div`
    height: 58vh;
  `;

  const Table = styled.table`
    tr:nth-child(odd) td {
      background-color: rgb(245 245 245);
    }
  `;
  return <div></div>;
}

export default Index;

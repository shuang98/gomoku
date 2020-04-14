import React from "react";
import xImg from "../../images/x.png";
import oImg from "../../images/o.png";
import {X, O} from "../lib/constants";


function PlayerPanel({symbol, name, styles}) {
  let img = symbol == X ? xImg : oImg;
  let imgStyles =  {
    height: styles.height ? styles.height : "50px",
    borderRight: "2px solid lightgrey",
  }
  return (
    <div className="panel" style={{...styles, width: "250px"}}>
      <img src={img} style={imgStyles}></img>
      <h2 style={{margin: "auto"}}>{name}</h2>
    </div>
  )
}

export default PlayerPanel;
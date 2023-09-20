/* eslint-disable react/prop-types */
/* eslint-disable require-jsdoc */
import React, { useContext } from "react";
import TDCountDown from "./TDCountDown";
import { StateContext } from "../../../context/tradingStatusContext";
import { ACTIVE } from "../../../../scripts/config/contants";

export default function TDStatus(props) {
  const active = props.status == ACTIVE;
  const participated = props.used;
  const state = useContext(StateContext)?.state;

  return state?.trading && state?.loader == props?.loader ? (
    <TDCountDown second={props.second || 10} setDone={props.setDone} />
  ) : (
    <>
      <div>
        <i
          className={`fas ${
            participated
              ? "fa-circle text-success"
              : active
              ? "fa-caret-down text-info"
              : "fa-square text-danger"
          }`}
        ></i>
      </div>
    </>
  );
}

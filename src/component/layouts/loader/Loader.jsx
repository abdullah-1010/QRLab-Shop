import React from "react";
import { ReactComponent as CricketBall } from "../../../Image/Loader-svg/LoaderBlack.svg";
import "./Loader.css";
import LoadingOverlay from "react-loading-overlay";

const CricketBallLoader = () => (
  <div className="cricket-ball-loader">
    <CricketBall className="spinner" />
  </div>
);

export default CricketBallLoader;

export const FixedLoader = (props) => {
  return (
    <LoadingOverlay
      active={props.active}
      spinner={<CricketBall className="spinner" />}
    >
      {props.children}
    </LoadingOverlay>
  );
};

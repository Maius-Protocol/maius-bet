import { Divider, Progress } from "antd";
import Countdown from "react-countdown";
import React, { useEffect, useState } from "react";
import { UnmountClosed } from "react-collapse";
import useCountDown from "react-countdown-hook";

const interval = 1000;
const CountdownComponent = ({ seconds, total, data }) => {
  const [displayDetail, setDisplayDetail] = useState(false);
  const [timeLeft, { start, pause, resume, reset }] = useCountDown(
    seconds * 1000,
    interval
  );
  const percent = (timeLeft / (total * 1000)) * 100;
  useEffect(() => {
    start();
  }, []);

  console.log(timeLeft);

  useEffect(() => {
    setTimeout(() => {
      setDisplayDetail(true);
    }, 1000);
  }, []);

  return (
    <>
      <div className="d-flex flex-row">
        <UnmountClosed isOpened={percent !== 0}>
          <Progress
            type="circle"
            percent={percent}
            format={() => {
              return (
                <div>
                  <small>Starts in</small>
                  <div style={{ marginTop: "4px" }}>{timeLeft / 1000}s</div>
                </div>
              );
            }}
          />
        </UnmountClosed>
        <UnmountClosed isOpened={percent !== 0 && displayDetail}>
          <div style={{ marginLeft: 64 }}>
            <p style={{ color: "white" }}>Long Pool: {data?.longPool}</p>
            <p style={{ color: "white" }}>Short Pool: {data?.shortPool}</p>
            <p style={{ color: "white" }}>Long Odds: {data?.longOdds}</p>
            <p style={{ color: "white" }}>Short Odds: {data?.shortOdds}</p>
          </div>
        </UnmountClosed>
      </div>
      {percent !== 0 && <Divider />}
    </>
  );
};

export default CountdownComponent;

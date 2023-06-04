import { Divider, Progress, Statistic } from "antd";
import Countdown from "react-countdown";
import React, { useEffect, useState } from "react";
import { UnmountClosed } from "react-collapse";
import useCountDown from "react-countdown-hook";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";

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

  useEffect(() => {
    setTimeout(() => {
      setDisplayDetail(true);
    }, 1000);
  }, []);

  useEffect(() => {
    if (timeLeft === 0) {
      if (window.triggerOrder) {
        setTimeout(() => {
          window.triggerOrder();
        }, 5000);
      }
    }
  }, [timeLeft]);

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
          <div className="d-flex flex-row w-100" style={{ marginLeft: 64 }}>
            <div className="col-6">
              <Statistic
                title="Long Pool"
                prefix={<ArrowUpOutlined />}
                valueStyle={{ color: "#3f8600" }}
                value={data?.longPool}
                precision={2}
              />
              <Statistic
                title="Short Pool"
                valueStyle={{ color: "#cf1322" }}
                prefix={<ArrowDownOutlined />}
                value={data?.shortPool}
                precision={2}
              />
            </div>
            <div className="col-6">
              <Statistic
                title="Long Odds"
                value={data?.longOdds}
                precision={2}
                prefix={<ArrowUpOutlined />}
                valueStyle={{ color: "#3f8600" }}
              />
              <Statistic
                title="Short Odds"
                value={data?.shortOdds}
                precision={2}
                valueStyle={{ color: "#cf1322" }}
                prefix={<ArrowDownOutlined />}
              />
            </div>
          </div>
        </UnmountClosed>
      </div>
      {percent !== 0 && <Divider />}
    </>
  );
};

export default CountdownComponent;

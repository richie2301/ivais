import { CaretRightOutlined, PauseOutlined, StopOutlined } from '@ant-design/icons';
import { TimelineState } from '@xzdarcy/react-timeline-editor';
import { Space } from 'antd';
import React, { FC, useEffect, useState } from 'react';
import lottieControl from './lottieControl';
import { scale, scaleWidth, startLeft } from './mock';
// import ReactPlayer from 'react-player';

// const { Option } = Select;
export const Rates = [0.2, 0.5, 1.0, 1.5, 2.0];

const TimelinePlayer: FC<{
  timelineState: React.MutableRefObject<TimelineState | null>;
  autoScrollWhenPlay: React.MutableRefObject<boolean>;
  play: (status: boolean) => void;
  seek: (time: number) => void;
  playStatus: boolean;
  handleStop: () => void;
}> = ({ timelineState, autoScrollWhenPlay, play, seek, playStatus, handleStop }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState(0);

  useEffect(() => {
    if (!timelineState.current) return;
    const engine = timelineState.current;
    engine.listener.on('play', () => {
        setIsPlaying(true);
        play(true)
    });
    engine.listener.on('paused', () => {
        setIsPlaying(false);
        play(false)
    });
    engine.listener.on('afterSetTime', ({ time }) => 
    {
        setTime(time);
        seek(time)
        console.log(time)
    });
    engine.listener.on('setTimeByTick', ({ time }) => {
      setTime(time);
    //   seek(time)

      if (autoScrollWhenPlay.current) {
        const autoScrollFrom = 500;
        const left = time * (scaleWidth / scale) + startLeft - autoScrollFrom;
        timelineState.current?.setScrollLeft(left)
      }
    });

    return () => {
      if (!engine) return;
      engine.pause();
      engine.listener.offAll();
      lottieControl.destroy();
    };
  }, []);

  // 开始或暂停
  const handlePlayOrPause = () => {
    if (!timelineState.current) return;
    if (timelineState.current.isPlaying) {
      timelineState.current.pause();
    } else {
      timelineState.current.play({ autoEnd: true });
    }
  };

  // 设置播放速率
  // const handleRateChange = (rate: number) => {
  //   if (!timelineState.current) return;
  //   timelineState.current.setPlayRate(rate);
  // };

  // 时间展示
  const timeRender = (time: number) => {
    const float = (parseInt((time % 1) * 100 + '') + '').padStart(2, '0');
    const min = (parseInt(time / 60 + '') + '').padStart(2, '0');
    const second = (parseInt((time % 60) + '') + '').padStart(2, '0');
    return <>{`${min}:${second}.${float.replace('0.', '')}`}</>;
  };

  useEffect(() => {
    if (isPlaying != playStatus) {
        handlePlayOrPause()
    }
    setIsPlaying(playStatus)
    // console.log(playStatus)
  },[isPlaying, playStatus])

  return (
    <div className="timeline-player">
      <Space>
        {/* <ReactPlayer url="https://www.youtube.com/watch?v=1kehqCLudyg&list=RDjJHFirGQqvk&index=21" playing={isPlaying} /> */}
        {/* <h1>{time}</h1> */}
        {/* {play && <p>HEY</p>} */}
      <div className="play-control" onClick={handlePlayOrPause}>
        {isPlaying ? <PauseOutlined /> : <CaretRightOutlined />}
      </div>
      <div className="play-control" onClick={handleStop}>
        <StopOutlined />
      </div>
      <div className="time">{timeRender(time)}</div>
      {/* <div className="rate-control">
        <Select size={'small'} defaultValue={1} style={{ width: 120 }} onChange={handleRateChange}>
          {Rates.map((rate) => (
            <Option key={rate} value={rate}>{`${rate.toFixed(1)}倍速`}</Option>
          ))}
        </Select>
      </div> */}
      </Space>
    </div>
  );
};

export default TimelinePlayer;
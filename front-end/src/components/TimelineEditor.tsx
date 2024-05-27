// import { Timeline, TimelineState } from '@xzdarcy/react-timeline-editor';
// import { Switch, Typography, Button } from 'antd';
// import { cloneDeep } from 'lodash';
// import React, { useRef, useState, useEffect } from 'react';
// import { CustomRender0, CustomRender1 } from './custom';
// import './index.less';
// import { CustomTimelineAction, CusTomTimelineRow, mockData, mockEffect, scale, scaleWidth, startLeft } from './mock';
// import TimelinePlayer from './player';
// import ReactPlayer from 'react-player'
// // import handle from 'mqtt/lib/handlers/index';

// const {Text} = Typography;

// const defaultEditorData = cloneDeep(mockData);

// const TimelineEditor = () => {
//   const [data, setData] = useState(defaultEditorData);
//   const timelineState = useRef<TimelineState | null>(null);
//   // const playerPanel = useRef<HTMLDivElement>();
//   const autoScrollWhenPlay = useRef<boolean>(true);

//   const [isPlaying, setIsPlaying] = useState(false);
//   // const play = () => {
//   //   setIsPlaying(!isPlaying)
//   // }

//   useEffect(() => {
//     console.log(timelineState)
//   }, [timelineState])

//   const play = (status : boolean) => {
//     setIsPlaying(status);
//   }

//   const ref = React.useRef<ReactPlayer>(null);

//   const [number, setNumber] = useState(0)

//   const seek = (time : number) => {
//     // ref.current?.seekTo(time);
//     // console.log(time)
//     setNumber(time)
//     ref.current?.seekTo(time)
//   }

//   const handleStop = () => {

//   }

//   const seekButton = (time: number) => {
//     ref.current?.seekTo(time); 
//     timelineState.current?.setTime(time); 
//     setIsPlaying(false)
//   }

//   return (
//     <div className="timeline-editor-engine">
//       <div className="player-config">
//         <Text>{number}</Text>
//         <Switch
//           checkedChildren="开启运行时自动滚动"
//           unCheckedChildren="禁用运行时自动滚动"
//           defaultChecked={autoScrollWhenPlay.current}
//           onChange={(e) => (autoScrollWhenPlay.current = e)}
//           style={{ marginBottom: 20 }}
//         />
//       </div>
//       {/* <div className="player-panel" id="player-ground-1" ref={playerPanel}></div> */}
//       <Button onClick={() => setIsPlaying(!isPlaying)}>Play</Button>
//       <Button onClick={() => {seekButton(0)}}>0</Button>
//         <Button onClick={() => {seekButton(10)}}>10</Button>
//         <Button onClick={() => {seekButton(50)}}>50</Button>
//       <ReactPlayer ref={ref} url="https://www.youtube.com/watch?v=1kehqCLudyg&list=RDjJHFirGQqvk&index=19" controls={true} playing={isPlaying} />
//       <TimelinePlayer timelineState={timelineState} autoScrollWhenPlay={autoScrollWhenPlay} play={play} seek={seek} playStatus={isPlaying} handleStop={handleStop} />
//       <Timeline
//         scale={scale}
//         scaleWidth={scaleWidth}
//         startLeft={startLeft}
//         autoScroll={true}
//         ref={timelineState}
//         // isPlaying = {isPlaying}
//         // play = {isPlaying}
//         disableDrag={true}
//         // onActionMoving={isPlaying}
//         editorData={data}
//         effects={mockEffect}
//         onChange={(data) => {
//           setData(data as CusTomTimelineRow[]);
//         }}
//         getActionRender={(action, row) => {
//           if (action.effectId === 'effect0') {
//             return <CustomRender0 action={action as CustomTimelineAction} row={row as CusTomTimelineRow} openNoteDetails={handleStop} />;
//           } else if (action.effectId === 'effect1') {
//             return <CustomRender1 action={action as CustomTimelineAction} row={row as CusTomTimelineRow} />;
//           }
//         }}
//       />
//     </div>
//   );
// };

// export default TimelineEditor;
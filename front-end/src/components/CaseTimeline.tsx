import { Timeline } from '@xzdarcy/react-timeline-editor';
// import { Typography } from 'antd';
// import { cloneDeep, identity } from 'lodash';
import React, { useRef, useState, useEffect } from 'react';
import { CustomRender0, CustomRender1 } from './custom';
import './index.less';
import { CusTomTimelineRow, mockEffect, scale, scaleWidth, startLeft } from './mock';
import TimelinePlayer from './player';
import ReactPlayer from 'react-player'
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone.js'
import utc from 'dayjs/plugin/utc.js'
import type { CustomTimelineAction2 } from './custom';

// const {Text} = Typography;

// const defaultEditorData = cloneDeep(mockData);

type CaseTimelineProps = {
  videoUrl: string | undefined | any,
  reactPlayerRef: any,
  timelineRef: any,
  isPlaying: boolean,
  setIsPlaying: (a: boolean) => void,
  faceData: any,
  attributeData: any,
  notes: any,
  // setOpenAddNoteModal: (a: boolean) => void,
  setNoteTimeRange: (a: any) => void,
  openNoteDetails: (a: any) => void,
  handleStop: () => void;
  setNoteDetailsModal: (a: boolean) => void,
  // setData: (a: any) => void;
}

const CaseTimeline : React.FC<CaseTimelineProps> = ({videoUrl, reactPlayerRef, timelineRef, isPlaying, setIsPlaying, faceData, attributeData, notes, openNoteDetails, handleStop}) => {
  // const [data, setData] = useState(defaultEditorData);
//   const timelineState = useRef<TimelineState | null>(null);
  const timelineState = timelineRef;
  // const playerPanel = useRef<HTMLDivElement>();
  const autoScrollWhenPlay = useRef<boolean>(true);

//   const utc = require('dayjs/plugin/utc')
// const timezone = require('dayjs/plugin/timezone') // dependent on utc plugin

dayjs.extend(utc)
dayjs.extend(timezone)

//   const [isPlaying, setIsPlaying] = useState(false);
  // const play = () => {
  //   setIsPlaying(!isPlaying)
  // }

  // const [timelineData, setTimelineData] = useState<CusTomTimelineRow[]>([])
  const [timelineFaceData, setTimelineFaceData] = useState([])
  // const [timelineEvidence, setTimelineEvidence] = useState<any>([])
  const [timelineAttributeData, setTimelineAttributeData] = useState([])
  const [timelineNoteData, setTimelineNoteData] = useState<any>([])
  const [timelineData, setTimelineData] = useState<any>([])
  // const timelineData : CusTomTimelineRow[] = [
  //   {
  //     id: '0',
  //     actions: [
  //       {
  //         id: 'video',
  //         start: 0,
  //         end: 100,
  //         effectId: 'effect0',
  //         data: {
  //           src: 'yey',
  //           name: 'Video'
  //         }
  //       }
  //     ]
  //   },
  //   {
  //     id: '1',
  //     actions: timelineFaceData,
  //   }
  // ]

  useEffect(() => {
    // faceData.map((data: any) => {
    //   setTimelineFaceData({
    //     id: data.personNumber,
    //     start: data.timeStamp,
    //     end: data.timeStamp,
    //     effectId: 'effect1',
    //   })
    // })
    if (faceData) {
      setTimelineFaceData(faceData.map((data: any, index: number) => ({
        id: index,
        start: data.time/1000,
        end: data.time/1000,
        effectId: 'effect1',
        flexible: false,
        data: {
          saved: true
        }
      })))
    }
  },[faceData])

  useEffect(() => {
    if(attributeData) {
      setTimelineAttributeData(attributeData.map((data: any, index: number) => ({
        id: index,
        start: data.time/1000,
        end: data.time/1000,
        effectId: 'effect1',
        flexible: false,
        data: {
          saved: true
        }
      })))
    }
  }, [attributeData])

  useEffect(() => {
    setTimelineNoteData(notes.map((data: any) => ({
      id: data.id,
      start: data.startTimeTimeStamp,
      end: data.endTimeTimeStamp,
      effectId: 'effect0',
      flexible: true,
      data: {
        name: data.title,
        level: data.level,
        notes: data.notes,
        saved: true
      }
    })))
  
  }, [notes])

  // useEffect(() => {
  //   setTimelineEvidence([
  //     {
  //       id: 'video',
  //         start: 0,
  //         end: 100,
  //         effectId: 'effect0',
  //         data: {
  //           src: 'yey',
  //           name: 'Video'
  //         }
  //     },
  //   ])
  // }, [])

  useEffect(() => {
    setTimelineData([
      // {
      //   id: '0',
      //   actions: timelineEvidence
      // },
      {
        id: '0',
        actions: timelineFaceData
      },
      {
        id: '1',
        actions: timelineAttributeData
      },
      {
        id: '2',
        actions: timelineNoteData
      }
    ])
  }, [timelineFaceData, timelineAttributeData, timelineNoteData])

  useEffect(() => {
    // console.log(timelineState)
    
  }, [timelineState])

  const play = (status : boolean) => {
    setIsPlaying(status);
  }

//   const ref = React.useRef<ReactPlayer>(null);
const ref = reactPlayerRef

  // const [number, setNumber] = useState(0)

  const seek = (time : number) => {
    // ref.current?.seekTo(time);
    // console.log(time)
    // setNumber(time)
    ref.current?.seekTo(time)
  }

//   const seekButton = (time: number) => {
//     ref.current?.seekTo(time); 
//     timelineState.current?.setTime(time); 
//     setIsPlaying(false)
//   }
// Construct the URL
// const videoUrl = url + '/CaseEvidenceVideoAttachment?evidenceId=' + data[0].evidenceId;

// Define the headers
const headers = new Headers();
headers.append('Range', 'bytes=2-5,10-13');
// const [videoBlob, setVideoBlob] = useState()

// Make the fetch request with the URL and headers
// fetch(videoUrl, {
//     method: 'GET',
//     headers: headers
// })
// .then(response => response.blob())
// .then(blob => {
//     // Create a URL for the blob
//     const videoBlobUrl = URL.createObjectURL(blob);

//     // Get the video element
//     // const videoElement = document.createElement('video');
    
//     // Set attributes for the video element
//     // videoElement.src = videoBlobUrl;
//     // videoElement.controls = true; // Enable video controls

//     // Append the video element to the DOM
//     // document.body.appendChild(videoElement);

//     setVideoBlob(videoBlobUrl)
// })
// .catch(error => {
//     // Handle any errors
//     console.error('Error fetching video:', error);
// }, [videoUrl]);


const idRef = useRef(0)

const [allowDrag, setAllowDrag] = useState(true)

// useEffect(() => setNoteDetailsModal(false), [timelineData])

  return (
    <div className="timeline-editor-engine">
      {/* <div className="player-panel" id="player-ground-1" ref={playerPanel}></div> */}
      {/* <Button onClick={() => setIsPlaying(!isPlaying)}>Play</Button>
      <Button onClick={() => {seekButton(0)}}>0</Button>
        <Button onClick={() => {seekButton(10)}}>10</Button>
        <Button onClick={() => {seekButton(50)}}>50</Button> */}
      <ReactPlayer 
        ref={ref} 
        url={videoUrl} 
        controls={true} 
        fallback={<img src="" />}
        playing={isPlaying} 
        height="300px"
        // width="620px"
        onPlaying={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)} />
      <TimelinePlayer timelineState={timelineState} autoScrollWhenPlay={autoScrollWhenPlay} play={play} seek={seek} playStatus={isPlaying} handleStop={handleStop} />
      <Timeline
        style={{height: '200px'}}
        scale={scale}
        scaleWidth={scaleWidth}
        startLeft={startLeft}
        autoScroll={true}
        ref={timelineState}
        onChange={setTimelineData}
        // dragLine={true}
        // onClickRow={(e, {row, time}) => console.log(row)}
        // isPlaying = {isPlaying}
        // play = {isPlaying}
        // onDoubleClickRow={(e, {row, time}) => {
        //   console.log('hey', e, row, time)
        //   console.log(new Date(time * 1000).getTime())
        //   console.log(dayjs.unix(time))
        //   setOpenAddNoteModal(true)
        //   const a = dayjs.unix(time)
        //   const b = dayjs.unix(time+1)
        //   // setNoteStartTime(dayjs.utc(a))
        //   setNoteTimeRange([dayjs.utc(a), dayjs.utc(b)])
        // }}
        onDoubleClickRow={(_e, {row, time}) => {
          setTimelineData((pre: any) => {
            // const rowIndex = pre.findIndex(item => item.id === row.id);
            const rowIndex = 2;
            const newAction = {
              id: `action${idRef.current++}`,
              start: time,
              end: time + 1,
              effectId: "effect2",
              flexible: true,
              data: {
                name: `Draft note`,
                level: 1,
                notes: '',
                saved: false
              }
            }
            pre[rowIndex] = {...row, actions: row.actions.concat(newAction)};
            return [...pre];
          })
        }}
        disableDrag={!allowDrag}
        // onActionMoving={isPlaying}
        editorData={timelineData}
        effects={mockEffect}
        // onChange={(data) => {
        //   setData(data as CusTomTimelineRow[]);
        // }}
        getActionRender={(action, row) => {
          if (action.effectId === 'effect0') {
            return <CustomRender0 action={action as CustomTimelineAction2} row={row as CusTomTimelineRow} openNoteDetails={openNoteDetails} setAllowDrag={setAllowDrag} />;
          } else if (action.effectId === 'effect1') {
            return <CustomRender1 action={action as CustomTimelineAction2} row={row as CusTomTimelineRow} setAllowDrag={setAllowDrag} />;
          } else if (action.effectId === 'effect2') {
            return <CustomRender0 action={action as CustomTimelineAction2} row={row as CusTomTimelineRow} openNoteDetails={openNoteDetails} setAllowDrag={setAllowDrag} />;
          }
        }}
      />
    </div>
  );
};

export default CaseTimeline;
import React from "react";
import ReactPlayer from "react-player";
// import { seekTo } from "react-player/lib/Player";
import { Button, Typography } from "antd";

// import TimelineEditor from '../components/TimelineEditor'

const { Title } = Typography

const Profile: React.FC = () => {
  // const [played, setPlayed] = React.useState(0);
  const ref = React.useRef<ReactPlayer>(null);
  // const handleSliderChange = (e: any) => {
  //   // setPlayed(parseFloat(e.target.value));
  //   ref.current?.seekTo(parseFloat(e.target.value));
  //   console.log(ref.current?.getCurrentTime());
  //   // console.log(ref.current?.getCurrentTime());
  //   // setPlayed(ref.current?.getCurrentTime() ?? 0);
  //   // setCurrentTime(getCurrentTime());
  //   // ref.current?.play
  // }
  const [playing, setPlaying] = React.useState(false);
  // const [currentTime, setCurrentTime] = React.useState(0);
  // useEffect(() => {
  //   console.log(ref.current?.getCurrentTime());
  // }, [currentTime])
  // const handleInputChange = (e: any) => {
  //   setPlayed(e.target.value);
  //   ref.current?.seekTo(parseFloat(e.target.value));
  // }
    return (
      <div style={{display: 'none'}}>
        <Title>Profile</Title>
        {/* <TimelineEditor /> */}
        <ReactPlayer
            // ref={p => { this.p = p }}
            ref={ref}
            url="https://www.youtube.com/embed/pWQF-ETjzx8?si=sJdvLKDFkenh9tEU"
            width="500px"
            height="300px"
            controls={true}
            playing={playing}
            // onProgress={({ playedSeconds }) => setPlayed(playedSeconds)}
            // played={played}
        />
        <Button onClick={() => setPlaying(!playing)}>Play</Button>
        {/* <input
          type='range' min={0} step='any'
          // value={played}
          // onMouseDown={this.handleSeekMouseDown}
          // onChange={(e) => ref.current?.seekTo(parseFloat(e.target.value))}
          onChange ={handleSliderChange}
            // onChange={(e) => seekTo(parseFloat(e.target.value))}
          // onMouseUp={this.handleSeekMouseUp}
        /> */}
        {/* <Text>{ref.current?.getCurrentTime()}</Text> */}
        {/* <Input value={played} onChange={handleInputChange} /> */}
        <Button onClick={() => {ref.current?.seekTo(0)}}>0</Button>
        <Button onClick={() => {ref.current?.seekTo(10)}}>10</Button>
        <Button onClick={() => {ref.current?.seekTo(50)}}>50</Button>
      </div>
    );
  }
  
  export default Profile;
import { FC } from 'react';
import { CustomTimelineAction, CusTomTimelineRow } from './mock';
import Icon from '@ant-design/icons';

export interface CustomTimelineAction2 extends CustomTimelineAction {
  data: {
    name: string,
    saved: boolean,
    src: string,
    level: number
  }
}

// export const CustomRender0: FC<{ action: CustomTimelineAction; row: CusTomTimelineRow }> = ({ action, row }) => {
export const CustomRender0: FC<{ action: CustomTimelineAction2; row: CusTomTimelineRow; openNoteDetails: (a: any) => void, setAllowDrag: (a: boolean) => void }> = ({ action, openNoteDetails, setAllowDrag }) => {
  return (
    <div className={'effect0'} onMouseDown={() => setAllowDrag(!action.data.saved)} onMouseUp={() => setAllowDrag(true)} onContextMenu={(e) => {e.preventDefault(); openNoteDetails(action)}} style={action.data.saved ? {background: 'rgb(66, 135, 245)'} : {background: 'none'}}>
      <div className={`effect0-text`}>{action.data.name}</div>
    </div>
  );
};

const MapIconSvg = () => (
  <svg width="1em" height="1em" viewBox="0 0 105.93 122.88" opacity="0.1">
    {/* <path d="M56.92,73.14a1.62,1.62,0,0,1-1.86.06A65.25,65.25,0,0,1,38.92,58.8,51.29,51.29,0,0,1,28.06,35.37C26.77,27.38,28,19.7,32,13.45a27,27,0,0,1,6-6.66A29.23,29.23,0,0,1,56.36,0,26,26,0,0,1,73.82,7.12a26,26,0,0,1,4.66,5.68c4.27,7,5.19,16,3.31,25.12A55.29,55.29,0,0,1,56.92,73.14Zm-19,.74V101.7l30.15,13V78.87a65.17,65.17,0,0,0,6.45-5.63v41.18l25-12.59v-56l-9.61,3.7a61.61,61.61,0,0,0,2.38-7.81l9.3-3.59A3.22,3.22,0,0,1,105.7,40a3.18,3.18,0,0,1,.22,1.16v62.7a3.23,3.23,0,0,1-2,3L72.72,122.53a3.23,3.23,0,0,1-2.92,0l-35-15.17L4.68,122.53a3.22,3.22,0,0,1-4.33-1.42A3.28,3.28,0,0,1,0,119.66V53.24a3.23,3.23,0,0,1,2.32-3.1L18.7,43.82a58.63,58.63,0,0,0,2.16,6.07L6.46,55.44v59l25-12.59V67.09a76.28,76.28,0,0,0,6.46,6.79ZM55.15,14.21A13.72,13.72,0,1,1,41.43,27.93,13.72,13.72,0,0,1,55.15,14.21Z"/> */}
    <circle r="45" cx="50" cy="50" fill="rgb(66, 135, 245)" />
  </svg>
)

const MapIcon = () => (
  <Icon component={MapIconSvg} />
);

// export const CustomRender1: FC<{ action: CustomTimelineAction; row: CusTomTimelineRow }> = ({ action, row }) => {
export const CustomRender1: FC<{ action: CustomTimelineAction2; row: CusTomTimelineRow; setAllowDrag: (a: boolean) => void }> = ({ action, setAllowDrag }) => {
  return (
    // <div className={'effect1'}>
    //   <div className={`effect1-text`}>{`播放动画: ${action.data.name}`}</div>
    // </div>
    <div className={'effect1'} onMouseDown={() => setAllowDrag(!action.data.saved)}  onMouseUp={() => setAllowDrag(true)}>
        {/* <img src={gambar}></img> */}
        {/* <MapIcon /> */}
        <MapIcon />
    </div>
  );
};
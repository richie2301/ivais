import { TimelineAction, TimelineEffect, TimelineRow } from '@xzdarcy/react-timeline-editor';
import audioControl from './audioControl';
import lottieControl from './lottieControl';

export const scaleWidth = 160;
export const scale = 5;
export const startLeft = 20;

export interface CustomTimelineAction extends TimelineAction {
  data: {
    src: string;
    name: string;
  };
}

export interface CusTomTimelineRow extends TimelineRow {
  actions: CustomTimelineAction[];
}

export const mockEffect: Record<string, TimelineEffect> = {
  effect0: {
    id: 'effect0',
    name: '播放音效',
    source: {
      start: ({ action, engine, isPlaying, time }) => {
        if (isPlaying) {
          const src = (action as CustomTimelineAction).data.src;
          audioControl.start({ id: src, src, startTime: action.start, engine, time });
        }
      },
      enter: ({ action, engine, isPlaying, time }) => {
        if (isPlaying) {
          const src = (action as CustomTimelineAction).data.src;
          audioControl.start({ id: src, src, startTime: action.start, engine, time });
        }
      },
      leave: ({ action, engine }) => {
        const src = (action as CustomTimelineAction).data.src;
        audioControl.stop({ id: src, engine });
      },
      stop: ({ action, engine }) => {
        const src = (action as CustomTimelineAction).data.src;
        audioControl.stop({ id: src, engine });
      },
    },
  },
  effect1: {
    id: 'effect1',
    name: '播放动画',
    source: {
      enter: ({ action, time }) => {
        const src = (action as CustomTimelineAction).data.src;
        lottieControl.enter({ id: src, src, startTime: action.start, endTime: action.end, time });
      },
      update: ({ action, time }) => {
        const src = (action as CustomTimelineAction).data.src;
        lottieControl.update({ id: src, src, startTime: action.start, endTime: action.end, time });
      },
      leave: ({ action, time }) => {
        const src = (action as CustomTimelineAction).data.src;
        lottieControl.leave({ id: src, startTime: action.start, endTime: action.end, time });
      },
    },
  },
  effect2: {
    id: 'effect2',
    name: '播放动画',
    source: {
      enter: ({ action, time }) => {
        const src = (action as CustomTimelineAction).data.src;
        lottieControl.enter({ id: src, src, startTime: action.start, endTime: action.end, time });
      },
      update: ({ action, time }) => {
        const src = (action as CustomTimelineAction).data.src;
        lottieControl.update({ id: src, src, startTime: action.start, endTime: action.end, time });
      },
      leave: ({ action, time }) => {
        const src = (action as CustomTimelineAction).data.src;
        lottieControl.leave({ id: src, startTime: action.start, endTime: action.end, time });
      },
    },
  },
};

export const mockData: CusTomTimelineRow[] = [
  {
    id: '0',
    actions: [
      {
        id: 'action0',
        start: 9.5,
        end: 16,
        effectId: 'effect1',
        data: {
          src: 'https://www.youtube.com/watch?v=1kehqCLudyg&list=RDjJHFirGQqvk&index=19',
          name: '点赞',
        },
      },
    ],
  },
  {
    id: '1',
    actions: [
      {
        id: 'action1',
        start: 5,
        end: 9.5,
        effectId: 'effect1',
        data: {
          src: 'https://www.youtube.com/watch?v=1kehqCLudyg&list=RDjJHFirGQqvk&index=19',
          name: '工作',
        },
      },
    ],
  },
  {
    id: '2',
    actions: [
      {
        id: 'action2',
        start: 5,
        end: 5,
        effectId: 'effect1',
        flexible: false,
        data: {
          src: 'https://www.youtube.com/watch?v=1kehqCLudyg&list=RDjJHFirGQqvk&index=19',
          name: '奶牛',
        },
      },
    ],
  },
  {
    id: '3',
    actions: [
      {
        id: 'action3',
        start: 0,
        end: 100,
        effectId: 'effect0',
        data: {
          src: 'https://www.youtube.com/watch?v=1kehqCLudyg&list=RDjJHFirGQqvk&index=19',
          name: '背景音乐',
        },
      },
    ],
  },
];
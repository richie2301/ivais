import React from 'react';
import { Row, Col, Button, Space, Slider, InputNumber } from 'antd';
import { CaretRightOutlined, PauseOutlined, StopOutlined, FullscreenOutlined } from '@ant-design/icons';

type VideoPlayerProps = {
    onChange: (value: number) => void;
    inputValue: number | null;
};

const VideoPlayer: React.FC<VideoPlayerProps> = ({onChange, inputValue}) => {

// export default function VideoPlayer({onChange, inputValue}: VideoPlayerProps) {
    return (
        <>
            <img width='100%' src="https://c4.wallpaperflare.com/wallpaper/586/603/742/minimalism-4k-for-mac-desktop-wallpaper-preview.jpg" alt="video" />
                <Row gutter={16}>
                    <Col flex="none">
                        <Space size={5}>
                            <Button type="primary" icon={<CaretRightOutlined />}></Button>
                            <Button type="primary" icon={<PauseOutlined />}></Button>
                            <Button type="primary" icon={<StopOutlined />}></Button>
                        </Space>
                    </Col>
                    <Col flex="auto">
                        <Slider
                            min={0}
                            max={20}
                            onChange={onChange}
                            value={typeof inputValue === 'number' ? inputValue : 0}
                        />

                    </Col>
                    <Col flex="none">
                        <Space>
                            <InputNumber
                                min={0}
                                max={20}
                                value={inputValue}
                                onChange={(value: number | null | undefined) => onChange(value ?? 0)}
                            />
                            <Button icon={<FullscreenOutlined />}></Button>
                        </Space>
                    </Col>
                </Row>
                {/* <Space style={{width: '100%', padding: '10px', border: '1px solid black', borderRadius: '12px', margin: '10px 0'}}>
                    <div style={{height: '150px', width: '100%'}}>Chart Overtime</div>
                </Space> */}
        </>
    );
}

export default VideoPlayer;
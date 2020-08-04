import React from 'react'
import './PlayerPage.css'
import './VideoReact.css'
import { Player } from 'video-react';

const PlayerPage = () => {

    const videos = [
        {
            title:"Sample Video 1",
            url:"https://funtube-1259626356.cos.ap-shanghai.myqcloud.com/sample-video-1.mp4",
            cover_url:"https://funtube-1259626356.cos.ap-shanghai.myqcloud.com/sample-cover-1.png"
        },
    ]
    const [ video_info, setVideoInfo ] = React.useState(undefined)
    React.useEffect(()=>{
        if (video_info===undefined){
            setVideoInfo(videos[0])
        }
    })
    
    return(
        <div className="PlayerPage">
            <div className="PlayerPage-main">
                <span className="Video-title">{video_info?video_info.title:"..."}</span>
                <div className="Video-discription-line">
                    <span className="Video-discription">Video-Type</span>
                    <span className="Video-discription">Publish-time</span>
                </div>
                <Player
                    src={video_info?video_info.url:""}
                />
                <hr className="PlayerPage-separator" />
                <span>--Other Functions--</span>
            </div>
            <div className="PlayerPage-sider">
                <div className="PlayerPage-sider-title">Video List:</div>
                {videos.map((item,index)=>
                    <div className="PlayerPage-video-list-item" onClick={()=>{setVideoInfo(item)}}>
                        <img alt="Video Cover" className="PlayerPage-video-list-item-img" src={item.cover_url}/>
                            <div className="PlayerPage-video-list-item-info">
                                <span className="Video-title-small">{item.title}</span>
                                <span className="Video-discription">Video-Type</span>
                                <span className="Video-discription">Publish-time</span>
                            </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default PlayerPage
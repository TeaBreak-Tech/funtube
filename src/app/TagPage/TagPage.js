import React from 'react'
import { SiteHeader } from '../IndexPage/IndexPage'
import './TagPage.css'
import { Card } from 'antd';
import { useParams } from 'react-router-dom'

const TagPage = () => {

    const [ videos, setVideos ] = React.useState([])
    const { tagTitle } = useParams()

    const getVideos = () => {
        fetch('/api/videos/'+tagTitle)
        .then(response => {
            if(response.status===200){
                return response.json()
            }
        }).then(data=>{if(data){
            setVideos(data.videos)
            console.log(data.result)
        }})
    }

    const gridStyle = {
        width: '25%',
        textAlign: 'center',
    };

    React.useEffect(()=>{
        getVideos()
    },[tagTitle])
    
    return (
        <div className="IndexPage">
            <SiteHeader/>
            <div className="IndexPage-content">
                <div style={{
                    paddingLeft:'40px',
                    paddingRight:'40px',
                    textAlign:"left",
                }}>
                    {videos.map(video=>(
                        <div style={{
                            width: 'calc(25% - 20px)',
                            textAlign: 'center',
                            margin:"10px",
                            backgroundColor:"white",
                            boxShadow:"2px 2px 3px #00000022",
                            display:"inline-block",
                            borderRadius:'3px',
                        }} onClick={()=>{
                            window.location.href="/player/"+video.video_id+"?mode=2"
                        }}>
                            <img className="video-cover" src={video.cover_url}></img>
                            <div style={{
                                margin:'10px',
                            }}>{video.title}</div>
                        </div>
                    ))}
                </div>
            </div>
            <footer className="App-footer">
                <span>Copyright@2020 Prof. Zhang Qiang</span>
            </footer>
        </div>
    )
}

export default TagPage
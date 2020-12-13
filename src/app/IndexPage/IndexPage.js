import React from 'react'
import logo from '../logo.svg';
import './IndexPage.css'
import { Link } from 'react-router-dom'
import { Card } from 'antd';

export const SiteHeader = () => {
    return (
        <header className="App-header" style={{
            width:'1200px',
            maxWidth:"100%", 
            alignSelf:'center', 
            backgroundColor:'white',
            paddingLeft:'50px',
            paddingRight:'50px',
        }}>
            <img src={logo} className="App-logo" alt="logo" />
            <span className="App-title">
                Funtube
            </span>
            <Link className="menu-item" to="/">全部视频</Link>
            <Link className="menu-item" to="/综艺">综艺</Link>
            <Link className="menu-item" to="/影视">影视</Link>
            <Link className="menu-item" to="/原创">原创</Link>
        </header>
    )
}

const IndexPage = () => {

    const [ video_by_tag, setVideoByTag ] = React.useState([])

    const getVideos = () => {
        fetch('/api/videos')
        .then(response => {
            if(response.status===200){
                return response.json()
            }
        }).then(data=>{if(data){
            setVideoByTag(data.result)
            console.log(data.result)
        }})
    }

    const gridStyle = {
        width: 'calc(25% - 20px)',
        textAlign: 'center',
        
    };

    React.useEffect(()=>{
        getVideos()
    },[])
    
    return (
        <div className="IndexPage">
            <SiteHeader/>
            <div className="IndexPage-content">
                {video_by_tag.map(tag_videos=>(
                    <div style={{
                        display:"flex",
                        flexDirection:"column",
                        marginBottom: '10px',
                        paddingLeft:'40px',
                        paddingRight:'40px',
                    }}>
                        
                        <span style={{
                            alignSelf:"flex-start",
                            margin:'10px',
                            fontSize:"20px",
                            fontWeight:600,
                        }}>{tag_videos.tag_title}</span>

                        <div >

                        {tag_videos.videos.slice(0,4).map(video=>(

                            <div 
                                style={{
                                    width: 'calc(25% - 20px)',
                                    textAlign: 'center',
                                    margin:"10px",
                                    backgroundColor:"white",
                                    boxShadow:"2px 2px 3px #00000022",
                                    display:"inline-block",
                                    borderRadius:'3px',
                                }} 
                                onClick={()=>{
                                    window.location.href="/player/"+video.video_id+"?mode=2"
                                }}
                            >
                                <img className="video-cover" src={video.cover_url}></img>
                                <div style={{
                                    margin:'10px',
                                }}>{video.title}</div>
                            </div>
                        ))}
                        </div>
                    </div>
                ))}
            </div>
            <footer className="App-footer">
                <span>Copyright@2020 Prof. Zhang Qiang</span>
            </footer>
        </div>
    )
}

export default IndexPage
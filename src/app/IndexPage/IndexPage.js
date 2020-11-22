import React from 'react'
import logo from '../logo.svg';
import './IndexPage.css'
import { Link } from 'react-router-dom'
import { Card } from 'antd';

export const SiteHeader = () => {
    return (
        <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <span className="App-title">
                Funtube Video
            </span>
            <Link className="menu-item" to="/">All categories</Link>
            <Link className="menu-item" to="/综艺">Shows</Link>
            <Link className="menu-item" to="/影视">Movies</Link>
            <Link className="menu-item" to="/原创">Original</Link>
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
        width: '25%',
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
                    <Card style={{marginBottom: '10px'}} title={tag_videos.tag_title}>
                        {tag_videos.videos.map(video=>(
                            <Card.Grid style={gridStyle} onClick={()=>{window.location.href="/player/"+video.video_id+"?mode=2"}}>
                                <img className="video-cover" src={video.cover_url}></img>
                                {video.title}
                            </Card.Grid>
                        ))}
                    </Card>
                ))}
            </div>
            <footer className="App-footer">
                <span>Copyright@2020 Prof. Zhang Qiang</span>
            </footer>
        </div>
    )
}

export default IndexPage
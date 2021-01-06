import React from 'react'
import logo from '../logo.svg';

import './IndexPage.css'
import { Link } from 'react-router-dom'
import { Image } from 'antd';

import icon from '../icon.png';
import name from '../name.png';

export const SiteHeader = () => {
    const [ cat, setCat ] = React.useState([])

    React.useEffect(()=>{
        fetch('/api/cat')
        .then(res=>{return res.json()})
        .then(data=>{
            console.log(data)
            setCat(data.result)
        })

    },[])

    return (
        <header className="App-header" style={{
            width:'1200px',
            maxWidth:"100%", 
            alignSelf:'center', 
            backgroundColor:'white',
            paddingLeft:'50px',
            paddingRight:'50px',
        }}>
            <img src={icon} className="App-logo" alt="logo" />
            <img src={name} className="App-logo" alt="logo" />
            <Link className="menu-item" to={"/"}>全部视频</Link>
            {cat.map(item=>(
                <Link className="menu-item" to={"/"+item.cat_id}>{item.cat_title}</Link>
            ))}
        </header>
    )
}

const IndexPage = () => {

    const [ videos, setVideos ] = React.useState([])

    const [ title, setTitle ] = React.useState([])

    const getVideos = (timer) => {
        fetch('/api/videos/0')
        .then(response => {
            if(response.status===200){
                return response.json()
            }
        }).then(data=>{if(data){
            setVideos(data.videos)
            console.log(data.videos)
            setTitle(data.title)
            clearInterval(timer)
        }})
    }

    const gridStyle = {
        width: 'calc(25% - 20px)',
        textAlign: 'center',
        
    };

    React.useEffect(()=>{
        let timer = setInterval(()=>getVideos(timer),100)
    },[])
    
    return (
        <div className="IndexPage">
            <SiteHeader/>
            <div className="IndexPage-content">
                {/*{video_by_tag.map(tag_videos=>(
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
                */}
                    <h1 style={{
                        textAlign:"left",
                        paddingLeft:"10px",
                        marginTop:"10px",
                        fontSize:"22px",
                        fontWeight:"bold",
                    }}>{title}</h1>

                    <div style={{textAlign:"left"}}>
                        {videos/*.slice(0,4)*/.map(video=>(
                            <VideoCard video={video}/>
                        ))}
                    </div>
                {/*
                    </div>
                ))}*/}
            </div>
            <footer className="App-footer">
                <span>Funtube Video</span>
            </footer>
        </div>
    )
}

export default IndexPage

export const VideoCard = ({video}) => {
    return (
        <div 
            style={{
                width: 'calc(25% - 20px)',
                textAlign: 'center',
                margin:"10px",
                backgroundColor:"white",
                boxShadow:"2px 2px 3px #00000022",
                display:"inline-block",
                verticalAlign: "top",
                borderRadius:'3px',
            }} 
            onClick={()=>{
                window.location.href="/player/"+video.video_id+"?mode=2"
            }}
        >
            <Image 
                className="video-cover" 
                src={video.cover_url}
                fallback="data:image/png;base64,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"
            ></Image>
            <div style={{
                margin:'10px',
                minHeight:"40px",
                textAlign:"left",
                fontWeight:"bold"
            }}>{video.title||"无名称"}</div>
            <div style={{
                margin:'10px',
                minHeight:"20px",
                textAlign:"left",
                fontSize:"12px",
                color:"gray",
            }}>
                <span style={{marginRight:"20px",display:"inline-block"}}>观看数：{video.views||"0"}</span>
                <span style={{display:"inline-block"}}>{video.created_time.split("T")[0]}</span>
            </div>
        </div>
    )
}
import React from 'react'
import { SiteHeader, VideoCard } from '../IndexPage/IndexPage'
import './TagPage.css'
import { Image } from 'antd';
import { useParams } from 'react-router-dom'

const TagPage = () => {

    const [ videos, setVideos ] = React.useState([])

    const [ title, setTitle ] = React.useState([])

    const { catId } = useParams()

    const getVideos = () => {
        fetch('/api/video_by_tag/'+catId)
        .then(response => {
            if(response.status===200){
                return response.json()
            }
        }).then(data=>{if(data){
            setVideos(data.videos)
            console.log(data.result)
            setTitle(data.title)
        }})
    }

    const gridStyle = {
        width: '25%',
        textAlign: 'center',
    };

    React.useEffect(()=>{
        getVideos()
    },[catId])
    
    return (
        <div className="IndexPage App">
            <SiteHeader/>
            <div className="IndexPage-content">
                <h1 style={{
                    textAlign:"left",
                    paddingLeft:"50px",
                    marginTop:"10px",
                    fontSize:"22px",
                    fontWeight:"bold",
                }}>{title}</h1>
                <div style={{
                    paddingLeft:'40px',
                    paddingRight:'40px',
                    textAlign:"left",
                }}>
                    {videos.map(video=>(
                        <VideoCard video={video}/>
                    ))}
                </div>
            </div>
            <footer className="App-footer">
                <span>Funtube Video</span>
            </footer>
        </div>
    )
}

export default TagPage
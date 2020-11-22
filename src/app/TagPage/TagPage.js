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
                <Card style={{marginBottom: '10px'}} title={tagTitle}>
                    {videos.map(video=>(
                        <Card.Grid style={gridStyle}>
                            <img className="video-cover" src={video.cover_url}></img>
                            {video.title}
                        </Card.Grid>
                    ))}
                </Card>
            </div>
            <footer className="App-footer">
                <span>Copyright@2020 Prof. Zhang Qiang</span>
            </footer>
        </div>
    )
}

export default TagPage
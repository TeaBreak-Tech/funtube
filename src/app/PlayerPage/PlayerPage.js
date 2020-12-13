import React from 'react'
import './PlayerPage.css'
import './VideoReact.css'
import './VideoToolbar.css'

//import './Antd.css'
import { Player, BigPlayButton,ControlBar } from 'video-react';
import { Chart, LineAdvance} from 'bizcharts';
import { Slider, Button, Tooltip, Switch, message } from 'antd';
import { ExpandOutlined, PlayCircleOutlined, PauseCircleOutlined, SoundOutlined, SettingOutlined, FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons';
import { useParams, useLocation } from "react-router-dom";
import { SiteHeader } from '../IndexPage/IndexPage';

//let DEFAULT_DEVELOP = true

import FuntubePlayer from '../Player/Player'

const SHOW_SIDEBAR = true
const SHOW_SVI = false


const PlayerPage = () => {

    let { /*pageVersion,*/ videoId } = useParams();
    
    //let player_type = parseInt(pageVersion)
    let player_type = new URLSearchParams(useLocation().search).get('mode')
    let test = new URLSearchParams(useLocation().search).get('test')
    if (!player_type){player_type=1}
    else{player_type = parseInt(player_type)}
    let DEVELOP = test==='1'//pageVersion==='0'
    //const video_id = new URLSearchParams(useLocation().search).get('video')

    const [ is_fullpage, setIsFullPage ] = React.useState(false)

    const [ video_info, setVideoInfo ] = React.useState(undefined)

    const [ show_ad, setShowAd ] = React.useState(false)

    //const [ continuous_log, setContinuousLog ] = React.useState(false)

    const [ new_message, setNewMessage ] = React.useState('---- SESSION INFO ----')

    const [ new_frequent_message, setNewFrequentMessage ] = React.useState('---- FREQUENT-LOG ----')

    const [ messages, setMessages ] = React.useState([])

    const [ frequent_messages, setFrequentMessages ] = React.useState([])

    const [ videos, setVideos ] = React.useState([])

    const [ played, setPlayed ] = React.useState(["played"])

    const [ session_id, setSessionId ] = React.useState("")

    const lastMessage = React.useRef()

    const lastFrequentMessage = React.useRef()

    const pid = new URLSearchParams(useLocation().search).get('pid')

    const startSession = (video_id) => {
        console.log("starting session... with video_id",video_id)
        fetch('/api/session',{
            method:'POST',
            body:JSON.stringify({
                pid,
                player_type,
                client:0,
                video_id
            })
        })
        .then(res=>{
            if(res.status===200){ return res.json() }
            else if (res.status===404){
                if(video_id==="default"){
                    message.info("You are using a default video")
                }else{
                    message.error("The video you wand doesn't exist!")
                }
            }
        })
        .then(data=>{
            if(data){
                //console.log(data)
                setVideoInfo(data.videos[0])
                console.log("Session start successfully")
                setVideos(data.videos)
                setSessionId(data.session_id)
                setNewMessage("visitor status: "+(data.is_new_visitor?"new-visitor":"existing-visitor"))
                setNewMessage("visitor_id: "+data.visitor_id.substring(0,8)+'...')
                setNewMessage("session_id: "+data.session_id.substring(0,8)+'...')
                setNewMessage('---- EVENT LOG ----')
            }else{
                console.log("Faild to start session")
                getVideoList(true)
            }
        })
    }

    const getVideoList = (willStartSession=false) => {
        fetch('/api/video/list',{
            method:'POST',
            body:JSON.stringify({client:0})
        })
        .then(res=>{
            if(res.status===200){ return res.json() }
            else{message.error("Please check internet connection")}
        })
        .then(data=>{
            if(data){
                setVideoInfo(data.result[0])
                console.log("got video info list")
                setVideos(data.result)
                if (willStartSession){
                    if(data.result.length>0){
                        console.log("Trying restarting session with default video")
                        startSession(data.result[0].video_id)
                    }
                }
            }
        })
    }

    React.useEffect(()=>{
        startSession(videoId)
        //getVideoList()
    },[videoId])

    React.useEffect(()=>{
        setMessages(messages.concat([new_message]))
        if(new_message.label){
            fetch('/api/event/',{
                method:'POST',
                body:JSON.stringify({...new_message,session_id:session_id,pid})
            })
        }else{
            console.log(new_message)
        }
        // eslint-disable-next-line
    },[new_message])

    React.useEffect(()=>{
        //if(DEVELOP){console.log(new_frequent_message)}
        setFrequentMessages(frequent_messages.concat([new_frequent_message]))
        if(new_frequent_message.label){
            fetch('/api/event/',{
                method:'POST',
                body:JSON.stringify({...new_frequent_message,session_id,pid})
            })
        }else{
            console.log(new_frequent_message)
        }
        // eslint-disable-next-line
    },[new_frequent_message])

    React.useEffect(()=>{
        if(lastMessage.current){lastMessage.current.scrollIntoView({behavior: "smooth"})}
    },[messages])

    React.useEffect(()=>{
        if(lastFrequentMessage.current){lastFrequentMessage.current.scrollIntoView({behavior: "smooth"})}
    },[frequent_messages])
    
    return (
        <div className="Page">
            {is_fullpage?null:<SiteHeader/>}
        
            <div className="PlayerPage">
                
                <div className={is_fullpage?"PlayerPage-main-fullscreen":"PlayerPage-main"}>
                    {is_fullpage?null:
                        <div className="PlayerPage-main-title">
                            <span className="Video-title">{video_info?video_info.title:"..."}</span>
                            <div className="Video-discription-line">
                                <span className="Video-discription">{video_info?video_info.created_time.slice(0,video_info.created_time.indexOf('.')).replace('T',' '):"..."}</span>
                            </div>
                        </div>
                    }

                    
                    <FuntubePlayer
                        video_info={video_info}
                        is_fullpage={is_fullpage}
                        setIsFullPage={setIsFullPage}
                        ex_show_ad = {show_ad}
                        ex_setShowAd = {setShowAd}
                        logMessage = {setNewMessage}
                        logFrequentMessage = {setNewFrequentMessage}
                        ex_setPlayed={setPlayed}
                        hide_svi = {!SHOW_SVI}
                    />

                    {is_fullpage?null:
                        <div className="PlayerPage-main-body">
                            
                            <div className="Video-discription-line">
                                <span className="Video-discription">{video_info?video_info.description:"..."}</span>
                            </div>

                            <button onClick={()=>setShowAd(true)} style={DEVELOP?{}:{display:'none'}}>Show Ad</button>
                            <span style={DEVELOP?{}:{display:'none'}}>played:</span>
                            {played.map(item=>(
                                <span style={DEVELOP?{}:{display:'none'}}>{item}</span>
                            ))}
                        </div>
                    }
                </div>

                {(!SHOW_SIDEBAR||is_fullpage)?null:
                    <div className="PlayerPage-sider">
                        <div className="PlayerPage-sider-title">相关视频:</div>
                        {videos.map((item,index)=>
                            <div className="PlayerPage-video-list-item" onClick={()=>{setVideoInfo(item)}}>
                                <img alt="Video Cover" className="PlayerPage-video-list-item-img" src={item.cover_url}/>
                                <div className="PlayerPage-video-list-item-info">
                                    <span className="Video-title-small">{item.title.slice(0,10)}</span>
                                    <span className="Video-discription">Video-Type</span>
                                    <span className="Video-discription">Publish-time</span>
                                </div>
                            </div>
                        )}
                        <div className="PlayerPage-sider-title" style={DEVELOP?{}:{display:'none'}}>Event Tracking:</div>
                        {/*<div className="Video-discription-line" style={{alignSelf:"flex-start",marginTop:"20px"}}>
                            <span className="Video-discription">Seeking log continuity:</span>
                            <Switch checked={continuous_log} onChange={c=>setContinuousLog(c)} checkedChildren="ctns" unCheckedChildren="event" defaultChecked/>
                        </div>*/}
                        <div className="Log-window" style={DEVELOP?{}:{display:'none'}}>
                            {messages.map((item,index)=>
                                <span ref={lastMessage} className="Log">{item.label?JSON.stringify(item):item}</span>
                            )}
                        </div>
                        <div className="PlayerPage-sider-title" style={DEVELOP?{}:{display:'none'}}>Frequent Event Tracking:</div>
                        <div className="Log-window" style={DEVELOP?{}:{display:'none'}}>
                            {frequent_messages.map((item,index)=>
                                <span ref={lastFrequentMessage} className="Log">{item.label?JSON.stringify(item):item}</span>
                            )}
                        </div>
                    </div>
                }
            </div>
            {is_fullpage?null:<footer className="App-footer">
                <span>Copyright@2020 Prof. Zhang Qiang</span>
            </footer>}
        </div>
        
    )
}

export default PlayerPage


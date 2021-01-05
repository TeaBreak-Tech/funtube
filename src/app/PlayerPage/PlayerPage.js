import React from 'react'
import './PlayerPage.css'
import './VideoReact.css'
import './VideoToolbar.css'

//import './Antd.css'
import { Player, BigPlayButton,ControlBar } from 'video-react';
import { Chart, LineAdvance} from 'bizcharts';
import { Slider, Button, Tooltip, Switch, message, Image } from 'antd';
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

    const [ suggestions, setSuggestions ] = React.useState([])

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
                setNewMessage("visitor_id: "+data.visitor_id)
                setNewMessage("session_id: "+data.session_id)
                setNewMessage("config_num: "+data.config_num)
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

    const getSuggestionList = (vid) => {
        fetch(`/api/suggestion?vid=${vid}`)
        .then(res=>{
            if(res.status===200){
                return res.json()
            }
        })
        .then(data=>{
            if(data){
                setSuggestions(data.result)
            }
        })
    }

    React.useEffect(()=>{
        startSession(videoId)
        getSuggestionList(videoId)
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

                            <button
                                onClick={()=>{
                                    fetch("/api/logout").then(res=>{if(res.status==200)window.location.reload()})
                                }}
                                style={DEVELOP?{}:{display:'none'}}
                            >
                                重置登录信息（清除Cookie)
                            </button>

                            <span style={DEVELOP?{}:{display:'none'}}>played:</span>
                            {played.map(item=>(
                                <span style={DEVELOP?{}:{display:'none'}}>{item}</span>
                            ))}
                        </div>
                    }
                </div>

                {(!SHOW_SIDEBAR||is_fullpage)?null:
                    <div className="PlayerPage-sider">
                        <div className="PlayerPage-sider-title">点击观看:</div>
                        {DEVELOP||suggestions.map((item,index)=>
                            <div className="PlayerPage-video-list-item" onClick={()=>{window.location.href="/player/"+item.video_id+"?mode="+player_type}}>
                                <Image 
                                    alt="Video Cover" 
                                    className="PlayerPage-video-list-item-img" 
                                    src={item.cover_url}
                                    fallback="data:image/png;base64,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"
                                />
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
                <span>Funtube Video</span>
            </footer>}
        </div>
        
    )
}

export default PlayerPage


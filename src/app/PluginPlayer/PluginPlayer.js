import React from 'react'
import './PluginPlayer.css'
import { message } from 'antd';

import { useParams, useLocation } from "react-router-dom";
import { FuntubePlayer } from "../Player/Player"

const PluginPlayer = (props) => {

    const [ is_fullpage, setIsFullPage ] = React.useState(true)

    const pid = new URLSearchParams(useLocation().search).get('pid')
    //let player_type = parseInt(pageVersion)
    const video_id = new URLSearchParams(useLocation().search).get('video')
    
    let player_type = new URLSearchParams(useLocation().search).get('mode')
    let test = new URLSearchParams(useLocation().search).get('test')
    if (!player_type){player_type=1}
    else{player_type = parseInt(player_type)}
    let DEVELOP = test==='1'

    const [ video_info, setVideoInfo ] = React.useState(undefined)
    const [ show_ad, setShowAd ] = React.useState(false)
    const [ new_message, setNewMessage ] = React.useState('---- SESSION INFO ----')
    const [ new_frequent_message, setNewFrequentMessage ] = React.useState('---- FREQUENT-LOG ----')
    const [ messages, setMessages ] = React.useState([])
    const [ frequent_messages, setFrequentMessages ] = React.useState([])
    const [ videos, setVideos ] = React.useState([])
    const [ played, setPlayed ] = React.useState(["played"])
    const [ session_id, setSessionId ] = React.useState("")
    const lastMessage = React.useRef()
    const lastFrequentMessage = React.useRef()

    const startSession = () => {
        fetch('/api/session',{
            method:'POST',
            body:JSON.stringify({
                pid,
                player_type,
                client:1,
                video_id
            })
        })
        .then(res=>{ if(res.status===200){ return res.json() } })
        .then(data=>{
            if(data){
                setVideoInfo(data.videos[0])
                console.log(data.videos)
                setVideos(data.videos)
                setSessionId(data.session_id)
                setNewMessage("visitor status: "+(data.is_new_visitor?"new-visitor":"existing-visitor"))
                setNewMessage("visitor_id: "+data.visitor_id.substring(0,8)+'...')
                setNewMessage("session_id: "+data.session_id.substring(0,8)+'...')
                setNewMessage('---- EVENT LOG ----')
            }else{message.error("Please check internet connection")}
        })
    }

    React.useEffect(()=>{
        startSession()
    },[])

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
        if(DEVELOP){console.log(new_frequent_message)}
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
        <div className="PluginPlayer">
            <FuntubePlayer
                video_info={video_info}
                is_fullpage={is_fullpage}
                ex_show_ad = {show_ad}
                ex_setShowAd = {setShowAd}
                logMessage = {setNewMessage}
                logFrequentMessage = {setNewFrequentMessage}
                ex_setPlayed={setPlayed}
                disableToggleFullPage
                extra_info={{pid}}
            />
        </div>
    )
}

export default PluginPlayer
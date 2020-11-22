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
                {(!DEVELOP||is_fullpage)?null:
                    <div className="PlayerPage-sider">
                        <div className="PlayerPage-sider-title">Video List:</div>
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

export const FuntubePlayer = ({
        video_info,
        is_fullpage,
        setIsFullPage,
        ex_show_ad,
        ex_setShowAd,
        logMessage,
        logFrequentMessage,
        ex_setPlayed,
        disableToggleFullPage,
        extra_info,
        //ex_continuous_log,
        //ex_setContinuousLog,
    }) => {

    //let { pageVersion } = useParams();
    let pageVersion = new URLSearchParams(useLocation().search).get('mode')
    let test = new URLSearchParams(useLocation().search).get('test')
    if (!pageVersion){pageVersion='1'}
    //else{player_type = parseInt(player_type)}
    let show_svi = pageVersion!=='1'
    let DEVELOP = test==='1'
    

    const player = React.useRef()
    const player_container = React.useRef()

    const [ player_state, setPlayerState ] = React.useState()
    const [ playing, setPlaying ] = React.useState()
    const [ seeking, setSeeking ] = React.useState()
    const [ current_time, setCurrentTime ] = React.useState(0) //进度条上的时间（拖动时随动）
    const [ actual_current_time, setActualCurrentTime ] = React.useState(0) //实际播放时间（全自动）
    const [ player_height, setPlayerHeight ] = React.useState(590)
    const [ player_width, setPlayerWidth ] = React.useState(player_container.current?player_container.current.clientWidth:1000)
    const [ show_data, setShowData ] = React.useState(DEVELOP)
    const [ show_ad, setShowAd ] = React.useState(false)
    //const [ continuous_log, setContinuousLog ] = React.useState(false)
    const [ seek_from, setSeekFrom ] = React.useState(undefined)
    const [ SVI, setSVI ] = React.useState()
    const [ buffered, setBuffered ] = React.useState()
    const [ fullscreen, setFullScreen ] = React.useState()
    const [ volume, setVolume ] = React.useState()
    const [ playback_rate, setPlaybackRate ] = React.useState(undefined)
    //const [ video_info, setVideoInfo ] = React.useState(ex_video_info)

    const [ played, setPlayed ] = React.useState(["---"])

    const conventional_log = () => {
        let timestamp = Date.now()
        //console.log(timestamp)
        return{
            timestamp,
            video_time:player_state?player_state.currentTime:0,
            volume:player_state?player_state.muted?0:volume:volume,
            buffered:buffered,
            playback_rate:player_state?player_state.playbackRate:1,
            is_fullscreen:fullscreen,
            is_fullpage,
            player_height,
            player_width
        }
    }

    // eslint-disable-next-line
    React.useEffect(()=>{ex_setPlayed(played)},[played])

    React.useEffect(()=>{ setShowAd(ex_show_ad) },[ex_show_ad])
    React.useEffect(()=>{
        if (ex_setShowAd){ ex_setShowAd(show_ad) }
        if(player&&player_state){ if(show_ad===false){
            player.current.play()
        }else{
            player.current.pause()
        }}
        // eslint-disable-next-line
    },[show_ad])

    // eslint-disable-next-line
    //React.useEffect(()=>{ setContinuousLog(ex_continuous_log) },[ex_continuous_log])
    // eslint-disable-next-line
    //React.useEffect(()=>{ if(ex_continuous_log){ ex_setContinuousLog(continuous_log) } },[continuous_log])

    React.useEffect(()=>{
        setPlayerWidth(player_container.current?player_container.current.clientWidth:900)
        window.addEventListener('resize', ()=>{
            setPlayerWidth(player_container.current?player_container.current.clientWidth:900)
            setPlayerHeight(player_container.current?player_container.current.clientWidth*59/90:590)
        })
        if(is_fullpage){
            setPlayerWidth(player_container.current?player_container.current.clientWidth:900)
            setPlayerHeight(player_container.current?player_container.current.clientWidth*59/90:590)
        }
    },[])


    // Event: PLAY / PAUSE
    React.useEffect(()=>{
        //console.log("odanconeqwofndvfvnofeianvionrgvowerbrebr")
        if(playing!==undefined&&player_state.hasStarted){
            logMessage({
                label:playing?'PLAY':'PAUSE',
                description:'toggle play or pause',
                ...conventional_log(),
            })
        }
        // eslint-disable-next-line
    },[playing])

    //Event: SEEK
    React.useEffect(()=>{
        if(!seeking){
            if(player_state&&seek_from!==undefined){logMessage({
                label:'SEEK-TO',
                description:'seek from'+seek_from+" to "+current_time,
                ...conventional_log(),
            })}
        }
        else{setSeekFrom(player_state.currentTime)}
        // eslint-disable-next-line
    },[seeking])

    // Event: BUFFER
    /*React.useEffect(()=>{
        if(player_state&&player_state.hasStarted){logMessage({
            label:'BUFFERED',
            description:'buffered to '+buffered+'%',
            ...conventional_log(),
        })}
        // eslint-disable-next-line
    },[buffered])*/

    

    // Event: FULLPAGE
    React.useEffect(()=>{
        if(player_state&&player_state.hasStarted){logMessage({
            label:is_fullpage?'FULL-PAGE':'NORMAL-SCREEN',
            description:'toggle fullpage'+is_fullpage,
            ...conventional_log(),
        })}
        // eslint-disable-next-line
    },[is_fullpage])

    // Event: FULLSCREEN
    React.useEffect(()=>{
        if(player_state&&player_state.hasStarted){logMessage({
            label:fullscreen?'FULL-SCREEN':'NORMAL-SCREEN',
            description:'toggle fullscreen to:'+fullscreen,
            ...conventional_log(),
        })}
        // eslint-disable-next-line
    },[fullscreen])

    // Event: PLAYBACK-RATE
    React.useEffect(()=>{
        if(player_state&&player_state.hasStarted){logMessage({
            label:'SET-PLAYBACK-RATE',
            description:'set playback rate to:'+playback_rate,
            ...conventional_log(),
        })}
        // eslint-disable-next-line
    },[playback_rate])

    // Event: VOLUME
    React.useEffect(()=>{
        if(player_state&&player_state.hasStarted){logMessage({
            label:'VOLUME',
            description:'set volume to '+volume,
            ...conventional_log()
        })}
        // eslint-disable-next-line
    },[volume])
    
    React.useEffect(()=>{
        player.current.subscribeToStateChange(state=>setPlayerState(state)); 
    })

    React.useEffect(()=>{
        // 显示高能进度条进度
        if(video_info){
            let data = []
            let raw_data
            if(pageVersion==='3'){
                //raw_data = video_info.svi_raw.map(element => Math.sqrt(Math.sqrt(element)));
                //console.log(raw_data)
                /*if(disableToggleFullPage){
                    raw_data = [0, 24.75, 32.875, 41.0, 45.0, 46.0, 43.0, 46.0, 50.0, 56.0, 58.0, 48.0, 45.0, 42.0, 40.0, 35.0, 35.0, 35.0, 35.0, 35.0, 36.0, 36.0, 47.0, 58.0, 58.0, 60.0, 61.0, 62.0, 63.0, 65.0, 66.0, 64.0, 60.0, 50.0, 42.0, 48.0, 57.0, 60.0, 50.0, 55.0, 60.0, 62.0, 52.0, 71.0, 75.0, 73.0, 55.0, 59.0, 57.0, 66.0, 54.0, 65.0, 70.0, 63.0, 61.0, 55.0, 70.0, 75.0, 70.0, 80.0, 80.0, 85.0, 86.0, 87.0, 88.0, 87.0, 86.0, 80.0, 47.0, 53.0, 58.0, 49.0, 45.0, 41.5, 43.75, 46.0, 38.5, 26.75, 23.375, 21.1875, 22.09375, 23.046875, 22.0, 21.0, 0]
                }else{*/
                    raw_data = video_info.svi_raw.map(element => Math.sqrt(Math.sqrt(element)));
                /*}*/
            }else{
                //raw_data = video_info.svi_raw
                /*if(disableToggleFullPage){
                    raw_data = [0.0, 23.0, 34.0, 41.0, 52.0, 73.0, 53.0, 66.0, 59.0, 56.0, 76.0, 48.0, 34.0, 42.0, 27.0, 32.0, 24.0, 29.0, 32.0, 30.0, 27.0, 36.0, 38.0, 80.0, 36.0, 60.0, 52.0, 76.0, 51.0, 78.0, 310.0, 99.0, 49.0, 46.0, 42.0, 48.0, 57.0, 60.0, 50.0, 114.0, 60.0, 62.0, 52.0, 71.0, 81.0, 73.0, 55.0, 59.0, 57.0, 66.0, 54.0, 65.0, 70.0, 63.0, 61.0, 55.0, 138.0, 85.0, 70.0, 120.0, 117.0, 110.0, 115.0, 300.0, 122.0, 216.0, 246.0, 110.0, 47.0, 53.0, 58.0, 49.0, 45.0, 31.0, 38.0, 46.0, 29.0, 31.0, 15.0, 20.0, 19.0, 23.0, 24.0, 8.0, 8.0]
                }else{*/
                    raw_data = video_info.svi_raw
                /*}*/
            }
            var point = Math.round(player_state?(raw_data.length*current_time/player_state.duration):0)
            for(var i = 0; i <= point; i++){ data.push({x:i,y:raw_data[i],finished:'true'}) }
            for(i=point;i<raw_data.length;i++){ data.push({x:i,y:raw_data[i],finished:'false'}) }
            //console.log(data)
            setSVI(data)
        }
        
        // 加载条加载进度
        let raw_buffered = player_state?player_state.buffered?(player_state.buffered.length>0)?player_state.buffered.end(player_state.buffered.length-1):0:0:0
        raw_buffered = Math.round(player_state?(100*raw_buffered/player_state.duration):0)
        setBuffered(raw_buffered)

        if(player_state!==undefined){
            
            // 修改播放状态以便监听
            if(!player_state.paused!==playing){
                setPlaying(!player_state.paused)
            }
            setActualCurrentTime(player_state.currentTime)
        }

        // 修改全屏状态以便监听
        if(player_state!==undefined&&player_state.isFullscreen!==fullscreen){
            setFullScreen(player_state.isFullscreen)
        }
        // 修改音量状态以便监听
        if(player_state!==undefined&&player_state.volume!==volume){
            setVolume(player_state.volume)
        }

        // 修改播放速度状态以便监听
        if(player_state!==undefined&&player_state.playbackRate!==playback_rate){
            setPlaybackRate(player_state.playbackRate)
        }

        //if(player_state){console.log(player_state.played)}

        if(player_state&&player_state.played&&player_state.played.length>0){
            let list = []
            for(var j=0, len=player_state.played.length; j<len; j++ ){
                list = list.concat([player_state.played.start(j)+'~'+player_state.played.end(j)])
                //console.log(player_state.played.start(j)+'~'+player_state.played.end(j))
            }
            //console.log(list)
            setPlayed(list)
        }
        
        // eslint-disable-next-line
    },[ player_state, video_info ])

    React.useEffect(()=>{
        if(seeking){
            // 正常播放但正在拖拽进度条时log特殊事件
            logFrequentMessage({
                label:'UPDATE-SEEKING',
                description:'seeking at '+current_time.toString(),
                ...conventional_log()
            })
        }else if(playing){
            // 同步进度条播放进度
            logFrequentMessage({
                label:'UPDATE',
                description:'normal playing',
                ...conventional_log()
            })
            setCurrentTime(actual_current_time)
        }
    },[actual_current_time])

    //React.useEffect(()=>{logMessage(player_state?player_state.paused?"D-PAUSE":"D-PLAY":"")},[player_state])

    const secondToTime = time => {
        var h = Math.floor(time / 3600);
        var m = Math.floor((time / 60 % 60));
        var s = Math.floor((time % 60));
        return time = h>0?(h+":"+(m<10?'0'+m:m)+":"+(s<10?'0'+s:s)):((m<10?'0'+m:m)+":"+(s<10?'0'+s:s))
    }

    React.useEffect(()=>{
        if(player_state){
            setPlayerWidth(player_container.current?player_container.current.clientWidth:900)
            setPlayerHeight(player_container.current?player_container.current.clientWidth*59/90:590)
            if(player_state.videoHeight/player_state.videoWidth>document.body.clientHeight/document.body.clientWidth){
                setPlayerHeight(is_fullpage?document.body.clientHeight:590)
            }
        }
        // eslint-disable-next-line
    },[is_fullpage])

    

    return(
        <div className={is_fullpage?"Player-container-fullscreen":"Player-container"} ref={player_container}>
            <Player
                fluid={false}
                width={'100%'}
                height={player_height}
                ref={player}
                src={video_info?video_info.url:""}
            >
                <BigPlayButton position="center" />
                <ControlBar 
                    //disableCompletely={player_state?(!player_state.isFullscreen):true}
                    disableDefaultControls
                    autoHide
                >
                    <div className="Player-toolbar">
                        <div className="SVI-positioner">
                            <div className="SVI-contianer">
                            {show_svi?
                                <Chart animate={false} height={35} autoFit pure data={SVI} padding={[0,0,0,0]} defaultInteractions={[]}>
                                    <LineAdvance animate={false} shape="smooth" area position="x*y" color={['finished', ['#66ddff', '#cceeff']]}/>
                                </Chart>
                            :null}
                            </div>
                        </div>
                        <div className="Progress-container">
                            <div className="Progress-content">
                                <div className="Progress-loaded-unplayed" style={{flex:buffered}}>|</div>
                                <div className="Progress-unloaded" style={{flex:100-buffered}}>|</div>
                            </div>
                            <Slider
                                className="Progress-controller"
                                value={current_time}
                                max={player_state?player_state.duration:1}
                                onChange={time=>{setCurrentTime(time);setSeeking(true)}}
                                onAfterChange={()=>{player.current.seek(current_time);setSeeking(false)}}
                                tipFormatter={secondToTime}
                            />
                        </div>
                        <div className="Player-toolbar-content">
                            <div className="Player-toolbar-content-left">
                                <Button shape="circle" type="link"
                                    icon={player_state?player_state.paused?<PlayCircleOutlined style={{ fontSize: '19px', color: '#cceeff' }}/>:<PauseCircleOutlined style={{ fontSize: '19px', color: '#cceeff' }}/>:<PlayCircleOutlined style={{ fontSize: '19px', color: '#cceeff' }}/>} 
                                    onClick={()=>{player_state?player_state.paused?player.current.play():player.current.pause():player.current.play();logMessage(Date.now()+': Click start button.')}}
                                />
                                <span className="Player-toolbar-timer">{player_state?secondToTime(player_state.currentTime):"---"}|{player_state?secondToTime(player_state.duration):"---"}</span>
                            </div>
                            <div className="Player-toolbar-content-right">
                                <Tooltip title={
                                    <div className="Player-toolbar-playback-menu">
                                        <Button type="link" className="playback-choice" onClick={()=>player.current.playbackRate=0.5}>0.5X</Button>
                                        <Button type="link" className="playback-choice" onClick={()=>player.current.playbackRate=0.75}>0.75X</Button>
                                        <Button type="link" className="playback-choice" onClick={()=>player.current.playbackRate=1}>1X</Button>
                                        <Button type="link" className="playback-choice" onClick={()=>player.current.playbackRate=1.25}>1.25X</Button>
                                        <Button type="link" className="playback-choice" onClick={()=>player.current.playbackRate=1.5}>1.5X</Button>
                                        <Button type="link" className="playback-choice" onClick={()=>player.current.playbackRate=2}>2X</Button>
                                    </div>
                                }>
                                    <Button shape="circle" type="link">
                                        {player_state?player.current.playbackRate+"X":"---"}
                                    </Button>
                                </Tooltip>
                                <Tooltip title={
                                    <div className="Player-toolbar-volume-menu">
                                        <Slider className="Player-toolbar-volume-slider" vertical value={player_state?player_state.volume*100:100} onChange={value=>player.current.volume=value/100} max={100}/>
                                    </div>
                                }>
                                    <Button shape="circle" type="link"
                                        icon={player_state?player_state.muted?<SoundOutlined/>:<SoundOutlined style={{ color: '#cceeff' }}/>:<SoundOutlined style={{ color: '#cceeff' }}/>} 
                                        onClick={()=>player_state?player.current.muted=(!player.current.muted):{}}
                                    />
                                </Tooltip>
                                {DEVELOP?<Tooltip placement="topRight" title={
                                    <div className="Player-toolbar-settings-menu">
                                        Video Data：<Switch checked={show_data} onChange={checked=>setShowData(checked)} />
                                    </div>
                                }>
                                    <Button shape="circle" type="link"
                                        icon={<SettingOutlined style={{ color: '#cceeff' }}/>}
                                    />
                                </Tooltip>:null}
                                {disableToggleFullPage?null:<Button shape="circle" type="link"
                                    icon={is_fullpage?<FullscreenExitOutlined style={{ color: '#cceeff' }}/>:<FullscreenOutlined style={{ color: '#cceeff' }}/>} 
                                    onClick={()=>{setIsFullPage(!is_fullpage);if(player_state.isFullscreen){player.current.toggleFullscreen()}}}
                                />}
                                <Button shape="circle" type="link"
                                    icon={<ExpandOutlined style={{ color: '#cceeff' }}/>} 
                                    onClick={()=>{if(setIsFullPage){setIsFullPage(false)};if(player_state){player.current.toggleFullscreen()}}}
                                />
                            </div>
                        </div>
                    </div>
                </ControlBar>
            </Player>

            {show_data?<div className="Player-data-positioner">
                <div className="Player-data-contianer">
                    <span>currentTime:{player_state?player_state.currentTime:"---"}</span>
                    <span>buffered percent:{buffered}</span>
                    <span>seeking:{''+seeking}</span>
                    <span>actual_current_time:{actual_current_time}</span>
                    <span>currentTime:{player_state?player_state.currentTime:"---"}</span>
                    <span>width:{player_state?player_state.width:"---"}</span>
                    <span>player width:{player_container.current?player_container.current.clientWidth:'---'}</span>
                    <span>hasStarted:{player_state?player_state.hasStarted?'true':'false':"---"}</span>
                    <span>playing:{''+playing}</span>
                    <span>seeking:{player_state?player_state.seeking+'':"---"}</span>
                    <span>my seeking:{seeking+''}</span>
                    <span>isFullscreen:{player_state?player_state.isFullscreen+'':"---"}</span>
                    <span>pid:{''+(extra_info?extra_info.pid:"---")}</span>
                </div>
            </div>:null}

            {show_ad?<div className="Player-ad-positioner">
                <div className="Player-ad" style={{height:player_height,width:player_width}}>
                    <button className="Player-ad-close" onClick={()=>setShowAd(false)}>Close Ad</button>
                </div>
            </div>:null}

        </div>
    )
}
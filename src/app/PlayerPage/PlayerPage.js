import React from 'react'
import './PlayerPage.css'
import './VideoReact.css'
import './VideoToolbar.css'
//import './Antd.css'
import { Player, BigPlayButton,ControlBar } from 'video-react';
import { Chart, LineAdvance} from 'bizcharts';
import { Slider, Button, Tooltip, Switch } from 'antd';
import { ExpandOutlined, PlayCircleOutlined, PauseCircleOutlined, SoundOutlined, SettingOutlined, FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons';


const PlayerPage = ({is_fullscreen, setIsFullScreen}) => {

    const [ video_info, setVideoInfo ] = React.useState(undefined)

    const [ show_ad, setShowAd ] = React.useState(false)

    const [ new_message, setNewMessage ] = React.useState('Log:')

    const [ messages, setMessages ] = React.useState([])

    React.useEffect(()=>{
        setMessages(messages.concat([new_message]))
        // eslint-disable-next-line
    },[new_message])

    const videos = [
        {
            title:"Sample Video 1",
            url:"https://funtube-1259626356.cos.ap-shanghai.myqcloud.com/sample-video-1.mp4",
            cover_url:"https://funtube-1259626356.cos.ap-shanghai.myqcloud.com/sample-cover-1.png",
            svi_raw:[0,0,9272,10892.5,12498.5,13763.5,14369.5,14667.5,15399,16354,16656,16456.5,16250,16111,15936.5,15846,15556,15164,15080,14829.5,14343,13825.5,13505,13294.5,12940,12435,12033,11934.5,11873,11748,11685.5,11421.5,10871.5,10645,10430.5,10072.5,10040,9936.5,9785.5,9578.5,9133.5,8694.5,8370,8280.5,8166.5,8369.5,7938.5,6996.5,6298,5458.5,4895,4480.5,4017.5,10024.5],
        },
    ]

    if (video_info===undefined){
        setVideoInfo(videos[0])
    }
    
    return (
        <div className="PlayerPage">
            <div className={is_fullscreen?"PlayerPage-main-fullscreen":"PlayerPage-main"}>
                {is_fullscreen?null:
                    <div className="PlayerPage-main-title">
                        <span className="Video-title">{video_info?video_info.title:"..."}</span>
                        <div className="Video-discription-line">
                            <span className="Video-discription">Video-Type</span>
                            <span className="Video-discription">Publish-time</span>
                        </div>
                    </div>
                }

                
                <FuntubePlayer
                    video_info={video_info}
                    is_fullscreen={is_fullscreen}
                    setIsFullScreen={setIsFullScreen}
                    ex_show_ad = {show_ad}
                    ex_setShowAd = {setShowAd}
                    logMessage = {setNewMessage}
                />

                {is_fullscreen?null:
                    <div className="PlayerPage-main-body">
                        <button onClick={()=>setShowAd(true)}>Show Ad</button>
                        
                    </div>
                }

                {/*<p>--Status Data:--</p>
                <span>Current time: {player_state?player_state.currentTime:"---"}</span>
                <span>Paused: {player_state?player_state.paused?"true":"false":"---"}</span>
                <span>Total time: {player_state?player_state.duration:"---"}</span>
                <span>Point: {player_state?(video_info.svi_raw.length*player_state.currentTime/player_state.duration):0}</span>*/}
            </div>
            {is_fullscreen?null:
                <div className="PlayerPage-sider">
                    <div className="PlayerPage-sider-title">Video List:</div>
                    {videos.map((item,index)=>
                        <div className="PlayerPage-video-list-item" onClick={()=>{setVideoInfo(item)}}>
                            <img alt="Video Cover" className="PlayerPage-video-list-item-img" src={item.cover_url}/>
                                <div className="PlayerPage-video-list-item-info">
                                    <span className="Video-title-small">{item.title}</span>
                                    <span className="Video-discription">Video-Type</span>
                                    <span className="Video-discription">Publish-time</span>
                                </div>
                        </div>
                    )}
                    <div className="PlayerPage-sider-title">Video List:</div>
                    {messages.map((item,index)=>
                        <span className="Video-discription">{item}</span>
                    )}
                </div>
            }
        </div>
    )
}

export default PlayerPage

const FuntubePlayer = ({ video_info, is_fullscreen, setIsFullScreen, ex_show_ad, ex_setShowAd, logMessage }) => {

    const player = React.useRef()
    const player_container = React.useRef()

    const [ player_state, setPlayerState ] = React.useState()
    const [ playing, setPlaying ] = React.useState()
    const [ player_height, setPlayerHeight ] = React.useState(590)
    const [ player_width, setPlayerWidth ] = React.useState(player_container.current?player_container.current.clientWidth:1000)

    React.useEffect(()=>{
        setPlayerWidth(player_container.current?player_container.current.clientWidth:900)
        window.addEventListener('resize', ()=>{
            setPlayerWidth(player_container.current?player_container.current.clientWidth:900)
            setPlayerHeight(player_container.current?player_container.current.clientWidth*59/90:590)
        })
    },[])

    React.useEffect(()=>{
        if(playing!==undefined&&player_state.hasStarted){
            logMessage(Date.now()+': '+(playing?'PLAY':'PAUSE'))
        }
        // eslint-disable-next-line
    },[playing])

    const [ SVI, setSVI ] = React.useState()
    const [ buffered, setBuffered ] = React.useState()
    React.useEffect(()=>{
        player.current.subscribeToStateChange(state=>setPlayerState(state)); 
    })

    React.useEffect(()=>{
        // 显示高能进度条进度
        let data = []
        let raw_data = video_info.svi_raw
        var point = Math.round(player_state?(raw_data.length*player_state.currentTime/player_state.duration):0)
        for(var i = 0; i <= point; i++){ data.push({x:i,y:raw_data[i],finished:'true'}) }
        for(i=point;i<raw_data.length;i++){ data.push({x:i,y:raw_data[i],finished:'false'}) }
        setSVI(data)
        // 加载条加载进度
        let raw_buffered = player_state?player_state.buffered?(player_state.buffered.length>0)?player_state.buffered.end(player_state.buffered.length-1):0:0:0
        raw_buffered = Math.round(player_state?(100*raw_buffered/player_state.duration):0)
        setBuffered(raw_buffered)
        // 修改状态
        if(player_state!==undefined&&!player_state.paused!==playing){
            setPlaying(!player_state.paused)
        }
        // eslint-disable-next-line
    },[ player_state, video_info ])

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
                setPlayerHeight(is_fullscreen?document.body.clientHeight:590)
            }
        }
        // eslint-disable-next-line
    },[is_fullscreen])

    const [ show_data, setShowData ] = React.useState(true)
    const [ show_ad, setShowAd ] = React.useState(false)

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

    return(
        <div className={is_fullscreen?"Player-container-fullscreen":"Player-container"} ref={player_container}>
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
                            <Chart height={35} autoFit pure data={SVI} padding={[0,0,0,0]} defaultInteractions={[]}>
                                <LineAdvance shape="smooth" area position="x*y" color={['finished', ['#66ddff', '#cceeff']]}/>
                            </Chart>
                            </div>
                        </div>
                        <div className="Progress-container">
                            <div className="Progress-content">
                                <div className="Progress-loaded-unplayed" style={{flex:buffered}}>|</div>
                                <div className="Progress-unloaded" style={{flex:100-buffered}}>|</div>
                            </div>
                            <Slider className="Progress-controller" value={player_state?player_state.currentTime:0} max={player_state?player_state.duration:1} onChange={time=>{player.current.seek(time)}}/>
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
                                    <Button shape="circle" type="link" onClick={()=>player_state?player.current.toggleFullscreen():{}}>
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
                                <Tooltip placement="topRight" title={
                                    <div className="Player-toolbar-settings-menu">
                                        Video Data：<Switch checked={show_data} onChange={checked=>setShowData(checked)} />
                                    </div>
                                }>
                                    <Button shape="circle" type="link"
                                        icon={<SettingOutlined style={{ color: '#cceeff' }}/>} 
                                        onClick={()=>player_state?player.current.muted=(!player.current.muted):{}}
                                    />
                                </Tooltip>
                                <Button shape="circle" type="link"
                                    icon={is_fullscreen?<FullscreenExitOutlined style={{ color: '#cceeff' }}/>:<FullscreenOutlined style={{ color: '#cceeff' }}/>} 
                                    onClick={()=>setIsFullScreen(!is_fullscreen)}
                                />
                                <Button shape="circle" type="link"
                                    icon={<ExpandOutlined style={{ color: '#cceeff' }}/>} 
                                    onClick={()=>{setIsFullScreen(false);if(player_state){player.current.toggleFullscreen()}}}
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
                    <span>videoWidth:{player_state?player_state.videoWidth:"---"}</span>
                    <span>videoHeight:{player_state?player_state.videoHeight:"---"}</span>
                    <span>currentTime:{player_state?player_state.currentTime:"---"}</span>
                    <span>width:{player_state?player_state.width:"---"}</span>
                    <span>player width:{player_container.current?player_container.current.clientWidth:'---'}</span>
                    <span>hasStarted:{player_state?player_state.hasStarted?'true':'false':"---"}</span>
                    <span>playing:{''+playing}</span>
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
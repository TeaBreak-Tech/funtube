import React, { useEffect } from 'react'
import './Player.css'
import './VideoReact.css'
import './VideoToolbar.css'

//import './Antd.css'
import { Player, BigPlayButton,ControlBar } from 'video-react';
import { Chart, LineAdvance} from 'bizcharts';
import { Slider, Button, Tooltip, Switch } from 'antd';
import { ExpandOutlined, PlayCircleOutlined, PauseCircleOutlined, SoundOutlined, SettingOutlined, FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons';
import { useLocation } from "react-router-dom";
import { play } from 'video-react/lib/actions/player';

export const HEIGHT = 460
export const WIDTH = 680

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
    hide_svi,
    //ex_continuous_log,
    //ex_setContinuousLog,
}) => {

    //let { pageVersion } = useParams();
    let pageVersion = new URLSearchParams(useLocation().search).get('mode')
    let test = new URLSearchParams(useLocation().search).get('test')
    if (!pageVersion){pageVersion='1'}
    //else{player_type = parseInt(player_type)}
    let show_svi = false//pageVersion!=='1'&&!hide_svi
    let DEVELOP = test==='1'


    const player = React.useRef()
    const player_container = React.useRef()

    const [ player_state, setPlayerState ] = React.useState()
    const [ playing, setPlaying ] = React.useState()
    const [ seeking, setSeeking ] = React.useState()
    const [ current_time, setCurrentTime ] = React.useState(0) //进度条上的时间（拖动时随动），播放广告时则代表广告进度
    const [ actual_current_time, setActualCurrentTime ] = React.useState(0) //实际播放时间（全自动），在播放广告的时候停止更新
    const [ player_height, setPlayerHeight ] = React.useState(HEIGHT)
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
    const [ ads, setAds ] = React.useState([])
    const [ source, setSource ] = React.useState()
    const [ playing_ad, setPlayingAd ] = React.useState(false)
    const [ auto_play, setAutoPlay] = React.useState(false)
    const [ ad_link, setAdLink ] = React.useState("https://www.tea-break.cn")
    const [ count_down, setCountDown ] = React.useState(0)
    const [ ad_id, setAdId ] = React.useState(null)

    const [ ad_toggling, setAdToggling ] = React.useState(false) // 单纯为了解决广告播放前后的 PAUSE/PLAY 误报

    const [ progress_remember, setProgressRemember ] = React.useState(0)


    const [ played, setPlayed ] = React.useState(["---"])

    const conventional_log = () => {
        let timestamp = Date.now()
        //console.log(timestamp)
        return{
            timestamp,
            video_info:playing_ad?("ad_"+ad_id):("video_"+video_info.video_id),
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


    React.useEffect(()=>{
        if(video_info){
            let _ads = []
            for (let i in video_info.ads){
                _ads.push({...video_info.ads[i],visited:false})
            }
            setAds(_ads)
            setSource(video_info.url)
        }
        console.log(video_info)
    },[video_info])


    const changeSource = (name) => {
        setSource(name)
        player.current.load();
    }

    React.useEffect(()=>{
        //if(DEVELOP)console.log("source changed to",source)
        
        
    },[source])

    React.useEffect(()=>{
        //console.log("playing_ad changed to",playing_ad)
        if(playing_ad){
            setAutoPlay(true)
        }
    },[playing_ad])

    // eslint-disable-next-line
    //React.useEffect(()=>{ setContinuousLog(ex_continuous_log) },[ex_continuous_log])
    // eslint-disable-next-line
    //React.useEffect(()=>{ if(ex_continuous_log){ ex_setContinuousLog(continuous_log) } },[continuous_log])

    React.useEffect(()=>{
        setPlayerWidth(player_container.current?player_container.current.clientWidth:WIDTH)
        window.addEventListener('resize', ()=>{
            setPlayerWidth(player_container.current?player_container.current.clientWidth:WIDTH)
            setPlayerHeight(player_container.current?player_container.current.clientWidth*HEIGHT/WIDTH:HEIGHT)
        })
        if(is_fullpage){
            setPlayerWidth(player_container.current?player_container.current.clientWidth:WIDTH)
            setPlayerHeight(player_container.current?player_container.current.clientWidth*HEIGHT/WIDTH:HEIGHT)
        }
    },[])


    // Event: PLAY / PAUSE
    React.useEffect(()=>{
        //if(DEVELOP)console.log("playing changed to",playing)
        //console.log("odanconeqwofndvfvnofeianvionrgvowerbrebr")
        if(playing!==undefined
            && player_state.hasStarted // 为了解决视频开始播放前的一次 PAUSE 误报
            && !ad_toggling // 广告与视频切换的 Play/Pause 不生成报告 （解决误报）
        ){
            logMessage({
                label:playing?'PLAY':'PAUSE',
                description:'toggle play or pause',
                ...conventional_log(),
            })
        }

        
        
        // eslint-disable-next-line
    },[playing])

    //React.useEffect(()=>console.log("ad_toggling changed to",ad_toggling),[ad_toggling])

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

    React.useEffect(()=>{
        if(count_down!==0){
            setTimeout(()=>{
                setCountDown(count_down-1)
            },1000)
        }
    },[count_down])

    React.useEffect(()=>{
        if(ad_toggling===false&&video_info&&source===video_info.url){
            player.current.seek(progress_remember)
            //player.current.play()
        }
    },[ad_toggling])



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



    // 时刻调用内容

    React.useEffect(()=>{
        // 显示高能进度条进度
        if(video_info){
            let data = []
            let raw_data
            if(video_info.svi_raw){
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
            }else{
                raw_data = []
            }
            var point = Math.round(player_state?(raw_data.length*current_time/player_state.duration):0)
            for(var i = 0; i <= point; i++){ data.push({x:i,y:raw_data[i],finished:'true'}) }
            for(i=point;i<raw_data.length;i++){ data.push({x:i,y:raw_data[i],finished:'false'}) }
            //console.log(data)
            setSVI(data)
        }
        
        // 获取加载进度 buffered
        let raw_buffered = player_state?player_state.buffered?(player_state.buffered.length>0)?player_state.buffered.end(player_state.buffered.length-1):0:0:0
        raw_buffered = Math.round(player_state?(100*raw_buffered/player_state.duration):0)
        setBuffered(raw_buffered)

        

        // 获取视频播放进度 actual_current_time
        if(player_state!==undefined){

            // 这是广告切换回视频之后第一个有反应的地方，在这里seek到历史播放位置
            if(player_state.hasStarted&&ad_toggling&&video_info&&source===video_info.url){
                player.current.seek(progress_remember)
                //player.current.play()
            }
            
            // 顺便修改播放状态 playing 以便监听 （ 广告播放也属于 Playing ）
            if(!player_state.paused!==playing){
                setPlaying(!player_state.paused)
                
                

                console.log("player_state.paused changed to",player_state?player_state.paused:player_state)
                if(!player_state.paused && ad_toggling){
                    setAdToggling(false) // 用 AdFinishSwitch 忽略广告播放之后的第一次 pause
                } 
            }

            // 只有在播放正式视频时才会更新视频播放进度
            if(!playing_ad){
                setActualCurrentTime(player_state.currentTime)
            }else{
                // 播放广告时，直接将广告播放进度赋值给进度条进度（造成不可拖动的效果）
                setCurrentTime(player_state.currentTime)
                // 并且直接汇报广告update事件
                logFrequentMessage({
                    label:'AD_UPDATE',
                    description:'advertisement playing',
                    ...conventional_log()
                })
                // 广告播放结束之后
                if(player_state.ended){
                    setAdToggling(true) // 防止 Play/Pause 误报
                    changeSource(video_info.url)
                    setPlayingAd(false)
                }
            }
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



    // 视频进度改变时调用内容

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
        console.log(actual_current_time)
        if (video_info){
            let _ads = ads
            for (let i in _ads){
                console.log(_ads[i].time - actual_current_time)
                if (-0.5 < (_ads[i].time - actual_current_time) && (_ads[i].time - actual_current_time) < 0.5){ // 对比广告时间
                    if(!_ads[i].visited){
                        // 播放广告
                        _ads[i].visited = true
                        setAds(_ads)
                        //alert("Ad!")
                        changeSource(_ads[i].url) 
                        setPlayingAd(true)
                        setAdLink(_ads[i].link||"https://www.tea-break.cn")
                        setAdId(_ads[i].ad_id)
                        setCountDown(5)
                        setAdToggling(true) // 防止 Play/Pause 误报
                        setProgressRemember(actual_current_time)
                    }
                }
            }
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
            setPlayerWidth(player_container.current?player_container.current.clientWidth:WIDTH)
            setPlayerHeight(player_container.current?player_container.current.clientWidth*HEIGHT/WIDTH:HEIGHT)
            if(player_state.videoHeight/player_state.videoWidth>document.body.clientHeight/document.body.clientWidth){
                setPlayerHeight(is_fullpage?document.body.clientHeight:HEIGHT)
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
                src={source}
                autoPlay={auto_play}
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

                            <div style={{position:"absolute", width:player_width}}>
                                <div style={{position:"relative",zIndex:1,width:"100%"}}>
                                    {ads.map(({time,visited})=>visited||(
                                        <div style={{
                                            width:"3px",
                                            height:"4px",
                                            backgroundColor:"orange",
                                            position:"absolute",
                                            fontSize:2,
                                            color:"transparent",
                                            left:(100*time/(player_state?player_state.duration:1))+"%"
                                        }} />
                                    ))}
                                </div>
                            </div>

                            
                            <Slider
                                className="Progress-controller"
                                value={current_time}
                                max={player_state?player_state.duration:1}
                                onChange={time=>{setCurrentTime(time);setSeeking(true)}}
                                onAfterChange={()=>{player.current.seek(current_time);setSeeking(false)}}
                                tipFormatter={secondToTime}
                                disabled={playing_ad}
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
                                    onClick={()=>{if(setIsFullPage){setIsFullPage(false)};if(player_state){
                                        player.current.toggleFullscreen()
                                        setPlayerHeight(HEIGHT)
                                    }}}
                                />
                            </div>
                        </div>
                    </div>
                </ControlBar>
            </Player>

            {show_data?<div className="Player-data-positioner">
                <div className="Player-data-contianer">
                    <span>native_currentTime:{player_state?player_state.currentTime:"---"}</span>
                    <span>currentTime:{player_state?player_state.currentTime:"---"}</span>
                    <span>actual_current_time:{actual_current_time}</span>
                    <span>buffered percent:{buffered}</span>
                    <span>current.player_width:{player_container.current?player_container.current.clientWidth:'---'}</span>
                    <span>current.player_height:{player_container.current?player_container.current.clientHeight:'---'}</span>
                    <span>player_height:{player_height}</span>
                    <span>hasStarted:{player_state?player_state.hasStarted?'true':'false':"---"}</span>
                    <span>playing:{''+playing}</span>
                    <span>native_seeking:{player_state?player_state.seeking+'':"---"}</span>
                    <span>my_seeking:{seeking+''}</span>
                    <span>pid:{''+(extra_info?extra_info.pid:"---")}</span>
                    <span>ad_toggling:{""+ad_toggling}</span>
                </div>
            </div>:null}

            {/* 在 playing_ad 的时候显示此蒙板 */}
            {playing_ad?<div className="Player-ad-positioner">
                <div
                    className="Player-ad"
                    style={{height:player_height,width:player_width}}
                    onClick={()=>{
                        logMessage({
                            label:'AD-CLICK',
                            description:'ad clicked and opened the url',
                            ...conventional_log(),
                        })
                        window.open(ad_link);
                    }}
                >
                    <button 
                        style={{zIndex:2,pointerEvents:"painted"}}
                        className="Player-ad-close" 
                        onClick={(e)=>{
                            //alert(video_info.url)
                            if(count_down===0){
                                changeSource(video_info.url)
                                setPlayingAd(false)
                                setAdToggling(true)
                                logMessage({
                                    label:'SKIP-AD',
                                    description:'skip ad at:'+current_time,
                                    ...conventional_log(),
                                })
                            }
                            e.stopPropagation();
                        }}
                    >
                        {(count_down>0)&&(count_down+"秒后")}跳过广告
                    </button>
                </div>
            </div>:null}

        </div>
    )
}

export default FuntubePlayer
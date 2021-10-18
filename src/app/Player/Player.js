import React, { useEffect } from 'react'
import './Player.css'
import './VideoReact.css'
import './VideoToolbar.css'

//import './Antd.css'
import { Player, BigPlayButton,ControlBar } from 'video-react';
import { Chart, LineAdvance} from 'bizcharts';
import { Slider, Button, Tooltip, Switch, message } from 'antd';
import { ExpandOutlined, PlayCircleOutlined, PauseCircleOutlined, SoundOutlined, SettingOutlined, FullscreenOutlined, FullscreenExitOutlined, SmileOutlined, FrownOutlined, LikeOutlined, PoundCircleOutlined } from '@ant-design/icons';
import { useLocation } from "react-router-dom";

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
    //ex_continuous_log,
    //ex_setContinuousLog,
}) => {

    let voting_default = new URLSearchParams(useLocation().search).get('vote')
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
    const [ fullscreen, setFullScreen ] = React.useState(false)
    const [ volume, setVolume ] = React.useState()
    const [ playback_rate, setPlaybackRate ] = React.useState(undefined)
    //const [ video_info, setVideoInfo ] = React.useState(ex_video_info)
    const [ ads, setAds ] = React.useState([])
    const [ source, setSource ] = React.useState()
    const [ playing_ad, setPlayingAd ] = React.useState(false)
    const [ auto_play, setAutoPlay] = React.useState(false)
    const [ ad_link, setAdLink ] = React.useState("https://midroll.funtubevideo.cn")
    const [ count_down, setCountDown ] = React.useState(0)
    const [ ad_id, setAdId ] = React.useState(null)

    const [ ad_toggling, setAdToggling ] = React.useState(false) // 单纯为了解决广告播放前后的 PAUSE/PLAY 误报

    const [ progress_remember, setProgressRemember ] = React.useState(0)


    const [ played, setPlayed ] = React.useState(["---"])

    // 投票弹幕
    const [ voting, setVoting ] = React.useState(false)
    const [ voted, setVoted ] = React.useState(undefined)

    // 暂时用常量代替
    const [ voting_data, setVoting_data ] = React.useState(undefined)
    const [ voting_data_set, setVoting_data_set ] = React.useState(
        [
            {
                question: new URLSearchParams(useLocation().search).get('question'),
                popOut_time: parseInt(new URLSearchParams(useLocation().search).get('popTime_vote')),
                options: new URLSearchParams(useLocation().search).get('choices')
            },
        ]
    )
    React.useEffect(()=>{
        console.log(voting_data_set)
        console.log("like:", giveData)
    },[voting_data_set])
    
    // 点赞
    const [ giveLike, setGiveLike ] = React.useState(false)
    const [ given, setGiven ] = React.useState(false)
    const [ thumbs, setThumbs ] = React.useState(undefined)
    const [ coin, setCoin ] = React.useState(undefined)
    const [ giveData, setGiveData ] = React.useState({
        popOut_time: parseInt(new URLSearchParams(useLocation().search).get("popTime_like"))
    })

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
        if(fullscreen){
            setPlayerWidth(window.screen.availWidth)
            setPlayerHeight(window.screen.availHeight)
        }
    },[is_fullpage, fullscreen])


    // Event: PLAY / PAUSE
    React.useEffect(()=>{
        //if(DEVELOP)console.log("playing changed to",playing)
        //console.log("odanconeqwofndvfvnofeianvionrgvowerbrebr")
        if(playing!==undefined
            && player_state.hasStarted // 为了解决视频开始播放前的一次 PAUSE 误报
            && !ad_toggling // 广告与视频切换的 Play/Pause 不生成报告 （解决误报）
            && !playing_ad // 广告播放过程中默认不会暂停播放，以此排除掉全屏点开广告链接时的暂停播放误报
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
        
        setTimeout(()=>{
            if(count_down!==0 && playing_ad && playing && !ad_toggling){
                setCountDown(count_down-1)
            }
        },1000)
        
    },[count_down, playing])

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

    // Event: VOTING
    React.useEffect(()=>{
        if(player_state&&player_state.hasStarted){logMessage({
            label:'VOTING',
            description:'choose choice '+voted+' in question '+voting_data.question,
            ...conventional_log()
        })}
        // eslint-disable-next-line
    },[voted])

    // Event: GIVING LIKE
    React.useEffect(()=>{
        console.log("thumbs and coin:",thumbs,coin)
        if(player_state&&player_state.hasStarted){logMessage({
            label:'LIKE',
            description:`give ${thumbs?"thumbs-up":null}${coin?" and coin":null}`,
            ...conventional_log()
        })}
        // eslint-disable-next-line
    },[given])

    React.useEffect(()=>{
        player.current.subscribeToStateChange(state=>setPlayerState(state)); 
    })

    const [ ad_clicked, setAdClicked ] = React.useState();
    React.useEffect(()=>{
        if(ad_clicked){
            logMessage({
                label:'AD-CLICK',
                description:'ad clicked and opened the url',
                ...conventional_log(),
            })
            window.open(ad_link); 
        }
    },[ad_clicked])

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
                // 如果广告播放被暂停（全屏下点击），则恢复播放并进入广告链接
                if (player_state.paused && !ad_toggling && !player_state.ended){
                    player.current.play()
                    // 注：快速切换播放暂停会造成退出全屏的效果。
                    setAdClicked(true);// 打开广告链接
                }else{
                    setAdClicked(false);
                }
                // 广告播放结束之后
                if(player_state.ended){// 切换回原本的视频
                    setAdToggling(true) // 防止 Play/Pause 误报
                    changeSource(video_info.url)
                    setPlayingAd(false)
                }
            }
        }

        // 修改全屏状态以便监听
        // if(player_state!==undefined&&player_state.isFullscreen!==fullscreen){
        //     setFullScreen(player_state.isFullscreen)
        // }
        
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
                // console.log(_ads[i].time - actual_current_time)
                if (-0.5 < (_ads[i].time - actual_current_time) && (_ads[i].time - actual_current_time) < 0.5){ // 对比广告时间
                    if(!_ads[i].visited){
                        // 播放广告
                        //alert("Ad!")
                        console.log(_ads[i])
                        if (_ads[i].src!=="auto"){
                            changeSource(_ads[i].src) 
                            setPlayingAd(true)
                            setAdLink(_ads[i].href||"https://midroll.funtubevideo.cn")
                            setAdId(_ads[i].ad_id)
                            setCountDown(5)
                            setAdToggling(true) // 防止 Play/Pause 误报
                            setProgressRemember(actual_current_time)
                            _ads[i].visited = true
                            setAds(_ads)
                        }else{
                            // 向服务器请求广告方案
                            player.current.pause()
                            console.log("fetching ad plan")
                            fetch('/api/ad_plan')
                            .then(res=>{if(res.status===200){
                                return res.json()
                            }}).then(data=>{
                                changeSource(data.src)
                                setPlayingAd(true)
                                setAdLink(data.href)
                                setAdId(data.ad_id)
                                setCountDown(5)
                                setAdToggling(true) // 防止 Play/Pause 误报
                                setProgressRemember(actual_current_time)
                                _ads[i].visited = true
                                setAds(_ads)
                            })
                        }
                    }
                }
            }
        }
    },[actual_current_time])

    // 弹幕
    React.useEffect(()=>{
        // 对比播放时间与投票弹幕的时间
        if (video_info && voting_data_set && voting_default==1){
            for (let i in voting_data_set){
                let voting_time = (voting_data_set[i].popOut_time)/1000 // 毫秒换算成秒
                if (-0.5 < (voting_time - actual_current_time) && (voting_time - actual_current_time) < 0.5){
                    setVoting_data(voting_data_set[i])
                    setVoting(true)
                }
            }
        }
        // 对比播放时间与点赞投币弹幕的时间
        if (video_info && giveData && voting_default==1){
            let give_time = (giveData.popOut_time)/1000 // 毫秒换算成秒
            if (-0.5 < (give_time - actual_current_time) && (give_time - actual_current_time) < 0.5){
                setGiveLike(true)
            }
            if (-5.5 < (give_time - actual_current_time) && (give_time - actual_current_time) < -4.5){
                setGiven(true)
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
                <BigPlayButton position={playing_ad?"top-left":"center"} />
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
                                    {/* 小黄点 */}
                                    {/* {ads.map(({time,visited})=>visited||(
                                        <div style={{
                                            width:"3px",
                                            height:"4px",
                                            backgroundColor:"orange",
                                            position:"absolute",
                                            fontSize:2,
                                            color:"transparent",
                                            left:(time/(player_state?player_state.duration:1))*player_width
                                        }} />
                                    ))} */}
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
                                    onClick={()=>{
                                        if(setIsFullPage){setIsFullPage(false)};
                                        if(player_state){
                                            setFullScreen(!fullscreen)
                                            fullscreen?document.webkitCancelFullScreen():document.querySelector(".Player-container").webkitRequestFullScreen()

                                            // setPlayerHeight(HEIGHT)
                                            // player.current.toggleFullscreen()
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
                    <span>playing_ad:{""+playing_ad}</span>
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

            {voting&&voting_data?
                <div className={voted?"voting-card voting-card-fadeOut":"voting-card"}>
                    <div className="voting-topic"><b>{voting_data.question}</b></div>
                    <div className="voting-choices">
                        {voting_data.options.split(" ").map(item=>{
                            return(
                                <div style={{display:"flex",flexDirection:"row",justifyContent:"center"}}>
                                    {/* {voted?
                                        <div className="voted-shell">
                                            <div style={{
                                                    width:item.distrib, 
                                                    height:"100%",
                                                    backgroundColor:"bisque",
                                                    display:"flex",
                                                    flexDirection:"column",
                                                    justifyContent:"center",
                                                    borderRadius:"14px"

                                            }}>
                                                {item.current_popularity}
                                            </div>
                                        </div>
                                    : */}
                                        <div className="voting-button" >
                                            <button 
                                                style={{width:"100%",height:"100%",backgroundColor:item==voted?`orange`:"white"}}
                                                type="primary"
                                                onClick={()=>{if(voted==undefined){
                                                    setVoted(item);message.success("投票成功!",1)
                                                }}}
                                            >{item}</button>
                                        </div>
                                    {/* } */}
                                </div>
                            )
                        })}
                    </div>
                </div>
            :null}

            {giveLike?
                <div className={given?"like-card voting-card-fadeOut":"like-card"}>
                    <div className="giveLike-options">
                        <LikeOutlined
                            style={{fontSize:"x-large", color:thumbs?"orange":"white"}} 
                            onClick={()=>{
                                setThumbs(true); message.success("点赞成功!",1)
                            }}
                        />
                        <PoundCircleOutlined
                            style={{fontSize:"x-large", color:coin?"orange":"white"}} 
                            onClick={()=>{
                                setCoin(true); message.success("投币成功!",1)
                            }}
                        />
                    </div>
                </div>    
            :null}

        </div>
    )
}

export default FuntubePlayer
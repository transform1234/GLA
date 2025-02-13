org.ekstep.contentrenderer.baseLauncher.extend({
    _time: undefined,
    _getStatusTime: undefined,
    messages: {
        noInternetConnection: "Internet not available. Please connect and try again.",
        unsupportedVideo: "Video URL not accessible"
    },
    currentTime: 1,
    totalDuration: 0,
    videoPlayer: undefined,
    stageId: undefined,
    bufferToAchieveProgress:10, //  percentage
    heartBeatData: {},
    playerInfo:undefined,
    enableHeartBeatEvent: false,
    _constants: {
        mimeType: ["video/x-youtube"],
        events: {
            launchEvent: "renderer:launch:youtube"
        }
    },
    initLauncher: function () {
        EkstepRendererAPI.addEventListener("renderer:launch:youtube", this.start, this);
        EkstepRendererAPI.addEventListener("renderer:overlay:mute", this.onOverlayAudioMute, this);
        EkstepRendererAPI.addEventListener("renderer:overlay:unmute", this.onOverlayAudioUnmute, this);
    },
    start: function () {
        this._super();
        var data = _.clone(content);
        var instance = this;
        this.heartBeatData.stageId = 'youtubestage';
        var globalConfigObj = EkstepRendererAPI.getGlobalConfig();
        var youtubeId= this.getYouTubeID(data.artifactUrl);
        this.configOverlay();
        var iframe = document.createElement('iframe');
        var origin = globalConfigObj.context.origin || window.origin;
        iframe.type = 'text/html';
        iframe.width = "100%";
        iframe.height = "100%";
        iframe.src = origin + '/content/preview/youtube.html?autoplay=1&rel=0&origin=' + origin + '&id='+youtubeId;
        iframe.id = "org.ekstep.youtuberenderer";
        iframe.setAttribute("allowfullscreen",'')
        console.log(iframe.src);
        document.getElementById("gameArea").insertBefore(iframe, document.getElementById("gameArea").childNodes[0])
        jQuery("#gameArea").css({
            left: "0px",
            top: "0px",
            width: "100%",
            height: "100%",
            marginTop: 0,
            marginLeft: 0
        })
        jQuery("#loading").hide()
        window.addEventListener('message', function(event){
            if(event.type === 'message' && typeof event.data !== 'object'){
                if(event.data == "pause.youtube") {
                    instance.pauseYoutube();
                    return;
                }
                var eventData = JSON.parse(event.data)
                switch (eventData.eid) {
                    case 'paly':
                        instance.play(eventData);
                        break;
                    case 'pause':
                        instance.pause(eventData);
                        break;
                    case 'seeked':
                        instance.seeked(eventData);
                        break;
                    case 'end':
                        instance.ended(eventData);
                        break;
                    case 'qualityChange':
                        instance.onQualityChange(eventData.resolutionVal);
                        break;
                    case 'status':
                        instance.updatePlayerInfo(eventData);
                        break;
                }
            }
        });
         // Navigation template to load
         var obj = {"tempName": ""};
         EkstepRendererAPI.dispatchEvent("renderer:navigation:load", obj);
         setTimeout(function() {
            jQuery('custom-previous-navigation').hide();
            jQuery('custom-next-navigation').hide();
        }, 100);
        
    },
    pauseYoutube: function () {
        var instance  = this;
        var iframes = window.document.getElementsByTagName("iframe");
        if(iframes.length > 0) {
            iframes[0].contentWindow.postMessage("pause.youtube","*");
        }
    },
    logTelemetry: function (type, eksData, eid, options) {
        EkstepRendererAPI.getTelemetryService().interact(type || 'TOUCH', "", "", eksData, eid, options);
    },
    updatePlayerInfo: function (eventData) {
        this.playerInfo  = eventData.info;
    },
    replay: function () {
        if (this.sleepMode) return;
        EkstepRendererAPI.dispatchEvent('renderer:overlay:unmute');
        this.start();
    },
    configOverlay: function () {
        setTimeout(function () {
            EkstepRendererAPI.dispatchEvent("renderer:overlay:show");
            EkstepRendererAPI.dispatchEvent("renderer:next:hide");
            EkstepRendererAPI.dispatchEvent('renderer:stagereload:hide');
            EkstepRendererAPI.dispatchEvent("renderer:previous:hide");
        }, 100);
    },
    play: function (eventData) {
        this.totalDuration = eventData.duration;
        this.playerInfo  = eventData.info;
        if (eventData.time == 0) {
            EkstepRendererAPI.getTelemetryService().navigate('youtubestage', 'youtubestage', {
                "duration": (Date.now() / 1000) - window.PLAYER_STAGE_START_TIME
            });
        }
        var instance = this;
        instance.heartBeatEvent(true);
        instance.getStatus(true);
        instance.startTime = Date.now()/1000;
        instance.progressTimer(true);
        instance.logTelemetry('TOUCH', {
            stageId: 'youtubestage',
            subtype: "PLAY",
            values: [{
                time: eventData.time
            }]
        })
    },
    pause: function (eventData) {
        this.playerInfo  = eventData.info;        
        var instance = this;
        instance.heartBeatEvent(false);
        instance.getStatus(false)
        instance.progressTimer(false);
        instance.logTelemetry('TOUCH', {
            stageId: 'youtubestage',
            subtype: "PAUSE",
            values: [{
                time: eventData.time
            }]
        })
    },
    ended: function (eventData) {
        this.playerInfo  = eventData.info;
        var instance = this;
        instance.progressTimer(false);
        instance.getStatus(false)
        instance.logTelemetry('END', {
            stageId: 'youtubestage',
            subtype: "STOP"
        });
        EkstepRendererAPI.dispatchEvent('renderer:content:end');
    },
    seeked: function (eventData) {
        this.playerInfo  = eventData.info;
        var instance = this;
        instance.logTelemetry('TOUCH', {
            stageId: 'youtubestage',
            subtype: "DRAG",
            values: [{
                time: eventData.time
            }]
        })
    },
    onQualityChange: function(resolutionVal){
        this.logTelemetry('TOUCH', {
            stageId: 'videostage',
            subtype: "CHANGE"
        }, "", {
            context: {
                cdata: [{
                    type: 'Feature',
                    id: 'video:resolutionChange'
                }, {
                    type: 'Task',
                    id: 'SB-13358',
                }, {
                    type: 'Resolution',
                    id: resolutionVal
                },{
                    type: 'ResolutionChange',
                    id: "Auto"
                }]
            }
        })
    },
    progressTimer: function (flag) {
        var instance = this;
        if (flag) {
            instance.progressTime = setInterval(function (e) {
                instance.currentTime = instance.currentTime + 1;
            }, 1000);
        }
        if (!flag) {
            clearInterval(instance.progressTime);
        }
    },
    contentProgress: function () {
        var progress = this.progres(this.currentTime, this.totalDuration);
        return progress === 0 ? 1 : progress;  // setting default value of progress=1 when video opened
    },
    setExpectedLengthCovergae: function (videoLength) {
        return Number(videoLength) - ((Number(this.bufferToAchieveProgress) / 100) * Number(videoLength));
    },
    getStatus: function (flag) {
        var instance = this
        if (flag) {
            instance._getStatusTime = setInterval(function () {
                var iframes = window.document.getElementsByTagName("iframe")
                if (iframes.length > 0) {
                    iframes[0].contentWindow.postMessage("status.youtube", "*")
                }
            }, 10000)
        } else
        if (!flag) {
            clearInterval(instance._getStatusTime)
        }
    },
    contentPlaySummary: function () {
        var videoLength = this.playerInfo.duration || {}
        var videoCurrentRefTime = this.playerInfo.mediaReferenceTime
        var currentVisitedLength = (Date.now() / 1000) - instance.startTime
        var playSummary =  [
            {
              "totallength": videoLength
            },
            {
              "visitedlength": videoCurrentRefTime
            },
            {
              "visitedcontentend": (videoCurrentRefTime >= this.setExpectedLengthCovergae(videoLength)) ? true : false
            },
            {
              "totalseekedlength": Math.max(0,(videoCurrentRefTime - currentVisitedLength)) // when no seek value is in negetive
            }
        ]
        return playSummary;
    },
    onOverlayAudioMute: function () {

    },
    onOverlayAudioUnmute: function () {
        
    },
    getYouTubeID: function(url){
        var ID = '';
        url = url.replace(/(>|<)/gi,'').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
        if(url[2] !== undefined) {
        ID = url[2].split(/[^0-9a-z_\-]/i);
        ID = ID[0];
        }
        else {
        ID = url;
        }
        return ID;
    }
});
//# sourceURL=YoutubeRenderer.js
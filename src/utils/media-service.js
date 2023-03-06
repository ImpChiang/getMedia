
const mediaDevices = function (element, options) {
    // eslint-disable-next-line no-nested-ternary
    const cfg = typeof options === 'object' ? options : {}
    cfg.element = element
    cfg.args = arguments
    return new MediaDevice(cfg)
}

class MediaDevice {
    constructor (cfg) {
        console.log(cfg, 'constructor---cfg')
        this.parse(cfg)
    }
    parse (cfg) {
        this.$ele = cfg.element || null
        this.$width = parseInt(cfg.width) ?? (document.documentElement.clientWidth || document.body.clientWidth)
        this.$height = parseInt(cfg.height) ?? (document.documentElement.clientHeight || document.body.clientHeight)
        this.$exact = cfg.exact ?? 'environment'
        this.init()
    }
    init () {
        console.log(this.$width, 'this.$width', this.$height)
        this.mediaVideo()

    }
    mediaVideo () {
        this.video = document.createElement('video')
        this.video.width = this.$width
        this.video.height = this.$height
        const mediaEleBox = document.createElement('div')
        this.$ele.append(mediaEleBox)
        mediaEleBox.append(this.video)
        mediaEleBox.style = `width:${this.$width}px;height:${this.$height}px;position:fixed;top:0,background:aqua;`
        // this.mediaCameraCanvas()
        this.openScan()
    }
    openScan () {
        const width = this.transtion(this.$width)
        const height = this.transtion(this.$height)
        const videoParam = {
            audio: false,
            video: {
                facingMode: { exact: this.$exact },
                width,
                height
            }
        }
        navigator.mediaDevices.getUserMedia(videoParam).then((stream) => {
            this.currentStream = stream
            this.video.srcObject = stream
            this.video.setAttribute('playsinline', true)
            this.video.setAttribute('webkit-playsinline', true)
            this.video.play()

            this.track = stream.getVideoTracks()[0];
            const _ = this
            setTimeout(() => {
                _.isUseTorch = _.track.getCapabilities().torch || null
            }, 500)
        }).catch(() => {
            throw new Error(`not support`);
        })
    }
    mediaCameraCanvas () {
        const cameraCanvas = document.createElement('canvas')
        cameraCanvas.id = 'cameraCanvas'
        cameraCanvas.width = this.$width
        cameraCanvas.height = this.$height
        cameraCanvas.style = 'display:none;'
        this.cameraCanvas2d = cameraCanvas.getContext('2d')
        this.cameraCanvas = cameraCanvas
    }
    closeCamera () {
        if (this.video.srcObject) {
            this.video.srcObject.getTracks().forEach((track) => {
                track.stop()
            })
        }
    }
    getMediaData () {
        this.cameraCanvas2d.drawImage(this.video, 0, 0, this.$width, this.$height)
        const data = this.cameraCanvas.toDataURL('image/png') // 默认base64格式
        return data
    }
    changeCamera () {
        this.$exact = this.$exact === 'user' ? 'environment':'user'
        if (this.currentStream) {
            this.closeCamera()
        }
        this.openScan()
    }
    transtion(number) {
        return number * 1
    }
}


export default mediaDevices

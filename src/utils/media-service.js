
const mediaDevices = function (element, options) {
    // eslint-disable-next-line no-nested-ternary
    const cfg = typeof options === 'object' ? options : {}
    cfg.element = element
    cfg.args = arguments
    return new MediaDevice(cfg)
}

class MediaDevice {
    constructor (cfg) {
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
        const mediaEleBox = document.createElement('div')
        this.video = this.mediaVideo()
        mediaEleBox.append(this.video)
        mediaEleBox.style = `width:${this.$width}px;height:${this.$height}px;`
        this.$ele.append(mediaEleBox)
        this.cameraCanvas = this.mediaCameraCanvas()
        this.openScan()
    }
    mediaVideo () {
        const video = document.createElement('video')
        video.width = this.$width
        video.height = this.$height
        return video
    }
    openScan () {
        const videoParam = {
            audio: false,
            video: {
                facingMode: { exact: this.$exact },
                width: this.$width,
                height: this.$height
            }
        }
        navigator.mediaDevices.getUserMedia(videoParam).then((stream) => {
            this.currentStream = stream
            this.video.srcObject = stream
            this.video.setAttribute('playsinline', true)
            this.video.setAttribute('webkit-playsinline', true)
            this.video.play()
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
        return cameraCanvas
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
}


export default mediaDevices

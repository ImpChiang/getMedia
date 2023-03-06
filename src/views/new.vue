<template>
  <div class="media-wrap">
<!--    <div class="canvasBox"></div>-->
<!--    <img class="camera-img" :src="userimg" alt="">-->
<!--    <button class="camera-btn" @click="takePhoto">拍照</button>-->
  </div>
</template>

<script>
import mediaDevices from "../utils/media-service";
export default {
  data () {
    return {
      windowWidth: 0,
      windowHeight: 0,
      video: null,
      canvas: null,
      canvas2d: null,
      cameraCanvas: null,
      cameraCanvas2d: null,
      track: null,
      isUseTorch: false,
      trackStatus: false,
      userimg:'',
      exact: 'environment',// environment 后摄像头  user 前摄像头
      watermark: [],
      isUse: false,
    }
  },
  mounted () {
    // this.initElement()
    this.$nextTick(() => {
      const mediaCamera = mediaDevices(document.querySelector('.media-wrap'), {
        width: document.documentElement.clientWidth || document.body.clientWidth,
        height: document.documentElement.clientHeight || document.body.clientHeight
      })
      console.log(mediaCamera, 'mediaCamera')
    })
  },
  methods: {
    init () {
      this.$width = document.documentElement.clientWidth || document.body.clientWidth
      this.$height = document.documentElement.clientHeight || document.body.clientHeight
      this.video = document.createElement('video')
      this.video.width = this.$width
      this.video.height = this.$height
      const mediaEleBox = document.createElement('div')
      document.querySelector('.media-wrap').append(mediaEleBox)
      mediaEleBox.append(this.video)
      mediaEleBox.style = `width:${this.$width}px;height:${this.$height}px;position:fixed;top:0;background:aqua;`
      // this.mediaCameraCanvas()
      this.openScan()
    },
    initElement () {
      this.windowWidth = document.documentElement.clientWidth || document.body.clientWidth
      this.windowHeight = document.documentElement.clientHeight || document.body.clientHeight
      console.log(this.windowWidth, this.windowHeight, 'windowWidth--------windowHeight', window.innerWidth, window.innerHeight)
      this.$nextTick(() => {
        this.video = document.createElement('video')
        this.video.width = this.windowWidth
        this.video.height = this.windowHeight

        // const canvas = document.createElement('canvas')
        // this.canvas = canvas
        // canvas.id = 'canvas'
        // canvas.width = this.windowWidth
        // canvas.height = this.windowHeight
        // canvas.style = 'position: fixed;top: 0;left: 0;z-index:10;'
        // this.canvas2d = canvas.getContext('2d')

        const videoBox = document.createElement('div')
        document.querySelector('.media-wrap').append(videoBox)
        videoBox.append(this.video)
        videoBox.style = `width:${this.windowWidth}px;height:${this.windowHeight}px;`
        // 设置当前宽高 满屏
        // const canvasBox = document.querySelector('.canvasBox')
        // canvasBox.append(this.video)
        // // canvasBox.append(canvas)
        // canvasBox.style = `width:${this.windowWidth}px;height:${this.windowHeight}px;`

        // const cameraCanvas = document.createElement('canvas')
        // this.cameraCanvas = cameraCanvas
        // cameraCanvas.id = 'cameraCanvas'
        // cameraCanvas.width = this.windowWidth
        // cameraCanvas.height = this.windowHeight
        // cameraCanvas.style = 'display:none;'
        // canvasBox.append(canvas)
        // this.cameraCanvas2d = cameraCanvas.getContext('2d')

        this.openScan()
      })
    },
    openScan() {
      let width = this.transtion(this.windowHeight)
      let height = this.transtion(this.windowWidth)
      const videoParam = {
        audio: false,
        video: {
          facingMode: { exact: this.exact },
          width,
          height
        }
      }
      navigator.mediaDevices.getUserMedia(videoParam).then((stream) => {
        this.isUse = true
        this.video.srcObject = stream
        this.video.setAttribute('playsinline', true)
        this.video.setAttribute('webkit-playsinline', true)
        this.video.play()
        // this.makeWatermark(this.canvas2d)
        console.log(this.video, 'this.video', videoParam)
        this.track = stream.getVideoTracks()[0];
        setTimeout(() => {
          this.isUseTorch = this.track.getCapabilities().torch || null
        }, 500)
      }).catch((err) => {
        console.log('设备不支持', err);
        this.isUse = false
      })
    },
    transtion(number) {
      return number * 1
    },
    closeCamera() {
      if (this.video.srcObject) {
        this.video.srcObject.getTracks().forEach((track) => {
          track.stop()
        })
      }
    },
    takePhoto () {
      this.cameraCanvas2d.drawImage(this.video, 0, 0, this.windowWidth, this.windowHeight)
      this.userimg = this.cameraCanvas.toDataURL('image/png')
    }
  }
}
</script>

<style scoped>
.camera-btn{
  position: fixed;
  bottom: 10%;
  left: 50%;
  z-index: 999;
  transform: translateX(-50%);
}
.camera-img{
  width: 50%;
  height: auto;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 990;
}
</style>

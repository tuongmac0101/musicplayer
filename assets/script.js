const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const player = $('.player')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const cd = $('.cd')
const cdThumb = $('.cd-thumb ')
const prevBtn = $('.btn-prev')
const nextBtn = $('.btn-next')
const randomBtn = $('.btn-random')

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  songs: [
    {
      name: "Thương em đến già",
      singer: "Lê Bảo Bình",
      path: "./assets/music/song1.mp3",
      image: "./assets/img/img1.png"
    },
    {
      name: "Mang tiền về cho mẹ",
      singer: "Đen vâu",
      path: "/assets/music/song2.mp3",
      image:"/assets/img/img2.png"
    },
    {
      name: "Đi về nhà ",
      singer: "Đen x JustaTee",
      path:"/assets/music/song3.mp3",
      image:"/assets/img/img3.png",
    },
    {
      name: "Trốn Tìm",
      singer: "Đen vâu",
      path: "/assets/music/song4.mp3",
      image:"/assets/img/img4.png",
    },
    {
      name: "Lối nhỏ",
      singer: "Đen vâu",
      path: "/assets/music/song5.mp3",
      image:"/assets/img/img5.png",
    },
    {
      name: "Bài này chill phết",
      singer: "Đen ft.MIN",
      path:"/assets/music/song6.mp3",
      image:"/assets/img/img6.png",
    }
  ],

  render: function(){
    // map qua songs de render ra htmls
    const htmls = this.songs.map(song =>{
      return`
        <div class="song">
          <div class="thumb" style="background-image: url('${song.image}')"></div>
          <div class="body">
            <h3 class="title">${song.name}</h3>
            <p class="author">${song.singer}</p>
          </div>
          <div class="option">
            <i class="fas fa-ellipsis-h"></i>
          </div>
        </div>
      `
      
    })
    $('.playlist').innerHTML = htmls.join('');
  },
  defineProperties: function(){
    Object.defineProperty(this, 'currentSong', {
      get: function(){
        return this.songs[this.currentIndex]
      }
    })
  },
  handleEvents: function(){
    const _this = this
    const cdWidth = cd.offsetWidth
    
    
    // xu ly CD quay / dung
    const cdThumbAnimate = cdThumb.animate([
      {transform: 'rotate(360deg)'}
    ],{
      duration: 10000, // 10 seconds
      interations: Infinity
    })
    cdThumbAnimate.pause()
    // xử lý phóng to / thu nhỏ cd
    document.onscroll = function(){
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      const newWidth = cdWidth - scrollTop

      cd.style.width = newWidth > 0 ? newWidth  + 'px' : 0
      cd.style.opacity = newWidth / cdWidth
    }
    // xử lý khi click play
    playBtn.onclick = function(){
      if(_this.isPlaying){
        audio.pause()
      }else{
        audio.play()
      }
    }

    // khi song duoc play 
    audio.onplay = function(){
      _this.isPlaying = true
      player.classList.add('playing')
      cdThumbAnimate.play()
    }
    // khi song duoc pause
    audio.onpause = function(){
      _this.isPlaying = false
      player.classList.remove('playing')
      cdThumbAnimate.pause()
    }

    // khi tien do bai hat thay doi 
    audio.ontimeupdate = function(){
      if(audio.duration){
        const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
        progress.value = progressPercent
      }
    }
    // xu ly khi tua song
    progress.onchange = function(e){
      const seektime = audio.duration / 100 * e.target.value
      audio.currentTime = seektime
    }
    // khi next bai hat
    nextBtn.onclick = function(){
      if(_this.isRandom){
        _this.playRandomSong()
      }else{
        _this.nextSong()
      }
      audio.play()
    }
    // khi prev bai hat
    prevBtn.onclick = function(){
      if(_this.isRandom){
        _this.playRandomSong()
      }else{
        _this.prevSong()
      }
      audio.play()
    }
    // xu ly random / bat . tat
    randomBtn.onclick = function(e){
      _this.isRandom = !_this.isRandom
      randomBtn.classList.toggle('active', _this.isRandom)
    }
    // xu ly next song khi audio ended
    audio.onended = function(){
      nextBtn.click()
    }
  },
  loadCurrentSong: function(){
    const heading = $('header h2 ')
    const audio = $('#audio ')

    heading.textContent = this.currentSong.name
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
    audio.src = this.currentSong.path
  },
  nextSong: function(){
    this.currentIndex++
    if (this.currentIndex >= this.songs.length){
      this.currentIndex = 0
    }
    this.loadCurrentSong()
  },
  prevSong: function(){
    this.currentIndex--
    if (this.currentIndex < 0){
      this.currentIndex = this.songs.length - 1
    }
    this.loadCurrentSong()
  },
  playRandomSong: function(){
    let newIndex
    do{
      newIndex = Math.floor(Math.random()*app.songs.length)
    }while (newIndex ===  this.currentIndex)

    this.currentIndex = newIndex
    this.loadCurrentSong()
  },
  start: function(){

    this.defineProperties()

    this.handleEvents()

    this.loadCurrentSong()

    this.render()
  }
}


app.start()

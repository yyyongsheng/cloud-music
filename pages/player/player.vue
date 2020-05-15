<template>
	<view>
		<div class="play_bg"  :style="{background:'url('+music.al.picUrl+') center/cover no-repeat'}"></div>
		<div class="play_mask"></div>
		
		<view class="player-info">
		  <!-- 封面信息 -->
		  <view class="player-disc" v-show="!ishowlyric" @click="ishowlyric=true"  :class= "isPlaying ? 'play':''" >
		    <image class="player-img rotation"  :class= "isPlaying ? '':'rotation-paused'"   :src="music.al.picUrl"></image>
		  </view>
		  
		  
		  
		  <!-- 歌词 -->
		  <view @click="ishowlyric=false" v-show="ishowlyric" style="height: 73%;">
				<uni-lyric :lyric="lyric"  ref="lyric" ></uni-lyric>
		  </view>
		  
		  
		  <!-- 进度条 -->
		  <div class="progress-bar">
			  <progress-bar @musicEnd="onNext"     @timeUpdate="timeUpdate"   :isSame=isSame > </progress-bar>
		  </div>
		  
		  
		   <view class="control">
			   
		      <text class="iconfont iconshangyishoushangyige" @click="onPrev" ></text>
			  
			  <text  class="iconfont" :class= "isPlaying ? 'iconzanting1':'iconiconset0481'"  @click="togglePlaying"></text>
			   
		      <text class="iconfont iconxiayigexiayishou" @click="onNext" ></text>
		    </view>

		
		</view>
	</view>
</template>

<script>
	// 获取全局唯一的背景音频管理器
	const backgroundAudioManager = wx.getBackgroundAudioManager()
	// 正在播放歌曲的index
	let nowPlayingIndex = 0
	
	import progressBar from "../../components/progress"
	
	import uniLyric from "../../components/lyric"
	
	export default {
		data() {
			return {
				music:{},
				isPlaying: false, // false表示不播放，true表示正在播放
				musiclist:[],
				ishowlyric:false,
				isSame:false,
				lyric:''
			}
		},
		components:{
				progressBar,
				uniLyric
		},
		onLoad(options) {
			console.log(options)
			this.music= uni.getStorageSync("musiclist")[options.index]
			 this.musiclist = wx.getStorageSync('musiclist')
			nowPlayingIndex = options.index
			uni.setNavigationBarTitle({
			    title: this.music.name
			});
			this.loadMuiscDetail(options.id)
		},
		methods: {
			loadMuiscDetail(musicId){
				if(this.$musicID==musicId){
					this.isSame=true
					return 
				} 
				this.isSame=false
				var that =this
				console.log('loadMuiscDetail',musicId)
				
				  backgroundAudioManager.stop()
				  
				  this.music = this.musiclist[nowPlayingIndex]
				    
				      wx.setNavigationBarTitle({
				        title: that.music.name,
				      })
				  
			     this.isPlaying=false
				  wx.showLoading({
				        title: '歌曲加载中',
				      })
				 this.$setmusicID(musicId)
				 wx.cloud.callFunction({
				      name: 'music',
				      data: {
				        musicId,
				        $url: 'musicUrl',
				      }
				    }).then(res=>{
						
					 let result = JSON.parse(res.result)
					 
					backgroundAudioManager.src = result.data[0].url
					backgroundAudioManager.title = this.music.name
					backgroundAudioManager.coverImgUrl = this.music.al.picUrl
					backgroundAudioManager.singer = this.music.ar[0].name
					backgroundAudioManager.epname = this.music.al.name

					this.isPlaying=true
					wx.hideLoading()
					
					// 加载歌词
					  wx.cloud.callFunction({
						name: 'music',
						data: {
						  musicId,
						  $url: 'lyric',
						}
					  }).then((res) => {
						
						let lyric = '暂无歌词'
						const lrc = JSON.parse(res.result).lrc
						if (lrc) {
						  lyric = lrc.lyric
						}
						this.lyric=lyric
						
					  })
					  
				})
				
			},
			togglePlaying(){
				 if (this.isPlaying) {
				      backgroundAudioManager.pause()
				    } else {
				      backgroundAudioManager.play()
				    }
				this.isPlaying=!this.isPlaying
			},
			  onPrev() {
				  console.log('onPrev')
			    nowPlayingIndex--
			    if (nowPlayingIndex < 0) {
			      nowPlayingIndex = this.musiclist.length - 1
			    }
			    this.loadMuiscDetail(this.musiclist[nowPlayingIndex].id)
			  },
			    onNext() {
					 console.log('onNext')
			      nowPlayingIndex++
			      if (nowPlayingIndex === this.musiclist.length) {
			        nowPlayingIndex = 0
			      }
			      this.loadMuiscDetail(this.musiclist[nowPlayingIndex].id)
			    },
				
		timeUpdate(time) {
			
			this.$refs.lyric.update(time)
			// this.selectComponent('.lyric').update(event.detail.currentTime)
		  },
		}
	}
</script>

<style lang="less" scoped>
.play_bg{
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	filter: blur(40rpx);
	opacity: 0.5;
	z-index: -1;
}
.play_mask{
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: -2;
	background: #222;
}
.player-info {
  text-align: center;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

.player-disc {
  width: 592rpx;
  height: 592rpx;
  background: url('https://s3.music.126.net/mobile-new/img/disc.png?d3bdd1080a72129346aa0b4b4964b75f=') no-repeat center/contain;
  position: absolute;
  left: 50%;
  transform: translate(-50%, 140rpx);
}

.player-disc::after {
  content: '';
  width: 192rpx;
  height: 274rpx;
  position: absolute;
  top: -150rpx;
  left: 266rpx;
  background: url('https://s3.music.126.net/m/s/img/needle.png?702cf6d95f29e2e594f53a3caab50e12') no-repeat center/contain;
  transform: rotate(-15deg);
  transform-origin: 24rpx 10rpx;
  transition: transform 0.5s ease;
}


.rotation {
  animation: rotation 12s linear infinite;
  
}
@keyframes rotation {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
.rotation-paused {
  animation-play-state: paused;
}
.play.player-disc::after {
  transform: rotate(0deg);
}

.player-img {
  width: 368rpx;
  height: 368rpx;
  border-radius: 50%;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-top: -184rpx;
  margin-left: -184rpx;
}

.control {
  position: absolute;
  bottom: 8%;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
}

.control .iconfont {
  color: #fefefe;
}

.iconshangyishoushangyige, .iconxiayigexiayishou {
  font-size: 80rpx;
}

.iconiconset0481, .iconzanting1 {
  font-size: 120rpx;
  margin: 0 50rpx;
}
.progress-bar {
  width: 90%;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 24%;
}
</style>

<template>
	<scroll-view  class="lyric-scroll" scroll-y :scroll-top="scrollTop" scroll-with-animation="true">
	  <view class="lyric-panel">
	    <block  v-for="(item,index) in lrcList"  :key="index">
	      <view class="lyric" :class="index==nowLyricIndex?'hightlight-lyric': ''"    >{{item.lrc}}</view>
	    </block>
	  </view>
	
	</scroll-view>
	
</template>

<script>
	let lyricHeight = 0   //一行歌词的高度
	export default {
		props:{
			lyric:{
				type:String
			}	
		},
		data(){
			return{
				scrollTop:0,
				nowLyricIndex:0,
				lrcList:[{lrc:'暂无歌词'}]
			}
		},
		onReady(){
				wx.getSystemInfo({
					success(res) {
						// console.log(res)
						// 求出1rpx的大小
						lyricHeight = res.screenWidth / 750 * 64
						},
					})

					console.log(lyricHeight,'lyricHeight')
		},
	
	
		
		watch:{
			lyric(val){
				console.log(val,'sssss')
				this._parseLyric(val)
			}
		},
		methods:{
				  update(currentTime) {
				      console.log(currentTime,'3333')
				      let lrcList = this.lrcList
				      if (lrcList.length == 0) {
				        return
				      }
				      if (currentTime > lrcList[lrcList.length - 1].time) {
				        if (this.nowLyricIndex != -1) {
				            this.nowLyricIndex= -1,
				             this.scrollTop= lrcList.length * lyricHeight
				          
				        }
				      }
				      for (let i = 0, len = lrcList.length; i < len; i++) {
				        if (currentTime <= lrcList[i].time) {
				            this.nowLyricIndex= i - 1,
				            this.scrollTop= (i - 1) * lyricHeight
				          break
				        }
				      }
				    },
			
			
			  _parseLyric(sLyric) {
			      let line = sLyric.split('\n')
			      // console.log(line)
			      let _lrcList = []
			      line.forEach((elem) => {
			        let time = elem.match(/\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/g)
			        if (time != null) {
			          let lrc = elem.split(time)[1]
			          let timeReg = time[0].match(/(\d{2,}):(\d{2})(?:\.(\d{2,3}))?/)
			          // console.log(timeReg)
			          // 把时间转换为秒
			          let time2Seconds = parseInt(timeReg[1]) * 60 + parseInt(timeReg[2]) + parseInt(timeReg[3]) / 1000
			          _lrcList.push({
			            lrc,
			            time: time2Seconds,
			          })
			        }
			      })
			    
			        this.lrcList= _lrcList
					
					
			     
			    }
		}
	}
</script>

<style>
	.lyric-scroll {
	  width: 100%;
	  height: 70%;
	  color: #ccc;
	  font-size: 32rpx;
	}
	
	.lyric-panel {
	  position: relative;
	  top: 50%;
	}
	
	.lyric {
	  min-height: 64rpx;
	}
	
	.hightlight-lyric {
	  color: #d43c33;
	}

</style>

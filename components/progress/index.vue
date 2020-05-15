<template>
	<view class="container">
	  <text class="time">{{showTime.currentTime}}</text>
	  <view class="control">
	    <movable-area class="movable-area">
	      <movable-view direction="horizontal" class="movable-view"
	        damping="1000" :x="movableDis" @change="onChange"
	        @touchend="onTouchEnd"
	      />
	    </movable-area>
	    <progress stroke-width="4" backgroundColor="#969696"
	    activeColor="#fff" :percent="progress"></progress>
	  </view>
	  <text class="time">{{showTime.totalTime}}</text>
	</view>
	
</template>

<script>
	let movableAreaWidth=0
	let movableViewWidth=0
	const backgroundAudioManager = wx.getBackgroundAudioManager()
	let duration = 0 // 当前歌曲的总时长，以秒为单位
	let currentSec = -1 // 当前的秒数
	let isMoving = false // 表示当前进度条是否在拖拽，解决：当进度条拖动时候和updatetime事件有冲突的问题
export default{
	props:{
		isSame:{
		   type:Boolean	
		}
	},
	data(){
		return{
			 showTime: {
			      currentTime: '00:00',
			      totalTime: '00:00',
			    },
			    movableDis: 0,
			    progress: 0,
				progress1:0,
				movableDis1:0
		}
	},
	 onReady() {
			 if (  this.isSame&&  this.showTime.totalTime == '00:00') {
					 this._setTime()
				 }
			this.getMovableDis()
			this._bindBGMEvent()
	 }	,
	methods:{
		onChange(event){
			
			 if (event.detail.source == 'touch') {
				 console.log(event,'event')
			        this.progress1 = event.detail.x / (movableAreaWidth - movableViewWidth) * 100
			        this.movableDis1 = event.detail.x
			        isMoving = true
			        // console.log('change', isMoving)
			      }
		},
		onTouchEnd(){
			console.log('onTouchEnd')
			const currentTimeFmt = this._dateFormat(Math.floor(backgroundAudioManager.currentTime))
			    
			        this.progress= this.progress1,
			        this.movableDis= this.movableDis1,
			        this.showTime.currentTime= currentTimeFmt.min + ':' + currentTimeFmt.sec
			    
			      backgroundAudioManager.seek(duration * this.progress1 / 100)
			      isMoving = false
		},
		getMovableDis(){
			 const query = this.createSelectorQuery()
			      query.select('.movable-area').boundingClientRect()
			      query.select('.movable-view').boundingClientRect()
			      query.exec((rect) => {
			       
			        movableAreaWidth = rect[0].width
			        movableViewWidth = rect[1].width
			        console.log(movableAreaWidth, movableViewWidth,'222')
			      })
		},
		_bindBGMEvent() {
			var that=this
		      backgroundAudioManager.onPlay(() => {
		        console.log('onPlay')
		         isMoving = false
		        // this.triggerEvent('musicPlay')
		      })
		
		      backgroundAudioManager.onStop(() => {
		        console.log('onStop')
		      })
		
		      backgroundAudioManager.onPause(() => {
		        console.log('Pause')
		        // this.triggerEvent('musicPause')
		      })
		
		      backgroundAudioManager.onWaiting(() => {
		        console.log('onWaiting')
		      })
		
		      backgroundAudioManager.onCanplay(() => {
		        console.log('onCanplay')
		        // console.log(backgroundAudioManager.duration)
		        if (typeof backgroundAudioManager.duration != 'undefined') {
		          this._setTime()
		        } else {
		          setTimeout(() => {
		            this._setTime()
		          }, 1000)
		        }
		      })
		
		      backgroundAudioManager.onTimeUpdate(() => {
		        // console.log('onTimeUpdate')
				
		        if (!isMoving) {
		          const currentTime = backgroundAudioManager.currentTime
		          const duration = backgroundAudioManager.duration
		          const sec =parseInt(currentTime) 
		          if (sec != currentSec) {
		            const currentTimeFmt = this._dateFormat(currentTime)
		              this.movableDis= (movableAreaWidth - movableViewWidth) * currentTime / duration,
		              this.progress= currentTime / duration * 100,
		             this.showTime.currentTime= `${currentTimeFmt.min}:${currentTimeFmt.sec}`,
		           
		            currentSec = sec
		            // 联动歌词
		            // this.triggerEvent('timeUpdate', {
		            //   currentTime
		            // })
					console.log(666611122)
					this.$emit('timeUpdate',currentTime)
					
		          }
				  
		        }
				
		      })
		
		      backgroundAudioManager.onEnded(() => {
		        console.log("onEnded")
		        // this.triggerEvent('musicEnd')
				this.$emit('musicEnd')
		      })
		
		      backgroundAudioManager.onError((res) => {
		        console.error(res.errMsg)
		        console.error(res.errCode)
		        wx.showToast({
		          title: '错误:' + res.errCode,
		        })
		      })
		    },
			  _setTime() {
			      duration = backgroundAudioManager.duration
				  console.log(duration,'duration')
			      const durationFmt = this._dateFormat(duration)
				  console.log(durationFmt,'durationFmt')
				  
				  this.showTime.totalTime=`${durationFmt.min}:${durationFmt.sec}`
			     
			    },
				_dateFormat(sec){
					const min= Math.floor(sec/60)
					sec=Math.floor(sec%60)
						
					return{
						'min':this.parse0(min),
						'sec':this.parse0(sec)
					}
				},
				parse0(sec){
					return sec<10?"0"+sec:sec
				}
	}
}
</script>

<style>
	.container {
	  display: flex;
	  align-items: center;
	}
	
	.control {
	  position: relative;
	  flex: 1;
	}
	
	.movable-area {
	  width: 100%;
	  height: 34rpx;
	  position: absolute;
	  bottom: -14rpx;
	  left: 0;
	}
	
	.movable-view {
	  width: 36rpx;
	  height: 36rpx;
	  background: #fefefe;
	  border-radius: 50%;
	}
	
	.time {
	  width: 64rpx;
	  padding: 0 20rpx;
	  font-size: 24rpx;
	  font-family: NotoSansHans-Regular;
	  font-weight: 400;
	  color: rgba(255, 255, 255, 1);
	  line-height: 30rpx;
	}

</style>

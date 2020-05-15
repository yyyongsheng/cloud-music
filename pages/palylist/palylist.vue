<template>
	<view class="musiclist">
		<swiper :indicator-dots="true" :autoplay="true" :interval="2000" :duration="1000">
			<swiper-item v-for="item in imageslist" :key="item.id">
				<view class="swiper-item">
					<image :src="item.picUrl" mode="aspectFill"></image>
				</view>
			</swiper-item>
		</swiper>
		
		<view class="playlist">
			<block v-for="item in imageslist" :key="item.id">
				<play-list :playlist="item"></play-list>
			</block>		
				
		</view>
		
		
	</view>
</template>

<script>
	import playList from '../../components/playlist/playlist.vue'
	export default {
		data() {
			return {
				title: 'Hello',
				getlistparams:{
					start:0,
					count:15
				},
				imageslist:[],
				nodata:false
			}
		},
		components:{
			playList
		},
		onShow() {
				
		},
		onReachBottom(){
			console.log(111)
			this.getlistparams.start+=this.getlistparams.count
			this.getlist()
		},
		onPullDownRefresh(){
			this.getlistparams.start=0
			this.nodata=false
			this.imageslist=[]
			this.getlist()
		},
		onLoad() {
			this.getlist()
		
		},
		methods: {
			getlist(){
					var that=this
					if(that.nodata) return
					wx.showLoading({
						title:"加载中"
					})
					wx.cloud.callFunction({
					name: 'music',
					data:{
						...that.getlistparams,
						$url:"getlist"
					}
					}).then(res=>{
						let data=res.result.data
						console.log(data)
						wx.stopPullDownRefresh();
						wx.hideLoading();
						if(data.length<15){
							that.nodata=true
						}
						that.imageslist=[...that.imageslist,...data]
						
					})
			}
			
		}
	}
</script>

<style scoped lang="less">
	swiper{
		height: 300rpx;
		.swiper-item{
			image{
				width: 100%;
			}
		}
	}
	
	.playlist{
		display: flex;
		justify-content: space-around;
		flex-wrap: wrap;
		margin-top: 10rpx;
		flex-direction: row;
	}
</style>

<template>
	<view class="musiclistbox">
			<view class="musiclist_banner">
				<img class="musiclist_banner_img" :src="listinfo.coverImgUrl" mode="aspectFit" alt="">
				<span class="musiclist_banner_name">{{listinfo.name}}</span>
			</view>
	
	
		<view class="musiclist">
			<ul >
				<li :class="{playing:selectid==item.id}"   v-for="(item,index) in musiclist"  @click="godetail(item,index)" :key="item.id">
					<div class="num">{{index+1}}</div>
					<div class="info">
						<p>{{item.name}}</p>
						<span>{{item.ar[0].name}}</span>
					</div>
				</li>
			</ul>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
					musiclist:[],
					listinfo:{},
					selectid:"-1"
			}
		},
		onShow() {
			if(this.$musicID){
				this.selectid=this.$musicID
			}
		},
		onLoad(options){
		    uni.showLoading({
		    	title:"加载中"
		    })
			var that=this
			wx.cloud.callFunction({
			name: 'music',
			data:{
				playlistId:options.id,
				$url:"musiclist"
			}
			}).then(res=>{
				let data=res.result.playlist
				that.musiclist=data.tracks
				that.listinfo={
					coverImgUrl:data.coverImgUrl,
					name:data.name
				}
				uni.hideLoading()
				uni.setStorageSync("musiclist",this.musiclist)
			})	
			
			
		},
		methods: {
			godetail(item,index){
				this.selectid=item.id
				
			
				uni.navigateTo({
					url:`../player/player?id=${item.id}&index=${index}`
				})
			}
		}
	}
</script>

<style lang="less">
.musiclistbox {
	position: relative;
	padding-top: 278rpx;
		.musiclist_banner{
			width: 100%;
			height: 250rpx;
			display: flex;
			position: fixed;
			top: 0;
			left: 0;
			justify-content: flex-start;
			align-items: center;
			padding: 15rpx;
			background: #907681;
			box-shadow: 0px 0px 20px #4f4644 inset;
			.musiclist_banner_img{
				width: 30%;
				max-height: 220rpx;
				margin-right: 15rpx;
			}
			.musiclist_banner_name{
				width: 67%;
				color: #fff;
			}
		}
		
		.musiclist{
			ul{
				.playing{
					 background-image: linear-gradient(to right, #ff9569 0%, #e92758 100%);
				}
				li{
					display: flex;
					justify-content: flex-start;
					align-items: center;
					margin-bottom: 15rpx;
					padding: 15rpx 20rpx;
					.num{
						width: 15%;	
						color: #2C405A;
					}
					.info{
						width: 70%;
						p{
							color: #333;
						}
						span{
							font-size: 30rpx;
							color: #999;
						}
					}
					
				}
			}
		}
	
}
	
</style>

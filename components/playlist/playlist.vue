<template>
	<view class="playlist_content"  @click="gomusic" >
		<image :src="playlist.picUrl" mode="aspectFill"  class="palylist_img" ></image>
		<view class="count">{{playlist.playCount}}</view>
		<text class="name">{{playlist.name}}</text>
	</view>
</template>

<script>
	export default {
		props:{
			playlist:{
				type:Object
			}
		},
		data() {
			return {
				
			}
		},
		methods: {
				gomusic(){
					console.log(this.playlist)
					uni.navigateTo({
						url:'/pages/musiclist/musiclist?id='+this.playlist.id
					})
				}
		}
	}
</script>

<style>
.playlist_content{
	width: 220rpx;
	position: relative;
	padding-bottom: 20rpx;
}
.palylist_img{
	height: 220rpx;
	width: 100%;
	border-radius: 8rpx;
}
.name{
	font-size: 26rpx;
	 text-overflow: -o-ellipsis-lastline;
	  overflow: hidden;
	  text-overflow: ellipsis;
	  display: -webkit-box;
	  -webkit-line-clamp: 2;
	  line-clamp: 2;
	  -webkit-box-orient: vertical;
}
	
.count{
	right: 10rpx;
	top: 4rpx;
	color: #fff;
	font-size: 24rpx;
	
	position: absolute;
	background: url(data:image/png;base64,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);
	background-position: left;
	background-size: contain;
	background-repeat: no-repeat;
	padding-left: 30rpx;
}
</style>

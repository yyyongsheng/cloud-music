<template>
	<view>
			<textarea type="text" value=""   @focus="onFocus" @blur="onBlur"   @input="onInput" />
			<div class="shuru" :style="{bottom:bottom+'px'}">
				输入框
			</div>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				bottom:0
			}
		},
		methods: {
			onInput(event){
				console.log(event)
			},
			onFocus(event){
				console.log(event)
				this.bottom= event.detail.height
			},
			onBlur(event){
				this.bottom= 0
			}
		}
	}
</script>

<style>
.shuru{
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	background: #4CD964;
	text-align: center;
	line-height: 70rpx;
	height: 70rpx;
}
</style>

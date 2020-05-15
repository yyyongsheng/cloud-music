<script>
	export default {
		onLaunch: function() {
			wx.cloud.init({
				
			})  
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	@import './iconfont.css';
	
	
</style>

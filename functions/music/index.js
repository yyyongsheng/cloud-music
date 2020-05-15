// 云函数入口文件
const cloud = require('wx-server-sdk')
const TcbRouter =require("tcb-router")  //koa
const rp=require('request-promise')
cloud.init()




const BASE_URL = 'http://musicapi.xiecheng.live'

// 云函数入口函数
exports.main = async (event, context) => {

const app=new TcbRouter({event})

// console.log(event,'eeee')
 app.use(async(ctx,next)=>{
	 ctx.data={}
	 ctx.data.openId=event.userInfo.openid
	 await next()
 })

	app.router('getlist',async(ctx,next)=>{
			ctx.body= await cloud.database().collection('playlist')
			.skip(event.start)
			.limit(event.count)
			.orderBy("createTime","desc")
			.get()
			.then(res=>{
			  return res
			})
	})
	
  app.router('musiclist', async(ctx, next) => {
    ctx.body = await rp(BASE_URL + '/playlist/detail?id=' + parseInt(event.playlistId))
      .then((res) => {
        return JSON.parse(res)
      })
  })
	
	
	
  app.router('musicUrl', async(ctx, next) => {
	ctx.body = await rp(BASE_URL + `/song/url?id=${event.musicId}`).then((res) => {
	  return res
	})
  })
  
    app.router('lyric', async(ctx, next) => {
      ctx.body = await rp(BASE_URL + `/lyric?id=${event.musicId}`).then((res) => {
        return res
      })
    })
	
	







  return app.serve()
 
}
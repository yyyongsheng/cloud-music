// 云函数入口文件
const cloud = require('wx-server-sdk')
const rp=require('request-promise')
// const TcbRouter =require("tcb-router")  //koa
cloud.init()   // 初始化云函数

const db=cloud.database()  //初始化云数据库


const URL ="http://musicapi.xiecheng.live/personalized"
// 云函数入口函数

const MAX_LIMIT =10   //云函数单次最多可以取100条数据

exports.main = async (event, context) => {
  
	
  
   
// const list =await db.collection('playlist').get()


const countResult =await db.collection('playlist').count()

const total=countResult.total

const batchTimes=Math.ceil(total/MAX_LIMIT)   //需要取多少次

const tasks=[]

for(let i=0;i<batchTimes;i++){
	let promise =db.collection('playlist').skip(i*MAX_LIMIT).limit(MAX_LIMIT).get()
	tasks.push(promise)
}

let list={
	data:[]
}

 if(tasks.length>0){
	 list=(await Promise.all(tasks)).reduce((acc,cur)=>{
		return {
			data:acc.data.concat(cur.data)
		}
	 })
 }


 console.log(total,'total')



   const playlist=await rp(URL).then(res=>{
	   return  JSON.parse(res).result
   })


  
   
   let newData=[]

		playlist.forEach(element => {
			var flag=true
			list.data.forEach(item=>{
				if(element.id==item.id){
					flag=false
				}
			})
			if(flag){
				newData.push(element)
			}
		
	});


	for(let i=0;i<newData.length;i++){
		await db.collection("playlist").add({
			data:{
				...newData[i],
				createTime:db.serverDate()
			}
		}).then(res=>{
				
			console.log('插入成功')
			
		}).catch(err=>{
			console.log('插入失败')
		})

	}
	
   
}
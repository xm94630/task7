/**
 * Created by Administrator on 2016/1/27.
 */
appControllers.controller("homeCtrl",function($scope,XmService){

	//这里使用了服务
	var value = XmService.splat(function(x,y){
		return x+y;
	})([1400,8127]);

	//这部分数据是传递给指令用的，用来作为指令的参数
	$scope.pigData={
	    sTime : [2016,4],
	    eTime : [2018,8],
	    span  : 12
	};

	//这部分数据是传递给指令用的，用来作为指令的参数
	$scope.chosendata2 = {
		data:[{
			label:"孙悟空",
			value: "0"
		},{
			label:"太阳神",
			value: "1"
		},[
			{
				label:"妖怪"
			},{
				label:"孙猴子",
				value: "2"
			},{
				label:"妖怪王",
				value: "3"
			},{
				label:"神仙杀手",
				value: "4"
			},{
				label:"红孩儿",
				value: "5",
				disabled:true
			}
		]
		,[
			{
				label:"神仙"
			},{
				label:"太上老君",
				value: "6",
				disabled:true
			},{
				label:"太白金星",
				value: "7"
			},{
				label:"孙大圣",
				value: "8"
			}
		]],
		selected:['3'],
		change:function(label,value){}
	}



});
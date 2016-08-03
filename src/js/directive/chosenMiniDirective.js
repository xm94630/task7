appDirectives.directive('chosenMiniDirective', function($rootScope,$timeout) {
	return {
	    restrict: 'AE',
	    replace: 'true',
	    templateUrl: './html/directive/chosenMini.html',
	    scope: {
	    	'chosenData'    : '=',
	        'setSelected'   : '=',
	        'changeFunction': '='
	    },
	    controller:function($scope){
	    },
	    link:function(scope,element,attrs){

	    	//获取插件的参数
	    	var data        = scope.chosenData;
	    	var selectedArr = scope.setSelected;
	    	var changeFun   = scope.changeFunction;

	    	l(data)
	    	l(selectedArr)
	    	l(changeFun)
	    	l('-->')

	    	/*<ul class="conList" id="conList">
	    		<li value="2">123</li>
	    		<li value="3" class="disabled">222</li>
	    		<li>333</li>
	    		<ul class="groupList">
	    			<li class="disabled">分类</li>
	    			<li class="disabled">12</li>
	    			<li>123</li>
	    		</ul>
	    		<li>23</li>
	    		<li>34</li>
	    		<li>123</li>
	    	</ul>*/

	    	var arr = [];

	    	var isArray = Array.isArray || function(obj){
	    		return Object.prototype.toString.call(obj) == '[object Array]';
	    	}

	    	for(var i=0;i<data.length;i++){
	    		var html ='';
	    		if(isArray(data[i])){
	    			html+='<ul class="groupList">';
	    			for(var j=0;j<data[i].length;j++){
	    				if(data[i][j].disabled){
	    					var myClass = 'class="disabled"';
	    				}else{
	    					var myClass ='';
	    				}
	    				html+='<li value="'+ data[i][j].value +'" '+myClass+'>'+data[i][j].label+'</li>'
	    			}
	    			html+='</ul>';
	    			arr.push(html);
	    		}else{
	    			if(data[i].disabled){
	    				var myClass = 'class="disabled"';
	    			}else{
	    				var myClass ='';
	    			}
	    			html='<li value="'+ data[i].value +'" '+myClass+'>'+data[i].label+'</li>'
	    			arr.push(html);
	    		}
	    	}
	    	html = arr.join('');
	    	//注意angularjs中的元素选择器的用法，不像$一样好用
	    	angular.element(document.getElementById('conList')).append(html);


	    }
	};
});


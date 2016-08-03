/*appDirectives.directive('chosenMiniDirective', function($rootScope,$timeout) {
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

	    	//获取双向绑定的数据
	    	var data        = scope.chosenData;
	    	var selectedArr = scope.setSelected;
	    	var changeFun   = scope.changeFunction;

	    	//获取插件的配置参数
	    	scope.chosenSearch = !attrs['isHaveSearch'];
	    	scope.isSingle = !attrs['isMulit'] || false;

	    }
	};
});*/


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

        //这个是获取模块，在link的第四个参数中使用，用来质量之间的通信，这个是指的就是那个指令的控制器内容
        //？是什么意思
        require: "?ngModel",

        //这个参数开启之后，才能对“指令标签”中的子集DOM进行引用和处理，它体现在compile函数中第3个参数
        transclude: true,

        //我认为compile和link的区别在于，compile是link的前置步骤，return之后得到的就是link的函数
        //这里的第三个才是就是上面提到的“指令标签”中的子集DOM的处理函数
        //当transclude为false的时候， 就不能是用transcludeFn， 否者的话就会出错
        compile: function(tEle, tAttr, transcludeFn) {

            return function(scope, element, attrs, ngModel) {

            	l('==>');
            	//居然是空的
            	l(ngModel);

                //获取双向绑定的数据
                var data        = scope.chosenData;
                var selectedArr = scope.setSelected;
                var changeFun   = scope.changeFunction;

                //获取插件的配置参数
                scope.chosenSearch = !attrs['isHaveSearch'];
                scope.isSingle = !attrs['isMulit'] || false;

                //这部分是对“指令标签”中的子集DOM的引用，和处理
                transcludeFn(scope, function(clone){
                	//l(clone);
                	return;
                });

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



            };
        },
        replace: true
    };
})

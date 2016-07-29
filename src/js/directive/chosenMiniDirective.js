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



            };
        },
        replace: true
    };
})

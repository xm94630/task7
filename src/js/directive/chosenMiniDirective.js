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


	    }
	};
});


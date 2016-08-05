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

                //默认下拉
                scope.showList = false;
                scope.myChosen = '-';
                scope.searchCon = ''

                l(data)
                l(selectedArr)
                l(changeFun)
                l('-->')

                var isArray = Array.isArray || function(obj){
                    return Object.prototype.toString.call(obj) == '[object Array]';
                }

                function randerList(data){
                    angular.element(document.getElementById('conList')).html('');
                    var arr = [];
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
                randerList(data);

                angular.element(document.getElementById('conBox')).bind('click',function($event){
                    scope.$apply(function() {
                        scope.showList = true;
                    });

                    $event.stopPropagation();
                });

                angular.element(document.getElementsByTagName('body')).bind('click',function($event){
                    scope.$apply(function() {
                        scope.showList = false;
                    });
                });

                angular.element(document.getElementById('downBox')).bind('click',function($event){
                    $event.stopPropagation();
                });

                function bindListEvent(){
                    angular.element(document.getElementById('conList')).find('li').bind('click',function($event){

                        var ele = angular.element(this);

                        scope.$apply(function() {
                            if(ele.hasClass('disabled')){
                                show = true;
                            }else{
                                scope.myChosen = ele.text();
                                //scope.myChosen = ele.attr('value');
                                scope.showList = false;

                            }
                        });
                    });
                };
                bindListEvent();

                

                /*angular.element(document.querySelector('.chosenBox')).find('input').bind('change',function($event){

                    l(12123123);
                });*/



                //过滤数据
                function parseChoseData(arr,key){
                    
                    var newData = [];
                    var sonArr;
                    for(var i=0;i<arr.length;i++){
                        if(isArray(arr[i])){
                            sonArr = [];
                            for(var j=0;j<arr[i].length;j++){

                                if(j==0){

                                    //如果类别符合搜索，则列出全部子类
                                    if(key && arr[i][0].label.indexOf(key)!=-1){
                                        sonArr = arr[i];
                                        break;
                                    }

                                    sonArr.push(arr[i][j]);
                                }else{
                                    var myData = arr[i][j];
                                    var label = myData.label;
                                    if(key && label.indexOf(key)!=-1){
                                        l('111')
                                        sonArr.push(arr[i][j]);
                                    }
                                }

                            }
                            if(sonArr.length>1){
                                newData.push(sonArr);
                            }
                            
                        }else{
                            var myData = arr[i];
                            var label = myData.label;
                            if(key && label.indexOf(key)!=-1){
                                newData.push(arr[i]);
                            }
                        }
                    }

                    return newData;

                }

                scope.inputChange = function(){
                    var v = scope.searchCon;
                    if(v!=''){
                        var newData = parseChoseData(data,v);
                        randerList(newData);
                        bindListEvent();
                    }else{
                        var newData = data;
                        randerList(newData);
                        bindListEvent();
                    }
                }


            };
        },
        replace: true
    };
})

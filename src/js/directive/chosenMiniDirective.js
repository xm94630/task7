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

                //获取双向绑定的数据
                var data        = scope.chosenData;
                var selectedArr = scope.setSelected;
                var changeFun   = scope.changeFunction;

                var isArray = Array.isArray || function(obj){
                    return Object.prototype.toString.call(obj) == '[object Array]';
                }


                //获取插件的配置参数
                scope.chosenSearch = !attrs['isHaveSearch'];
                scope.isMulit = attrs['isMulit'] || false;

                //这部分是对“指令标签”中的子集DOM的引用，和处理
                transcludeFn(scope, function(clone){
                	//l(clone);
                	return;
                });

                //如果数据不存在
                if(!isArray(data) || !data || data.length==0){
                    data = scope.chosenData = [{label:'无数据',disabled:true}];
                }

                //默认下拉
                scope.showList = false;
                //默认搜索内容
                scope.searchCon = '';
                //默认选中显示第一个label值
                if(!selectedArr){
                    selectedArr = [];
                    scope.myChosen = data[0].label;
                }

                function contains(arr, obj) {
                  var i = arr.length;
                  while (i--) {
                    if (arr[i] === obj) {
                      return true;
                    }
                  }
                  return false;
                }

                //渲染列表
                function randerList(data){

                    angular.element(document.getElementById('conList')).html('');
                    var arr = [];
                    for(var i=0;i<data.length;i++){
                        var html ='';

                        //这部分是对于下拉列表的渲染
                        if(isArray(data[i])){
                            html+='<ul class="groupList">';
                            for(var j=0;j<data[i].length;j++){
                                var myClassArr = [];
                                if(data[i][j].disabled){
                                    myClassArr.push('disabled');
                                }

                                //渲染下拉列表
                                //多选
                                if(scope.isMulit){

                                    for(var x=0;x<selectedArr.length;x++){
                                        if(data[i][j].value==selectedArr[x]){
                                            myClassArr.push('active');
                                            scope.myChosen = data[i][j].label;
                                        }
                                    }

                                //单选
                                }else{
                                    if(selectedArr[0]!=undefined && data[i][j].value==selectedArr[0]){
                                        myClassArr.push('active');
                                        scope.myChosen = data[i][j].label;
                                    }
                                }

                                myClass = myClassArr.join(' ');
                                html+='<li value="'+ data[i][j].value +'" class="'+myClass+'">'+data[i][j].label+'</li>'
                            }
                            html+='</ul>';
                            arr.push(html);
                        }else{
                            var myClassArr = [];
                            if(data[i].disabled){
                                myClassArr.push('disabled');
                            }

                            //多选
                            if(scope.isMulit){
                                for(var x=0;x<selectedArr.length;x++){
                                    if(data[i].value==selectedArr[x]){
                                       myClassArr.push('active');
                                       scope.myChosen = data[i].label;
                                    }
                                }
                            //单选
                            }else{
                                if(selectedArr[0]!=undefined  &&  data[i].value==selectedArr[0]){
                                    myClassArr.push('active');
                                    scope.myChosen = data[i].label;
                                }
                            }

                            myClass = myClassArr.join(' ');
                            html='<li value="'+ data[i].value +'" class="'+ myClass +'">'+data[i].label+'</li>'
                            arr.push(html);
                        }
                    }
                    html = arr.join('');
                    //注意angularjs中的元素选择器的用法，不像$一样好用
                    angular.element(document.getElementById('conList')).append(html);

                    //绑定
                    bindListEvent();

                }
                randerList(data);


                //通过value值获取name
                function getName(v){
                    for(var i=0;i<data.length;i++){
                        if(isArray(data[i])){
                            for(var j=0;j<data.length;j++){
                               if(data[i][j].value == v){
                                   return data[i][j].label;
                               }
                            }
                        }else{
                            if(data[i].value == v){
                                return data[i].label;
                            }
                        }
                    }
                }

                function randerMultifyBox(data){

                    var html ='';
                    var ele = angular.element(document.getElementById('conBoxMulti'));
                    for(var i=0;i<data.length;i++){
                        var name = getName(data[i]);
                        html += '<span class="nameBox">'+name+' X</span>';
                    }
                    ele.append(html);

                }
                randerMultifyBox(selectedArr);



                angular.element(document.getElementById('conBox')).bind('click',function($event){
                    scope.$apply(function() {
                        //显示下拉
                        scope.showList = true;
                    });
                    //下拉框的位置修正
                    var height = angular.element(document.getElementById('conBoxMulti')).css('height');
                    angular.element(document.getElementById('downBox')).css('top',height);
                    

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

                            }else{

                                //点击列表选项
                                //多选
                                if(scope.isMulit){

                                    //隐藏列表
                                    scope.showList = false;
                                    //清空搜索
                                    scope.searchCon = '';
                                    //更新数据模型中的选中数组

                                    if(!contains(selectedArr,ele.val())){
                                        selectedArr.push(ele.val());
                                    }

                                    //重新渲染
                                    randerList(scope.chosenData);

                                //单选
                                }else{
                                    //隐藏列表
                                    scope.showList = false;
                                    //清空搜索
                                    scope.searchCon = '';
                                    //更新数据模型中的选中数组
                                    selectedArr[0] = ele.val();
                                    //重新渲染
                                    randerList(scope.chosenData);
                                }


                            }
                        });
                    });
                };


        
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

                //搜索
                scope.inputChange = function(){
                    var v = scope.searchCon;
                    if(v!=''){
                        var newData = parseChoseData(data,v);
                        randerList(newData);
                    }else{
                        var newData = data;
                        randerList(newData);
                    }
                }


            };
        },
        replace: true
    };
})

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

                //这部分是对“指令标签”中的子集DOM的引用，和处理
                /*transcludeFn(scope, function(clone){
                    return;
                });*/

                
                /******************************
                 * 定义
                 ******************************/

                //用来备份数据
                var cloneData = angular.copy(scope.chosenData);

                //获取双向绑定的数据
                /*var data        = scope.chosenData;
                var selectedArr = scope.setSelected;
                var changeFun   = scope.changeFunction;*/



                //自定义函数
                var isArray = Array.isArray || function(obj){
                    return Object.prototype.toString.call(obj) == '[object Array]';
                }
                scope.isArray = isArray;

                function isString(obj){
                    return Object.prototype.toString.call(obj) == '[object String]';
                }

                //字符串去前
                function trim(text){
                    if(!isString(text)){return text;}
                    return text.replace(/(^\s*)|(\s*$)/g,'');
                }
                
                function contains(arr, obj) {
                  var i = arr.length;
                  while (i--) {
                    if (arr[i] == obj) {
                      return true;
                    }
                  }
                  return false;
                }
                
                //通过value值获取name 或者值
                function getLabelOrValue(v,key){
                    for(var i=0;i<data.length;i++){
                        if(isArray(data[i])){
                            for(var j=0;j<data.length;j++){
                               if(data[i][j].value == v){
                                   return data[i][j][key];
                               }
                            }
                        }else{
                            if(data[i].value == v){
                                return data[i][key];
                            }
                        }
                    }
                }



                /******************************
                 * 初始配置
                 ******************************/

                 //默认选中
                 var defaultValue = scope.setSelected[0];
                 l(defaultValue)
                 clearActiveAttribute();
                 var defaultLabel= addAttributeByValue(defaultValue);
                 scope.chosenData = cloneData;
                 scope.myChosen = defaultLabel;

                //获取插件的配置参数
                scope.chosenSearch = !attrs['isHaveSearch'];
                scope.isMulit = (attrs['isMulit']&&attrs['isMulit']!='false') || false;

                //多选和单选的框框UI不一样
                if(scope.isMulit){
                    scope.showConBox = false;
                    scope.showConBoxMulti = true;
                }else{
                    scope.showConBox = true;
                    scope.showConBoxMulti = false;
                }
                
                //默认下拉为隐藏
                scope.showList = false;
                
                //默认搜索内容
                scope.searchCon = '';
                

                scope.showDownBox = function(e){
                    //var ele = angular.element(e.target);
                    scope.showList = true;
                    e.stopPropagation();
                }

                //搜索,根据关键词过滤数据
                scope.inputChange = function(e){

                    var newArr = [];
                    var list;
                    var label;
                    var cloneData2;

                    //获取搜索值
                    var v = trim(scope.searchCon);

                    //对于空字符串，使用“克隆数据”
                    if(v==''){
                        scope.chosenData = cloneData;
                        return;
                    }

                    //对于非空的搜索，再次对“克隆数据”进行克隆
                    cloneData2 = angular.copy(cloneData);
                    for(var i=0;i<cloneData2.length;i++){

                        list = cloneData[i];

                        //该项不为数组的时候
                        if(!isArray(list)){

                            if(list.label.indexOf(v)!=-1){
                                newArr.push(list);
                            }

                        //该项为数组的时候
                        }else{
                            
                            //空数组则不处理
                            if(list.length==0){
                                break;
                            }

                            //构建新的子数据，添加第一个作为标题元素
                            var sonArr = [list[0]];

                            for(var j=0;j<list.length;j++){

                                //如果标题中就有关键词，把该子类全部添加上，跳出循环
                                if(list[0].label.indexOf(v)!=-1){
                                    newArr.push(list);
                                    break;

                                //若不是标题，那么对子类循环判断，只有满足条件的添加
                                }else{
                                    if(list[j].label.indexOf(v)!=-1){
                                        sonArr.push(list[j]);
                                    }
                                }

                            }

                            //子级别至少有1个符合搜索的条件（因为标题就占据一行）
                            if(sonArr.length>1){
                                newArr.push(sonArr);
                            }

                        }

                    }
                    scope.chosenData = newArr;

                };


                //通过value值来为指定对象添加属性active为true
                function addAttributeByValue(v){
                    for(var i=0;i<cloneData.length;i++){
                        if(isArray(cloneData[i])){
                            for(var j=0;j<cloneData[i].length;j++){
                                if(cloneData[i][j].value == v){
                                    cloneData[i][j].active = true;
                                    return cloneData[i][j].label;
                                }
                            }
                        }else{
                            if(cloneData[i].value == v){
                                cloneData[i].active = true;
                                return cloneData[i].label;
                            }
                        }
                    }
                }

                function clearActiveAttribute(){
                    for(var i=0;i<cloneData.length;i++){
                        if(isArray(cloneData[i])){
                            for(var j=0;j<cloneData[i].length;j++){
                                cloneData[i][j].active = false;
                            }
                        }else{
                            cloneData[i].active = false;
                        }
                    }
                }

                //事件
                scope.listClick = function(e){
                    var value = '';
                    var label = '';
                    var ele = angular.element(e.target);

                    if(ele.hasClass('forbid')){
                        return;
                    }

                    if(ele[0].tagName=='LI'){
                        value = trim(ele.attr('value'));
                        label = trim(ele.attr('label'));
                    }else{
                        value = trim(ele.parent().attr('value'));
                        label = trim(ele.parent().attr('label'));
                    }

                    clearActiveAttribute();
                    addAttributeByValue(value);

                    scope.myChosen = label;
                    scope.showList = false;
                    scope.chosenData = cloneData;
                    scope.searchCon = '';


                    //选中
                    scope.setSelected = [value];

                    //回调
                    scope.changeFunction(label,value,scope.setSelected);

                    e.stopPropagation();
                }


                angular.element(document.querySelector('.downBox')).bind('click',function(e){
                    e.stopPropagation();
                })

                angular.element(document.getElementsByTagName('body')).bind('click',function(e){
                    scope.$apply(function(){
                        scope.showList = false;
                    });
                    
                })









            };
        },
        replace: true
    };
})

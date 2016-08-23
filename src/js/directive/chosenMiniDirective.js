appDirectives.directive('chosenMiniDirective', function($rootScope,$timeout) {
    return {
    	restrict: 'AE',
    	replace: 'true',
    	templateUrl: './html/directive/chosenMini.html',
        scope: {
    		'chosenData'    : '=',
    	    'setSelected'   : '=',
            'changeFunction': '=',
    	    'deleteMultiLabel': '=',
            'isHaveSearch': '='
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

                //这个不需在这里控制
                //scope.isHaveSearch = false;
                
                function autoTop(){
                    /*l(123)
                    angular.element(document.querySelector('.downBox')[0]).css('top',100);
*/
                    /*var height = angular.element(document.getElementById('conBoxMulti')).css('height');
                    angular.element(document.getElementById('downBox')).css('top',height);*/
                                   
                }
                autoTop()
                
                //自定义函数
                var isArray = Array.isArray || function(obj){
                    return Object.prototype.toString.call(obj) == '[object Array]';
                }
                scope.isArray = isArray;

                function isString(obj){
                    return Object.prototype.toString.call(obj) == '[object String]';
                }

                /*function removeFromArray (v,arr) {
                    var index = arr.indexOf(v); 
                    if (index > -1) { arr.splice(index, 1); } 
                };*/

                //多选的标签
                scope.mutiLabels=[];

                //l(scope.mutiLabels)
                for(var i=0;i<scope.setSelected.length;i++){
                    scope.mutiLabels.push(getObjByValue(scope.chosenData,scope.setSelected[i]));
                }
                //l(scope.mutiLabels)

                scope.mutiLabelClick = function(e){
                    var value = angular.element(e.target).parent().attr('value');
                    removeAttributeByValue(value);

                    var label;
                    //移除
                    for(var i=0;i<scope.mutiLabels.length;i++){
                        if(scope.mutiLabels[i].value==value){
                            label = scope.mutiLabels[i].label;
                            scope.mutiLabels.splice(i, 1);
                        }
                    }
                    //移除
                    for(var i=0;i<scope.setSelected.length;i++){
                        if(scope.setSelected[i]==value){
                            scope.setSelected.splice(i, 1);
                        }
                    }

                    scope.deleteMultiLabel(label,value,scope.setSelected);

                    e.stopPropagation();
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
                
                //通过value值获取对象
                function getObjByValue(data,v){
                    for(var i=0;i<data.length;i++){
                        if(isArray(data[i])){
                            for(var j=0;j<data[i].length;j++){
                               if(data[i][j].value == v){
                                   return data[i][j];
                               }
                            }
                        }else{
                            if(data[i].value == v){
                                return data[i];
                            }
                        }
                    }
                }



                /******************************
                 * 初始配置
                 ******************************/
                //获取插件的配置参数
                scope.chosenSearch = !attrs['isHaveSearch'];
                scope.isMulit = (attrs['isMulit']&&attrs['isMulit']!='false') || false;

   

                 //默认选中
                 if(scope.isMulit){
                    
                    //给数据中添加上active
                    for(var i=0;i<scope.setSelected.length;i++){
                        v = scope.setSelected[i];
                        addAttributeByValue(v);
                    }
                    
                 }else{
                    var defaultValue = scope.setSelected[0];
                    clearActiveAttribute();
                    var defaultLabel= addAttributeByValue(defaultValue);
                 }

                 

                 scope.chosenData = cloneData;
                 scope.myChosen = defaultLabel;

  
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
                    scope.showList = !scope.showList;
                    //这句话不写很关键！！其实我是需要他冒泡到body的
                    //e.stopPropagation();
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
                //通过value值来为指定对象添加属性active为true
                function removeAttributeByValue(v){
                    for(var i=0;i<cloneData.length;i++){
                        if(isArray(cloneData[i])){
                            for(var j=0;j<cloneData[i].length;j++){
                                if(cloneData[i][j].value == v){
                                    cloneData[i][j].active = false;
                                    return cloneData[i][j].label;
                                }
                            }
                        }else{
                            if(cloneData[i].value == v){
                                cloneData[i].active = false;
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


                    if(ele[0].tagName=='LI'){
                         if(ele.hasClass('active')){
                            scope.showList = false;
                            return;
                         }  
                        if(ele.hasClass('forbid')){return;}
                        value = trim(ele.attr('value'));
                        label = trim(ele.attr('label'));
                    }else{
                         if(ele.parent().hasClass('active')){
                            scope.showList = false;
                            return;
                         }
                        if(ele.parent().hasClass('forbid')){return;}
                        value = trim(ele.parent().attr('value'));
                        label = trim(ele.parent().attr('label'));
                    }

                    if(scope.isMulit){
                           
                    }else{
                       clearActiveAttribute();
                    }

                    addAttributeByValue(value);

                    scope.myChosen = label;
                    scope.showList = false;
                    scope.chosenData = cloneData;
                    scope.searchCon = '';


                    if(scope.isMulit){
                        //多选的
                        if(ele.hasClass('active')){
                        }else{  
                            scope.mutiLabels.push(getObjByValue(scope.chosenData,value));
                            scope.setSelected.push(value)
                        }
                    }else{
                        //选中
                        scope.setSelected = [value];
                    }

                    autoTop();


                    //回调
                    scope.changeFunction(label,value,scope.setSelected);

                    e.stopPropagation();
                }


                angular.element(document.querySelector('.downBox')).bind('click',function(e){
                    e.stopPropagation();
                })

                //这种写法是不好的，改成下面的方法就很赞
                /*angular.element(document.getElementsByTagName('body')).bind('click',function(e){
                    scope.$apply(function(){
                        scope.showList = false;
                    });                    
                })*/

                //这个写法借鉴chosen的
                //这样子写的目的就是：我在有多个实例的时候，点击这个的时候，那个会隐藏！
                var _body = angular.element(document.getElementsByTagName('body'));
                scope.$watch('showList', function() {
                    if (scope.showList == true) {
                        $timeout(function() {
                            _body.bind('click', function(e) {
                                var _parent = angular.element(e.target);
                                for (var i = 0; i < 5; i++) {
                                    if (_parent.parent().length == 0) {
                                        break
                                    }
                                    if (element[0] == _parent.parent()[0]) {
                                        return false
                                    } else {
                                        _parent = _parent.parent();
                                    }
                                }
                                scope.$apply(function() {
                                    scope.showList = false;
                                });
                            });
                        }, 10);
                    } else {
                        _body.unbind('click');
                    }
                });








            };
        },
        replace: true
    };
})

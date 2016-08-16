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
                var data        = scope.chosenData;
                var selectedArr = scope.setSelected;
                var changeFun   = scope.changeFunction;

                //自定义函数
                var isArray = Array.isArray || function(obj){
                    return Object.prototype.toString.call(obj) == '[object Array]';
                }
                scope.isArray = isArray;

                //字符串去前
                function trim(text){
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
                scope.showList = true;
                
                //默认搜索内容
                scope.searchCon = '';
                
                //默认选中显示第一个label值
                if(!selectedArr){
                    selectedArr = [];
                    scope.myChosen = data[0].label;
                }

                //如果数据不存在
                if(!isArray(data) || !data || data.length==0){
                    data = scope.chosenData = [{label:'无数据',disabled:true}];
                }


                /******************************
                 * 事件绑定、事件回调
                 ******************************/

                //点击其他收回下拉
                /*angular.element(document.getElementsByTagName('body')).bind('click',function($event){
                    scope.$apply(function() {
                        scope.showList = false;
                    });
                });*/

                //点击内容框展开下拉
                scope.showDownBox = function($event){
                    //显示下拉
                    scope.showList = true;
                    //阻止事件上溯
                    $event.stopPropagation();
                    //下拉框的位置修正
                    /*var height = angular.element(document.getElementById('conBoxMulti')).css('height');
                    angular.element(document.getElementById('downBox')).css('top',height);*/
                }
                


                /******************************
                 * 渲染
                 ******************************/
                
                //渲染列表
                //randerList(data);
                
                //渲染复选的框框
                randerMultifyBox(selectedArr);

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
                
                //渲染复选的框框
                function randerMultifyBox(data){
                    var html ='';
                    var ele = angular.element(document.getElementById('conBoxMulti'));
                    for(var i=0;i<data.length;i++){
                        var label = getLabelOrValue(data[i],'label');
                        var value = getLabelOrValue(data[i],'value');
                        html += '<span class="nameBox" myLabel="'+label+'" myValue="'+value+'">'+label+' <i>X</i></span>';
                    }

                    //添加元素
                    ele.html('').append(html);
                    //绑定事件
                    ele.find('i').bind('click',function(){
                        var thisEle = angular.element(this).parent();

                        var myValue = thisEle.attr('myValue');
                        //从数组中删除
                        for(var i=0;i<data.length;i++){
                            if(myValue == data[i]){
                                data.splice(i,1);
                            }
                        }

                        randerMultifyBox(data);
                        randerList(scope.chosenData);
                    });

                }
                


                


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
                                    }else{
                                        //从数组中删除
                                        for(var i=0;i<selectedArr.length;i++){
                                            if(ele.val() == selectedArr[i]){
                                                selectedArr.splice(i,1);
                                            }
                                        }
                                    }

                                    //重新渲染
                                    randerList(scope.chosenData);
                                    randerMultifyBox(selectedArr);

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
                                    randerMultifyBox(selectedArr);
                                }


                            }
                        });
                    });
                };


                //搜索,根据关键词过滤数据
                scope.inputChange = function(){

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







            };
        },
        replace: true
    };
})

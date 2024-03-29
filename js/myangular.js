/**
 * Created by ZhuXinpei on 2014-08-05.
 */

var serverIp = window.location.host;
var siteIp = (getQueryString(siteIp)==null)?"192.10.110.206":getQueryString(siteIp);
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}

var app = angular.module('main', ['angular-websocket','toggle-switch'], angular.noop);
app.config(function(WebSocketProvider){
    var wsURL = "ws://"+serverIp+"/WisoftServers/message?siteIp="+siteIp;
    WebSocketProvider.prefix('').uri(wsURL);
});

app.filter('serviceStatus',function(){
    var filter = function(input){
        switch (input)
        {
            case 0:
                return "正在启动";
                break;
            case 1:
                return "正在运行";
            case 2:
                return "正在停止";
            case 3:
                return "已停止";
        }
    };
    return filter;
});


app.filter('searcher',function(){
    var filter = function(input,key1,key2){
        var result = [];
        angular.forEach(input,function(value,key){
            var isFilter = false;
            switch (key2)
            {
                case '全  部':
                    break;
                case  '已停止':
                    if(value.operation!=3)
                    {
                        isFilter = true;
                    }
                    break;
                case '已运行':
                    if(value.operation!=1)
                    {
                        isFilter = true;
                    }
                    break;
            }

            if(!isFilter){
                if(key1==null||value.port.indexOf(key1)>-1||value.name.indexOf(key1)>-1){
                    result.push(value);
                }
            }
        });
        return result;
    };
    return filter;
});

app.controller('DemoCtrl', function($scope,$http,WebSocket) {
        $http({
            method : 'POST',
            url : 'http://'+serverIp+'/WisoftServers/initServlet',
            params : {adminPassword:null}
        }).then(function(response) {
            if("true"==response.data)
            {
                $scope.isAdmin = true;
            }
        });
        $scope.isAdmin = false;
        $scope.adminPassword=null;
        $scope.loginadmin = function(){
            console.log($scope.adminPassword);
            $http({
                method : 'POST',
                url : 'http://'+serverIp+'/WisoftServers/initServlet',
                params : {adminPassword:$scope.adminPassword}
            }).then(function(response) {
                if("true"==response.data)
                {
                    $scope.isAdmin = true;
                }
               else alert('密码不对哦~');
            });
        };
        $scope.loginout = function(){
            console.log($scope.adminPassword);
            $http({
                method : 'POST',
                url : 'http://'+serverIp+'/WisoftServers/initServlet',
                params : {isLogout:true}
            }).then(function() {
                    $scope.isAdmin = false;
                    $scope.adminPassword=null;
            });
        };
        $scope.titleName="演示服务器";
        $scope.serverIp = "未知";
        $scope.freeMon = "未知";
        $scope.totalMon ="未知";
        $scope.cpuPercent = "0%";
        //0表示正在启动，1表示已启动,2表示正在停止，3表示已停止
        $scope.tableData= [];
       // $scope.tableData1=servicesList.data;
        WebSocket.uri = "ws://"+serverIp+"/WisoftServers/message?siteIp="+siteIp;
        WebSocket.onopen(function() {
        });

        WebSocket.onclose(function(){
          //  console.log("关掉了websocket");
            $scope.titleName="控制台被关闭";
            $scope.serverIp = "未知";
            $scope.freeMon = "未知";
            $scope.totalMon ="未知";
            $scope.cpuPercent = "0%";
            $scope.tableData=[];
        });
        WebSocket.onmessage(function(event) {
           var info = JSON.parse(event.data);
           // console.log("我收到的信息：",info);
            if (info.sitename!=null) {
                $scope.titleName=info.sitename;
                $scope.serverIp = info.siteid;
                var sysinfo = info.sysinfo;
                $scope.freeMon = sysinfo!=null?(sysinfo.freePhysicalMemorySize/(1024*1024)).toFixed(2)+"GB":"未知";
                $scope.totalMon = sysinfo!=null?(sysinfo.totalMemorySize/(1024*1024)).toFixed(2)+"GB":"未知";
                $scope.cpuPercent = sysinfo!=null?sysinfo.cpuRatio+"%":"未知";
                if(sysinfo==null) $scope.tableData = [];
            }
           else
                $scope.tableData = info;
        });

        $scope.operationServer=function(item,type,event){
            event.stopPropagation();
            var operationLog = new Object();
            operationLog.operateTime = null;
            operationLog.operateType = type;
            operationLog.operateIp = null;
            operationLog.opreateSid = item.sid;
            operationLog.siteName = $scope.serverIp;
            WebSocket.send(JSON.stringify(operationLog));
        }
        $scope.ExpandNum = -1;
        $scope.showDetail = function($index){
           // console.log('测试点击','点击行');
            if($index==$scope.ExpandNum)
                $scope.ExpandNum = -1;
            else
                $scope.ExpandNum = $index;
        }

});


var applog = angular.module('log', ['angular-websocket','toggle-switch'], angular.noop).config(function(WebSocketProvider,$locationProvider){
    var wsURL = "ws://"+serverIp+"/WisoftServers/logs";
    WebSocketProvider.prefix('').uri(wsURL);
    $locationProvider.html5Mode(true);
});
applog.controller('logCtrl',function($scope,WebSocket,$location,$anchorScroll){
    $scope.titleName =$location.search().name;
    $scope.sid = $location.search().sid;
    $scope.iskeyword = true;
    $scope.isScroll = true;
    $scope.keyword = "com.wisoft";
    $scope.logs =[];
    WebSocket.onopen(function(){
        WebSocket.send($scope.sid);
    });
    WebSocket.onmessage(function(event) {
        console.log(event.data);
        var logs =JSON.parse(event.data);
        angular.forEach(logs,function(log){
            $scope.logs.push(log);
        });
    });
    $scope.scrollToBottom=function(){
        if($scope.isScroll){
            $location.hash('msg_end');
            $anchorScroll();
        }
    }

});

applog.directive('log1', function($compile) {

    var log = {
        restrict: 'E',//指令的使用方式，包括标签，属性，类，注释

        template: "<pre ng-transclude></pre>",//指令使用的模板，用HTML字符串的形式表示

        replace: true,//是否用模板替换当前元素，若为false，则append在当前元素上

        transclude: true,//是否将当前元素的内容转移到模板中


        link : function postLink(scope,element){

            console.log(scope.logitem+'!|'+scope.keyword);
            var str = scope.logitem;
            var a = new RegExp(scope.keyword ,"gi");//全局 忽略大小写
            var str = str.replace(a,('<span class="highlight">'+scope.keyword +'</span>'));
            element[0].innerHTML=str;
            scope.scrollToBottom();
        }


    };

    return log;

});

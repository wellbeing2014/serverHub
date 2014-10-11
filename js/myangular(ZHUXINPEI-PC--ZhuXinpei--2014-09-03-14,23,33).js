/**
 * Created by ZhuXinpei on 2014-08-05.
 */

var app = angular.module('main', ['angular-websocket'], angular.noop).config(function(WebSocketProvider){
    var wsURL = "ws://localhost:8001/WisoftServers/message";
    WebSocketProvider
        .prefix('')
        .uri(wsURL);
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
//app.service('servicesList', function () {
//    var wsURL = "ws://localhost:8001/WisoftServers/message";
//
//    var data = {};
//    var aaa='测试是是不是';
//    var ws = null;
//    var connected = false;
//
//    function newWebSocket() {
//        // var wsURL = "ws://10.188.199.4:8080/YIXUN_1.5_WEB/websocket/";
//        var wsURL = "ws://localhost:8001/WisoftServers/message";
//        var wsTmp = new WebSocket(wsURL);
//        console.log('创建成功...');
//        wsTmp.onopen = function (evnt) {
//            onOpen(evnt)
//        };
//        wsTmp.onmessage = function (evnt) {
//            onMessage(evnt)
//        };
//        wsTmp.onclose = function (evnt) {
//            onclose(evnt)
//        };
//        wsTmp.onerror = function (evnt) {
//            onError(evnt)
//        };
//        return wsTmp;
//    }
//
//    ws = newWebSocket();
//
//    function onOpen() {
//        ws.readyState = true;
//        updateStatus("onOpen : " + (connected ? 'TTRRUUEE' : 'FFAALLESS'));
//    }
//
//    function onclose() {
//        ws.readyState = false;
//        updateStatus("onClosed : " + (connected ? 'TTRRUUEE' : 'FFAALLESS'));
//
//    }
//
//    function onMessage(evnt) {
//        //这里处理接收数据
//        var evenData = JSON.parse(evnt.data);
//
//       this.data=evenData;
//        console.log('接收数据：',this.data);
//    }
//
//    function onError(evnt) {
//        ws.readyState = false;
//        console.log('ERROR: ', evnt);
//
//    }
//
//    function updateStatus(status) {
//        console.log(status);
//    }
//});


app.controller('DemoCtrl', function($scope,WebSocket) {

        $scope.titleName="演示服务器";

        $scope.freeMon = "未知";
        $scope.totalMon ="未知";
        $scope.cpuPercent = "0%";
        //0表示正在启动，1表示已启动,2表示正在停止，3表示已停止
        $scope.tableData=
            [   {"port":"8080","no":"0","name":"无锡行政服务中心系统","url":"http://www.baidu.com/","operation":3,"dburl":"1","path":"1","sid":"298dc17b1abc424db68aa91538f0cc42"},
                {"port":"8080","no":"1","name":"中科惠软信息管理系统","url":"http://192.10.110.206/qlyg/","operation":0,"locked":true,"dburl":"1","path":"1","sid":"1fe0a14c9a904562976557d94e3fb1ee"},
                {"port":"8080","no":"0","name":"无锡行政服务中心系统","url":"http://192.10.110.206/qlyg/","operation":1,"locked":true,"dburl":"1","path":"1","sid":"298dc17b1abc424db68aa91538f0cc42"},
                {"port":"8080","no":"1","name":"中科惠软信息管理系统","url":"http://192.10.110.206/qlyg/","operation":2,"locked":true,"dburl":"1","path":"1","sid":"1fe0a14c9a904562976557d94e3fb1ee"},
                {"port":"8080","no":"0","name":"无锡行政服务中心系统","url":"http://192.10.110.206/qlyg/","operation":3,"locked":false,"dburl":"1","path":"1","sid":"298dc17b1abc424db68aa91538f0cc42"},
                {"port":"8080","no":"0","name":"无锡行政服务中心系统","url":"http://192.10.110.206/qlyg/","operation":3,"dburl":"1","path":"1","sid":"298dc17b1abc424db68aa91538f0cc42"},
                {"port":"8080","no":"1","name":"中科惠软信息管理系统","url":"http://192.10.110.206/qlyg/","operation":0,"locked":true,"dburl":"1","path":"1","sid":"1fe0a14c9a904562976557d94e3fb1ee"},
                {"port":"8080","no":"0","name":"无锡行政服务中心系统","url":"http://192.10.110.206/qlyg/","operation":1,"locked":true,"dburl":"1","path":"1","sid":"298dc17b1abc424db68aa91538f0cc42"},
                {"port":"8080","no":"1","name":"中科惠软信息管理系统","url":"http://192.10.110.206/qlyg/","operation":2,"locked":true,"dburl":"1","path":"1","sid":"1fe0a14c9a904562976557d94e3fb1ee"},
                {"port":"8080","no":"0","name":"无锡行政服务中心系统","url":"http://192.10.110.206/qlyg/","operation":3,"locked":false,"dburl":"1","path":"1","sid":"298dc17b1abc424db68aa91538f0cc42"},
                {"port":"8080","no":"0","name":"无锡行政服务中心系统","url":"http://192.10.110.206/qlyg/","operation":3,"dburl":"1","path":"1","sid":"298dc17b1abc424db68aa91538f0cc42"},
                {"port":"8080","no":"1","name":"中科惠软信息管理系统","url":"http://192.10.110.206/qlyg/","operation":0,"locked":true,"dburl":"1","path":"1","sid":"1fe0a14c9a904562976557d94e3fb1ee"},
                {"port":"8080","no":"0","name":"无锡行政服务中心系统","url":"http://192.10.110.206/qlyg/","operation":1,"locked":true,"dburl":"1","path":"1","sid":"298dc17b1abc424db68aa91538f0cc42"},
                {"port":"8080","no":"1","name":"中科惠软信息管理系统","url":"http://192.10.110.206/qlyg/","operation":2,"locked":true,"dburl":"1","path":"1","sid":"1fe0a14c9a904562976557d94e3fb1ee"},
                {"port":"8080","no":"0","name":"无锡行政服务中心系统","url":"http://192.10.110.206/qlyg/","operation":3,"locked":false,"dburl":"1","path":"1","sid":"298dc17b1abc424db68aa91538f0cc42"}
            ];
       // $scope.tableData1=servicesList.data;

        WebSocket.onopen(function() {

        });

        WebSocket.onclose(function(){
            console.log("关掉了websocket");
            $scope.titleName="演示服务器(这个是好看好看的)";

            $scope.freeMon = "未知";
            $scope.totalMon ="未知";
            $scope.cpuPercent = "0%";

            $scope.tableData=
                [   {"port":"8080","no":"0","name":"无锡行政服务中心系统","url":"http://www.baidu.com/","operation":3,"dburl":"11231231","path":"1231231","sid":"298dc17b1abc424db68aa91538f0cc42"},
                    {"port":"8080","no":"1","name":"中科惠软信息管理系统","url":"http://192.10.110.206/qlyg/","operation":0,"locked":true,"dburl":"1","path":"1","sid":"1fe0a14c9a904562976557d94e3fb1ee"},
                    {"port":"8080","no":"0","name":"无锡行政服务中心系统","url":"http://192.10.110.206/qlyg/","operation":1,"locked":true,"dburl":"1","path":"1","sid":"298dc17b1abc424db68aa91538f0cc42"},
                    {"port":"8080","no":"1","name":"中科惠软信息管理系统","url":"http://192.10.110.206/qlyg/","operation":2,"locked":true,"dburl":"1","path":"1","sid":"1fe0a14c9a904562976557d94e3fb1ee"},
                    {"port":"8080","no":"0","name":"无锡行政服务中心系统","url":"http://192.10.110.206/qlyg/","operation":3,"locked":false,"dburl":"1","path":"1","sid":"298dc17b1abc424db68aa91538f0cc42"},
                    {"port":"8080","no":"0","name":"无锡行政服务中心系统","url":"http://192.10.110.206/qlyg/","operation":3,"dburl":"1","path":"1","sid":"298dc17b1abc424db68aa91538f0cc42"},
                    {"port":"8080","no":"1","name":"中科惠软信息管理系统","url":"http://192.10.110.206/qlyg/","operation":0,"locked":true,"dburl":"1","path":"1","sid":"1fe0a14c9a904562976557d94e3fb1ee"},
                    {"port":"8080","no":"0","name":"无锡行政服务中心系统","url":"http://192.10.110.206/qlyg/","operation":1,"locked":true,"dburl":"1","path":"1","sid":"298dc17b1abc424db68aa91538f0cc42"},
                    {"port":"8080","no":"1","name":"中科惠软信息管理系统","url":"http://192.10.110.206/qlyg/","operation":2,"locked":true,"dburl":"1","path":"1","sid":"1fe0a14c9a904562976557d94e3fb1ee"},
                    {"port":"8080","no":"0","name":"无锡行政服务中心系统","url":"http://192.10.110.206/qlyg/","operation":3,"locked":false,"dburl":"1","path":"1","sid":"298dc17b1abc424db68aa91538f0cc42"},
                    {"port":"8080","no":"0","name":"无锡行政服务中心系统","url":"http://192.10.110.206/qlyg/","operation":3,"dburl":"1","path":"1","sid":"298dc17b1abc424db68aa91538f0cc42"},
                    {"port":"8080","no":"1","name":"中科惠软信息管理系统","url":"http://192.10.110.206/qlyg/","operation":0,"locked":true,"dburl":"1","path":"1","sid":"1fe0a14c9a904562976557d94e3fb1ee"},
                    {"port":"8080","no":"0","name":"无锡行政服务中心系统","url":"http://192.10.110.206/qlyg/","operation":1,"locked":true,"dburl":"1","path":"1","sid":"298dc17b1abc424db68aa91538f0cc42"},
                    {"port":"8080","no":"1","name":"中科惠软信息管理系统","url":"http://192.10.110.206/qlyg/","operation":2,"locked":true,"dburl":"1","path":"1","sid":"1fe0a14c9a904562976557d94e3fb1ee"},
                    {"port":"8080","no":"0","name":"无锡行政服务中心系统","url":"http://192.10.110.206/qlyg/","operation":3,"locked":false,"dburl":"1","path":"1","sid":"298dc17b1abc424db68aa91538f0cc42"}
                ];
        });
        WebSocket.onmessage(function(event) {
           var info = JSON.parse(event.data)[0];
            if (info==null) return ;
            $scope.titleName=info.sitename;
            var sysinfo = info.sysinfo;
            $scope.freeMon = sysinfo!=null?(sysinfo.freePhysicalMemorySize/(1024*1024)).toFixed(2)+"GB":"未知";
            $scope.totalMon = sysinfo!=null?(sysinfo.totalMemorySize/(1024*1024)).toFixed(2)+"GB":"未知";
            $scope.cpuPercent = sysinfo!=null?sysinfo.cpuRatio+"%":"未知";

            $scope.tableData = JSON.parse(info.serversJsonStr);
            console.log('message: ', $scope.tableData);

        });

        $scope.operationServer=function(item,type,event){
            console.log('测试点击',item.sid+"|"+type);
            var operationLog = null;
            operationLog.operateTime = null;
            operationLog.operateType = '启动';
            operationLog.operateIp = null;
            operationLog.opreateSid = item.sid;
            operationLog.sitename = 
            event.stopPropagation();
        }

        $scope.ExpandNum = -1;
        $scope.showDetail = function($index){
            console.log('测试点击','点击行');
            if($index==$scope.ExpandNum)
                $scope.ExpandNum = -1;
            else
                $scope.ExpandNum = $index;
        }

});


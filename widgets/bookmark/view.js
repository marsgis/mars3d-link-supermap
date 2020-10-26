﻿var thisWidget;
var $table;

function getHeight() {
    return $(window).height() - 50;
}

//当前页面业务
function initWidgetView(_thisWidget) {
    thisWidget = _thisWidget;

    if (thisWidget.config && thisWidget.config.style) { //适应不同样式
        $("body").addClass(thisWidget.config.style);
    }

    $("#btn_bookmark_Add").bind('click', function () {
        saveBookmark();
    });

    $table = $('#table');
    $table.bootstrapTable({
        height: getHeight(),
        singleSelect: true, //单选
        pagination: false,
        pageSize: 6,
        iconsPrefix: 'fa',
        showHeader:false,
        columns: [
            {
                title: '',
                sortable: true,
                editable: false,
                align: 'center',
                events: {
                    'click .remove': function (e, value, row, index) {
                        delBookMark(row.id);
                    }, 
                },
                formatter: function (value, row, index) {
                    return `<div class="bookmarkitem" title="${row.name}">
                        <img src="${row.icon}" style="width:100%;" />
                        <div class="title">
                            ${row.name}
                            <a class="remove" href="javascript:void(0)" title="删除"><i class="fa fa-trash"></i></a>
                         </div>
                    </div>`;
                }
            }, 
        ],
        onClickRow: function (rowData, $element, field) {
            var location = rowData.data;
            thisWidget.showExtent(location);
        }
    });
    $(window).resize(function () {
        $table.bootstrapTable('refreshOptions', {
            height: getHeight()
        });
    });

    //读取localStorage
    initBookMarkList();
}


var cookieName = "muyao1987_bookmark";
var arrBookmark = [];

function initBookMarkList() {
    if (window.parent.hasServer) {
        //后台接口
        parent.sendAjax({
            url: "v1/map/bookmark/list",
            type: "get",
            dataType: "json",
            contentType: "application/x-www-form-urlencoded",
            success: function (result) {
                var arr = [];
                for (var i = 0; i < result.length; i++) {
                    var itme = result[i];
                    if (!itme) continue;
                    arr.push({
                        name: itme.name,
                        data: JSON.parse(itme.center),
                        id: itme.id
                    });
                }
                arrBookmark = arr;
                showListData(arrBookmark);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("服务出错：" + XMLHttpRequest.statusText + "，代码 " + XMLHttpRequest.status);
            },
        });
    } else {
        var lastcookie = haoutil.storage.get(cookieName); //读取localStorage值
        if (lastcookie != null)
            arrBookmark = eval(lastcookie);
        if (arrBookmark == null || arrBookmark.length == 0) {
            arrBookmark = [];
            // var bounds = thisWidget.getDefaultExtent();
            // arrBookmark.push({
            //     name: "默认位置",
            //     data: bounds, 
            //     id: new Date().getTime()
            // });
        }
        showListData(arrBookmark);
    }
}

//添加
function saveBookmark() {
    if (arrBookmark == null)
        arrBookmark = [];

    var name = $.trim($("#txt_bookmark_name").val()).replace("'", "").replace('"', "");
    if (name.length == 0) {
        toastr.warning('请输入名称');
        return;
    }
    for (var index = arrBookmark.length - 1; index >= 0; index--) {
        if (arrBookmark[index].name == name) {
            toastr.info('该名称已存在，请更换！');
            return;
        }
    }

    thisWidget.getThisExtent(function (bounds, base64) {
        arrBookmark.insert({
            name: name,
            data: bounds,
            icon: base64,
            id: new Date().getTime()
        },0);

        if (window.parent.hasServer) {
            //后台保存接口
            parent.sendAjax({
                url: "v1/map/bookmark/add",
                data: JSON.stringify({
                    name: name, //名称	
                    center: JSON.stringify(bounds), //中心	
                }),
                type: "post",
                dataType: "json",
                contentType: "application/json",
                success: function (result) {
                    $("#txt_bookmark_name").val("");
                    initBookMarkList();
                }
            });
        } else {
            //本地存储
            lastcookie = JSON.stringify(arrBookmark);
            haoutil.storage.add(cookieName, lastcookie);
            $("#txt_bookmark_name").val("");
            initBookMarkList();
        }
    });
}



function delBookMark(id) {
    if (window.parent.hasServer) {
        //后台 删除
        parent.sendAjax({
            url: "v1/map/bookmark/" + id,
            type: "delete",
            dataType: "json",
            contentType: "application/json",
            success: function (result) {
                for (var index = arrBookmark.length - 1; index >= 0; index--) {
                    if (arrBookmark[index].id == id) {
                        arrBookmark.splice(index, 1);
                        showListData(arrBookmark);
                        break;
                    }
                }
            }
        })
    } else {
        for (var index = arrBookmark.length - 1; index >= 0; index--) {
            if (arrBookmark[index].id == id) {
                arrBookmark.splice(index, 1);
                var lastcookie = JSON.stringify(arrBookmark);
                haoutil.storage.add(cookieName, lastcookie);
                showListData(arrBookmark);
                break;
            }
        }
    }

}


function showListData(arr) {
    var positon = $table.bootstrapTable("getScrollPosition");
    $table.bootstrapTable("load", arr);
    $table.bootstrapTable("scrollTo", positon);
}


function savebookmark2json(name, data) {
    var file = JSON.stringify(data);

    haoutil.file.downloadFile("书签_" + name + ".json", file);

}
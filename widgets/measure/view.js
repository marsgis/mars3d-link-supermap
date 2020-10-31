//对应widget.js中MyWidget实例化后的对象
var thisWidget;

//当前页面业务
function initWidgetView(_thisWidget) {
    thisWidget = _thisWidget;


    if (thisWidget.config && thisWidget.config.style) {
        $("body").addClass(thisWidget.config.style);
    }

    $("#measure_area_danwei").val("auto"); //默认值
    $("#measure_length_danwei").val("auto"); //默认值



    $('#btn_measure_length').bind('click', function () {
        $("#lbl_measure_result").html("");
        $('#measure_danwei').show();
        $('#measure_area_danwei').hide();
        $('#measure_length_danwei').show();

        thisWidget.measure.length({
            unit: $('#measure_length_danwei').val(),
            addHeight: 0.5,  //在绘制点基础自动增加高度（单位：米） 
        });
    });


    $('#btn_measure_length_td').bind('click', function () {
        //用户首次使用时，提醒一次
        haoutil.oneMsg('贴地需要地形服务支撑，部分区域可能无法贴地！', 'measure_length_tip');

        $("#lbl_measure_result").html("");
        $('#measure_danwei').show();
        $('#measure_area_danwei').hide();
        $('#measure_length_danwei').show();

        thisWidget.measure.surfaceLength({
            unit: $('#measure_length_danwei').val(),
        });
    });


    $('#btn_measure_section').bind('click', function () {
        //用户首次使用时，提醒一次
        haoutil.oneMsg('剖面需要地形服务支撑，部分区域可能无法获取高程值！', 'measure_section_tip');

        $("#lbl_measure_result").html("");
        $('#measure_danwei').show();
        $('#measure_area_danwei').hide();
        $('#measure_length_danwei').show();

        thisWidget.measure.section({
            unit: $('#measure_length_danwei').val(),
            splitNum: 300, //插值次数 
        });
    });



    $('#btn_measure_area').bind('click', function () {
        $("#lbl_measure_result").html("");
        $('#measure_danwei').show();
        $('#measure_length_danwei').hide();
        $('#measure_area_danwei').show();

        thisWidget.measure.area({
            unit: $('#measure_area_danwei').val(),
            style: {
                color: "#00fff2",
                outline: true,
                outlineColor: "#fafa5a",
                outlineWidth: 1,
                opacity: 0.4,
                clampToGround: false //贴地
            },
        });
    });


    $('#btn_measure_area_td').bind('click', function () {
        $("#lbl_measure_result").html("");
        $('#measure_danwei').show();
        $('#measure_length_danwei').hide();
        $('#measure_area_danwei').show();

        thisWidget.measure.surfaceeArea({
            unit: $('#measure_area_danwei').val(),
            splitNum: 10,//step插值分割的个数 
        });
    });


    $('#btn_measure_angle').bind('click', function () {
        $("#lbl_measure_result").html("");
        $('#measure_danwei').hide();

        thisWidget.measure.angle();
    });

    $('#btn_measure_point').bind('click', function () {
        $("#lbl_measure_result").html("");
        $('#measure_danwei').hide();

        thisWidget.measure.point();
    });




    $('#btn_measure_height').bind('click', function () {
        $("#lbl_measure_result").html("");
        $('#measure_danwei').show();
        $('#measure_area_danwei').hide();
        $('#measure_length_danwei').show();

        thisWidget.measure.height({
            unit: $('#measure_length_danwei').val(),
        });
    });

    $('#btn_measure_supHeight').bind('click', function () {
        $("#lbl_measure_result").html("");
        $('#measure_danwei').show();
        $('#measure_area_danwei').hide();
        $('#measure_length_danwei').show();

        thisWidget.measure.triangleHeight({
            unit: $('#measure_length_danwei').val(),
        });
    });

    $('#btn_measure_clear').bind('click', function () {
        $("#lbl_measure_result").html("");

        thisWidget.clearDraw();
    });

    //更换单位
    $("#measure_length_danwei").change(function (e) {
        var danwei = $('#measure_length_danwei').val();
        thisWidget.measure.updateUnit(danwei);

        $("#lbl_measure_result").html("");
    });
    $("#measure_area_danwei").change(function (e) {
        var danwei = $('#measure_area_danwei').val();
        thisWidget.measure.updateUnit(danwei);

        $("#lbl_measure_result").html("");
    });

    $("#chk_onlyPickModelPosition").change(function () {
        var val = $(this).is(':checked');

        thisWidget.changeOnlyPickModel(val);
    });

}






//修改值回调
function onMeasureChange(e) {
    $("#lbl_measure_result").html(e.label);
}

//单个对象绘制完成结束后的回调
function onMeasureEnd(e) {
    // console.log('测量完成');
}

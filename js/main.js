const GASURL = "https://script.google.com/macros/s/AKfycbzbNG57Qn0u_N9jIJGLvQb93ILl1LL22cYdxYsI/exec";
var searchbar = 0;

$(document).ready(() => {
    console.log("I'm ready!");
    $("#input-group").attr("style", "width:"+$('#searchitem').outerWidth())
    $("#main").attr("style", "height:calc( 100vh - "+$('#plus').outerHeight()+"px)")
    $(".main_box").attr("style", "height:calc( 100% - "+$('#top').outerHeight()+"px - 1rem)")
    readData();
    $('#submit').click((event) => {

        if (confirm("確認送出嗎?")) {
            KEY()
            if ($("#time1").val()== "" ||$("#time2").val()== "" ||$("#time3").val()== "" ||$("#time4").val()== "" ||$("#time5").val()== "" ||$("#time6").val()== "" ||$("#time0").val()==0) console.log("有空白")
            else if ($("#mon").val()== "" ||$("#tue").val()== "" ||$("#wed").val()== "" ||$("#thu").val()== "" ||$("#fri").val()== "" ||$("#sat").val()== "" ||$("#sun").val()=="") console.log("有空白")
            else if ($("#area").val() == "" || $("#county").val() == "" || $("#title").val() == "" || $("#address").val() == "" || $("#intro").val() == "" || flag == 1) console.log("有空白")
            else writeData();
        }
    });
    $('#new').click((event) => {
        document.getElementById("form-control").value = ""
	    document.getElementById("main01").style.display = "none";
        readData()
        update()
    });

    //----------景點----------
	var slide = 0;

	//--預設地點點擊--
	$("#dropdown-toggle").click(function () {
		$("#dropdown-menu").slideToggle("");
		if (slide == 1) {
			slide = 0;
			$(".fa-chevron-up").attr("style", "display:none")
			$(".fa-chevron-down").attr("style", "display:block")
		}
		else {
			slide = 1;
			$(".fa-chevron-up").attr("style", "display:block")
			$(".fa-chevron-down").attr("style", "display:none")
		}
	});
	$('body').click(function (evt) {
		if (slide == 1) {
			if (evt.target.id != "dropdown-toggle") {
				$(".fa-chevron-up").attr("style", "display:none")
				$(".fa-chevron-down").attr("style", "display:block")
				$("#dropdown-menu").slideToggle("");
				slide = 0;
			}
		}
	});

	//--搜尋點擊--
	var wid
	var rad
	if (document.body.offsetWidth < 321) { wid = "48vw";}
	if (document.body.offsetWidth > 320) { wid = "40vw";}
	if (document.body.offsetWidth > 768) { wid = "16vw";}

	$("#searchitem").click(function () {
		if (searchbar == 0) {
			document.getElementById("dropdown-toggle").style.display = "block";
			document.getElementById("form-control").style.display = "block";
			$("#searchitem").attr("style", "border-radius: 0 0.25rem 0.25rem 0 ;outline: none")
			$("#input-group").animate({ width: wid }, 200);
			searchbar = 1;
		}
		else if (searchbar != 0) {
			update();
		}
	});
	//--搜尋文字輸入--
	$(".form-control").keydown(function (event) {
		if ($('.form-control').val().length == 1 && event.which == 8) {
			document.getElementById('form-control').value = ""
			$('#main01').fadeOut(20);
			document.getElementById("main01").style.display = "none";
			update();
			$('#main01').fadeIn();
		}
		if (event.which == 13) {
			$('#main01').fadeOut(20);
			document.getElementById("main01").style.display = "none";
            update();
            $('#main01').fadeIn();
			return false;
		}
	});
});

let writeData = () => {
    let param = new Object();
    param.method = $('input[name="method"]').val();
    param.url = "https://docs.google.com/spreadsheets/d/1OmzdHHd7lb8fTwItjPxvk8ZRfnIdIAXL5V8VtfVNlg0/edit#gid=0";
    param.tag = "工作表1";
    param.area = $("#area").val()
    param.county = $("#county").val()
    param.title = $("#title").val()
    param.address = $("#address").val()
    param.intro = $("#intro").val().replace(/\r\n|\n/g, "</br>")
    param.mon = $("#mon").val()
    param.tue = $("#tue").val()
    param.wed = $("#wed").val()
    param.thu = $("#thu").val()
    param.fri = $("#fri").val()
    param.sat = $("#sat").val()
    param.sun = $("#sun").val()
    param.keyword= keyWord
    console.log(param);
    $.post(GASURL, param, (data) => {
        alert("上傳成功")
        window.location.reload()
    });
}

let readData = () => {
    let param = new Object();
    param.method = "read1";
    param.url = "https://docs.google.com/spreadsheets/d/1OmzdHHd7lb8fTwItjPxvk8ZRfnIdIAXL5V8VtfVNlg0/edit#gid=0";
    param.tag = "工作表1";
    $('#main01').empty()
    $.post(GASURL, param, (data) => {
        // $('#main01').empty()
        for(let i = 0 ; i < data.allData.length ; i++){
            let tmp=$('#template01');
            let htmlCont = tmp.html();
            console.log(htmlCont);
            htmlCont = htmlCont.replace("AREA_HERE",data.allData[i][1]);
            htmlCont = htmlCont.replace("COUNTY_HERE",data.allData[i][2]);
            htmlCont = htmlCont.replace("TITLE_HERE",data.allData[i][3]);
            htmlCont = htmlCont.replace("ADD_HERE",data.allData[i][4]);
            htmlCont = htmlCont.replace("INTRO_HERE",data.allData[i][5]);
            htmlCont = htmlCont.replace("MON_HERE",data.allData[i][6]);
            htmlCont = htmlCont.replace("TUE_HERE",data.allData[i][7]);
            htmlCont = htmlCont.replace("WED_HERE",data.allData[i][8]);
            htmlCont = htmlCont.replace("THU_HERE",data.allData[i][9]);
            htmlCont = htmlCont.replace("FRI_HERE",data.allData[i][10]);
            htmlCont = htmlCont.replace("SAT_HERE",data.allData[i][11]);
            htmlCont = htmlCont.replace("SUN_HERE",data.allData[i][12]);
            htmlCont = htmlCont.replace("KEY_HERE",data.allData[i][13]);
            $('#main01').append(htmlCont);
    
        }
    });
}

//--更新景點--
function update() {
	$('#main01').fadeIn();
	var cSearch = $("#c-search");
	var value = $('#form-control').val();
	if (!value) {
		cSearch.html("");
		return;
	};
	cSearch.html('.wrap:not([data-index*="' + value.toLowerCase() + '"]) {display: none;}');
}
//--點擊預設景點--
function area(area) {
	document.getElementById("form-control").value = area.text
	if (area.text == "全部") document.getElementById("form-control").value = ""
	document.getElementById("main01").style.display = "none";
	update()
}
var txtId = 0; //新增表單
var keyWord = ""
flag=0
function KEY(){
    keyWord = ""
    flag=0
    for(i=1;i<=txtId;i++){
        if($("#key"+i).val()=="") flag=1
        keyWord = keyWord+"#"+$("#key"+i).val()+" "
    }
    console.log(keyWord)
}
$(function () {
    $('[data-toggle="tooltip"]').tooltip({
        trigger: 'click'
    })
    //選擇地點
    $("#area").change(function () {
        switch ($(this).val()) {
            default:
            case "":
                $("#county option").remove();
                var array = ["縣市"];
                $.each(array, function (i, val) {
                    $("#county").append($("<option value=''>" + array[i] + "</option>"));
                });
                break;
            case "northern":
                $("#county option").remove();
                var array = ["縣市", "台北", "新北", "基隆", "宜蘭", "桃園", "新竹"];
                $.each(array, function (i, val) {
                    if (i == 0) $("#county").append($("<option value=''>" + array[i] + "</option>"));
                    else $("#county").append($("<option value='" + array[i] + "'>" + array[i] + "</option>"));
                });
                break;
            case "central":
                $("#county option").remove();
                var array = ["縣市", "苗栗", "台中", "彰化", "南投", "雲林"];
                $.each(array, function (i, val) {
                    if (i == 0) $("#county").append($("<option value=''>" + array[i] + "</option>"));
                    else $("#county").append($("<option value='" + array[i] + "'>" + array[i] + "</option>"));
                });
                break;
            case "southern":
                $("#county option").remove();
                var array = ["縣市", "嘉義", "台南", "高雄", "屏東"];
                $.each(array, function (i, val) {
                    if (i == 0) $("#county").append($("<option value=''>" + array[i] + "</option>"));
                    else $("#county").append($("<option value='" + array[i] + "'>" + array[i] + "</option>"));
                });
                break;
            case "eastern":
                $("#county option").remove();
                var array = ["縣市", "花蓮", "台東"];
                $.each(array, function (i, val) {
                    if (i == 0) $("#county").append($("<option value=''>" + array[i] + "</option>"));
                    else $("#county").append($("<option value='" + array[i] + "'>" + array[i] + "</option>"));
                });
                break;
            case "islands":
                $("#county option").remove();
                var array = ["縣市", "澎湖", "金門", " 馬祖"];
                $.each(array, function (i, val) {
                    if (i == 0) $("#county").append($("<option value=''>" + array[i] + "</option>"));
                    else $("#county").append($("<option value='" + array[i] + "'>" + array[i] + "</option>"));
                });
                break;
        }
    });
   
    //新增地點
    $("#addItem").click(function () {
        txtId++;
        let div = `<input type="text" class="key key${txtId}" id="key${txtId}" required autocomplete="off" placeholder="關鍵字">`
        $("#showBlock").append(div);
        $("#del").attr("style", "display:inline-block")
    });
    //時間
    function time() {
        for (i = 0; i < 7; i++) {
            $("#time" + i).change(function () {
                var timename = this.name
                switch ($(this).val()) {
                    default:
                    case "":
                        document.getElementById(this.name).value = " "
                        $("#" + timename).attr("style", "display:none")
                        $("#" + timename).attr("disabled", true)
                        break;
                    case "24小時營業":
                        document.getElementById(this.name).value = "24小時營業"
                        $("#" + timename).attr("style", "display:inline-block")
                        $("#" + timename).attr("disabled", true)
                        break;
                    case "公休":
                        document.getElementById(this.name).value = "公休"
                        $("#" + timename).attr("style", "display:inline-block")
                        $("#" + timename).attr("disabled", true)

                        break;
                    case "自訂":
                        document.getElementById(this.name).value = ""
                        $("#" + timename).attr("placeholder", "點擊選擇時間")
                        $("#" + timename).attr("style", "display:inline-block")
                        $("#" + timename).attr("disabled", false)

                        break;
                }
            });

        }
    }
    time()
    //remove 最新加入的input
    $("#del").click(function () {
        $(".key" + txtId).remove();
        txtId--
        if (txtId == 0) $("#del").attr("style", "display:none")
    })
    //時間外掛
    $('input[name="datetimes"]').daterangepicker({
        timePicker: true,
        timePickerIncrement: 1, // 以 30 分鐘為一個選取單位
        timePicker24Hour: true,
        locale: {
            format: 'HH:mm'
        }
    });
});
//overflow
overflag=0
function over(){
    if(overflag==0){
        $('body').attr("style","overflow: auto;")
        overflag=1
    }
    else{
        $('body').attr("style","overflow: hidden;")
        overflag=0
    }
}
//remove函式
Array.prototype.remove = function () {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
}

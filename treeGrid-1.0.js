$.extend($,{
  perfectEleTree: function (obj) {
    perfectEleTree(obj);
  }
});
//生成树形结构
function perfectEleTree(obj){
 //生成树形结构并放入页面盒子
  var dom = creatEleTreeHeader(obj) +"<div class='treeGrid_main'>" +creatEleTree(obj,true)+ "</div>";
  $("#"+obj.id).html(dom);
  //确定高度
  $("#"+obj.id).find('ul.open').each(function(){
    $(this).height($(this).height());
  });
  //确定高度
  $(".treeGrid_main li").each(function(index){
    $(this).children(".num_list").html(index+1);
  });
//切换展示和隐藏功能
  $("#"+obj.id).on("click","b.cls,b.ope",function(){
    speedEleTree(this);
  });
}
//生成tree结构表头
function creatEleTreeHeader(obj){
  $("#"+obj.id).css({"position":"relative",height:"100%"});
  var dom = "<div class='treeGrid_header'><ul><li>",
      ws = $("#"+obj.id).width(),w=0; 
  if(obj.number == undefined || obj.number){
    w = 25;
    dom += "<b class='num_list'></b>";
  }
  for(let i=0,l=obj.culmn.length;i<l;i++){
    if((obj.culmn[i].width+"").indexOf("0.") !== -1){
      obj.culmn[i].width =  ws* Number(obj.culmn[i].width);
    }
    if(i === 0){
      obj.culmn[0].width -= w;
    }
    dom += "<span style='width:"+obj.culmn[i].width+"px'>"+obj.culmn[i].title+"</span>";
  }
  dom += "</li></ul></div>";
  return dom;
}
//递归数据结构生成html结构
function creatEleTree(obj,flag){
  var html ="",
      data = obj.data,
      culmn = obj.culmn,
      pIdW = $("#"+obj.id).width();
  if(flag){
    html +=  "<ul class='open'>";
  }else{
    html +=  "<ul class='close'>";
  }
  for(let i=0,l=data.length;i<l;i++){
    var cl = "",
        num = data[i].lev,
        w = 24,
        bgIcon="icon icon_"+num,
        str_b="";
    //判断初始状态展开或关闭
    if(data[i].open){
      cl = 'ope';
    }else{
      cl = 'cls';
    }
    if(obj.number == undefined || obj.number){
      str_b += "<b class='num_list'></b>";
    }
    //创建li数列并添加标识和层级
    html += "<li lev='"+num+"'>"+str_b;
    //根据层级创建空格
    for(let j=0;j<num;j++){
      w += 25;
      html += '<b></b>';
    }
    //判断是否有子节点--添加点击图标
    if(data[i].children.length > 0){
      w += 25;
      html += "<b class='"+cl+"'></b>";
    }else{
      w += 25;
      html += "<b></b>";
    }
    //循环添加数据
    for(let j=0,l=culmn.length;j<l;j++){
      //转化
      if((culmn[j].width+"").indexOf("0.") !== -1 && (culmn[j].width+"").indexOf("0.") === 0){
        culmn[j].width = pIdW * Number(culmn[j].width);
      }
      if(j === 0){
        //添加数据
        html += "<b class='"+bgIcon+"'></b><span style='width:"+(culmn[0].width-w)+"px'>"+data[i].name+"</span>";
      }else{
        var str = data[i][culmn[j].field]==undefined?"":data[i][culmn[j].field];
        if(j === culmn.length-1){ 
          var str = data[i][culmn[j].field]==undefined?"":data[i][culmn[j].field];
          html += "<span style='width:"+(culmn[j].width-1)+"px'>"+str+"</span>";
        }else{
          html += "<span style='width:"+culmn[j].width+"px'>"+str+"</span>";
        }
      }
    }

    html += "</li>";
    //判断是否有子节点--递归数据
    if(data[i].children.length > 0){
      obj.data = data[i].children;
      var htm = creatEleTree(obj,data[i].open);
      html += htm;
    }
  }
  html += "</ul>";
  //返回拼接好的HTML结构字符串
  return html;
}

//切换时高度变化过度效果
function speedEleTree(_this){
  var h = 0,
  flag = $(_this).hasClass("cls"),
  self = $(_this).parent().next("ul");
  if(flag){
    $(_this).removeClass("cls").addClass("ope");
    self.children().each(function(){
      h += $(this).height();
    });
    self.height(h);
  }else{
    $(_this).removeClass("ope").addClass("cls");
    h = self.height();
    self.height(0);
  }
  speedEleUlTree(self,h,flag);
}
//递归改变相关联的ul高度
function speedEleUlTree(self,h,flag){
    if(self.prev().siblings().length != 0){
      var pId = self.parent(),
          he = pId.height();
      if(flag){
        pId.height(he+h);
      }else{
        pId.height(he-h);
      }
      speedEleUlTree(pId,h,flag)
    }
}
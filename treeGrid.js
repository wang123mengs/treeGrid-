//基于jQuery
$.fn.extend({
  perfectEleTree: function (obj) {
    obj.id = $(this).attr("id");
    perfectEleTree(obj);
  }
});
$.extend({
  perfectEleTree: function (obj) {
    perfectEleTree(obj);
  }
});
//生成树形结构
function perfectEleTree(obj){
 //生成树形结构并放入页面盒子--objz(数据结构)、true(根节点都有子节点)、true(需要创建表头)
  var dom = creatEleTreeGrid(obj,true,true)+ "</div>";
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
/**
 * 递归数据-生成html结构
 * @param  {[type]} obj  [数据对象]
 * @param  {[type]} flag [判断是否有子节点]
 * @param  {[type]} tog  [判断是否需要创建表头]
 * @return {[type]}      [返回html结构字符串]
 */
function creatEleTreeGrid(obj,flag,tog){
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
        str_b=""
        wH = 0;//--H
    //判断初始状态展开或关闭
    if(data[i].open){
      cl = 'ope';
    }else{
      cl = 'cls';
    }
    if(obj.number == undefined || obj.number){
      str_b = "<b class='num_list'></b>";
      wH = 25;
    }
    //创建列表抬头--开始
    if(tog){
      doms = "<div class='treeGrid_header'><ul><li>"+str_b;
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
      //完善--列表抬头
      if(tog){
        $("#"+obj.id).css({"position":"relative",height:"100%"});
        //处理culmn中width的数据
        if((culmn[j].width+"").indexOf("0.") !== -1 && (culmn[j].width+"").indexOf("0.") === 0){
          culmn[j].width =  pIdW* Number(culmn[j].width);
        }
        //判断处理 -- 第一列和最后一列的宽度
        if(j === 0){
          culmn[0].width -= wH;
        }else if(j === culmn.length-1){
          culmn[j].width -= 1;
        }
        doms += "<span style='width:"+culmn[j].width+"px'>"+culmn[j].title+"</span>";
      }
      if(j === 0){
        //添加数据
        html += "<b class='"+bgIcon+"'></b><span style='width:"+(culmn[0].width-w)+"px'>"+data[i].name+"</span>";
      }else{
        var str = data[i][culmn[j].field]==undefined?"":data[i][culmn[j].field];
        html += "<span style='width:"+culmn[j].width+"px'>"+str+"</span>";
      }
    }
    html += "</li>";
    //拼接列表抬头和主体--拼接字符串
    if(tog){
      doms += "</li></ul></div><div class='treeGrid_main'>";
      html = doms + html;
    }
    //判断是否有子节点--递归数据
    if(data[i].children.length > 0){
      obj.data = data[i].children;
      var htm = creatEleTreeGrid(obj,data[i].open,false);
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
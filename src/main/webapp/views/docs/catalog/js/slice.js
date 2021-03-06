var sliceinfo,viewer,canvas,selObject,maxZoom,nowLevel,nowLevelBL=true;var nuroImage;
$(function(){
	
	//初始化
	init();

})

function init(){
    //批注面板折叠
	doCollapse();
	//批注按钮事件
	makefun();
	//加悬浮事件
	doMouseHover();
	//加载图像
	doLoadOpenseadPNG();
	//批注初始化
    initPostil();
	//加载批注
	loadPostil();
	//鼠标右键
	onRightMouse();
	//批注编辑
	edit();
	//弹出框
	dialogModal();
	//页面分辨率调整
	setResize();
	
}

function doLoadOpenseadPNG(){
     $.ajax({
		async:false,
		url:'http://59.110.215.223:6060/getMDSInfo',
		data:{'id':getQueryString('sliceNo')},
		success:function(sliceInfo){
			
			if(sliceInfo==null){
				
			  return false;
			}
			 sliceinfo=sliceInfo;
			 //生成图片
			 initPic();
		}
	})
}	

function initPic(){
	var self = this;
    $(".panel-title").html(sliceinfo.name);
    
	//var p= getXmlDom('/filePath/科目/'+sliceInfo.SNAME+'/'+sliceInfo.CNAME+'/'+sliceInfo.NAME+'/1/DSI0/MoticDigitalSlideImage');
	if(!sliceinfo.width){
	    $("#openSeadragon").html("切片未找到！");
	    return;
	}
	
	viewer= OpenSeadragon({  
		  
	    id:  'openSeadragon',  
	    //按钮图片路径
	    prefixUrl: WEB_ROOT+'/resources/reference/jquery/images/', 
	    //图像旋转按钮
	    showRotationControl:false,
	    //home按钮填充视窗
	    homeFillsViewer:false,
	    //设置图像必须留着窗口中
	    visibilityRatio:0.8,
	    tileOverlap:1,
	    debugMode:true,
	    //preserveImageSizeOnResize:true,
	    //loadTilesWithAjax:true,
	    animationTime:2,
	    //是否显示控制按钮
		showNavigator:true,
		navigatorPosition:'BOTTOM_LEFT',
		minZoomImageRatio:1,
		zoomPerClick:1.8,
		zoomPerScroll:1.5,
		minZoomLevel:0.4,
		//maxZoomLevel:7.128,
		defaultZoomLevel:0,
		//navigatorSizeRatio:0.15,
		gestureSettingsMouse:{
		    scrollToZoom:true,
		    dblClickToZoom:true,
		    clickToZoom:false
		},
		preserveImageSizeOnResize:true,
		imageLoaderLimit:1,
	    tileSources: [{
	    	width:sliceinfo.width,
			height:sliceinfo.height,
			tileSize:256,
	        getTileUrl:function(level,x,y){
	        	
	        	if(nowLevelBL){nowLevel=level;nowLevelBL=false}
	        	
	        	return 'http://59.110.215.223:6060/getTileData?level='+level+'&x='+x+'&y='+y+'&id='+getQueryString('sliceNo');
	        	
	        	//return WEB_ROOT+'/olo/subject!doTileUrlSlice.do?level='+level+'&x='+x+'&y='+y+'&sliceNo='+sliceinfo.id;
	        }
        }]
	});
	
     
	/*var canvas = viewer.fabricjsOverlay({scale:1}).fabricCanvas();
  fabric.Object.prototype.transparentCorners = false;

  var rect = new fabric.Rect({
    left: 100,
    top: 50,
    width: 100,
    height: 100,
    fill: 'green',
    angle: 20,
    padding: 10
  });
  canvas.add(rect);
  canvas.on('after:render', function() {
    canvas.contextContainer.strokeStyle = '#555';

    canvas.forEachObject(function(obj) {
      var bound = obj.getBoundingRect();

      canvas.contextContainer.strokeRect(
        bound.left + 0.5,
        bound.top + 0.5,
        bound.width,
        bound.height
      );
    })
  });*/
     /*canvas.forEachObject(function(obj) {
      var bound = obj.getBoundingRect();

      canvas.contextContainer.strokeRect(
        bound.left + 0.5,
        bound.top + 0.5,
        bound.width,
        bound.height
      );*/
     //canvas.contextContainer.strokeRect(0,0,50,50);
	/*var overlay = viewer.fabricjsOverlay({scale:1});
	//获取zoom
	////console.info('1'+this.viewer.viewport.getZoom(true));
	
	var rect = new fabric.Rect({
                      left: 50,
                      top: 50,
                      fill: 'red',
                      width: 200,
                      height: 200,
                      transparentCorners:false,
                      hasBorders: false,
                      cornerColor:'#C2B7DA',
                      cornerSize:13,
                      cornerStyle:'circle'
                    });
     var canvas= overlay.fabricCanvas();
     //canvas.freeDrawingBrush.width=10;
     canvas.add(rect);
    //rect.scale(0.1);
     var bx=0;
     var by=0;
     var c=false;
     var rect1;
     var x,y;
     var zoom
     //console.info(self.viewer);
    canvas.on('mouse:down',function(e){
    	 
    	     self.viewer.setMouseNavEnabled(false);
	         //self.viewer.outerTracker.setTracking(false);
	         //overlay.fabricCanvas().isDrawingMode=false;
	    	 zoom= viewer.viewport.getZoom(true);
	    	 var viewportWindowPoint= viewer.viewport.viewportToWindowCoordinates(new OpenSeadragon.Point(0, 0));
		     x=Math.round(viewportWindowPoint.x);
	         y=Math.round(viewportWindowPoint.y);
	         bx=e.e.clientX-x;
	         by=e.e.clientY-y;
	         rect1=new fabric.Rect({
	                  left: Math.round(bx/zoom),
	                  top:  Math.round(by/zoom),
	                  fill:null,
	                  stroke:'#0000ff',
	                  strokeWidth:2,
	                  overlayFill:null,
	                  transparentCorners:false,
	                  //opacity:0.1,
	                  width: 0,
	                  height: 0
	                });
	         canvas.add(rect1);
	         c=true;
             
     })
     canvas.on('mouse:move',function(e){
     	if(c){
     		   var ex=Math.round((e.e.clientX-x-bx)/zoom);
     		   var ey=Math.round((e.e.clientY-y-by)/zoom);
     		   var lineWidth=parseFloat((2/zoom).toFixed(1));
     		   //console.info(lineWidth);
               rect1.set({'width':ex,'height':ey,'strokeWidth':lineWidth});
               canvas.renderAll();
               if(!e.target){
               	  ////console.info(true);
             }
     	}
                   
      })
      canvas.on('mouse:up', function (e){
      	c=false;
      	
      	self.viewer.setMouseNavEnabled(true);
      	////console.info(e);
      	viewer.addHandler('update-viewport', function() {
       	    zoom= viewer.viewport.getZoom(true);
       	    var lineWidth=parseFloat((4/zoom).toFixed(1));
        	rect1.set({'strokeWidth':lineWidth});

        });
      })*/
	
}
function pad(num, n) {
    return (Array(n).join(0) + num).slice(-n);
}
function initPostil(){
	var bl=0;
    var typedchoose=$("#toolbar .panel-toolbar .curvs-groups a");
    var typeuchoose=$("#toolbar .panel-toolbar .roups-groups a");
    var type="line";
    var polyN=3;
    var polychoose=$("#toolbar .curvs-groups .poly input");
    var lineWchoose=$("#toolbar .texts-groups .lineW input");
    var colorchoose=$("#toolbar .texts-groups .color input");
    var color="#0000ff";
    var linewidth=4.0;
    var ni=0;
    var x1,y1,ex,ey,w,h;
    var overlay = viewer.fabricjsOverlay({scale:1});
    canvas= overlay.fabricCanvas();
    var _scale=1/viewer.container.clientWidth;
    var pointArr=[];
    var groupPostil=[];
    var Postil;
    var draw;
    var zoom;
    var control=new Control(viewer);
    $('#colorpicker').colorpicker({'container':true});
    // 绘制形状
    typedchoose.each(function(index,ele){
        $(ele).click(function(){
            type=$(this).attr("data");
            viewer.setMouseNavEnabled(false);
            pointArr=[];
            bl=1;
            ni=0;
            if(type=='curv'){
               viewer.outerTracker.setTracking(false);
               canvas.isDrawingMode=true;
               canvas.freeDrawingBrush.width=linewidth/zoom;
               canvas.freeDrawingBrush.height=linewidth/zoom;
               canvas.freeDrawingBrush.color=color;
               //draw=new Draw(viewer,{color:color,width:linewidth/zoom});
               bl=0;
            }
        })
    })
    typeuchoose.each(function(index,ele){
        $(ele).click(function(){
            type=$(this).attr("data");
            viewer.setMouseNavEnabled(false);
            pointArr=[];
            groupPostil=null;
            bl=3;
            ni=0;
        })
    })
    $('.selectes').click(function(){
        bl=0;
        viewer.setMouseNavEnabled(true);
    })
    polychoose.change(function(){
        polyN=Math.floor(this.value);
    })
    lineWchoose.change(function(){
        linewidth=Math.floor(this.value);
    })
    colorchoose.change(function(){
        color=this.value;
    })
    canvas.on('mouse:down',function(e){
		 if(bl==1){
	    	 var viewportWindowPoint= viewer.viewport.viewportToWindowCoordinates(new OpenSeadragon.Point(0, 0));
		     ex=viewportWindowPoint.x;
	         ey=viewportWindowPoint.y;
	         pointArr.push({'x':(e.e.clientX-ex)/zoom,'y':(e.e.clientY-ey)/zoom});
		     draw=new Draw(viewer,{color:color,linew:linewidth,n:polyN,'type':type});//实例化构造函数
		     Postil= draw['init'+type](canvas,groupPostil,Postil,ni++,pointArr);
		     canvas.add(Postil);
		     bl=2;
		 }
     })
     canvas.on('mouse:move',function(e){
     	 if(bl>=2){
     	 	 draw[type](canvas,groupPostil,Postil,ni,pointArr,(e.e.clientX-ex)/zoom,(e.e.clientY-ey)/zoom); 
     	 	 canvas.renderAll();
     	 }
     })
     canvas.on('mouse:up', function (e){
     	 if(bl==2){
     	    bl=0;
     	 }
     	 if(bl==0){
     	    viewer.outerTracker.setTracking(false);
            canvas.isDrawingMode=false;
     	    viewer.setMouseNavEnabled(true);
     	 }
     	 if(bl>2){
     	     var viewportWindowPoint= viewer.viewport.viewportToWindowCoordinates(new OpenSeadragon.Point(0, 0));
		     ex=viewportWindowPoint.x;
	         ey=viewportWindowPoint.y;
	         pointArr.push({'x':(e.e.clientX-ex)/zoom,'y':(e.e.clientY-ey)/zoom});
		     draw=new Draw(viewer,{color:color,linew:linewidth,n:polyN,'type':type});//实例化构造函数
		     groupPostil= draw['init'+type](canvas,groupPostil,Postil,ni++,pointArr);
		     if(groupPostil!=null){
		     	canvas.renderAll();
		        //canvas.add(Postil);
		     }else{
		        bl=0;
		     }
     	 }
      	 //增加删除操作
     })
     canvas.on('object:moving', function(e) {
	    var p = e.target;
	    if(p.lineType){
	       control[p.lineType](p);
	    }
	    /*if(p.line1){
	    	p.line1.x1 && p.line1.set({ 'x2': p.left, 'y2': p.top });
	    	p.line1.path && (p.line1.path[0][1]=p.left);
	    	p.line1.path && (p.line1.path[0][2]=p.top);
	    }
	    if(p.line2){
	    	p.line2.x1 && p.line2.set({ 'x1': p.left, 'y1': p.top });
	    	p.line2.path && (p.line2.path[1][1]=p.left);
	    	p.line2.path && (p.line2.path[1][2]=p.top);
	    }
	    if(p.line3){
	    	p.line3.x1 && p.line3.set({ 'x1': p.left, 'y1': p.top });
	    	p.line3.path && (p.line3.path[1][3]=p.left);
	    	p.line3.path && (p.line3.path[1][4]=p.top);
	    }*/
	  });
	  canvas.on('object:scaling', function(e){
	  	var zoom= viewer.viewport.getZoom(true);
	       var p = e.target;
	       p.on({'scaling': function(e) {
		    var obj = this,
	        w = obj.width * obj.scaleX,
	        h = obj.height * obj.scaleY;
		    obj.set({
		        'height'     : h,
		        'width'      : w,
		        'scaleX'     : 1,
		        'scaleY'     : 1
		    });
		    obj.radius && obj.set({'radius':h/2});
		    obj.rx && obj.set({'rx':w/2,'ry':h/2});
		    canvas.renderAll();
		}})
	  });
	  
     /*canvas.on('after:render', function() {
    canvas.contextContainer.strokeStyle = '#0000ff';
    canvas.contextContainer.lineWidth=4;
    canvas.forEachObject(function(obj) {
      var bound = obj.getBoundingRect();

      canvas.contextContainer.strokeRect(
        bound.left ,
        bound.top ,
        bound.width,
        bound.height
      );
    })
  });*/
     viewer.addHandler('update-viewport', function() {
     	    var zoom1= viewer.viewport.getZoom(true);
     	
       	    for (var i = 0; i < canvas.getObjects().length; i++) {
       	    	setItemProp(canvas.item(i),zoom,zoom1);
       	    }
       	    zoom= viewer.viewport.getZoom(true);
     });
     
     return canvas;
}
function onRightMouse(){
	
	/*context.init({
	    fadespeed:100,
	    preventdoublecontext:false
	});*/
	
	$("#openSeadragon").bind("contextmenu", function(e){
		if(e.which==3){
			
			selObject= canvas.getActiveObject();
			//context.attach('#openSeadragon', loadRightArray(selObject));
			if(selObject==undefined){
				//setTimeout(initModal,300)
				//$('#commModal').modal({
						    //remote:WEB_ROOT+'/views/docs/catalog/prop.jsp'
				//})
		    }else{
		        setTimeout(initModal,300)
				$('#commModal').modal({
						    //remote:WEB_ROOT+'/views/docs/catalog/prop.jsp'
				})
		    }
		    return false;
	    }
	    
    })
		
}
function loadRightArray(selObject){
	var rightArray=[];
	if(selObject==undefined){
				rightArray=[
					{header: ''},
					{text: '切片信息', action: function(e){
						e.preventDefault();
						alert('html contextual menu destroyed!');
					}},
					{text: '关于', action: function(e){
						e.preventDefault();
						alert('宏图');
					}}
			    ];
		}else{
			    rightArray=[
					{header: ''},
					{text: '编辑', action: function(e){
						e.preventDefault();
						$('#commModal').modal({
						    remote:WEB_ROOT+'/views/docs/catalog/edit.jsp',
						    target:'_parent'
						})
					}},
					{text: '属性', action: function(e){
						e.preventDefault();
						$('#commModal').modal({
						    remote:WEB_ROOT+'/views/docs/catalog/prop.jsp',
						    target:'_parent'
						})
					}},
					{text: '删除', action: function(e){
						e.preventDefault();
						canvas.remove(selObject);
					}}
			    ];
			
		}
	return rightArray;
}
function edit(){
    	$('#editColor').colorpicker({'container':true});
}
function loadPostil(){
	maxZoom= gitMaxZoom();
    $.ajax({
    	     url:WEB_ROOT+'/olo/subject!doLoadPostil.do',
    	     data:{'sliceNo':1076},
    	     contentType: 'application/json',
    	     dataType:'json',
    	     success:function(msg){
    	     	console.info(msg);
    	     	if(msg!=null){
    	     		//console.info(msg);
    	     		for (var i = 0; i < msg.length; i++) {
    	     			
    	     			var c=null;
    	     			//console.info(i);
    	     			var obj=JSON.parse(msg[i].b);
    	     			//console.info(obj);
    	     			obj.top=obj.prop.top/maxZoom;
    	     			obj.left=obj.prop.left/maxZoom;
    	     			obj.width=obj.prop.width/maxZoom;
    	     			obj.height=obj.prop.height/maxZoom;
    	     			var draw=new Draw(viewer,{color:obj.stroke,linew:obj.prop.lineW,n:1,'type':obj.prop.propType});
    	     			if(obj.prop.linewState){
    	     			
    	     			   obj.strokeWidth=obj.prop.lineW;
    	     			}
    	     			if(obj.prop.propType=='rect'){
	
		                   c=new fabric.Rect(obj); 
		                   c=draw['setCorners'](c,false,true,false,true,false,true,false,true,true);
						}
						if(obj.prop.propType=='line'){
						   
						   c=new fabric.Line([obj.prop.x1/maxZoom,obj.prop.y1/maxZoom,obj.prop.x2/maxZoom,obj.prop.y2/maxZoom],obj);
						   c=draw['setCorners'](c,true,false,false,false,true,false,false,false,true);
						}
						if(obj.prop.propType=='curv'){
						
							
						}
						if(obj.prop.propType=='elli'){
						
						   obj.rx=obj.prop.rx/maxZoom;
						   obj.ry=obj.prop.ry/maxZoom;
						   c=new fabric.Ellipse(obj);
						   c=draw['setCorners'](c,false,true,false,true,false,true,false,true,true);
						}
						if(obj.prop.propType=='roun'){
						
							obj.radius=obj.prop.radius/maxZoom;
							c=new fabric.Circle(obj);
							c=draw['setCorners'](c,false,true,false,true,false,true,false,true,true);
						}
						if(obj.prop.propType=='poly'){
						
							for (var j = 0; j < obj.prop.points.length; j++) {
								
							     obj.points[j].x=obj.prop.points[j].x/maxZoom;
							     obj.points[j].y=obj.prop.points[j].y/maxZoom;
							}
							c=new fabric.Polygon([],obj);
							c=draw['setCorners'](c,false,true,false,true,false,true,false,true,true);
						}
						if(obj.prop.propType=='loca'){
						
							
						}
						if(obj.prop.propType=='angp'){
						
							
						}
						if(obj.prop.propType=='arcp1'){
						
							
						}
						if(obj.prop.propType=='arcp'){
						
							obj.radius=obj.prop.radius/maxZoom;
							c=new fabric.Circle(obj);
							c=draw['setCorners'](c,false,false,false,false,false,false,false,false,false);
						}
						if(obj.prop.propType=='roup'){
						
							
						}
						if(obj.prop.propType=='curp'){
						
							
						}
    	     			console.info(c);
    	     			canvas.add(c);
    	     			
    	     		}
    	     	   
    	     	   canvas.renderAll();
    	     	}
    	        
    	     }
        	     
     })
}
function setItemProp(obj,zoom,zoom1){
	if(obj.typeProp=='group'){
	     for (var i = 0; i < obj.getObjects().length; i++) {
	     	setItemProp(obj.item(i),zoom,zoom1);
	     }
	     return;
	}
	//console.info(obj);
    if(obj.prop.linewState){
       	 obj.set({'strokeWidth':obj.prop.lineW/zoom});
	}else if(obj.prop.sizeState){
		
		if(obj.prop.radius){
		  obj.set({'radius':5/zoom});
		}else{
		  obj.set({'width':30/zoom,'height':30/zoom});
		}
	}else{
		  //obj.set({'strokeWidth':obj.lineW/zoom});
	}
}
function dialogModal(){
    $(document).on("show.bs.modal", ".modal", function(){
	    $(this).draggable({
	         handle: ".modal-header"   // 只能点击头部拖动
	    });
	    $(this).css("overflow", "hidden"); // 防止出现滚动条，出现的话，你会把滚动条一起拖着走的
	});
}
function makefun(){
    $('.poly').hover(function(){
        $('#toolbar .list-group .poly .input-group').css('visibility','visible');
    },function(){
        $('#toolbar .list-group .poly .input-group').css('visibility','hidden');
    })
    $('.color').hover(function(){
    	$('.color').css('height','170px');
    	$('#colorpicker').colorpicker('show');
    },function(){
    	//$('.color').animate({height: '-80px'}, 10);
        $('#colorpicker').colorpicker('hide');
        $('.color').css('height','37px');
    })
    /*$('.lineW').hover(function(){
        $('#toolbar .list-group .lineW .input-group').css('visibility','visible');
    },function(){
        $('#toolbar .list-group .lineW .input-group').css('visibility','hidden');
    })
    */
}
function doCollapse(){
        var tool=false;
		$('#toolbar a.toolbutton-jqm').click(function(){
			//if(window.innerWidth<780){
			    $('.panel-title').toggle();
			//};
			$('.panel-toolbar').css('height','40px');
			  if(tool){
			  	        $('.panel-toolbar').animate({width: '-280px'}, 500);
	                    tool=false;
			  }else{
			  	        $('.panel-toolbar').animate({width: '+280px'}, 500);
	                    tool=true;
			  }
			  setTimeout(function(){$('.panel-toolbar').css('height','auto');},500);
		});
}
function doMouseHover(){
        $('#toolbar .panel-toolbar .curvs').hover(
           function(){
              $('#toolbar .panel-toolbar .curvs-groups').stop().slideDown(300);
           },
           function(){
              $('#toolbar .panel-toolbar .curvs-groups').stop().slideUp(200);
           }
        )
        $('#toolbar .panel-toolbar .texts').hover(
           function(){
              $('#toolbar .panel-toolbar .texts-groups').stop().slideDown(300);
           },
           function(){
              $('#toolbar .panel-toolbar .texts-groups').stop().slideUp(200);
           }
        );
        $('#toolbar .panel-toolbar .roups').hover(
           function(){
              $('#toolbar .panel-toolbar .roups-groups').stop().slideDown(300);
           },
           function(){
              $('#toolbar .panel-toolbar .roups-groups').stop().slideUp(200);
           }
        );
        $('#toolbar .panel-toolbar .tolists').hover(
           function(){
              $('#toolbar .panel-toolbar .tolists-groups').stop().slideDown(300);
           },
           function(){
              $('#toolbar .panel-toolbar .tolists-groups').stop().slideUp(200);
           }
        );
        $('#toolbar .panel-toolbar .configs').hover(
           function(){
              $('#toolbar .panel-toolbar .configs-groups').stop().slideDown(300);
           },
           function(){
              $('#toolbar .panel-toolbar .configs-groups').stop().slideUp(200);
           }
        );
        $('#colorpicker').hover(
           function(){
           	$('.colorpicker-visible').hover(
           function(){
              $('#toolbar .panel-toolbar .texts-groups').stop(1000).slideDown(0);
           }
        );
           }
        );
}
function setResize() {  
        $(window).resize(function(){
		    location.reload()
		});  
    }
function getQueryString(name) {  
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");  
        var r = window.location.search.substr(1).match(reg); 
        if (r != null) return unescape(r[2]);  
        return null;  
    }
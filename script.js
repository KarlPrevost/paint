var curTool;
var size = 5;
var inputColor = "#000000";
var stroke = true;

$(document).ready(function(){

	canvas = $("canvas");
    canvas.attr({
        width: window.innerWidth,
        height: window.innerHeight,
	});
	
	var clickX = new Array();
	var clickY = new Array();
	var clickDrag = new Array();
	var clickTool = new Array();
	var clickColor = new Array();
	var paint;
	var line = false;
	var context = document.getElementById('canvas').getContext("2d");
	var clickSize = new Array();

	var link = document.createElement('a');
	link.classList.add("save-link");
    link.innerHTML = 'Enregistrer';

	$(".toolbar").append(link);

	$('#save-link').click(function(){
        // window.open(canvas[0].toDataURL());
        var download = document.getElementById("save-link");
        var image = document.getElementById("canvas").toDataURL("image/png")
            .replace("image/png", "image/octet-stream");
        download.setAttribute("href", image)
    });

	$(".eraser").click(function() {
		curTool = "eraser";
		action();
	});

	$(".pencil").click(function() {
		curTool = "pencil";
		action();
	});

	$(".line").click(function() {
		curTool = "line";
		action();
	});

	$(".rectangle").click(function() {
		curTool = "rectangle";
		action();
	});

	$(".circle").click(function() {
		curTool = "circle";
		action();
	});

	$(".clear").click(function() {
		context.clearRect(0, 0, context.canvas.width, context.canvas.height); 
		clickX = new Array();
		clickY = new Array();
		clickDrag = new Array();
	});
	
	function action() {
		function addClick(x, y, dragging)
		{
		  clickX.push(x);
		  clickY.push(y);
		  clickDrag.push(dragging);
		  if(curTool == "eraser"){
		    clickColor.push("white");
		  } else {
		    clickColor.push(inputColor);
		  }
		  clickSize.push(size);
		}

		$('#canvas').mousedown(function(e){
			var mouseX = e.pageX - this.offsetLeft;
			var mouseY = e.pageY - this.offsetTop;
			paint = true;
			if(curTool == "line" || curTool == "rectangle" || curTool == "circle") {
				clickX = new Array();
				clickY = new Array();
				clickDrag = new Array();
			}
			addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
			if(curTool == "line" || curTool == "rectangle" || curTool == "circle") {
				line = true;
			}
		});

		$('#canvas').mousemove(function(e){
			if(curTool == "pencil" || curTool == "eraser" ) {
				if(paint){
					addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
					redraw();
				}
			}
		});

		$('#canvas').mouseleave(function(e){
			paint = false;
		});

		$('#canvas').mouseup(function(e){
			if(curTool == "line" || curTool == "rectangle" || curTool == "circle") {
				var mouseX = e.pageX - this.offsetLeft;
				var mouseY = e.pageY - this.offsetTop;
				addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
				line = false;
				redraw();
			}
			paint = false;
		});

		function redraw(){
			context.lineJoin = "round";
			switch(curTool) {
				case 'pencil':
				case 'eraser':
					pencil();
					break;
				case 'line':
					ligne();
					break;
				case 'rectangle':
					rectangle();
					break;
				case 'circle':
					circle();
					break;
				default:
					break;
			}
		}
	}

	function pencil() {
		for(var i=0; i < clickX.length; i++)
		{		
		    context.beginPath();
		    
		    if(clickDrag[i] && i){
		      context.moveTo(clickX[i-1], clickY[i-1]);
		    }else{
		      context.moveTo(clickX[i]-1, clickY[i]);
		    
		    }
		    context.lineTo(clickX[i], clickY[i]);
		    context.closePath();
		    context.strokeStyle = clickColor[i];
			context.lineWidth = clickSize[i];
		    context.stroke();
		}
	}

	function ligne() {
		context.lineWidth = clickSize[clickSize.length-1];
		context.strokeStyle = clickColor[clickColor.length -1];
		context.beginPath();
	    context.moveTo(clickX[0], clickY[0]);
	    context.lineTo(clickX[1], clickY[1]);
	    context.closePath();
	  
	    context.stroke();

		if(!line) {
			clickX = new Array();
			clickY = new Array();
			clickDrag = new Array();
		}
	}

	function rectangle() {
		
		context.lineWidth = clickSize[clickSize.length-1];
		
		if(stroke) {
			context.strokeStyle = clickColor[clickColor.length -1];
	    	context.strokeRect(clickX[0], clickY[0], clickX[1]-clickX[0], clickY[1] - clickY[0]);
		} else {
			context.fillStyle = clickColor[clickColor.length -1];
	    	context.fillRect(clickX[0], clickY[0], clickX[1]-clickX[0], clickY[1] - clickY[0]);
		}
	  
		if(!line) {
			clickX = new Array();
			clickY = new Array();
			clickDrag = new Array();
		}
	}

	function circle() {
		context.lineWidth = clickSize[clickSize.length-1];
		var angle = Math.abs(clickX[1] - clickX[0]);
		context.beginPath();
		context.arc(clickX[0],clickY[0],angle , 0, 2 * Math.PI);
		context.closePath();
		
		if(stroke) {
			context.strokeStyle = clickColor[clickColor.length -1];
			context.stroke();
		} else {
			context.fillStyle = clickColor[clickColor.length -1];
	    	context.fill();
		}
	  
		if(!line) {
			clickX = new Array();
			clickY = new Array();
			clickDrag = new Array();
		}
	}

	$("#size").on('change', function() {
	  size = $("#size").val();
	})

	$("#filling").on('change', function() {
	  stroke = ($("#filling").val() == "stroke") ? true : false;
	})

	
    link.addEventListener('click', function(ev) {
    	var canvas = document.getElementById('canvas');
	    link.href = canvas.toDataURL();
	    link.download = "paint.png";
	});

	
});

function color(colorInput) {
	inputColor = colorInput.value;
}


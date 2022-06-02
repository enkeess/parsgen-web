
var DisableEmscripted = false;

var application = new Application(document, window);

var isIe = (navigator.userAgent.toLowerCase().indexOf("msie") != -1 
           || navigator.userAgent.toLowerCase().indexOf("trident") != -1);

var buttonsList = ['AddGraph', 'ConnectGraphs', 'DeleteObject', 'Default'];
var g_ctrlPressed = false;

function restButtons (me) {
    var needSetDefault = false;
	for (var i = 0; i < buttonsList.length; i ++) {
		if (buttonsList[i] != me) {
			document.getElementById(buttonsList[i]).className = "button";
		} else {
			if (document.getElementById(buttonsList[i]).className != "button") {
				needSetDefault = true;	
			}
		}
	}
	if (needSetDefault) {
		document.getElementById(buttonsList[i]).className = "button button_primary";
	} else {
		document.getElementById(me).className = "button button_primary";
	}
}

var single = 0;

function resizeCanvas() {
  var canvas    = document.querySelector('#canvas');
  canvas.width  = document.querySelector('#canvasSection').offsetWidth;
  canvas.height = Math.min(800, window.innerHeight * 0.5);
  application.redrawGraph();
}

function touchHandler(event) {
    var touches = event.changedTouches,
        first = touches[0],
        type = "";
    switch(event.type) {
        case "touchstart": type = "mousedown"; break;
        case "touchmove":  type ="mousemove"; break;        
        case "touchend":   type ="mouseup"; break;
        default: return;
    }

	closeModal();
	
    var simulatedEvent = document.createEvent("MouseEvent");
    simulatedEvent.initMouseEvent(type, true, true, window, 1, 
                              first.screenX, first.screenY, 
                              first.clientX, first.clientY, false, 
                              false, false, false, 0/*left*/, null);

	first.target.dispatchEvent(simulatedEvent);
    event.preventDefault();
}

function preLoadPage() {
	loadTexts();
	application.onLoad();
}

function handelImportGraph(files) {
    var graphFileToLoad = files[0];
    var fileReader = new FileReader();

    fileReader.onload = function(fileLoadedEvent){
        var textFromFileLoaded = fileLoadedEvent.target.result;
        application.LoadGraphFromString(textFromFileLoaded);
        ImportGraphFiles.value = "";
    };

    fileReader.readAsText(graphFileToLoad, "UTF-8");
}

function postLoadPage() {   
	application.canvas.onmousemove = function (e) {
			return application.CanvasOnMouseMove(e);
		};

	application.canvas.onmousedown = function (e) {
			return application.CanvasOnMouseDown(e);
		};
		
	application.canvas.onmouseup   = function (e) {
			return application.CanvasOnMouseUp(e);
		}
    
    application.canvas.onmousewheel = function (e) {
        var e = window.event || e; // old IE support
        var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
        if (delta > 0) {
            application.multCanvasScale(1.3);
        }
        else {
            application.multCanvasScale(1.0 / 1.3);
        }
    }
    
    function getCharCode(event) {
      if (event.which == null) { // IE
        return event.keyCode;
      }

      if (event.which != 0 && event.charCode != 0) { // все кроме IE
        return event.which; // остальные
      }

      return null; // спец. символ
    }
    	
	document.querySelector('#Default').onclick = function () {
		restButtons ('Default');
		application.SetHandlerMode("default");
		document.querySelector('#Default').className = "button button_primary";			
	}		
		
	document.querySelector('#AddGraph').onclick = function () {
		restButtons ('AddGraph');
		application.SetHandlerMode(document.querySelector('#AddGraph').className != "" ? "addGraph" : "default");
	}
	
	document.querySelector('#ConnectGraphs').onclick = function () {
		restButtons ('ConnectGraphs');
		application.SetHandlerMode(document.querySelector('#ConnectGraphs').className != "" ? "addArc" : "default");
	}	
	
	document.querySelector('#DeleteObject').onclick = function () {
		restButtons ('DeleteObject');
		application.SetHandlerMode(document.querySelector('#DeleteObject').className != "" ? "delete" : "default");
	}

	document.querySelector('#DeleteAll').onclick = function () {
		application.SetHandlerMode("deleteAll");
	}


	document.querySelector('#NewGraph').onclick = function () {
		application.SetHandlerMode("deleteAll");
	}
    
    document.querySelector('#Zoom100').onclick = function ()
    {
        
        application.setCanvasScale(1.0);
    }
    
    document.querySelector('#Zoom50').onclick = function ()
    {
        
        application.setCanvasScale(50 / 100);
    }
    
    document.querySelector('#Zoom25').onclick = function ()
    {
        
        application.setCanvasScale(25 / 100);
    }
  
    document.querySelector('#ZoomFit').onclick = function () {
        
        application.OnAutoAdjustViewport();
    }
    
    document.querySelector('#ZoomIn').onclick = function () {
        
        application.multCanvasScale(1.5);
    }
    
    document.querySelector('#ZoomOut').onclick = function () {
        
        application.multCanvasScale(1.0 / 1.5);
    }
    
    document.querySelector('#MoveWorspace').onclick = function () {
        
        restButtons ('Default');
        application.SetHandlerMode("default");
        document.querySelector('#Default').className = "button button_primary";
    }

    document.querySelector('#GraphUndo').onclick = function () {
        
        application.SetHandlerMode("graphUndo");
    }    
    
    document.querySelector('#ExportGraph').onclick = function () {
        
        
        var graphAsString  = application.graph.save();
        var savedGraphName = application.GetNewGraphName();
        
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(graphAsString));
        element.setAttribute('download', "graph_" + savedGraphName + ".json");

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }
    
    document.querySelector('#ImportGraph').onclick = function () {
        if (ImportGraphFiles) {
            ImportGraphFiles.click();
        }
    }
}

window.onload = function () {

	window.onresize = function(event) {
			resizeCanvas();
		}

    document.querySelector('#canvas').addEventListener("touchstart", touchHandler, true);
    document.querySelector('#canvas').addEventListener("touchmove", touchHandler, true);
    document.querySelector('#canvas').addEventListener("touchend", touchHandler, true);
    document.querySelector('#canvas').addEventListener("touchcancel", touchHandler, true);
};

Array.prototype.swap = function (x,y) {
  var b = this[x];
  this[x] = this[y];
  this[y] = b;
  return this;
}

/**
 *
 *  This event handlers.
 *
 */

function BaseHandler(app) {
	this.app = app;
    this.app.setRenderPath([]);
}

// Need redraw or nor.
BaseHandler.prototype.needRedraw = false;
BaseHandler.prototype.objects    = [];
BaseHandler.prototype.message    = "";

BaseHandler.prototype.IsNeedRedraw = function(object) {
	return this.needRedraw;
}

BaseHandler.prototype.RestRedraw = function(object) {
	this.needRedraw = false;
}

BaseHandler.prototype.SetObjects = function(objects) {
	this.objects = objects;
}

BaseHandler.prototype.GetSelectedGraph = function(pos) {
	// Selected Graph.
    var res = null;
    for (var i = 0; i < this.app.graph.vertices.length; i ++) {
		if (this.app.graph.vertices[i].hitTest(pos)) {
            // Select last of them.
            res = this.app.graph.vertices[i];
		}
	}

	return res;
}

BaseHandler.prototype.GetSelectedArc = function(pos) {
    for (var i = 0; i < this.app.graph.edges.length; i ++) {
        var edge = this.app.graph.edges[i];
        
        if (edge.hitTest(new Point(pos.x, pos.y)))
            return edge;
	}
	
	return null;
}

BaseHandler.prototype.GetSelectedObject = function(pos) {
	var graphObject = this.GetSelectedGraph(pos);
	if (graphObject) {
		return graphObject;
	}
	
	var arcObject = this.GetSelectedArc(pos);
	if (arcObject) {
		return arcObject;
	}
	
	return null;
}

BaseHandler.prototype.GetMessage = function() {
	return this.message;
}

BaseHandler.prototype.MouseMove = function(pos) {}

BaseHandler.prototype.MouseDown = function(pos) {}

BaseHandler.prototype.MouseUp   = function(pos) {}

BaseHandler.prototype.GetSelectedGroup = function(object) {
	return 0;
}

BaseHandler.prototype.InitControls = function() {
    var vertex1Text = document.getElementById("Vertex1");
    if (vertex1Text) {
        var handler = this;
        vertex1Text.onchange = function () {
           for (var i = 0; i < handler.app.graph.vertices.length; i++)
           {   
               if (handler.app.graph.vertices[i].mainText == vertex1Text.value)
               {
	               handler.SelectFirstVertexMenu(vertex1Text, handler.app.graph.vertices[i]);
                   break;
               }
           }
        };
        
        this.UpdateFirstVertexMenu(vertex1Text);
    }
    
    var vertex2Text = document.getElementById("Vertex2");
    if (vertex2Text) {
        var handler = this;
        vertex2Text.onchange = function () {
           for (var i = 0; i < handler.app.graph.vertices.length; i++)
           {   
               if (handler.app.graph.vertices[i].mainText == vertex2Text.value)
               {
	               handler.SelectSecondVertexMenu(vertex2Text, handler.app.graph.vertices[i]);
                   break;
               }
           }
        };
        
        this.UpdateSecondVertexMenu(vertex2Text);
    }
}

BaseHandler.prototype.GetNodesPath = function(array, start, count) {
    var res = [];
    for (var index = start; index < start + count; index++) {
        res.push(this.app.graph.FindVertex(array[index].value));
    }
    return res;
}

BaseHandler.prototype.RestoreAll = function()
{
}

BaseHandler.prototype.GetSelectedVertex = function() {
    return null;
}

BaseHandler.prototype.RenameVertex = function(text, object) {
    if (object != null && (object instanceof Vertex)) {
        this.app.PushToStack("RenameVertex");
        object.mainText = text;
        this.app.redrawGraph();
    }
}

BaseHandler.prototype.ShowCreateEdgeDialog = function(firstVertex, secondVertex, addEdgeCallBack) {
    if (!this.app.graph.isMulti()) {
        var hasEdge        = this.app.graph.FindEdgeAny(firstVertex.id, secondVertex.id);
        var hasReverseEdge = this.app.graph.FindEdgeAny(secondVertex.id, firstVertex.id);

        if (hasEdge == null && hasReverseEdge == null) {
            document.querySelector('#RadiosAddEdge').checked = true;
			document.querySelector('#NewEdgeAction').classList.add('hide');
		
          
        } else {
			document.querySelector('#NewEdgeAction').classList.remove('hide');
        }
    } else {
        document.querySelector('#RadiosAddEdge').checked = true;
		document.querySelector('#NewEdgeAction').classList.add('hide');
    }

	document.querySelector('#EdgeLableInput').focus();
    document.querySelector('#EdgeLableInput').value = "";
	document.querySelector('#EdgeMarkInput').value = "";
	document.querySelector('#RadiosMarkTypeNone').checked = true;
	hideMarkId();
	var handler = this;
	
	const parent = document.querySelector('#addEdge');
		
	parent.classList.remove('hide');
	document.body.classList.add('locked');

	const directedBtn = document.querySelector('#directedBtn');
	
	const btnAction = (isDirected) => {
		handler.app.PushToStack("Connect");                
		addEdgeCallBack(firstVertex, secondVertex, isDirected);                    
		parent.classList.add('hide');
		document.body.classList.remove('locked');
	}

	const directedBtnAction = () => {
		btnAction(true);
		directedBtn.removeEventListener('click',directedBtnAction);
	}

	directedBtn.addEventListener('click', directedBtnAction);
	
}

/**
 * Default handler.
 * Select using mouse, drag.
 *
 */
function DefaultHandler(app) {
    this.removeStack = true;
	BaseHandler.apply(this, arguments);
	this.message = g_textsSelectAndMove; 
	this.app.updateMessage();
	this.selectedObjects = [];
	this.dragObject      = null;
	this.selectedObject  = null;
	this.prevPosition    = null;
    this.groupingSelect  = false;
    this.selectedLogRect = false;
    this.selectedLogCtrl = false;
    this.saveUndo    = false;
}

// inheritance.
DefaultHandler.prototype = Object.create(BaseHandler.prototype);
// Is pressed
DefaultHandler.prototype.pressed = false;
// Cuvled change value.
DefaultHandler.prototype.curvedValue    = 0.1;

DefaultHandler.prototype.GetSelectedVertex = function() {
    return (this.selectedObject instanceof Vertex) ? this.selectedObject : null;
}

DefaultHandler.prototype.MouseMove = function(pos)  {
	if (this.dragObject) {
        if (!this.saveUndo) {
            this.app.PushToStack("Move");
            this.saveUndo = true;
        }
                this.dragObject.pos.x = pos.x;
                this.dragObject.pos.y = pos.y;
		this.needRedraw = true;
	} else if (this.selectedObjects.length > 0 && this.pressed && !this.groupingSelect) {
		if (!this.saveUndo) {
			this.app.PushToStack("Move");
			this.saveUndo = true;
		}

		var offset = (new Point(pos.x, pos.y)).subtract(this.prevPosition);
		for (var i = 0; i < this.selectedObjects.length; i ++) {
			var object = this.selectedObjects[i];
			if (object instanceof Vertex)
			{
			object.position = object.position.add(offset);
			}
		}

		this.prevPosition = pos;

	this.needRedraw = true;         
	}
	else if (this.pressed) {
		if (this.groupingSelect) {
			// Rect select.
			var newPos = new Point(pos.x, pos.y);
			this.app.SetSelectionRect(new Rect(newPos.min(this.prevPosition), newPos.max(this.prevPosition)));
			this.SelectObjectInRect(this.app.GetSelectionRect());    
			this.needRedraw = true;
			if (!this.selectedLogRect) {
				this.selectedLogRect = true;
			}
		} else {
				// Move work space
				this.app.onCanvasMove((new Point(pos.x, pos.y)).subtract(this.prevPosition).multiply(this.app.canvasScale));
				this.needRedraw = true;
		}
	}
}

DefaultHandler.prototype.MouseDown = function(pos) {
	// closeModal();
	this.dragObject     = null;
	var selectedObject = this.GetSelectedObject(pos);

	if (selectedObject == null || (!this.selectedObjects.includes(selectedObject))) {
  	      this.selectedObject = null;
          this.selectedObjects = [];
          this.groupingSelect = false;
    }        

	if (this.selectedObjects.includes(selectedObject) && (this.selectedObjects.length > 0 || this.selectedObject != null) && selectedObject != null) 
	{
		if (this.selectedObjects.length == 0) {
			this.selectedObject = null;
			this.selectedObjects.push(selectedObject);
		}
		else if (!this.selectedObjects.includes(selectedObject)) {
			this.selectedObjects.push(selectedObject);
		}
	}
	else {	
		if (selectedObject != null) {
			this.selectedObject = selectedObject;
		}	
		if ((selectedObject instanceof Vertex) && selectedObject != null) { 
			this.dragObject = selectedObject;
			this.message    = g_moveCursorForMoving;	
			this.app.updateMessage();	
		}	
	}

	this.needRedraw = true;
	this.pressed    = true;
	this.prevPosition = pos;
	this.app.canvas.style.cursor = "move";
}

DefaultHandler.prototype.MouseUp = function(pos) {
    this.saveUndo = false;
	this.message = g_textsSelectAndMove; 
	this.app.updateMessage();
	this.dragObject = null;
    this.pressed    = false;
    this.app.canvas.style.cursor = "auto";
    
    this.groupingSelect = false;

    if (this.selectedObject != null && (this.selectedObject instanceof Vertex)) // Action on Vertex
	{
        this.message = g_textsSelectAndMove;

		if(this.selectedObject.getType() == 'finish') {
			this.message = g_textsSelectAndMove +  "<span><button  id=\"setVertexTypeDefault\" class=\"button\"> set type default</button></span>"
		}

		if(this.selectedObject.getType() == 'default') {
			this.message =  g_textsSelectAndMove + "<span><button  id=\"setVertexTypeFinish\" class=\"button\"> set type finish</button></span>"
		}
	
		this.app.updateMessage();

		if(document.querySelector('#setVertexTypeDefault')) {
			document.querySelector('#setVertexTypeDefault').addEventListener('click', () => {
				this.selectedObject.setType('default');
				this.selectedObject = null;
				this.message = g_textsSelectAndMove;
				this.app.updateMessage();
				this.app.redrawGraph();
				
			})
		}
		if(document.querySelector('#setVertexTypeFinish')) {
			document.querySelector('#setVertexTypeFinish').addEventListener('click', () => {
				this.selectedObject.setType('finish');
				this.selectedObject = null;
				this.message = g_textsSelectAndMove;
				this.app.updateMessage();
				this.app.redrawGraph();
			})
		} 
    }
    else if (this.selectedObject != null && (this.selectedObject instanceof Edge)) // Action on Edge
    {
        this.message = g_textsSelectAndMove
        + "<span><button  id=\"incCurvel\" class=\"button\"> + </button>"
        + " " + g_curveEdge + " "
        + "<button id=\"decCurvel\" class=\"button\"> - </button>"

		this.app.updateMessage();
        var handler = this;
		
		document.querySelector('#incCurvel').onclick = null;
		document.querySelector('#incCurvel').onclick = () => {
            handler.app.PushToStack("ChangeCurvelEdge");

            handler.selectedObject.model.changeCurvedValue(-DefaultHandler.prototype.curvedValue);
            handler.needRedraw = true;
            handler.app.redrawGraph();
        };

		document.querySelector('#decCurvel').addEventListener('click', function() {
            handler.app.PushToStack("ChangeCurvelEdge");

            handler.selectedObject.model.changeCurvedValue(+DefaultHandler.prototype.curvedValue);
            handler.needRedraw = true;
            handler.app.redrawGraph();
        });        
    }
    
    this.needRedraw = true;
}

DefaultHandler.prototype.GetSelectedGroup = function(object)
{
  return (object == this.dragObject) || (object == this.selectedObject) || (this.selectedObjects.includes(object));
}

DefaultHandler.prototype.SelectObjectInRect = function (rect)
{
    this.selectedObjects = [];
    var vertices = this.app.graph.vertices;
    for (var i = 0; i < vertices.length; i ++)
    {
		if (rect.isIn(vertices[i].position) && !this.selectedObjects.includes(vertices[i]))
            this.selectedObjects.push(vertices[i]);
	}

	// Selected Arc.
    var edges = this.app.graph.edges;
    for (var i = 0; i < edges.length; i ++)
    {
        var edge = edges[i];
        
        if (rect.isIn(edge.vertex1.position) && rect.isIn(edge.vertex2.position) && !this.selectedObjects.includes(edge))
            this.selectedObjects.push(edge);
	}
}

/**
 * Add Graph handler.
 *
 */
function AddGraphHandler(app) {
  this.removeStack = true;
  BaseHandler.apply(this, arguments);
  this.message = g_clickToAddVertex;	
}

// inheritance.
AddGraphHandler.prototype = Object.create(BaseHandler.prototype);

AddGraphHandler.prototype.MouseDown = function(pos)  {
    this.app.PushToStack("Add");
	this.app.CreateNewGraph(pos.x, pos.y);
	this.needRedraw = true;
	this.inited = false;
}

/**
 * Connection Graph handler.
 *
 */
function ConnectionGraphHandler(app)
{
  this.removeStack = true;
  BaseHandler.apply(this, arguments);
  this.SelectFirst();
}

// inheritance.
ConnectionGraphHandler.prototype = Object.create(BaseHandler.prototype);
// First selected.
ConnectionGraphHandler.prototype.firstObject = null;

ConnectionGraphHandler.prototype.GetSelectedVertex = function() {
    return (this.firstObject instanceof Vertex) ? this.firstObject : null;
}

ConnectionGraphHandler.prototype.AddNewEdge = function(selectedObject) {
	let mark = undefined;
	if(!document.querySelector('#RadiosMarkTypeNone').checked) {
		let markInput = document.querySelector('#EdgeMarkInput').value;
		mark = new Mark(
			document.querySelector('#RadiosMarkTypeOpen').checked ? '(' : ')',
			markInput.length > 0 ? markInput : ""
		)
	}		

	this.app.CreateNewArc(	
		this.firstObject, 
		selectedObject, 
		document.querySelector('#RadiosReplaceEdge').checked,
		document.querySelector('#EdgeLableInput').value,
		mark
	);
    
	this.SelectFirst();					
	this.app.NeedRedraw();
}

ConnectionGraphHandler.prototype.SelectVertex = function(selectedObject) {
    if (this.firstObject) {
        var direct = false;
        var handler = this;

        this.ShowCreateEdgeDialog(this.firstObject, selectedObject, function (firstVertex, secondVertex) {
            handler.AddNewEdge(secondVertex);
        });
    } else {
        this.SelectSecond(selectedObject);	
    }

    this.needRedraw = true;
}

ConnectionGraphHandler.prototype.MouseDown = function(pos) {
	var selectedObject = this.GetSelectedGraph(pos);
	if (selectedObject && (selectedObject instanceof Vertex)) {
        this.SelectVertex(selectedObject);
	} else {  
      this.SelectFirst();
      this.needRedraw = true;
    }
}

ConnectionGraphHandler.prototype.GetSelectedGroup = function(object) {
	return (object == this.firstObject) ? 1 : 0;
}

ConnectionGraphHandler.prototype.SelectFirst = function() {
	this.firstObject = null;
	this.message     = g_selectFisrtVertexToConnect;
	this.app.updateMessage();
}

ConnectionGraphHandler.prototype.SelectSecond = function(selectedObject) {
	this.firstObject = selectedObject;
	this.message     = g_selectSecondVertexToConnect;		
	this.app.updateMessage();
}

/**
 * Delete Graph handler.
 *
 */
function DeleteGraphHandler(app) {
  this.removeStack = true;
  BaseHandler.apply(this, arguments);
  this.message = g_selectObjectToDelete;
  this.app.updateMessage();
}

// inheritance.
DeleteGraphHandler.prototype = Object.create(BaseHandler.prototype);

DeleteGraphHandler.prototype.MouseDown = function(pos) {
	var selectedObject = this.GetSelectedObject(pos);
        
    if (!this.app.IsCorrectObject(selectedObject))
        return;
    
    this.app.PushToStack("Delete");
    this.app.DeleteObject(selectedObject);
	this.needRedraw = true;
}

/**
 * Delete Graph handler.
 *
 */
function DeleteAllHandler(app) {
  BaseHandler.apply(this, arguments);  
}

// inheritance.
DeleteAllHandler.prototype = Object.create(BaseHandler.prototype);

DeleteAllHandler.prototype.clear = function() {	
    this.app.PushToStack("DeleteAll");

	// Selected Graph.
    this.app.graph = new Graph(); 
    this.app.savedGraphName = "";
    this.needRedraw = true;
}
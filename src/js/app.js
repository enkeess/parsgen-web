/**
 * This is main application class.
 *
 */
 
let globalApplication = null;
 
function Application(document, window) {
    this.document = document;
    this.canvas  = this.document.querySelector('#canvas');
	this.canvasPosition = new Point();
	this.canvasScale = 1;
    this.handler = new AddGraphHandler(this);
    
	this.savedGraphName = "";

    this.findPathReport = 1;
    this.isTimerRender = false;

    globalApplication  = this;
    this.renderPath = [];
    this.renderTimer = 0;
    this.renderPathLength  = 0;
    this.renderPathCounter = 0;
    this.renderPathLoops = 0;

    this.undoStack  = [];
    
    this.renderPathWithEdges = false;
    
    this.selectionRect  = null;

	this.vertexDrawer     = new VertexDrawer(this.canvas.getContext('2d'));
	this.backgroundDrawer = new BackgroundDrawer(this.canvas.getContext('2d'));

	this.loader = new Loader();
};

// List of graph.
//Application.prototype.graph.vertices     = [];
// Current draged object.
Application.prototype.graph = new Graph();
Application.prototype.dragObject = -1;
// List of graph.edges.
//Application.prototype.graph.edges       = [];
// User handler.
Application.prototype.handler = null;
// Hold status.
Application.prototype.status = {};
// Graph name length
Application.prototype.graphNameLength = 16;
// Max undo stack size
Application.prototype.maxUndoStackSize = 20;

Application.prototype.getMousePos = function(canvas, e) {
    /// getBoundingClientRect is supported in most browsers and gives you
    /// the absolute geometry of an element
    let rect = canvas.getBoundingClientRect();

    /// as mouse event coords are relative to document you need to
    /// subtract the element's left and top position:
    return {x: (e.clientX - rect.left) / this.canvasScale - this.canvasPosition.x, y: (e.clientY - rect.top) / this.canvasScale - this.canvasPosition.y};
}

Application.prototype.redrawGraph = function() {
    if (!this.isTimerRender) {
        this._redrawGraphInWindow();
        // this.GraphTypeChanged();
    }
}

Application.prototype.redrawGraphTimer = function() {
    if (this.isTimerRender) {
        let context = this._redrawGraphInWindow();
        
        // Render path
        if (this.renderPath.length > 1) {
            context.save();
            context.scale(this.canvasScale, this.canvasScale);
            context.translate(this.canvasPosition.x, this.canvasPosition.y);
            
            let movePixelStep = 16;
            let currentLength = 0;
            
            let i = 0
            for (i = 0; i < this.renderPath.length - 1; i++) {
                let edge = null;
                if (this.renderPathWithEdges) {
                    edge = this.graph.FindEdgeById(this.renderPath[i + 1]);
                    i++;
                } else if (this.renderMinPath) {
                    edge = this.graph.FindEdgeMin(this.renderPath[i], this.renderPath[i + 1]);
                } else {
                    edge = this.graph.FindEdge(this.renderPath[i], this.renderPath[i + 1]);
                }
                    
                currentLength += edge.GetPixelLength();
                if (currentLength > this.renderPathCounter) {
                    currentLength -= edge.GetPixelLength();
                    break;
                }
            }
            
            if (i >= this.renderPath.length - 1) {
                i = 0;
                if (this.renderPathWithEdges) {
                    i = 1;
				}
                
				this.renderPathCounter = 0;
                currentLength = 0;
                this.renderPathLoops += 1;
            }
            
            let edge = null;
            let currentVertexId = this.renderPath[i];
            if (this.renderPathWithEdges) {
                edge = this.graph.FindEdgeById(this.renderPath[i]);
                currentVertexId = this.renderPath[i - 1];
            } else if (this.renderMinPath) {
                edge = this.graph.FindEdgeMin(this.renderPath[i], this.renderPath[i + 1]);
            } else {
                edge = this.graph.FindEdge(this.renderPath[i], this.renderPath[i + 1]);
            }
            
            let progress = (this.renderPathCounter - currentLength) / edge.GetPixelLength();
            
            this.RedrawEdgeProgress(context, edge, edge.vertex1.id == currentVertexId ? progress : 1.0 - progress);

            this.renderPathCounter += movePixelStep;
            
            context.restore();
        }
    }
    
    if (this.renderPathLoops >= 5) {
        this.stopRenderTimer();
    }
}

Application.prototype._redrawGraphInWindow = function() {
    let context = this.canvas.getContext('2d');
	
    context.save();
    
		context.scale(this.canvasScale, this.canvasScale);
		context.translate(this.canvasPosition.x, this.canvasPosition.y);
		
		this._RedrawGraph(context, this.canvasPosition, this.backgroundCommonStyle, true);

    context.restore();
    
    return context;
}

Application.prototype._OffscreenRedrawGraph = function() {
    let bbox = this.graph.getGraphBBox();
    let canvas = document.createElement('canvas');
    canvas.width  = bbox.size().x;
    canvas.height = bbox.size().y;
    let context = canvas.getContext('2d');
    
    context.save();

    context.translate(bbox.minPoint.inverse().x, bbox.minPoint.inverse().y);
    
    this._RedrawGraph(context, bbox.minPoint.inverse(), this.backgroundCommonStyle, false);
    
    context.restore();
    
    return canvas;
}

Application.prototype.updateRenderPathLength = function() {
    this.renderPathLength = 0;
    this.renderPathCounter = 0;
    if (this.renderPath.length > 1) {
        for (let i = 0; i < this.renderPath.length - 1; i++) {
            let edge = null;
            if (this.renderPathWithEdges) {
                edge = this.graph.FindEdgeById(this.renderPath[i + 1]);
                i++;
            } else {
                edge = this.graph.FindEdge(this.renderPath[i], this.renderPath[i + 1]);
            }

            this.renderPathLength += edge.GetPixelLength();
        }
    }
}

Application.prototype.startRenderTimer = function() {
    this.updateRenderPathLength();
    this.renderTimer = window.setInterval(function(){globalApplication.redrawGraphTimer();}, 50);
    this.isTimerRender = true;
    this.renderPathLoops = 0;
}

Application.prototype.stopRenderTimer = function() {
    if (this.isTimerRender) {
        window.clearInterval(this.renderTimer);
        this.isTimerRender = false;
        this.renderPathLoops = 0;
    }
}

Application.prototype.setRenderPath = function(renderPath, renderMinPath) {
    this.renderPath    = renderPath;
    this.renderMinPath = renderMinPath;
    this.renderPathWithEdges = false;
    
    if (this.renderPath.length > 0) {
        this.startRenderTimer();
    } else {
        this.stopRenderTimer();
    }
}

Application.prototype.setRenderPathWithEdges = function(renderPath) {
    this.renderPath    = renderPath;
    this.renderMinPath = false;
    this.renderPathWithEdges = true;
    
    if (this.renderPath.length > 0) {
        this.startRenderTimer();
    } else {
        this.stopRenderTimer();
    }
}

Application.prototype.GetBaseArcDrawer = function(context, edge) {
    let arcDrawer = new EdgeDrawer(context);
    
    if (edge.model.type == EdgeModels.cruvled) {
        arcDrawer = new CurvedArcDrawer(context, edge.model);
    }
    
    return arcDrawer;
}

// Application.prototype.UpdateEdgeCurrentStyle = function(edge, ForceCommonStyle, ForceSelectedStyle) {
// }

Application.prototype.RedrawEdge = function(context, edge) {
    let arcDrawer       = this.GetBaseArcDrawer(context, edge);
	arcDrawer.draw(edge, this.handler.GetSelectedGroup(edge));
}

Application.prototype.RedrawEdges = function(context) {
    for (i = 0; i < this.graph.edges.length; i ++) {
        this.RedrawEdge(context, this.graph.edges[i]);
    }
}

Application.prototype.RedrawNodes = function(context) {
	this.graph.vertices.forEach(v => {
		this.vertexDrawer.draw(v, this.handler.GetSelectedGroup(v));
	})
}


Application.prototype.updateMessage = function() {
	this.document.querySelector('#message').innerHTML = this.handler.GetMessage(); 
}

Application.prototype.CanvasOnMouseMove  = function(e) {
	// X,Y position.
	let pos = this.getMousePos(this.canvas, e);

	this.handler.MouseMove(pos);
	if (this.handler.IsNeedRedraw()) {
		this.handler.RestRedraw();
		this.redrawGraph();
	}
}

Application.prototype.CanvasOnMouseDown = function(e) {
    // Skip non left button.
    if(e.which !== 1) return;

    let pos = this.getMousePos(this.canvas, e); /// provide this canvas and event

	this.handler.MouseDown(pos);
	if (this.handler.IsNeedRedraw()) {
		this.handler.RestRedraw();
		this.redrawGraph();
	}

    // this.updateMessage();
}

Application.prototype.CanvasOnMouseUp = function(e) {
    // Skip non left button.
    if(e.which !== 1) return;

	this.dragObject = -1;
	let pos = this.getMousePos(this.canvas, e);

	this.handler.MouseUp(pos);
	if (this.handler.IsNeedRedraw()) {
		this.handler.RestRedraw();
		this.redrawGraph();
	}
}

Application.prototype.multCanvasScale = function(factor) {
    let oldRealWidth = this.GetRealWidth();
    let oldRealHeight = this.GetRealHeight();
    
    this.canvasScale *= factor;
    
    this.canvasPosition = this.canvasPosition.add(new Point((this.GetRealWidth()  - oldRealWidth) / 2.0,
                                                            (this.GetRealHeight() - oldRealHeight) / 2.0));
    
    this.redrawGraph();
}

Application.prototype.setCanvasScale = function(factor) {
    let oldRealWidth = this.GetRealWidth();
    let oldRealHeight = this.GetRealHeight();
    
    this.canvasScale = factor;
    
    this.canvasPosition = this.canvasPosition.add(new Point((this.GetRealWidth()  - oldRealWidth) / 2.0,
                                                            (this.GetRealHeight() - oldRealHeight) / 2.0));
    
    this.redrawGraph();
}

Application.prototype.onCanvasMove = function(point) {
    this.canvasPosition = this.canvasPosition.add(point.multiply(1 / this.canvasScale));
    this.redrawGraph();
}

Application.prototype.AddNewVertex = function(x,y) {
	return this.graph.AddNewVertex(x,y);
}

Application.prototype.AddNewEdge = function(edge, replaceIfExists) {
	return this.graph.AddNewEdge(edge, replaceIfExists);
}

Application.prototype.CreateNewGraph = function(x, y) {
    let app = this;
	app.graph.AddNewVertex(x,y);
	app.redrawGraph();
}

Application.prototype.CreateNewGraphEx = function(x, y,) {
    return this.graph.AddNewVertex(x, y);
}

Application.prototype.CreateNewArc = function(v1, v2,  replaceIfExist, label, mark) {
	let edge = this.AddNewEdge(new Edge(v1, v2, label, mark), replaceIfExist);
    this.graph.FixEdgeCurved(edge);
    return edge;
}

Application.prototype.DeleteEdge = function(edgeObject) {
    let v1 = edgeObject.v1;
    let v2 = edgeObject.v2;
    
    let hasPair = this.graph.hasPair(edgeObject);
    
	this.graph.DeleteEdge(edgeObject);
    
    // Make line for pair.
    if (hasPair) {
        let pairEdges = this.FindAllEdges(v2.id, v1.id);
        
        if (pairEdges.length == 1 && pairEdges[0].model.default)
            pairEdges[0].model.type = EdgeModels.line;
    }
}

Application.prototype.DeleteVertex = function(graphObject) {
	this.graph.DeleteVertex(graphObject);
}

Application.prototype.DeleteObject = function(object) {
	if (object instanceof Vertex) {
		this.DeleteVertex(object);
	} else if (object instanceof Edge) {
		this.DeleteEdge(object);
	}
}

Application.prototype.IsCorrectObject = function(object) {
	return (object instanceof Vertex) || 
           (object instanceof Edge);
}

Application.prototype.FindVertex = function(id) {
	return this.graph.FindVertex(id);
}

Application.prototype.FindEdge = function(id1, id2) {
	return this.graph.FindEdge(id1, id2);
}

Application.prototype.FindEdgeAny = function(id1, id2) {
	return this.graph.FindEdgeAny(id1, id2);
}

Application.prototype.FindAllEdges = function(id1, id2) {
	return this.graph.FindAllEdges(id1, id2);
}

Application.prototype.SetHandlerMode = function(mode) {
	switch(mode) {
		case "default": {
			this.handler = new DefaultHandler(this);
			break;
		}

		case "addGraph": {
			this.handler = new AddGraphHandler(this);
			break;
		}

		case "addArc": {
			this.handler = new ConnectionGraphHandler(this);
			break;
		}

		case "delete": {
			this.handler = new DeleteGraphHandler(this);
			break;
		}

		case "deleteAll": {
			let removeAll = new DeleteAllHandler(this);
			removeAll.clear();
			break;
		}

		case "connectedComponent": {
			this.handler = new ConnectedComponentGraphHandler(this);
			break;
		}

		case "graphUndo": {
			!this.IsUndoStackEmpty() && this.Undo();
			break;
		}

		default: {
			break;
		}
	}
    
    this.setRenderPath([]);
	this.updateMessage();
	this.redrawGraph();
}

Application.prototype.onLoad = function() {
    this.canvas = this.document.getElementById('canvas');

    this.handler = new AddGraphHandler(this);

    this.updateMessage();
    this.redrawGraph();
}

Application.prototype.NeedRedraw = function() {
	this.redrawGraph();
}
                          
Application.prototype.LoadGraphFromString = function (str) {
	this.graph = this.loader.loadGraph(str);    
	this.AutoAdjustViewport();
    this.updateMessage();
    this.redrawGraph();   
}

Application.prototype.GetNewGraphName = function() {
    return this.GetNewName();
}

Application.prototype.GetNewName = function() {
    let name = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    for (let i = 0; i < this.graphNameLength; i++ ) {
        name += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return name;
}

Application.prototype.GetGraphName = function() {
    return this.savedGraphName;
}

Application.prototype.SetDefaultHandler = function() {
	restButtons ('Default');
	this.SetHandlerMode("default");
}
                                                    
Application.prototype.GetRealWidth = function () {
    return this.canvas.width / this.canvasScale;
}
                          
Application.prototype.GetRealHeight = function () {
    return this.canvas.height / this.canvasScale;
}
                          
Application.prototype.SetDefaultTransformations = function() {
    this.canvasScale = 1.0;
    this.canvasPosition = new Point(0, 0);
}

Application.prototype.AutoAdjustViewport = function()
{
    graphBBox  = this.graph.getGraphBBox();
    bboxCenter = graphBBox.center();
    bboxSize   = graphBBox.size();
                          
    if (bboxSize.length() > 0) {
        // Setup size
        if (bboxSize.x > this.GetRealWidth() || bboxSize.y > this.GetRealHeight()) {
            this.canvasScale = Math.min(this.GetRealWidth() / bboxSize.x, this.GetRealHeight() / bboxSize.y);
        }
                          
        // Setup position.
        if (graphBBox.minPoint.x < 0.0 || graphBBox.minPoint.y < 0.0 ||
            graphBBox.maxPoint.x > this.GetRealWidth() || graphBBox.maxPoint.y > this.GetRealHeight())
        {
            // Move center.
            this.canvasPosition  = graphBBox.minPoint.inverse();
        }
    }
}
                          
Application.prototype.OnAutoAdjustViewport = function() {
    this.SetDefaultTransformations();
    this.AutoAdjustViewport();
    this.redrawGraph();
}
    
Application.prototype.IsGraphFitOnViewport = function() {
    res = true;
    graphBBox  = this.graph.getGraphBBox();
    let canvasWidth  = this.GetRealWidth();
    let canvasHeight = this.GetRealHeight();
    let canvasPositionInverse = this.canvasPosition.inverse();

    return (Math.floor(canvasPositionInverse.x) <= Math.floor(graphBBox.minPoint.x) &&
        Math.floor(canvasPositionInverse.y) <= Math.floor(graphBBox.minPoint.y) && Math.floor(canvasPositionInverse.x + canvasWidth) >= Math.floor(graphBBox.maxPoint.x)
        && Math.floor(canvasPositionInverse.y + canvasHeight) >= Math.floor(graphBBox.maxPoint.y));
}

Application.prototype.PushToStack = function(actionName) {
    var object        = {};
    object.actionName = actionName;
    object.graphSave  = this.graph.save();    
    
    this.undoStack.push(object);

    while (this.undoStack.length > this.maxUndoStackSize) {
        this.undoStack.shift();
    }
}

Application.prototype.Undo = function() {
    if (this.IsUndoStackEmpty())
        return;
    
    let state  = this.undoStack.pop();

	this.graph = this.loader.loadGraph(state.graphSave)
    this.redrawGraph();  
}

Application.prototype.ClearUndoStack = function() {
    this.undoStack = [];
}

Application.prototype.IsUndoStackEmpty = function() {
    return (this.undoStack.length <= 0);
}

Application.prototype.setBackgroundStyle = function (style) {
	this.backgroundDrawer.setStyle(style);
	this.redrawGraph();
}

Application.prototype.setDarkMode = function() {
	this.backgroundDrawer.setStyle(darkBackgroundStyle);
	baseEdgeStyle = darkEdgeStyle;
	this.redrawGraph();
}

Application.prototype.setLightMode = function () {
	this.backgroundDrawer.setStyle(lightBackgroundStyle);
	baseEdgeStyle = lightEdgeStyle;
	this.redrawGraph();
}

Application.prototype.GetAvalibleCruvledValue = function(neighbourEdges, originalEdge) {
    return this.graph.GetAvalibleCruvledValue(neighbourEdges, originalEdge);
}


Application.prototype._RedrawGraph = function(context, backgroundPosition) {    
    this.backgroundDrawer.draw(
        Math.max(this.canvas.width, this.GetRealWidth()), 
        Math.max(this.canvas.height, this.GetRealHeight()), 
        backgroundPosition, 
        this.canvasScale);
    
    this.RedrawEdges(context);
    this.RedrawNodes(context);
}

Application.prototype.GetSelectedVertexes = function() {
	return this.graph.vertices.find(v => this.handler.GetSelectedGroup(v))
}

Application.prototype.GetSelectedEdges = function() {
	return this.graph.edges.find(edge => this.handler.GetSelectedGroup(edge))
}

Application.prototype.makePiece = function (){
	const newGraph = {
		name: "_main",
		id: -1,
		start: this.graph.vertices.find(v => v.type === 'start').id,
		finish: this.graph.vertices.filter(v => v.type === 'finish').map(v => v.id),
		vertices: this.graph.vertices.map(v => {
			return({
				name: v.text,
				id: v.id,
				edges: this.graph.edges.filter(edge => 
					edge.v1.id === v.id
				).map(edge => ({
					to: edge.v2.id,
					label: edge.label,
					mark: edge.mark
				}))
			})
		})
	}

	return newGraph;
}

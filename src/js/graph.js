function Graph() {
	// List of vertex.
	this.vertices = [];
	// List of arcs.
	this.edges   = [];
	// Unique Id of new graph.
	this.uidGraph = 1;
	// Unique Id of new edge.
	this.uidEdge = 10001;
	// Has direction edge.
	// this.hasDirect = false;
    // Is graph multi
    this.isMultiGraph = false;
	// Vertex name style
	this.pattern = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
};

// infinity
Graph.prototype.infinity = 1E8;
// Max vertexes
Graph.prototype.maxVertexes = 1000;
// Offset for edges ids.
Graph.prototype.edgesOffset = 10000;

// add Vertex
Graph.prototype.AddNewVertex = function(x,y) {
	if (this.vertices.length <= this.maxVertexes) {
		const v = new Vertex(new Point(x, y), this.uidGraph, this.getVertexText(this.uidGraph - 1));
		if(this.uidGraph == 1) {
			v.setType('start');
		}
		this.vertices.push(v);
		this.uidGraph = this.uidGraph + 1;
	}

	return this.vertices.length - 1;
}

Graph.prototype.getVertexText = function(id) {
    let res = this.pattern[id % this.pattern.length];

	while (id >= this.pattern.length) {
	   id  = Math.floor(id / this.pattern.length) - 1;
	   res = this.pattern[id % this.pattern.length] + res;
	}

	return res;
}


Graph.prototype.AddNewEdge = function(edge, replaceIfExists) {
    edge.id = this.uidEdge;
    this.uidEdge = this.uidEdge + 1;
    
	var edge1      = this.FindEdgeAny(edge.v1.id, edge.v2.id);
	var edgeRevert = this.FindEdgeAny(edge.v2.id, edge.v1.id);

	if (!edge.isDirect) {
		if (edge1 != null && replaceIfExists)
			this.DeleteEdge(edge1);
		if (edgeRevert != null && replaceIfExists)
			this.DeleteEdge(edgeRevert);
		this.edges.push(edge);
	} else {
		if (edge1 != null && replaceIfExists)
			this.DeleteEdge(edge1);
		if (edgeRevert != null && !edgeRevert.isDirect && replaceIfExists)
			this.DeleteEdge(edgeRevert);
		
		this.edges.push(edge);
	}
    
    this.isMultiGraph = this.checkMutiGraph();
	
	return this.edges.length - 1;
}


Graph.prototype.DeleteEdge = function(edgeObject) {
	var index = this.edges.indexOf(edgeObject);
	
	if (index > -1) {
		this.edges.splice(index, 1);
	}
    
    this.isMultiGraph = this.checkMutiGraph();
}

Graph.prototype.DeleteVertex = function(vertexObject) {
	if(this.vertices.length > 1 && vertexObject.getId() != 0) {
		var index = this.vertices.indexOf(vertexObject);
		if (index > -1) {
			for (var i = 0; i < this.edges.length; i++) {
				if (this.edges[i].v1 == vertexObject || this.edges[i].v2 == vertexObject) {
					this.DeleteEdge(this.edges[i]);
					i--;
				}
			}
			
			this.vertices.splice(index, 1);
		}
	} else {
		if(this.vertices.length == 1) {
			this.vertices = []
		}
	}

	
}

Graph.prototype.HasConnectedNodes = function(vertexObject) {
	var res = false;

	var index = this.vertices.indexOf(vertexObject);
	if (index > -1)  {
 		for (var i = 0; i < this.edges.length; i++) {
			if (this.edges[i].v1 == vertexObject || this.edges[i].v2 == vertexObject) {
				res = true;
				break;
			}
		}
	}

	return res;
}

Graph.prototype.FindVertex = function(id) {
	var res = null;
	for (var i = 0; i < this.vertices.length; i++) {
		if (this.vertices[i].id == id) {
			res = this.vertices[i];
			break;
		}
	}
	
	return res;
}

// depricated
Graph.prototype.FindEdge = function(id1, id2) {
	return this.FindEdgeAny(id1, id2);
}

Graph.prototype.FindEdgeById = function(edgeId) {
    var res = null;
    for (var i = 0; i < this.edges.length; i++) {
        if (this.edges[i].id == edgeId) {
            res = this.edges[i];
            break;
        }
    }
	
    return res;
}

Graph.prototype.FindEdgeAny = function(id1, id2) {
	var res = null;
	for (var i = 0; i < this.edges.length; i++) {
		if ((this.edges[i].v1.id == id1 && this.edges[i].v2.id == id2)
		     || (!this.edges[i].isDirect && this.edges[i].v1.id == id2 && this.edges[i].v2.id == id1))
		{
			res = this.edges[i];
			break;
		}
	}
	
	return res;
}

Graph.prototype.FindAllEdges = function(id1, id2) {
	return this.edges.filter(({v1, v2}) => v1.id == id1 && v2.id == id2 || v2.id == id1 && v1.id == id2);
}

Graph.prototype.IsVertexesHasSamePosition = function (position, vertexCount) {
	var res = false;

	for (var j = 0; j < Math.min(this.vertices.length, vertexCount); j++)
	{
		if (position.distance(this.vertices[j].position) < this.vertices[j].model.diameter * 2)
		{
			res = true;
			break;
		}
	}

	return res;
}

Graph.prototype.GetRandomPositionOfVertex = function (matrix, vertexIndex, viewportSize) {
	var point = new Point(0, 0);
	var relatedVertex = [];
	for (var j = 0; j < matrix.length; j++) {
		if (j < this.vertices.length && (cols[vertexIndex][j] > 0 || 
			cols[j][vertexIndex] > 0) && j != vertexIndex) 
		{
			relatedVertex.push(this.vertices[j]);
		}
	}

	var diameter = (new VertexModel()).diameter;

	if (relatedVertex.length > 1) {
		for (var j = 0; j < relatedVertex.length; j++) {
			point = point.add(relatedVertex[j].position);
		}

		point = point.multiply(1 / relatedVertex.length);
		point.offset (Math.random() * diameter + (Math.random() ? -1 : 1) * 2 * diameter, Math.random() * diameter + (Math.random() ? -1 : 1) * 2 * diameter);
	} else {
		point = new Point(Math.random() * viewportSize.x, Math.random() * viewportSize.y);
	}

	if (this.IsVertexesHasSamePosition (point, matrix.length)) { 
		point.offset (Math.random() * diameter + + (Math.random() ? -1 : 1) * 4 * diameter, 
			Math.random() * diameter + + (Math.random() ? -1 : 1) * 4 * diameter);
	}

	// Clamp
	point.x = Math.min(Math.max(point.x, diameter), viewportSize.x);
	point.y = Math.min(Math.max(point.y, diameter), viewportSize.y);

	return point;
}

Graph.prototype.save = function(){
	const graph = {
		uidGraph: this.uidGraph,
	 	uidEdge:  this.uidEdge,
		vertices: this.vertices.map(v => v.save()),
		edges: this.edges.map(edge => edge.save())
	}

	return JSON.stringify(graph);
}

Graph.prototype.load = function(data) {
	const {uidGraph, uidEdge, vertices, edges} = {...JSON.parse(data)}
	
	const graph = new Graph();
	graph.uidGraph = uidGraph;
	graph.uidEdge  = uidEdge;
	graph.vertices = vertices.map(v => Vertex.load(v));
	graph.edges    = edges.map(edge => EdgeModel.load(edge, graph.vertices));

	return graph;
}


Graph.prototype.hasDirectEdge = function () {
	var res = false;
	for (var i = 0; i < this.edges.length; i++) {
		if(this.edges[i].isDirect) {
			res = true;
			break;
		}
	}
	
	return res;
}

Graph.prototype.clampPositions = function (viewportSize) {
	var diameter = (new VertexModel()).diameter;

     	for(i = 0; i < this.vertices.length; i++) // set new positions
     	{
       		this.vertices[i].position.x = Math.min(Math.max(this.vertices[i].position.x, diameter), viewportSize.x - diameter);
        	this.vertices[i].position.y = Math.min(Math.max(this.vertices[i].position.y, diameter), viewportSize.y - diameter);
        }
}

// Use to setup scaling.
Graph.prototype.getGraphBBox = function (viewportSize) {
    let pointMin = new Point(1e5, 1e5);
    let pointMax = new Point(-1e5, -1e5);

	this.vertices.forEach(v => {
		var deltaVector = new Point(v.d, v.d);
        pointMin = pointMin.min(v.pos.subtract(deltaVector));
        pointMax = pointMax.max(v.pos.add(deltaVector));
	})

    const max_cruvled_length = 32;
	
	this.edges.forEach(edge => {
		if (edge.model.type == EdgeModels.cruvled) {
            var max_cruvled = edge.v2.pos.subtract(edge.v1.pos).length() / max_cruvled_length;
            
            for (j = 0; j < max_cruvled; j++) {
              var point = edge.model.getCurvedPoint(edge.v1.pos, edge.v2.pos, j / max_cruvled);
              var deltaVector = new Point(max_cruvled_length, max_cruvled_length);
              pointMin = pointMin.min(point.subtract(deltaVector));
              pointMax = pointMax.max(point.add(deltaVector));
            }
        }
	})
    
    return new Rect(pointMin, pointMax);
}

Graph.prototype.hasPair = function (edge) {
	return this.FindPairFor(edge) != null;
}

Graph.prototype.FindPairFor = function (edge) {
    var res = this.getNeighbourEdges(edge);
	
	return res.length == 1 ? res[0] : null;
}

Graph.prototype.getNeighbourEdges = function (edge) {
	var res = [];
    
	for (var i = 0; i < this.edges.length; i++) {
        var curEdge = this.edges[i];
        if (curEdge == edge)
            continue;
            
		if ((curEdge.v1.id == edge.v1.id  && 
             curEdge.v2.id == edge.v2.id) ||
            (curEdge.v1.id == edge.v2.id  && 
             curEdge.v2.id == edge.v1.id)) 
		{
			res.push(curEdge);
		}
	}
	
	return res;
}

Graph.prototype.checkMutiGraph = function () {
	var res = false;
    
    var start  = {};
    
	for (var i = 0; i < this.edges.length; i++) {
        var edge = this.edges[i];
        if (start.hasOwnProperty(edge.v1.id) && 
            start[edge.v1.id] == edge.v2.id)
        {
            res = true;
            break;
        }
        
        start[edge.v1.id] = edge.v2.id;
        if (!edge.isDirect) {
            if (start.hasOwnProperty(edge.v2.id) && 
                start[edge.v2.id] == edge.v1.id)
            {
                res = true;
                break;
            }
            
            start[edge.v2.id] = edge.v1.id;
        }
	}
	
	return res;
}

Graph.prototype.isMulti = function () {
	return this.isMultiGraph;
}

Graph.prototype.isNeedReposition = function () {
    var res = false;
	for (var i = 0; i < this.vertices.length; i++) {
		res = res || this.vertices[i].IsUndefinedPosition();
	}

    return res;
}

Graph.prototype.FixEdgeCurved = function (edgeIndex)
{
    var edgeObject = this.edges[edgeIndex];
    var hasPair    = this.hasPair(edgeObject);
    var neighbourEdges = this.getNeighbourEdges(edgeObject);
    
    if (hasPair) {
        if (edgeObject.model.default)
            edgeObject.model.type = EdgeModels.cruvled; 
        
        var pairEdge = this.FindPairFor(edgeObject);
        if (pairEdge.model.default) {
            pairEdge.model.type = EdgeModels.cruvled;
            if (pairEdge.v1 == edgeObject.v1 && pairEdge.v2 == edgeObject.v2)
                pairEdge.model.curvedValue = -pairEdge.model.curvedValue;
        }
    }
    else if (neighbourEdges.length >= 2) {
        var cruvled = this.GetAvalibleCruvledValue(neighbourEdges, edgeObject);
        if (edgeObject.model.default) {
            edgeObject.model.type        = EdgeModels.cruvled;
            edgeObject.model.curvedValue = cruvled;
        }
    }
}

Graph.prototype.GetAvalibleCruvledValue = function(neighbourEdges, originalEdge) {
    var values = [];
    
    for (var i = 0; i < neighbourEdges.length; i ++) {
      var edge          = neighbourEdges[i];
      var sameDirection = (originalEdge.v1.id == edge.v1.id);
      if (edge.model.type == EdgeModels.cruvled) {
        values[(sameDirection ? edge.model.curvedValue : -edge.model.curvedValue)] = true;
      }
    }
    
    var changeValue  = DefaultHandler.prototype.curvedValue;
    var defaultValue = 0.0;
    var maxSearch    = 10;
    
    for (var i = 1; i < maxSearch; i ++) {
        value = i * changeValue;
        if (!values.hasOwnProperty(value))
            return value;

        value = - i * changeValue;
        if (!values.hasOwnProperty(value))
            return value;
    }
    
    return defaultValue;
}
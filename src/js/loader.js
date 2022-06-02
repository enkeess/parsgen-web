class Loader {
	loadGraph = (data) => {
		const {uidGraph, uidEdge, vertices, edges} = {...JSON.parse(data)}
		
		const graph = new Graph();
		graph.uidGraph = uidGraph;
		graph.uidEdge  = uidEdge;
		graph.vertices = vertices.map(v => this.loadVertex(v));
		graph.edges    = edges.map(edge => this.loadEdge(edge, graph.vertices));

		return graph;	
	}	

	loadEdge = (data, vertices) => {
		const {id, v1Id, v2Id, label, mark, model} = {...data};

		
		const v1 = vertices.find(v => v.id == v1Id);
		const v2 = vertices.find(v => v.id == v2Id);

		// const marks = mark.({type, id}) => {
		// 	return new Mark(type, id)
		// })

		const edge = new Edge(v1, v2, label, mark, model);
		
		edge.setId(id);
		
		return edge;
	}

	loadVertex = (data) => {
		const {pos, id, text, type} = {...data};

		const {x, y} = {...pos}
		return new Vertex(new Point(x, y), id, text, type);
	}
}
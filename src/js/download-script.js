const downloadBtn = document.querySelector('#DownloadParser');

class MyFile {
	constructor(name, value){
		this.name = name;
		this.value = value;
	}
}

class MyMap {
	constructor(base = "", files = [], children = []){
		this.base = base,
		this.files = files,
		this.children = children;
	}
}

const gitRequest = async (path) => {
	return await fetch(path).then(resp => resp.text());			
}

const parse = async (data, path) => {
	const newMap = new MyMap(data.folder);
	let myPath = path + data.folder + '/';
	const files = await Promise.all(
		data.files.map(async (file) => {
			return await gitRequest(myPath + file)
		})
	);
	
	newMap.files = data.files.map((file, i) => {
		return new MyFile(file, files[i])
	})

	newMap.children = await Promise.all(
		data.children.map( async (children) => {
			return await parse(children, myPath);
		})
	)
	
	return newMap;
}

const getFilesMap = async () => {
	return await fetch('https://raw.githubusercontent.com/enkeess/parsgen-test/main/road-map.json')
		.then(resp => resp.text())
		.then(text => JSON.parse(text))
		.then(async ({data, base}) => {
			return await parse(data, base);
		})
}

const res = getFilesMap();
let zip = new JSZip();

const addToZip = ({base, files, children}) => {
	files.forEach(({name, value}) => {
		zip.folder(base).file(name, value);
	})

	children.forEach(children => addToZip(children));
}

const makeZip = () => {
	try {
		const transform = new Transform(application.graph);
		// вычисляем пути до конечных вершин и циклы
		transform.findWayToFinish();
		// Проверяем на пустые циклы 
		transform.checkEmptyCycle();
		// подсчитываем директы для каждого ребра
		transform.calcDirect();
		// проверяем критерий
		transform.checkDirect();
		// генерируем файл конфига
		const file = transform.makeFile();
		// добавляем файлы в архив
		res.then(filesMap => {
			addToZip(filesMap);
		})
		.then(() => {	
			zip.folder("src").file("Dependencies.cpp", file);
			zip.generateAsync({type: "blob"})
			.then(content => {
				saveAs(content, "parser_build.zip");
			})
		})		
	}
	catch (e) {
		// application.mess
		let message = "";
		if(e.type) {
			message += e.type;

			message += ": " + e.payload;

			this.document.querySelector('#message').innerHTML = message;
		} 

		console.log(e);
	}
}

downloadBtn.addEventListener('click', makeZip);

class Transform {
	constructor(graph) {
		this.graph = new Graph();

		this.graph.vertices = [...graph.vertices];
		this.graph.edges = [...graph.edges];
		this.graph.uidGraph = graph.uidGraph;
		this.graph.uidEdge = graph.uidEdge;

		this.emptyEdges    = this.graph.edges.filter(edge => edge.label == "" && !edge.mark);

		this.simpleCycle   =  this.graph.edges.filter(edge => edge.v1.id == edge.v2.id);
		this.normalEdge    =  this.graph.edges.filter(edge => edge.v1.id != edge.v2.id);
		
		this.cycles = [];
		this.ways = [];
	}

	makeAdjacencyList = function () {
		const newGraph = {
			name: "_main",
			id: 0,
			start: this.graph.vertices.find(v => v.type === 'start').id,
			finish: this.graph.vertices.filter(v => v.type === 'finish').map(v => v.id),
			vertices: this.graph.vertices.map(v => {
				return({
					name: v.text,
					id: v.id,
					edges: this.graph.edges.filter(edge => 
						edge.v1.id === v.id
					).map(edge => ({
						id: edge.id,
						to: edge.v2.id,
						label: edge.label,
						mark: edge.mark,
						direct: edge.direct
					}))
				})
			})
		}

		return newGraph;
	}

	checkEmptyCycle = function() {
		this.cycles.forEach(item => {
			if(item.edgeTrace.every(edge => edge.label == "" && !edge.mark)) {
				throw ({
					type: "EMPTY_CYCLE_ERROR",
					payload: item.trace.join("->") + "->" + item.trace[0]
				})
			}

			if(item.edgeTrace.every(edge => edge.label == "")) {
				const stack = item.edgeTrace.map(edge => edge.mark).filter(m => m);
				if(this.isEmptyBracketSystem(stack)) {
					throw({
						type: "EMPTY_CYCLE_ERROR_EMPTY_BRACKET_TRACE",
						payload: item.trace.join("->") + "->" + item.trace[0]
					})
				}
			}
		})
	}

	isEmptyBracketSystem = function(stack) {
		let myStack = [...stack];

		if(stack.length % 2 == 0) { // как минимум скобок четное кол-во
			
			for(let j = 0; j < stack.length / 2; j++) {
				console.log("J: " + j);
				for(let i = 0; i < myStack.length - 1; i++) {
					if( myStack[i].id == myStack[i + 1].id && 
						myStack[i].type == "(" &&
						myStack[i + 1].type == ")"
					) {
						myStack = [...myStack.slice(0,i), ...myStack.slice(i+2)];
						break;
					}
				}

				if(myStack.length >= 2) {
					if(	myStack[0].id == myStack[myStack.length - 1].id && 
						myStack[0].type == ")" &&
						myStack[myStack.length - 1].type == "(") 
					{
						myStack = myStack.slice(1, -1);
					}
				}
				
			}
		}

		return myStack.length == 0;
	}

	calcDirect = function() {
		this.hasCalcDirect = [];

		this.cyclesEdges = new Set(this.cycles.filter(item => item.edgeTrace.length > 1).reduce((res, item) => {
			return [...res, ...item.edgeTrace.reduce((res, edge) => {
				return [...res, edge]
			}, [])]
		}, []));

		this.hasCalcDirect = this.graph.edges.filter(edge => edge.label != "" || edge.v1.id == edge.v2.id).map(edge => {
			return({
				...edge,
				direct: [{
					label: edge.label,
					mark: edge.mark
				}]
			})
		});

		let emptyEdgesCalc = [];
		this.graph.edges.forEach(edge => {
			if(!this.hasCalcDirect.find(e => e.id == edge.id)) {
				emptyEdgesCalc.push({
					...edge,
					direct: this.calcDirFor(edge, edge.v1.id)
				})
			}
		})

		this.hasCalcDirect.push(...emptyEdgesCalc);

		this.graph.edges = this.hasCalcDirect;
	}

	calcDirFor = function(edge, v1Id) {
		let direct = [];
		const nextEdges = this.graph.edges.filter(e => e.v1.id == edge.v2.id && edge.v2.id != v1Id); 

		if(nextEdges.length == 0) {
			if(edge.v2.id != v1Id) {
				direct = [{
					label: edge.label,
					mark: edge.mark
				}]
			}
		}

		nextEdges.forEach(e => {
			let hasCacl = this.hasCalcDirect.find(edge => e.id == edge.id);

			if(!hasCacl) {
				direct.push(...this.calcDirFor(e, v1Id).map(item => {
					return({
						label: item.label,
						mark: edge.mark ? edge.mark : item.mark
					})
				}));
			} else {
				direct.push(...hasCacl.direct.map(item => {
					return({
						label: item.label,
						mark: edge.mark ? edge.mark : item.mark
					})
				}))
			}
		})

		return direct;
	}

	checkDirect = function() {
		const graph = this.makeAdjacencyList();

		graph.vertices.forEach((v) => {
			const {edges} = {...v};
			for(let i = 0; i < edges.length; i++) {
				for(let j = i + 1; j < edges.length; j++) {
					const direct1 = edges[i].direct;
					const direct2 = edges[j].direct;

					for(let a = 0; a < direct1.length; a++) {
						for(let b = 0; b < direct2.length; b++) {
							if(direct1[a].label == direct2[b].label || ( 
								   direct1[a].label.startsWith(direct2[b].label) &&
								   direct2[b].label.length > 0
							   ) || (
								   direct2[b].label.startsWith(direct1[a].label) &&
								   direct1[a].label.length > 0
								)
							) {
								const m1 = !direct1[a].mark ? {type: "", id:""} : direct1[a].mark;
								const m2 = !direct2[b].mark ? {type: "", id:""} : direct2[b].mark;

								if(
								   m1.id == m2.id &&
								   m1.type == "(" ||
								   m2.type == "(" ||
								   m1.type == m2.type
								) {
									let payload = "";

									const v1 = graph.vertices.filter(v => edges[i].to == v.id)[0];
									const v2 = graph.vertices.filter(v => edges[j].to == v.id)[0];

									payload = v.name + '->' + v1.name + " & "
											+ v.name + '->' + v2.name;

									throw ({
										type: "DIRECT_ERROR",
										payload
									})
								}
							}
						}
					}
				}
			}
		})
	}

	findWayToFinish = () => {
		this.ways = [];
		this.cycles = [];

		this.simpleCycles = this.graph.edges.filter(edge => edge.v1.id == edge.v2.id);
		this.normalEdge   = this.graph.edges.filter(edge => edge.v1.id != edge.v2.id);

		this.checkedVertex = [];
		this.makeGraph = this.makeAdjacencyList();
	
		this.makeGraph.vertices.forEach(v => {
			v.edges.forEach(edge => {
				if(edge.to != v.id) {
					if(v.id == this.makeGraph.start) {
						this.ways = [...this.ways, ...this.findWayFrom(edge.to, [v.name], this.makeGraph.finish, [edge])]
					} else {
						this.findWayFrom(edge.to, [v.name], [v.id], [edge])
					}
				}
			});

			this.checkedVertex.push(v.name);
		});		

		this.simpleCycles.forEach((edge) => {
			this.cycles.push( { 
				trace: [edge.v1.text],
				edgeTrace: [edge]
			});
		})

		if(this.ways.length == 0) {
			throw ({
				type: "FINISH_ERROR",
				payload: "there is no successful path to the finish vertex"
			})
		}
	}

	// плохая функция с побочным эффектом
	findWayFrom = function(id, trace, finish, edgeTrace) {
		const v = this.makeGraph.vertices.find(v => v.id == id);

		if(this.checkedVertex.indexOf(v.name) != -1) {
			return [];
		}

		const newTrace = [...trace, v.name];

		let res = []
		if(finish.indexOf(id) != -1) {
			res.push({
				trace : newTrace,
				edgeTrace
			})
		} 

		v.edges.forEach(edge => {
			if(edge.to != v.id) {
				const v2 = this.makeGraph.vertices.find(v => v.id == edge.to);

				if(newTrace[0] == v2.name) {
					this.cycles.push({
						trace: newTrace, //  без замыкающего элемента
						edgeTrace: [...edgeTrace, edge]
					});
				} else {
					if(newTrace.indexOf(v2.name) == -1) {
						res = [...res, ...this.findWayFrom(v2.id, newTrace, finish, [...edgeTrace, edge])];
					}
				}
			}
		})
		
		return res;
	}

	makeFile() {	
		const {name, start, id, finish, vertices} = {...this.makeAdjacencyList()};

		let res = "#include \"../include/Dependencies.h\"\n\nstd::vector<LGraph> _graphs = { LGraph(\n"; 
		res += `\t"${name}", ${id}, {${start}}, {${finish.join(',')}}, { Vertex(\n`;

		for(let i = 0; i < vertices.length; i++) {
			const v = vertices[i];
			res +=`\t\t"${v.name}", ${v.id}, {\n`;
			for(let j = 0; j < v.edges.length; j++) {
				const edge = v.edges[j];

				res += `\t\t\tEdge(${edge.to}, "${edge.label}", `;
				res += this.writeMark(edge.mark) + ", {\n";
			
				res += edge.direct.map(dir => {
					return `\t\t\t\tDirect("${dir.label}", ${this.writeMark(dir.mark)})`;
				}).join(",\n");
	
				res += `\n\t\t\t`;
				res += j == v.edges.length - 1 ? `})\n` : `}),\n`
			}
			res += `\t\t`;
						
			res += i == vertices.length - 1 ? `})\n` : `}), Vertex(\n`
		}

		res += `\t})\n};`;
		return res;
	}

	writeMark(mark) {
		const m = mark ? mark : {type: "", id: ""}

		switch(m.type) {
			case "(": 
				return(`Mark(OPEN,"${m.id}")`);
			case ")":
				return(`Mark(CLOSE,"${m.id}")`)
			default:
				return(`Mark()`);
		}
	}
}
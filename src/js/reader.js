class Reader {
	constructor() {
		this.dependencies_cpp = "";
		this.tabCounter = 0;
		this.tabShift   = ""
		this.tab = '  ';
	}

	outOpen() {
		this.dependencies_cpp = "#include \"../include/Dependencies.h\"\n\n";
	}
	
	outClose() {
		this.stateNames.forEach((it, i) => {
			
			this.stateName_h += this.tab + it + ',\n';
			this.stateName_cpp += this.tab + '{' +  it + ', "' + it + ((i != this.stateNames.length - 1) ? '"},\n' : '"}\n};');
		})

		this.stateName_h += this.tab +"ERROR,\n" + this.tab +"EMPTY_STR,\n" + this.tab + "FILE_END\n};\n";
    	this.stateName_h += "\nextern std::map<STATE_NAME, std::string> mapStateName;\n";
    	this.stateName_h += "\n#endif";
    	this.dependencies_h += "\nextern std::map<STATE_NAME, Graph> graphs;\n\n#endif";
	}

	getTabs() {
		return new Array(this.tabCounter).fill(this.tab).join('');
	}

	// upperCase(str) { // ???
	// 	return str.toUpperCase();
	// }

	// getState(stateName) {
	// 	let str = stateName;
	// 	if(stateName.indexOf('_') == 0) {
	// 		str = stateName.slice(1).toUpperCase();
	// 	} else {
	// 		str = this.upperGraphNames.slice(-1) + '_' + stateName.toUpperCase();
	// 	}

	// 	if(this.stateNames.indexOf(str) == -1) {
	// 		this.stateNames.push(str);
	// 	}

	// 	return str;
	// }

	readMark(mark) {
		if(mark.type == "") {
			this.dependencies_cpp += this.getTabs() + "Mark(),\n";
			return;
		}

		const dir = mark.type == '(' ? "OPEN" : "CLOSE";
		if(mark.id != "") {
			this.dependencies_cpp += this.getTabs() + "Mark(\n";
			this.tabCounter++;
			this.dependencies_cpp += this.getTabs() + dir + ",\n";
			this.dependencies_cpp += this.getTabs() + '"' + mark.id + '"\n'; 
			this.tabCounter--;
			this.dependencies_cpp += this.getTabs() + "),\n";
		} else {
			this.dependencies_cpp += this.getTabs() + "Mark(" + dir+ "),\n";
		}
	}

	readTransition(transition) {

		const {to, label, mark}= {...transition};

		this.dependencies_cpp += this.getTabs() + this.getState(to) + ",\n";
		this.dependencies_cpp += this.getTabs() + "Transition(\n";
		this.tabCounter++;
		this.readMark(mark);
		
		this.dependencies_cpp += this.getTabs() + "{\n";
    	this.tabCounter++;

		this.dependencies_cpp += this.getTabs() + "\"" + label + "\"\n";

		this.tabCounter--;
		this.dependencies_cpp += this.getTabs() + "}\n";

		this.tabCounter--;
		this.dependencies_cpp += this.getTabs() + ")\n";
	}

	readState(state) {
		const {name, transitions} = {...state};
		const stateName = this.getState(name);
		this.dependencies_cpp += this.getTabs() + stateName + ",\n" + this.getTabs() + "State(\n";
		this.tabCounter++;

		if(transitions.length > 0) {
			this.dependencies_cpp += this.getTabs() + "{\n";
			this.tabCounter++;

			transitions.forEach((item, i) => {
				this.dependencies_cpp += this.getTabs() + "{\n";
				this.tabCounter++;
				this.readTransition(item);
				this.tabCounter--;
				this.dependencies_cpp += this.getTabs() + (i != transitions.length  -1 ? "},\n\n" : "}\n");
			})

			this.tabCounter--;
			this.dependencies_cpp += this.getTabs() + "}\n";
		}
		this.tabCounter--;
		this.dependencies_cpp += this.getTabs() + ")\n";
	}

	readGraph(graph) {
		const {name, start, end, states} = {...graph};

		if(name.indexOf('_') == 0) {
			this.graphNames.push(name);
			this.upperGraphNames.push(name.slice(1).toUpperCase());
			
			this.stateNames.push(name.slice(1).toUpperCase());
		} else {
			return ["","","",""];
		}


		this.dependencies_h += "extern Graph " + name + ";\n";
    	this.dependencies_cpp += "Graph " + name + "(\n";

		this.tabCounter++;

		this.dependencies_cpp += this.getTabs() + this.getState(start) + ",\n";

		this.dependencies_cpp += this.getTabs() + "{\n";
    	this.tabCounter++;

		end.forEach((item, i) => {
			this.dependencies_cpp += this.getTabs() + this.getState(item);
			this.dependencies_cpp += (i != end.length - 1 ? ",\n" : "\n");
		})

		this.tabCounter--;
    	this.dependencies_cpp += this.getTabs() + "},\n\n";

		this.dependencies_cpp += this.getTabs() + "{\n";
    	this.tabCounter++;

		const nonEmptyStates = states.filter(state => {
			return state.transitions.length > 0;
		})
		
		nonEmptyStates.forEach((item, i) => {

			this.dependencies_cpp += this.getTabs() + "{\n";
			this.tabCounter++;

			this.readState(item);

			this.tabCounter--;
			this.dependencies_cpp += this.getTabs() + (i != nonEmptyStates.length - 1 ? "},\n\n" : "}\n");
		
		})

		this.tabCounter--;
		this.dependencies_cpp += this.getTabs() + "}\n";
		
		this.tabCounter--;
		this.dependencies_cpp += this.getTabs() + ");\n\n";
	}

	parseJson(graph) {
		this.outOpen();

		this.readGraph(graph);

		this.dependencies_cpp += "std::map<STATE_NAME, Graph> graphs =\n";
		this.tabCounter++;

		this.dependencies_cpp  += this.getTabs() + "{\n";
		this.tabCounter++;

		this.graphNames.forEach((it,i) => {
			this.dependencies_cpp += this.getTabs() + "{\n";
			this.tabCounter++;
			this.dependencies_cpp += this.getTabs() + this.getState(it) + ",\n";
			this.dependencies_cpp += this.getTabs() + it + "\n";
			this.tabCounter--;
			this.dependencies_cpp += this.getTabs() + (i != this.graphNames.length - 1) ? "},\n\n" : "}\n";
		})

		this.tabCounter--;
		this.dependencies_cpp += this.getTabs() + "};\n\n";

		this.outClose();
	}

	makeFiles(obj) {
		let res = "#include \"../include/Dependencies.h\"\n\nstd::vector<LGraph> _graphs = { LGraph(\n"; 
		
		const {name, start, id, finish, vertices} = {...obj};

		res += `\t"${name}", ${id}, {${start}}, {${finish.join(',')}}, { Vertex(\n`;

		for(let i = 0; i < vertices.length; i++) {
			const v = vertices[i];
			res +=`\t\t"${v.name}", ${v.id}, {\n`;
			for(let j = 0; j < v.edges.length; j++) {
				const edge = v.edges[j];
				res += `\t\t\tEdge(${edge.to}, "${edge.label}", {`;
				res += edge.mark.map(m => {
						switch(m.type) {
							case "(": 
								return(`Mark(OPEN,"${m.id}")`);
							case ")":
								return(`Mark(CLOSE,"${m.id}")`)
							default:
								return(`Mark()`);
						}
					}).join(",");
				res += j == v.edges.length - 1 ? `})\n` : `}),\n`
			}
			res += `\t\t`;
			res += i == vertices.length - 1 ? `})\n` : `}), Vertex(\n`
		}

		res += `\t})\n};`;
		
		return res;
	}
}
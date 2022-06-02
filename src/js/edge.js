function EdgeStyle(
	color,
	textColor = color
) {
	this.color = color;
	this.textColor = textColor;
	this.textPadding = 10;
	this.labelFontSize = 12;
	this.markFontSize = 10;
}

let baseEdgeStyle = new EdgeStyle(textColor);

const darkEdgeStyle = new EdgeStyle(textColor, '#ffffff');
const lightEdgeStyle = new EdgeStyle('#000000', '#000000');

const selectedEdgeStyle = new EdgeStyle(darkGrayColor)

class Edge {
	constructor(
		v1, v2, 
		label = '',
		mark = undefined, 
		model = {
			type: 0,
			curvedValue: 0.1
		}
	) {
		this.v1 = v1,
		this.v2 = v2;
		this.label = label;
		this.mark = mark;
		this.id = 0;
		this.model = new EdgeModel(model);
		this.trace = []
	}

	setTrace(trace) {
		this.trace = trace;
	}

	setId(id) {
		this.id = id;
	}

	getLabel() {
		return this.label;
	}

	setLabel(label) {
		this.label = label;
	}

	getMark() {
    	return this.mark;
	}

	getEdgePositions(v1, v2) {
		let res = [];

		if (v1 == v2) {
			res.push(v1.pos);
			res.push(v2.pos);
			return res;
		}
		
		let position1 = v1.pos;
		let position2 = v2.pos;
		let diameter1 = v1.d + 4;
		let diameter2 = v2.d + 4;

		let direction = position1.subtract(position2);
		
		let direction1 = direction;
		let direction2 = direction;
		let d1        = diameter1;
		let d2        = diameter2;
		
		if (this.model.type == EdgeModels.cruvled) {
			let dist   = position1.distance(position2);
			let point1  = this.model.getCurvedPoint(position1, position2, 10.0 / dist);
			direction1  = position1.subtract(point1);   
			
			let point2  = this.model.getCurvedPoint(position1, position2, 1.0 - 10.0 / dist);
			direction2  = position2.subtract(point2);
			
			d2         = diameter2;
		} else {
			direction2 = direction2.multiply(-1);
		}

		direction1.normalize(1.0);
		direction2.normalize(1.0);

		let vertexes = [];
		vertexes.push({vertex : v1, direction : direction1, pos : position1, diameter : d1});
		vertexes.push({vertex : v2, direction : direction2, pos : position2, diameter : d2});

		vertexes.forEach(function(data) {
				let direction = data.direction.multiply(0.5);        
				res.push(data.pos.subtract(direction.multiply(data.diameter)));
			});    

		return res;
	}

	hitTest(pos) {
		let positions = this.getEdgePositions(this.v1, this.v2);
		return this.model.hitTest(positions[0], positions[1], pos);
	}

	save = () => {
		return({
			id: this.id,
			v1Id: this.v1.id,
			v2Id: this.v2.id,
			label: this.label,
			mark: this.mark,
			model : {
				type: this.model.type,
				curvedValue: this.model.curvedValue
			}
		});  
	}
}


class EdgeDrawer {
	constructor(context, model = new EdgeModel()) {
		this.context = context;
		this.model = model;
	}

	getPixelLength(v1, v2) {
		return(v1 = v2 ? this.model.getLoopSize() * 2 * Math.PI: Point.distance(v1.pos, v2.pos)
		);
	}

	draw(baseEdge, isSelected) {
		const {v1, v2,label, mark} = baseEdge;
		const style = isSelected ? selectedEdgeStyle : baseEdgeStyle;
		
		let lengthArrow = Math.max(this.model.width * 4, 8);

		let position1 = v1.pos;
  		let position2 = v2.pos;

		const isCircle = position1.equals(position2);
		let direction = position1.subtract(position2); 

		direction.normalize(1.0);

		let positions = baseEdge.getEdgePositions(v1, v2);
			
		let arcPos1 = positions[0];
		let arcPos2 = positions[1];

		this.context.fillStyle = style.color;
		this.context.strokeStyle = style.color;

		if(!isCircle) {
			let dirArrow = this.getFinishArrowDiretion(positions[0], positions[1], lengthArrow);
    		arcPos2 = arcPos2.add(dirArrow.multiply(-lengthArrow / 2));
			this.drawArrow (positions[1], dirArrow);
		}
		
		this.drawArc (arcPos1, arcPos2, style, isCircle);
		this.drawLabel(arcPos1, arcPos2, label, style, isCircle);

		if(mark) {
			this.drawMark(arcPos1, arcPos2, mark, style, isCircle);
		}
		
	}

	getFinishArrowDiretion(position1, position2, lengthArrow = 0) {
		let direction = position2.subtract(position1);
		direction.normalize(1.0);
		return direction;
	}

	drawArc(position1, position2, style, isCircle) {
		this.context.lineWidth = 2;

		if (isCircle) {
			this.context.beginPath();
				this.context.arc(	
					position1.x - Math.cos(this.model.getLoopShiftAngel()) * this.model.getLoopSize(), 			
					position1.y - Math.sin(this.model.getLoopShiftAngel()) * this.model.getLoopSize(), 
					this.model.getLoopSize(), 
					0 * Math.PI, 
					2 * Math.PI);
				this.context.stroke();
			this.context.closePath();
		} else {
			this.context.beginPath();
				this.context.moveTo(position1.x, position1.y);
				this.context.lineTo(position2.x, position2.y);
				this.context.stroke();
			this.context.closePath();
		}
	}

	drawArrow(position, direction, length = 10, width = 5) {
		let normal = direction.normal();
		
		let pointOnLine = position.subtract(direction.multiply(length));
		let point1 = pointOnLine.add(normal.multiply(width));
		let point2 = pointOnLine.add(normal.multiply(-width));
		
		this.context.beginPath();
			this.context.moveTo(position.x, position.y);
			this.context.lineTo(point1.x, point1.y);
			this.context.lineTo(point2.x, point2.y);
			this.context.lineTo(position.x, position.y);
			this.context.fill();
		this.context.closePath();
		
	}

	drawLabel(position1, position2, text, style, isCircle) {
		const {textPadding, labelFontSize, textColor} = style;
		let centerPoint = this.getTextCenterPoint(position1, position2);
		
		this.context.font         = labelFontSize + "px sans-serif";
		this.context.textBaseline = "middle";
		
		this.context.fillStyle = textColor;

		let vectorEdge   = new Point(position2.x - position1.x, position2.y - position1.y);
		let angleRadians = Math.atan2(vectorEdge.y, vectorEdge.x);

		if(isCircle) {
			vectorEdge = new Point(1,0);
		} else {
			if (angleRadians > Math.PI / 2 || angleRadians < -Math.PI / 2) {
				vectorEdge   = new Point(position1.x - position2.x, position1.y - position2.y);
				angleRadians = Math.atan2(vectorEdge.y, vectorEdge.x);          
			}
		}

		const normalize =  vectorEdge.normal().normalizeCopy(isCircle ? 0 : textPadding);

		this.context.save();
			this.context.translate(centerPoint.x - normalize.x, centerPoint.y - normalize.y);
			this.context.rotate(angleRadians);
			this.context.textAlign = "center";
			this.context.fillText(text, 0, 0);
		this.context.restore();
	}

	drawMark = function(position1, position2, mark, style, isCircle) { 
		const {textPadding, markFontSize} = style
		
		let centerPoint = this.getTextCenterPoint(position1, position2);
				
		this.context.font         = markFontSize + "px sans-serif";
		this.context.textBaseline = "middle";
				
		let vectorEdge   = new Point(position2.x - position1.x, position2.y - position1.y);
		let angleRadians = Math.atan2(vectorEdge.y, vectorEdge.x);
		

		if(isCircle) {
			vectorEdge = new Point(1,0);
		} else {
			if (angleRadians > Math.PI / 2 || angleRadians < -Math.PI / 2) {
				vectorEdge   = new Point(position1.x - position2.x, position1.y - position2.y);
				angleRadians = Math.atan2(vectorEdge.y, vectorEdge.x);          
			}
		}
		
		const normalize = vectorEdge.normal().normalizeCopy(isCircle ? -2.5 * textPadding : -textPadding);
		
		this.context.save();
			this.context.translate(centerPoint.x - normalize.x, centerPoint.y - normalize.y);
			this.context.rotate(angleRadians);
			this.context.textAlign = "center";

			let shift = 0;
			const {type, id} = {...mark};
			
			this.context.fillText(type, shift, 0);

			shift += this.context.measureText(type).width + 5;

			this.font = markFontSize - 4 + "px sans-serif"
			this.context.fillText(id, shift, 4);

		this.context.restore();
	}

	getTextCenterPoint(position1, position2) {
		let centerPoint = Point.interpolate(position1, position2, 0.5);

		if (position1.equals(position2)) {
			centerPoint.y = centerPoint.y - Math.cos(this.model.getLoopShiftAngel()) * this.model.getLoopSize() * 2;
			centerPoint.x = centerPoint.x - Math.sin(this.model.getLoopShiftAngel()) * this.model.getLoopSize() * 2;
		} 
		
		return centerPoint;
	}
}


class CurvedArcDrawer extends EdgeDrawer {
	constructor(context, model) {
		super(context, model);
	}

	drawArc(position1, position2) {
		
		this.context.lineWidth = 2;

		if (position1.equals(position2)) {
			this.context.beginPath();
				this.context.arc(position1.x - Math.cos(this.model.getLoopShiftAngel()) * this.model.getLoopSize(), 
								position1.y - Math.sin(this.model.getLoopShiftAngel()) * this.model.getLoopSize(), this.model.getLoopSize(), 0, 2 * Math.PI);
				this.context.stroke();
			this.context.closePath();
			
		} else {
			let points = this.model.getBezierPoints(position1, position2);
			let firstBezierPoint  = points[0];  
			let secondBezierPoint = points[1];
			
			this.context.beginPath();
				this.context.moveTo(position1.x, position1.y);
				this.context.bezierCurveTo(firstBezierPoint.x, firstBezierPoint.y, secondBezierPoint.x, secondBezierPoint.y, position2.x, position2.y);
				this.context.stroke(); 
			this.context.closePath();
		}
	}

	getFinishArrowDiretion = function(position1, position2, lengthArrow) {
			let dist      = position1.distance(position2);
			let direction = position2.subtract(this.model.getCurvedPoint(position1, position2, 1.0 - lengthArrow / dist));
			direction.normalize(1.0);
    	return direction;
	}

	getTextCenterPoint = function (position1, position2) {
		let centerPoint = this.model.getCurvedPoint(position1, position2, 0.5)
		if (position1.equals(position2)) {
			centerPoint.y = centerPoint.y - Math.cos(this.model.getLoopShiftAngel()) * this.model.getLoopSize() * 2;
			centerPoint.x = centerPoint.x - Math.sin(this.model.getLoopShiftAngel()) * this.model.getLoopSize() * 2;
		} 
			
		return centerPoint;
	}

	getPointOnArc = function (position1, position2, procent){   
		return this.model.getCurvedPoint(position1, position2, procent);
	}
}


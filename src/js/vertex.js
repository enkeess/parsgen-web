const vertexDiameter = 30;

function VertexStyle(
		strokeStyle,
		fillStyle,
		color
) {
	this.lineWidth    = 2;
	this.font         = 12;
	this.strokeStyle  = strokeStyle;
	this.fillStyle    = fillStyle;
	this.color        = color;
}

const baseVertexStyle     = new VertexStyle(textColor, firstColor, whiteColor);
const selectedVertexStyle = new VertexStyle(textColor, firstColorActive, whiteColor);
const startVertexStyle    = new VertexStyle(textColor, 'green' , whiteColor);
const finishVertexStyle   = new VertexStyle(textColor, 'red' , whiteColor); 

class Vertex {
	constructor(
		pos, 
		id = 0, 
		text = 'text', 
		type = 'default'
	) {
		this.pos = pos;
		this.id = id;
		this.type = type;
		this.text = text;
		this.d = 30;
	}

	setId(id) {
		this.id = id;
	}

	getId() {
		return this.id;
	}

	hitTest(pos) {
		return this.pos.distance(pos) < this.d / 2.0;
	}

	setType(type) {
		this.type = type;
	}

	getType() {
		return this.type
	}

	getStyle() {
		switch(this.type) {
			case "start": 
				return startVertexStyle;
			case "finish":
				return finishVertexStyle;
			default: 
				return baseVertexStyle;
		}
	}

	save = () => {
		return({
			pos: { ...this.pos},
			id: this.id,
			text: this.text,
			type: this.type,
		})
	}

	load = (data) => {
		const {pos, id, text, type} = {...data};
		return new Vertex(pos, id, text, type);
	}
}


class VertexDrawer {
	constructor(context) {
		this.context = context; 
	}

	draw(vertex, isSelected) {	
		const style = vertex.getStyle();
		this.drawShape(vertex, isSelected, style);
		this.drawText(vertex, isSelected, style);
	}

	drawShape(vertex, isSelected, style) {
		const {
			pos, 
			d
		} = vertex;

		const {
			x,
			y
		} = pos;

		const {
			fillStyle, 
			lineWidth, 
			strokeStyle
		} = isSelected ? selectedVertexStyle : style;
		
		this.context.beginPath();
			this.context.fillStyle = fillStyle;
			this.context.strokeStyle = strokeStyle;
			this.context.lineWidth = lineWidth;
			this.context.arc(x, y, d / 2.0, 0, 2 * Math.PI);
			this.context.stroke();
			this.context.fill();
		this.context.closePath();	
	}

	drawText(vertex, isSelected, style) {
		const {pos, text} = vertex;
		const {color, font} = isSelected ? selectedVertexStyle : style;
		
		this.context.fillStyle = color;
		this.context.font = "bold " +  font + "px sans-serif";
		this.context.textBaseline="middle";

		const textWidth  = this.context.measureText(text).width;
		const {x,y} = new Point(pos.x - textWidth / 2, pos.y);
		
		this.context.fillText(text, x, y);
	}
}
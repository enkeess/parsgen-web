// New Edge Model

function Mark(type = "", id = "") {
	this.type = type;
	this.id = id;
}

const EdgeModels = {"line": 0, "cruvled" : 1};

class EdgeModel {
	constructor(model = {type: 0, curvedValue: 0.1}) {
		this.width = 4;
		this.type  = model.type;
		this.curvedValue = model.curvedValue;
		this.default = true;
		this.sizeOfLoop = 40;
		this.loopShiftAngel = Math.PI / 6;
		this.defaultCruved = 0.1;
	}

	getCurvedPoint = function(position1, position2, t) {
		let points = this.getBezierPoints(position1, position2);
		let firstBezierPoint  = points[0];  
		let secondBezierPoint = points[1];
		
		let B0_t = Math.pow(1-t, 3);
		let B1_t = 3 * t * Math.pow(1-t, 2);
		let B2_t = 3 * t*t * (1-t)
		let B3_t = t*t*t;
		
		let ax = position1.x;
		let ay = position1.y;
		let dx = position2.x;
		let dy = position2.y;
		let bx = firstBezierPoint.x;
		let by = firstBezierPoint.y;
		let cx = secondBezierPoint.x;
		let cy = secondBezierPoint.y;
		
		let px_t = (B0_t * ax) + (B1_t * bx) + (B2_t * cx) + (B3_t * dx);
		let py_t = (B0_t * ay) + (B1_t * by) + (B2_t * cy) + (B3_t * dy);
		
		return new Point(px_t, py_t);
	}

	getBezierPoints(position1, position2) {
		let direction = position2.subtract(position1); 
		let delta     = direction.length();
		direction.normalize(1.0);  
		let normal = direction.normal();
		
		let deltaOffsetPixels = delta * this.curvedValue;
		let yOffset = normal.multiply(deltaOffsetPixels);
		let firstBezierPointShift  = (direction.multiply(delta * 0.2)).add(yOffset); 
		let secondBezierPointShift = (direction.multiply(-delta * 0.2)).add(yOffset); 
		let firstBezierPoint  = position1.add(firstBezierPointShift);  
		let secondBezierPoint = position2.add(secondBezierPointShift);
		
		return [firstBezierPoint, secondBezierPoint];
	}

	hitTest(position1, position2, mousePos) {
		if (this.type == EdgeModels.line)
			return this.hitTestLine(position1, position2, mousePos);
		else if (this.type == EdgeModels.cruvled)
			return this.hitTestCurved(position1, position2, mousePos);
		return false;
	}

	hitTestLine(position1, position2, mousePos, factor) {
		if (factor === undefined) {
			factor = 1.0;
		}
		
		let pos1 = position1;
		let pos2 = position2;
		let pos0 = mousePos;
		
		// Self loop case
		if (pos1.equals(pos2)) {
			let xCenter = pos1.x - Math.cos(this.getLoopShiftAngel()) * this.getLoopSize(); 
			let yCenter = pos1.y - Math.sin(this.getLoopShiftAngel()) * this.getLoopSize();
			
			return Math.abs((Point.distance(new Point(xCenter, yCenter), pos0)) - this.getLoopSize()) <= this.width * 1.5 * factor;
		}
			
		let r1  = pos0.distance(pos1);
		let r2  = pos0.distance(pos2);
		let r12 = pos1.distance(pos2);
			
		if(!(r1 >= (new Point(r2, r12)).length() || r2 >= (new Point(r1,r12)).length())) { 
			let distance = ((pos1.y - pos2.y) * pos0.x + (pos2.x - pos1.x) * pos0.y + (pos1.x * pos2.y - pos2.x * pos1.y)) / r12;

			if (Math.abs(distance) <= this.width * 1.5 * factor) {
				return true;
			}
		}
		
		return false;
	}


	hitTestCurved(position1, position2, mousePos) {
		let pos1 = position1;
		let pos2 = position2;
		let pos0 = mousePos;
		
		// Self loop case
		if (pos1.equals(pos2)) {
			let xCenter = pos1.x - Math.cos(this.getLoopShiftAngel()) * this.getLoopSize(); 
			let yCenter = pos1.y - Math.sin(this.getLoopShiftAngel()) * this.getLoopSize();
			
			return Math.abs((Point.distance(new Point(xCenter, yCenter), pos0)) - this.getLoopSize()) <= this.width * 1.5;
		}
		
		let interval_count = position1.distance(position2) / 100 * 30;
		
		let start = position1;
		for (let i = 0; i < interval_count; i ++) {
			let finish = this.getCurvedPoint(position1, position2, i / interval_count);
			
			if (this.hitTestLine(start, finish, mousePos, 2.0))
				return true;
			
			start = finish;
		}
		
		return false;
	}	


	changeCurvedValue = function (delta) {
		if (this.type == EdgeModels.line) {
			this.type = EdgeModels.cruvled;
			this.curvedValue = 0.0;
		}

		this.curvedValue = this.curvedValue + delta;
		
		if (Math.abs(this.curvedValue) <= 0.01)
			this.type = EdgeModels.line;
		
		this.default = false;
	}

	setCurvedValue(value) {
		if (this.type == EdgeModels.line) {
			this.type = EdgeModels.cruvled;
			this.curvedValue = 0.0;
		}

		this.curvedValue = value;
		
		if (Math.abs(this.curvedValue) <= 0.01)
			this.type = EdgeModels.line;
		
		this.default = false;
	}

	getLoopSize = function () {
		return this.sizeOfLoop;
	}
	
	getLoopShiftAngel = function () {
    	return this.loopShiftAngel;
	}

}



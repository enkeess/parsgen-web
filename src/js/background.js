/**
 * Graph drawer.
 */
 
function BackgroundStyle(color, opacity = 1.0) {
	this.commonColor   = color;
	this.commonOpacity = opacity;
}

const baseBackgroundStyle = new BackgroundStyle(inputColorLigth);
const darkBackgroundStyle = new BackgroundStyle(inputColorDark);

const lightBackgroundStyle = new BackgroundStyle(inputColorLigth);



class BackgroundDrawer {
	constructor(context) {
		this.context = context;
		this.style = baseBackgroundStyle;
	}

	setStyle(style) {
		this.style = style;
	}

	draw(width, height, position, scale) {
		let context = this.context;
		let style =  this.style;
		let rect = new Rect(position, position.add(new Point(width / scale, height / scale)));
		
		context.clearRect(-rect.minPoint.x, -rect.minPoint.y, rect.size().x + 1, rect.size().y + 1);
		
		if (style.commonOpacity > 0.0) {
			context.globalAlpha = style.commonOpacity;
			context.fillStyle   = style.commonColor;
			context.fillRect(-rect.minPoint.x, -rect.minPoint.y, rect.size().x + 1, rect.size().y + 1);
			context.globalAlpha = 1.0;
		}
	}
}
/**
 * Rectangle primitive
 * @constructor
 * @param {CGFscene} scene - Reference to the scene object
 * @param {Number} x1 - x coordinate corner 1
 * @param {Number} y1 - y coordinate corner 1
 * @param {Number} x2 - x coordinate corner 2
 * @param {Number} y2 - y coordinate corner 2
 */
class MyRectangle extends CGFobject {
	constructor(scene, x1, y1, x2, y2) {
		super(scene);

		this.x1 = x1;
		this.x2 = x2;
		this.y1 = y1;
		this.y2 = y2;

		this.initBuffers();
	}

	/**
     * @method initBuffers
     * Initializes the rectangle buffers
     */
	initBuffers() {
		this.vertices = [
			this.x1, this.y1, 0,	//0
			this.x2, this.y1, 0,	//1
			this.x1, this.y2, 0,	//2
			this.x2, this.y2, 0		//3
		];

		//Counter-clockwise reference of vertices
		this.indices = [
			0, 1, 2,
			1, 3, 2
		];

		//Facing Z positive
		this.normals = [
			0, 0, 1,
			0, 0, 1,
			0, 0, 1,
			0, 0, 1
		];

		this.texCoords = [
			0, 1,
			1, 1,
			0, 0,
			1, 0
		]

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}

	/**
	 * @method updateTexCoords
	 * Updates the list of texture coordinates of the rectangle
	 * @param {Array} coords - Array of texture coordinates
	 */
	updateTexCoords(coords) {
		const dX = this.x2 - this.x1;
		const dY = this.y2 - this.y1;
		if (coords == undefined || typeof coords.afs != 'number' || typeof coords.aft != 'number') {
			console.warn("RECEIVED INVALID AFS & AFT");
			return;
        }

		this.texCoords = [
			0, dY/coords.aft,
			dX/coords.afs, dY/coords.aft,
			0, 0,
			dX/coords.afs, 0
		]
		this.updateTexCoordsGLBuffers();
	}
}

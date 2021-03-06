class MyButton extends CGFobject {
    constructor(scene, action, gridPosition, text, init = false, name = null, texture = null, selectionTexture = null, selected = false) {
        super(scene);

        this.action = action;
        this.gridPosition = gridPosition;
        this.text = text ? new MySpriteText(scene, text) : null;
        this.depth = 1;
        this.width = gridPosition.col.end - gridPosition.col.start;
        this.height = gridPosition.row.end - gridPosition.row.start;
        this.name = name;

        this.texture = texture;
        this.selectionTexture = selectionTexture;
        this.activeTexture = selected ? selectionTexture : texture;

        this.selected = selected;

        this.initComplete = false;
        if (init) this.init();
    }
    
    init(gridGap) {
        if (gridGap) {
            this.width += (this.width - 1) * gridGap;
            this.height += (this.height - 1) * gridGap;
        }

        this.front = new MyRectangle(this.scene, 0, 0, this.width, this.height);
        this.top = new MyRectangle(this.scene, 0, this.depth, this.width, 0);
        this.bottom = new MyRectangle(this.scene, 0, 0, this.width, this.depth);
        this.left = new MyRectangle(this.scene, 0, this.height, this.depth, 0);
        this.right = new MyRectangle(this.scene, 0, 0, this.depth, this.height);
        this.faces = [this.front, this.top, this.bottom, this.left, this.right];

        this.initComplete = true;
    }

    display() {
        if (!this.initComplete) throw new Error("Trying to display button without it being initiated.");

        this.scene.pushMatrix();

        this.scene.translate(0, this.depth, this.height);
        this.scene.rotate(-90*DEGREE_TO_RAD, 1, 0, 0);

        this.scene.pushTexture();
        if (this.texture !== null && this.texture !== "null" && this.texture !== "clear") {
            this.scene.setTexture(this.activeTexture);
        }

        this.displayText();
        this.front.display();
        this.displayTopBottomFaces();
        this.displayLeftRightFaces();

        this.scene.popTexture();

        this.scene.popMatrix();
    }

    displayText() {
        const scaleAmount = Math.min(0.8 , this.width / this.text.getWidth(), this.height / this.text.getHeight());

        this.scene.pushMatrix();
        this.scene.translate(this.width / 2, this.height / 2, 0.05);
        this.scene.scale(scaleAmount, scaleAmount, 1);
        this.text.display();
        this.scene.popMatrix();
    }

    displayTopBottomFaces() {
        this.scene.pushMatrix();
        this.scene.rotate(-Math.PI/2, 1, 0, 0);
        this.top.display();

        this.scene.translate(0, 0, this.height);
        this.bottom.display();
        this.scene.popMatrix();
    }

    displayLeftRightFaces() {
        this.scene.pushMatrix();
        this.scene.rotate(Math.PI/2, 0, 1, 0);
        this.left.display();

        this.scene.translate(0, 0, this.width);
        this.right.display();
        this.scene.popMatrix();
    }

    select() {
        this.selected = true;
        this.activeTexture = this.selectionTexture;
    }

    unselect() {
        this.selected = false;
        this.activeTexture = this.texture;
    }
}
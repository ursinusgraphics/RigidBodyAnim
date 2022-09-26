function animate() {
    // Keep track of elapsed time
    let time = (new Date()).getTime();
    let dt = (lastTime - time)/1000;
    lastTime = time;
    angle += dt;

    const scene = canvas.scene;
    for (let i = 0; i < scene.children.length; i++) {
        if ("name" in scene.children[i] && scene.children[i].name == "homer") {
            let c = scene.children[i];
        }
    }
    requestAnimFrame(canvas.repaint.bind(canvas));
    requestAnimFrame(animate);
}


let lastTime = (new Date()).getTime();
let angle = 0; // Angle of rotation
let glcanvas = document.getElementById("GLCanvas1");
glcanvas.addEventListener("contextmenu", function(e){ e.stopPropagation(); e.preventDefault(); return false; }); //Need this to disable the menu that pops up on right clicking
let canvas = new SceneCanvas(glcanvas, "ggslac/shaders/", "ggslac/meshes/", true, true, true);
// Load the sample scene as a default
$.get("homer-scene.json", function(scene) {
    canvas.setupScene(scene, glcanvas.clientWidth, glcanvas.clientHeight);
    canvas.drawEdges = false;
    canvas.updateMeshDrawings();
    requestAnimFrame(canvas.repaint.bind(canvas));
    requestAnimFrame(animate);
});
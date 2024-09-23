// Indices in the rotational node of the different components
var vec3 = glMatrix.vec3;


class RotAnimation {
    constructor() {
        this.MAIN_AXIS_IDX = 0;
        this.XROT_AXIS_IDX = 0;
        this.YROT_AXIS_IDX = 0;
        this.PLANE_ROT_AXIS_IDX = 0;
        this.CIRCLE_IDX = 0;
        
        this.lastTime = (new Date()).getTime();
        this.angle = 0; // Angle of rotation
        this.rotspeed = 0.1; // Number of rotations per second
        this.axisvec = vec3.normalize(vec3.create(), [1, 1, 1]); // Axis of rotation
        this.v = vec3.fromValues(2, 2, 5); // Vector that's rotating (center of my head will go here)
        this.initializeCanvas();
        this.animating = true;
    }

    toggleAnimation() {
        this.animating = !this.animating;
    }

    setupMenus() {
        const that = this;
        this.gui = this.canvas.gui;
        this.gui.add(this, "rotspeed", 0, 1.0);
        this.gui.add(this, "angle", 0, 360).listen();
        this.vector = vecToStr(this.v);
        this.gui.add(this, 'vector').listen().onChange(
            function(value) {
                let xyz = splitVecStr(value);
                for (let k = 0; k < 3; k++) {
                    that.v[k] = xyz[k];
                }
            }
        );
        this.axis = vecToStr(this.axisvec);
        this.gui.add(this, 'axis').listen().onChange(
            function(value) {
                let xyz = splitVecStr(value);
                for (let k = 0; k < 3; k++) {
                    that.axisvec[k] = xyz[k];
                }
                vec3.normalize(that.axisvec, that.axisvec);
                that.axis = vecToStr(that.axisvec);
            }
        );
        this.gui.add(this, "toggleAnimation");
    }

    initializeCanvas() {
        let glcanvas = document.getElementById("GLCanvas1");
        glcanvas.addEventListener("contextmenu", function(e){ e.stopPropagation(); e.preventDefault(); return false; }); //Need this to disable the menu that pops up on right clicking
        this.canvas = new SceneCanvas(glcanvas, "ggslac/shaders/", "ggslac/meshes/", true, true, true);
        const that = this;
        // Load the sample scene as a default
        $.get("rotate-scene.json", function(scene) {
            // Step 2: Add geometric elements depicting the rotation
            for (let i = 0; i < scene.children.length; i++) {
                if (scene.children[i].name == "axis") {
                    // Step 2a: Add axes of rotation
                    let idx = 0;
                    that.MAIN_AXIS_IDX = idx;
                    
                    scene.children[i].children = [{
                        "shapes":[
                            {
                                "type":"cylinder",
                                "material":"grayambient",
                                "radius":0.02,
                                "center":[0, 0, 0],
                                "height":1
                            }
                        ]
                    }
                    ];
                    idx++;
        
                    // Step 2b: Add x and y rotation axes
                    scene.children[i].children.push(
                        {
                            "children":[
                                {
                                    "transform":[
                                        0, -1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1
                                    ],
                                    "shapes":[
                                        {
                                            "type":"cylinder",
                                            "material":"orangeambient",
                                            "radius":0.02,
                                            "center":[0, -0.5, 0],
                                            "height":1
                                        }
                                    ]
                                }
                            ]
                        });
                    that.XROT_AXIS_IDX = idx;
                    idx++;
                    
                    // Add planar rotation axis
                    scene.children[i].children.push(
                        {
                            "children":[
                                {
                                    "transform":[
                                        1, 0, 0, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, 0, 0, 1
                                    ],
                                    "shapes":[
                                        {
                                            "type":"cylinder",
                                            "material":"purpleambient",
                                            "radius":0.02,
                                            "center":[0, -0.5, 0],
                                            "height":1
                                        }
                                    ]
                                }
                            ]
                        });
                    that.YROT_AXIS_IDX = idx;
                    idx++;
        
                    // Step 2c: Add planar rotation vector
                    scene.children[i].children.push(
                        {
                            "children":[
                                {
                                    "transform":[
                                        0, -1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1
                                    ],
                                    "shapes":[
                                        {
                                            "type":"cylinder",
                                            "material":"cyanambient",
                                            "radius":0.02,
                                            "center":[0, -0.5, 0],
                                            "height":1
                                        }
                                    ]
                                }
                            ]
                        });
                    that.PLANE_ROT_AXIS_IDX = idx;
                    idx++;

                    // Step 2d: Add circle
                    let child = {};
                    child.name = "circlerot";
                    child.children = [];
                    let nSegments = 50;
                    for (let k = 0; k < nSegments+1; k++) {
                        let theta = 2*Math.PI*k/(nSegments+0.5);
                        let c = Math.cos(theta);
                        let s = Math.sin(theta);
                        child.children.push(
                            {
                                "transform":[
                                    c, -s, 0, c,
                                    0, 0, -1, 0, 
                                    s, c, 0, s,
                                    0, 0, 0, 1
                                ],
                                "shapes":[
                                    {
                                        "type":"cylinder",
                                        "material":"grayambient",
                                        "radius":0.01,
                                        "center":[0, 0, 0],
                                        "height":2*Math.PI/nSegments
                                    }
                                ]
        
                            }
                        );
                    }
                    that.CIRCLE_IDX = idx;
                    idx++
                    scene.children[i].children.push(child);
                }
            }
        
            that.canvas.setupScene(scene, glcanvas.clientWidth, glcanvas.clientHeight);
            that.canvas.repaintOnInteract = false;
            that.canvas.drawEdges = false;
            that.canvas.updateMeshDrawings();
            that.setupMenus();
            //requestAnimFrame(that.canvas.repaint.bind(that.canvas));
            requestAnimFrame(that.repaint.bind(that));
        });
    }

    repaint() {
        // Keep track of elapsed time
        let time = (new Date()).getTime();
        let dt = (time - this.lastTime)/1000;
        this.lastTime = time;
        if (this.animating) {
            this.angle = (this.angle + 360*dt*this.rotspeed) % 360;
        }

        const scene = this.canvas.scene;
        let cvec = projPerp(this.v, this.axisvec);
        let svec = vec3.cross(vec3.create(), this.axisvec, cvec);
        let radius = vec3.length(cvec);
        let projy = vec3.dot(this.v, this.axisvec);

        let vrot = rotateAxisAngle(this.v, this.axisvec, this.angle*Math.PI/180);

        for (let i = 0; i < scene.children.length; i++) {
            if (scene.children[i].name == "v") {
                let y = this.v;
                let x = [Math.random(), Math.random(), Math.random()];
                x = projPerp(x, y);
                vec3.normalize(x, x);
                let z = vec3.cross(vec3.create(), x, y);
                vec3.normalize(z, z);
    
                let t = scene.children[i].transform;
                //x: [0, 1, 2]
                t[0] = x[0];
                t[1] = x[1];
                t[2] = x[2];
                //y: [4, 5, 6]
                t[4] = y[0];
                t[5] = y[1];
                t[6] = y[2];
                //z: [8, 9, 10]
                t[8] = z[0];
                t[9] = z[1];
                t[10] = z[2];
            }
            else if (scene.children[i].name == "vrot") {
                let y = vrot;
                let x = [Math.random(), Math.random(), Math.random()];
                x = projPerp(x, y);
                vec3.normalize(x, x);
                let z = vec3.cross(vec3.create(), x, y);
                vec3.normalize(z, z);
    
                let t = scene.children[i].transform;
                //x: [0, 1, 2]
                t[0] = x[0];
                t[1] = x[1];
                t[2] = x[2];
                //y: [4, 5, 6]
                t[4] = y[0];
                t[5] = y[1];
                t[6] = y[2];
                //z: [8, 9, 10]
                t[8] = z[0];
                t[9] = z[1];
                t[10] = z[2];
            }
            else if (scene.children[i].name == "axis") {
                // Step 1: Place main axis
                let t = scene.children[i].children[this.MAIN_AXIS_IDX].transform;
                t[5] = Math.abs(projy);
                t[13] = projy/2;
    
                // Step 2: Place x rotation axis
                t = scene.children[i].children[this.XROT_AXIS_IDX].transform;
                t[0] = radius;
                t[13] = projy;
    
                // Step 3: Place y rotation axis
                t = scene.children[i].children[this.YROT_AXIS_IDX].transform;
                t[10] = radius;
                t[13] = projy;

                // Step 4: Place planar rotating axis
                t = scene.children[i].children[this.PLANE_ROT_AXIS_IDX].transform;
                let c = Math.cos(this.angle*Math.PI/180);
                let s = Math.sin(this.angle*Math.PI/180);
                t[0] = radius*c;
                t[1] = 0;
                t[2] = radius*s;
                t[4] = 0;
                t[5] = 1;
                t[6] = 0;
                t[8] = -s
                t[9] = 0;
                t[10] = c;
                t[13] = projy;

                // Place rotation circle
                t = scene.children[i].children[this.CIRCLE_IDX].transform;
                t[0] = radius;
                t[5] = radius;
                t[10] = radius;
                t[13] = projy;
                
                let y = this.axisvec;
                let x = vec3.normalize(vec3.create(), cvec);
                let z = vec3.normalize(vec3.create(), svec);
    
                t = scene.children[i].transform;
                //x: [0, 1, 2]
                t[0] = x[0];
                t[1] = x[1];
                t[2] = x[2];
                //y: [4, 5, 6]
                t[4] = y[0];
                t[5] = y[1];
                t[6] = y[2];
                //z: [8, 9, 10]
                t[8] = z[0];
                t[9] = z[1];
                t[10] = z[2];
            }
            else if (scene.children[i].name == "rotroot") {
                // Move object to be centered on rotated vector
                let t = scene.children[i].transform;
                t[12] = vrot[0];
                t[13] = vrot[1];
                t[14] = vrot[2];
            }
        }
        requestAnimFrame(this.canvas.repaint.bind(this.canvas));
        requestAnimFrame(this.repaint.bind(this));
    }

}


let r = new RotAnimation();
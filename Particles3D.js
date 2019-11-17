/**
 * Build a class on top of the scene canvas that animates
 * sphere objects by changing their transformation matrix
 */
function Particles() {
    this.scene = {"children":[],
                "cameras":[
                {
                    "pos": [0.00, 1.50, 5.00],
                    "rot": [0.00, 0.00, 0.00, 1.00],
                    "fovy": 1.0
                }],
                "lights":[
                    {
                        "pos":[0, 20, 0],
                        "color":[1, 1, 1]
                    }
                ]            
                };
    this.floory = 0.0;
    this.floorextent = 1000;
    this.scene.children.push({"shapes":[{
        "type":"polygon",
        "vertices":[[-this.floorextent, this.floory, -this.floorextent],
                    [-this.floorextent, this.floory, this.floorextent],
                    [this.floorextent, this.floory, this.floorextent],
                    [this.floorextent, this.floory, -this.floorextent]]

    }]});
    this.spheres = [];

    this.randomlyInitSpheres = function(N) {
        for (let i = 0; i < N; i++) {
            pos = [Math.random()*10-5, Math.random()*10, Math.random()*10-5];
            let sphere = {
                "transform":[1, 0, 0, pos[0],
                             0, 1, 0, pos[1], 
                             0, 0, 1, pos[2],
                             0, 0, 0, 1],
                "pos":pos,
                "velocity":[Math.random()*0.1, Math.random()*0.1, Math.random()*0.1],
                "shapes":[
                    {"type":"sphere",
                    "radius":Math.random()*0.5}
                ]
            }
            this.scene.children.push(sphere);
            this.spheres.push(sphere);
        }
    }

    this.animate = function() {
        let spheres = this.spheres;
        for (let i = 0; i < spheres.length; i++) {
            for (let k = 0; k < 3; k++) {
                spheres[i].pos[k] += 0.1*spheres[i].velocity[k];
                spheres[i].transform[12+k] = spheres[i].pos[k];
            }
            // TODO: Add acceleration and collision effects
        }
    }
}

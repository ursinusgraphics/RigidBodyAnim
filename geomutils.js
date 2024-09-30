var vec3 = glMatrix.vec3;

/**
 * Project a vector u onto a vector v
 * @param {vec3} u 
 * @param {vec3} v 
 * @returns vec3
 */
function proj(u, v) {
    let scale = vec3.dot(u, v)/vec3.dot(v, v);
    return vec3.scale(vec3.create(), v, scale);
}

/**
 * Do the perpendicular projection of a vector u onto
 * a vector v
 * @param {vec3} u 
 * @param {vec3} v 
 * @returns vec3
 */
function projPerp(u, v) {
    let p = proj(u, v);
    return vec3.subtract(vec3.create(), u, p);
}

function quatMul(a, b) {
    let aw = a[0], ax = a[1], ay = a[2], az = a[3];  
    let bw = b[0], bx = b[1], by = b[2], bz = b[3];
    let res = [0, 0, 0, 0];
    res[0] = aw*bw - ax*bx - ay*by - az*bz;
    res[1] = ax*bw + aw*bx + ay*bz - az*by;
    res[2] = ay*bw + aw*by + az*bx - ax*bz;
    res[3] = az*bw + aw*bz + ax*by - ay*bx;
    return res;
}

/**
 * Rotate a vector around an axis by a particular angle
 * 
 * @param {vec3} v Vector to rotate
 * @param {vec3} axis Axis around which to rotate
 * @param {float} angle Angle, in radians, to rotate
 * @returns vec3: Result of the rotation
 */
function rotateAxisAngle(v, axis, angle) {
    let p = [0, v[0], v[1], v[2]];

    // Step 1: Setup r_{theta/2, axis}
    let s = Math.sin(angle/2)
    let r = [Math.cos(angle/2),s*(axis[0]),s*(axis[1]),s*(axis[2])];

    let rneg = [r[0], -r[1], -r[2], -r[3]];

    let res = quatMul(r, p);
    res = quatMul(res, rneg);

    return vec3.fromValues(res[1], res[2], res[3]);

}
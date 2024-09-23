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

/**
 * Rotate a vector around an axis by a particular angle
 * 
 * @param {vec3} v Vector to rotate
 * @param {vec3} axis Axis around which to rotate
 * @param {float} angle Angle, in radians, to rotate
 * @returns vec3: Result of the rotation
 */
function rotateAxisAngle(v, axis, angle) {
    // TODO: Fill this in
    return v;
}
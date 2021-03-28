"use strict";

/**
 * IMPORTANT CONSTANTS
**/

const toRadians = Math.PI / 180;
const EPSILON = 0.000001;

/**
 * Represents a 3D vector.
 */
class Vector3F {

    /**
     * Creates a new vector.
     * @param {number} x The x component.
     * @param {number} y The y component.
     * @param {number} z The z component.
     */
    constructor(x = 0, y = 0, z = 0) {
        this.v3 = new Float32Array([x, y, z]);
    }

    /**
     * Sets this vector to 0.
     * @returns {Vector3F} This vector.
     */
    setOrigin() {
        this.v3[0] = 0;
        this.v3[1] = 0;
        this.v3[2] = 0;
        return this;
    }

    /**
     * Adds components to this vector.
     * @param {number} x The x component.
     * @param {number} y The y component.
     * @param {number} z The z component.
     * @returns {Vector3F} This vector.
     */
    addThis(x, y, z) {
        this.v3[0] += x;
        this.v3[1] += y;
        this.v3[2] += z;
        return this;
    }

    /**
     * Subtracts components to this vector.
     * @param {number} x The x component.
     * @param {number} y The y component.
     * @param {number} z The z component.
     * @returns {Vector3F} This vector.
     */
    subThis(x, y, z) {
        this.v3[0] -= x;
        this.v3[1] -= y;
        this.v3[2] -= z;
        return this;
    }

    /**
     * Multiplies components to this vector.
     * @param {number} x The x component.
     * @param {number} y The y component.
     * @param {number} z The z component.
     * @returns {Vector3F} This vector.
     */
    mulThis(x, y, z) {
        this.v3[0] *= x;
        this.v3[1] *= y;
        this.v3[2] *= z;
        return this;
    }

    /**
     * Divides components to this vector.
     * @param {number} x The x component.
     * @param {number} y The y component.
     * @param {number} z The z component.
     * @returns {Vector3F} This vector.
     */
    divThis(x, y, z) {
        this.v3[0] /= x;
        this.v3[1] /= y;
        this.v3[2] /= z;
        return this;
    }

    /**
     * Calculates this + vec.
     * @param {Vector3F} vec The other vector.
     * @param {boolean} createNew Whether the result should be in other vector or
     * in this vector.
     * @returns {Vector3F} The result.
     */
    add(vec, createNew = true) {
        if (createNew) {
            let r = new Vector3F();
            r.v3[0] = this.v3[0] + vec.v3[0];
            r.v3[1] = this.v3[1] + vec.v3[1];
            r.v3[2] = this.v3[2] + vec.v3[2];
            return r;
        }
        return this.addThis(vec.v3[0], vec.v3[1], vec.v3[2]);
    }

    /**
     * Calculates this + vec * scale.
     * @param {Vector3F} vec The other vector.
     * @param {number} scale The scale.
     * @param {boolean} createNew Whether the result should be in other vector or
     * in this vector.
     * @returns {Vector3F} The result.
     */
    addScale(vec, scale, createNew = true) {
        if (createNew) {
            let r = new Vector3F();
            r.v3[0] = this.v3[0] + vec.v3[0] * scale;
            r.v3[1] = this.v3[1] + vec.v3[1] * scale;
            r.v3[2] = this.v3[2] + vec.v3[2] * scale;
            return r;
        }
        return this.addThis(vec.v3[0] * scale, vec.v3[1] * scale, vec.v3[2] * scale);
    }

    /**
     * Calculates this - vec.
     * @param {Vector3F} vec The other vector.
     * @param {boolean} createNew Whether the result should be in other vector or
     * in this vector.
     * @returns {Vector3F} The result.
     */
    subtract(vec, createNew = true) {
        if (createNew) {
            let r = new Vector3F();
            r.v3[0] = this.v3[0] - vec.v3[0];
            r.v3[1] = this.v3[1] - vec.v3[1];
            r.v3[2] = this.v3[2] - vec.v3[2];
            return r;
        }
        return this.subThis(vec.v3[0], vec.v3[1], vec.v3[2]);
    }

    /**
     * Calculates this * vec.
     * @param {Vector3F} vec The other vector.
     * @param {boolean} createNew Whether the result should be in other vector or
     * in this vector.
     * @returns {Vector3F} The result.
     */
    multiply(vec, createNew = true) {
        if (createNew) {
            let r = new Vector3F();
            r.v3[0] = this.v3[0] * vec.v3[0];
            r.v3[1] = this.v3[1] * vec.v3[1];
            r.v3[2] = this.v3[2] * vec.v3[2];
            return r;
        }
        return this.mulThis(vec.v3[0], vec.v3[1], vec.v3[2]);
    }

    /**
     * Calculates this / vec.
     * @param {Vector3F} vec The other vector.
     * @param {boolean} createNew Whether the result should be in other vector or
     * in this vector.
     * @returns {Vector3F} The result.
     */
    divide(vec, createNew = true) {
        if (createNew) {
            let r = new Vector3F();
            r.v3[0] = this.v3[0] * vec.v3[0];
            r.v3[1] = this.v3[1] * vec.v3[1];
            r.v3[2] = this.v3[2] * vec.v3[2];
            return r;
        }
        return this.divThis(vec.v3[0], vec.v3[1], vec.v3[2]);
    }

    /**
     * Calculates this + vec * amt.
     * 
     * @param {Vector3F} vec Other vector.
     * @param {number} amt The amount to add, with 1 being 100% of the other vector.
     * @param {boolean} createNew Whether the result should be in other vector or
     * in this vector.
     * @returns {Vector3F} The result.
     */
    lerp(vec, amt, createNew) {
        let a = vec.v3[0] - this.v3[0];
        let b = vec.v3[1] - this.v3[1];
        let c = vec.v3[2] - this.v3[2];
        if (createNew) {
            let r = new Vector3F();
            r.v3[0] = this.v3[0] + a * amt;
            r.v3[1] = this.v3[1] + b * amt;
            r.v3[2] = this.v3[2] + c * amt;
            return r;
        }
        this.v3[0] += a * amt;
        this.v3[1] += b * amt;
        this.v3[2] += c * amt;
        return this;
    }

    /**
     * Calculates the distance between this and vec.
     * @param {Vector3F} vec Other vector.
     * @returns {number} The distance of these vectors.
     */
    distance(vec) {
        return Math.hypot(vec.v3[0] - this.v3[0], vec.v3[1] - this.v3[1], vec.v3[2] - this.v3[2]);
    }

    /**
     * Normalizes this vector.
     * 
     * @param {boolean} createNew Whether the result should be in other vector or
     * in this vector.
     * @returns {Vector3F} The result.
     */
    normalize(createNew = true) {
        let r = createNew ? new Vector3F() : this;
        let len = this.lengthSqrt;
        if (len > 0) {
            len = 1 / Math.sqrt(len);
        }
        r.v3[0] = this.v3[0] * len;
        r.v3[1] = this.v3[1] * len;
        r.v3[2] = this.v3[2] * len;
        return r;
    }

    /**
     * Calculates the dot product of this and vec.
     * @param {Vector3F} vec Other vector.
     * @returns {number} The result.
     */
    dot(vec) {
        return this.v3[0] * vec.v3[0] + this.v3[1] * vec.v3[1] + this.v3[2] * vec.v3[2];
    }

    /**
     * Calculates the cross product of this and vec.
     * @param {Vector3F} vec Other vector.
     * @param {boolean} createNew Whether the result should be in other vector or
     * in this vector.
     * @returns {Vector3F} The result.
     */
    cross(vec, createNew = true) {
        let r = createNew ? new Vector3F() : this;
        let out = r.v3;
        let ax = this.v3[0], ay = this.v3[1], az = this.v3[2];
        let b = vec.v3;
        out[0] = ay * b[2] - az * b[1];
        out[1] = az * b[0] - ax * b[2];
        out[2] = ax * b[1] - ay * b[0];
        return r;
    }

    /**
     * Rotates around the X axis.
     * 
     * @param {number} rad The radians to rotate this vector about.
     * @param {Vector3F} origin The origin to rotate about (or null).
     * @param {boolean} createNew Whether the result should be in other vector or
     * in this vector.
     * @param {boolean} degrees Whether degrees are being used or not.
     * @returns {Vector3F} The result.
     */
    rotateX(rad, origin, createNew = true, degrees = false) {
        if (degrees) rad *= toRadians;
        let res = createNew ? new Vector3F() : this;
        let out = res.v3;
        let a = this.v3;
        let b = origin == null ? [0, 0, 0] : origin.v3;

        let p = [0, 0, 0], r = [0, 0, 0];
        //Translate point to the origin
        p[0] = a[0] - b[0];
        p[1] = a[1] - b[1];
        p[2] = a[2] - b[2];
        //perform rotation
        r[0] = p[0];
        r[1] = p[1] * Math.cos(rad) - p[2] * Math.sin(rad);
        r[2] = p[1] * Math.sin(rad) + p[2] * Math.cos(rad);
        //translate to correct position
        out[0] = r[0] + b[0];
        out[1] = r[1] + b[1];
        out[2] = r[2] + b[2];
        return res;
    }

    /**
     * Rotates around the Y axis.
     * 
     * @param {number} rad The radians to rotate this vector about.
     * @param {Vector3F} origin The origin to rotate about (or null).
     * @param {boolean} createNew Whether the result should be in other vector or
     * in this vector.
     * @param {boolean} degrees Whether degrees are being used or not.
     * @returns {Vector3F} The result.
     */
    rotateY(rad, origin, createNew = true, degrees = false) {
        if (degrees) rad *= toRadians;
        let res = createNew ? new Vector3F() : this;
        let out = res.v3;
        let a = this.v3;
        let b = origin == null ? [0, 0, 0] : origin.v3;

        let p = [0, 0, 0], r = [0, 0, 0];
        //Translate point to the origin
        p[0] = a[0] - b[0];
        p[1] = a[1] - b[1];
        p[2] = a[2] - b[2];
        //perform rotation
        r[0] = p[0];
        r[1] = p[1] * Math.cos(rad) - p[2] * Math.sin(rad);
        r[2] = p[1] * Math.sin(rad) + p[2] * Math.cos(rad);
        //translate to correct position
        out[0] = r[0] + b[0];
        out[1] = r[1] + b[1];
        out[2] = r[2] + b[2];
        return res;
    }

    /**
     * Rotates around the Z axis.
     * 
     * @param {number} rad The radians to rotate this vector about.
     * @param {Vector3F} origin The origin to rotate about (or null).
     * @param {boolean} createNew Whether the result should be in other vector or
     * in this vector.
     * @param {boolean} degrees Whether degrees are being used or not.
     * @returns {Vector3F} The result.
     */
    rotateZ(rad, origin, createNew = true, degrees = false) {
        if (degrees) rad *= toRadians;
        let res = createNew ? new Vector3F() : this;
        let out = res.v3;
        let a = this.v3;
        let b = origin == null ? [0, 0, 0] : origin.v3;

        let p = [0, 0, 0], r = [0, 0, 0];
        //Translate point to the origin
        p[0] = a[0] - b[0];
        p[1] = a[1] - b[1];
        p[2] = a[2] - b[2];
        //perform rotation
        r[0] = p[0];
        r[1] = p[1] * Math.cos(rad) - p[2] * Math.sin(rad);
        r[2] = p[1] * Math.sin(rad) + p[2] * Math.cos(rad);
        //translate to correct position
        out[0] = r[0] + b[0];
        out[1] = r[1] + b[1];
        out[2] = r[2] + b[2];
        return res;
    }

    /**
     * Rotates this vector using a quaternion.
     * 
     * @param {Quat4F} quat The radians to rotate this vector about.
     * @param {Vector3F} origin The origin to rotate about (or null).
     * @param {boolean} createNew Whether the result should be in other vector or
     * in this vector.
     * @returns {Vector3F} The result.
     */
    rotate(quat, origin, createNew = true) { // quat
        let r = createNew ? this.clone() : this;

        if (origin != null) {
            r.v3[0] -= origin.v3[0];
            r.v3[1] -= origin.v3[1];
            r.v3[2] -= origin.v3[2];
            quat.transformQuat(r, false);
            r.v3[0] += origin.v3[0];
            r.v3[1] += origin.v3[1];
            r.v3[2] += origin.v3[2];
        } else quat.transformQuat(r, false);

        return r;
    }

    /**
     * Clones this vector.
     * @returns {Vector3F} The result.
     */
    clone() {
        let c = new Vector3F();
        c.v3 = new Float32Array(this.v3);
        return c;
    }

    /**
     * Returns the string representation of this object.
     * @returns {string} This object as a string.
     */
    toString() {
        return `Vector3F(${this.v3[0]}, ${this.v3[1]}, ${this.v3[2]})`;
    }

    /**
     * Checks if two vectors are "equal", with
     * an epsilon allowed.
     * @param {Vector3F} vec Other vector.
     * @param {number} eps Maximum absolute difference allowed.
     */
    equals(vec, eps = EPSILON) {
        if (eps === 0.0) {
            return this.v3[0] === vec.v3[0] && this.v3[1] === vec.v3[1] && this.v3[2] === vec.v3[2];
        }
        //eps = Math.abs(eps);
        return Math.abs(vec.v3[0] - this.v3[0]) <= eps
            && Math.abs(vec.v3[1] - this.v3[1]) <= eps
            && Math.abs(vec.v3[2] - this.v3[2]) <= eps;
    }

    get lengthSqrt() {
        return this.v3[0] * this.v3[0] + this.v3[1] * this.v3[1] + this.v3[2] * this.v3[2];
    }

    get length() {
        return Math.hypot(this.v3[0], this.v3[1], this.v3[2]);
    }

    get x() { return this.v3[0]; }
    get y() { return this.v3[1]; }
    get z() { return this.v3[2]; }

    set x(n) { this.v3[0] = n; }
    set y(n) { this.v3[1] = n; }
    set z(n) { this.v3[2] = n; }

}

/**
 * Represents a quaternion.
 */
class Quat4F {

    /**
     * Builds a new quaternion.
     */
    constructor() {
        this.q4 = new Float32Array(4);
    }

    setIdentity() {
        this.q4[0] = 0;
        this.q4[1] = 0;
        this.q4[2] = 0;
        this.q4[3] = 1;
        return this;
    }

    /**
     * Sets this quaternion from the given angle and rotation axis,
     * then returns it.
     *
     * @param {Vector3F} axis The axis.
     * @param {number} rad The radians to turn.
     * @param {boolean} degrees Whether degrees are used instead or not.
     * @returns {Quat4F} This quaternion.
     **/
    setAxisAngle(axis, rad, degrees = false) {
        if (degrees) rad *= toRadians;
        rad *= 0.5;
        let s = Math.sin(rad);
        let v3 = axis.v3;

        this.q4[0] = s * v3[0];
        this.q4[1] = s * v3[1];
        this.q4[2] = s * v3[2];
        this.q4[3] = Math.cos(rad);
        return this;
    }

    /**
     * Multiplies this quaternion with another one.
     * The result is this * quat.
     *
     * @param {Quat4F} quat Other quaternion (second operand).
     * @param {boolean} createNew Whether the result should be
     * in a new quaternion or in this quaternion.
     * @returns {Quat4F} The result.
     */
    multiply(quat, createNew = false) {
        let r = createNew ? new Quat4F() : this;
        let a = this.q4;
        let b = quat.q4;
        let out = r.q4;

        let ax = a[0],
            ay = a[1],
            az = a[2],
            aw = a[3];
        let bx = b[0],
            by = b[1],
            bz = b[2],
            bw = b[3];
        out[0] = ax * bw + aw * bx + ay * bz - az * by;
        out[1] = ay * bw + aw * by + az * bx - ax * bz;
        out[2] = az * bw + aw * bz + ax * by - ay * bx;
        out[3] = aw * bw - ax * bx - ay * by - az * bz;

        return r;
    }

    /**
     * Sets this quaternion as a rotation around the X axis.
     *
     * @param {number} rad The radians to turn.
     * @param {boolean} degrees Whether degrees are used instead or not.
     * @returns {Quat4F} This quaternion.
     **/
    setRotationX(rad, degrees = false) {
        if (degrees) rad *= toRadians;
        rad *= 0.5;
        let bx = Math.sin(rad), bw = Math.cos(rad);

        this.q4[0] = bx;
        this.q4[1] = 0;
        this.q4[2] = 0;
        this.q4[3] = bw;
        return this;
    }

    /**
     * Sets this quaternion as a rotation around the X axis.
     *
     * @param {number} rad The radians to turn.
     * @param {boolean} degrees Whether degrees are used instead or not.
     * @returns {Quat4F} This quaternion.
     **/
    setRotationY(rad, degrees = false) {
        if (degrees) rad *= toRadians;
        rad *= 0.5;
        let by = Math.sin(rad), bw = Math.cos(rad);

        this.q4[0] = 0;
        this.q4[1] = by;
        this.q4[2] = 0;
        this.q4[3] = bw;
        return this;
    }

    /**
     * Sets this quaternion as a rotation around the X axis.
     *
     * @param {number} rad The radians to turn.
     * @param {boolean} degrees Whether degrees are used instead or not.
     * @returns {Quat4F} This quaternion.
     **/
    setRotationZ(rad, degrees = false) {
        if (degrees) rad *= toRadians;
        rad *= 0.5;
        let bz = Math.sin(rad), bw = Math.cos(rad);

        this.q4[0] = 0;
        this.q4[1] = 0;
        this.q4[2] = bz;
        this.q4[3] = bw;
        return this;
    }

    /**
     * Calculates the inverse of this quaternion.
     * 
     * @param {boolean} createNew Whether the result should be
     * in a new quaternion or in this quaternion.
     * @returns {Quat4F} The result.
     */
    invert(createNew = false) {
        let r = createNew ? new Quat4F() : this;
        let a = this.q4;
        let out = r.q4;

        let a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
        let dot = a0 * a0 + a1 * a1 + a2 * a2 + a3 * a3;
        let invDot = dot ? 1.0 / dot : 0;

        // TODO: Would be faster to return [0,0,0,0] immediately if dot == 0
        out[0] = -a0 * invDot;
        out[1] = -a1 * invDot;
        out[2] = -a2 * invDot;
        out[3] = a3 * invDot;
        return r;
    }

    /**
     * Calculates the conjugate of this quaternion.
     * If the quaternion is normalized, this function
     * is faster than quat.inverse and produces the
     * same result.
     *
     * @param {boolean} createNew Whether the result should be
     * in a new quaternion or in this quaternion.
     * @returns {Quat4F} The result.
     */
    conjugate(createNew = false) {
        let r = createNew ? new Quat4F() : this;
        let a = this.q4;
        let out = r.q4;

        out[0] = -a[0];
        out[1] = -a[1];
        out[2] = -a[2];
        out[3] = a[3];
        return r;
    }

    /**
     * Sets this quaternion from the given euler angle x, y, z.
     *
     * @param {x} Angle to rotate around X axis in degrees.
     * @param {y} Angle to rotate around Y axis in degrees.
     * @param {z} Angle to rotate around Z axis in degrees.
     *
     * @returns {Quat4F} This quaternion.
     */
    fromEuler(x, y, z) {
        let out = this.q4;
        let halfToRad = (0.5 * Math.PI) / 180.0;
        x *= halfToRad;
        y *= halfToRad;
        z *= halfToRad;
        let sx = Math.sin(x);
        let cx = Math.cos(x);
        let sy = Math.sin(y);
        let cy = Math.cos(y);
        let sz = Math.sin(z);
        let cz = Math.cos(z);
        out[0] = sx * cy * cz - cx * sy * sz;
        out[1] = cx * sy * cz + sx * cy * sz;
        out[2] = cx * cy * sz - sx * sy * cz;
        out[3] = cx * cy * cz + sx * sy * sz;
        return this;
    }

    /**
     * Calculates the normalized of this quaternion.
     * @param {boolean} createNew Whether the result should be
     * in a new quaternion or in this quaternion.
     * @returns {Quat4F} The result.
     */
    normalize(createNew = false) {
        let r = createNew ? new Quat4F() : this;
        let len = this.length;
        if (len > 0) {
            r.q4[0] /= len;
            r.q4[1] /= len;
            r.q4[2] /= len;
            r.q4[3] /= len;
        }
        return r;
    }

    /**
     * Transforms the vec3 with a quat.
     * Can also be used for dual quaternions. (Multiply it with the real part)
     *
     * @param {Vector3F} vec the receiving vector
     * @param {boolean} createNew Whether the result should be
     * in a new vector or in that vector.
     * @returns {Vector3F} The result.
     */
    transformQuat(vec, createNew = false) {
        let r = createNew ? new Vector3F() : vec;
        let a = vec.v3;
        let out = r.v3;

        // benchmarks: https://jsperf.com/quaternion-transform-vec3-implementations-fixed
        let qx = this.q4[0], qy = this.q4[1], qz = this.q4[2], qw = this.q4[3]
        let x = a[0], y = a[1], z = a[2];

        // var qvec = [qx, qy, qz];
        // var uv = vec3.cross([], qvec, a);
        let uvx = qy * z - qz * y,
            uvy = qz * x - qx * z,
            uvz = qx * y - qy * x;

        // var uuv = vec3.cross([], qvec, uv);
        let uuvx = qy * uvz - qz * uvy,
            uuvy = qz * uvx - qx * uvz,
            uuvz = qx * uvy - qy * uvx;

        // vec3.scale(uv, uv, 2 * w);
        let w2 = qw * 2;
        uvx *= w2;
        uvy *= w2;
        uvz *= w2;

        // vec3.scale(uuv, uuv, 2);
        uuvx *= 2;
        uuvy *= 2;
        uuvz *= 2;

        // return vec3.add(out, a, vec3.add(out, uv, uuv));
        out[0] = x + uvx + uuvx;
        out[1] = y + uvy + uuvy;
        out[2] = z + uvz + uuvz;
        return r;
    }

    /**
     * Retuns the string representation of this quaternion.
     * @returns {string} The string.
     */
    toString() {
        return `Quat4F(${this.q4[0]}, ${this.q4[1]}, ${this.q4[2]}, ${this.q4[3]})`;
    }

    get length() {
        return Math.hypot(this.q4[0], this.q4[1], this.q4[2], this.q4[3]);
    }

    get lengthSqrt() {
        return this.q4[0] * this.q4[0] + this.q4[1] * this.q4[1] + this.q4[2] * this.q4[2] + this.q4[3] * this.q4[3];
    }

    get x() { return this.q4[0]; }
    get y() { return this.q4[1]; }
    get z() { return this.q4[2]; }
    get w() { return this.q4[3]; }

    set x(n) { this.q4[0] = n; }
    set y(n) { this.q4[1] = n; }
    set z(n) { this.q4[2] = n; }
    set w(n) { this.q4[3] = n; }

}

/**
 * Matrix 4F
 */
class Matrix4F {

    /**
     * Builds a new 4x4 Matrix.
     */
    constructor() {
        this.m4 = new Float32Array(16);
    }

    /**
     * Initializes this matrix as an identity.
     * @returns {Matrix4F} This matrix.
     */
    setIdentity() {
        this.m4[0] = 1; this.m4[4] = 0; this.m4[8] = 0; this.m4[12] = 0;
        this.m4[1] = 0; this.m4[5] = 1; this.m4[9] = 0; this.m4[13] = 0;
        this.m4[2] = 0; this.m4[6] = 0; this.m4[10] = 1; this.m4[14] = 0;
        this.m4[3] = 0; this.m4[7] = 0; this.m4[11] = 0; this.m4[15] = 1;
        return this;
    }

    /**
     * Initializes this matrix as a translation.
     * @param {number} x The translation in Z.
     * @param {number} y The translation in Y.
     * @param {number} z The translation in Z.
     * @returns {Matrix4F} This matrix.
     */
    setTranslation(x, y, z) {
        this.m4[0] = 1; this.m4[4] = 0; this.m4[8] = 0; this.m4[12] = x;
        this.m4[1] = 0; this.m4[5] = 1; this.m4[9] = 0; this.m4[13] = y;
        this.m4[2] = 0; this.m4[6] = 0; this.m4[10] = 1; this.m4[14] = z;
        this.m4[3] = 0; this.m4[7] = 0; this.m4[11] = 0; this.m4[15] = 1;
        return this;
    }

    /**
     * Initializes this matrix as a rotation in the X axis.
     * @param {number} rad The radians.
     * @param {boolean} degrees Whether degrees are used instead.
     * @returns {Matrix4F} This matrix.
     */
    setRotationX(rad, degrees = false) {
        if (degrees) rad *= toRadians;
        let s = Math.sin(rad);
        let c = Math.cos(rad);
        // Perform axis-specific matrix multiplication
        this.m4[0] = 1;
        this.m4[1] = 0;
        this.m4[2] = 0;
        this.m4[3] = 0;
        this.m4[4] = 0;
        this.m4[5] = c;
        this.m4[6] = s;
        this.m4[7] = 0;
        this.m4[8] = 0;
        this.m4[9] = -s;
        this.m4[10] = c;
        this.m4[11] = 0;
        this.m4[12] = 0;
        this.m4[13] = 0;
        this.m4[14] = 0;
        this.m4[15] = 1;
        return this;
    }

    /**
     * Initializes this matrix as a rotation in the Y axis.
     * @param {number} rad The radians.
     * @param {boolean} degrees Whether degrees are used instead.
     * @returns {Matrix4F} This matrix.
     */
    setRotationY(rad, degrees = false) {
        if (degrees) rad *= toRadians;
        let s = Math.sin(rad);
        let c = Math.cos(rad);
        // Perform axis-specific matrix multiplication
        this.m4[0] = c;
        this.m4[1] = 0;
        this.m4[2] = -s;
        this.m4[3] = 0;
        this.m4[4] = 0;
        this.m4[5] = 1;
        this.m4[6] = 0;
        this.m4[7] = 0;
        this.m4[8] = s;
        this.m4[9] = 0;
        this.m4[10] = c;
        this.m4[11] = 0;
        this.m4[12] = 0;
        this.m4[13] = 0;
        this.m4[14] = 0;
        this.m4[15] = 1;
        return this;
    }

    /**
     * Initializes this matrix as a rotation in the Z axis.
     * @param {number} rad The radians.
     * @param {boolean} degrees Whether degrees are used instead.
     * @returns {Matrix4F} This matrix.
     */
    setRotationZ(rad, degrees = false) {
        if (degrees) rad *= toRadians;
        let s = Math.sin(rad);
        let c = Math.cos(rad);
        // Perform axis-specific matrix multiplication
        this.m4[0] = c;
        this.m4[1] = s;
        this.m4[2] = 0;
        this.m4[3] = 0;
        this.m4[4] = -s;
        this.m4[5] = c;
        this.m4[6] = 0;
        this.m4[7] = 0;
        this.m4[8] = 0;
        this.m4[9] = 0;
        this.m4[10] = 1;
        this.m4[11] = 0;
        this.m4[12] = 0;
        this.m4[13] = 0;
        this.m4[14] = 0;
        this.m4[15] = 1;
        return this;
    }

    /**
     * Initializes this matrix as a scale.
     * @param {number} x The scale in Z.
     * @param {number} y The scale in Y.
     * @param {number} z The scale in Z.
     * @returns {Matrix4F} The result.
     */
    setScale(x, y, z) {
        this.m4[0] = x; this.m4[4] = 0; this.m4[8] = 0; this.m4[12] = 0;
        this.m4[1] = 0; this.m4[5] = y; this.m4[9] = 0; this.m4[13] = 0;
        this.m4[2] = 0; this.m4[6] = 0; this.m4[10] = z; this.m4[14] = 0;
        this.m4[3] = 0; this.m4[7] = 0; this.m4[11] = 0; this.m4[15] = 1;
    }

    /**
    * Initializes this matrix as a scale.
    * @param {number} fovy Vertical field of view in radians.
    * @param {number} aspect Aspect ratio. typically viewport width/height
    * @param {number} near Near bound of the frustum
    * @param {number} far Far bound of the frustum, can be null or Infinity
    * @returns {Matrix4F} This matrix.
    */
    setPerspective(fovy, aspect, near, far) {
        let f = 1.0 / Math.tan(fovy * 0.5), nf;
        this.m4[0] = f / aspect;
        this.m4[1] = 0;
        this.m4[2] = 0;
        this.m4[3] = 0;
        this.m4[4] = 0;
        this.m4[5] = f;
        this.m4[6] = 0;
        this.m4[7] = 0;
        this.m4[8] = 0;
        this.m4[9] = 0;
        this.m4[11] = -1;
        this.m4[12] = 0;
        this.m4[13] = 0;
        this.m4[15] = 0;
        if (far != null && far !== Infinity) {
            nf = 1 / (near - far);
            this.m4[10] = (far + near) * nf;
            this.m4[14] = 2 * far * near * nf;
        } else {
            this.m4[10] = -1;
            this.m4[14] = -2 * near;
        }
        return this;
    }

    /**
     * Calculates a 4x4 matrix from the given quaternion
     *
     * @param {Quat4F} quat The quaternion.
     * @returns {Matrix4F} This matrix
     */
    setQuaternion(quat) {
        let x = quat.q4[0], y = quat.q4[1], z = quat.q4[2], w = quat.q4[3];

        let x2 = x + x;
        let y2 = y + y;
        let z2 = z + z;
        let xx = x * x2;
        let yx = y * x2;
        let yy = y * y2;
        let zx = z * x2;
        let zy = z * y2;
        let zz = z * z2;
        let wx = w * x2;
        let wy = w * y2;
        let wz = w * z2;

        this.m4[0] = 1 - yy - zz;
        this.m4[1] = yx + wz;
        this.m4[2] = zx - wy;
        this.m4[3] = 0;
        this.m4[4] = yx - wz;
        this.m4[5] = 1 - xx - zz;
        this.m4[6] = zy + wx;
        this.m4[7] = 0;
        this.m4[8] = zx + wy;
        this.m4[9] = zy - wx;
        this.m4[10] = 1 - xx - yy;
        this.m4[11] = 0;
        this.m4[12] = 0;
        this.m4[13] = 0;
        this.m4[14] = 0;
        this.m4[15] = 1;
        return this;
    }

    /**
     * Generates a look-at matrix with the given eye position, focal point, and up axis.
     * If you want a matrix that actually makes an object look at another object, you should use targetTo instead.
     *
     * @param {Vector3F} eye Position of the viewer
     * @param {Vector3F} center Point the viewer is looking at
     * @param {Vector3F} up vec3 pointing up
     * @returns {Matrix4F} This matrix.
     */
    setLookAt(eye, center, up) {
        let out = this.m4;
        let x0, x1, x2, y0, y1, y2, z0, z1, z2, len;
        
        let eyex = eye.v3[0];
        let eyey = eye.v3[1];
        let eyez = eye.v3[2];
        
        let upx = up.v3[0];
        let upy = up.v3[1];
        let upz = up.v3[2];

        let centerx = center.v3[0];
        let centery = center.v3[1];
        let centerz = center.v3[2];
        
        if (
            Math.abs(eyex - centerx) < EPSILON &&
            Math.abs(eyey - centery) < EPSILON &&
            Math.abs(eyez - centerz) < EPSILON
        ) {
            return this.setIdentity();
        }

        z0 = eyex - centerx;
        z1 = eyey - centery;
        z2 = eyez - centerz;
        len = 1 / Math.hypot(z0, z1, z2);
        z0 *= len;
        z1 *= len;
        z2 *= len;
        x0 = upy * z2 - upz * z1;
        x1 = upz * z0 - upx * z2;
        x2 = upx * z1 - upy * z0;
        len = Math.hypot(x0, x1, x2);
        if (!len) {
            x0 = 0;
            x1 = 0;
            x2 = 0;
        } else {
            len = 1 / len;
            x0 *= len;
            x1 *= len;
            x2 *= len;
        }
        y0 = z1 * x2 - z2 * x1;
        y1 = z2 * x0 - z0 * x2;
        y2 = z0 * x1 - z1 * x0;
        len = Math.hypot(y0, y1, y2);
        if (!len) {
            y0 = 0;
            y1 = 0;
            y2 = 0;
        } else {
            len = 1 / len;
            y0 *= len;
            y1 *= len;
            y2 *= len;
        }

        out[0] = x0;
        out[1] = y0;
        out[2] = z0;
        out[3] = 0;
        out[4] = x1;
        out[5] = y1;
        out[6] = z1;
        out[7] = 0;
        out[8] = x2;
        out[9] = y2;
        out[10] = z2;
        out[11] = 0;
        out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
        out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
        out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
        out[15] = 1;

        return this;
    }

    /**
     * Multiplies a matrix with this one. The result is this x mat.
     * @param {Matrix4F} mat The other matrix (second operand).
     * @param {boolean} createNew Whether the result should be exported
     * as a new matrix, or this matrix should contain the results.
     * @returns {Matrix4F} The result.
     */
    multiply(mat, createNew = false) {
        let target = createNew ? new Matrix4F() : this;
        let a = this.m4;
        let b = mat.m4;
        let out = target.m4;

        // operation from https://glmatrix.net/docs/mat4.js.html
        let a00 = a[0],
            a01 = a[1],
            a02 = a[2],
            a03 = a[3];
        let a10 = a[4],
            a11 = a[5],
            a12 = a[6],
            a13 = a[7];
        let a20 = a[8],
            a21 = a[9],
            a22 = a[10],
            a23 = a[11];
        let a30 = a[12],
            a31 = a[13],
            a32 = a[14],
            a33 = a[15];
        // Cache only the current line of the second matrix
        let b0 = b[0],
            b1 = b[1],
            b2 = b[2],
            b3 = b[3];
        out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
        b0 = b[4];
        b1 = b[5];
        b2 = b[6];
        b3 = b[7];
        out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
        b0 = b[8];
        b1 = b[9];
        b2 = b[10];
        b3 = b[11];
        out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
        b0 = b[12];
        b1 = b[13];
        b2 = b[14];
        b3 = b[15];
        out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

        // return the output
        return target;
    }

    /**
     * Transforms the vec4 with this mat4.
     * @param {number} x The X component.
     * @param {number} y The Y component.
     * @param {number} z The Z component.
     * @param {number} w The W component.
     * @returns {Float32Array} The resulting vector.
     */
    transform(x, y, z, w) {
        let out = new Float32Array(4);
        out[0] = this.m4[0] * x + this.m4[4] * y + this.m4[8] * z + this.m4[12] * w;
        out[1] = this.m4[1] * x + this.m4[5] * y + this.m4[9] * z + this.m4[13] * w;
        out[2] = this.m4[2] * x + this.m4[6] * y + this.m4[10] * z + this.m4[14] * w;
        out[3] = this.m4[3] * x + this.m4[7] * y + this.m4[11] * z + this.m4[15] * w;
        return out;
    }

    /**
     * Returns the string representation of this matrix.
     * @returns {string} The string.
     */
    toString() {
        return `Matrix4F:
        [ ${this.m4[0]}, ${this.m4[4]}, ${this.m4[8]}, ${this.m4[12]} ]
        [ ${this.m4[1]}, ${this.m4[5]}, ${this.m4[9]}, ${this.m4[13]} ]
        [ ${this.m4[2]}, ${this.m4[6]}, ${this.m4[10]}, ${this.m4[14]} ]
        [ ${this.m4[3]}, ${this.m4[7]}, ${this.m4[11]}, ${this.m4[15]} ]`;
    }

}

function mathTests() {
    let v = new Vector3F();
    v.x = 1;
    v.y = 0;
    v.z = 0;

    let q = new Quat4F();
    q.setRotationZ(90, true);
    v.rotate(q, null, false);

    let m = new Matrix4F().setQuaternion(q);

    console.log(q.toString());
    console.log(v.toString());
    console.log(m.toString());

    console.log(m.transform(1, 0, 0, 1));
}
//mathTests();
"use strict";
/**
 * OPEN GL - WEBGL 2 ADAPTER
**/

/**
 * Represents the canvas used to draw.
 * @type {HTMLCanvasElement}
 */
const canvas = document.getElementById('canvas');

/* Initialize the GL Context */
let mygl;
{
    const options = { preserveDrawingBuffer: true };

    // check if the context is available
    mygl = canvas.getContext('webgl2', options);

    // check options
    if (!mygl) {
        console.log('WebGL 2.0 not supported, falling back on WebGL 1.0');
        mygl = canvas.getContext('webgl', options);
    }
    if (!mygl) {
        console.log('WebGL not supported, falling back on experimental-webgl');
        mygl = canvas.getContext('experimental-webgl', options);
    }

    // gl not available
    if (!mygl) {
        alert('Your browser does not support WebGL. Using experimental software renderer. Errors will occur!');
    }
    console.log('Using ' + mygl + ' for rendering!');
}
/**
 * The WebGL 2.0 Context Object
 * @type {WebGL2RenderingContext}
 */
const gl = mygl;

/**
 * Updates the canvas' size.
 */
function updateCanvas() {
    let w = window.innerWidth;
    let h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;
    gl.viewport(0, 0, w, h);
} updateCanvas(); // and calls this

/* CLASS ABSTRACTION */

/**
 * Represents a shader program in OpenGL
 */
class ShaderProgramGL {

    /**
     * Builds the necesary shader stuff.
     */
    constructor() {
        this.program = gl.createProgram();
    }

    /**
     * Creates a shader, of said type and code.
     * 
     * @param {GLenum} type The typeof the shader.
     * @param {string} code The code for the shader.
     */
    createShader(type, code) {
        // create, buffer & compile
        let shaderID = gl.createShader(type);
        gl.shaderSource(shaderID, code);
        gl.compileShader(shaderID);

        // check error
        if (!gl.getShaderParameter(shaderID, gl.COMPILE_STATUS)) {
            console.error('ERROR compiling shader!', gl.getShaderInfoLog(shaderID));
            return;
        }

        // attach the shader
        gl.attachShader(this.program, shaderID);
    }

    /**
     * Finishes setting this shader up.
     */
    link() {
        gl.linkProgram(this.program);
        if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
            console.error('ERROR linking program!', gl.getProgramInfoLog(this.program));
            return;
        }
        gl.validateProgram(this.program);
        if (!gl.getProgramParameter(this.program, gl.VALIDATE_STATUS)) {
            console.error('ERROR validating program!', gl.getProgramInfoLog(this.program));
            return;
        }
    }

    /**
     * Makes OpenGL use this shader.
     */
    useShader() {
        gl.useProgram(this.program);
        gl.shaderID = this.program;
    }

    /**
     * Gets the location of a uniform from this shader.
     * 
     * @param {string} name Name
     * @returns {GLint} The uniform location.
     */
    uloc(name) {
        return gl.getUniformLocation(this.program, name);
    }

    /**
     * Gets the location of an attribute from this shader.
     * 
     * @param {string} name Name
     * @returns {GLint} The uniform location.
     */
    getAttribLoc(name) {
        return gl.getAttribLocation(this.program, name);
    }

    /*
    gl.uniform1f (floatUniformLoc, v);                 // for float
    gl.uniform1fv(floatUniformLoc, [v]);               // for float or float array
    gl.uniform2f (vec2UniformLoc,  v0, v1);            // for vec2
    gl.uniform2fv(vec2UniformLoc,  [v0, v1]);          // for vec2 or vec2 array
    gl.uniform3f (vec3UniformLoc,  v0, v1, v2);        // for vec3
    gl.uniform3fv(vec3UniformLoc,  [v0, v1, v2]);      // for vec3 or vec3 array
    gl.uniform4f (vec4UniformLoc,  v0, v1, v2, v4);    // for vec4
    gl.uniform4fv(vec4UniformLoc,  [v0, v1, v2, v4]);  // for vec4 or vec4 array
    */

    /**
     * Sets a float or floats uniform variables in the shader.
     * 
     * @param {string} name The name of the uniform.
     * @param {number[]} data The data.
     */
    setFloat(name, data) {
        let floatUniformLoc = this.uloc(name);
        switch (data.length) {
            case 1:
                gl.uniform1fv(floatUniformLoc, data);
                break;
            case 2:
                gl.uniform2fv(floatUniformLoc, data);
                break;
            case 3:
                gl.uniform3fv(floatUniformLoc, data);
                break;
            case 4:
                gl.uniform4fv(floatUniformLoc, data);
                break;
            default:
                throw "Unsupported float data length: " + data.length;
        }
    }

    /*
    gl.uniformMatrix2fv(mat2UniformLoc, false, [  4x element array ])  // for mat2 or mat2 array
    gl.uniformMatrix3fv(mat3UniformLoc, false, [  9x element array ])  // for mat3 or mat3 array
    gl.uniformMatrix4fv(mat4UniformLoc, false, [ 16x element array ])  // for mat4 or mat4 array
    */

    /**
     * Sets a matrix uniform variable in the shader.
     * 
     * @param {string} name The name of the uniform.
     * @param {number[]} data The data.
     */
    setMatrix(name, data) {
        let matUniformLoc = this.uloc(name);
        switch (data.length) {
            case 4:
                gl.uniformMatrix2fv(matUniformLoc, false, data);
                break;
            case 9:
                gl.uniformMatrix3fv(matUniformLoc, false, data);
                break;
            case 16:
                gl.uniformMatrix4fv(matUniformLoc, false, data);
                break;
            default:
                throw "Unsupported matrix data length: " + data.length;
        }
    }

    /*
    gl.uniform1i (intUniformLoc,   v);                 // for int
    gl.uniform1iv(intUniformLoc, [v]);                 // for int or int array
    gl.uniform2i (ivec2UniformLoc, v0, v1);            // for ivec2
    gl.uniform2iv(ivec2UniformLoc, [v0, v1]);          // for ivec2 or ivec2 array
    gl.uniform3i (ivec3UniformLoc, v0, v1, v2);        // for ivec3
    gl.uniform3iv(ivec3UniformLoc, [v0, v1, v2]);      // for ivec3 or ivec3 array
    gl.uniform4i (ivec4UniformLoc, v0, v1, v2, v4);    // for ivec4
    gl.uniform4iv(ivec4UniformLoc, [v0, v1, v2, v4]);  // for ivec4 or ivec4 array
    */

    /**
     * Sets an int or ints uniform variables in the shader.
     * 
     * @param {string} name The name of the uniform.
     * @param {number[]} data The data.
     */
    setInt(name, data) {
        let intUniformLoc = this.uloc(name);
        switch (data.length) {
            case 1:
                gl.uniform1iv(intUniformLoc, data);
                break;
            case 2:
                gl.uniform2iv(intUniformLoc, data);
                break;
            case 3:
                gl.uniform3iv(intUniformLoc, data);
                break;
            case 4:
                gl.uniform4iv(intUniformLoc, data);
                break;
            default:
                throw "Unsupported int data length: " + data.length;
        }
    }

    /*
    gl.uniform1i (sampler2DUniformLoc,   v);           // for sampler2D (textures)
    gl.uniform1iv(sampler2DUniformLoc, [v]);           // for sampler2D or sampler2D array
    */

    /*
    gl.uniform1i (samplerCubeUniformLoc,   v);         // for samplerCube (textures)
    gl.uniform1iv(samplerCubeUniformLoc, [v]);         // for samplerCube or samplerCube array
    */

}

/**
 * Represents a model.
 */
class ModelGL {

    constructor() {
        this.vao = gl.createVertexArray();
    }

    /**
     * Inits this model by loading a .obj file.
     * 
     * @param {ShaderProgramGL} shader The shader.
     * @param {string} vertName The name of the vertices.
     * @param {string} texcoordName The name of the tex coords.
     * @param {string} normalsName The name of the tex coords.
     * @param {string} str The .obj file.
     */
    initModel(shader, vertName, texcoordName, normalsName, str) {
        let mesh = new OBJ.Mesh(str);
        console.log(mesh);

        // load vertices
        this.setFloatData(vertName, shader, new Float32Array(mesh.vertices), 3);
        // load tex coords
        this.setFloatData(texcoordName, shader, new Float32Array(mesh.textures), 2);
        // load normals
        this.setFloatData(normalsName, shader, new Float32Array(mesh.vertexNormals), 3);
        // load indices
        this.setIndices(new Uint16Array(mesh.indices));
    }

    /**
     * Initializes a buffer for this model.
     * 
     * @param {string} name The attribute in which to receive the elements.
     * @param {ShaderProgramGL} shader The shader.
     * @param {Float32Array} data The elements.
     * @param {number} elementSize The number of elements of a vertex.
     */
    setFloatData(name, shader, data, elementSize = 3) {
        // binds the Vertex Array Object
        this.bind();
        // get the location of name
        let loc = shader.getAttribLoc(name);

        // uploads the data to the GPU
        let buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

        // enables the name's location and tells openGL how to use it.
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, elementSize, gl.FLOAT, false, 0, 0);

        // clean up code
        this.unbind(); // unbind VAO
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.disableVertexAttribArray(loc); // disable name's location
    }

    /**
     * Initializes the indices of this model.
     * 
     * @param {Uint16Array} data The indices.
     */
    setIndices(data) {
        // binds the Vertex Array Object
        this.bind();
        this.indicesCount = data.length;

        // uploads the data to the GPU
        let buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);

        // clean up code
        this.unbind(); // unbind VAO
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }

    bind() {
        gl.bindVertexArray(this.vao);
    }

    unbind() {
        gl.bindVertexArray(null);
    }

    /**
     * Draws this model as elements linked by the indices.
     */
    drawElements() {
        this.bind();
        gl.drawElements(gl.TRIANGLES, this.indicesCount, gl.UNSIGNED_SHORT, 0);
        this.unbind();
    }

}

/**
 * Represents a new texture in openGL.
 */
class TextureGL {

    /**
     * Builds a new 2D texture.
     * @param {number} width The width of the texture.
     * @param {number} height The height of the texture.
     * @param {number} active The active texture for this to be in.
     */
    init2D(width, height, active = 0) {
        this.type = gl.TEXTURE_2D;
        this.texID = gl.createTexture();
        this.width = width;
        this.height = height;
        this.active = gl.TEXTURE0 + active;

        // upload to gl
        this.bind();
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.width, this.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

        // default parameters
        gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    }

    /**
     * Builds a new 3D texture.
     * @param {number} width The width of the texture.
     * @param {number} height The height of the texture.
     * @param {number} depth The depth of the texture.
     * @param {number} active The active texture for this to be in.
     */
     init3D(width, height, depth, active = 0) {
        this.type = gl.TEXTURE_2D_ARRAY;
        this.texID = gl.createTexture();
        this.width = width;
        this.height = height;
        this.depth = depth;
        this.active = gl.TEXTURE0 + active;

        // upload to gl
        this.bind();
        gl.texImage3D(this.type, 0, gl.RGBA, this.width, this.height, this.depth, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

        // default parameters
        gl.texParameteri(this.type, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(this.type, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(this.type, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(this.type, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    }

    /**
     * Downloads a image, then it puts it into a canvas.
     * The canvas is available to draw.
     * 
     * @param {string} url The url to download.
     * @param {function(TextureGL)} onload Callback on success.
     * @param {function(TextureGL)} onerror Callback on error.
     */
    download(url, onload, onerror = null) {
        // this variable
        let _this = this;

        // download image
        let image = new Image();
        image.crossOrigin = "anonymous";
        image.src = url;

        // success!
        image.onload = () => {
            // store downloaded texture
            let canvas = document.createElement('canvas');
            canvas.width = _this.width;
            canvas.height = _this.height;

            // store
            _this.canvas = canvas;
            _this.ctx = canvas.getContext('2d');
            _this.image = image;

            // call the callback xD
            onload(_this);
        }

        // error!
        image.onerror = () => { onerror(_this); };
    }

    /**
     * Uploads a part of the downloaded image to gl.
     * YOU MUST BIND FIRST.
     * 
     * @param {number} x The x coordinate.
     * @param {number} y The y coordinate.
     * @param {number} w The width of the section.
     * @param {number} h The height of the section.
     */
    texSubImage2D(x = 0, y = 0, w = this.width, h = this.height) {
        this.ctx.drawImage(this.image, x, y, w, h, 0, 0, this.width, this.height);
        gl.texSubImage2D(this.type, 0, 0, 0, this.width, this.height, gl.RGBA, gl.UNSIGNED_BYTE, this.canvas);
    }

    /**
     * Uploads a part of the downloaded image to gl.
     * YOU MUST BIND FIRST.
     * 
     * @param {number} layer The layer to upload to.
     * @param {number} x The x coordinate.
     * @param {number} y The y coordinate.
     * @param {number} w The width of the section.
     * @param {number} h The height of the section.
     */
     texSubImage3D(layer, x = 0, y = 0, w = this.width, h = this.height) {
        this.ctx.drawImage(this.image, x, y, w, h, 0, 0, this.width, this.height);
        gl.texSubImage3D(this.type, 0, 0, 0, layer, this.width, this.height, 1, gl.RGBA, gl.UNSIGNED_BYTE, this.canvas);
    }

    /**
     * Removes the downloaded context.
     */
    clearDownload() {
        this.image = undefined;
        this.canvas = undefined;
    }

    /**
     * Binds this texture to OpenGL
     */
    bind() {
        gl.activeTexture(this.active);
        gl.bindTexture(this.type, this.texID);
    }

    /**
     * Unbinds this texture to OpenGL
     */
    unbind() {
        gl.bindTexture(this.type, null);
        gl.activeTexture(0);
    }

}


/**
 * AVEN RENDER
 * Cosas para poder dibujar cosas en la pantalla.
**/

/* Utilidates */

/* Shader para dibujar voxeles */

const voxelShader = new ShaderProgramGL();
voxelShader.createShader(gl.VERTEX_SHADER,
    `#version 300 es

in vec3 pos;
in vec2 texCoords;
in vec3 normals;

out vec2 f_texCoords;
flat out int face;

uniform mat4 matrix;

int getFace() {
    if(normals.x != 0.0) return normals.x > 0.0 ? 1 : 3;
    if(normals.y != 0.0) return normals.y > 0.0 ? 4 : 5;
    if(normals.z != 0.0) return normals.z > 0.0 ? 0 : 2;
    return 0;
}

void main() {
    gl_Position = matrix * vec4(pos, 1);
    f_texCoords = texCoords;
    face = getFace();
}
`);
voxelShader.createShader(gl.FRAGMENT_SHADER,
    `#version 300 es
precision highp float;
precision highp sampler2DArray;

in vec2 f_texCoords;
flat in int face;

out vec4 fragColor;

uniform sampler2DArray tex_sampler;

void main() {
    fragColor = texture(tex_sampler, vec3(f_texCoords, float(face)));
}
`);
voxelShader.link();
voxelShader.useShader();

/* Cámara */

/**
 * Representa una cámara.
 */
class Camera {

    /**
     * Matriz de proyección.
     * @type {Matrix4F}
     */
    proj = new Matrix4F().setIdentity();

    /**
     * Matriz de vista.
     * @type {Matrix4F}
     */
    view = new Matrix4F().setIdentity();

    /**
     * Vector de posición.
     * @type {Vector3F}
     */
    position = new Vector3F(0, 0, 2);

    // vectores para calcular la dirección de la cámara.
    front = new Vector3F(0, 0, -1);
    up = new Vector3F(0, 1, 0);
    right = new Vector3F(1, 0, 0);
    worldUp = new Vector3F(0, 1, 0);

    yaw = -90.0; // rotación
    pitch = 0.0;

    /**
     * Inicia la cámara para tener una posición 3D
     * @param {number} fov El field-of-view de la cámara, en grados.
     */
    init3D(fov) {
        // inicia la proyección
        this.proj.setPerspective(fov * toRadians, canvas.width / canvas.height, 0.1, 100.0);
    }

    /**
     * Regresa la matriz que representa la cámara.
     * @returns {Matrix4F} The matrix.
     */
    getMatrix() {
        this.view.setLookAt(this.position, this.position.add(this.front, true), this.up);
        return this.proj.multiply(this.view, true);
    }

    /**
     * Mueve la cámara. Las coordenadas están relativas a la cámara.
     * @param {number} x El componente X
     * @param {number} y El componente Y
     * @param {number} z El componente Z
     */
    move(x, y, z) {
        this.position.addScale(this.right, -x, false);
        this.position.addScale(this.up, -y, false);
        this.position.addScale(this.front, -z, false);
    }

    /**
     * Rota la cámara. No, los ejes no están al réves.
     * @param {number} yaw La rotación horizontal (eje Y).
     * @param {number} pitch La rotación vertical (eje X).
     */
    rotate(yaw, pitch) {
        this.yaw += yaw;
        this.yaw %= 360;

        this.pitch += pitch;
        if(this.pitch > 90) this.pitch = 90;
        else if(this.pitch < -90) this.pitch = -90;
    }

    updateCamera() {
        // update the front vector.
        let yawRads = this.yaw * toRadians;

        let pitchRads = this.pitch * toRadians;
        let cosPitch = Math.cos(pitchRads);

        this.front.x = Math.cos(yawRads) * cosPitch;
        this.front.y = Math.sin(pitchRads);
        this.front.z = Math.sin(yawRads) * cosPitch;
        this.front.normalize(false);

        // update right and up vector
        this.right = this.front.cross(this.worldUp, true).normalize(false);
        this.up = this.right.cross(this.front, true).normalize(false);
    }

}

/**
 * La cámara principal.
 */
const mainCamera = new Camera();
mainCamera.init3D(90);

/* Modelo de un cubo */

const cubeModel = new ModelGL();
cubeModel.initModel(voxelShader, 'pos', 'texCoords', 'normals', `
v 1 0 0
v 1 0 1
v 0 0 1
v 0 0 0
v 1 1 0
v 1 1 1
v 0 1 1
v 0 1 0

vt 0 1
vt 1 1
vt 1 0
vt 0 0

vn  0 -1  0
vn  0  1  0
vn  1  0  0
vn  0  0  1
vn -1  0  0
vn  0  0 -1
vn  1  0  0

f 2/1/1 3/2/1 4/3/1
f 5/3/2 8/4/2 7/1/2

f 5/3/3 6/4/3 2/1/3
f 2/2/4 6/3/4 7/4/4

f 7/3/5 8/4/5 4/1/5
f 5/4/6 1/1/6 4/2/6

f 1/4/1 2/1/1 4/3/1
f 6/2/2 5/3/2 7/1/2

f 1/2/7 5/3/7 2/1/7
f 3/1/4 2/2/4 7/4/4

f 3/2/5 7/3/5 4/1/5
f 8/3/6 5/4/6 4/2/6
`);



/* pruebas */
gl.enable(gl.DEPTH_TEST);
gl.enable(gl.CULL_FACE);

let tex = new TextureGL();
tex.init3D(32, 32, 6);
tex.download('https://i.imgur.com/Cx07DEN.png', (t)=>{
    tex.texSubImage3D(0, 0, 0);
    tex.texSubImage3D(1, 32, 0);
    tex.texSubImage3D(2, 64, 0);
    tex.texSubImage3D(3, 0, 32);
    tex.texSubImage3D(4, 32, 32);
    tex.texSubImage3D(5, 64, 32);
});

function testDraw() {
    gl.clearColor(0.4, 0.4, 0.4, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    voxelShader.setMatrix('matrix', mainCamera.getMatrix().m4);
    cubeModel.drawElements();
}
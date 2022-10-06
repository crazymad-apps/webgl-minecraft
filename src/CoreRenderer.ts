import { BaseMesh } from "./types/BaseTypes";
import { createProgram } from "./utils/webgl";
import m4 from "./utils/m4";
import CoreCamera from "./CoreCamera";

export default class CoreRender {
  canvas: HTMLCanvasElement;

  gl: WebGLRenderingContext;

  ratio: number = 1;

  meshs: BaseMesh[] = [];

  program: WebGLProgram;

  width: number = 0; // canvas width

  height: number = 0; // canvas height

  latestTS: number = new Date().getTime();

  camera: CoreCamera;

  constructor(id: string) {
    const container = document.getElementById(id);
    if (!container) throw new Error("Could not found container element!");

    this.canvas = document.createElement("canvas");
    this.gl = this.canvas.getContext("webgl")!;
    container?.appendChild(this.canvas);

    this.initCanvas();
    this.initProgram();

    this.camera = new CoreCamera(this.canvas);

    window.addEventListener("resize", () => this.initCanvas());
  }

  createShader(source: string, type: number) {
    const shader = this.gl.createShader(type);
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);
    const success = this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS);
    if (success) {
      return shader;
    }

    this.gl.deleteShader(shader);
    throw new Error(this.gl.getShaderInfoLog(shader));
  }

  initCanvas() {
    const { width, height } = this.canvas.getBoundingClientRect();
    this.canvas.width = width;
    this.canvas.height = height;
    this.width = width;
    this.height = height;

    this.ratio = width / height;
    this.gl.viewport(0, 0, width, height);
  }

  initProgram() {
    const vertex_shader_text = `
      attribute vec4 a_position;
      attribute vec3 a_normal;

      uniform mat4 u_matrix;

      varying vec3 v_normal;

      void main () {
        gl_Position = u_matrix * a_position;

        v_normal = a_normal;
      }
    `;
    const fragment_shader_text = `
      precision mediump float;

      varying vec3 v_normal;

      uniform vec3 u_reverseLightDirection;

      void main() {
        vec3 normal = normalize(v_normal);
        float light = dot(normal, u_reverseLightDirection);

        gl_FragColor = vec4(1.0, 0.5, 0.0, 1.0);
        // gl_FragColor = vec4(1, 0.5, 0.5, 1); // return redish-purple
        // gl_FragColor.rgb *= light;
      }
    `;

    this.program = createProgram(
      this.gl,
      vertex_shader_text,
      fragment_shader_text
    );
  }

  addMeshs(mesh: BaseMesh) {
    this.meshs.push(mesh);
  }

  render() {
    const gl = this.gl;

    gl.clearColor(0, 0, 0, 1);
    gl.clear(this.gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.useProgram(this.program);
    // 单面渲染
    gl.enable(gl.CULL_FACE);
    // 深度检测
    gl.enable(gl.DEPTH_TEST);

    const positionLocation = gl.getAttribLocation(this.program, "a_position");
    const normalLocation = gl.getAttribLocation(this.program, "a_normal");
    const matrixLocation = gl.getUniformLocation(this.program, "u_matrix");
    const reverseLightDirectionLocation = gl.getUniformLocation(
      this.program,
      "u_reverseLightDirection"
    );

    let matrix = m4.perspective((60 / 180) * Math.PI, this.ratio, 1, 400);
    matrix = m4.multiply(matrix, m4.inverse(this.camera.matrix));

    gl.uniformMatrix4fv(matrixLocation, false, matrix);

    for (const mesh of this.meshs) {
      const { vertexs, indices } = mesh;

      const vertexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexs), gl.STATIC_DRAW);

      const indicesBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
      gl.bufferData(
        gl.ELEMENT_ARRAY_BUFFER,
        new Uint16Array(indices),
        gl.STATIC_DRAW
      );

      gl.enableVertexAttribArray(positionLocation);
      gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

      const normalBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(mesh.normals),
        gl.STATIC_DRAW
      );
      gl.enableVertexAttribArray(normalLocation);
      gl.vertexAttribPointer(normalLocation, 3, gl.FLOAT, false, 0, 0);

      gl.uniform3fv(reverseLightDirectionLocation, m4.normalize([0.5, 0.7, 1]));
      gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
    }

    // let tmpTS = this.latestTS;
    this.latestTS = new Date().getTime();
    // console.log("render tick timestamp", this.latestTS - tmpTS);
  }
}

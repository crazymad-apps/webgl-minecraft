import { BaseMesh } from "./types/BaseTypes";
import { createProgram } from "./utils/webgl";
import m4 from "./utils/m4";

let r = 0;

export default class CoreRender {
  canvas: HTMLCanvasElement;

  gl: WebGLRenderingContext;

  ratio: number = 1;

  meshs: BaseMesh[] = [];

  program: WebGLProgram;

  width: number = 0; // canvas width

  height: number = 0; // canvas height

  latestTS: number = new Date().getTime();

  constructor(id: string) {
    const container = document.getElementById(id);
    if (!container) throw new Error("Could not found container element!");

    this.canvas = document.createElement("canvas");
    this.gl = this.canvas.getContext("webgl")!;
    container?.appendChild(this.canvas);

    this.initCanvas();
    this.initProgram();

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

      uniform mat4 u_matrix;

      void main () {
        gl_Position = u_matrix * a_position;
      }
    `;
    const fragment_shader_text = `
      precision mediump float;

      void main() {
        gl_FragColor = vec4(1, 0.5, 0.5, 1); // return redish-purple
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
    const matrixLocation = gl.getUniformLocation(this.program, "u_matrix");

    r += 0.005;
    r %= Math.PI * 2;

    let matrix = m4.perspective((60 / 180) * Math.PI, this.ratio, 1, 400);
    matrix = m4.translate(matrix, 0, 0, -200);
    matrix = m4.yRotate(matrix, r);
    matrix = m4.xRotate(matrix, r);

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
      gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
    }

    // let tmpTS = this.latestTS;
    this.latestTS = new Date().getTime();
    // console.log("render tick timestamp", this.latestTS - tmpTS);
  }
}

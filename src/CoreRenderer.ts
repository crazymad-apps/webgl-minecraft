import { BaseMesh } from "./types/BaseTypes";

export default class CoreRender {
  canvas: HTMLCanvasElement;

  gl: WebGLRenderingContext;

  ratio: number = 1;

  meshs: BaseMesh[] = [];

  program: WebGLProgram;

  constructor(id: string) {
    const container = document.getElementById(id);
    if (!container) throw new Error("Could not found container element!");

    this.canvas = document.createElement("canvas");
    this.gl = this.canvas.getContext("webgl")!;
    container?.appendChild(this.canvas);

    this.initCanvas();
    this.initProgram();
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

    this.ratio = width / height;
    this.gl.viewport(0, 0, width, height);
  }

  initProgram() {
    const vertex_shader_text = `
      attribute vec4 a_position;

      void main () {
        gl_Position = a_position;
      }
    `;
    const fragment_shader_text = `
      precision mediump float;

      void main() {
        gl_FragColor = vec4(1, 0, 0.5, 1); // return redish-purple
      }
    `;

    const v_shader = this.createShader(
      vertex_shader_text,
      this.gl.VERTEX_SHADER
    );
    const f_shader = this.createShader(
      fragment_shader_text,
      this.gl.FRAGMENT_SHADER
    );

    const program = this.gl.createProgram();
    this.gl.attachShader(program, v_shader);
    this.gl.attachShader(program, f_shader);
    this.gl.linkProgram(program);

    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      throw new Error(this.gl.getProgramInfoLog(program));
    }

    this.program = program;
  }

  addMeshs(mesh: BaseMesh) {
    this.meshs.push(mesh);
  }

  render() {
    const gl = this.gl;

    gl.clearColor(0, 0, 0, 1);
    gl.clear(this.gl.COLOR_BUFFER_BIT);
    gl.useProgram(this.program);

    const positionLocation = gl.getAttribLocation(this.program, "a_position");

    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

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

      gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
    }
  }
}

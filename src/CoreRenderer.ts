import { BaseMesh } from "./types/BaseTypes";

export default class CoreRender {
  canvas: HTMLCanvasElement;

  gl: WebGLRenderingContext;

  ratio: number = 1;

  meshs: BaseMesh[] = [];

  program: any;

  constructor(id: string) {
    const container = document.getElementById(id);
    if (!container) throw new Error("Could not found container element!");

    this.canvas = document.createElement("canvas");
    this.gl = this.canvas.getContext("webgl")!;
    container?.appendChild(this.canvas);

    this.initCanvas();
    this.initProgram();
  }

  initCanvas() {
    const { width, height } = this.canvas.getBoundingClientRect();
    this.canvas.width = width;
    this.canvas.height = height;

    this.ratio = width / height;
  }

  initProgram() {
    const vertex_shader_text = `
      attribute vec3 a_position;

      void main () {
        gl_Position = vec4(a_position, 1.0);
      }
    `;
    const fragment_shader_text = `
      precision mediump float;

      void main () {
        gl_FragColor = vec4(1.0, 0.0, 0.5, 1.0);
      }
    `;

    const v_shader = this.createShader(
      vertex_shader_text,
      this.gl.VERTEX_SHADER
    );
    const f_shader = this.createShader(
      fragment_shader_text,
      this.gl.
    )
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

  addMeshs(mesh: BaseMesh) {
    this.meshs.push(mesh);
  }

  render() {}
}

export function createShader(
  gl: WebGLRenderingContext,
  source: string,
  type: number
) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }

  gl.deleteShader(shader);
  throw new Error(gl.getShaderInfoLog(shader));
}

export function createProgram(
  gl: WebGLRenderingContext,
  vertex_shader_source: string,
  fragment_shader_source: string
) {
  const v_shader = createShader(gl, vertex_shader_source, gl.VERTEX_SHADER);
  const f_shader = createShader(gl, fragment_shader_source, gl.FRAGMENT_SHADER);

  const program = gl.createProgram();
  gl.attachShader(program, v_shader);
  gl.attachShader(program, f_shader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(program));
  }

  return program;
}

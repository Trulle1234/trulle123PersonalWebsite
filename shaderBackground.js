const canvas = document.getElementById('glcanvas');
const gl = canvas.getContext('webgl');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const vertexShaderSrc = `
  attribute vec2 a_position;
  varying vec2 v_uv;

  void main() {
    v_uv = a_position * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

function createShader(gl, type, src) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Shader compile error:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(gl, vs, fs) {
  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Program link error:', gl.getProgramInfoLog(program));
    return null;
  }
  return program;
}

const fragmentShaderSrc = `
  precision mediump float;
  uniform float u_time;
  varying vec2 v_uv;

  void main() {
    float scale = 2.0;

    float x1 = v_uv.x * 10.0 * scale;
    float y1 = v_uv.y * 10.0 * scale;

    float x2 = v_uv.x * 8.0 * scale;
    float y2 = v_uv.y * 8.0 * scale;

    float x3 = v_uv.x * 5.0 * scale;
    float y3 = v_uv.y * 5.0 * scale;

    float a = sin(u_time * 0.2);
    float c = sin(u_time * 0.3);

    float r = sin(x1 * c + u_time * 3.0)
              + sin(y1 * a  + u_time * 2.0)
              + cos(x3 * c * 0.5);

    float g = sin(y2 * a + u_time * 2.0)
              + sin(x2 * c + u_time * 1.0)
              + cos(x1 * a * 0.23 + y3 * c);

    float b = sin(y3 * a + u_time * 1.4)
              + sin(x3 * c + u_time * 3.0);

    r = (r + 1.0) / 2.0;
    g = (g + 1.0) / 2.0;
    b = (b + 1.0) / 2.0;


    gl_FragColor = vec4(r, g, b, 1.0);
  }
`;

const vertShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSrc);
const fragShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSrc);
const program = createProgram(gl, vertShader, fragShader);

const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(
  gl.ARRAY_BUFFER,
  new Float32Array([
    -1, -1,
     1, -1,
    -1,  1,
    -1,  1,
     1, -1,
     1,  1
  ]),
  gl.STATIC_DRAW
);

const positionLoc = gl.getAttribLocation(program, "a_position");
const timeLoc = gl.getUniformLocation(program, "u_time");
const resLoc = gl.getUniformLocation(program, "u_resolution");

function render(time) {
  time *= 0.001;
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(program);
  gl.enableVertexAttribArray(positionLoc);
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

  gl.uniform1f(timeLoc, time);
  gl.uniform2f(resLoc, canvas.width, canvas.height);

  gl.drawArrays(gl.TRIANGLES, 0, 6);
  requestAnimationFrame(render);
}
requestAnimationFrame(render);

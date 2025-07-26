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
uniform vec2 u_res;
varying vec2 v_uv;

float rand(int i) {
    return sin(float(i) * 1.64);
}

float noise(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

float grain(vec2 uv, float time) {
    return fract(sin(dot(uv * u_res, vec2(91.345, 74.234)) + time * 20.0) * 43758.5453);
}

vec3 get_blob(int i, float time){
    float spd = .25;
    float move_range = .5;
    
    vec2 center = vec2(0.5) + 0.1 * vec2(rand(i), rand(i+42));    
    center += move_range * vec2(
        sin(spd * time * rand(i+2)) * rand(i + 56),
        -sin(spd * time) * rand(i*9)
    );
    
    float radius = 0.06 * abs(rand(i+3));
    return vec3(center.xy, radius);
}

float compute_dist_sum(vec2 uv, float aspect) {
    const int num_blobs = 20;
    float dist_sum = 0.0;
    for (int  i = 0; i < num_blobs; i++) {      
        vec3 blob = get_blob(i, u_time);
        float radius = blob.z;
        vec2 center = blob.xy;       
        center.y *= aspect;
        float dist_to_center = max(length(center - uv) + radius / 2.0, 0.0);
        float tmp = dist_to_center * dist_to_center;
        dist_sum += 1.0 / (tmp * tmp);   
    }
    return dist_sum;
}

void main() {
    vec3 blob_color_center = vec3(0, 5, 10) / 255.0;
    vec3 blob_color_edge   = vec3(200, 0, 255) / 255.0;
    vec3 bg_col = vec3(0.0);

    float thresh = 40000.0;
    float aspect = u_res.y / u_res.x;

    // === Pixelate ===
  vec2 pixel_grid = vec2(640.0, 360.0);
    vec2 pixel_uv = floor(v_uv * pixel_grid) / pixel_grid;

    // === Apply VHS effects AFTER pixelation ===

    float wobble = sin(pixel_uv.y * 100.0 + u_time * 3.0) * 0.0006;

    float glitch_band = step(0.996, fract(sin(u_time * 25.0 + pixel_uv.y * 400.0) * 43758.0)) * 0.004;

    vec2 uv = pixel_uv + vec2(wobble + glitch_band, 0.0);
    uv.y *= aspect;

    vec2 offsetR = vec2( 0.0005, -0.0005);
    vec2 offsetG = vec2(-0.0005,  0.0005);
    vec2 offsetB = vec2( 0.0005,  0.0005);

    float distR = compute_dist_sum(uv + offsetR, aspect);
    float distG = compute_dist_sum(uv + offsetG, aspect);
    float distB = compute_dist_sum(uv + offsetB, aspect);

    float scanline = 0.96 + 0.04 * sin(v_uv.y * u_res.y * 1.5);
    float flicker = 0.985 + 0.015 * sin(u_time * 40.0 + v_uv.y * 50.0);
    float g = grain(v_uv, u_time) * 0.05;

    gl_FragColor = vec4(bg_col, 0.0); 

    if (distR > thresh || distG > thresh || distB > thresh) {
        float tR = smoothstep(thresh, 0.0, distR - thresh);
        float tG = smoothstep(thresh, 0.0, distG - thresh);
        float tB = smoothstep(thresh, 0.0, distB - thresh);

        float r = mix(blob_color_center.r, blob_color_edge.r, tR);
        float g_col = mix(blob_color_center.g, blob_color_edge.g, tG);
        float b = mix(blob_color_center.b, blob_color_edge.b, tB);

        vec3 color = vec3(r, g_col, b) * scanline * flicker;
        color += g;

        gl_FragColor = vec4(color, 1.0);
    }
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
const resLoc = gl.getUniformLocation(program, "u_res");

const timeOffset = Math.random() * 3600;

function render(time) {
  time = time * 0.001 + timeOffset;

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

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

  float rand(int i) {  // produce some "random" numbers to vary the blobs
      return sin(float(i) * 1.64);
  }

  vec3 get_blob(int i, float time){
      // Blob movement parameters
      float spd = .25;
      float move_range = .5;

      float x = float(i);    
      vec2 center = vec2(.5,.5) + .1 * vec2(rand(i),rand(i+42));    
      center += move_range * vec2(sin(spd * time * rand(i+2)) * rand(i + 56), -sin(spd * time) * rand(i*9));
      float radius = 0.06 * abs(rand(i+3));
      return vec3(center.xy,radius);
  }

  void main() {
    // Shading parameters
    vec3 blob_color_center = vec3(0, 5, 10)/255.;
    vec3 blob_color_edge = vec3(0, 10, 15)/255.;
    vec3 bg_col = vec3(0, 0, 0)/255.;
    const int num_blobs = 20;    
    float thresh = 40000.; // determine size of balls  (larger num = smaller balls)
    
    vec2 uv = v_uv;   
    float aspect = u_res.y/u_res.x;
    uv.y *= aspect;      
    
    float dist_sum = 0.;
    // use metaballs for blobs
    for (int  i = 0; i < num_blobs; i++){      
        vec3 blob = get_blob(i,u_time);
        float radius = blob.z;
        vec2 center = blob.xy;       
        center.y *= aspect;
        float dist_to_center = max(length(center - uv)+radius/2.,0.); // add some radius to vary blob size
        float tmp =  (dist_to_center * dist_to_center) ;
        dist_sum += 1. / (tmp*tmp);   
      }
       
    gl_FragColor = vec4(bg_col, 0); 
    if (dist_sum > thresh){
        float t = smoothstep(thresh, 0., dist_sum-thresh);
        vec3 col = mix(blob_color_center, blob_color_edge, t);
        gl_FragColor = vec4(col, 0);
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

"use strict";

var canvas;
var gl;

var program;

var numvertices  = 168;

var flag = 1.0;
var flagtwo = 1.0;
var flagtexture = 1.0;

var texture1;

var pointsArray = [];
var normalsArray = [];
var texCoordsArray = [];
//var colorsArray = [];

var texCoord = [
    vec2(0.5,0.5),
    vec2(0, 0.33),
    vec2(0, 0.66),
    vec2(0.33, 1),
    vec2(0.66, 1),
    vec2(1, 0.66),
    vec2(1, 0.33),
    vec2(0.66, 0),
    vec2(0.33, 0),
    vec2(0, 0)
];

var near = 1.17;
var far = 12.0;
var radius = 5.0;
var theta = 60.0 * Math.PI/180.0;
var phi = 56.0 * Math.PI/180.0;

var  fovy = 42.0;
var  aspect;       // Viewport aspect ratio

var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;
var nMatrix, nMatrixLoc;

var eye;
const at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);

//global_abient_vector
var global_ambient_vector = vec4(1.0,1.0,1.0,1.0);

//direction light information
var lightPositiondirection = vec4(1.0, 0.0, 1.0, 0.0);
var lightAmbientdirection = vec4(0.1, 0.1, 0.1, 1.0);
var lightDiffusedirection = vec4(0.7, 0.7, 0.7, 1.0);
var lightSpeculardirection = vec4(1.0, 1.0, 1.0, 1.0); //USELESS USING TOON SHADING MODEL

//ruby material
var materialAmbient = vec4(0.1745, 0.01175, 0.01175, 1.0);
var materialDiffuse = vec4(0.61, 0.041, 0.041, 1.0);
var materialSpecular = vec4(0.72, 0.62, 0.62, 1.0);  //USELESS USING TOON SHADING MODEL
var materialShininess = 60.0;                     //USELESS USING TOON SHADING MODEL

//spotlight information
var lightPositionspot = vec4(0.0, 0.0, 1.0, 1.0 );
var spotAmbient = vec4(0.8, 0.8, 0.8, 1.0 );
var spotDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
var spotSpecular = vec4( 0.0, 1.0, 1.0, 1.0 ); //USELESS USING TOON SHADING MODEL
var lightDirection = vec4(0.0,0.0,12.0,1.0);
var limit=0.9949;


var vertices = [
    vec4( 0.0, 0.0,  1.0, 1.0 ),   //CENTRO FRONTE 0
    vec4( 0.0, -1.0, 0.0, 1.0),   //CENTRO SOTTO 1
    vec4( 0.0, 1.0, 0.0, 1.0),   //CENTRO SOPRA 2
    vec4( 0.0, 0.0, -1.0, 1.0),  //CENTRO DIETRO 3
    vec4( 1.0, 0.0, 0.0, 1.0), //CENTRO DESTRA 4
    vec4( -1.0, 0.0, 0.0, 1.0), //CENTRO SINISTRA 5

    vec4( -(Math.sqrt(2)-1), -1.0, 0.70, 1.0 ), //a - 6
    vec4(-0.70, -1.0, (Math.sqrt(2)-1), 1.0 ), //b - 7
    vec4(-0.70, -1.0, -(Math.sqrt(2)-1), 1.0 ), //c - 8
    vec4(-(Math.sqrt(2)-1), -1.0, -0.70, 1.0 ), //d - 9
    vec4((Math.sqrt(2)-1), -1.0, -0.70, 1.0 ), //e - 10
    vec4(0.70, -1.0, -(Math.sqrt(2)-1), 1.0 ), //f - 11
    vec4(0.70, -1.0, (Math.sqrt(2)-1), 1.0 ), //g - 12
    vec4( (Math.sqrt(2)-1), -1.0, 0.70, 1.0 ), //h - 13

    vec4( 1.0, -0.20, 1.0, 1.0 ), //j - 14
    vec4( 1.0, 0.70, 1.0, 1.0 ), //k - 15
    vec4( -1.0, -0.20, 1.0, 1.0 ), //l - 16
    vec4(-1.0, 0.70, 1.0, 1.0 ),  //m - 17
    vec4(-1.0, 0.70, -1.0, 1.0 ), //n - 18
    vec4(-1.0, -0.20, -1.0, 1.0 ), //o - 19
    vec4( 1.0, -0.20, -1.0, 1.0 ), //p - 20
    vec4( 1.0, 0.70, -1.0, 1.0 ), //q - 21

    vec4( -0.30, 1.0, 0.50, 1.0 ), //r - 22
    vec4(-0.50, 1.0, 0.30, 1.0 ), //s - 23
    vec4(-0.50, 1.0, -0.30, 1.0 ), //t - 24
    vec4(-0.30, 1.0, -0.50, 1.0 ), //u - 25
    vec4(0.30, 1.0, -0.50, 1.0 ), //v - 26
    vec4(0.50, 1.0, -0.30, 1.0 ), //w - 27
    vec4(0.50, 1.0, 0.30, 1.0 ), //x - 28
    vec4(0.30, 1.0, 0.50, 1.0 ) //y - 29

];



function ottagon(a, b, c, d, e, f, g, h, i, j) { //BUILD THE SIX OCTAGONS

    var t1 = subtract(vertices[b], vertices[a]);
    var t2 = subtract(vertices[c], vertices[a]);


    var normal = normalize(cross(t2,t1));
    normal = vec4(normal[0], normal[1], normal[2], 0.0);

     pointsArray.push(vertices[a]);
     normalsArray.push(normal);
     texCoordsArray.push(texCoord[0]);


     pointsArray.push(vertices[b]);
     normalsArray.push(normal);
     texCoordsArray.push(texCoord[1]);


     pointsArray.push(vertices[c]);
     normalsArray.push(normal);
     texCoordsArray.push(texCoord[2]);


     t1 = subtract(vertices[c], vertices[a]);
     t2 = subtract(vertices[d], vertices[a]);


     normal = normalize(cross(t2,t1));
     normal = vec4(normal[0], normal[1], normal[2], 0.0);

     pointsArray.push(vertices[a]);
     normalsArray.push(normal);
     texCoordsArray.push(texCoord[0]);


     pointsArray.push(vertices[c]);
     normalsArray.push(normal);
     texCoordsArray.push(texCoord[2]);


     pointsArray.push(vertices[d]);
     normalsArray.push(normal);
     texCoordsArray.push(texCoord[3]);


     t1 = subtract(vertices[d], vertices[a]);
     t2 = subtract(vertices[e], vertices[a]);


     normal = normalize(cross(t2,t1));
     normal = vec4(normal[0], normal[1], normal[2], 0.0);

     pointsArray.push(vertices[a]);
     normalsArray.push(normal);
     texCoordsArray.push(texCoord[0]);


     pointsArray.push(vertices[d]);
     normalsArray.push(normal);
     texCoordsArray.push(texCoord[3]);


     pointsArray.push(vertices[e]);
     normalsArray.push(normal);
     texCoordsArray.push(texCoord[4]);


     t1 = subtract(vertices[e], vertices[a]);
     t2 = subtract(vertices[f], vertices[a]);


     normal = normalize(cross(t2,t1));
     normal = vec4(normal[0], normal[1], normal[2], 0.0);

     pointsArray.push(vertices[a]);
     normalsArray.push(normal);
     texCoordsArray.push(texCoord[0]);


     pointsArray.push(vertices[e]);
     normalsArray.push(normal);
     texCoordsArray.push(texCoord[4]);


     pointsArray.push(vertices[f]);
     normalsArray.push(normal);
     texCoordsArray.push(texCoord[5]);


     t1 = subtract(vertices[f], vertices[a]);
     t2 = subtract(vertices[g], vertices[a]);


     normal = normalize(cross(t2,t1));
     normal = vec4(normal[0], normal[1], normal[2], 0.0);

     pointsArray.push(vertices[a]);
     normalsArray.push(normal);
     texCoordsArray.push(texCoord[0]);


     pointsArray.push(vertices[f]);
     normalsArray.push(normal);
     texCoordsArray.push(texCoord[5]);


     pointsArray.push(vertices[g]);
     normalsArray.push(normal);
     texCoordsArray.push(texCoord[6]);


     t1 = subtract(vertices[g], vertices[a]);
     t2 = subtract(vertices[h], vertices[a]);


     normal = normalize(cross(t2,t1));
     normal = vec4(normal[0], normal[1], normal[2], 0.0);

     pointsArray.push(vertices[a]);
     normalsArray.push(normal);
     texCoordsArray.push(texCoord[0]);


     pointsArray.push(vertices[g]);
     normalsArray.push(normal);
     texCoordsArray.push(texCoord[6]);


     pointsArray.push(vertices[h]);
     normalsArray.push(normal);
     texCoordsArray.push(texCoord[7]);


     t1 = subtract(vertices[h], vertices[a]);
     t2 = subtract(vertices[i], vertices[a]);


     normal = normalize(cross(t2,t1));
     normal = vec4(normal[0], normal[1], normal[2], 0.0);

     pointsArray.push(vertices[a]);
     normalsArray.push(normal);
     texCoordsArray.push(texCoord[0]);


     pointsArray.push(vertices[h]);
     normalsArray.push(normal);
     texCoordsArray.push(texCoord[7]);


     pointsArray.push(vertices[i]);
     normalsArray.push(normal);
     texCoordsArray.push(texCoord[8]);


     t1 = subtract(vertices[i], vertices[a]);
     t2 = subtract(vertices[j], vertices[a]);


     normal = normalize(cross(t2,t1));
     normal = vec4(normal[0], normal[1], normal[2], 0.0);

     pointsArray.push(vertices[a]);
     normalsArray.push(normal);
     texCoordsArray.push(texCoord[0]);


     pointsArray.push(vertices[i]);
     normalsArray.push(normal);
     texCoordsArray.push(texCoord[8]);


     pointsArray.push(vertices[j]);
     normalsArray.push(normal);
     texCoordsArray.push(texCoord[1]);

}


function triangle(a, b, c) {

    var trianglet1 = subtract(vertices[b], vertices[a]);
    var trianglet2 = subtract(vertices[c], vertices[a]);

    var normaltriangle = normalize(cross(trianglet1, trianglet2));

    normaltriangle = vec4(normaltriangle[0], normaltriangle[1], normaltriangle[2], 0.0);

    pointsArray.push(vertices[a]);
    normalsArray.push(normaltriangle);
    texCoordsArray.push(texCoord[1]);

    pointsArray.push(vertices[b]);
    normalsArray.push(normaltriangle);
    texCoordsArray.push(texCoord[8]);

    pointsArray.push(vertices[c]);
    normalsArray.push(normaltriangle);
    texCoordsArray.push(texCoord[9]);
}


function createShape()
{
    ottagon( 0, 6, 16, 17, 22, 29, 15, 14, 13, 6);     //center front - almrykjha
    ottagon( 1, 13, 12, 11, 10, 9, 8, 7, 6, 13 );      //center down - hgfedcba
    ottagon( 2, 22, 23, 24, 25, 26, 27, 28, 29, 22 );  //center up - rstuvwxyr
    ottagon( 3, 10, 20, 21, 26, 25, 18, 19, 9, 10 );   //center behind -epqvunod
    ottagon( 4, 12, 14, 15, 28, 27, 21, 20, 11, 12 );  //center right - gjkxwqpfg
    ottagon( 5, 8, 19, 18, 24, 23, 17, 16, 7, 8 );     //center left - contsmlbc


    triangle(7, 6, 16);
    triangle(9, 8, 19);
    triangle(11, 10, 20);
    triangle(13, 12, 14);
    triangle(22, 23, 17);
    triangle(24, 25, 18);
    triangle(26, 27, 21);
    triangle(28, 29, 15);

}


function configureTexture(image) {
    texture1 = gl.createTexture();
    gl.bindTexture( gl.TEXTURE_2D, texture1 );
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap( gl.TEXTURE_2D);
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,  gl.NEAREST_MIPMAP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

  }


window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );

    gl = canvas.getContext('webgl2');
    if (!gl) alert("WebGL 2.0 isn't available" );

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );


    aspect =  canvas.width/canvas.height;

    gl.enable(gl.DEPTH_TEST);


    //  Load shaders and initialize attribute buffers
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );


    var ambientProductspot = mult(spotAmbient, materialAmbient);
    var diffuseProductspot = mult(spotDiffuse, materialDiffuse);
    //var specularProductspot = mult(spotSpecular, materialSpecular); USELESS USING TOON SHADING MODEL

    var ambientProductdir = mult(lightAmbientdirection, materialAmbient);
    var diffuseProductdir = mult(lightDiffusedirection, materialDiffuse);
    //var specularProductdir = mult(lightSpeculardirection, materialSpecular); USELESS USING TOON SHADING MODEL

    var global_ambient = mult(global_ambient_vector, materialAmbient); //global light coefficient ag x am


    createShape(); //CREATE THE FIGURE


    var nBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW);

    var normalLoc = gl.getAttribLocation(program, "aNormal");
    gl.vertexAttribPointer(normalLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(normalLoc);



    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "aPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );



    var tBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW );

    var vTexCoord = gl.getAttribLocation( program, "vTexCoord" );
    gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vTexCoord );


    modelViewMatrixLoc = gl.getUniformLocation(program, "uModelViewMatrix");
    projectionMatrixLoc = gl.getUniformLocation(program, "uProjectionMatrix");
    nMatrixLoc = gl.getUniformLocation(program, "uNormalMatrix");

    gl.activeTexture( gl.TEXTURE0 );
    gl.bindTexture( gl.TEXTURE_2D, texture1 );
    gl.uniform1i(gl.getUniformLocation( program, "Tex0"), 0);



     document.getElementById("Button1").onclick = function(){near  *= 1.05; far *= 1.05;};
     document.getElementById("Button2").onclick = function(){near *= 0.95; far *= 0.95;};


     document.getElementById("RadiusSlider").oninput = function() {  radius = this.valueAsNumber;
          document.getElementById('labelRadius').innerHTML = " " + this.valueAsNumber;  };

     document.getElementById("thetaSlider").oninput = function() {theta = this.valueAsNumber*Math.PI/180.0;
          document.getElementById('labelTheta').innerHTML = " " + this.valueAsNumber;  };

     document.getElementById("phiSlider").oninput = function() {  phi = this.valueAsNumber* Math.PI/180.0;
          document.getElementById('labelPhi').innerHTML = " " + this.valueAsNumber;};


      document.getElementById("spotlightonoff").onclick = function(){
        if (this.textContent == "Turn Off"){  this.textContent = "Turn On";   flag = 0.0;}
        else {this.textContent = "Turn Off";   flag = 1.0;}
      };

      document.getElementById("directiononoff").onclick = function(){
        if (this.textContent == "Turn Off"){  this.textContent = "Turn On";   flagtwo = 0.0;}
        else {this.textContent = "Turn Off";   flagtwo = 1.0;}
      };


      document.getElementById("limit").oninput = function(){limit = (this.valueAsNumber);};
      document.getElementById("spotX").oninput = function(){lightDirection[0] = (this.valueAsNumber)};
      document.getElementById("spotY").oninput = function(){lightDirection[1] = (this.valueAsNumber)};
      document.getElementById("spotZ").oninput = function(){lightDirection[2] = (this.valueAsNumber)};
      document.getElementById("dirX").oninput = function(){lightPositiondirection[0] = (this.valueAsNumber)};
      document.getElementById("dirY").oninput = function(){lightPositiondirection[1] = (this.valueAsNumber)};
      document.getElementById("dirZ").oninput = function(){lightPositiondirection[2] = (this.valueAsNumber)};


    var image1 = document.getElementById("Image1");
    configureTexture(image1);


    document.getElementById("textureonoff").onclick = function(){
      if (this.textContent == "Turn Off"){  this.textContent = "Turn On";   flagtexture = 0.0;}

      else {this.textContent = "Turn Off";   flagtexture = 1.0;}
     };

    gl.uniform4fv( gl.getUniformLocation(program, "uAmbientProductspot"),flatten(ambientProductspot));
    gl.uniform4fv( gl.getUniformLocation(program, "uDiffuseProductspot"),flatten(diffuseProductspot));
    //gl.uniform4fv( gl.getUniformLocation(program, "uSpecularProductspot"),flatten(specularProductspot)); USELESS USING TOON SHADING MODEL
    gl.uniform4fv( gl.getUniformLocation(program, "uAmbientProductdir"),flatten(ambientProductdir));
    gl.uniform4fv( gl.getUniformLocation(program, "uDiffuseProductdir"),flatten(diffuseProductdir));
    //gl.uniform4fv( gl.getUniformLocation(program, "uSpecularProductdir"),flatten(specularProductdir)); USELESS USING TOON SHADING MODEL
    gl.uniform4fv( gl.getUniformLocation(program, "uglobalambient"),flatten(global_ambient));
    //gl.uniform1f( gl.getUniformLocation(program, "uShininess"),materialShininess); USELESS USING TOON SHADING MODEL


    render();
}


var render = function() {
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.uniform4fv( gl.getUniformLocation(program, "uLightPositionspot"),flatten(lightPositionspot));
    gl.uniform4fv( gl.getUniformLocation(program, "uLightPositiondirection"),flatten(lightPositiondirection));
    gl.uniform4fv( gl.getUniformLocation(program, "uDirection"),flatten(lightDirection));
    gl.uniform1f( gl.getUniformLocation(program, "ulimit"),limit);
    gl.uniform1f( gl.getUniformLocation(program, "flag"),flag);
    gl.uniform1f( gl.getUniformLocation(program, "flagtwo"),flagtwo);
    gl.uniform1f( gl.getUniformLocation(program, "flagtexture"),flagtexture);

    eye = vec3(radius*Math.sin(theta)*Math.cos(phi), radius*Math.sin(theta)*Math.sin(phi), radius*Math.cos(theta));
    modelViewMatrix = lookAt(eye, at , up);
    projectionMatrix = perspective(fovy, aspect, near, far);
    nMatrix = normalMatrix(modelViewMatrix, true);

    gl.clearColor(0.2274, 0.305, 0.4313, 1.0);

    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
    gl.uniformMatrix3fv(nMatrixLoc, false, flatten(nMatrix)  );

    gl.drawArrays( gl.TRIANGLES, 0, numvertices);

    requestAnimationFrame(render);
}

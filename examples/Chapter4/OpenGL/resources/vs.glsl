/*
   Ultimate Game Engine Design and Architecture
   Allen Sherrod
*/


varying vec4 texCoords;


void main()
{
   gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;
   texCoords = gl_MultiTexCoord0;
   
}
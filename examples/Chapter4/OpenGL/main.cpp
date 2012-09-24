/*
   OpenGL Demo - Chapter 4
   Ultimate Game Engine Design and Architecture
   Created by Allen Sherrod
*/


#include"main.h"
#include<OBJLoader.h>

// Rendering System.
bbe::OpenGLRenderer g_Render;

// Main model object.
bbe::ModelData g_model;

// Decals.
bbe::BB_TEXTURE g_tex;

// Shader.
bbe::ShaderHandle g_shader;

// Shader parameters.
bbe::ParameterHandle g_mvpParam;
bbe::ParameterHandle g_decalParam;

// Scene rotations.
int g_xRot = 0, g_oldXRot = 0;
int g_yRot = 0, g_oldYRot = 0;

// Flag used to quit.
bool g_quitDemo = false;


void DemoResize(int width, int height)
{
   g_Render.SetViewPort(0, 0, width, height);
   g_Render.ResizeWindow(45.0f, 0.1f, 1000, width, height);
}


bool DemoInitialize(bbe::RenderParams &params)
{
   bool result = false;

   params.m_colorBits = 24;
   params.m_depthBits = 16;
   params.m_stencilBits = 8;
   params.m_fullscreen = WINDOW_FULLSCREEN;
   params.m_height = WINDOW_HEIGHT;
   params.m_width = WINDOW_WIDTH;
   params.m_maxCacheBytes = 2000;
   params.m_maxCacheIndices = 2000;

   if(g_Render.Initialize(&params) != BB_SUCCESS)
      return false;

   DemoResize(WINDOW_WIDTH, WINDOW_HEIGHT);

   g_Render.SetClearColor(0, 0, 0, 255);
   g_Render.Enable(BB_DEPTH_TESTING);
   g_Render.Enable(BB_SMOOTH_SHADING);
   g_Render.Enable(BB_TEXTURE_2D);

   result = CreateOBJMesh("resources/TexturedBox.obj", &g_model);

   if(result == false)
      return false;

   std::vector<BB_FILTER_TYPE> filters;
   filters.push_back(BB_MIN_LINEAR_FILTER);
   filters.push_back(BB_MAG_LINEAR_FILTER);
   filters.push_back(BB_MIP_LINEAR_FILTER);
   filters.push_back(BB_USE_ANSIO_FILTER);

   result = g_Render.LoadTexFromFile("resources/decal.tga",
                                     BB_TEX2D_TYPE, &g_tex);

   g_Render.ApplyFilters(g_tex, &filters);

   if(result == false)
      return false;

   result = g_Render.CreateShaderFromFile("resources/vs.glsl",
                                          "resources/ps.glsl",
                                          &g_shader);

   if(result == false)
      return false;

   g_Render.SetupShaderParameter("mvp", g_shader, &g_mvpParam);
   g_Render.SetupShaderParameter("decal", g_shader, &g_decalParam);

   return true;
}


void DemoUpdate()
{
   int mouseX = 0, mouseY = 0;

   bbe::GetMousePosition(&mouseX, &mouseY);

   if(bbe::isButtonDown(BB_BUTTON_ESCAPE))
      g_quitDemo = true;

   if(bbe::isButtonDown(BB_BUTTON_MOUSE_LEFT))
		{
         g_xRot -= (mouseX - g_oldXRot);
			g_yRot -= (mouseY - g_oldYRot);
		}

	g_oldXRot = mouseX;
	g_oldYRot = mouseY;
}


void DemoRender()
{
   g_Render.StartRendering(1, 1, 0);
   g_Render.LoadIdentityMatrix();

   g_Render.SetView(0, 0, 4, 0, 0, 0, 0, 1, 0);
   g_Render.RotateMatrix((float)g_xRot, 0, 1, 0);
   g_Render.RotateMatrix((float)g_yRot, 1, 0, 0);

   g_Render.ApplyShader(g_shader);

   g_Render.SetShaderParameter1f(g_decalParam, 0);

   g_Render.ApplyTexture(0, g_tex);

   g_Render.Render(BB_RENDER_MODEL_DATA_PARAMS(g_model));

	g_Render.EndRendering();
}


void DemoShutdown()
{
   g_Render.Shutdown();
}

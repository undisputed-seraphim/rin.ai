/*
   Gravity Physics with Point Masses Demo - Chapter 6
   Ultimate Game Engine Design and Architecture
   Created by Allen Sherrod
*/


#include"main.h"
#include<BBShapes.h>
#include<DynamicModel.h>
#include<ResourceManager.h>
#include<GeometryNode.h>
#include<SceneGraph.h>
#include<TextureMapEffect.h>
#include<PointMass.h>
#include<Timer.h>
#include<PhysicsSpace.h>


// Models to be displayed.
bbe::DynamicModel g_object, g_ground;

// Object's Physics informaiton.
bbe::PointMass g_objMass;

// Physical space in which the object lives.
bbe::PhysicsSpace g_3dSpace;

// Time values for real time simulation.
float g_lastTime = 0, g_currentTime = 0;

// Resource managers.
BB_MODEL_RESOURCE_MANAGER g_modelManager(32);
BB_EFFECT_RESOURCE_MANAGER g_effectManager(32);

// Scene graph.
bbe::SceneGraph g_sceneGraph;

// Scene rotations.
int g_xRot = 0, g_oldXRot = 0;
int g_yRot = 0, g_oldYRot = 0;

// Rendering System.
bbe::OpenGLRenderer g_Render;

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


   // Create meshes.
   bbe::ModelData *objectMesh = new bbe::ModelData();

   if(objectMesh == NULL)
      return false;

   result = bbe::CreateCubeMesh(5, objectMesh);

   if(result == false)
      return false;

   bbe::ModelData *groundMesh = new bbe::ModelData();

   if(groundMesh == NULL)
      return false;

   result = bbe::CreateXZPlaneMesh(50, groundMesh);

   if(result == false)
      return false;


   // Load textures and effects.
   std::vector<BB_FILTER_TYPE> filters;
   filters.push_back(BB_MIN_LINEAR_FILTER);
   filters.push_back(BB_MAG_LINEAR_FILTER);

   bbe::Effect *effect = NULL;

   effect = new bbe::TextureShader("resources/vs.glsl",
      "resources/ps.glsl", "resources/decal.tga", &filters,
      static_cast<bbe::RenderInterface*>(&g_Render));

   if(effect == NULL)
      return false;


   // Resource manage objects.
   bbe::Handle<bbe::ModelResourceTag> modelHandle;
   bbe::Handle<bbe::EffectResourceTag> effectHandle;

   g_modelManager.Create(new bbe::ModelResource(objectMesh),
      "CUBE MODEL", &modelHandle);

   g_object.SetModelHandle(modelHandle);

   g_modelManager.Create(new bbe::ModelResource(groundMesh),
      "GROUND MODEL", &modelHandle);

   g_ground.SetModelHandle(modelHandle);

   g_effectManager.Create(new bbe::EffectResource(effect),
      "TEXTURE MAPPING", &effectHandle);

   g_object.SetEffectHandle(effectHandle);

   // Copy handle to the same resource for the ground.
   g_ground.SetEffectHandle(effectHandle);


   // Scene graph.
   bbe::GeometryNode *objectNode = NULL, *groundNode = NULL;

   objectNode = new bbe::GeometryNode(&g_object,
      &g_modelManager, &g_effectManager,
      static_cast<bbe::RenderInterface*>(&g_Render));

   if(objectNode == NULL)
      return false;

   groundNode = new bbe::GeometryNode(&g_ground,
      &g_modelManager, &g_effectManager,
      static_cast<bbe::RenderInterface*>(&g_Render));

   if(groundNode == NULL)
      return false;

   g_sceneGraph.AddNode(objectNode);
   g_sceneGraph.AddNode(groundNode);


   // Physics initialize.
   g_objMass.SetPosition(bbe::Vector3D(0, 50, 0));
   g_objMass.SetMass(1);

   g_3dSpace.SetGravity(bbe::Vector3D(0.0f, -9.81f, 0.0f));

   g_lastTime = bbe::GetTimeSeconds();

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


   g_currentTime = bbe::GetTimeSeconds();
   float dt = g_currentTime - g_lastTime;

   bbe::Vector3D pos = g_objMass.GetPosition();

   // Fake collision against the ground.
   if(pos.y > 5.3f)
      g_3dSpace.InfluenceObject(&g_objMass, 1);
   else
      g_objMass.SetVelocity(bbe::PhysicsVec(0, 0, 0));

   g_objMass.Update(dt);
   g_object.SetTransformation(g_objMass.GetTransformation());

   g_lastTime = bbe::GetTimeSeconds();
}


void DemoRender()
{
	g_Render.StartRendering(1, 1, 0);
   g_Render.LoadIdentityMatrix();

   g_Render.SetView(0, 50, 200, 0, 0, 0, 0, 1, 0);
   g_Render.RotateMatrix((float)g_xRot, 0, 1, 0);
   g_Render.RotateMatrix((float)g_yRot, 1, 0, 0);

   g_sceneGraph.Process();

	g_Render.EndRendering();
}


void DemoShutdown()
{
   g_Render.Shutdown();

   g_effectManager.Release(g_object.GetEffectHandle());
   g_modelManager.Release(g_object.GetModelHandle());

   g_effectManager.Release(g_ground.GetEffectHandle());
   g_modelManager.Release(g_ground.GetModelHandle());

   g_sceneGraph.Release();
}
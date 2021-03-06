/*
   Building Blocks Engine
   Ultimate Game Engine Design and Architecture (2006)
   Created by Allen Sherrod
*/


#ifndef _BB_DEFINES_H_
#define _BB_DEFINES_H_


// File Related Defines.
enum BB_FILE_TYPE { BB_TEXT_FILE = 1, BB_BINARY_FILE };

enum BB_ENDIAN_TYPE { BB_ENDIAN_UNKNOWN = 0, BB_ENDIAN_LITTLE,
                      BB_ENDIAN_BIG, BB_ENDIAN_MIDDLE };


// Math defines, constants, etc.
typedef float scalar;
#define PI_CONST  3.14159265358979323846

#define BB_NULL_FLOAT   1.0E20f

#define DEG_TO_RAD(angle)  (angle * PI_CONST / 180)
#define RAD_TO_DEG(radian) (radian * 180 / PI_CONST)

enum BB_COORDINATE_TYPE { BB_LEFT_HANDED = 1, BB_RIGHT_HANDED };

enum BB_PLANE_STATUS { BB_PLANE_FRONT = 1, BB_PLANE_BACK, BB_PLANE_ON_PLANE,
                       BB_PLANE_CLIPPED, BB_PLANE_CULLED, BB_PLANE_VISIBLE };

#define BB_MIN(a, b) (a < b ? a : b)

#define SIGN(a) (a < 0.0f) ? -1.0f : 1.0f

#define BB_MAX_CLIPPING_VERTS 64


// Resource manager defines.
#define BB_NULL_HANDLE  -1


// General defines, etc.
enum BRESULT { BB_FAIL = 0, BB_SUCCESS, BB_VERTEX_SHADER_FAIL,
               BB_PIXEL_SHADER_FAIL, BB_SHADER_FAIL,
               BB_PARAMETERS_FAIL, BB_DEVICE_FAIL };

typedef char BSTATE;
#define BB_TRUE   1
#define BB_FALSE  0


// Networking defines, etc.
enum BB_NETWORK_MESSAGE_TYPE { BB_MESSAGE_SERVER_DISCONNECT = 0,
                               BB_MESSAGE_CLIENT_DISCONNECT,
                               BB_MESSAGE_FORCE_DISCONNECT,
                               BB_MESSAGE_CONNECT_ACCEPTED,
                               BB_MESSAGE_SEND_ERROR,
                               BB_MESSAGE_RESPOND_REQUIRE,
                               BB_MESSAGE_RESPOND_OK };

enum BB_NETWORK_TYPE { BB_NETWORK_NULL = 0, BB_NETWORK_SERVER, BB_NETWORK_CLIENT };

enum BNETWORKRESULT { BB_NO_DATA = 0, BB_DATA_FAIL, BB_PARTIAL_DATA,
                      BB_DATA_SUCCESS };

typedef char BPACKETVALUE;

#define BB_MAX_PACKET_SIZE 256

#define BB_NETWORK_CALLBACK(a) void(*a)(int u, int t, char *d, int s)

#define BB_NETWORK_SYSTEM_USAGE 0


// Defines, enums, etc dealing with RENDERING.
enum BB_RENDER_STATE { BB_DEPTH_TESTING = 1, BB_SMOOTH_SHADING,
                       BB_TEXTURE_2D, BB_TEXTURE_CUBE, BB_ALPHA_TESTING,
                       BB_BACK_CCW_CULLING, BB_BACK_CW_CULLING,
                       BB_FRONT_CCW_CULLING, BB_FRONT_CW_CULLING,
                       BB_TOTAL_RENDER_STATES };

enum BB_ALPHA_STATE { BB_ALPHA_LESS = 1, BB_ALPHA_GREATER };

enum BB_FILTER_TYPE { BB_NO_FILTER = 0, BB_MIN_POINT_FILTER, BB_MAG_POINT_FILTER, BB_MIP_POINT_FILTER,
                      BB_MIN_LINEAR_FILTER, BB_MAG_LINEAR_FILTER, BB_MIP_LINEAR_FILTER,
                      BB_USE_ANSIO_FILTER, BB_S_REPEAT_FILTER, BB_T_REPEAT_FILTER,
                      BB_R_REPEAT_FILTER, BB_S_CLAMP_FILTER, BB_T_CLAMP_FILTER,
                      BB_R_CLAMP_FILTER, BB_S_EDGE_CLAMP_FILTER,
                      BB_T_EDGE_CLAMP_FILTER, BB_R_EDGE_CLAMP_FILTER };

enum BB_TEXTURE_TYPE { BB_TEX2D_TYPE = 1, BB_CUBE_TYPE };

enum BB_TEXTURE_FORMAT { BB_TEX_UNSIGNED_BYTE = 1, BB_TEX_FLOAT };

#define BB_MAX_TEXTURES 16

enum BB_MATRIX_TYPE { BB_PROJECTION_MATRIX = 1, BB_MODELVIEW_MATRIX,
                      BB_TEXTURE_MATRIX, BB_MVP_MATRIX };

enum BB_MATRIX_FORMAT { BB_IDENTITY_MATRIX = 1, BB_TRANSPOSE_MATRIX,
                        BB_INVERSE_MATRIX, BB_INVERSE_TRANSPOSE_MATRIX };

enum BB_PROJECTION_TYPE { BB_PROJECTION_NULL = 0,
                          BB_PERSPECTIVE_TYPE, BB_ORTHO_TYPE };

enum BB_ELEMENT_TYPE { BB_ELEMENT_TYPE_NULL = 0, BB_ELEMENT_TYPE_IGNORE_2F,
                       BB_ELEMENT_TYPE_IGNORE_3F, BB_ELEMENT_TYPE_VERTEX_3F,
                       BB_ELEMENT_TYPE_NORMAL_3F, BB_ELEMENT_TYPE_COLOR_3F,
                       BB_ELEMENT_TYPE_TEX1_2F, BB_ELEMENT_TYPE_TEX2_2F,
                       BB_ELEMENT_TYPE_TEX3_2F, BB_ELEMENT_TYPE_TEX4_2F,
                       BB_ELEMENT_TYPE_TEX5_2F, BB_ELEMENT_TYPE_TEX6_2F,
                       BB_ELEMENT_TYPE_TEX7_2F, BB_ELEMENT_TYPE_TEX8_2F,
                       BB_ELEMENT_TYPE_TEX1_3F, BB_ELEMENT_TYPE_TEX2_3F,
                       BB_ELEMENT_TYPE_TEX3_3F, BB_ELEMENT_TYPE_TEX4_3F,
                       BB_ELEMENT_TYPE_TEX5_3F, BB_ELEMENT_TYPE_TEX6_3F,
                       BB_ELEMENT_TYPE_TEX7_3F, BB_ELEMENT_TYPE_TEX8_3F };

enum BB_PRIMITIVE_TYPE { BB_PRIMITIVE_NULL = 0, BB_PRIMITIVE_POINT_LIST,
                         BB_PRIMITIVE_TRI_LIST, BB_PRIMITIVE_TRI_STRIP,
                         BB_PRIMITIVE_LINE_LIST, BB_PRIMITIVE_LINE_STRIP };

enum BB_SHADER_TYPE { BB_VERTEX_SHADER = 1, BB_PIXEL_SHADER };

#define BB_MAX_LOD         3

#define BB_FILTER_LIST     std::vector<BB_FILTER_TYPE>
#define BB_FILTER_LIST_PTR BB_FILTER_LIST*

enum BB_OCTREE_NODE_ID
{
   TOP_FRONT_LEFT = 0, TOP_FRONT_RIGHT,
   TOP_BACK_LEFT, TOP_BACK_RIGHT,
   BOTTOM_FRONT_LEFT, BOTTOM_FRONT_RIGHT,
   BOTTOM_BACK_LEFT, BOTTOM_BACK_RIGHT
};


// Defines, enums, etc dealing with INPUT.
#define BB_KEYBOARD_KEY_NUM   256

enum BB_INPUT_BUTTON { BB_BUTTON_LEFT_SHOULDER = 1, BB_BUTTON_RIGHT_SHOULDER,
   BB_BUTTON_LEFT_TRIGGER, BB_BUTTON_RIGHT_TRIGGER, BB_BUTTON_LEFT_THUMB,
   BB_BUTTON_RIGHT_THUMB, BB_BUTTON_START, BB_BUTTON_BACK, BB_BUTTON_ARROW_UP,
   BB_BUTTON_ARROW_DOWN, BB_BUTTON_ARROW_LEFT, BB_BUTTON_ARROW_RIGHT,
   BB_BUTTON_A, BB_BUTTON_B, BB_BUTTON_X,  BB_BUTTON_Y, BB_BUTTON_MOUSE_LEFT,
   BB_BUTTON_MOUSE_RIGHT, BB_BUTTON_0, BB_BUTTON_1, BB_BUTTON_2, BB_BUTTON_3,
   BB_BUTTON_4, BB_BUTTON_5, BB_BUTTON_6, BB_BUTTON_7, BB_BUTTON_8, BB_BUTTON_9,
   /*BB_BUTTON_A, BB_BUTTON_B,*/ BB_BUTTON_C, BB_BUTTON_D, BB_BUTTON_E, BB_BUTTON_F,
   BB_BUTTON_G, BB_BUTTON_H, BB_BUTTON_I, BB_BUTTON_J, BB_BUTTON_K, BB_BUTTON_L,
   BB_BUTTON_M, BB_BUTTON_N, BB_BUTTON_O, BB_BUTTON_P, BB_BUTTON_Q, BB_BUTTON_R,
   BB_BUTTON_S, BB_BUTTON_T, BB_BUTTON_U, BB_BUTTON_V, BB_BUTTON_W, /*BB_BUTTON_X,
   BB_BUTTON_Y,*/ BB_BUTTON_Z, BB_BUTTON_ESCAPE, BB_BUTTON_SPACE,
   BB_BUTTON_ENTER, BB_TOTAL_BUTTONS };

#define BB_X360_DEADZONE (0.24 * FLOAT(0x7FFF))
#define BB_X360_DEADZONE_CHECK(stickX, stickY, val) if((stickX < val && \
   stickX > -val) && (stickY < val && stickY > -val)) \
   { stickX = 0; stickY = 0; }

#endif
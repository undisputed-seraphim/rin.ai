/* rin.ai engine, file handler and implementation */
#ifndef rin_MESH_H
#define rin_MESH_H

#include <iostream>
#include <vector>

using namespace std;

class Mesh {
private:
    std::string name;
    vector<float> vba;
    vector<float> iba;
public:
    Mesh( std::string name );
    void addVertex( float v1, float v2, float v3 );
};

Mesh::Mesh( std::string name ) {
    name = name;
    cout << "Mesh " << name << " created." << endl;
}

void Mesh::addVertex( float v1, float v2, float v3 ) {
    vba.push_back( v1 );
    vba.push_back( v2 );
    vba.push_back( v3 );
}

#endif

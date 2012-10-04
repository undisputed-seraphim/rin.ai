/* rin.ai engine, DAEModel handler and implementation */
#ifndef rin_DAEMODEL_H
#define rin_DAEMODEL_H

#include "mesh.h"

#include <iostream>

/* helper classes for oganization of DAEModel */
class Source {
public:
    std::string id;
    std::string type;
    
    std::string s_array[];
    int i_array[];
    float f_array[];
    
    Source( std::string i ) { id = i; }
};

class DAEModel {
private:
    std::string name;
    std::vector<std::string, Source> *sources;
    Mesh *mesh;
public:
    DAEModel( std::string n );
    bool parse( std::string data );
};

std::vector<std::string> &split( const std::string &s, std::vector<std::string> &elems ) {
    std::stringstream ss( s + ' ' );
    std::string item;
    while( std::getline( ss, item ) ) {
        elems.push_back( item );
    }
    return elems;
}

DAEModel::DAEModel( std::string n ) {
    name = n;
    mesh = new Mesh( name );
    std::cout << "DAEModel " << name << " created." << std::endl;
}

bool DAEModel::parse( std::string data ) {
    std::vector<std::string> full;
    split( data, full );
    std::cout << "DAEModel " << name << " read in at " << full.size() << " lines." << std::endl;
}

#endif

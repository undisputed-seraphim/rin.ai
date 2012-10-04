/* rin.ai engine, file handler and implementation */
#ifndef rin_FILE_H
#define rin_FILE_H

#include <iostream>
#include <fstream>
#include <string>
#include <sstream>

class r_file {
public:
    r_file();
    std::string load( const char *fname );
};

r_file::r_file() { }
std::string r_file::load( const char *fname ) {
	std::ifstream file( fname );
	if(!file.is_open()) {
		std::cout << "Unable to open file " << fname << std::endl;
	}

	std::stringstream fileData;
	fileData << file.rdbuf();
	file.close();

	return fileData.str();
}

/* global file handler */
r_file *file = new r_file();

#endif

/*
    :copyright: 2011 by Florian Boesch <pyalot@gmail.com>.
    :license: GNU AGPL3, see LICENSE for more details.
*/
#include <math.h>
#include <stdio.h>

#define get(x,y) heightfield[clamp(x, size)+clamp(y, size)*size]

int clamp(int v, int max){
    if(v<0){
        return 0;
    }
    else if(v > (max-1)){
        return max-1;
    }
    else{
        return v;
    }
}

float interpolate(float v0, float v1, float v2, float v3, float x){
    return (
        pow(x, 0) * v1 +
        pow(x, 1) * (-0.5*v0 + 0.5*v2) +
        pow(x, 2) * (v0 - 2.5*v1 + 2.0*v2 - 0.5*v3) +
        pow(x, 3) * (-0.5*v0 + 1.5*v1 - 1.5*v2 + 0.5*v3)
    );
}


float get_height(float* heightfield, int size, float xi, float yi){
    float h0, h1, h2, h3, v0, v1, v2, v3, xf, yf;
    int x, y;

    xi = xi*(size-1.0);
    yi = yi*(size-1.0);
        
    x = (int)xi;
    y = (int)yi;
    
    xf = xi-x;
    yf = yi-y;
        
    h0 = get(x-1, y-1);
    h1 = get(x+0, y-1);
    h2 = get(x+1, y-1);
    h3 = get(x+2, y-1);
    v0 = interpolate(h0, h1, h2, h3, xf);
    
    h0 = get(x-1, y+0);
    h1 = get(x+0, y+0);
    h2 = get(x+1, y+0);
    h3 = get(x+2, y+0);
    v1 = interpolate(h0, h1, h2, h3, xf);
    
    h0 = get(x-1, y+1);
    h1 = get(x+0, y+1);
    h2 = get(x+1, y+1);
    h3 = get(x+2, y+1);
    v2 = interpolate(h0, h1, h2, h3, xf);
    
    h0 = get(x-1, y+2);
    h1 = get(x+0, y+2);
    h2 = get(x+1, y+2);
    h3 = get(x+2, y+2);
    v3 = interpolate(h0, h1, h2, h3, xf);
    
    return interpolate(v0, v1, v2, v3, yf);
}

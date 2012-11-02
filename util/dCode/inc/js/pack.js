/*
HEADER
------

 The first 16 bytes is the PSSG header. It has the following structure:
 
 PSSG (4 bytes)
 PSSG chunksize (4 bytes)
 number of parameters + 1 (4 bytes)
 number of properties (4 bytes)
 
 A parameter represents a node in the PSSG scenegraph. For example, the first
 parameter is usually a PSSGDATABASE.
 
 Each parameter may have 0 to N properties. For example, the PSSGDATABASE
 parameter typically has the following properties:
   creator
   creationMachine
   creationDate
   scale
   up
   
PARAMETER LIST
--------------

 Following the header is a list of parameters and properties. The number of
 parameters to read is specified in the header. Each parameter has the
 following structure.
 
 parameter index       (4 bytes)
 parameter name length (4 bytes)
 parameter name        (parameter name length bytes)
 number of properties  (4 bytes)
 for(i = 0; i < number of properties; i++) {
     property index       (4 bytes)
     property name length (4 bytes)
     property name        (property name length bytes)
    }
	
CHUNK LIST
----------

 following the parameter list is chunk data, as follows:
 
 chunks index		4 bytes
 chunk size			4 bytes
 property bytes		4 bytes
 
while(amount up to property bytes not yet consumed) {
	property index		4 bytes
	property type		4 bytes
	  types:
		12	- float3 {
			f[0]	4 bytes
			f[1]	4 bytes
			f[2]	4 bytes
		}
		default {
			property length		4 bytes
			property data		length * bytes
		}
}
 
PSSGDATABASE
------------

 parameter index   (4 bytes)
 chunksize         (4 bytes)
 property bytes    (4 bytes)
 property data     (property bytes)
 list of subchunks

DATABLOCK
---------

 Properties:
  uint32 streamCount        (number of DATASTREAM nodes, usually 1)
  uint32 size               (size of data in DATABLOCKDATA)
  elementCount              (number of items, i.e. number of vertices)
  uint32 allocationStrategy (not important)
  string id                 (identifier)

 Notes:
  Even though there is a streamCount parameter, in every case I've seen so far,
  streamCount is always 1 and a DATABLOCK always contains 1 DATABLOCKSTREAM as
  the first child followed by 1 DATABLOCKDATA as the next child.
  
  In a LIBRARY node, if there are 6 data blocks,

 DATABLOCK
  * DATABLOCKSTREAM
  * DATABLOCKDATA

DATABLOCKSTREAM
---------------

 string renderType (indicates type of vertex map, UV, normal, position)
 string dataType   (float2, float3, half2, etc.)
 uint32 offset
 uint32 stride

RENDERDATASOURCE
----------------

 Properties:
  uint32	streamCount;
  string	primitive;
  string	id;
 
 Notes:
  The first RENDERDATASOURCE has streamCount + 1 children, with the first child
  being a RENDERINDEXSOURCE followed by streamCount RENDERSTREAM nodes. Following
  RENDERDATASOURCE nodes have streamCount nodes, with no RENDERINDEXSOURCE node.
	
 RENDERDATASOURCE
  * RENDERINDEXSOURCE
  * RENDERSTREAM
  * RENDERSTREAM
  * RENDERSTREAM
  * ...
 RENDERDATASOURCE
  * RENDERSTREAM
  * RENDERSTREAM
  * RENDERSTREAM
  * ...
 RENDERDATASOURCE
  * RENDERSTREAM
  * RENDERSTREAM
  * RENDERSTREAM
  * ...
  
RENDERINDEXSOURCE
-----------------

 Properties:
  string	primitive;
  string	format;
  uint32	count;
  uint32	maximumIndex;
  uint32	allocationStrategy;
  string	id;
  uint32	size;
  
 RENDERINDEXSOURCE
  * INDEXSOURCEDATA

RENDERSTREAM
------------

 Description:
  RENDERSTREAM nodes determine which vertex buffers are to be used. For example:

  RENDERINDEXSOURCE
   * INDEXSOURCEDATA
   * RENDERSTREAM (references xyz buffer)
   * RENDERSTREAM (references normal xyz buffer)
   * RENDERSTREAM (references uv buffer)

 Properties:
  string    dataBlock;
  uint32    subStream;
  string    id;
 
 Heirarchy:
  RENDERSTREAM
   * no children
  
INDEXSOURCEDATA
---------------

 Properties:
  void*    data;
  
 INDEXSOURCEDATA
  * no children
*/

function pack (format, args) {
  // http://kevin.vanzonneveld.net
  // +   original by: Tim de Koning (http://www.kingsquare.nl)
  // +      parts by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
  // +   bugfixed by: Tim de Koning (http://www.kingsquare.nl)
  // %        note 1: Float encoding by: Jonas Raoni Soares Silva
  // %        note 2: Home: http://www.kingsquare.nl/blog/12-12-2009/13507444
  // %        note 3: Feedback: phpjs-pack@kingsquare.nl
  // %        note 4: 'machine dependent byte order and size' aren't
  // %        note 4: applicable for JavaScript; pack works as on a 32bit,
  // %        note 4: little endian machine
  // *     example 1: pack('nvc*', 0x1234, 0x5678, 65, 66);
  // *     returns 1: '4xVAB'
  var formatPointer = 0,
    argumentPointer = 1,
    result = '',
    argument = '',
    i = 0,
    r = [],
    instruction, quantifier, word, precisionBits, exponentBits, extraNullCount;
	
	if( typeof arguments[1] == "object" ) {
		if( typeof args[0] == "object" ) {
			args[0].unshift( format );
			arguments = args[0];
		} else {
			args.unshift( format );
			arguments = args;
		}
	}

  // vars used by float encoding
  var bias, minExp, maxExp, minUnnormExp, status, exp, len, bin, signal, n, intPart, floatPart, lastBit, rounded, j, k, tmpResult;

  while (formatPointer < format.length) {
    instruction = format.charAt(formatPointer);
    quantifier = '';
    formatPointer++;
    while ((formatPointer < format.length) && (format.charAt(formatPointer).match(/[\d\*]/) !== null)) {
      quantifier += format.charAt(formatPointer);
      formatPointer++;
    }
    if (quantifier === '') {
      quantifier = '1';
    }

    // Now pack variables: 'quantifier' times 'instruction'
    switch (instruction) {
    case 'a':
      // NUL-padded string
    case 'A':
      // SPACE-padded string
      if (typeof arguments[argumentPointer] === 'undefined') {
        throw new Error('Warning:  pack() Type ' + instruction + ': not enough arguments');
      } else {
        argument = String(arguments[argumentPointer]);
      }
      if (quantifier === '*') {
        quantifier = argument.length;
      }
      for (i = 0; i < quantifier; i++) {
        if (typeof argument[i] === 'undefined') {
          if (instruction === 'a') {
            result += String.fromCharCode(0);
          } else {
            result += ' ';
          }
        } else {
          result += argument[i];
        }
      }
      argumentPointer++;
      break;
    case 'h':
      // Hex string, low nibble first
    case 'H':
      // Hex string, high nibble first
      if (typeof arguments[argumentPointer] === 'undefined') {
        throw new Error('Warning: pack() Type ' + instruction + ': not enough arguments');
      } else {
        argument = arguments[argumentPointer];
      }
      if (quantifier === '*') {
        quantifier = argument.length;
      }
      if (quantifier > argument.length) {
        throw new Error('Warning: pack() Type ' + instruction + ': not enough characters in string');
      }
      for (i = 0; i < quantifier; i += 2) {
        // Always get per 2 bytes...
        word = argument[i];
        if (((i + 1) >= quantifier) || typeof(argument[i + 1]) === 'undefined') {
          word += '0';
        } else {
          word += argument[i + 1];
        }
        // The fastest way to reverse?
        if (instruction === 'h') {
          word = word[1] + word[0];
        }
        result += String.fromCharCode(parseInt(word, 16));
      }
      argumentPointer++;
      break;

    case 'c':
      // signed char
    case 'C':
      // unsigned char
      // c and C is the same in pack
      if (quantifier === '*') {
        quantifier = arguments.length - argumentPointer;
      }
      if (quantifier > (arguments.length - argumentPointer)) {
        throw new Error('Warning:  pack() Type ' + instruction + ': too few arguments');
      }

      for (i = 0; i < quantifier; i++) {
        result += String.fromCharCode(arguments[argumentPointer]);
        argumentPointer++;
      }
      break;

    case 's':
      // signed short (always 16 bit, machine byte order)
    case 'S':
      // unsigned short (always 16 bit, machine byte order)
    case 'v':
      // s and S is the same in pack
      if (quantifier === '*') {
        quantifier = arguments.length - argumentPointer;
      }
      if (quantifier > (arguments.length - argumentPointer)) {
        throw new Error('Warning:  pack() Type ' + instruction + ': too few arguments');
      }

      for (i = 0; i < quantifier; i++) {
        result += String.fromCharCode(arguments[argumentPointer] & 0xFF);
        result += String.fromCharCode(arguments[argumentPointer] >> 8 & 0xFF);
        argumentPointer++;
      }
      break;

    case 'n':
      // unsigned short (always 16 bit, big endian byte order)
      if (quantifier === '*') {
        quantifier = arguments.length - argumentPointer;
      }
      if (quantifier > (arguments.length - argumentPointer)) {
        throw new Error('Warning:  pack() Type ' + instruction + ': too few arguments');
      }

      for (i = 0; i < quantifier; i++) {
        result += String.fromCharCode(arguments[argumentPointer] >> 8 & 0xFF);
        result += String.fromCharCode(arguments[argumentPointer] & 0xFF);
        argumentPointer++;
      }
      break;

    case 'i':
      // signed integer (machine dependent size and byte order)
    case 'I':
      // unsigned integer (machine dependent size and byte order)
    case 'l':
      // signed long (always 32 bit, machine byte order)
    case 'L':
      // unsigned long (always 32 bit, machine byte order)
    case 'V':
      // unsigned long (always 32 bit, little endian byte order)
      if (quantifier === '*') {
        quantifier = arguments.length - argumentPointer;
      }
      if (quantifier > (arguments.length - argumentPointer)) {
        throw new Error('Warning:  pack() Type ' + instruction + ': too few arguments');
      }

      for (i = 0; i < quantifier; i++) {
        result += String.fromCharCode(arguments[argumentPointer] & 0xFF);
        result += String.fromCharCode(arguments[argumentPointer] >> 8 & 0xFF);
        result += String.fromCharCode(arguments[argumentPointer] >> 16 & 0xFF);
        result += String.fromCharCode(arguments[argumentPointer] >> 24 & 0xFF);
        argumentPointer++;
      }

      break;
    case 'N':
      // unsigned long (always 32 bit, big endian byte order)
      if (quantifier === '*') {
        quantifier = arguments.length - argumentPointer;
      }
      if (quantifier > (arguments.length - argumentPointer)) {
        throw new Error('Warning:  pack() Type ' + instruction + ': too few arguments');
      }

      for (i = 0; i < quantifier; i++) {
        result += String.fromCharCode(arguments[argumentPointer] >> 24 & 0xFF);
        result += String.fromCharCode(arguments[argumentPointer] >> 16 & 0xFF);
        result += String.fromCharCode(arguments[argumentPointer] >> 8 & 0xFF);
        result += String.fromCharCode(arguments[argumentPointer] & 0xFF);
        argumentPointer++;
      }
      break;

    case 'f':
      // float (machine dependent size and representation)
    case 'd':
      // double (machine dependent size and representation)
      // version based on IEEE754
      precisionBits = 23;
      exponentBits = 8;
      if (instruction === 'd') {
        precisionBits = 52;
        exponentBits = 11;
      }

      if (quantifier === '*') {
        quantifier = arguments.length - argumentPointer;
      }
      if (quantifier > (arguments.length - argumentPointer)) {
        throw new Error('Warning:  pack() Type ' + instruction + ': too few arguments');
      }
      for (i = 0; i < quantifier; i++) {
        argument = arguments[argumentPointer];
        bias = Math.pow(2, exponentBits - 1) - 1;
        minExp = -bias + 1;
        maxExp = bias;
        minUnnormExp = minExp - precisionBits;
        status = isNaN(n = parseFloat(argument)) || n === -Infinity || n === +Infinity ? n : 0;
        exp = 0;
        len = 2 * bias + 1 + precisionBits + 3;
        bin = new Array(len);
        signal = (n = status !== 0 ? 0 : n) < 0;
        n = Math.abs(n);
        intPart = Math.floor(n);
        floatPart = n - intPart;

        for (k = len; k;) {
          bin[--k] = 0;
        }
        for (k = bias + 2; intPart && k;) {
          bin[--k] = intPart % 2;
          intPart = Math.floor(intPart / 2);
        }
        for (k = bias + 1; floatPart > 0 && k; --floatPart) {
          (bin[++k] = ((floatPart *= 2) >= 1) - 0);
        }
        for (k = -1; ++k < len && !bin[k];) {}

        if (bin[(lastBit = precisionBits - 1 + (k = (exp = bias + 1 - k) >= minExp && exp <= maxExp ? k + 1 : bias + 1 - (exp = minExp - 1))) + 1]) {
          if (!(rounded = bin[lastBit])) {
            for (j = lastBit + 2; !rounded && j < len; rounded = bin[j++]) {}
          }
          for (j = lastBit + 1; rounded && --j >= 0;
          (bin[j] = !bin[j] - 0) && (rounded = 0)) {}
        }

        for (k = k - 2 < 0 ? -1 : k - 3; ++k < len && !bin[k];) {}

        if ((exp = bias + 1 - k) >= minExp && exp <= maxExp) {
          ++k;
        } else {
          if (exp < minExp) {
            if (exp !== bias + 1 - len && exp < minUnnormExp) {
            }
            k = bias + 1 - (exp = minExp - 1);
          }
        }

        if (intPart || status !== 0) {
          exp = maxExp + 1;
          k = bias + 2;
          if (status === -Infinity) {
            signal = 1;
          } else if (isNaN(status)) {
            bin[k] = 1;
          }
        }

        n = Math.abs(exp + bias);
        tmpResult = '';

        for (j = exponentBits + 1; --j;) {
          tmpResult = (n % 2) + tmpResult;
          n = n >>= 1;
        }

        n = 0;
        j = 0;
        k = (tmpResult = (signal ? '1' : '0') + tmpResult + bin.slice(k, k + precisionBits).join('')).length;
        r = [];

        for (; k;) {
          n += (1 << j) * tmpResult.charAt(--k);
          if (j === 7) {
            r[r.length] = String.fromCharCode(n);
            n = 0;
          }
          j = (j + 1) % 8;
        }

        r[r.length] = n ? String.fromCharCode(n) : '';
        result += r.join('');
        argumentPointer++;
      }
      break;

    case 'x':
      // NUL byte
      if (quantifier === '*') {
        throw new Error('Warning: pack(): Type x: \'*\' ignored');
      }
      for (i = 0; i < quantifier; i++) {
        result += String.fromCharCode(0);
      }
      break;

    case 'X':
      // Back up one byte
      if (quantifier === '*') {
        throw new Error('Warning: pack(): Type X: \'*\' ignored');
      }
      for (i = 0; i < quantifier; i++) {
        if (result.length === 0) {
          throw new Error('Warning: pack(): Type X:' + ' outside of string');
        } else {
          result = result.substring(0, result.length - 1);
        }
      }
      break;

    case '@':
      // NUL-fill to absolute position
      if (quantifier === '*') {
        throw new Error('Warning: pack(): Type X: \'*\' ignored');
      }
      if (quantifier > result.length) {
        extraNullCount = quantifier - result.length;
        for (i = 0; i < extraNullCount; i++) {
          result += String.fromCharCode(0);
        }
      }
      if (quantifier < result.length) {
        result = result.substring(0, quantifier);
      }
      break;

    default:
      throw new Error('Warning:  pack() Type ' + instruction + ': unknown format code');
    }
  }
  if (argumentPointer < arguments.length) {
    throw new Error('Warning: pack(): ' + (arguments.length - argumentPointer) + ' arguments unused');
  }

  return result;
}

function unpack(format, data) {
    // http://kevin.vanzonneveld.net
    // +   original by: Tim de Koning (http://www.kingsquare.nl)
    // +      parts by: Jonas Raoni Soares Silva
    // +      http://www.jsfromhell.com
    // +   bugfixed by: marcuswestin
    // %        note 1: Float decoding by: Jonas Raoni Soares Silva
    // %        note 2: Home: http://www.kingsquare.nl/blog/22-12-2009/13650536
    // %        note 3: Feedback: phpjs-unpack@kingsquare.nl
    // %        note 4: 'machine dependant byte order and size' aren't
    // %        note 5: applicable for JavaScript unpack works as on a 32bit,
    // %        note 6: little endian machine
    // *     example 1: unpack('f2test', 'abcddbca');
    // *     returns 1: { 'test1': 1.6777999408082E+22.
    // *     returns 2: 'test2': 2.6100787562286E+20 }

    var formatPointer = 0, dataPointer = 0, result = [], instruction = '',
            quantifier = '', label = '', currentData = '', i = 0, j = 0,
            word = '', precisionBits = 0, exponentBits = 0, dataByteLength = 0;

    // Used by float decoding
    var b = [], bias,  signal, exponent, significand, divisor, curByte,
            byteValue, startBit = 0, mask, currentResult;

    var readBits = function(start, length, byteArray){
        var offsetLeft, offsetRight, curByte, lastByte, diff, sum;

        function shl(a, b){
            for(++b; --b;) {
                a = ((a %= 0x7fffffff + 1) & 0x40000000) === 0x40000000 ?
                    a * 2 :
                    (a - 0x40000000) * 2 + 0x7fffffff + 1;
            }
            return a;
        }
        if(start < 0 || length <= 0) {
            return 0;
        }

        offsetRight = start % 8;
        curByte = byteArray.length - (start >> 3) - 1;
        lastByte = byteArray.length + (-(start + length) >> 3);
        diff = curByte - lastByte;
        sum = (
                (byteArray[ curByte ] >> offsetRight) &
                ((1 << (diff ? 8 - offsetRight : length)) - 1)
            ) + (
               diff && (offsetLeft = (start + length) % 8) ?
                (byteArray[ lastByte++ ] & ((1 << offsetLeft) - 1)) <<
                (diff-- << 3) - offsetRight :
                0
            );

        for(; diff;) {
            sum += shl(byteArray[ lastByte++ ], (diff-- << 3) - offsetRight);
        }
        return sum;
    };

	var ops = [], prev = "", num = [], j = 0;
	for(var i = 0; i < format.length; i++ ) {
		//if number
		if( format.charAt(i).match(/[\d\*]/) ) {
			num.push( format.charAt(i) );
			if( i+1 == format.length ) {
				ops[prev].n = parseInt(num.length == 0 ? 1 : num.join(""));
			}
		} else {
			//end
			if( i+1 == format.length ) {
				ops.push( { i: format.charAt(i), n: parseInt(num.length == 0 ? 1 : num.join("")) } );
			//first
			} else {
				ops.push( { i: format.charAt(i), n: 1 } );
				if( prev !== "" ) ops[prev].n = parseInt(num.length == 0 ? 1 : num.join(""));
				num = [];
				prev = j++;
			}
		}
	}
    /*for (formatPointer < format.length) {
        instruction = format.charAt(formatPointer);

        // Start reading 'quantifier'
        quantifier = '';
        formatPointer++;
        while ((formatPointer < format.length) &&
              (format.charAt(formatPointer).match(/[\d\*]/) !== null)) {
            quantifier += format.charAt(formatPointer);
            formatPointer++;
        }
        if (quantifier === '') {
            quantifier = '1';
        }

        // Start reading label
        label = '';
        while ((formatPointer < format.length) &&
              (format.charAt(formatPointer) !== '/')) {
            label += format.charAt(formatPointer);
            formatPointer++;
        }
        if (format.charAt(formatPointer) === '/') {
            formatPointer++;
        }*/
	for( var r in ops ) {
		instruction = ops[r].i.trim();
		quantifier = ops[r].n;
		label = r;

        // Process given instruction
        switch (instruction) {
            case 'a': // NUL-padded string
            case 'A': // SPACE-padded string
                if (quantifier === '*') {
                    quantifier = data.length - dataPointer;
                } else {
                    quantifier = parseInt(quantifier, 10);
                }
                currentData = data.substr(dataPointer, quantifier);
                dataPointer += quantifier;

                if (instruction === 'a') {
                    currentResult = currentData.replace(/\0+$/, '');
                } else {
                    currentResult = currentData.replace(/ +$/, '');
                }
                result.push( currentResult );
                break;

            case 'h': // Hex string, low nibble first
            case 'H': // Hex string, high nibble first
                if (quantifier === '*') {
                    quantifier = data.length - dataPointer;
                } else {
                    quantifier = parseInt(quantifier, 10);
                }
                currentData = data.substr(dataPointer, quantifier);
                dataPointer += quantifier;

                if (quantifier>currentData.length) {
                    throw new Error('Warning: unpack(): Type ' + instruction +
                            ': not enough input, need '  + quantifier);
                }

                currentResult = '';
                for(i=0;i<currentData.length;i++) {
                    word = currentData.charCodeAt(i).toString(16);
                    if (instruction === 'h') {
                        word = word[1]+word[0];
                    }
                   currentResult += word;
                }
                result.push( currentResult );
                break;

            case 'c': // signed char
            case 'C': // unsigned c
               /* if (quantifier === '*') {
                    quantifier = data.length - dataPointer;
                } else {
                    quantifier = parseInt(quantifier, 10);
                }*/

                currentData = data.substr(dataPointer, quantifier);
                dataPointer += quantifier;

                for (i=0;i<currentData.length;i++) {
                     currentResult = currentData.charCodeAt(i);
                     if ((instruction === 'c') && (currentResult >= 128)) {
                        currentResult -= 256;
                     }
                     result.push( currentResult );
                }
                break;

            case 'S': // unsigned short (always 16 bit, machine byte order)
            case 's': // signed short (always 16 bit, machine byte order)
            case 'v': // unsigned short (always 16 bit, little endian byte order)
                if (quantifier === '*') {
                    quantifier = (data.length - dataPointer) / 2;
                } else {
                    quantifier = parseInt(quantifier, 10);
                }

                currentData = data.substr(dataPointer, quantifier * 2);
                dataPointer += quantifier * 2;

                for (i=0;i<currentData.length;i+=2) {
                     // sum per word;
                    currentResult = (currentData.charCodeAt(i+1) & 0xFF) << 8 +
                            (currentData.charCodeAt(i) & 0xFF);
                    if ((instruction === 's') && (currentResult >= 32768)) {
                        currentResult -= 65536;
                    }
                    result.push( currentResult );
                }
                break;

            case 'n': // unsigned short (always 16 bit, big endian byte order)
                if (quantifier === '*') {
                    quantifier = (data.length - dataPointer) / 2;
                } else {
                    quantifier = parseInt(quantifier, 10);
                }

                currentData = data.substr(dataPointer, quantifier * 2);
                dataPointer += quantifier * 2;

                for (i=0;i<currentData.length;i+=2) {
                     // sum per word;
                    currentResult = ((currentData.charCodeAt(i) & 0xFF) << 8) +
                            (currentData.charCodeAt(i+1) & 0xFF);
                    result.push(currentResult);
                }
                break;

            case 'i': // signed integer (machine dependent size and byte order)
            case 'I': // unsigned integer (machine dependent size & byte order)
            case 'l': // signed long (always 32 bit, machine byte order)
            case 'L': // unsigned long (always 32 bit, machine byte order)
            case 'V': // unsigned long (always 32 bit, little endian byte order)
                if (quantifier === '*') {
                    quantifier = (data.length - dataPointer) / 4;
                } else {
                    quantifier = parseInt(quantifier, 10);
                }

                currentData = data.substr(dataPointer, quantifier * 4);
                dataPointer += quantifier * 4;

                for (i=0;i<currentData.length;i+=4) {
                    currentResult =
                            ((currentData.charCodeAt(i+3) & 0xFF) << 24) +
                            ((currentData.charCodeAt(i+2) & 0xFF) << 16) +
                            ((currentData.charCodeAt(i+1) & 0xFF) << 8) +
                            ((currentData.charCodeAt(i) & 0xFF));
                    result.push(currentResult);
                }

                break;

            case 'N': // unsigned long (always 32 bit, little endian byte order)
               if (quantifier === '*') {
                    quantifier = (data.length - dataPointer) / 4;
                } else {
                    quantifier = parseInt(quantifier, 10);
                }

                currentData = data.substr(dataPointer, quantifier * 4);
                dataPointer += quantifier * 4;

                for (i=0;i<currentData.length;i+=4) {
                    currentResult =
                            ((currentData.charCodeAt(i) & 0xFF) << 24) +
                            ((currentData.charCodeAt(i+1) & 0xFF) << 16) +
                            ((currentData.charCodeAt(i+2) & 0xFF) << 8) +
                            ((currentData.charCodeAt(i+3) & 0xFF));
                    result.push(currentResult);
                }

                break;

            case 'f':
            case 'd':
                exponentBits = 8;
                dataByteLength = 4;
                if (instruction === 'd') {
                    exponentBits = 11;
                    dataByteLength = 8;
                }
				
               if (quantifier === '*') {
                    quantifier = (data.length - dataPointer) / dataByteLength;
                } else {
                    quantifier = parseInt(quantifier, 10);
                }

                currentData = data.substr(dataPointer,
                        quantifier * dataByteLength);
                dataPointer += quantifier * dataByteLength ;

				for (i=0;i<currentData.length;i+=dataByteLength) {
                    var tdata = currentData.substr(i, dataByteLength);

                    b = [];
                    for(j = tdata.length-1; j >= 0  ; --j) {
                        b.push(tdata.charCodeAt(j));
                    }

                    precisionBits = (instruction === 'f')?23:52;

                    bias = Math.pow(2, exponentBits - 1) - 1;
                    signal = readBits(precisionBits + exponentBits, 1, b);
                    exponent = readBits(precisionBits, exponentBits, b);
                    significand = 0;
                    divisor = 2;
                    curByte = b.length + (-precisionBits >> 3) - 1;
                    startBit = 0;

                    do {
                        byteValue = b[ ++curByte ];
                        startBit = precisionBits % 8 || 8;
                        mask = 1 << startBit;
                        for(; (mask >>= 1);) {
                            if (byteValue & mask) {
                                significand += 1 / divisor;
                            }
                            divisor *= 2;
                        }
                    } while ((precisionBits -= startBit));

                        if (exponent === (bias << 1) + 1) {
                            if (significand) {
                                currentResult = NaN;
                            } else {
                                if (signal) {
                                    currentResult = -Infinity;
                                } else {
                                    currentResult = +Infinity;
                                }
                            }
                        } else {
                            if ((1 + signal * -2) * (exponent || significand)) {
                                if (!exponent) {
                                    currentResult = Math.pow(2, -bias + 1) *
                                            significand;
                                } else {
                                    currentResult = Math.pow(2,
                                            exponent - bias) *
                                            (1 + significand);
                                }
                            } else {
                                currentResult = 0;
                            }
                        }
                        result.push(currentResult);
                }

                break;

            case 'x': // NUL byte
            case 'X': // Back up one byte
            case '@': // NUL byte
                 if (quantifier === '*') {
                    quantifier = data.length - dataPointer;
                } else {
                    quantifier = parseInt(quantifier, 10);
                }

                if (quantifier > 0) {
                    if (instruction === 'X') {
                        dataPointer -= quantifier;
                    } else {
                        if (instruction === 'x') {
                            dataPointer += quantifier;
                        } else {
                            dataPointer = quantifier;
                        }
                    }
                }
                break;

            default:
            throw new Error('Warning:  unpack() Type ' + instruction +
                    ': unknown format code');
        }
    }
    return result;
}
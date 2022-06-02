!function(t){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{("undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this).JSZip=t()}}(function(){return function s(a,o,h){function u(r,t){if(!o[r]){if(!a[r]){var e="function"==typeof require&&require;if(!t&&e)return e(r,!0);if(l)return l(r,!0);var i=new Error("Cannot find module '"+r+"'");throw i.code="MODULE_NOT_FOUND",i}var n=o[r]={exports:{}};a[r][0].call(n.exports,function(t){var e=a[r][1][t];return u(e||t)},n,n.exports,s,a,o,h)}return o[r].exports}for(var l="function"==typeof require&&require,t=0;t<h.length;t++)u(h[t]);return u}({1:[function(t,e,r){"use strict";var c=t("./utils"),d=t("./support"),p="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";r.encode=function(t){for(var e,r,i,n,s,a,o,h=[],u=0,l=t.length,f=l,d="string"!==c.getTypeOf(t);u<t.length;)f=l-u,i=d?(e=t[u++],r=u<l?t[u++]:0,u<l?t[u++]:0):(e=t.charCodeAt(u++),r=u<l?t.charCodeAt(u++):0,u<l?t.charCodeAt(u++):0),n=e>>2,s=(3&e)<<4|r>>4,a=1<f?(15&r)<<2|i>>6:64,o=2<f?63&i:64,h.push(p.charAt(n)+p.charAt(s)+p.charAt(a)+p.charAt(o));return h.join("")},r.decode=function(t){var e,r,i,n,s,a,o=0,h=0,u="data:";if(t.substr(0,u.length)===u)throw new Error("Invalid base64 input, it looks like a data url.");var l,f=3*(t=t.replace(/[^A-Za-z0-9\+\/\=]/g,"")).length/4;if(t.charAt(t.length-1)===p.charAt(64)&&f--,t.charAt(t.length-2)===p.charAt(64)&&f--,f%1!=0)throw new Error("Invalid base64 input, bad content length.");for(l=d.uint8array?new Uint8Array(0|f):new Array(0|f);o<t.length;)e=p.indexOf(t.charAt(o++))<<2|(n=p.indexOf(t.charAt(o++)))>>4,r=(15&n)<<4|(s=p.indexOf(t.charAt(o++)))>>2,i=(3&s)<<6|(a=p.indexOf(t.charAt(o++))),l[h++]=e,64!==s&&(l[h++]=r),64!==a&&(l[h++]=i);return l}},{"./support":30,"./utils":32}],2:[function(t,e,r){"use strict";var i=t("./external"),n=t("./stream/DataWorker"),s=t("./stream/Crc32Probe"),a=t("./stream/DataLengthProbe");function o(t,e,r,i,n){this.compressedSize=t,this.uncompressedSize=e,this.crc32=r,this.compression=i,this.compressedContent=n}o.prototype={getContentWorker:function(){var t=new n(i.Promise.resolve(this.compressedContent)).pipe(this.compression.uncompressWorker()).pipe(new a("data_length")),e=this;return t.on("end",function(){if(this.streamInfo.data_length!==e.uncompressedSize)throw new Error("Bug : uncompressed data size mismatch")}),t},getCompressedWorker:function(){return new n(i.Promise.resolve(this.compressedContent)).withStreamInfo("compressedSize",this.compressedSize).withStreamInfo("uncompressedSize",this.uncompressedSize).withStreamInfo("crc32",this.crc32).withStreamInfo("compression",this.compression)}},o.createWorkerFrom=function(t,e,r){return t.pipe(new s).pipe(new a("uncompressedSize")).pipe(e.compressWorker(r)).pipe(new a("compressedSize")).withStreamInfo("compression",e)},e.exports=o},{"./external":6,"./stream/Crc32Probe":25,"./stream/DataLengthProbe":26,"./stream/DataWorker":27}],3:[function(t,e,r){"use strict";var i=t("./stream/GenericWorker");r.STORE={magic:"\0\0",compressWorker:function(t){return new i("STORE compression")},uncompressWorker:function(){return new i("STORE decompression")}},r.DEFLATE=t("./flate")},{"./flate":7,"./stream/GenericWorker":28}],4:[function(t,e,r){"use strict";var i=t("./utils");var o=function(){for(var t,e=[],r=0;r<256;r++){t=r;for(var i=0;i<8;i++)t=1&t?3988292384^t>>>1:t>>>1;e[r]=t}return e}();e.exports=function(t,e){return void 0!==t&&t.length?"string"!==i.getTypeOf(t)?function(t,e,r,i){var n=o,s=i+r;t^=-1;for(var a=i;a<s;a++)t=t>>>8^n[255&(t^e[a])];return-1^t}(0|e,t,t.length,0):function(t,e,r,i){var n=o,s=i+r;t^=-1;for(var a=i;a<s;a++)t=t>>>8^n[255&(t^e.charCodeAt(a))];return-1^t}(0|e,t,t.length,0):0}},{"./utils":32}],5:[function(t,e,r){"use strict";r.base64=!1,r.binary=!1,r.dir=!1,r.createFolders=!0,r.date=null,r.compression=null,r.compressionOptions=null,r.comment=null,r.unixPermissions=null,r.dosPermissions=null},{}],6:[function(t,e,r){"use strict";var i=null;i="undefined"!=typeof Promise?Promise:t("lie"),e.exports={Promise:i}},{lie:37}],7:[function(t,e,r){"use strict";var i="undefined"!=typeof Uint8Array&&"undefined"!=typeof Uint16Array&&"undefined"!=typeof Uint32Array,n=t("pako"),s=t("./utils"),a=t("./stream/GenericWorker"),o=i?"uint8array":"array";function h(t,e){a.call(this,"FlateWorker/"+t),this._pako=null,this._pakoAction=t,this._pakoOptions=e,this.meta={}}r.magic="\b\0",s.inherits(h,a),h.prototype.processChunk=function(t){this.meta=t.meta,null===this._pako&&this._createPako(),this._pako.push(s.transformTo(o,t.data),!1)},h.prototype.flush=function(){a.prototype.flush.call(this),null===this._pako&&this._createPako(),this._pako.push([],!0)},h.prototype.cleanUp=function(){a.prototype.cleanUp.call(this),this._pako=null},h.prototype._createPako=function(){this._pako=new n[this._pakoAction]({raw:!0,level:this._pakoOptions.level||-1});var e=this;this._pako.onData=function(t){e.push({data:t,meta:e.meta})}},r.compressWorker=function(t){return new h("Deflate",t)},r.uncompressWorker=function(){return new h("Inflate",{})}},{"./stream/GenericWorker":28,"./utils":32,pako:38}],8:[function(t,e,r){"use strict";function A(t,e){var r,i="";for(r=0;r<e;r++)i+=String.fromCharCode(255&t),t>>>=8;return i}function i(t,e,r,i,n,s){var a,o,h=t.file,u=t.compression,l=s!==O.utf8encode,f=I.transformTo("string",s(h.name)),d=I.transformTo("string",O.utf8encode(h.name)),c=h.comment,p=I.transformTo("string",s(c)),m=I.transformTo("string",O.utf8encode(c)),_=d.length!==h.name.length,g=m.length!==c.length,b="",v="",y="",w=h.dir,k=h.date,x={crc32:0,compressedSize:0,uncompressedSize:0};e&&!r||(x.crc32=t.crc32,x.compressedSize=t.compressedSize,x.uncompressedSize=t.uncompressedSize);var S=0;e&&(S|=8),l||!_&&!g||(S|=2048);var z=0,C=0;w&&(z|=16),"UNIX"===n?(C=798,z|=function(t,e){var r=t;return t||(r=e?16893:33204),(65535&r)<<16}(h.unixPermissions,w)):(C=20,z|=function(t){return 63&(t||0)}(h.dosPermissions)),a=k.getUTCHours(),a<<=6,a|=k.getUTCMinutes(),a<<=5,a|=k.getUTCSeconds()/2,o=k.getUTCFullYear()-1980,o<<=4,o|=k.getUTCMonth()+1,o<<=5,o|=k.getUTCDate(),_&&(v=A(1,1)+A(B(f),4)+d,b+="up"+A(v.length,2)+v),g&&(y=A(1,1)+A(B(p),4)+m,b+="uc"+A(y.length,2)+y);var E="";return E+="\n\0",E+=A(S,2),E+=u.magic,E+=A(a,2),E+=A(o,2),E+=A(x.crc32,4),E+=A(x.compressedSize,4),E+=A(x.uncompressedSize,4),E+=A(f.length,2),E+=A(b.length,2),{fileRecord:R.LOCAL_FILE_HEADER+E+f+b,dirRecord:R.CENTRAL_FILE_HEADER+A(C,2)+E+A(p.length,2)+"\0\0\0\0"+A(z,4)+A(i,4)+f+b+p}}var I=t("../utils"),n=t("../stream/GenericWorker"),O=t("../utf8"),B=t("../crc32"),R=t("../signature");function s(t,e,r,i){n.call(this,"ZipFileWorker"),this.bytesWritten=0,this.zipComment=e,this.zipPlatform=r,this.encodeFileName=i,this.streamFiles=t,this.accumulate=!1,this.contentBuffer=[],this.dirRecords=[],this.currentSourceOffset=0,this.entriesCount=0,this.currentFile=null,this._sources=[]}I.inherits(s,n),s.prototype.push=function(t){var e=t.meta.percent||0,r=this.entriesCount,i=this._sources.length;this.accumulate?this.contentBuffer.push(t):(this.bytesWritten+=t.data.length,n.prototype.push.call(this,{data:t.data,meta:{currentFile:this.currentFile,percent:r?(e+100*(r-i-1))/r:100}}))},s.prototype.openedSource=function(t){this.currentSourceOffset=this.bytesWritten,this.currentFile=t.file.name;var e=this.streamFiles&&!t.file.dir;if(e){var r=i(t,e,!1,this.currentSourceOffset,this.zipPlatform,this.encodeFileName);this.push({data:r.fileRecord,meta:{percent:0}})}else this.accumulate=!0},s.prototype.closedSource=function(t){this.accumulate=!1;var e=this.streamFiles&&!t.file.dir,r=i(t,e,!0,this.currentSourceOffset,this.zipPlatform,this.encodeFileName);if(this.dirRecords.push(r.dirRecord),e)this.push({data:function(t){return R.DATA_DESCRIPTOR+A(t.crc32,4)+A(t.compressedSize,4)+A(t.uncompressedSize,4)}(t),meta:{percent:100}});else for(this.push({data:r.fileRecord,meta:{percent:0}});this.contentBuffer.length;)this.push(this.contentBuffer.shift());this.currentFile=null},s.prototype.flush=function(){for(var t=this.bytesWritten,e=0;e<this.dirRecords.length;e++)this.push({data:this.dirRecords[e],meta:{percent:100}});var r=this.bytesWritten-t,i=function(t,e,r,i,n){var s=I.transformTo("string",n(i));return R.CENTRAL_DIRECTORY_END+"\0\0\0\0"+A(t,2)+A(t,2)+A(e,4)+A(r,4)+A(s.length,2)+s}(this.dirRecords.length,r,t,this.zipComment,this.encodeFileName);this.push({data:i,meta:{percent:100}})},s.prototype.prepareNextSource=function(){this.previous=this._sources.shift(),this.openedSource(this.previous.streamInfo),this.isPaused?this.previous.pause():this.previous.resume()},s.prototype.registerPrevious=function(t){this._sources.push(t);var e=this;return t.on("data",function(t){e.processChunk(t)}),t.on("end",function(){e.closedSource(e.previous.streamInfo),e._sources.length?e.prepareNextSource():e.end()}),t.on("error",function(t){e.error(t)}),this},s.prototype.resume=function(){return!!n.prototype.resume.call(this)&&(!this.previous&&this._sources.length?(this.prepareNextSource(),!0):this.previous||this._sources.length||this.generatedError?void 0:(this.end(),!0))},s.prototype.error=function(t){var e=this._sources;if(!n.prototype.error.call(this,t))return!1;for(var r=0;r<e.length;r++)try{e[r].error(t)}catch(t){}return!0},s.prototype.lock=function(){n.prototype.lock.call(this);for(var t=this._sources,e=0;e<t.length;e++)t[e].lock()},e.exports=s},{"../crc32":4,"../signature":23,"../stream/GenericWorker":28,"../utf8":31,"../utils":32}],9:[function(t,e,r){"use strict";var u=t("../compressions"),i=t("./ZipFileWorker");r.generateWorker=function(t,a,e){var o=new i(a.streamFiles,e,a.platform,a.encodeFileName),h=0;try{t.forEach(function(t,e){h++;var r=function(t,e){var r=t||e,i=u[r];if(!i)throw new Error(r+" is not a valid compression method !");return i}(e.options.compression,a.compression),i=e.options.compressionOptions||a.compressionOptions||{},n=e.dir,s=e.date;e._compressWorker(r,i).withStreamInfo("file",{name:t,dir:n,date:s,comment:e.comment||"",unixPermissions:e.unixPermissions,dosPermissions:e.dosPermissions}).pipe(o)}),o.entriesCount=h}catch(t){o.error(t)}return o}},{"../compressions":3,"./ZipFileWorker":8}],10:[function(t,e,r){"use strict";function i(){if(!(this instanceof i))return new i;if(arguments.length)throw new Error("The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.");this.files=Object.create(null),this.comment=null,this.root="",this.clone=function(){var t=new i;for(var e in this)"function"!=typeof this[e]&&(t[e]=this[e]);return t}}(i.prototype=t("./object")).loadAsync=t("./load"),i.support=t("./support"),i.defaults=t("./defaults"),i.version="3.8.0",i.loadAsync=function(t,e){return(new i).loadAsync(t,e)},i.external=t("./external"),e.exports=i},{"./defaults":5,"./external":6,"./load":11,"./object":15,"./support":30}],11:[function(t,e,r){"use strict";var u=t("./utils"),n=t("./external"),i=t("./utf8"),s=t("./zipEntries"),a=t("./stream/Crc32Probe"),l=t("./nodejsUtils");function f(i){return new n.Promise(function(t,e){var r=i.decompressed.getContentWorker().pipe(new a);r.on("error",function(t){e(t)}).on("end",function(){r.streamInfo.crc32!==i.decompressed.crc32?e(new Error("Corrupted zip : CRC32 mismatch")):t()}).resume()})}e.exports=function(t,o){var h=this;return o=u.extend(o||{},{base64:!1,checkCRC32:!1,optimizedBinaryString:!1,createFolders:!1,decodeFileName:i.utf8decode}),l.isNode&&l.isStream(t)?n.Promise.reject(new Error("JSZip can't accept a stream when loading a zip file.")):u.prepareContent("the loaded zip file",t,!0,o.optimizedBinaryString,o.base64).then(function(t){var e=new s(o);return e.load(t),e}).then(function(t){var e=[n.Promise.resolve(t)],r=t.files;if(o.checkCRC32)for(var i=0;i<r.length;i++)e.push(f(r[i]));return n.Promise.all(e)}).then(function(t){for(var e=t.shift(),r=e.files,i=0;i<r.length;i++){var n=r[i],s=n.fileNameStr,a=u.resolve(n.fileNameStr);h.file(a,n.decompressed,{binary:!0,optimizedBinaryString:!0,date:n.date,dir:n.dir,comment:n.fileCommentStr.length?n.fileCommentStr:null,unixPermissions:n.unixPermissions,dosPermissions:n.dosPermissions,createFolders:o.createFolders}),n.dir||(h.file(a).unsafeOriginalName=s)}return e.zipComment.length&&(h.comment=e.zipComment),h})}},{"./external":6,"./nodejsUtils":14,"./stream/Crc32Probe":25,"./utf8":31,"./utils":32,"./zipEntries":33}],12:[function(t,e,r){"use strict";var i=t("../utils"),n=t("../stream/GenericWorker");function s(t,e){n.call(this,"Nodejs stream input adapter for "+t),this._upstreamEnded=!1,this._bindStream(e)}i.inherits(s,n),s.prototype._bindStream=function(t){var e=this;(this._stream=t).pause(),t.on("data",function(t){e.push({data:t,meta:{percent:0}})}).on("error",function(t){e.isPaused?this.generatedError=t:e.error(t)}).on("end",function(){e.isPaused?e._upstreamEnded=!0:e.end()})},s.prototype.pause=function(){return!!n.prototype.pause.call(this)&&(this._stream.pause(),!0)},s.prototype.resume=function(){return!!n.prototype.resume.call(this)&&(this._upstreamEnded?this.end():this._stream.resume(),!0)},e.exports=s},{"../stream/GenericWorker":28,"../utils":32}],13:[function(t,e,r){"use strict";var n=t("readable-stream").Readable;function i(t,e,r){n.call(this,e),this._helper=t;var i=this;t.on("data",function(t,e){i.push(t)||i._helper.pause(),r&&r(e)}).on("error",function(t){i.emit("error",t)}).on("end",function(){i.push(null)})}t("../utils").inherits(i,n),i.prototype._read=function(){this._helper.resume()},e.exports=i},{"../utils":32,"readable-stream":16}],14:[function(t,e,r){"use strict";e.exports={isNode:"undefined"!=typeof Buffer,newBufferFrom:function(t,e){if(Buffer.from&&Buffer.from!==Uint8Array.from)return Buffer.from(t,e);if("number"==typeof t)throw new Error('The "data" argument must not be a number');return new Buffer(t,e)},allocBuffer:function(t){if(Buffer.alloc)return Buffer.alloc(t);var e=new Buffer(t);return e.fill(0),e},isBuffer:function(t){return Buffer.isBuffer(t)},isStream:function(t){return t&&"function"==typeof t.on&&"function"==typeof t.pause&&"function"==typeof t.resume}}},{}],15:[function(t,e,r){"use strict";function s(t,e,r){var i,n=u.getTypeOf(e),s=u.extend(r||{},f);s.date=s.date||new Date,null!==s.compression&&(s.compression=s.compression.toUpperCase()),"string"==typeof s.unixPermissions&&(s.unixPermissions=parseInt(s.unixPermissions,8)),s.unixPermissions&&16384&s.unixPermissions&&(s.dir=!0),s.dosPermissions&&16&s.dosPermissions&&(s.dir=!0),s.dir&&(t=g(t)),s.createFolders&&(i=_(t))&&b.call(this,i,!0);var a="string"===n&&!1===s.binary&&!1===s.base64;r&&void 0!==r.binary||(s.binary=!a),(e instanceof d&&0===e.uncompressedSize||s.dir||!e||0===e.length)&&(s.base64=!1,s.binary=!0,e="",s.compression="STORE",n="string");var o=null;o=e instanceof d||e instanceof l?e:p.isNode&&p.isStream(e)?new m(t,e):u.prepareContent(t,e,s.binary,s.optimizedBinaryString,s.base64);var h=new c(t,o,s);this.files[t]=h}var n=t("./utf8"),u=t("./utils"),l=t("./stream/GenericWorker"),a=t("./stream/StreamHelper"),f=t("./defaults"),d=t("./compressedObject"),c=t("./zipObject"),o=t("./generate"),p=t("./nodejsUtils"),m=t("./nodejs/NodejsStreamInputAdapter"),_=function(t){"/"===t.slice(-1)&&(t=t.substring(0,t.length-1));var e=t.lastIndexOf("/");return 0<e?t.substring(0,e):""},g=function(t){return"/"!==t.slice(-1)&&(t+="/"),t},b=function(t,e){return e=void 0!==e?e:f.createFolders,t=g(t),this.files[t]||s.call(this,t,null,{dir:!0,createFolders:e}),this.files[t]};function h(t){return"[object RegExp]"===Object.prototype.toString.call(t)}var i={load:function(){throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.")},forEach:function(t){var e,r,i;for(e in this.files)i=this.files[e],(r=e.slice(this.root.length,e.length))&&e.slice(0,this.root.length)===this.root&&t(r,i)},filter:function(r){var i=[];return this.forEach(function(t,e){r(t,e)&&i.push(e)}),i},file:function(t,e,r){if(1!==arguments.length)return t=this.root+t,s.call(this,t,e,r),this;if(h(t)){var i=t;return this.filter(function(t,e){return!e.dir&&i.test(t)})}var n=this.files[this.root+t];return n&&!n.dir?n:null},folder:function(r){if(!r)return this;if(h(r))return this.filter(function(t,e){return e.dir&&r.test(t)});var t=this.root+r,e=b.call(this,t),i=this.clone();return i.root=e.name,i},remove:function(r){r=this.root+r;var t=this.files[r];if(t||("/"!==r.slice(-1)&&(r+="/"),t=this.files[r]),t&&!t.dir)delete this.files[r];else for(var e=this.filter(function(t,e){return e.name.slice(0,r.length)===r}),i=0;i<e.length;i++)delete this.files[e[i].name];return this},generate:function(t){throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.")},generateInternalStream:function(t){var e,r={};try{if((r=u.extend(t||{},{streamFiles:!1,compression:"STORE",compressionOptions:null,type:"",platform:"DOS",comment:null,mimeType:"application/zip",encodeFileName:n.utf8encode})).type=r.type.toLowerCase(),r.compression=r.compression.toUpperCase(),"binarystring"===r.type&&(r.type="string"),!r.type)throw new Error("No output type specified.");u.checkSupport(r.type),"darwin"!==r.platform&&"freebsd"!==r.platform&&"linux"!==r.platform&&"sunos"!==r.platform||(r.platform="UNIX"),"win32"===r.platform&&(r.platform="DOS");var i=r.comment||this.comment||"";e=o.generateWorker(this,r,i)}catch(t){(e=new l("error")).error(t)}return new a(e,r.type||"string",r.mimeType)},generateAsync:function(t,e){return this.generateInternalStream(t).accumulate(e)},generateNodeStream:function(t,e){return(t=t||{}).type||(t.type="nodebuffer"),this.generateInternalStream(t).toNodejsStream(e)}};e.exports=i},{"./compressedObject":2,"./defaults":5,"./generate":9,"./nodejs/NodejsStreamInputAdapter":12,"./nodejsUtils":14,"./stream/GenericWorker":28,"./stream/StreamHelper":29,"./utf8":31,"./utils":32,"./zipObject":35}],16:[function(t,e,r){e.exports=t("stream")},{stream:void 0}],17:[function(t,e,r){"use strict";var i=t("./DataReader");function n(t){i.call(this,t);for(var e=0;e<this.data.length;e++)t[e]=255&t[e]}t("../utils").inherits(n,i),n.prototype.byteAt=function(t){return this.data[this.zero+t]},n.prototype.lastIndexOfSignature=function(t){for(var e=t.charCodeAt(0),r=t.charCodeAt(1),i=t.charCodeAt(2),n=t.charCodeAt(3),s=this.length-4;0<=s;--s)if(this.data[s]===e&&this.data[s+1]===r&&this.data[s+2]===i&&this.data[s+3]===n)return s-this.zero;return-1},n.prototype.readAndCheckSignature=function(t){var e=t.charCodeAt(0),r=t.charCodeAt(1),i=t.charCodeAt(2),n=t.charCodeAt(3),s=this.readData(4);return e===s[0]&&r===s[1]&&i===s[2]&&n===s[3]},n.prototype.readData=function(t){if(this.checkOffset(t),0===t)return[];var e=this.data.slice(this.zero+this.index,this.zero+this.index+t);return this.index+=t,e},e.exports=n},{"../utils":32,"./DataReader":18}],18:[function(t,e,r){"use strict";var i=t("../utils");function n(t){this.data=t,this.length=t.length,this.index=0,this.zero=0}n.prototype={checkOffset:function(t){this.checkIndex(this.index+t)},checkIndex:function(t){if(this.length<this.zero+t||t<0)throw new Error("End of data reached (data length = "+this.length+", asked index = "+t+"). Corrupted zip ?")},setIndex:function(t){this.checkIndex(t),this.index=t},skip:function(t){this.setIndex(this.index+t)},byteAt:function(t){},readInt:function(t){var e,r=0;for(this.checkOffset(t),e=this.index+t-1;e>=this.index;e--)r=(r<<8)+this.byteAt(e);return this.index+=t,r},readString:function(t){return i.transformTo("string",this.readData(t))},readData:function(t){},lastIndexOfSignature:function(t){},readAndCheckSignature:function(t){},readDate:function(){var t=this.readInt(4);return new Date(Date.UTC(1980+(t>>25&127),(t>>21&15)-1,t>>16&31,t>>11&31,t>>5&63,(31&t)<<1))}},e.exports=n},{"../utils":32}],19:[function(t,e,r){"use strict";var i=t("./Uint8ArrayReader");function n(t){i.call(this,t)}t("../utils").inherits(n,i),n.prototype.readData=function(t){this.checkOffset(t);var e=this.data.slice(this.zero+this.index,this.zero+this.index+t);return this.index+=t,e},e.exports=n},{"../utils":32,"./Uint8ArrayReader":21}],20:[function(t,e,r){"use strict";var i=t("./DataReader");function n(t){i.call(this,t)}t("../utils").inherits(n,i),n.prototype.byteAt=function(t){return this.data.charCodeAt(this.zero+t)},n.prototype.lastIndexOfSignature=function(t){return this.data.lastIndexOf(t)-this.zero},n.prototype.readAndCheckSignature=function(t){return t===this.readData(4)},n.prototype.readData=function(t){this.checkOffset(t);var e=this.data.slice(this.zero+this.index,this.zero+this.index+t);return this.index+=t,e},e.exports=n},{"../utils":32,"./DataReader":18}],21:[function(t,e,r){"use strict";var i=t("./ArrayReader");function n(t){i.call(this,t)}t("../utils").inherits(n,i),n.prototype.readData=function(t){if(this.checkOffset(t),0===t)return new Uint8Array(0);var e=this.data.subarray(this.zero+this.index,this.zero+this.index+t);return this.index+=t,e},e.exports=n},{"../utils":32,"./ArrayReader":17}],22:[function(t,e,r){"use strict";var i=t("../utils"),n=t("../support"),s=t("./ArrayReader"),a=t("./StringReader"),o=t("./NodeBufferReader"),h=t("./Uint8ArrayReader");e.exports=function(t){var e=i.getTypeOf(t);return i.checkSupport(e),"string"!==e||n.uint8array?"nodebuffer"===e?new o(t):n.uint8array?new h(i.transformTo("uint8array",t)):new s(i.transformTo("array",t)):new a(t)}},{"../support":30,"../utils":32,"./ArrayReader":17,"./NodeBufferReader":19,"./StringReader":20,"./Uint8ArrayReader":21}],23:[function(t,e,r){"use strict";r.LOCAL_FILE_HEADER="PK",r.CENTRAL_FILE_HEADER="PK",r.CENTRAL_DIRECTORY_END="PK",r.ZIP64_CENTRAL_DIRECTORY_LOCATOR="PK",r.ZIP64_CENTRAL_DIRECTORY_END="PK",r.DATA_DESCRIPTOR="PK\b"},{}],24:[function(t,e,r){"use strict";var i=t("./GenericWorker"),n=t("../utils");function s(t){i.call(this,"ConvertWorker to "+t),this.destType=t}n.inherits(s,i),s.prototype.processChunk=function(t){this.push({data:n.transformTo(this.destType,t.data),meta:t.meta})},e.exports=s},{"../utils":32,"./GenericWorker":28}],25:[function(t,e,r){"use strict";var i=t("./GenericWorker"),n=t("../crc32");function s(){i.call(this,"Crc32Probe"),this.withStreamInfo("crc32",0)}t("../utils").inherits(s,i),s.prototype.processChunk=function(t){this.streamInfo.crc32=n(t.data,this.streamInfo.crc32||0),this.push(t)},e.exports=s},{"../crc32":4,"../utils":32,"./GenericWorker":28}],26:[function(t,e,r){"use strict";var i=t("../utils"),n=t("./GenericWorker");function s(t){n.call(this,"DataLengthProbe for "+t),this.propName=t,this.withStreamInfo(t,0)}i.inherits(s,n),s.prototype.processChunk=function(t){if(t){var e=this.streamInfo[this.propName]||0;this.streamInfo[this.propName]=e+t.data.length}n.prototype.processChunk.call(this,t)},e.exports=s},{"../utils":32,"./GenericWorker":28}],27:[function(t,e,r){"use strict";var i=t("../utils"),n=t("./GenericWorker");function s(t){n.call(this,"DataWorker");var e=this;this.dataIsReady=!1,this.index=0,this.max=0,this.data=null,this.type="",this._tickScheduled=!1,t.then(function(t){e.dataIsReady=!0,e.data=t,e.max=t&&t.length||0,e.type=i.getTypeOf(t),e.isPaused||e._tickAndRepeat()},function(t){e.error(t)})}i.inherits(s,n),s.prototype.cleanUp=function(){n.prototype.cleanUp.call(this),this.data=null},s.prototype.resume=function(){return!!n.prototype.resume.call(this)&&(!this._tickScheduled&&this.dataIsReady&&(this._tickScheduled=!0,i.delay(this._tickAndRepeat,[],this)),!0)},s.prototype._tickAndRepeat=function(){this._tickScheduled=!1,this.isPaused||this.isFinished||(this._tick(),this.isFinished||(i.delay(this._tickAndRepeat,[],this),this._tickScheduled=!0))},s.prototype._tick=function(){if(this.isPaused||this.isFinished)return!1;var t=null,e=Math.min(this.max,this.index+16384);if(this.index>=this.max)return this.end();switch(this.type){case"string":t=this.data.substring(this.index,e);break;case"uint8array":t=this.data.subarray(this.index,e);break;case"array":case"nodebuffer":t=this.data.slice(this.index,e)}return this.index=e,this.push({data:t,meta:{percent:this.max?this.index/this.max*100:0}})},e.exports=s},{"../utils":32,"./GenericWorker":28}],28:[function(t,e,r){"use strict";function i(t){this.name=t||"default",this.streamInfo={},this.generatedError=null,this.extraStreamInfo={},this.isPaused=!0,this.isFinished=!1,this.isLocked=!1,this._listeners={data:[],end:[],error:[]},this.previous=null}i.prototype={push:function(t){this.emit("data",t)},end:function(){if(this.isFinished)return!1;this.flush();try{this.emit("end"),this.cleanUp(),this.isFinished=!0}catch(t){this.emit("error",t)}return!0},error:function(t){return!this.isFinished&&(this.isPaused?this.generatedError=t:(this.isFinished=!0,this.emit("error",t),this.previous&&this.previous.error(t),this.cleanUp()),!0)},on:function(t,e){return this._listeners[t].push(e),this},cleanUp:function(){this.streamInfo=this.generatedError=this.extraStreamInfo=null,this._listeners=[]},emit:function(t,e){if(this._listeners[t])for(var r=0;r<this._listeners[t].length;r++)this._listeners[t][r].call(this,e)},pipe:function(t){return t.registerPrevious(this)},registerPrevious:function(t){if(this.isLocked)throw new Error("The stream '"+this+"' has already been used.");this.streamInfo=t.streamInfo,this.mergeStreamInfo(),this.previous=t;var e=this;return t.on("data",function(t){e.processChunk(t)}),t.on("end",function(){e.end()}),t.on("error",function(t){e.error(t)}),this},pause:function(){return!this.isPaused&&!this.isFinished&&(this.isPaused=!0,this.previous&&this.previous.pause(),!0)},resume:function(){if(!this.isPaused||this.isFinished)return!1;var t=this.isPaused=!1;return this.generatedError&&(this.error(this.generatedError),t=!0),this.previous&&this.previous.resume(),!t},flush:function(){},processChunk:function(t){this.push(t)},withStreamInfo:function(t,e){return this.extraStreamInfo[t]=e,this.mergeStreamInfo(),this},mergeStreamInfo:function(){for(var t in this.extraStreamInfo)this.extraStreamInfo.hasOwnProperty(t)&&(this.streamInfo[t]=this.extraStreamInfo[t])},lock:function(){if(this.isLocked)throw new Error("The stream '"+this+"' has already been used.");this.isLocked=!0,this.previous&&this.previous.lock()},toString:function(){var t="Worker "+this.name;return this.previous?this.previous+" -> "+t:t}},e.exports=i},{}],29:[function(t,e,r){"use strict";var h=t("../utils"),n=t("./ConvertWorker"),s=t("./GenericWorker"),u=t("../base64"),i=t("../support"),a=t("../external"),o=null;if(i.nodestream)try{o=t("../nodejs/NodejsStreamOutputAdapter")}catch(t){}function l(t,o){return new a.Promise(function(e,r){var i=[],n=t._internalType,s=t._outputType,a=t._mimeType;t.on("data",function(t,e){i.push(t),o&&o(e)}).on("error",function(t){i=[],r(t)}).on("end",function(){try{var t=function(t,e,r){switch(t){case"blob":return h.newBlob(h.transformTo("arraybuffer",e),r);case"base64":return u.encode(e);default:return h.transformTo(t,e)}}(s,function(t,e){var r,i=0,n=null,s=0;for(r=0;r<e.length;r++)s+=e[r].length;switch(t){case"string":return e.join("");case"array":return Array.prototype.concat.apply([],e);case"uint8array":for(n=new Uint8Array(s),r=0;r<e.length;r++)n.set(e[r],i),i+=e[r].length;return n;case"nodebuffer":return Buffer.concat(e);default:throw new Error("concat : unsupported type '"+t+"'")}}(n,i),a);e(t)}catch(t){r(t)}i=[]}).resume()})}function f(t,e,r){var i=e;switch(e){case"blob":case"arraybuffer":i="uint8array";break;case"base64":i="string"}try{this._internalType=i,this._outputType=e,this._mimeType=r,h.checkSupport(i),this._worker=t.pipe(new n(i)),t.lock()}catch(t){this._worker=new s("error"),this._worker.error(t)}}f.prototype={accumulate:function(t){return l(this,t)},on:function(t,e){var r=this;return"data"===t?this._worker.on(t,function(t){e.call(r,t.data,t.meta)}):this._worker.on(t,function(){h.delay(e,arguments,r)}),this},resume:function(){return h.delay(this._worker.resume,[],this._worker),this},pause:function(){return this._worker.pause(),this},toNodejsStream:function(t){if(h.checkSupport("nodestream"),"nodebuffer"!==this._outputType)throw new Error(this._outputType+" is not supported by this method");return new o(this,{objectMode:"nodebuffer"!==this._outputType},t)}},e.exports=f},{"../base64":1,"../external":6,"../nodejs/NodejsStreamOutputAdapter":13,"../support":30,"../utils":32,"./ConvertWorker":24,"./GenericWorker":28}],30:[function(t,e,r){"use strict";if(r.base64=!0,r.array=!0,r.string=!0,r.arraybuffer="undefined"!=typeof ArrayBuffer&&"undefined"!=typeof Uint8Array,r.nodebuffer="undefined"!=typeof Buffer,r.uint8array="undefined"!=typeof Uint8Array,"undefined"==typeof ArrayBuffer)r.blob=!1;else{var i=new ArrayBuffer(0);try{r.blob=0===new Blob([i],{type:"application/zip"}).size}catch(t){try{var n=new(self.BlobBuilder||self.WebKitBlobBuilder||self.MozBlobBuilder||self.MSBlobBuilder);n.append(i),r.blob=0===n.getBlob("application/zip").size}catch(t){r.blob=!1}}}try{r.nodestream=!!t("readable-stream").Readable}catch(t){r.nodestream=!1}},{"readable-stream":16}],31:[function(t,e,s){"use strict";for(var o=t("./utils"),h=t("./support"),r=t("./nodejsUtils"),i=t("./stream/GenericWorker"),u=new Array(256),n=0;n<256;n++)u[n]=252<=n?6:248<=n?5:240<=n?4:224<=n?3:192<=n?2:1;u[254]=u[254]=1;function a(){i.call(this,"utf-8 decode"),this.leftOver=null}function l(){i.call(this,"utf-8 encode")}s.utf8encode=function(t){return h.nodebuffer?r.newBufferFrom(t,"utf-8"):function(t){var e,r,i,n,s,a=t.length,o=0;for(n=0;n<a;n++)55296==(64512&(r=t.charCodeAt(n)))&&n+1<a&&56320==(64512&(i=t.charCodeAt(n+1)))&&(r=65536+(r-55296<<10)+(i-56320),n++),o+=r<128?1:r<2048?2:r<65536?3:4;for(e=h.uint8array?new Uint8Array(o):new Array(o),n=s=0;s<o;n++)55296==(64512&(r=t.charCodeAt(n)))&&n+1<a&&56320==(64512&(i=t.charCodeAt(n+1)))&&(r=65536+(r-55296<<10)+(i-56320),n++),r<128?e[s++]=r:(r<2048?e[s++]=192|r>>>6:(r<65536?e[s++]=224|r>>>12:(e[s++]=240|r>>>18,e[s++]=128|r>>>12&63),e[s++]=128|r>>>6&63),e[s++]=128|63&r);return e}(t)},s.utf8decode=function(t){return h.nodebuffer?o.transformTo("nodebuffer",t).toString("utf-8"):function(t){var e,r,i,n,s=t.length,a=new Array(2*s);for(e=r=0;e<s;)if((i=t[e++])<128)a[r++]=i;else if(4<(n=u[i]))a[r++]=65533,e+=n-1;else{for(i&=2===n?31:3===n?15:7;1<n&&e<s;)i=i<<6|63&t[e++],n--;1<n?a[r++]=65533:i<65536?a[r++]=i:(i-=65536,a[r++]=55296|i>>10&1023,a[r++]=56320|1023&i)}return a.length!==r&&(a.subarray?a=a.subarray(0,r):a.length=r),o.applyFromCharCode(a)}(t=o.transformTo(h.uint8array?"uint8array":"array",t))},o.inherits(a,i),a.prototype.processChunk=function(t){var e=o.transformTo(h.uint8array?"uint8array":"array",t.data);if(this.leftOver&&this.leftOver.length){if(h.uint8array){var r=e;(e=new Uint8Array(r.length+this.leftOver.length)).set(this.leftOver,0),e.set(r,this.leftOver.length)}else e=this.leftOver.concat(e);this.leftOver=null}var i=function(t,e){var r;for((e=e||t.length)>t.length&&(e=t.length),r=e-1;0<=r&&128==(192&t[r]);)r--;return r<0?e:0===r?e:r+u[t[r]]>e?r:e}(e),n=e;i!==e.length&&(h.uint8array?(n=e.subarray(0,i),this.leftOver=e.subarray(i,e.length)):(n=e.slice(0,i),this.leftOver=e.slice(i,e.length))),this.push({data:s.utf8decode(n),meta:t.meta})},a.prototype.flush=function(){this.leftOver&&this.leftOver.length&&(this.push({data:s.utf8decode(this.leftOver),meta:{}}),this.leftOver=null)},s.Utf8DecodeWorker=a,o.inherits(l,i),l.prototype.processChunk=function(t){this.push({data:s.utf8encode(t.data),meta:t.meta})},s.Utf8EncodeWorker=l},{"./nodejsUtils":14,"./stream/GenericWorker":28,"./support":30,"./utils":32}],32:[function(t,e,a){"use strict";var o=t("./support"),h=t("./base64"),r=t("./nodejsUtils"),i=t("set-immediate-shim"),u=t("./external");function n(t){return t}function l(t,e){for(var r=0;r<t.length;++r)e[r]=255&t.charCodeAt(r);return e}a.newBlob=function(e,r){a.checkSupport("blob");try{return new Blob([e],{type:r})}catch(t){try{var i=new(self.BlobBuilder||self.WebKitBlobBuilder||self.MozBlobBuilder||self.MSBlobBuilder);return i.append(e),i.getBlob(r)}catch(t){throw new Error("Bug : can't construct the Blob.")}}};var s={stringifyByChunk:function(t,e,r){var i=[],n=0,s=t.length;if(s<=r)return String.fromCharCode.apply(null,t);for(;n<s;)"array"===e||"nodebuffer"===e?i.push(String.fromCharCode.apply(null,t.slice(n,Math.min(n+r,s)))):i.push(String.fromCharCode.apply(null,t.subarray(n,Math.min(n+r,s)))),n+=r;return i.join("")},stringifyByChar:function(t){for(var e="",r=0;r<t.length;r++)e+=String.fromCharCode(t[r]);return e},applyCanBeUsed:{uint8array:function(){try{return o.uint8array&&1===String.fromCharCode.apply(null,new Uint8Array(1)).length}catch(t){return!1}}(),nodebuffer:function(){try{return o.nodebuffer&&1===String.fromCharCode.apply(null,r.allocBuffer(1)).length}catch(t){return!1}}()}};function f(t){var e=65536,r=a.getTypeOf(t),i=!0;if("uint8array"===r?i=s.applyCanBeUsed.uint8array:"nodebuffer"===r&&(i=s.applyCanBeUsed.nodebuffer),i)for(;1<e;)try{return s.stringifyByChunk(t,r,e)}catch(t){e=Math.floor(e/2)}return s.stringifyByChar(t)}function d(t,e){for(var r=0;r<t.length;r++)e[r]=t[r];return e}a.applyFromCharCode=f;var c={};c.string={string:n,array:function(t){return l(t,new Array(t.length))},arraybuffer:function(t){return c.string.uint8array(t).buffer},uint8array:function(t){return l(t,new Uint8Array(t.length))},nodebuffer:function(t){return l(t,r.allocBuffer(t.length))}},c.array={string:f,array:n,arraybuffer:function(t){return new Uint8Array(t).buffer},uint8array:function(t){return new Uint8Array(t)},nodebuffer:function(t){return r.newBufferFrom(t)}},c.arraybuffer={string:function(t){return f(new Uint8Array(t))},array:function(t){return d(new Uint8Array(t),new Array(t.byteLength))},arraybuffer:n,uint8array:function(t){return new Uint8Array(t)},nodebuffer:function(t){return r.newBufferFrom(new Uint8Array(t))}},c.uint8array={string:f,array:function(t){return d(t,new Array(t.length))},arraybuffer:function(t){return t.buffer},uint8array:n,nodebuffer:function(t){return r.newBufferFrom(t)}},c.nodebuffer={string:f,array:function(t){return d(t,new Array(t.length))},arraybuffer:function(t){return c.nodebuffer.uint8array(t).buffer},uint8array:function(t){return d(t,new Uint8Array(t.length))},nodebuffer:n},a.transformTo=function(t,e){if(e=e||"",!t)return e;a.checkSupport(t);var r=a.getTypeOf(e);return c[r][t](e)},a.resolve=function(t){for(var e=t.split("/"),r=[],i=0;i<e.length;i++){var n=e[i];"."===n||""===n&&0!==i&&i!==e.length-1||(".."===n?r.pop():r.push(n))}return r.join("/")},a.getTypeOf=function(t){return"string"==typeof t?"string":"[object Array]"===Object.prototype.toString.call(t)?"array":o.nodebuffer&&r.isBuffer(t)?"nodebuffer":o.uint8array&&t instanceof Uint8Array?"uint8array":o.arraybuffer&&t instanceof ArrayBuffer?"arraybuffer":void 0},a.checkSupport=function(t){if(!o[t.toLowerCase()])throw new Error(t+" is not supported by this platform")},a.MAX_VALUE_16BITS=65535,a.MAX_VALUE_32BITS=-1,a.pretty=function(t){var e,r,i="";for(r=0;r<(t||"").length;r++)i+="\\x"+((e=t.charCodeAt(r))<16?"0":"")+e.toString(16).toUpperCase();return i},a.delay=function(t,e,r){i(function(){t.apply(r||null,e||[])})},a.inherits=function(t,e){function r(){}r.prototype=e.prototype,t.prototype=new r},a.extend=function(){var t,e,r={};for(t=0;t<arguments.length;t++)for(e in arguments[t])arguments[t].hasOwnProperty(e)&&void 0===r[e]&&(r[e]=arguments[t][e]);return r},a.prepareContent=function(r,t,i,n,s){return u.Promise.resolve(t).then(function(i){return o.blob&&(i instanceof Blob||-1!==["[object File]","[object Blob]"].indexOf(Object.prototype.toString.call(i)))&&"undefined"!=typeof FileReader?new u.Promise(function(e,r){var t=new FileReader;t.onload=function(t){e(t.target.result)},t.onerror=function(t){r(t.target.error)},t.readAsArrayBuffer(i)}):i}).then(function(t){var e=a.getTypeOf(t);return e?("arraybuffer"===e?t=a.transformTo("uint8array",t):"string"===e&&(s?t=h.decode(t):i&&!0!==n&&(t=function(t){return l(t,o.uint8array?new Uint8Array(t.length):new Array(t.length))}(t))),t):u.Promise.reject(new Error("Can't read the data of '"+r+"'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?"))})}},{"./base64":1,"./external":6,"./nodejsUtils":14,"./support":30,"set-immediate-shim":54}],33:[function(t,e,r){"use strict";var i=t("./reader/readerFor"),n=t("./utils"),s=t("./signature"),a=t("./zipEntry"),o=(t("./utf8"),t("./support"));function h(t){this.files=[],this.loadOptions=t}h.prototype={checkSignature:function(t){if(!this.reader.readAndCheckSignature(t)){this.reader.index-=4;var e=this.reader.readString(4);throw new Error("Corrupted zip or bug: unexpected signature ("+n.pretty(e)+", expected "+n.pretty(t)+")")}},isSignature:function(t,e){var r=this.reader.index;this.reader.setIndex(t);var i=this.reader.readString(4)===e;return this.reader.setIndex(r),i},readBlockEndOfCentral:function(){this.diskNumber=this.reader.readInt(2),this.diskWithCentralDirStart=this.reader.readInt(2),this.centralDirRecordsOnThisDisk=this.reader.readInt(2),this.centralDirRecords=this.reader.readInt(2),this.centralDirSize=this.reader.readInt(4),this.centralDirOffset=this.reader.readInt(4),this.zipCommentLength=this.reader.readInt(2);var t=this.reader.readData(this.zipCommentLength),e=o.uint8array?"uint8array":"array",r=n.transformTo(e,t);this.zipComment=this.loadOptions.decodeFileName(r)},readBlockZip64EndOfCentral:function(){this.zip64EndOfCentralSize=this.reader.readInt(8),this.reader.skip(4),this.diskNumber=this.reader.readInt(4),this.diskWithCentralDirStart=this.reader.readInt(4),this.centralDirRecordsOnThisDisk=this.reader.readInt(8),this.centralDirRecords=this.reader.readInt(8),this.centralDirSize=this.reader.readInt(8),this.centralDirOffset=this.reader.readInt(8),this.zip64ExtensibleData={};for(var t,e,r,i=this.zip64EndOfCentralSize-44;0<i;)t=this.reader.readInt(2),e=this.reader.readInt(4),r=this.reader.readData(e),this.zip64ExtensibleData[t]={id:t,length:e,value:r}},readBlockZip64EndOfCentralLocator:function(){if(this.diskWithZip64CentralDirStart=this.reader.readInt(4),this.relativeOffsetEndOfZip64CentralDir=this.reader.readInt(8),this.disksCount=this.reader.readInt(4),1<this.disksCount)throw new Error("Multi-volumes zip are not supported")},readLocalFiles:function(){var t,e;for(t=0;t<this.files.length;t++)e=this.files[t],this.reader.setIndex(e.localHeaderOffset),this.checkSignature(s.LOCAL_FILE_HEADER),e.readLocalPart(this.reader),e.handleUTF8(),e.processAttributes()},readCentralDir:function(){var t;for(this.reader.setIndex(this.centralDirOffset);this.reader.readAndCheckSignature(s.CENTRAL_FILE_HEADER);)(t=new a({zip64:this.zip64},this.loadOptions)).readCentralPart(this.reader),this.files.push(t);if(this.centralDirRecords!==this.files.length&&0!==this.centralDirRecords&&0===this.files.length)throw new Error("Corrupted zip or bug: expected "+this.centralDirRecords+" records in central dir, got "+this.files.length)},readEndOfCentral:function(){var t=this.reader.lastIndexOfSignature(s.CENTRAL_DIRECTORY_END);if(t<0)throw!this.isSignature(0,s.LOCAL_FILE_HEADER)?new Error("Can't find end of central directory : is this a zip file ? If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html"):new Error("Corrupted zip: can't find end of central directory");this.reader.setIndex(t);var e=t;if(this.checkSignature(s.CENTRAL_DIRECTORY_END),this.readBlockEndOfCentral(),this.diskNumber===n.MAX_VALUE_16BITS||this.diskWithCentralDirStart===n.MAX_VALUE_16BITS||this.centralDirRecordsOnThisDisk===n.MAX_VALUE_16BITS||this.centralDirRecords===n.MAX_VALUE_16BITS||this.centralDirSize===n.MAX_VALUE_32BITS||this.centralDirOffset===n.MAX_VALUE_32BITS){if(this.zip64=!0,(t=this.reader.lastIndexOfSignature(s.ZIP64_CENTRAL_DIRECTORY_LOCATOR))<0)throw new Error("Corrupted zip: can't find the ZIP64 end of central directory locator");if(this.reader.setIndex(t),this.checkSignature(s.ZIP64_CENTRAL_DIRECTORY_LOCATOR),this.readBlockZip64EndOfCentralLocator(),!this.isSignature(this.relativeOffsetEndOfZip64CentralDir,s.ZIP64_CENTRAL_DIRECTORY_END)&&(this.relativeOffsetEndOfZip64CentralDir=this.reader.lastIndexOfSignature(s.ZIP64_CENTRAL_DIRECTORY_END),this.relativeOffsetEndOfZip64CentralDir<0))throw new Error("Corrupted zip: can't find the ZIP64 end of central directory");this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir),this.checkSignature(s.ZIP64_CENTRAL_DIRECTORY_END),this.readBlockZip64EndOfCentral()}var r=this.centralDirOffset+this.centralDirSize;this.zip64&&(r+=20,r+=12+this.zip64EndOfCentralSize);var i=e-r;if(0<i)this.isSignature(e,s.CENTRAL_FILE_HEADER)||(this.reader.zero=i);else if(i<0)throw new Error("Corrupted zip: missing "+Math.abs(i)+" bytes.")},prepareReader:function(t){this.reader=i(t)},load:function(t){this.prepareReader(t),this.readEndOfCentral(),this.readCentralDir(),this.readLocalFiles()}},e.exports=h},{"./reader/readerFor":22,"./signature":23,"./support":30,"./utf8":31,"./utils":32,"./zipEntry":34}],34:[function(t,e,r){"use strict";var i=t("./reader/readerFor"),s=t("./utils"),n=t("./compressedObject"),a=t("./crc32"),o=t("./utf8"),h=t("./compressions"),u=t("./support");function l(t,e){this.options=t,this.loadOptions=e}l.prototype={isEncrypted:function(){return 1==(1&this.bitFlag)},useUTF8:function(){return 2048==(2048&this.bitFlag)},readLocalPart:function(t){var e,r;if(t.skip(22),this.fileNameLength=t.readInt(2),r=t.readInt(2),this.fileName=t.readData(this.fileNameLength),t.skip(r),-1===this.compressedSize||-1===this.uncompressedSize)throw new Error("Bug or corrupted zip : didn't get enough information from the central directory (compressedSize === -1 || uncompressedSize === -1)");if(null===(e=function(t){for(var e in h)if(h.hasOwnProperty(e)&&h[e].magic===t)return h[e];return null}(this.compressionMethod)))throw new Error("Corrupted zip : compression "+s.pretty(this.compressionMethod)+" unknown (inner file : "+s.transformTo("string",this.fileName)+")");this.decompressed=new n(this.compressedSize,this.uncompressedSize,this.crc32,e,t.readData(this.compressedSize))},readCentralPart:function(t){this.versionMadeBy=t.readInt(2),t.skip(2),this.bitFlag=t.readInt(2),this.compressionMethod=t.readString(2),this.date=t.readDate(),this.crc32=t.readInt(4),this.compressedSize=t.readInt(4),this.uncompressedSize=t.readInt(4);var e=t.readInt(2);if(this.extraFieldsLength=t.readInt(2),this.fileCommentLength=t.readInt(2),this.diskNumberStart=t.readInt(2),this.internalFileAttributes=t.readInt(2),this.externalFileAttributes=t.readInt(4),this.localHeaderOffset=t.readInt(4),this.isEncrypted())throw new Error("Encrypted zip are not supported");t.skip(e),this.readExtraFields(t),this.parseZIP64ExtraField(t),this.fileComment=t.readData(this.fileCommentLength)},processAttributes:function(){this.unixPermissions=null,this.dosPermissions=null;var t=this.versionMadeBy>>8;this.dir=!!(16&this.externalFileAttributes),0==t&&(this.dosPermissions=63&this.externalFileAttributes),3==t&&(this.unixPermissions=this.externalFileAttributes>>16&65535),this.dir||"/"!==this.fileNameStr.slice(-1)||(this.dir=!0)},parseZIP64ExtraField:function(t){if(this.extraFields[1]){var e=i(this.extraFields[1].value);this.uncompressedSize===s.MAX_VALUE_32BITS&&(this.uncompressedSize=e.readInt(8)),this.compressedSize===s.MAX_VALUE_32BITS&&(this.compressedSize=e.readInt(8)),this.localHeaderOffset===s.MAX_VALUE_32BITS&&(this.localHeaderOffset=e.readInt(8)),this.diskNumberStart===s.MAX_VALUE_32BITS&&(this.diskNumberStart=e.readInt(4))}},readExtraFields:function(t){var e,r,i,n=t.index+this.extraFieldsLength;for(this.extraFields||(this.extraFields={});t.index+4<n;)e=t.readInt(2),r=t.readInt(2),i=t.readData(r),this.extraFields[e]={id:e,length:r,value:i};t.setIndex(n)},handleUTF8:function(){var t=u.uint8array?"uint8array":"array";if(this.useUTF8())this.fileNameStr=o.utf8decode(this.fileName),this.fileCommentStr=o.utf8decode(this.fileComment);else{var e=this.findExtraFieldUnicodePath();if(null!==e)this.fileNameStr=e;else{var r=s.transformTo(t,this.fileName);this.fileNameStr=this.loadOptions.decodeFileName(r)}var i=this.findExtraFieldUnicodeComment();if(null!==i)this.fileCommentStr=i;else{var n=s.transformTo(t,this.fileComment);this.fileCommentStr=this.loadOptions.decodeFileName(n)}}},findExtraFieldUnicodePath:function(){var t=this.extraFields[28789];if(t){var e=i(t.value);return 1!==e.readInt(1)?null:a(this.fileName)!==e.readInt(4)?null:o.utf8decode(e.readData(t.length-5))}return null},findExtraFieldUnicodeComment:function(){var t=this.extraFields[25461];if(t){var e=i(t.value);return 1!==e.readInt(1)?null:a(this.fileComment)!==e.readInt(4)?null:o.utf8decode(e.readData(t.length-5))}return null}},e.exports=l},{"./compressedObject":2,"./compressions":3,"./crc32":4,"./reader/readerFor":22,"./support":30,"./utf8":31,"./utils":32}],35:[function(t,e,r){"use strict";function i(t,e,r){this.name=t,this.dir=r.dir,this.date=r.date,this.comment=r.comment,this.unixPermissions=r.unixPermissions,this.dosPermissions=r.dosPermissions,this._data=e,this._dataBinary=r.binary,this.options={compression:r.compression,compressionOptions:r.compressionOptions}}var s=t("./stream/StreamHelper"),n=t("./stream/DataWorker"),a=t("./utf8"),o=t("./compressedObject"),h=t("./stream/GenericWorker");i.prototype={internalStream:function(t){var e=null,r="string";try{if(!t)throw new Error("No output type specified.");var i="string"===(r=t.toLowerCase())||"text"===r;"binarystring"!==r&&"text"!==r||(r="string"),e=this._decompressWorker();var n=!this._dataBinary;n&&!i&&(e=e.pipe(new a.Utf8EncodeWorker)),!n&&i&&(e=e.pipe(new a.Utf8DecodeWorker))}catch(t){(e=new h("error")).error(t)}return new s(e,r,"")},async:function(t,e){return this.internalStream(t).accumulate(e)},nodeStream:function(t,e){return this.internalStream(t||"nodebuffer").toNodejsStream(e)},_compressWorker:function(t,e){if(this._data instanceof o&&this._data.compression.magic===t.magic)return this._data.getCompressedWorker();var r=this._decompressWorker();return this._dataBinary||(r=r.pipe(new a.Utf8EncodeWorker)),o.createWorkerFrom(r,t,e)},_decompressWorker:function(){return this._data instanceof o?this._data.getContentWorker():this._data instanceof h?this._data:new n(this._data)}};for(var u=["asText","asBinary","asNodeBuffer","asUint8Array","asArrayBuffer"],l=function(){throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.")},f=0;f<u.length;f++)i.prototype[u[f]]=l;e.exports=i},{"./compressedObject":2,"./stream/DataWorker":27,"./stream/GenericWorker":28,"./stream/StreamHelper":29,"./utf8":31}],36:[function(t,l,e){(function(e){"use strict";var r,i,t=e.MutationObserver||e.WebKitMutationObserver;if(t){var n=0,s=new t(u),a=e.document.createTextNode("");s.observe(a,{characterData:!0}),r=function(){a.data=n=++n%2}}else if(e.setImmediate||void 0===e.MessageChannel)r="document"in e&&"onreadystatechange"in e.document.createElement("script")?function(){var t=e.document.createElement("script");t.onreadystatechange=function(){u(),t.onreadystatechange=null,t.parentNode.removeChild(t),t=null},e.document.documentElement.appendChild(t)}:function(){setTimeout(u,0)};else{var o=new e.MessageChannel;o.port1.onmessage=u,r=function(){o.port2.postMessage(0)}}var h=[];function u(){var t,e;i=!0;for(var r=h.length;r;){for(e=h,h=[],t=-1;++t<r;)e[t]();r=h.length}i=!1}l.exports=function(t){1!==h.push(t)||i||r()}}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],37:[function(t,e,r){"use strict";var n=t("immediate");function u(){}var l={},s=["REJECTED"],a=["FULFILLED"],i=["PENDING"];function o(t){if("function"!=typeof t)throw new TypeError("resolver must be a function");this.state=i,this.queue=[],this.outcome=void 0,t!==u&&c(this,t)}function h(t,e,r){this.promise=t,"function"==typeof e&&(this.onFulfilled=e,this.callFulfilled=this.otherCallFulfilled),"function"==typeof r&&(this.onRejected=r,this.callRejected=this.otherCallRejected)}function f(e,r,i){n(function(){var t;try{t=r(i)}catch(t){return l.reject(e,t)}t===e?l.reject(e,new TypeError("Cannot resolve promise with itself")):l.resolve(e,t)})}function d(t){var e=t&&t.then;if(t&&("object"==typeof t||"function"==typeof t)&&"function"==typeof e)return function(){e.apply(t,arguments)}}function c(e,t){var r=!1;function i(t){r||(r=!0,l.reject(e,t))}function n(t){r||(r=!0,l.resolve(e,t))}var s=p(function(){t(n,i)});"error"===s.status&&i(s.value)}function p(t,e){var r={};try{r.value=t(e),r.status="success"}catch(t){r.status="error",r.value=t}return r}(e.exports=o).prototype.finally=function(e){if("function"!=typeof e)return this;var r=this.constructor;return this.then(function(t){return r.resolve(e()).then(function(){return t})},function(t){return r.resolve(e()).then(function(){throw t})})},o.prototype.catch=function(t){return this.then(null,t)},o.prototype.then=function(t,e){if("function"!=typeof t&&this.state===a||"function"!=typeof e&&this.state===s)return this;var r=new this.constructor(u);this.state!==i?f(r,this.state===a?t:e,this.outcome):this.queue.push(new h(r,t,e));return r},h.prototype.callFulfilled=function(t){l.resolve(this.promise,t)},h.prototype.otherCallFulfilled=function(t){f(this.promise,this.onFulfilled,t)},h.prototype.callRejected=function(t){l.reject(this.promise,t)},h.prototype.otherCallRejected=function(t){f(this.promise,this.onRejected,t)},l.resolve=function(t,e){var r=p(d,e);if("error"===r.status)return l.reject(t,r.value);var i=r.value;if(i)c(t,i);else{t.state=a,t.outcome=e;for(var n=-1,s=t.queue.length;++n<s;)t.queue[n].callFulfilled(e)}return t},l.reject=function(t,e){t.state=s,t.outcome=e;for(var r=-1,i=t.queue.length;++r<i;)t.queue[r].callRejected(e);return t},o.resolve=function(t){if(t instanceof this)return t;return l.resolve(new this(u),t)},o.reject=function(t){var e=new this(u);return l.reject(e,t)},o.all=function(t){var r=this;if("[object Array]"!==Object.prototype.toString.call(t))return this.reject(new TypeError("must be an array"));var i=t.length,n=!1;if(!i)return this.resolve([]);var s=new Array(i),a=0,e=-1,o=new this(u);for(;++e<i;)h(t[e],e);return o;function h(t,e){r.resolve(t).then(function(t){s[e]=t,++a!==i||n||(n=!0,l.resolve(o,s))},function(t){n||(n=!0,l.reject(o,t))})}},o.race=function(t){var e=this;if("[object Array]"!==Object.prototype.toString.call(t))return this.reject(new TypeError("must be an array"));var r=t.length,i=!1;if(!r)return this.resolve([]);var n=-1,s=new this(u);for(;++n<r;)a=t[n],e.resolve(a).then(function(t){i||(i=!0,l.resolve(s,t))},function(t){i||(i=!0,l.reject(s,t))});var a;return s}},{immediate:36}],38:[function(t,e,r){"use strict";var i={};(0,t("./lib/utils/common").assign)(i,t("./lib/deflate"),t("./lib/inflate"),t("./lib/zlib/constants")),e.exports=i},{"./lib/deflate":39,"./lib/inflate":40,"./lib/utils/common":41,"./lib/zlib/constants":44}],39:[function(t,e,r){"use strict";var a=t("./zlib/deflate"),o=t("./utils/common"),h=t("./utils/strings"),n=t("./zlib/messages"),s=t("./zlib/zstream"),u=Object.prototype.toString,l=0,f=-1,d=0,c=8;function p(t){if(!(this instanceof p))return new p(t);this.options=o.assign({level:f,method:c,chunkSize:16384,windowBits:15,memLevel:8,strategy:d,to:""},t||{});var e=this.options;e.raw&&0<e.windowBits?e.windowBits=-e.windowBits:e.gzip&&0<e.windowBits&&e.windowBits<16&&(e.windowBits+=16),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new s,this.strm.avail_out=0;var r=a.deflateInit2(this.strm,e.level,e.method,e.windowBits,e.memLevel,e.strategy);if(r!==l)throw new Error(n[r]);if(e.header&&a.deflateSetHeader(this.strm,e.header),e.dictionary){var i;if(i="string"==typeof e.dictionary?h.string2buf(e.dictionary):"[object ArrayBuffer]"===u.call(e.dictionary)?new Uint8Array(e.dictionary):e.dictionary,(r=a.deflateSetDictionary(this.strm,i))!==l)throw new Error(n[r]);this._dict_set=!0}}function i(t,e){var r=new p(e);if(r.push(t,!0),r.err)throw r.msg||n[r.err];return r.result}p.prototype.push=function(t,e){var r,i,n=this.strm,s=this.options.chunkSize;if(this.ended)return!1;i=e===~~e?e:!0===e?4:0,"string"==typeof t?n.input=h.string2buf(t):"[object ArrayBuffer]"===u.call(t)?n.input=new Uint8Array(t):n.input=t,n.next_in=0,n.avail_in=n.input.length;do{if(0===n.avail_out&&(n.output=new o.Buf8(s),n.next_out=0,n.avail_out=s),1!==(r=a.deflate(n,i))&&r!==l)return this.onEnd(r),!(this.ended=!0);0!==n.avail_out&&(0!==n.avail_in||4!==i&&2!==i)||("string"===this.options.to?this.onData(h.buf2binstring(o.shrinkBuf(n.output,n.next_out))):this.onData(o.shrinkBuf(n.output,n.next_out)))}while((0<n.avail_in||0===n.avail_out)&&1!==r);return 4===i?(r=a.deflateEnd(this.strm),this.onEnd(r),this.ended=!0,r===l):2!==i||(this.onEnd(l),!(n.avail_out=0))},p.prototype.onData=function(t){this.chunks.push(t)},p.prototype.onEnd=function(t){t===l&&("string"===this.options.to?this.result=this.chunks.join(""):this.result=o.flattenChunks(this.chunks)),this.chunks=[],this.err=t,this.msg=this.strm.msg},r.Deflate=p,r.deflate=i,r.deflateRaw=function(t,e){return(e=e||{}).raw=!0,i(t,e)},r.gzip=function(t,e){return(e=e||{}).gzip=!0,i(t,e)}},{"./utils/common":41,"./utils/strings":42,"./zlib/deflate":46,"./zlib/messages":51,"./zlib/zstream":53}],40:[function(t,e,r){"use strict";var d=t("./zlib/inflate"),c=t("./utils/common"),p=t("./utils/strings"),m=t("./zlib/constants"),i=t("./zlib/messages"),n=t("./zlib/zstream"),s=t("./zlib/gzheader"),_=Object.prototype.toString;function a(t){if(!(this instanceof a))return new a(t);this.options=c.assign({chunkSize:16384,windowBits:0,to:""},t||{});var e=this.options;e.raw&&0<=e.windowBits&&e.windowBits<16&&(e.windowBits=-e.windowBits,0===e.windowBits&&(e.windowBits=-15)),!(0<=e.windowBits&&e.windowBits<16)||t&&t.windowBits||(e.windowBits+=32),15<e.windowBits&&e.windowBits<48&&0==(15&e.windowBits)&&(e.windowBits|=15),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new n,this.strm.avail_out=0;var r=d.inflateInit2(this.strm,e.windowBits);if(r!==m.Z_OK)throw new Error(i[r]);this.header=new s,d.inflateGetHeader(this.strm,this.header)}function o(t,e){var r=new a(e);if(r.push(t,!0),r.err)throw r.msg||i[r.err];return r.result}a.prototype.push=function(t,e){var r,i,n,s,a,o,h=this.strm,u=this.options.chunkSize,l=this.options.dictionary,f=!1;if(this.ended)return!1;i=e===~~e?e:!0===e?m.Z_FINISH:m.Z_NO_FLUSH,"string"==typeof t?h.input=p.binstring2buf(t):"[object ArrayBuffer]"===_.call(t)?h.input=new Uint8Array(t):h.input=t,h.next_in=0,h.avail_in=h.input.length;do{if(0===h.avail_out&&(h.output=new c.Buf8(u),h.next_out=0,h.avail_out=u),(r=d.inflate(h,m.Z_NO_FLUSH))===m.Z_NEED_DICT&&l&&(o="string"==typeof l?p.string2buf(l):"[object ArrayBuffer]"===_.call(l)?new Uint8Array(l):l,r=d.inflateSetDictionary(this.strm,o)),r===m.Z_BUF_ERROR&&!0===f&&(r=m.Z_OK,f=!1),r!==m.Z_STREAM_END&&r!==m.Z_OK)return this.onEnd(r),!(this.ended=!0);h.next_out&&(0!==h.avail_out&&r!==m.Z_STREAM_END&&(0!==h.avail_in||i!==m.Z_FINISH&&i!==m.Z_SYNC_FLUSH)||("string"===this.options.to?(n=p.utf8border(h.output,h.next_out),s=h.next_out-n,a=p.buf2string(h.output,n),h.next_out=s,h.avail_out=u-s,s&&c.arraySet(h.output,h.output,n,s,0),this.onData(a)):this.onData(c.shrinkBuf(h.output,h.next_out)))),0===h.avail_in&&0===h.avail_out&&(f=!0)}while((0<h.avail_in||0===h.avail_out)&&r!==m.Z_STREAM_END);return r===m.Z_STREAM_END&&(i=m.Z_FINISH),i===m.Z_FINISH?(r=d.inflateEnd(this.strm),this.onEnd(r),this.ended=!0,r===m.Z_OK):i!==m.Z_SYNC_FLUSH||(this.onEnd(m.Z_OK),!(h.avail_out=0))},a.prototype.onData=function(t){this.chunks.push(t)},a.prototype.onEnd=function(t){t===m.Z_OK&&("string"===this.options.to?this.result=this.chunks.join(""):this.result=c.flattenChunks(this.chunks)),this.chunks=[],this.err=t,this.msg=this.strm.msg},r.Inflate=a,r.inflate=o,r.inflateRaw=function(t,e){return(e=e||{}).raw=!0,o(t,e)},r.ungzip=o},{"./utils/common":41,"./utils/strings":42,"./zlib/constants":44,"./zlib/gzheader":47,"./zlib/inflate":49,"./zlib/messages":51,"./zlib/zstream":53}],41:[function(t,e,r){"use strict";var i="undefined"!=typeof Uint8Array&&"undefined"!=typeof Uint16Array&&"undefined"!=typeof Int32Array;r.assign=function(t){for(var e=Array.prototype.slice.call(arguments,1);e.length;){var r=e.shift();if(r){if("object"!=typeof r)throw new TypeError(r+"must be non-object");for(var i in r)r.hasOwnProperty(i)&&(t[i]=r[i])}}return t},r.shrinkBuf=function(t,e){return t.length===e?t:t.subarray?t.subarray(0,e):(t.length=e,t)};var n={arraySet:function(t,e,r,i,n){if(e.subarray&&t.subarray)t.set(e.subarray(r,r+i),n);else for(var s=0;s<i;s++)t[n+s]=e[r+s]},flattenChunks:function(t){var e,r,i,n,s,a;for(e=i=0,r=t.length;e<r;e++)i+=t[e].length;for(a=new Uint8Array(i),e=n=0,r=t.length;e<r;e++)s=t[e],a.set(s,n),n+=s.length;return a}},s={arraySet:function(t,e,r,i,n){for(var s=0;s<i;s++)t[n+s]=e[r+s]},flattenChunks:function(t){return[].concat.apply([],t)}};r.setTyped=function(t){t?(r.Buf8=Uint8Array,r.Buf16=Uint16Array,r.Buf32=Int32Array,r.assign(r,n)):(r.Buf8=Array,r.Buf16=Array,r.Buf32=Array,r.assign(r,s))},r.setTyped(i)},{}],42:[function(t,e,r){"use strict";var h=t("./common"),n=!0,s=!0;try{String.fromCharCode.apply(null,[0])}catch(t){n=!1}try{String.fromCharCode.apply(null,new Uint8Array(1))}catch(t){s=!1}for(var u=new h.Buf8(256),i=0;i<256;i++)u[i]=252<=i?6:248<=i?5:240<=i?4:224<=i?3:192<=i?2:1;function l(t,e){if(e<65537&&(t.subarray&&s||!t.subarray&&n))return String.fromCharCode.apply(null,h.shrinkBuf(t,e));for(var r="",i=0;i<e;i++)r+=String.fromCharCode(t[i]);return r}u[254]=u[254]=1,r.string2buf=function(t){var e,r,i,n,s,a=t.length,o=0;for(n=0;n<a;n++)55296==(64512&(r=t.charCodeAt(n)))&&n+1<a&&56320==(64512&(i=t.charCodeAt(n+1)))&&(r=65536+(r-55296<<10)+(i-56320),n++),o+=r<128?1:r<2048?2:r<65536?3:4;for(e=new h.Buf8(o),n=s=0;s<o;n++)55296==(64512&(r=t.charCodeAt(n)))&&n+1<a&&56320==(64512&(i=t.charCodeAt(n+1)))&&(r=65536+(r-55296<<10)+(i-56320),n++),r<128?e[s++]=r:(r<2048?e[s++]=192|r>>>6:(r<65536?e[s++]=224|r>>>12:(e[s++]=240|r>>>18,e[s++]=128|r>>>12&63),e[s++]=128|r>>>6&63),e[s++]=128|63&r);return e},r.buf2binstring=function(t){return l(t,t.length)},r.binstring2buf=function(t){for(var e=new h.Buf8(t.length),r=0,i=e.length;r<i;r++)e[r]=t.charCodeAt(r);return e},r.buf2string=function(t,e){var r,i,n,s,a=e||t.length,o=new Array(2*a);for(r=i=0;r<a;)if((n=t[r++])<128)o[i++]=n;else if(4<(s=u[n]))o[i++]=65533,r+=s-1;else{for(n&=2===s?31:3===s?15:7;1<s&&r<a;)n=n<<6|63&t[r++],s--;1<s?o[i++]=65533:n<65536?o[i++]=n:(n-=65536,o[i++]=55296|n>>10&1023,o[i++]=56320|1023&n)}return l(o,i)},r.utf8border=function(t,e){var r;for((e=e||t.length)>t.length&&(e=t.length),r=e-1;0<=r&&128==(192&t[r]);)r--;return r<0?e:0===r?e:r+u[t[r]]>e?r:e}},{"./common":41}],43:[function(t,e,r){"use strict";e.exports=function(t,e,r,i){for(var n=65535&t|0,s=t>>>16&65535|0,a=0;0!==r;){for(r-=a=2e3<r?2e3:r;s=s+(n=n+e[i++]|0)|0,--a;);n%=65521,s%=65521}return n|s<<16|0}},{}],44:[function(t,e,r){"use strict";e.exports={Z_NO_FLUSH:0,Z_PARTIAL_FLUSH:1,Z_SYNC_FLUSH:2,Z_FULL_FLUSH:3,Z_FINISH:4,Z_BLOCK:5,Z_TREES:6,Z_OK:0,Z_STREAM_END:1,Z_NEED_DICT:2,Z_ERRNO:-1,Z_STREAM_ERROR:-2,Z_DATA_ERROR:-3,Z_BUF_ERROR:-5,Z_NO_COMPRESSION:0,Z_BEST_SPEED:1,Z_BEST_COMPRESSION:9,Z_DEFAULT_COMPRESSION:-1,Z_FILTERED:1,Z_HUFFMAN_ONLY:2,Z_RLE:3,Z_FIXED:4,Z_DEFAULT_STRATEGY:0,Z_BINARY:0,Z_TEXT:1,Z_UNKNOWN:2,Z_DEFLATED:8}},{}],45:[function(t,e,r){"use strict";var o=function(){for(var t,e=[],r=0;r<256;r++){t=r;for(var i=0;i<8;i++)t=1&t?3988292384^t>>>1:t>>>1;e[r]=t}return e}();e.exports=function(t,e,r,i){var n=o,s=i+r;t^=-1;for(var a=i;a<s;a++)t=t>>>8^n[255&(t^e[a])];return-1^t}},{}],46:[function(t,e,r){"use strict";var h,d=t("../utils/common"),u=t("./trees"),c=t("./adler32"),p=t("./crc32"),i=t("./messages"),l=0,f=4,m=0,_=-2,g=-1,b=4,n=2,v=8,y=9,s=286,a=30,o=19,w=2*s+1,k=15,x=3,S=258,z=S+x+1,C=42,E=113,A=1,I=2,O=3,B=4;function R(t,e){return t.msg=i[e],e}function T(t){return(t<<1)-(4<t?9:0)}function D(t){for(var e=t.length;0<=--e;)t[e]=0}function F(t){var e=t.state,r=e.pending;r>t.avail_out&&(r=t.avail_out),0!==r&&(d.arraySet(t.output,e.pending_buf,e.pending_out,r,t.next_out),t.next_out+=r,e.pending_out+=r,t.total_out+=r,t.avail_out-=r,e.pending-=r,0===e.pending&&(e.pending_out=0))}function N(t,e){u._tr_flush_block(t,0<=t.block_start?t.block_start:-1,t.strstart-t.block_start,e),t.block_start=t.strstart,F(t.strm)}function U(t,e){t.pending_buf[t.pending++]=e}function P(t,e){t.pending_buf[t.pending++]=e>>>8&255,t.pending_buf[t.pending++]=255&e}function L(t,e){var r,i,n=t.max_chain_length,s=t.strstart,a=t.prev_length,o=t.nice_match,h=t.strstart>t.w_size-z?t.strstart-(t.w_size-z):0,u=t.window,l=t.w_mask,f=t.prev,d=t.strstart+S,c=u[s+a-1],p=u[s+a];t.prev_length>=t.good_match&&(n>>=2),o>t.lookahead&&(o=t.lookahead);do{if(u[(r=e)+a]===p&&u[r+a-1]===c&&u[r]===u[s]&&u[++r]===u[s+1]){s+=2,r++;do{}while(u[++s]===u[++r]&&u[++s]===u[++r]&&u[++s]===u[++r]&&u[++s]===u[++r]&&u[++s]===u[++r]&&u[++s]===u[++r]&&u[++s]===u[++r]&&u[++s]===u[++r]&&s<d);if(i=S-(d-s),s=d-S,a<i){if(t.match_start=e,o<=(a=i))break;c=u[s+a-1],p=u[s+a]}}}while((e=f[e&l])>h&&0!=--n);return a<=t.lookahead?a:t.lookahead}function j(t){var e,r,i,n,s,a,o,h,u,l,f=t.w_size;do{if(n=t.window_size-t.lookahead-t.strstart,t.strstart>=f+(f-z)){for(d.arraySet(t.window,t.window,f,f,0),t.match_start-=f,t.strstart-=f,t.block_start-=f,e=r=t.hash_size;i=t.head[--e],t.head[e]=f<=i?i-f:0,--r;);for(e=r=f;i=t.prev[--e],t.prev[e]=f<=i?i-f:0,--r;);n+=f}if(0===t.strm.avail_in)break;if(a=t.strm,o=t.window,h=t.strstart+t.lookahead,u=n,l=void 0,l=a.avail_in,u<l&&(l=u),r=0===l?0:(a.avail_in-=l,d.arraySet(o,a.input,a.next_in,l,h),1===a.state.wrap?a.adler=c(a.adler,o,l,h):2===a.state.wrap&&(a.adler=p(a.adler,o,l,h)),a.next_in+=l,a.total_in+=l,l),t.lookahead+=r,t.lookahead+t.insert>=x)for(s=t.strstart-t.insert,t.ins_h=t.window[s],t.ins_h=(t.ins_h<<t.hash_shift^t.window[s+1])&t.hash_mask;t.insert&&(t.ins_h=(t.ins_h<<t.hash_shift^t.window[s+x-1])&t.hash_mask,t.prev[s&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=s,s++,t.insert--,!(t.lookahead+t.insert<x)););}while(t.lookahead<z&&0!==t.strm.avail_in)}function Z(t,e){for(var r,i;;){if(t.lookahead<z){if(j(t),t.lookahead<z&&e===l)return A;if(0===t.lookahead)break}if(r=0,t.lookahead>=x&&(t.ins_h=(t.ins_h<<t.hash_shift^t.window[t.strstart+x-1])&t.hash_mask,r=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart),0!==r&&t.strstart-r<=t.w_size-z&&(t.match_length=L(t,r)),t.match_length>=x)if(i=u._tr_tally(t,t.strstart-t.match_start,t.match_length-x),t.lookahead-=t.match_length,t.match_length<=t.max_lazy_match&&t.lookahead>=x){for(t.match_length--;t.strstart++,t.ins_h=(t.ins_h<<t.hash_shift^t.window[t.strstart+x-1])&t.hash_mask,r=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart,0!=--t.match_length;);t.strstart++}else t.strstart+=t.match_length,t.match_length=0,t.ins_h=t.window[t.strstart],t.ins_h=(t.ins_h<<t.hash_shift^t.window[t.strstart+1])&t.hash_mask;else i=u._tr_tally(t,0,t.window[t.strstart]),t.lookahead--,t.strstart++;if(i&&(N(t,!1),0===t.strm.avail_out))return A}return t.insert=t.strstart<x-1?t.strstart:x-1,e===f?(N(t,!0),0===t.strm.avail_out?O:B):t.last_lit&&(N(t,!1),0===t.strm.avail_out)?A:I}function W(t,e){for(var r,i,n;;){if(t.lookahead<z){if(j(t),t.lookahead<z&&e===l)return A;if(0===t.lookahead)break}if(r=0,t.lookahead>=x&&(t.ins_h=(t.ins_h<<t.hash_shift^t.window[t.strstart+x-1])&t.hash_mask,r=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart),t.prev_length=t.match_length,t.prev_match=t.match_start,t.match_length=x-1,0!==r&&t.prev_length<t.max_lazy_match&&t.strstart-r<=t.w_size-z&&(t.match_length=L(t,r),t.match_length<=5&&(1===t.strategy||t.match_length===x&&4096<t.strstart-t.match_start)&&(t.match_length=x-1)),t.prev_length>=x&&t.match_length<=t.prev_length){for(n=t.strstart+t.lookahead-x,i=u._tr_tally(t,t.strstart-1-t.prev_match,t.prev_length-x),t.lookahead-=t.prev_length-1,t.prev_length-=2;++t.strstart<=n&&(t.ins_h=(t.ins_h<<t.hash_shift^t.window[t.strstart+x-1])&t.hash_mask,r=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart),0!=--t.prev_length;);if(t.match_available=0,t.match_length=x-1,t.strstart++,i&&(N(t,!1),0===t.strm.avail_out))return A}else if(t.match_available){if((i=u._tr_tally(t,0,t.window[t.strstart-1]))&&N(t,!1),t.strstart++,t.lookahead--,0===t.strm.avail_out)return A}else t.match_available=1,t.strstart++,t.lookahead--}return t.match_available&&(i=u._tr_tally(t,0,t.window[t.strstart-1]),t.match_available=0),t.insert=t.strstart<x-1?t.strstart:x-1,e===f?(N(t,!0),0===t.strm.avail_out?O:B):t.last_lit&&(N(t,!1),0===t.strm.avail_out)?A:I}function M(t,e,r,i,n){this.good_length=t,this.max_lazy=e,this.nice_length=r,this.max_chain=i,this.func=n}function H(){this.strm=null,this.status=0,this.pending_buf=null,this.pending_buf_size=0,this.pending_out=0,this.pending=0,this.wrap=0,this.gzhead=null,this.gzindex=0,this.method=v,this.last_flush=-1,this.w_size=0,this.w_bits=0,this.w_mask=0,this.window=null,this.window_size=0,this.prev=null,this.head=null,this.ins_h=0,this.hash_size=0,this.hash_bits=0,this.hash_mask=0,this.hash_shift=0,this.block_start=0,this.match_length=0,this.prev_match=0,this.match_available=0,this.strstart=0,this.match_start=0,this.lookahead=0,this.prev_length=0,this.max_chain_length=0,this.max_lazy_match=0,this.level=0,this.strategy=0,this.good_match=0,this.nice_match=0,this.dyn_ltree=new d.Buf16(2*w),this.dyn_dtree=new d.Buf16(2*(2*a+1)),this.bl_tree=new d.Buf16(2*(2*o+1)),D(this.dyn_ltree),D(this.dyn_dtree),D(this.bl_tree),this.l_desc=null,this.d_desc=null,this.bl_desc=null,this.bl_count=new d.Buf16(k+1),this.heap=new d.Buf16(2*s+1),D(this.heap),this.heap_len=0,this.heap_max=0,this.depth=new d.Buf16(2*s+1),D(this.depth),this.l_buf=0,this.lit_bufsize=0,this.last_lit=0,this.d_buf=0,this.opt_len=0,this.static_len=0,this.matches=0,this.insert=0,this.bi_buf=0,this.bi_valid=0}function G(t){var e;return t&&t.state?(t.total_in=t.total_out=0,t.data_type=n,(e=t.state).pending=0,e.pending_out=0,e.wrap<0&&(e.wrap=-e.wrap),e.status=e.wrap?C:E,t.adler=2===e.wrap?0:1,e.last_flush=l,u._tr_init(e),m):R(t,_)}function K(t){var e=G(t);return e===m&&function(t){t.window_size=2*t.w_size,D(t.head),t.max_lazy_match=h[t.level].max_lazy,t.good_match=h[t.level].good_length,t.nice_match=h[t.level].nice_length,t.max_chain_length=h[t.level].max_chain,t.strstart=0,t.block_start=0,t.lookahead=0,t.insert=0,t.match_length=t.prev_length=x-1,t.match_available=0,t.ins_h=0}(t.state),e}function Y(t,e,r,i,n,s){if(!t)return _;var a=1;if(e===g&&(e=6),i<0?(a=0,i=-i):15<i&&(a=2,i-=16),n<1||y<n||r!==v||i<8||15<i||e<0||9<e||s<0||b<s)return R(t,_);8===i&&(i=9);var o=new H;return(t.state=o).strm=t,o.wrap=a,o.gzhead=null,o.w_bits=i,o.w_size=1<<o.w_bits,o.w_mask=o.w_size-1,o.hash_bits=n+7,o.hash_size=1<<o.hash_bits,o.hash_mask=o.hash_size-1,o.hash_shift=~~((o.hash_bits+x-1)/x),o.window=new d.Buf8(2*o.w_size),o.head=new d.Buf16(o.hash_size),o.prev=new d.Buf16(o.w_size),o.lit_bufsize=1<<n+6,o.pending_buf_size=4*o.lit_bufsize,o.pending_buf=new d.Buf8(o.pending_buf_size),o.d_buf=1*o.lit_bufsize,o.l_buf=3*o.lit_bufsize,o.level=e,o.strategy=s,o.method=r,K(t)}h=[new M(0,0,0,0,function(t,e){var r=65535;for(r>t.pending_buf_size-5&&(r=t.pending_buf_size-5);;){if(t.lookahead<=1){if(j(t),0===t.lookahead&&e===l)return A;if(0===t.lookahead)break}t.strstart+=t.lookahead,t.lookahead=0;var i=t.block_start+r;if((0===t.strstart||t.strstart>=i)&&(t.lookahead=t.strstart-i,t.strstart=i,N(t,!1),0===t.strm.avail_out))return A;if(t.strstart-t.block_start>=t.w_size-z&&(N(t,!1),0===t.strm.avail_out))return A}return t.insert=0,e===f?(N(t,!0),0===t.strm.avail_out?O:B):(t.strstart>t.block_start&&(N(t,!1),t.strm.avail_out),A)}),new M(4,4,8,4,Z),new M(4,5,16,8,Z),new M(4,6,32,32,Z),new M(4,4,16,16,W),new M(8,16,32,32,W),new M(8,16,128,128,W),new M(8,32,128,256,W),new M(32,128,258,1024,W),new M(32,258,258,4096,W)],r.deflateInit=function(t,e){return Y(t,e,v,15,8,0)},r.deflateInit2=Y,r.deflateReset=K,r.deflateResetKeep=G,r.deflateSetHeader=function(t,e){return t&&t.state?2!==t.state.wrap?_:(t.state.gzhead=e,m):_},r.deflate=function(t,e){var r,i,n,s;if(!t||!t.state||5<e||e<0)return t?R(t,_):_;if(i=t.state,!t.output||!t.input&&0!==t.avail_in||666===i.status&&e!==f)return R(t,0===t.avail_out?-5:_);if(i.strm=t,r=i.last_flush,i.last_flush=e,i.status===C)if(2===i.wrap)t.adler=0,U(i,31),U(i,139),U(i,8),i.gzhead?(U(i,(i.gzhead.text?1:0)+(i.gzhead.hcrc?2:0)+(i.gzhead.extra?4:0)+(i.gzhead.name?8:0)+(i.gzhead.comment?16:0)),U(i,255&i.gzhead.time),U(i,i.gzhead.time>>8&255),U(i,i.gzhead.time>>16&255),U(i,i.gzhead.time>>24&255),U(i,9===i.level?2:2<=i.strategy||i.level<2?4:0),U(i,255&i.gzhead.os),i.gzhead.extra&&i.gzhead.extra.length&&(U(i,255&i.gzhead.extra.length),U(i,i.gzhead.extra.length>>8&255)),i.gzhead.hcrc&&(t.adler=p(t.adler,i.pending_buf,i.pending,0)),i.gzindex=0,i.status=69):(U(i,0),U(i,0),U(i,0),U(i,0),U(i,0),U(i,9===i.level?2:2<=i.strategy||i.level<2?4:0),U(i,3),i.status=E);else{var a=v+(i.w_bits-8<<4)<<8;a|=(2<=i.strategy||i.level<2?0:i.level<6?1:6===i.level?2:3)<<6,0!==i.strstart&&(a|=32),a+=31-a%31,i.status=E,P(i,a),0!==i.strstart&&(P(i,t.adler>>>16),P(i,65535&t.adler)),t.adler=1}if(69===i.status)if(i.gzhead.extra){for(n=i.pending;i.gzindex<(65535&i.gzhead.extra.length)&&(i.pending!==i.pending_buf_size||(i.gzhead.hcrc&&i.pending>n&&(t.adler=p(t.adler,i.pending_buf,i.pending-n,n)),F(t),n=i.pending,i.pending!==i.pending_buf_size));)U(i,255&i.gzhead.extra[i.gzindex]),i.gzindex++;i.gzhead.hcrc&&i.pending>n&&(t.adler=p(t.adler,i.pending_buf,i.pending-n,n)),i.gzindex===i.gzhead.extra.length&&(i.gzindex=0,i.status=73)}else i.status=73;if(73===i.status)if(i.gzhead.name){n=i.pending;do{if(i.pending===i.pending_buf_size&&(i.gzhead.hcrc&&i.pending>n&&(t.adler=p(t.adler,i.pending_buf,i.pending-n,n)),F(t),n=i.pending,i.pending===i.pending_buf_size)){s=1;break}s=i.gzindex<i.gzhead.name.length?255&i.gzhead.name.charCodeAt(i.gzindex++):0,U(i,s)}while(0!==s);i.gzhead.hcrc&&i.pending>n&&(t.adler=p(t.adler,i.pending_buf,i.pending-n,n)),0===s&&(i.gzindex=0,i.status=91)}else i.status=91;if(91===i.status)if(i.gzhead.comment){n=i.pending;do{if(i.pending===i.pending_buf_size&&(i.gzhead.hcrc&&i.pending>n&&(t.adler=p(t.adler,i.pending_buf,i.pending-n,n)),F(t),n=i.pending,i.pending===i.pending_buf_size)){s=1;break}s=i.gzindex<i.gzhead.comment.length?255&i.gzhead.comment.charCodeAt(i.gzindex++):0,U(i,s)}while(0!==s);i.gzhead.hcrc&&i.pending>n&&(t.adler=p(t.adler,i.pending_buf,i.pending-n,n)),0===s&&(i.status=103)}else i.status=103;if(103===i.status&&(i.gzhead.hcrc?(i.pending+2>i.pending_buf_size&&F(t),i.pending+2<=i.pending_buf_size&&(U(i,255&t.adler),U(i,t.adler>>8&255),t.adler=0,i.status=E)):i.status=E),0!==i.pending){if(F(t),0===t.avail_out)return i.last_flush=-1,m}else if(0===t.avail_in&&T(e)<=T(r)&&e!==f)return R(t,-5);if(666===i.status&&0!==t.avail_in)return R(t,-5);if(0!==t.avail_in||0!==i.lookahead||e!==l&&666!==i.status){var o=2===i.strategy?function(t,e){for(var r;;){if(0===t.lookahead&&(j(t),0===t.lookahead)){if(e===l)return A;break}if(t.match_length=0,r=u._tr_tally(t,0,t.window[t.strstart]),t.lookahead--,t.strstart++,r&&(N(t,!1),0===t.strm.avail_out))return A}return t.insert=0,e===f?(N(t,!0),0===t.strm.avail_out?O:B):t.last_lit&&(N(t,!1),0===t.strm.avail_out)?A:I}(i,e):3===i.strategy?function(t,e){for(var r,i,n,s,a=t.window;;){if(t.lookahead<=S){if(j(t),t.lookahead<=S&&e===l)return A;if(0===t.lookahead)break}if(t.match_length=0,t.lookahead>=x&&0<t.strstart&&(i=a[n=t.strstart-1])===a[++n]&&i===a[++n]&&i===a[++n]){s=t.strstart+S;do{}while(i===a[++n]&&i===a[++n]&&i===a[++n]&&i===a[++n]&&i===a[++n]&&i===a[++n]&&i===a[++n]&&i===a[++n]&&n<s);t.match_length=S-(s-n),t.match_length>t.lookahead&&(t.match_length=t.lookahead)}if(t.match_length>=x?(r=u._tr_tally(t,1,t.match_length-x),t.lookahead-=t.match_length,t.strstart+=t.match_length,t.match_length=0):(r=u._tr_tally(t,0,t.window[t.strstart]),t.lookahead--,t.strstart++),r&&(N(t,!1),0===t.strm.avail_out))return A}return t.insert=0,e===f?(N(t,!0),0===t.strm.avail_out?O:B):t.last_lit&&(N(t,!1),0===t.strm.avail_out)?A:I}(i,e):h[i.level].func(i,e);if(o!==O&&o!==B||(i.status=666),o===A||o===O)return 0===t.avail_out&&(i.last_flush=-1),m;if(o===I&&(1===e?u._tr_align(i):5!==e&&(u._tr_stored_block(i,0,0,!1),3===e&&(D(i.head),0===i.lookahead&&(i.strstart=0,i.block_start=0,i.insert=0))),F(t),0===t.avail_out))return i.last_flush=-1,m}return e!==f?m:i.wrap<=0?1:(2===i.wrap?(U(i,255&t.adler),U(i,t.adler>>8&255),U(i,t.adler>>16&255),U(i,t.adler>>24&255),U(i,255&t.total_in),U(i,t.total_in>>8&255),U(i,t.total_in>>16&255),U(i,t.total_in>>24&255)):(P(i,t.adler>>>16),P(i,65535&t.adler)),F(t),0<i.wrap&&(i.wrap=-i.wrap),0!==i.pending?m:1)},r.deflateEnd=function(t){var e;return t&&t.state?(e=t.state.status)!==C&&69!==e&&73!==e&&91!==e&&103!==e&&e!==E&&666!==e?R(t,_):(t.state=null,e===E?R(t,-3):m):_},r.deflateSetDictionary=function(t,e){var r,i,n,s,a,o,h,u,l=e.length;if(!t||!t.state)return _;if(2===(s=(r=t.state).wrap)||1===s&&r.status!==C||r.lookahead)return _;for(1===s&&(t.adler=c(t.adler,e,l,0)),r.wrap=0,l>=r.w_size&&(0===s&&(D(r.head),r.strstart=0,r.block_start=0,r.insert=0),u=new d.Buf8(r.w_size),d.arraySet(u,e,l-r.w_size,r.w_size,0),e=u,l=r.w_size),a=t.avail_in,o=t.next_in,h=t.input,t.avail_in=l,t.next_in=0,t.input=e,j(r);r.lookahead>=x;){for(i=r.strstart,n=r.lookahead-(x-1);r.ins_h=(r.ins_h<<r.hash_shift^r.window[i+x-1])&r.hash_mask,r.prev[i&r.w_mask]=r.head[r.ins_h],r.head[r.ins_h]=i,i++,--n;);r.strstart=i,r.lookahead=x-1,j(r)}return r.strstart+=r.lookahead,r.block_start=r.strstart,r.insert=r.lookahead,r.lookahead=0,r.match_length=r.prev_length=x-1,r.match_available=0,t.next_in=o,t.input=h,t.avail_in=a,r.wrap=s,m},r.deflateInfo="pako deflate (from Nodeca project)"},{"../utils/common":41,"./adler32":43,"./crc32":45,"./messages":51,"./trees":52}],47:[function(t,e,r){"use strict";e.exports=function(){this.text=0,this.time=0,this.xflags=0,this.os=0,this.extra=null,this.extra_len=0,this.name="",this.comment="",this.hcrc=0,this.done=!1}},{}],48:[function(t,e,r){"use strict";e.exports=function(t,e){var r,i,n,s,a,o,h,u,l,f,d,c,p,m,_,g,b,v,y,w,k,x,S,z,C;r=t.state,i=t.next_in,z=t.input,n=i+(t.avail_in-5),s=t.next_out,C=t.output,a=s-(e-t.avail_out),o=s+(t.avail_out-257),h=r.dmax,u=r.wsize,l=r.whave,f=r.wnext,d=r.window,c=r.hold,p=r.bits,m=r.lencode,_=r.distcode,g=(1<<r.lenbits)-1,b=(1<<r.distbits)-1;t:do{p<15&&(c+=z[i++]<<p,p+=8,c+=z[i++]<<p,p+=8),v=m[c&g];e:for(;;){if(c>>>=y=v>>>24,p-=y,0===(y=v>>>16&255))C[s++]=65535&v;else{if(!(16&y)){if(0==(64&y)){v=m[(65535&v)+(c&(1<<y)-1)];continue e}if(32&y){r.mode=12;break t}t.msg="invalid literal/length code",r.mode=30;break t}w=65535&v,(y&=15)&&(p<y&&(c+=z[i++]<<p,p+=8),w+=c&(1<<y)-1,c>>>=y,p-=y),p<15&&(c+=z[i++]<<p,p+=8,c+=z[i++]<<p,p+=8),v=_[c&b];r:for(;;){if(c>>>=y=v>>>24,p-=y,!(16&(y=v>>>16&255))){if(0==(64&y)){v=_[(65535&v)+(c&(1<<y)-1)];continue r}t.msg="invalid distance code",r.mode=30;break t}if(k=65535&v,p<(y&=15)&&(c+=z[i++]<<p,(p+=8)<y&&(c+=z[i++]<<p,p+=8)),h<(k+=c&(1<<y)-1)){t.msg="invalid distance too far back",r.mode=30;break t}if(c>>>=y,p-=y,(y=s-a)<k){if(l<(y=k-y)&&r.sane){t.msg="invalid distance too far back",r.mode=30;break t}if(S=d,(x=0)===f){if(x+=u-y,y<w){for(w-=y;C[s++]=d[x++],--y;);x=s-k,S=C}}else if(f<y){if(x+=u+f-y,(y-=f)<w){for(w-=y;C[s++]=d[x++],--y;);if(x=0,f<w){for(w-=y=f;C[s++]=d[x++],--y;);x=s-k,S=C}}}else if(x+=f-y,y<w){for(w-=y;C[s++]=d[x++],--y;);x=s-k,S=C}for(;2<w;)C[s++]=S[x++],C[s++]=S[x++],C[s++]=S[x++],w-=3;w&&(C[s++]=S[x++],1<w&&(C[s++]=S[x++]))}else{for(x=s-k;C[s++]=C[x++],C[s++]=C[x++],C[s++]=C[x++],2<(w-=3););w&&(C[s++]=C[x++],1<w&&(C[s++]=C[x++]))}break}}break}}while(i<n&&s<o);i-=w=p>>3,c&=(1<<(p-=w<<3))-1,t.next_in=i,t.next_out=s,t.avail_in=i<n?n-i+5:5-(i-n),t.avail_out=s<o?o-s+257:257-(s-o),r.hold=c,r.bits=p}},{}],49:[function(t,e,r){"use strict";var I=t("../utils/common"),O=t("./adler32"),B=t("./crc32"),R=t("./inffast"),T=t("./inftrees"),D=1,F=2,N=0,U=-2,P=1,i=852,n=592;function L(t){return(t>>>24&255)+(t>>>8&65280)+((65280&t)<<8)+((255&t)<<24)}function s(){this.mode=0,this.last=!1,this.wrap=0,this.havedict=!1,this.flags=0,this.dmax=0,this.check=0,this.total=0,this.head=null,this.wbits=0,this.wsize=0,this.whave=0,this.wnext=0,this.window=null,this.hold=0,this.bits=0,this.length=0,this.offset=0,this.extra=0,this.lencode=null,this.distcode=null,this.lenbits=0,this.distbits=0,this.ncode=0,this.nlen=0,this.ndist=0,this.have=0,this.next=null,this.lens=new I.Buf16(320),this.work=new I.Buf16(288),this.lendyn=null,this.distdyn=null,this.sane=0,this.back=0,this.was=0}function a(t){var e;return t&&t.state?(e=t.state,t.total_in=t.total_out=e.total=0,t.msg="",e.wrap&&(t.adler=1&e.wrap),e.mode=P,e.last=0,e.havedict=0,e.dmax=32768,e.head=null,e.hold=0,e.bits=0,e.lencode=e.lendyn=new I.Buf32(i),e.distcode=e.distdyn=new I.Buf32(n),e.sane=1,e.back=-1,N):U}function o(t){var e;return t&&t.state?((e=t.state).wsize=0,e.whave=0,e.wnext=0,a(t)):U}function h(t,e){var r,i;return t&&t.state?(i=t.state,e<0?(r=0,e=-e):(r=1+(e>>4),e<48&&(e&=15)),e&&(e<8||15<e)?U:(null!==i.window&&i.wbits!==e&&(i.window=null),i.wrap=r,i.wbits=e,o(t))):U}function u(t,e){var r,i;return t?(i=new s,(t.state=i).window=null,(r=h(t,e))!==N&&(t.state=null),r):U}var l,f,d=!0;function j(t){if(d){var e;for(l=new I.Buf32(512),f=new I.Buf32(32),e=0;e<144;)t.lens[e++]=8;for(;e<256;)t.lens[e++]=9;for(;e<280;)t.lens[e++]=7;for(;e<288;)t.lens[e++]=8;for(T(D,t.lens,0,288,l,0,t.work,{bits:9}),e=0;e<32;)t.lens[e++]=5;T(F,t.lens,0,32,f,0,t.work,{bits:5}),d=!1}t.lencode=l,t.lenbits=9,t.distcode=f,t.distbits=5}function Z(t,e,r,i){var n,s=t.state;return null===s.window&&(s.wsize=1<<s.wbits,s.wnext=0,s.whave=0,s.window=new I.Buf8(s.wsize)),i>=s.wsize?(I.arraySet(s.window,e,r-s.wsize,s.wsize,0),s.wnext=0,s.whave=s.wsize):(i<(n=s.wsize-s.wnext)&&(n=i),I.arraySet(s.window,e,r-i,n,s.wnext),(i-=n)?(I.arraySet(s.window,e,r-i,i,0),s.wnext=i,s.whave=s.wsize):(s.wnext+=n,s.wnext===s.wsize&&(s.wnext=0),s.whave<s.wsize&&(s.whave+=n))),0}r.inflateReset=o,r.inflateReset2=h,r.inflateResetKeep=a,r.inflateInit=function(t){return u(t,15)},r.inflateInit2=u,r.inflate=function(t,e){var r,i,n,s,a,o,h,u,l,f,d,c,p,m,_,g,b,v,y,w,k,x,S,z,C=0,E=new I.Buf8(4),A=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];if(!t||!t.state||!t.output||!t.input&&0!==t.avail_in)return U;12===(r=t.state).mode&&(r.mode=13),a=t.next_out,n=t.output,h=t.avail_out,s=t.next_in,i=t.input,o=t.avail_in,u=r.hold,l=r.bits,f=o,d=h,x=N;t:for(;;)switch(r.mode){case P:if(0===r.wrap){r.mode=13;break}for(;l<16;){if(0===o)break t;o--,u+=i[s++]<<l,l+=8}if(2&r.wrap&&35615===u){E[r.check=0]=255&u,E[1]=u>>>8&255,r.check=B(r.check,E,2,0),l=u=0,r.mode=2;break}if(r.flags=0,r.head&&(r.head.done=!1),!(1&r.wrap)||(((255&u)<<8)+(u>>8))%31){t.msg="incorrect header check",r.mode=30;break}if(8!=(15&u)){t.msg="unknown compression method",r.mode=30;break}if(l-=4,k=8+(15&(u>>>=4)),0===r.wbits)r.wbits=k;else if(k>r.wbits){t.msg="invalid window size",r.mode=30;break}r.dmax=1<<k,t.adler=r.check=1,r.mode=512&u?10:12,l=u=0;break;case 2:for(;l<16;){if(0===o)break t;o--,u+=i[s++]<<l,l+=8}if(r.flags=u,8!=(255&r.flags)){t.msg="unknown compression method",r.mode=30;break}if(57344&r.flags){t.msg="unknown header flags set",r.mode=30;break}r.head&&(r.head.text=u>>8&1),512&r.flags&&(E[0]=255&u,E[1]=u>>>8&255,r.check=B(r.check,E,2,0)),l=u=0,r.mode=3;case 3:for(;l<32;){if(0===o)break t;o--,u+=i[s++]<<l,l+=8}r.head&&(r.head.time=u),512&r.flags&&(E[0]=255&u,E[1]=u>>>8&255,E[2]=u>>>16&255,E[3]=u>>>24&255,r.check=B(r.check,E,4,0)),l=u=0,r.mode=4;case 4:for(;l<16;){if(0===o)break t;o--,u+=i[s++]<<l,l+=8}r.head&&(r.head.xflags=255&u,r.head.os=u>>8),512&r.flags&&(E[0]=255&u,E[1]=u>>>8&255,r.check=B(r.check,E,2,0)),l=u=0,r.mode=5;case 5:if(1024&r.flags){for(;l<16;){if(0===o)break t;o--,u+=i[s++]<<l,l+=8}r.length=u,r.head&&(r.head.extra_len=u),512&r.flags&&(E[0]=255&u,E[1]=u>>>8&255,r.check=B(r.check,E,2,0)),l=u=0}else r.head&&(r.head.extra=null);r.mode=6;case 6:if(1024&r.flags&&(o<(c=r.length)&&(c=o),c&&(r.head&&(k=r.head.extra_len-r.length,r.head.extra||(r.head.extra=new Array(r.head.extra_len)),I.arraySet(r.head.extra,i,s,c,k)),512&r.flags&&(r.check=B(r.check,i,c,s)),o-=c,s+=c,r.length-=c),r.length))break t;r.length=0,r.mode=7;case 7:if(2048&r.flags){if(0===o)break t;for(c=0;k=i[s+c++],r.head&&k&&r.length<65536&&(r.head.name+=String.fromCharCode(k)),k&&c<o;);if(512&r.flags&&(r.check=B(r.check,i,c,s)),o-=c,s+=c,k)break t}else r.head&&(r.head.name=null);r.length=0,r.mode=8;case 8:if(4096&r.flags){if(0===o)break t;for(c=0;k=i[s+c++],r.head&&k&&r.length<65536&&(r.head.comment+=String.fromCharCode(k)),k&&c<o;);if(512&r.flags&&(r.check=B(r.check,i,c,s)),o-=c,s+=c,k)break t}else r.head&&(r.head.comment=null);r.mode=9;case 9:if(512&r.flags){for(;l<16;){if(0===o)break t;o--,u+=i[s++]<<l,l+=8}if(u!==(65535&r.check)){t.msg="header crc mismatch",r.mode=30;break}l=u=0}r.head&&(r.head.hcrc=r.flags>>9&1,r.head.done=!0),t.adler=r.check=0,r.mode=12;break;case 10:for(;l<32;){if(0===o)break t;o--,u+=i[s++]<<l,l+=8}t.adler=r.check=L(u),l=u=0,r.mode=11;case 11:if(0===r.havedict)return t.next_out=a,t.avail_out=h,t.next_in=s,t.avail_in=o,r.hold=u,r.bits=l,2;t.adler=r.check=1,r.mode=12;case 12:if(5===e||6===e)break t;case 13:if(r.last){u>>>=7&l,l-=7&l,r.mode=27;break}for(;l<3;){if(0===o)break t;o--,u+=i[s++]<<l,l+=8}switch(r.last=1&u,l-=1,3&(u>>>=1)){case 0:r.mode=14;break;case 1:if(j(r),r.mode=20,6!==e)break;u>>>=2,l-=2;break t;case 2:r.mode=17;break;case 3:t.msg="invalid block type",r.mode=30}u>>>=2,l-=2;break;case 14:for(u>>>=7&l,l-=7&l;l<32;){if(0===o)break t;o--,u+=i[s++]<<l,l+=8}if((65535&u)!=(u>>>16^65535)){t.msg="invalid stored block lengths",r.mode=30;break}if(r.length=65535&u,l=u=0,r.mode=15,6===e)break t;case 15:r.mode=16;case 16:if(c=r.length){if(o<c&&(c=o),h<c&&(c=h),0===c)break t;I.arraySet(n,i,s,c,a),o-=c,s+=c,h-=c,a+=c,r.length-=c;break}r.mode=12;break;case 17:for(;l<14;){if(0===o)break t;o--,u+=i[s++]<<l,l+=8}if(r.nlen=257+(31&u),u>>>=5,l-=5,r.ndist=1+(31&u),u>>>=5,l-=5,r.ncode=4+(15&u),u>>>=4,l-=4,286<r.nlen||30<r.ndist){t.msg="too many length or distance symbols",r.mode=30;break}r.have=0,r.mode=18;case 18:for(;r.have<r.ncode;){for(;l<3;){if(0===o)break t;o--,u+=i[s++]<<l,l+=8}r.lens[A[r.have++]]=7&u,u>>>=3,l-=3}for(;r.have<19;)r.lens[A[r.have++]]=0;if(r.lencode=r.lendyn,r.lenbits=7,S={bits:r.lenbits},x=T(0,r.lens,0,19,r.lencode,0,r.work,S),r.lenbits=S.bits,x){t.msg="invalid code lengths set",r.mode=30;break}r.have=0,r.mode=19;case 19:for(;r.have<r.nlen+r.ndist;){for(;g=(C=r.lencode[u&(1<<r.lenbits)-1])>>>16&255,b=65535&C,!((_=C>>>24)<=l);){if(0===o)break t;o--,u+=i[s++]<<l,l+=8}if(b<16)u>>>=_,l-=_,r.lens[r.have++]=b;else{if(16===b){for(z=_+2;l<z;){if(0===o)break t;o--,u+=i[s++]<<l,l+=8}if(u>>>=_,l-=_,0===r.have){t.msg="invalid bit length repeat",r.mode=30;break}k=r.lens[r.have-1],c=3+(3&u),u>>>=2,l-=2}else if(17===b){for(z=_+3;l<z;){if(0===o)break t;o--,u+=i[s++]<<l,l+=8}l-=_,k=0,c=3+(7&(u>>>=_)),u>>>=3,l-=3}else{for(z=_+7;l<z;){if(0===o)break t;o--,u+=i[s++]<<l,l+=8}l-=_,k=0,c=11+(127&(u>>>=_)),u>>>=7,l-=7}if(r.have+c>r.nlen+r.ndist){t.msg="invalid bit length repeat",r.mode=30;break}for(;c--;)r.lens[r.have++]=k}}if(30===r.mode)break;if(0===r.lens[256]){t.msg="invalid code -- missing end-of-block",r.mode=30;break}if(r.lenbits=9,S={bits:r.lenbits},x=T(D,r.lens,0,r.nlen,r.lencode,0,r.work,S),r.lenbits=S.bits,x){t.msg="invalid literal/lengths set",r.mode=30;break}if(r.distbits=6,r.distcode=r.distdyn,S={bits:r.distbits},x=T(F,r.lens,r.nlen,r.ndist,r.distcode,0,r.work,S),r.distbits=S.bits,x){t.msg="invalid distances set",r.mode=30;break}if(r.mode=20,6===e)break t;case 20:r.mode=21;case 21:if(6<=o&&258<=h){t.next_out=a,t.avail_out=h,t.next_in=s,t.avail_in=o,r.hold=u,r.bits=l,R(t,d),a=t.next_out,n=t.output,h=t.avail_out,s=t.next_in,i=t.input,o=t.avail_in,u=r.hold,l=r.bits,12===r.mode&&(r.back=-1);break}for(r.back=0;g=(C=r.lencode[u&(1<<r.lenbits)-1])>>>16&255,b=65535&C,!((_=C>>>24)<=l);){if(0===o)break t;o--,u+=i[s++]<<l,l+=8}if(g&&0==(240&g)){for(v=_,y=g,w=b;g=(C=r.lencode[w+((u&(1<<v+y)-1)>>v)])>>>16&255,b=65535&C,!(v+(_=C>>>24)<=l);){if(0===o)break t;o--,u+=i[s++]<<l,l+=8}u>>>=v,l-=v,r.back+=v}if(u>>>=_,l-=_,r.back+=_,r.length=b,0===g){r.mode=26;break}if(32&g){r.back=-1,r.mode=12;break}if(64&g){t.msg="invalid literal/length code",r.mode=30;break}r.extra=15&g,r.mode=22;case 22:if(r.extra){for(z=r.extra;l<z;){if(0===o)break t;o--,u+=i[s++]<<l,l+=8}r.length+=u&(1<<r.extra)-1,u>>>=r.extra,l-=r.extra,r.back+=r.extra}r.was=r.length,r.mode=23;case 23:for(;g=(C=r.distcode[u&(1<<r.distbits)-1])>>>16&255,b=65535&C,!((_=C>>>24)<=l);){if(0===o)break t;o--,u+=i[s++]<<l,l+=8}if(0==(240&g)){for(v=_,y=g,w=b;g=(C=r.distcode[w+((u&(1<<v+y)-1)>>v)])>>>16&255,b=65535&C,!(v+(_=C>>>24)<=l);){if(0===o)break t;o--,u+=i[s++]<<l,l+=8}u>>>=v,l-=v,r.back+=v}if(u>>>=_,l-=_,r.back+=_,64&g){t.msg="invalid distance code",r.mode=30;break}r.offset=b,r.extra=15&g,r.mode=24;case 24:if(r.extra){for(z=r.extra;l<z;){if(0===o)break t;o--,u+=i[s++]<<l,l+=8}r.offset+=u&(1<<r.extra)-1,u>>>=r.extra,l-=r.extra,r.back+=r.extra}if(r.offset>r.dmax){t.msg="invalid distance too far back",r.mode=30;break}r.mode=25;case 25:if(0===h)break t;if(c=d-h,r.offset>c){if((c=r.offset-c)>r.whave&&r.sane){t.msg="invalid distance too far back",r.mode=30;break}p=c>r.wnext?(c-=r.wnext,r.wsize-c):r.wnext-c,c>r.length&&(c=r.length),m=r.window}else m=n,p=a-r.offset,c=r.length;for(h<c&&(c=h),h-=c,r.length-=c;n[a++]=m[p++],--c;);0===r.length&&(r.mode=21);break;case 26:if(0===h)break t;n[a++]=r.length,h--,r.mode=21;break;case 27:if(r.wrap){for(;l<32;){if(0===o)break t;o--,u|=i[s++]<<l,l+=8}if(d-=h,t.total_out+=d,r.total+=d,d&&(t.adler=r.check=r.flags?B(r.check,n,d,a-d):O(r.check,n,d,a-d)),d=h,(r.flags?u:L(u))!==r.check){t.msg="incorrect data check",r.mode=30;break}l=u=0}r.mode=28;case 28:if(r.wrap&&r.flags){for(;l<32;){if(0===o)break t;o--,u+=i[s++]<<l,l+=8}if(u!==(4294967295&r.total)){t.msg="incorrect length check",r.mode=30;break}l=u=0}r.mode=29;case 29:x=1;break t;case 30:x=-3;break t;case 31:return-4;case 32:default:return U}return t.next_out=a,t.avail_out=h,t.next_in=s,t.avail_in=o,r.hold=u,r.bits=l,(r.wsize||d!==t.avail_out&&r.mode<30&&(r.mode<27||4!==e))&&Z(t,t.output,t.next_out,d-t.avail_out)?(r.mode=31,-4):(f-=t.avail_in,d-=t.avail_out,t.total_in+=f,t.total_out+=d,r.total+=d,r.wrap&&d&&(t.adler=r.check=r.flags?B(r.check,n,d,t.next_out-d):O(r.check,n,d,t.next_out-d)),t.data_type=r.bits+(r.last?64:0)+(12===r.mode?128:0)+(20===r.mode||15===r.mode?256:0),(0==f&&0===d||4===e)&&x===N&&(x=-5),x)},r.inflateEnd=function(t){if(!t||!t.state)return U;var e=t.state;return e.window&&(e.window=null),t.state=null,N},r.inflateGetHeader=function(t,e){var r;return t&&t.state?0==(2&(r=t.state).wrap)?U:((r.head=e).done=!1,N):U},r.inflateSetDictionary=function(t,e){var r,i=e.length;return t&&t.state?0!==(r=t.state).wrap&&11!==r.mode?U:11===r.mode&&O(1,e,i,0)!==r.check?-3:Z(t,e,i,i)?(r.mode=31,-4):(r.havedict=1,N):U},r.inflateInfo="pako inflate (from Nodeca project)"},{"../utils/common":41,"./adler32":43,"./crc32":45,"./inffast":48,"./inftrees":50}],50:[function(t,e,r){"use strict";var D=t("../utils/common"),F=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,0,0],N=[16,16,16,16,16,16,16,16,17,17,17,17,18,18,18,18,19,19,19,19,20,20,20,20,21,21,21,21,16,72,78],U=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577,0,0],P=[16,16,16,16,17,17,18,18,19,19,20,20,21,21,22,22,23,23,24,24,25,25,26,26,27,27,28,28,29,29,64,64];e.exports=function(t,e,r,i,n,s,a,o){var h,u,l,f,d,c,p,m,_,g=o.bits,b=0,v=0,y=0,w=0,k=0,x=0,S=0,z=0,C=0,E=0,A=null,I=0,O=new D.Buf16(16),B=new D.Buf16(16),R=null,T=0;for(b=0;b<=15;b++)O[b]=0;for(v=0;v<i;v++)O[e[r+v]]++;for(k=g,w=15;1<=w&&0===O[w];w--);if(w<k&&(k=w),0===w)return n[s++]=20971520,n[s++]=20971520,o.bits=1,0;for(y=1;y<w&&0===O[y];y++);for(k<y&&(k=y),b=z=1;b<=15;b++)if(z<<=1,(z-=O[b])<0)return-1;if(0<z&&(0===t||1!==w))return-1;for(B[1]=0,b=1;b<15;b++)B[b+1]=B[b]+O[b];for(v=0;v<i;v++)0!==e[r+v]&&(a[B[e[r+v]]++]=v);if(c=0===t?(A=R=a,19):1===t?(A=F,I-=257,R=N,T-=257,256):(A=U,R=P,-1),b=y,d=s,S=v=E=0,l=-1,f=(C=1<<(x=k))-1,1===t&&852<C||2===t&&592<C)return 1;for(;;){for(p=b-S,_=a[v]<c?(m=0,a[v]):a[v]>c?(m=R[T+a[v]],A[I+a[v]]):(m=96,0),h=1<<b-S,y=u=1<<x;n[d+(E>>S)+(u-=h)]=p<<24|m<<16|_|0,0!==u;);for(h=1<<b-1;E&h;)h>>=1;if(0!==h?(E&=h-1,E+=h):E=0,v++,0==--O[b]){if(b===w)break;b=e[r+a[v]]}if(k<b&&(E&f)!==l){for(0===S&&(S=k),d+=y,z=1<<(x=b-S);x+S<w&&!((z-=O[x+S])<=0);)x++,z<<=1;if(C+=1<<x,1===t&&852<C||2===t&&592<C)return 1;n[l=E&f]=k<<24|x<<16|d-s|0}}return 0!==E&&(n[d+E]=b-S<<24|64<<16|0),o.bits=k,0}},{"../utils/common":41}],51:[function(t,e,r){"use strict";e.exports={2:"need dictionary",1:"stream end",0:"","-1":"file error","-2":"stream error","-3":"data error","-4":"insufficient memory","-5":"buffer error","-6":"incompatible version"}},{}],52:[function(t,e,r){"use strict";var n=t("../utils/common"),o=0,h=1;function i(t){for(var e=t.length;0<=--e;)t[e]=0}var s=0,a=29,u=256,l=u+1+a,f=30,d=19,_=2*l+1,g=15,c=16,p=7,m=256,b=16,v=17,y=18,w=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0],k=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13],x=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7],S=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],z=new Array(2*(l+2));i(z);var C=new Array(2*f);i(C);var E=new Array(512);i(E);var A=new Array(256);i(A);var I=new Array(a);i(I);var O,B,R,T=new Array(f);function D(t,e,r,i,n){this.static_tree=t,this.extra_bits=e,this.extra_base=r,this.elems=i,this.max_length=n,this.has_stree=t&&t.length}function F(t,e){this.dyn_tree=t,this.max_code=0,this.stat_desc=e}function N(t){return t<256?E[t]:E[256+(t>>>7)]}function U(t,e){t.pending_buf[t.pending++]=255&e,t.pending_buf[t.pending++]=e>>>8&255}function P(t,e,r){t.bi_valid>c-r?(t.bi_buf|=e<<t.bi_valid&65535,U(t,t.bi_buf),t.bi_buf=e>>c-t.bi_valid,t.bi_valid+=r-c):(t.bi_buf|=e<<t.bi_valid&65535,t.bi_valid+=r)}function L(t,e,r){P(t,r[2*e],r[2*e+1])}function j(t,e){for(var r=0;r|=1&t,t>>>=1,r<<=1,0<--e;);return r>>>1}function Z(t,e,r){var i,n,s=new Array(g+1),a=0;for(i=1;i<=g;i++)s[i]=a=a+r[i-1]<<1;for(n=0;n<=e;n++){var o=t[2*n+1];0!==o&&(t[2*n]=j(s[o]++,o))}}function W(t){var e;for(e=0;e<l;e++)t.dyn_ltree[2*e]=0;for(e=0;e<f;e++)t.dyn_dtree[2*e]=0;for(e=0;e<d;e++)t.bl_tree[2*e]=0;t.dyn_ltree[2*m]=1,t.opt_len=t.static_len=0,t.last_lit=t.matches=0}function M(t){8<t.bi_valid?U(t,t.bi_buf):0<t.bi_valid&&(t.pending_buf[t.pending++]=t.bi_buf),t.bi_buf=0,t.bi_valid=0}function H(t,e,r,i){var n=2*e,s=2*r;return t[n]<t[s]||t[n]===t[s]&&i[e]<=i[r]}function G(t,e,r){for(var i=t.heap[r],n=r<<1;n<=t.heap_len&&(n<t.heap_len&&H(e,t.heap[n+1],t.heap[n],t.depth)&&n++,!H(e,i,t.heap[n],t.depth));)t.heap[r]=t.heap[n],r=n,n<<=1;t.heap[r]=i}function K(t,e,r){var i,n,s,a,o=0;if(0!==t.last_lit)for(;i=t.pending_buf[t.d_buf+2*o]<<8|t.pending_buf[t.d_buf+2*o+1],n=t.pending_buf[t.l_buf+o],o++,0===i?L(t,n,e):(L(t,(s=A[n])+u+1,e),0!==(a=w[s])&&P(t,n-=I[s],a),L(t,s=N(--i),r),0!==(a=k[s])&&P(t,i-=T[s],a)),o<t.last_lit;);L(t,m,e)}function Y(t,e){var r,i,n,s=e.dyn_tree,a=e.stat_desc.static_tree,o=e.stat_desc.has_stree,h=e.stat_desc.elems,u=-1;for(t.heap_len=0,t.heap_max=_,r=0;r<h;r++)0!==s[2*r]?(t.heap[++t.heap_len]=u=r,t.depth[r]=0):s[2*r+1]=0;for(;t.heap_len<2;)s[2*(n=t.heap[++t.heap_len]=u<2?++u:0)]=1,t.depth[n]=0,t.opt_len--,o&&(t.static_len-=a[2*n+1]);for(e.max_code=u,r=t.heap_len>>1;1<=r;r--)G(t,s,r);for(n=h;r=t.heap[1],t.heap[1]=t.heap[t.heap_len--],G(t,s,1),i=t.heap[1],t.heap[--t.heap_max]=r,t.heap[--t.heap_max]=i,s[2*n]=s[2*r]+s[2*i],t.depth[n]=(t.depth[r]>=t.depth[i]?t.depth[r]:t.depth[i])+1,s[2*r+1]=s[2*i+1]=n,t.heap[1]=n++,G(t,s,1),2<=t.heap_len;);t.heap[--t.heap_max]=t.heap[1],function(t,e){var r,i,n,s,a,o,h=e.dyn_tree,u=e.max_code,l=e.stat_desc.static_tree,f=e.stat_desc.has_stree,d=e.stat_desc.extra_bits,c=e.stat_desc.extra_base,p=e.stat_desc.max_length,m=0;for(s=0;s<=g;s++)t.bl_count[s]=0;for(h[2*t.heap[t.heap_max]+1]=0,r=t.heap_max+1;r<_;r++)p<(s=h[2*h[2*(i=t.heap[r])+1]+1]+1)&&(s=p,m++),h[2*i+1]=s,u<i||(t.bl_count[s]++,a=0,c<=i&&(a=d[i-c]),o=h[2*i],t.opt_len+=o*(s+a),f&&(t.static_len+=o*(l[2*i+1]+a)));if(0!==m){do{for(s=p-1;0===t.bl_count[s];)s--;t.bl_count[s]--,t.bl_count[s+1]+=2,t.bl_count[p]--,m-=2}while(0<m);for(s=p;0!==s;s--)for(i=t.bl_count[s];0!==i;)u<(n=t.heap[--r])||(h[2*n+1]!==s&&(t.opt_len+=(s-h[2*n+1])*h[2*n],h[2*n+1]=s),i--)}}(t,e),Z(s,u,t.bl_count)}function X(t,e,r){var i,n,s=-1,a=e[1],o=0,h=7,u=4;for(0===a&&(h=138,u=3),e[2*(r+1)+1]=65535,i=0;i<=r;i++)n=a,a=e[2*(i+1)+1],++o<h&&n===a||(o<u?t.bl_tree[2*n]+=o:0!==n?(n!==s&&t.bl_tree[2*n]++,t.bl_tree[2*b]++):o<=10?t.bl_tree[2*v]++:t.bl_tree[2*y]++,s=n,u=(o=0)===a?(h=138,3):n===a?(h=6,3):(h=7,4))}function V(t,e,r){var i,n,s=-1,a=e[1],o=0,h=7,u=4;for(0===a&&(h=138,u=3),i=0;i<=r;i++)if(n=a,a=e[2*(i+1)+1],!(++o<h&&n===a)){if(o<u)for(;L(t,n,t.bl_tree),0!=--o;);else 0!==n?(n!==s&&(L(t,n,t.bl_tree),o--),L(t,b,t.bl_tree),P(t,o-3,2)):o<=10?(L(t,v,t.bl_tree),P(t,o-3,3)):(L(t,y,t.bl_tree),P(t,o-11,7));s=n,u=(o=0)===a?(h=138,3):n===a?(h=6,3):(h=7,4)}}i(T);var q=!1;function J(t,e,r,i){P(t,(s<<1)+(i?1:0),3),function(t,e,r,i){M(t),i&&(U(t,r),U(t,~r)),n.arraySet(t.pending_buf,t.window,e,r,t.pending),t.pending+=r}(t,e,r,!0)}r._tr_init=function(t){q||(function(){var t,e,r,i,n,s=new Array(g+1);for(i=r=0;i<a-1;i++)for(I[i]=r,t=0;t<1<<w[i];t++)A[r++]=i;for(A[r-1]=i,i=n=0;i<16;i++)for(T[i]=n,t=0;t<1<<k[i];t++)E[n++]=i;for(n>>=7;i<f;i++)for(T[i]=n<<7,t=0;t<1<<k[i]-7;t++)E[256+n++]=i;for(e=0;e<=g;e++)s[e]=0;for(t=0;t<=143;)z[2*t+1]=8,t++,s[8]++;for(;t<=255;)z[2*t+1]=9,t++,s[9]++;for(;t<=279;)z[2*t+1]=7,t++,s[7]++;for(;t<=287;)z[2*t+1]=8,t++,s[8]++;for(Z(z,l+1,s),t=0;t<f;t++)C[2*t+1]=5,C[2*t]=j(t,5);O=new D(z,w,u+1,l,g),B=new D(C,k,0,f,g),R=new D(new Array(0),x,0,d,p)}(),q=!0),t.l_desc=new F(t.dyn_ltree,O),t.d_desc=new F(t.dyn_dtree,B),t.bl_desc=new F(t.bl_tree,R),t.bi_buf=0,t.bi_valid=0,W(t)},r._tr_stored_block=J,r._tr_flush_block=function(t,e,r,i){var n,s,a=0;0<t.level?(2===t.strm.data_type&&(t.strm.data_type=function(t){var e,r=4093624447;for(e=0;e<=31;e++,r>>>=1)if(1&r&&0!==t.dyn_ltree[2*e])return o;if(0!==t.dyn_ltree[18]||0!==t.dyn_ltree[20]||0!==t.dyn_ltree[26])return h;for(e=32;e<u;e++)if(0!==t.dyn_ltree[2*e])return h;return o}(t)),Y(t,t.l_desc),Y(t,t.d_desc),a=function(t){var e;for(X(t,t.dyn_ltree,t.l_desc.max_code),X(t,t.dyn_dtree,t.d_desc.max_code),Y(t,t.bl_desc),e=d-1;3<=e&&0===t.bl_tree[2*S[e]+1];e--);return t.opt_len+=3*(e+1)+5+5+4,e}(t),n=t.opt_len+3+7>>>3,(s=t.static_len+3+7>>>3)<=n&&(n=s)):n=s=r+5,r+4<=n&&-1!==e?J(t,e,r,i):4===t.strategy||s===n?(P(t,2+(i?1:0),3),K(t,z,C)):(P(t,4+(i?1:0),3),function(t,e,r,i){var n;for(P(t,e-257,5),P(t,r-1,5),P(t,i-4,4),n=0;n<i;n++)P(t,t.bl_tree[2*S[n]+1],3);V(t,t.dyn_ltree,e-1),V(t,t.dyn_dtree,r-1)}(t,t.l_desc.max_code+1,t.d_desc.max_code+1,a+1),K(t,t.dyn_ltree,t.dyn_dtree)),W(t),i&&M(t)},r._tr_tally=function(t,e,r){return t.pending_buf[t.d_buf+2*t.last_lit]=e>>>8&255,t.pending_buf[t.d_buf+2*t.last_lit+1]=255&e,t.pending_buf[t.l_buf+t.last_lit]=255&r,t.last_lit++,0===e?t.dyn_ltree[2*r]++:(t.matches++,e--,t.dyn_ltree[2*(A[r]+u+1)]++,t.dyn_dtree[2*N(e)]++),t.last_lit===t.lit_bufsize-1},r._tr_align=function(t){P(t,2,3),L(t,m,z),function(t){16===t.bi_valid?(U(t,t.bi_buf),t.bi_buf=0,t.bi_valid=0):8<=t.bi_valid&&(t.pending_buf[t.pending++]=255&t.bi_buf,t.bi_buf>>=8,t.bi_valid-=8)}(t)}},{"../utils/common":41}],53:[function(t,e,r){"use strict";e.exports=function(){this.input=null,this.next_in=0,this.avail_in=0,this.total_in=0,this.output=null,this.next_out=0,this.avail_out=0,this.total_out=0,this.msg="",this.state=null,this.data_type=2,this.adler=0}},{}],54:[function(t,e,r){"use strict";e.exports="function"==typeof setImmediate?setImmediate:function(){var t=[].slice.apply(arguments);t.splice(1,0,0),setTimeout.apply(null,t)}},{}]},{},[10])(10)});
;
(function(a,b){if("function"==typeof define&&define.amd)define([],b);else if("undefined"!=typeof exports)b();else{b(),a.FileSaver={exports:{}}.exports}})(this,function(){"use strict";function b(a,b){return"undefined"==typeof b?b={autoBom:!1}:"object"!=typeof b&&(console.warn("Deprecated: Expected third argument to be a object"),b={autoBom:!b}),b.autoBom&&/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(a.type)?new Blob(["\uFEFF",a],{type:a.type}):a}function c(a,b,c){var d=new XMLHttpRequest;d.open("GET",a),d.responseType="blob",d.onload=function(){g(d.response,b,c)},d.onerror=function(){console.error("could not download file")},d.send()}function d(a){var b=new XMLHttpRequest;b.open("HEAD",a,!1);try{b.send()}catch(a){}return 200<=b.status&&299>=b.status}function e(a){try{a.dispatchEvent(new MouseEvent("click"))}catch(c){var b=document.createEvent("MouseEvents");b.initMouseEvent("click",!0,!0,window,0,0,0,80,20,!1,!1,!1,!1,0,null),a.dispatchEvent(b)}}var f="object"==typeof window&&window.window===window?window:"object"==typeof self&&self.self===self?self:"object"==typeof global&&global.global===global?global:void 0,a=f.navigator&&/Macintosh/.test(navigator.userAgent)&&/AppleWebKit/.test(navigator.userAgent)&&!/Safari/.test(navigator.userAgent),g=f.saveAs||("object"!=typeof window||window!==f?function(){}:"download"in HTMLAnchorElement.prototype&&!a?function(b,g,h){var i=f.URL||f.webkitURL,j=document.createElement("a");g=g||b.name||"download",j.download=g,j.rel="noopener","string"==typeof b?(j.href=b,j.origin===location.origin?e(j):d(j.href)?c(b,g,h):e(j,j.target="_blank")):(j.href=i.createObjectURL(b),setTimeout(function(){i.revokeObjectURL(j.href)},4E4),setTimeout(function(){e(j)},0))}:"msSaveOrOpenBlob"in navigator?function(f,g,h){if(g=g||f.name||"download","string"!=typeof f)navigator.msSaveOrOpenBlob(b(f,h),g);else if(d(f))c(f,g,h);else{var i=document.createElement("a");i.href=f,i.target="_blank",setTimeout(function(){e(i)})}}:function(b,d,e,g){if(g=g||open("","_blank"),g&&(g.document.title=g.document.body.innerText="downloading..."),"string"==typeof b)return c(b,d,e);var h="application/octet-stream"===b.type,i=/constructor/i.test(f.HTMLElement)||f.safari,j=/CriOS\/[\d]+/.test(navigator.userAgent);if((j||h&&i||a)&&"undefined"!=typeof FileReader){var k=new FileReader;k.onloadend=function(){var a=k.result;a=j?a:a.replace(/^data:[^;]*;/,"data:attachment/file;"),g?g.location.href=a:location=a,g=null},k.readAsDataURL(b)}else{var l=f.URL||f.webkitURL,m=l.createObjectURL(b);g?g.location=m:location.href=m,g=null,setTimeout(function(){l.revokeObjectURL(m)},4E4)}});f.saveAs=g.saveAs=g,"undefined"!=typeof module&&(module.exports=g)});;
function FullObjectCopy(obj) {
  var newObj = Object.create(Object.getPrototypeOf(obj));

  return Object.assign(newObj, obj);
}

function FullArrayCopy(arr) {
  var res = [];

	arr.forEach(function(element) {

    var copyElement = FullObjectCopy(element);
    res.push(copyElement);
	});  

  return res;
};
/**
 *  Place here all tests constans.
 *
 */

var g_textsSelectAndMove = "Drag objects";
var g_moveCursorForMoving = "Move cursor";
var g_clickToAddVertex = "Click to add vertex";
var g_selectFisrtVertexToConnect = "Select first vertex to connect";
var g_selectSecondVertexToConnect = "Select second vertex to connect";
var g_selectStartVertexForShortPath = "Select start vertex for shortest path";
var g_selectFinishVertexForShortPath = "Select finish vertex for shortest path";
var g_shortestPathResult = "Shortest path is %d";
var g_pathNotExists = "Path does not exists";
var g_selectObjectToDelete = "Select object to delete";


var g_addEdge = "Add edge";
var g_orintEdge = "Orient";
var g_notOrintEdge = "not Orient";

var g_adjacencyMatrixText = "Adjacency Matrix";
var g_save   = "Save";
var g_cancel = "Cancel";
var g_save_graph = "Save Graph";
var g_curveEdge      = "Curved edge";

var g_action = "Action";

function loadTexts(){}
;
function Point(x, y) {
    this.x = x || 0;
    this.y = y || 0;
};

Point.prototype.x = null;
Point.prototype.y = null;

Point.prototype.add = function(v) {
    return new Point(this.x + v.x, this.y + v.y);
};

Point.prototype.addValue = function(v) {
    return new Point(this.x + v, this.y + v);
};

Point.prototype.clone = function() {
    return new Point(this.x, this.y);
};

Point.prototype.degreesTo = function(v) {
    var dx = this.x - v.x;
    var dy = this.y - v.y;
    var angle = Math.atan2(dy, dx); // radians
    return angle * (180 / Math.PI); // degrees
};

Point.prototype.distance = function(v) {
    return Math.sqrt(this.distanceSqr(v));
};

Point.prototype.distanceSqr = function(v) {
    var x = this.x - v.x;
    var y = this.y - v.y;
    return x * x + y * y;
};

Point.prototype.equals = function(toCompare) {
    return this.x == toCompare.x && this.y == toCompare.y;
};

Point.prototype.interpolate = function(v, f) {
    return new Point((this.x + v.x) * f, (this.y + v.y) * f);
};

Point.prototype.length = function() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
};

Point.prototype.normalize = function(thickness) {
    var l = this.length();
    this.x = this.x / l * thickness;
    this.y = this.y / l * thickness;
    return new Point(this.x, this.y);
};

Point.prototype.normalizeCopy = function(thickness) {
    var l = this.length();
    return new Point(this.x / l * thickness, this.y / l * thickness);
};

Point.prototype.orbit = function(origin, arcWidth, arcHeight, degrees) {
    var radians = degrees * (Math.PI / 180);
    this.x = origin.x + arcWidth * Math.cos(radians);
    this.y = origin.y + arcHeight * Math.sin(radians);
};

Point.prototype.rotate = function(center, degrees) {
    var radians = degrees * (Math.PI / 180);
    offset = this.subtract(center);
    this.x = offset.x * Math.cos(radians) - offset.y * Math.sin(radians);
    this.y = offset.x * Math.sin(radians) + offset.y * Math.cos(radians);
    this.x = this.x + center.x;
    this.y = this.y + center.y;
    return this;
};

Point.prototype.offset = function(dx, dy) {
    this.x += dx;
    this.y += dy;
};

Point.prototype.subtract = function(v) {
    return new Point(this.x - v.x, this.y - v.y);
};

Point.prototype.subtractValue = function(value) {
    return new Point(this.x - value, this.y - value);
};

Point.prototype.multiply = function(value) {
    return new Point(this.x * value, this.y * value);
};

Point.prototype.toString = function() {
    return "(x=" + this.x + ", y=" + this.y + ")";
};

Point.prototype.normal = function() {
    return new Point(-this.y, this.x);
};

Point.prototype.min = function(point) {
    return new Point(Math.min(this.x, point.x), Math.min(this.y, point.y));
};

Point.prototype.max = function(point) {
    return new Point(Math.max(this.x, point.x), Math.max(this.y, point.y));
};

Point.prototype.inverse = function() {
    return new Point(-this.x, -this.y);
};

Point.prototype.cross = function(point) {
    return this.x * point.y - this.y * point.x;
};
 
Point.interpolate = function(pt1, pt2, f) {
    return new Point(pt1.x * (1.0 - f) + pt2.x * f, pt1.y * (1.0 - f) + pt2.y * f);
};

Point.polar = function(len, angle) {
    return new Point(len * Math.cos(angle), len * Math.sin(angle));
};

Point.distance = function(pt1, pt2) {
    var x = pt1.x - pt2.x;
    var y = pt1.y - pt2.y;
    return Math.sqrt(x * x + y * y);
};

Point.center = function(pt1, pt2) {
    return new Point((pt1.x + pt2.x) / 2.0, (pt1.y + pt2.y) / 2.0);
};

Point.toString = function() {
	return x + " " + y;
}

Point.projection = function (point, line1, line2) {
    var x = line2.y - line1.y;
    var y = line1.x - line2.x;
    var l = (line1.cross(line2) + line1.cross(point) + line2.cross(point))/(x*(line2.y - line1.y) + y*(line1.x - line2.x));
    var res = new Point(point.x + x * l,  point.y + y * l);
    return res;
}

Point.hitTest = function (pt11, pt12, pt21, pt22) {
    var res = null;
    var n   = 0.0;

    var x1 = pt11.x;
    var y1 = pt11.y;
    var x2 = pt12.x;
    var y2 = pt12.y;
    var x3 = pt21.x;
    var y3 = pt21.y;
    var x4 = pt22.x;
    var y4 = pt22.y;

    if (y2 - y1 != 0.0) 
    {  // a(y)
        var q = (x2 - x1) / (y1 - y2);   
        var sn = (x3 - x4) + (y3 - y4) * q; 
        if (sn == 0.0) 
        { 
            return res; 
        }  // c(x) + c(y)*q

        var fn = (x3 - x1) + (y3 - y1) * q;   // b(x) + b(y)*q
        n = fn / sn;
    }
    else 
    {
        if ((y3 - y4) == 0.0) 
        { 
            return res;
        }  // b(y)
        n = (y3 - y1) / (y3 - y4);   // c(y)/b(y)
    }
    
    // x3 + (-b(x))*n && y3 +(-b(y))*n
    res = new Point(x3 + (x4 - x3) * n, y3 + (y4 - y3) * n);
    
    var epsilon = 1E-5;
    if (! (res.x >= Math.min(x1, x2) - epsilon && res.x >= Math.min(x3, x4) - epsilon && res.x <= Math.max(x1, x2) + epsilon && res.x <= Math.max(x3, x4) + epsilon && 
           res.y >= Math.min(y1, y2) - epsilon && res.y >= Math.min(y3, y4) - epsilon && res.y <= Math.max(y1, y2) + epsilon && res.y <= Math.max(y3, y4) + epsilon))
    {
      res = null;
    }
    
    return res;
}

function Rect(minPoint, maxPoint) {
    this.minPoint = minPoint;
    this.maxPoint = maxPoint;
};

Rect.prototype.center = function() {
    return Point.center(this.minPoint, this.maxPoint);
};

Rect.prototype.size = function() {
    return this.maxPoint.subtract(this.minPoint);
};

Rect.prototype.left = function() {
    return this.minPoint.x;
};

Rect.prototype.top = function() {
    return this.minPoint.y;
};

Rect.prototype.isIn = function(v) {
    return this.minPoint.x <= v.x && this.minPoint.y <= v.y && 
           this.maxPoint.x > v.x  && this.maxPoint.y > v.y;
};
;
//  first color
const firstColor = "#57b2e0";

// first color active 
const firstColorActive = "#3b8cb5";

// input Color
const inputColorLigth = "#eef7fc";
const inputColorDark = "#1d2d35";

let inputColor = "";

// Text color
const textColor = "#bac1c4";

// Title Color
const titleColorLight = "#232729";
const titleColorDark = "#f1f3f3";

let titleColor = titleColorLight;

// Dark gray color

const darkGrayColor = "#838687"

const whiteColor = "#ffffff";;
const vertexDiameter = 30;

function VertexStyle(
		strokeStyle,
		fillStyle,
		color
) {
	this.lineWidth    = 2;
	this.font         = 12;
	this.strokeStyle  = strokeStyle;
	this.fillStyle    = fillStyle;
	this.color        = color;
}

const baseVertexStyle     = new VertexStyle(textColor, firstColor, whiteColor);
const selectedVertexStyle = new VertexStyle(textColor, firstColorActive, whiteColor);
const startVertexStyle    = new VertexStyle(textColor, 'green' , whiteColor);
const finishVertexStyle   = new VertexStyle(textColor, 'red' , whiteColor); 

class Vertex {
	constructor(
		pos, 
		id = 0, 
		text = 'text', 
		type = 'default'
	) {
		this.pos = pos;
		this.id = id;
		this.type = type;
		this.text = text;
		this.d = 30;
	}

	setId(id) {
		this.id = id;
	}

	getId() {
		return this.id;
	}

	hitTest(pos) {
		return this.pos.distance(pos) < this.d / 2.0;
	}

	setType(type) {
		this.type = type;
	}

	getType() {
		return this.type
	}

	getStyle() {
		switch(this.type) {
			case "start": 
				return startVertexStyle;
			case "finish":
				return finishVertexStyle;
			default: 
				return baseVertexStyle;
		}
	}

	save = () => {
		return({
			pos: { ...this.pos},
			id: this.id,
			text: this.text,
			type: this.type,
		})
	}

	load = (data) => {
		const {pos, id, text, type} = {...data};
		return new Vertex(pos, id, text, type);
	}
}


class VertexDrawer {
	constructor(context) {
		this.context = context; 
	}

	draw(vertex, isSelected) {	
		const style = vertex.getStyle();
		this.drawShape(vertex, isSelected, style);
		this.drawText(vertex, isSelected, style);
	}

	drawShape(vertex, isSelected, style) {
		const {
			pos, 
			d
		} = vertex;

		const {
			x,
			y
		} = pos;

		const {
			fillStyle, 
			lineWidth, 
			strokeStyle
		} = isSelected ? selectedVertexStyle : style;
		
		this.context.beginPath();
			this.context.fillStyle = fillStyle;
			this.context.strokeStyle = strokeStyle;
			this.context.lineWidth = lineWidth;
			this.context.arc(x, y, d / 2.0, 0, 2 * Math.PI);
			this.context.stroke();
			this.context.fill();
		this.context.closePath();	
	}

	drawText(vertex, isSelected, style) {
		const {pos, text} = vertex;
		const {color, font} = isSelected ? selectedVertexStyle : style;
		
		this.context.fillStyle = color;
		this.context.font = "bold " +  font + "px sans-serif";
		this.context.textBaseline="middle";

		const textWidth  = this.context.measureText(text).width;
		const {x,y} = new Point(pos.x - textWidth / 2, pos.y);
		
		this.context.fillText(text, x, y);
	}
};
// New Edge Model

function Mark(type = "", id = "") {
	this.type = type;
	this.id = id;
}

const EdgeModels = {"line": 0, "cruvled" : 1};

class EdgeModel {
	constructor(model = {type: 0, curvedValue: 0.1}) {
		this.width = 4;
		this.type  = model.type;
		this.curvedValue = model.curvedValue;
		this.default = true;
		this.sizeOfLoop = 40;
		this.loopShiftAngel = Math.PI / 6;
		this.defaultCruved = 0.1;
	}

	getCurvedPoint = function(position1, position2, t) {
		let points = this.getBezierPoints(position1, position2);
		let firstBezierPoint  = points[0];  
		let secondBezierPoint = points[1];
		
		let B0_t = Math.pow(1-t, 3);
		let B1_t = 3 * t * Math.pow(1-t, 2);
		let B2_t = 3 * t*t * (1-t)
		let B3_t = t*t*t;
		
		let ax = position1.x;
		let ay = position1.y;
		let dx = position2.x;
		let dy = position2.y;
		let bx = firstBezierPoint.x;
		let by = firstBezierPoint.y;
		let cx = secondBezierPoint.x;
		let cy = secondBezierPoint.y;
		
		let px_t = (B0_t * ax) + (B1_t * bx) + (B2_t * cx) + (B3_t * dx);
		let py_t = (B0_t * ay) + (B1_t * by) + (B2_t * cy) + (B3_t * dy);
		
		return new Point(px_t, py_t);
	}

	getBezierPoints(position1, position2) {
		let direction = position2.subtract(position1); 
		let delta     = direction.length();
		direction.normalize(1.0);  
		let normal = direction.normal();
		
		let deltaOffsetPixels = delta * this.curvedValue;
		let yOffset = normal.multiply(deltaOffsetPixels);
		let firstBezierPointShift  = (direction.multiply(delta * 0.2)).add(yOffset); 
		let secondBezierPointShift = (direction.multiply(-delta * 0.2)).add(yOffset); 
		let firstBezierPoint  = position1.add(firstBezierPointShift);  
		let secondBezierPoint = position2.add(secondBezierPointShift);
		
		return [firstBezierPoint, secondBezierPoint];
	}

	hitTest(position1, position2, mousePos) {
		if (this.type == EdgeModels.line)
			return this.hitTestLine(position1, position2, mousePos);
		else if (this.type == EdgeModels.cruvled)
			return this.hitTestCurved(position1, position2, mousePos);
		return false;
	}

	hitTestLine(position1, position2, mousePos, factor) {
		if (factor === undefined) {
			factor = 1.0;
		}
		
		let pos1 = position1;
		let pos2 = position2;
		let pos0 = mousePos;
		
		// Self loop case
		if (pos1.equals(pos2)) {
			let xCenter = pos1.x - Math.cos(this.getLoopShiftAngel()) * this.getLoopSize(); 
			let yCenter = pos1.y - Math.sin(this.getLoopShiftAngel()) * this.getLoopSize();
			
			return Math.abs((Point.distance(new Point(xCenter, yCenter), pos0)) - this.getLoopSize()) <= this.width * 1.5 * factor;
		}
			
		let r1  = pos0.distance(pos1);
		let r2  = pos0.distance(pos2);
		let r12 = pos1.distance(pos2);
			
		if(!(r1 >= (new Point(r2, r12)).length() || r2 >= (new Point(r1,r12)).length())) { 
			let distance = ((pos1.y - pos2.y) * pos0.x + (pos2.x - pos1.x) * pos0.y + (pos1.x * pos2.y - pos2.x * pos1.y)) / r12;

			if (Math.abs(distance) <= this.width * 1.5 * factor) {
				return true;
			}
		}
		
		return false;
	}


	hitTestCurved(position1, position2, mousePos) {
		let pos1 = position1;
		let pos2 = position2;
		let pos0 = mousePos;
		
		// Self loop case
		if (pos1.equals(pos2)) {
			let xCenter = pos1.x - Math.cos(this.getLoopShiftAngel()) * this.getLoopSize(); 
			let yCenter = pos1.y - Math.sin(this.getLoopShiftAngel()) * this.getLoopSize();
			
			return Math.abs((Point.distance(new Point(xCenter, yCenter), pos0)) - this.getLoopSize()) <= this.width * 1.5;
		}
		
		let interval_count = position1.distance(position2) / 100 * 30;
		
		let start = position1;
		for (let i = 0; i < interval_count; i ++) {
			let finish = this.getCurvedPoint(position1, position2, i / interval_count);
			
			if (this.hitTestLine(start, finish, mousePos, 2.0))
				return true;
			
			start = finish;
		}
		
		return false;
	}	


	changeCurvedValue = function (delta) {
		if (this.type == EdgeModels.line) {
			this.type = EdgeModels.cruvled;
			this.curvedValue = 0.0;
		}

		this.curvedValue = this.curvedValue + delta;
		
		if (Math.abs(this.curvedValue) <= 0.01)
			this.type = EdgeModels.line;
		
		this.default = false;
	}

	setCurvedValue(value) {
		if (this.type == EdgeModels.line) {
			this.type = EdgeModels.cruvled;
			this.curvedValue = 0.0;
		}

		this.curvedValue = value;
		
		if (Math.abs(this.curvedValue) <= 0.01)
			this.type = EdgeModels.line;
		
		this.default = false;
	}

	getLoopSize = function () {
		return this.sizeOfLoop;
	}
	
	getLoopShiftAngel = function () {
    	return this.loopShiftAngel;
	}

}


;
function EdgeStyle(
	color,
	textColor = color
) {
	this.color = color;
	this.textColor = textColor;
	this.textPadding = 10;
	this.labelFontSize = 12;
	this.markFontSize = 10;
}

let baseEdgeStyle = new EdgeStyle(textColor);

const darkEdgeStyle = new EdgeStyle(textColor, '#ffffff');
const lightEdgeStyle = new EdgeStyle('#000000', '#000000');

const selectedEdgeStyle = new EdgeStyle(darkGrayColor)

class Edge {
	constructor(
		v1, v2, 
		label = '',
		mark = undefined, 
		model = {
			type: 0,
			curvedValue: 0.1
		}
	) {
		this.v1 = v1,
		this.v2 = v2;
		this.label = label;
		this.mark = mark;
		this.id = 0;
		this.model = new EdgeModel(model);
		this.trace = []
	}

	setTrace(trace) {
		this.trace = trace;
	}

	setId(id) {
		this.id = id;
	}

	getLabel() {
		return this.label;
	}

	setLabel(label) {
		this.label = label;
	}

	getMark() {
    	return this.mark;
	}

	getEdgePositions(v1, v2) {
		let res = [];

		if (v1 == v2) {
			res.push(v1.pos);
			res.push(v2.pos);
			return res;
		}
		
		let position1 = v1.pos;
		let position2 = v2.pos;
		let diameter1 = v1.d + 4;
		let diameter2 = v2.d + 4;

		let direction = position1.subtract(position2);
		
		let direction1 = direction;
		let direction2 = direction;
		let d1        = diameter1;
		let d2        = diameter2;
		
		if (this.model.type == EdgeModels.cruvled) {
			let dist   = position1.distance(position2);
			let point1  = this.model.getCurvedPoint(position1, position2, 10.0 / dist);
			direction1  = position1.subtract(point1);   
			
			let point2  = this.model.getCurvedPoint(position1, position2, 1.0 - 10.0 / dist);
			direction2  = position2.subtract(point2);
			
			d2         = diameter2;
		} else {
			direction2 = direction2.multiply(-1);
		}

		direction1.normalize(1.0);
		direction2.normalize(1.0);

		let vertexes = [];
		vertexes.push({vertex : v1, direction : direction1, pos : position1, diameter : d1});
		vertexes.push({vertex : v2, direction : direction2, pos : position2, diameter : d2});

		vertexes.forEach(function(data) {
				let direction = data.direction.multiply(0.5);        
				res.push(data.pos.subtract(direction.multiply(data.diameter)));
			});    

		return res;
	}

	hitTest(pos) {
		let positions = this.getEdgePositions(this.v1, this.v2);
		return this.model.hitTest(positions[0], positions[1], pos);
	}

	save = () => {
		return({
			id: this.id,
			v1Id: this.v1.id,
			v2Id: this.v2.id,
			label: this.label,
			mark: this.mark,
			model : {
				type: this.model.type,
				curvedValue: this.model.curvedValue
			}
		});  
	}
}


class EdgeDrawer {
	constructor(context, model = new EdgeModel()) {
		this.context = context;
		this.model = model;
	}

	getPixelLength(v1, v2) {
		return(v1 = v2 ? this.model.getLoopSize() * 2 * Math.PI: Point.distance(v1.pos, v2.pos)
		);
	}

	draw(baseEdge, isSelected) {
		const {v1, v2,label, mark} = baseEdge;
		const style = isSelected ? selectedEdgeStyle : baseEdgeStyle;
		
		let lengthArrow = Math.max(this.model.width * 4, 8);

		let position1 = v1.pos;
  		let position2 = v2.pos;

		const isCircle = position1.equals(position2);
		let direction = position1.subtract(position2); 

		direction.normalize(1.0);

		let positions = baseEdge.getEdgePositions(v1, v2);
			
		let arcPos1 = positions[0];
		let arcPos2 = positions[1];

		this.context.fillStyle = style.color;
		this.context.strokeStyle = style.color;

		if(!isCircle) {
			let dirArrow = this.getFinishArrowDiretion(positions[0], positions[1], lengthArrow);
    		arcPos2 = arcPos2.add(dirArrow.multiply(-lengthArrow / 2));
			this.drawArrow (positions[1], dirArrow);
		}
		
		this.drawArc (arcPos1, arcPos2, style, isCircle);
		this.drawLabel(arcPos1, arcPos2, label, style, isCircle);

		if(mark) {
			this.drawMark(arcPos1, arcPos2, mark, style, isCircle);
		}
		
	}

	getFinishArrowDiretion(position1, position2, lengthArrow = 0) {
		let direction = position2.subtract(position1);
		direction.normalize(1.0);
		return direction;
	}

	drawArc(position1, position2, style, isCircle) {
		this.context.lineWidth = 2;

		if (isCircle) {
			this.context.beginPath();
				this.context.arc(	
					position1.x - Math.cos(this.model.getLoopShiftAngel()) * this.model.getLoopSize(), 			
					position1.y - Math.sin(this.model.getLoopShiftAngel()) * this.model.getLoopSize(), 
					this.model.getLoopSize(), 
					0 * Math.PI, 
					2 * Math.PI);
				this.context.stroke();
			this.context.closePath();
		} else {
			this.context.beginPath();
				this.context.moveTo(position1.x, position1.y);
				this.context.lineTo(position2.x, position2.y);
				this.context.stroke();
			this.context.closePath();
		}
	}

	drawArrow(position, direction, length = 10, width = 5) {
		let normal = direction.normal();
		
		let pointOnLine = position.subtract(direction.multiply(length));
		let point1 = pointOnLine.add(normal.multiply(width));
		let point2 = pointOnLine.add(normal.multiply(-width));
		
		this.context.beginPath();
			this.context.moveTo(position.x, position.y);
			this.context.lineTo(point1.x, point1.y);
			this.context.lineTo(point2.x, point2.y);
			this.context.lineTo(position.x, position.y);
			this.context.fill();
		this.context.closePath();
		
	}

	drawLabel(position1, position2, text, style, isCircle) {
		const {textPadding, labelFontSize, textColor} = style;
		let centerPoint = this.getTextCenterPoint(position1, position2);
		
		this.context.font         = labelFontSize + "px sans-serif";
		this.context.textBaseline = "middle";
		
		this.context.fillStyle = textColor;

		let vectorEdge   = new Point(position2.x - position1.x, position2.y - position1.y);
		let angleRadians = Math.atan2(vectorEdge.y, vectorEdge.x);

		if(isCircle) {
			vectorEdge = new Point(1,0);
		} else {
			if (angleRadians > Math.PI / 2 || angleRadians < -Math.PI / 2) {
				vectorEdge   = new Point(position1.x - position2.x, position1.y - position2.y);
				angleRadians = Math.atan2(vectorEdge.y, vectorEdge.x);          
			}
		}

		const normalize =  vectorEdge.normal().normalizeCopy(isCircle ? 0 : textPadding);

		this.context.save();
			this.context.translate(centerPoint.x - normalize.x, centerPoint.y - normalize.y);
			this.context.rotate(angleRadians);
			this.context.textAlign = "center";
			this.context.fillText(text, 0, 0);
		this.context.restore();
	}

	drawMark = function(position1, position2, mark, style, isCircle) { 
		const {textPadding, markFontSize} = style
		
		let centerPoint = this.getTextCenterPoint(position1, position2);
				
		this.context.font         = markFontSize + "px sans-serif";
		this.context.textBaseline = "middle";
				
		let vectorEdge   = new Point(position2.x - position1.x, position2.y - position1.y);
		let angleRadians = Math.atan2(vectorEdge.y, vectorEdge.x);
		

		if(isCircle) {
			vectorEdge = new Point(1,0);
		} else {
			if (angleRadians > Math.PI / 2 || angleRadians < -Math.PI / 2) {
				vectorEdge   = new Point(position1.x - position2.x, position1.y - position2.y);
				angleRadians = Math.atan2(vectorEdge.y, vectorEdge.x);          
			}
		}
		
		const normalize = vectorEdge.normal().normalizeCopy(isCircle ? -2.5 * textPadding : -textPadding);
		
		this.context.save();
			this.context.translate(centerPoint.x - normalize.x, centerPoint.y - normalize.y);
			this.context.rotate(angleRadians);
			this.context.textAlign = "center";

			let shift = 0;
			const {type, id} = {...mark};
			
			this.context.fillText(type, shift, 0);

			shift += this.context.measureText(type).width + 5;

			this.font = markFontSize - 4 + "px sans-serif"
			this.context.fillText(id, shift, 4);

		this.context.restore();
	}

	getTextCenterPoint(position1, position2) {
		let centerPoint = Point.interpolate(position1, position2, 0.5);

		if (position1.equals(position2)) {
			centerPoint.y = centerPoint.y - Math.cos(this.model.getLoopShiftAngel()) * this.model.getLoopSize() * 2;
			centerPoint.x = centerPoint.x - Math.sin(this.model.getLoopShiftAngel()) * this.model.getLoopSize() * 2;
		} 
		
		return centerPoint;
	}
}


class CurvedArcDrawer extends EdgeDrawer {
	constructor(context, model) {
		super(context, model);
	}

	drawArc(position1, position2) {
		
		this.context.lineWidth = 2;

		if (position1.equals(position2)) {
			this.context.beginPath();
				this.context.arc(position1.x - Math.cos(this.model.getLoopShiftAngel()) * this.model.getLoopSize(), 
								position1.y - Math.sin(this.model.getLoopShiftAngel()) * this.model.getLoopSize(), this.model.getLoopSize(), 0, 2 * Math.PI);
				this.context.stroke();
			this.context.closePath();
			
		} else {
			let points = this.model.getBezierPoints(position1, position2);
			let firstBezierPoint  = points[0];  
			let secondBezierPoint = points[1];
			
			this.context.beginPath();
				this.context.moveTo(position1.x, position1.y);
				this.context.bezierCurveTo(firstBezierPoint.x, firstBezierPoint.y, secondBezierPoint.x, secondBezierPoint.y, position2.x, position2.y);
				this.context.stroke(); 
			this.context.closePath();
		}
	}

	getFinishArrowDiretion = function(position1, position2, lengthArrow) {
			let dist      = position1.distance(position2);
			let direction = position2.subtract(this.model.getCurvedPoint(position1, position2, 1.0 - lengthArrow / dist));
			direction.normalize(1.0);
    	return direction;
	}

	getTextCenterPoint = function (position1, position2) {
		let centerPoint = this.model.getCurvedPoint(position1, position2, 0.5)
		if (position1.equals(position2)) {
			centerPoint.y = centerPoint.y - Math.cos(this.model.getLoopShiftAngel()) * this.model.getLoopSize() * 2;
			centerPoint.x = centerPoint.x - Math.sin(this.model.getLoopShiftAngel()) * this.model.getLoopSize() * 2;
		} 
			
		return centerPoint;
	}

	getPointOnArc = function (position1, position2, procent){   
		return this.model.getCurvedPoint(position1, position2, procent);
	}
}

;
/**
 * Graph drawer.
 */
 
function BackgroundStyle(color, opacity = 1.0) {
	this.commonColor   = color;
	this.commonOpacity = opacity;
}

const baseBackgroundStyle = new BackgroundStyle(inputColorLigth);
const darkBackgroundStyle = new BackgroundStyle(inputColorDark);

const lightBackgroundStyle = new BackgroundStyle(inputColorLigth);



class BackgroundDrawer {
	constructor(context) {
		this.context = context;
		this.style = baseBackgroundStyle;
	}

	setStyle(style) {
		this.style = style;
	}

	draw(width, height, position, scale) {
		let context = this.context;
		let style =  this.style;
		let rect = new Rect(position, position.add(new Point(width / scale, height / scale)));
		
		context.clearRect(-rect.minPoint.x, -rect.minPoint.y, rect.size().x + 1, rect.size().y + 1);
		
		if (style.commonOpacity > 0.0) {
			context.globalAlpha = style.commonOpacity;
			context.fillStyle   = style.commonColor;
			context.fillRect(-rect.minPoint.x, -rect.minPoint.y, rect.size().x + 1, rect.size().y + 1);
			context.globalAlpha = 1.0;
		}
	}
};
function Graph() {
	// List of vertex.
	this.vertices = [];
	// List of arcs.
	this.edges   = [];
	// Unique Id of new graph.
	this.uidGraph = 1;
	// Unique Id of new edge.
	this.uidEdge = 10001;
	// Has direction edge.
	// this.hasDirect = false;
    // Is graph multi
    this.isMultiGraph = false;
	// Vertex name style
	this.pattern = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
};

// infinity
Graph.prototype.infinity = 1E8;
// Max vertexes
Graph.prototype.maxVertexes = 1000;
// Offset for edges ids.
Graph.prototype.edgesOffset = 10000;

// add Vertex
Graph.prototype.AddNewVertex = function(x,y) {
	if (this.vertices.length <= this.maxVertexes) {
		const v = new Vertex(new Point(x, y), this.uidGraph, this.getVertexText(this.uidGraph - 1));
		if(this.uidGraph == 1) {
			v.setType('start');
		}
		this.vertices.push(v);
		this.uidGraph = this.uidGraph + 1;
	}

	return this.vertices.length - 1;
}

Graph.prototype.getVertexText = function(id) {
    let res = this.pattern[id % this.pattern.length];

	while (id >= this.pattern.length) {
	   id  = Math.floor(id / this.pattern.length) - 1;
	   res = this.pattern[id % this.pattern.length] + res;
	}

	return res;
}


Graph.prototype.AddNewEdge = function(edge, replaceIfExists) {
    edge.id = this.uidEdge;
    this.uidEdge = this.uidEdge + 1;
    
	var edge1      = this.FindEdgeAny(edge.v1.id, edge.v2.id);
	var edgeRevert = this.FindEdgeAny(edge.v2.id, edge.v1.id);

	if (!edge.isDirect) {
		if (edge1 != null && replaceIfExists)
			this.DeleteEdge(edge1);
		if (edgeRevert != null && replaceIfExists)
			this.DeleteEdge(edgeRevert);
		this.edges.push(edge);
	} else {
		if (edge1 != null && replaceIfExists)
			this.DeleteEdge(edge1);
		if (edgeRevert != null && !edgeRevert.isDirect && replaceIfExists)
			this.DeleteEdge(edgeRevert);
		
		this.edges.push(edge);
	}
    
    this.isMultiGraph = this.checkMutiGraph();
	
	return this.edges.length - 1;
}


Graph.prototype.DeleteEdge = function(edgeObject) {
	var index = this.edges.indexOf(edgeObject);
	
	if (index > -1) {
		this.edges.splice(index, 1);
	}
    
    this.isMultiGraph = this.checkMutiGraph();
}

Graph.prototype.DeleteVertex = function(vertexObject) {
	if(this.vertices.length > 1 && vertexObject.getId() != 0) {
		var index = this.vertices.indexOf(vertexObject);
		if (index > -1) {
			for (var i = 0; i < this.edges.length; i++) {
				if (this.edges[i].v1 == vertexObject || this.edges[i].v2 == vertexObject) {
					this.DeleteEdge(this.edges[i]);
					i--;
				}
			}
			
			this.vertices.splice(index, 1);
		}
	} else {
		if(this.vertices.length == 1) {
			this.vertices = []
		}
	}

	
}

Graph.prototype.HasConnectedNodes = function(vertexObject) {
	var res = false;

	var index = this.vertices.indexOf(vertexObject);
	if (index > -1)  {
 		for (var i = 0; i < this.edges.length; i++) {
			if (this.edges[i].v1 == vertexObject || this.edges[i].v2 == vertexObject) {
				res = true;
				break;
			}
		}
	}

	return res;
}

Graph.prototype.FindVertex = function(id) {
	var res = null;
	for (var i = 0; i < this.vertices.length; i++) {
		if (this.vertices[i].id == id) {
			res = this.vertices[i];
			break;
		}
	}
	
	return res;
}

// depricated
Graph.prototype.FindEdge = function(id1, id2) {
	return this.FindEdgeAny(id1, id2);
}

Graph.prototype.FindEdgeById = function(edgeId) {
    var res = null;
    for (var i = 0; i < this.edges.length; i++) {
        if (this.edges[i].id == edgeId) {
            res = this.edges[i];
            break;
        }
    }
	
    return res;
}

Graph.prototype.FindEdgeAny = function(id1, id2) {
	var res = null;
	for (var i = 0; i < this.edges.length; i++) {
		if ((this.edges[i].v1.id == id1 && this.edges[i].v2.id == id2)
		     || (!this.edges[i].isDirect && this.edges[i].v1.id == id2 && this.edges[i].v2.id == id1))
		{
			res = this.edges[i];
			break;
		}
	}
	
	return res;
}

Graph.prototype.FindAllEdges = function(id1, id2) {
	return this.edges.filter(({v1, v2}) => v1.id == id1 && v2.id == id2 || v2.id == id1 && v1.id == id2);
}

Graph.prototype.IsVertexesHasSamePosition = function (position, vertexCount) {
	var res = false;

	for (var j = 0; j < Math.min(this.vertices.length, vertexCount); j++)
	{
		if (position.distance(this.vertices[j].position) < this.vertices[j].model.diameter * 2)
		{
			res = true;
			break;
		}
	}

	return res;
}

Graph.prototype.GetRandomPositionOfVertex = function (matrix, vertexIndex, viewportSize) {
	var point = new Point(0, 0);
	var relatedVertex = [];
	for (var j = 0; j < matrix.length; j++) {
		if (j < this.vertices.length && (cols[vertexIndex][j] > 0 || 
			cols[j][vertexIndex] > 0) && j != vertexIndex) 
		{
			relatedVertex.push(this.vertices[j]);
		}
	}

	var diameter = (new VertexModel()).diameter;

	if (relatedVertex.length > 1) {
		for (var j = 0; j < relatedVertex.length; j++) {
			point = point.add(relatedVertex[j].position);
		}

		point = point.multiply(1 / relatedVertex.length);
		point.offset (Math.random() * diameter + (Math.random() ? -1 : 1) * 2 * diameter, Math.random() * diameter + (Math.random() ? -1 : 1) * 2 * diameter);
	} else {
		point = new Point(Math.random() * viewportSize.x, Math.random() * viewportSize.y);
	}

	if (this.IsVertexesHasSamePosition (point, matrix.length)) { 
		point.offset (Math.random() * diameter + + (Math.random() ? -1 : 1) * 4 * diameter, 
			Math.random() * diameter + + (Math.random() ? -1 : 1) * 4 * diameter);
	}

	// Clamp
	point.x = Math.min(Math.max(point.x, diameter), viewportSize.x);
	point.y = Math.min(Math.max(point.y, diameter), viewportSize.y);

	return point;
}

Graph.prototype.save = function(){
	const graph = {
		uidGraph: this.uidGraph,
	 	uidEdge:  this.uidEdge,
		vertices: this.vertices.map(v => v.save()),
		edges: this.edges.map(edge => edge.save())
	}

	return JSON.stringify(graph);
}

Graph.prototype.load = function(data) {
	const {uidGraph, uidEdge, vertices, edges} = {...JSON.parse(data)}
	
	const graph = new Graph();
	graph.uidGraph = uidGraph;
	graph.uidEdge  = uidEdge;
	graph.vertices = vertices.map(v => Vertex.load(v));
	graph.edges    = edges.map(edge => EdgeModel.load(edge, graph.vertices));

	return graph;
}


Graph.prototype.hasDirectEdge = function () {
	var res = false;
	for (var i = 0; i < this.edges.length; i++) {
		if(this.edges[i].isDirect) {
			res = true;
			break;
		}
	}
	
	return res;
}

Graph.prototype.clampPositions = function (viewportSize) {
	var diameter = (new VertexModel()).diameter;

     	for(i = 0; i < this.vertices.length; i++) // set new positions
     	{
       		this.vertices[i].position.x = Math.min(Math.max(this.vertices[i].position.x, diameter), viewportSize.x - diameter);
        	this.vertices[i].position.y = Math.min(Math.max(this.vertices[i].position.y, diameter), viewportSize.y - diameter);
        }
}

// Use to setup scaling.
Graph.prototype.getGraphBBox = function (viewportSize) {
    let pointMin = new Point(1e5, 1e5);
    let pointMax = new Point(-1e5, -1e5);

	this.vertices.forEach(v => {
		var deltaVector = new Point(v.d, v.d);
        pointMin = pointMin.min(v.pos.subtract(deltaVector));
        pointMax = pointMax.max(v.pos.add(deltaVector));
	})

    const max_cruvled_length = 32;
	
	this.edges.forEach(edge => {
		if (edge.model.type == EdgeModels.cruvled) {
            var max_cruvled = edge.v2.pos.subtract(edge.v1.pos).length() / max_cruvled_length;
            
            for (j = 0; j < max_cruvled; j++) {
              var point = edge.model.getCurvedPoint(edge.v1.pos, edge.v2.pos, j / max_cruvled);
              var deltaVector = new Point(max_cruvled_length, max_cruvled_length);
              pointMin = pointMin.min(point.subtract(deltaVector));
              pointMax = pointMax.max(point.add(deltaVector));
            }
        }
	})
    
    return new Rect(pointMin, pointMax);
}

Graph.prototype.hasPair = function (edge) {
	return this.FindPairFor(edge) != null;
}

Graph.prototype.FindPairFor = function (edge) {
    var res = this.getNeighbourEdges(edge);
	
	return res.length == 1 ? res[0] : null;
}

Graph.prototype.getNeighbourEdges = function (edge) {
	var res = [];
    
	for (var i = 0; i < this.edges.length; i++) {
        var curEdge = this.edges[i];
        if (curEdge == edge)
            continue;
            
		if ((curEdge.v1.id == edge.v1.id  && 
             curEdge.v2.id == edge.v2.id) ||
            (curEdge.v1.id == edge.v2.id  && 
             curEdge.v2.id == edge.v1.id)) 
		{
			res.push(curEdge);
		}
	}
	
	return res;
}

Graph.prototype.checkMutiGraph = function () {
	var res = false;
    
    var start  = {};
    
	for (var i = 0; i < this.edges.length; i++) {
        var edge = this.edges[i];
        if (start.hasOwnProperty(edge.v1.id) && 
            start[edge.v1.id] == edge.v2.id)
        {
            res = true;
            break;
        }
        
        start[edge.v1.id] = edge.v2.id;
        if (!edge.isDirect) {
            if (start.hasOwnProperty(edge.v2.id) && 
                start[edge.v2.id] == edge.v1.id)
            {
                res = true;
                break;
            }
            
            start[edge.v2.id] = edge.v1.id;
        }
	}
	
	return res;
}

Graph.prototype.isMulti = function () {
	return this.isMultiGraph;
}

Graph.prototype.isNeedReposition = function () {
    var res = false;
	for (var i = 0; i < this.vertices.length; i++) {
		res = res || this.vertices[i].IsUndefinedPosition();
	}

    return res;
}

Graph.prototype.FixEdgeCurved = function (edgeIndex)
{
    var edgeObject = this.edges[edgeIndex];
    var hasPair    = this.hasPair(edgeObject);
    var neighbourEdges = this.getNeighbourEdges(edgeObject);
    
    if (hasPair) {
        if (edgeObject.model.default)
            edgeObject.model.type = EdgeModels.cruvled; 
        
        var pairEdge = this.FindPairFor(edgeObject);
        if (pairEdge.model.default) {
            pairEdge.model.type = EdgeModels.cruvled;
            if (pairEdge.v1 == edgeObject.v1 && pairEdge.v2 == edgeObject.v2)
                pairEdge.model.curvedValue = -pairEdge.model.curvedValue;
        }
    }
    else if (neighbourEdges.length >= 2) {
        var cruvled = this.GetAvalibleCruvledValue(neighbourEdges, edgeObject);
        if (edgeObject.model.default) {
            edgeObject.model.type        = EdgeModels.cruvled;
            edgeObject.model.curvedValue = cruvled;
        }
    }
}

Graph.prototype.GetAvalibleCruvledValue = function(neighbourEdges, originalEdge) {
    var values = [];
    
    for (var i = 0; i < neighbourEdges.length; i ++) {
      var edge          = neighbourEdges[i];
      var sameDirection = (originalEdge.v1.id == edge.v1.id);
      if (edge.model.type == EdgeModels.cruvled) {
        values[(sameDirection ? edge.model.curvedValue : -edge.model.curvedValue)] = true;
      }
    }
    
    var changeValue  = DefaultHandler.prototype.curvedValue;
    var defaultValue = 0.0;
    var maxSearch    = 10;
    
    for (var i = 1; i < maxSearch; i ++) {
        value = i * changeValue;
        if (!values.hasOwnProperty(value))
            return value;

        value = - i * changeValue;
        if (!values.hasOwnProperty(value))
            return value;
    }
    
    return defaultValue;
};
class Loader {
	loadGraph = (data) => {
		const {uidGraph, uidEdge, vertices, edges} = {...JSON.parse(data)}
		
		const graph = new Graph();
		graph.uidGraph = uidGraph;
		graph.uidEdge  = uidEdge;
		graph.vertices = vertices.map(v => this.loadVertex(v));
		graph.edges    = edges.map(edge => this.loadEdge(edge, graph.vertices));

		return graph;	
	}	

	loadEdge = (data, vertices) => {
		const {id, v1Id, v2Id, label, mark, model} = {...data};

		
		const v1 = vertices.find(v => v.id == v1Id);
		const v2 = vertices.find(v => v.id == v2Id);

		// const marks = mark.({type, id}) => {
		// 	return new Mark(type, id)
		// })

		const edge = new Edge(v1, v2, label, mark, model);
		
		edge.setId(id);
		
		return edge;
	}

	loadVertex = (data) => {
		const {pos, id, text, type} = {...data};

		const {x, y} = {...pos}
		return new Vertex(new Point(x, y), id, text, type);
	}
};
window.addEventListener('DOMContentLoaded', () => {
	document.querySelectorAll('.dialog').forEach(item => {
		const closeBtn = item.querySelector('.dialog__close');
		item.addEventListener('click', (e) => {
			if(e.target === item) {
				item.classList.add('hide');
				document.body.classList.remove('locked');
			}
		});

		closeBtn.addEventListener('click', ()=> {
			item.classList.add('hide')
			document.body.classList.remove('locked');
		})
	})

	document.querySelector('#RadiosMarkTypeNone').addEventListener('change', hideMarkId);
	document.querySelector('#RadiosMarkTypeOpen').addEventListener('change', showMarkId);
	document.querySelector('#RadiosMarkTypeClose').addEventListener('change', showMarkId);
})


const hideMarkId = () => {
	document.querySelector('#MarkId').classList.add('dark');
	document.querySelector('#EdgeMarkInput').readOnly = true;
	document.querySelector('#EdgeMarkInput').placeholder = "Choose type of Mark"
}

const showMarkId = () => {
	document.querySelector('#MarkId').classList.remove('dark');
	document.querySelector('#EdgeMarkInput').readOnly = false;
	document.querySelector('#EdgeMarkInput').placeholder = "";
	document.querySelector('#EdgeMarkInput').focus();
}


const closeModal = () => {
	console.log("closeModal");
	window.removeEventListener('click', closeModal);

	document.querySelectorAll('.dropdown__list').forEach(item => {
		console.log('wtf');
		item.classList.add('hide');
	});
};

const openModal = (e, item) => {
	
	window.addEventListener('click', closeModal);
	e.stopPropagation();
	item.classList.remove('hide');
};
/**
 *
 *  This event handlers.
 *
 */

function BaseHandler(app) {
	this.app = app;
    this.app.setRenderPath([]);
}

// Need redraw or nor.
BaseHandler.prototype.needRedraw = false;
BaseHandler.prototype.objects    = [];
BaseHandler.prototype.message    = "";

BaseHandler.prototype.IsNeedRedraw = function(object) {
	return this.needRedraw;
}

BaseHandler.prototype.RestRedraw = function(object) {
	this.needRedraw = false;
}

BaseHandler.prototype.SetObjects = function(objects) {
	this.objects = objects;
}

BaseHandler.prototype.GetSelectedGraph = function(pos) {
	// Selected Graph.
    var res = null;
    for (var i = 0; i < this.app.graph.vertices.length; i ++) {
		if (this.app.graph.vertices[i].hitTest(pos)) {
            // Select last of them.
            res = this.app.graph.vertices[i];
		}
	}

	return res;
}

BaseHandler.prototype.GetSelectedArc = function(pos) {
    for (var i = 0; i < this.app.graph.edges.length; i ++) {
        var edge = this.app.graph.edges[i];
        
        if (edge.hitTest(new Point(pos.x, pos.y)))
            return edge;
	}
	
	return null;
}

BaseHandler.prototype.GetSelectedObject = function(pos) {
	var graphObject = this.GetSelectedGraph(pos);
	if (graphObject) {
		return graphObject;
	}
	
	var arcObject = this.GetSelectedArc(pos);
	if (arcObject) {
		return arcObject;
	}
	
	return null;
}

BaseHandler.prototype.GetMessage = function() {
	return this.message;
}

BaseHandler.prototype.MouseMove = function(pos) {}

BaseHandler.prototype.MouseDown = function(pos) {}

BaseHandler.prototype.MouseUp   = function(pos) {}

BaseHandler.prototype.GetSelectedGroup = function(object) {
	return 0;
}

BaseHandler.prototype.InitControls = function() {
    var vertex1Text = document.getElementById("Vertex1");
    if (vertex1Text) {
        var handler = this;
        vertex1Text.onchange = function () {
           for (var i = 0; i < handler.app.graph.vertices.length; i++)
           {   
               if (handler.app.graph.vertices[i].mainText == vertex1Text.value)
               {
	               handler.SelectFirstVertexMenu(vertex1Text, handler.app.graph.vertices[i]);
                   break;
               }
           }
        };
        
        this.UpdateFirstVertexMenu(vertex1Text);
    }
    
    var vertex2Text = document.getElementById("Vertex2");
    if (vertex2Text) {
        var handler = this;
        vertex2Text.onchange = function () {
           for (var i = 0; i < handler.app.graph.vertices.length; i++)
           {   
               if (handler.app.graph.vertices[i].mainText == vertex2Text.value)
               {
	               handler.SelectSecondVertexMenu(vertex2Text, handler.app.graph.vertices[i]);
                   break;
               }
           }
        };
        
        this.UpdateSecondVertexMenu(vertex2Text);
    }
}

BaseHandler.prototype.GetNodesPath = function(array, start, count) {
    var res = [];
    for (var index = start; index < start + count; index++) {
        res.push(this.app.graph.FindVertex(array[index].value));
    }
    return res;
}

BaseHandler.prototype.RestoreAll = function()
{
}

BaseHandler.prototype.GetSelectedVertex = function() {
    return null;
}

BaseHandler.prototype.RenameVertex = function(text, object) {
    if (object != null && (object instanceof Vertex)) {
        this.app.PushToStack("RenameVertex");
        object.mainText = text;
        this.app.redrawGraph();
    }
}

BaseHandler.prototype.ShowCreateEdgeDialog = function(firstVertex, secondVertex, addEdgeCallBack) {
    if (!this.app.graph.isMulti()) {
        var hasEdge        = this.app.graph.FindEdgeAny(firstVertex.id, secondVertex.id);
        var hasReverseEdge = this.app.graph.FindEdgeAny(secondVertex.id, firstVertex.id);

        if (hasEdge == null && hasReverseEdge == null) {
            document.querySelector('#RadiosAddEdge').checked = true;
			document.querySelector('#NewEdgeAction').classList.add('hide');
		
          
        } else {
			document.querySelector('#NewEdgeAction').classList.remove('hide');
        }
    } else {
        document.querySelector('#RadiosAddEdge').checked = true;
		document.querySelector('#NewEdgeAction').classList.add('hide');
    }

	document.querySelector('#EdgeLableInput').focus();
    document.querySelector('#EdgeLableInput').value = "";
	document.querySelector('#EdgeMarkInput').value = "";
	document.querySelector('#RadiosMarkTypeNone').checked = true;
	hideMarkId();
	var handler = this;
	
	const parent = document.querySelector('#addEdge');
		
	parent.classList.remove('hide');
	document.body.classList.add('locked');

	const directedBtn = document.querySelector('#directedBtn');
	
	const btnAction = (isDirected) => {
		handler.app.PushToStack("Connect");                
		addEdgeCallBack(firstVertex, secondVertex, isDirected);                    
		parent.classList.add('hide');
		document.body.classList.remove('locked');
	}

	const directedBtnAction = () => {
		btnAction(true);
		directedBtn.removeEventListener('click',directedBtnAction);
	}

	directedBtn.addEventListener('click', directedBtnAction);
	
}

/**
 * Default handler.
 * Select using mouse, drag.
 *
 */
function DefaultHandler(app) {
    this.removeStack = true;
	BaseHandler.apply(this, arguments);
	this.message = g_textsSelectAndMove; 
	this.app.updateMessage();
	this.selectedObjects = [];
	this.dragObject      = null;
	this.selectedObject  = null;
	this.prevPosition    = null;
    this.groupingSelect  = false;
    this.selectedLogRect = false;
    this.selectedLogCtrl = false;
    this.saveUndo    = false;
}

// inheritance.
DefaultHandler.prototype = Object.create(BaseHandler.prototype);
// Is pressed
DefaultHandler.prototype.pressed = false;
// Cuvled change value.
DefaultHandler.prototype.curvedValue    = 0.1;

DefaultHandler.prototype.GetSelectedVertex = function() {
    return (this.selectedObject instanceof Vertex) ? this.selectedObject : null;
}

DefaultHandler.prototype.MouseMove = function(pos)  {
	if (this.dragObject) {
        if (!this.saveUndo) {
            this.app.PushToStack("Move");
            this.saveUndo = true;
        }
                this.dragObject.pos.x = pos.x;
                this.dragObject.pos.y = pos.y;
		this.needRedraw = true;
	} else if (this.selectedObjects.length > 0 && this.pressed && !this.groupingSelect) {
		if (!this.saveUndo) {
			this.app.PushToStack("Move");
			this.saveUndo = true;
		}

		var offset = (new Point(pos.x, pos.y)).subtract(this.prevPosition);
		for (var i = 0; i < this.selectedObjects.length; i ++) {
			var object = this.selectedObjects[i];
			if (object instanceof Vertex)
			{
			object.position = object.position.add(offset);
			}
		}

		this.prevPosition = pos;

	this.needRedraw = true;         
	}
	else if (this.pressed) {
		if (this.groupingSelect) {
			// Rect select.
			var newPos = new Point(pos.x, pos.y);
			this.app.SetSelectionRect(new Rect(newPos.min(this.prevPosition), newPos.max(this.prevPosition)));
			this.SelectObjectInRect(this.app.GetSelectionRect());    
			this.needRedraw = true;
			if (!this.selectedLogRect) {
				this.selectedLogRect = true;
			}
		} else {
				// Move work space
				this.app.onCanvasMove((new Point(pos.x, pos.y)).subtract(this.prevPosition).multiply(this.app.canvasScale));
				this.needRedraw = true;
		}
	}
}

DefaultHandler.prototype.MouseDown = function(pos) {
	// closeModal();
	this.dragObject     = null;
	var selectedObject = this.GetSelectedObject(pos);

	if (selectedObject == null || (!this.selectedObjects.includes(selectedObject))) {
  	      this.selectedObject = null;
          this.selectedObjects = [];
          this.groupingSelect = false;
    }        

	if (this.selectedObjects.includes(selectedObject) && (this.selectedObjects.length > 0 || this.selectedObject != null) && selectedObject != null) 
	{
		if (this.selectedObjects.length == 0) {
			this.selectedObject = null;
			this.selectedObjects.push(selectedObject);
		}
		else if (!this.selectedObjects.includes(selectedObject)) {
			this.selectedObjects.push(selectedObject);
		}
	}
	else {	
		if (selectedObject != null) {
			this.selectedObject = selectedObject;
		}	
		if ((selectedObject instanceof Vertex) && selectedObject != null) { 
			this.dragObject = selectedObject;
			this.message    = g_moveCursorForMoving;	
			this.app.updateMessage();	
		}	
	}

	this.needRedraw = true;
	this.pressed    = true;
	this.prevPosition = pos;
	this.app.canvas.style.cursor = "move";
}

DefaultHandler.prototype.MouseUp = function(pos) {
    this.saveUndo = false;
	this.message = g_textsSelectAndMove; 
	this.app.updateMessage();
	this.dragObject = null;
    this.pressed    = false;
    this.app.canvas.style.cursor = "auto";
    
    this.groupingSelect = false;

    if (this.selectedObject != null && (this.selectedObject instanceof Vertex)) // Action on Vertex
	{
        this.message = g_textsSelectAndMove;

		if(this.selectedObject.getType() == 'finish') {
			this.message = g_textsSelectAndMove +  "<span><button  id=\"setVertexTypeDefault\" class=\"button\"> set type default</button></span>"
		}

		if(this.selectedObject.getType() == 'default') {
			this.message =  g_textsSelectAndMove + "<span><button  id=\"setVertexTypeFinish\" class=\"button\"> set type finish</button></span>"
		}
	
		this.app.updateMessage();

		if(document.querySelector('#setVertexTypeDefault')) {
			document.querySelector('#setVertexTypeDefault').addEventListener('click', () => {
				this.selectedObject.setType('default');
				this.selectedObject = null;
				this.message = g_textsSelectAndMove;
				this.app.updateMessage();
				this.app.redrawGraph();
				
			})
		}
		if(document.querySelector('#setVertexTypeFinish')) {
			document.querySelector('#setVertexTypeFinish').addEventListener('click', () => {
				this.selectedObject.setType('finish');
				this.selectedObject = null;
				this.message = g_textsSelectAndMove;
				this.app.updateMessage();
				this.app.redrawGraph();
			})
		} 
    }
    else if (this.selectedObject != null && (this.selectedObject instanceof Edge)) // Action on Edge
    {
        this.message = g_textsSelectAndMove
        + "<span><button  id=\"incCurvel\" class=\"button\"> + </button>"
        + " " + g_curveEdge + " "
        + "<button id=\"decCurvel\" class=\"button\"> - </button>"

		this.app.updateMessage();
        var handler = this;
		
		document.querySelector('#incCurvel').onclick = null;
		document.querySelector('#incCurvel').onclick = () => {
            handler.app.PushToStack("ChangeCurvelEdge");

            handler.selectedObject.model.changeCurvedValue(-DefaultHandler.prototype.curvedValue);
            handler.needRedraw = true;
            handler.app.redrawGraph();
        };

		document.querySelector('#decCurvel').addEventListener('click', function() {
            handler.app.PushToStack("ChangeCurvelEdge");

            handler.selectedObject.model.changeCurvedValue(+DefaultHandler.prototype.curvedValue);
            handler.needRedraw = true;
            handler.app.redrawGraph();
        });        
    }
    
    this.needRedraw = true;
}

DefaultHandler.prototype.GetSelectedGroup = function(object)
{
  return (object == this.dragObject) || (object == this.selectedObject) || (this.selectedObjects.includes(object));
}

DefaultHandler.prototype.SelectObjectInRect = function (rect)
{
    this.selectedObjects = [];
    var vertices = this.app.graph.vertices;
    for (var i = 0; i < vertices.length; i ++)
    {
		if (rect.isIn(vertices[i].position) && !this.selectedObjects.includes(vertices[i]))
            this.selectedObjects.push(vertices[i]);
	}

	// Selected Arc.
    var edges = this.app.graph.edges;
    for (var i = 0; i < edges.length; i ++)
    {
        var edge = edges[i];
        
        if (rect.isIn(edge.vertex1.position) && rect.isIn(edge.vertex2.position) && !this.selectedObjects.includes(edge))
            this.selectedObjects.push(edge);
	}
}

/**
 * Add Graph handler.
 *
 */
function AddGraphHandler(app) {
  this.removeStack = true;
  BaseHandler.apply(this, arguments);
  this.message = g_clickToAddVertex;	
}

// inheritance.
AddGraphHandler.prototype = Object.create(BaseHandler.prototype);

AddGraphHandler.prototype.MouseDown = function(pos)  {
    this.app.PushToStack("Add");
	this.app.CreateNewGraph(pos.x, pos.y);
	this.needRedraw = true;
	this.inited = false;
}

/**
 * Connection Graph handler.
 *
 */
function ConnectionGraphHandler(app)
{
  this.removeStack = true;
  BaseHandler.apply(this, arguments);
  this.SelectFirst();
}

// inheritance.
ConnectionGraphHandler.prototype = Object.create(BaseHandler.prototype);
// First selected.
ConnectionGraphHandler.prototype.firstObject = null;

ConnectionGraphHandler.prototype.GetSelectedVertex = function() {
    return (this.firstObject instanceof Vertex) ? this.firstObject : null;
}

ConnectionGraphHandler.prototype.AddNewEdge = function(selectedObject) {
	let mark = undefined;
	if(!document.querySelector('#RadiosMarkTypeNone').checked) {
		let markInput = document.querySelector('#EdgeMarkInput').value;
		mark = new Mark(
			document.querySelector('#RadiosMarkTypeOpen').checked ? '(' : ')',
			markInput.length > 0 ? markInput : ""
		)
	}		

	this.app.CreateNewArc(	
		this.firstObject, 
		selectedObject, 
		document.querySelector('#RadiosReplaceEdge').checked,
		document.querySelector('#EdgeLableInput').value,
		mark
	);
    
	this.SelectFirst();					
	this.app.NeedRedraw();
}

ConnectionGraphHandler.prototype.SelectVertex = function(selectedObject) {
    if (this.firstObject) {
        var direct = false;
        var handler = this;

        this.ShowCreateEdgeDialog(this.firstObject, selectedObject, function (firstVertex, secondVertex) {
            handler.AddNewEdge(secondVertex);
        });
    } else {
        this.SelectSecond(selectedObject);	
    }

    this.needRedraw = true;
}

ConnectionGraphHandler.prototype.MouseDown = function(pos) {
	var selectedObject = this.GetSelectedGraph(pos);
	if (selectedObject && (selectedObject instanceof Vertex)) {
        this.SelectVertex(selectedObject);
	} else {  
      this.SelectFirst();
      this.needRedraw = true;
    }
}

ConnectionGraphHandler.prototype.GetSelectedGroup = function(object) {
	return (object == this.firstObject) ? 1 : 0;
}

ConnectionGraphHandler.prototype.SelectFirst = function() {
	this.firstObject = null;
	this.message     = g_selectFisrtVertexToConnect;
	this.app.updateMessage();
}

ConnectionGraphHandler.prototype.SelectSecond = function(selectedObject) {
	this.firstObject = selectedObject;
	this.message     = g_selectSecondVertexToConnect;		
	this.app.updateMessage();
}

/**
 * Delete Graph handler.
 *
 */
function DeleteGraphHandler(app) {
  this.removeStack = true;
  BaseHandler.apply(this, arguments);
  this.message = g_selectObjectToDelete;
  this.app.updateMessage();
}

// inheritance.
DeleteGraphHandler.prototype = Object.create(BaseHandler.prototype);

DeleteGraphHandler.prototype.MouseDown = function(pos) {
	var selectedObject = this.GetSelectedObject(pos);
        
    if (!this.app.IsCorrectObject(selectedObject))
        return;
    
    this.app.PushToStack("Delete");
    this.app.DeleteObject(selectedObject);
	this.needRedraw = true;
}

/**
 * Delete Graph handler.
 *
 */
function DeleteAllHandler(app) {
  BaseHandler.apply(this, arguments);  
}

// inheritance.
DeleteAllHandler.prototype = Object.create(BaseHandler.prototype);

DeleteAllHandler.prototype.clear = function() {	
    this.app.PushToStack("DeleteAll");

	// Selected Graph.
    this.app.graph = new Graph(); 
    this.app.savedGraphName = "";
    this.needRedraw = true;
};
/**
 * This is main application class.
 *
 */
 
let globalApplication = null;
 
function Application(document, window) {
    this.document = document;
    this.canvas  = this.document.querySelector('#canvas');
	this.canvasPosition = new Point();
	this.canvasScale = 1;
    this.handler = new AddGraphHandler(this);
    
	this.savedGraphName = "";

    this.findPathReport = 1;
    this.isTimerRender = false;

    globalApplication  = this;
    this.renderPath = [];
    this.renderTimer = 0;
    this.renderPathLength  = 0;
    this.renderPathCounter = 0;
    this.renderPathLoops = 0;

    this.undoStack  = [];
    
    this.renderPathWithEdges = false;
    
    this.selectionRect  = null;

	this.vertexDrawer     = new VertexDrawer(this.canvas.getContext('2d'));
	this.backgroundDrawer = new BackgroundDrawer(this.canvas.getContext('2d'));

	this.loader = new Loader();
};

// List of graph.
//Application.prototype.graph.vertices     = [];
// Current draged object.
Application.prototype.graph = new Graph();
Application.prototype.dragObject = -1;
// List of graph.edges.
//Application.prototype.graph.edges       = [];
// User handler.
Application.prototype.handler = null;
// Hold status.
Application.prototype.status = {};
// Graph name length
Application.prototype.graphNameLength = 16;
// Max undo stack size
Application.prototype.maxUndoStackSize = 20;

Application.prototype.getMousePos = function(canvas, e) {
    /// getBoundingClientRect is supported in most browsers and gives you
    /// the absolute geometry of an element
    let rect = canvas.getBoundingClientRect();

    /// as mouse event coords are relative to document you need to
    /// subtract the element's left and top position:
    return {x: (e.clientX - rect.left) / this.canvasScale - this.canvasPosition.x, y: (e.clientY - rect.top) / this.canvasScale - this.canvasPosition.y};
}

Application.prototype.redrawGraph = function() {
    if (!this.isTimerRender) {
        this._redrawGraphInWindow();
        // this.GraphTypeChanged();
    }
}

Application.prototype.redrawGraphTimer = function() {
    if (this.isTimerRender) {
        let context = this._redrawGraphInWindow();
        
        // Render path
        if (this.renderPath.length > 1) {
            context.save();
            context.scale(this.canvasScale, this.canvasScale);
            context.translate(this.canvasPosition.x, this.canvasPosition.y);
            
            let movePixelStep = 16;
            let currentLength = 0;
            
            let i = 0
            for (i = 0; i < this.renderPath.length - 1; i++) {
                let edge = null;
                if (this.renderPathWithEdges) {
                    edge = this.graph.FindEdgeById(this.renderPath[i + 1]);
                    i++;
                } else if (this.renderMinPath) {
                    edge = this.graph.FindEdgeMin(this.renderPath[i], this.renderPath[i + 1]);
                } else {
                    edge = this.graph.FindEdge(this.renderPath[i], this.renderPath[i + 1]);
                }
                    
                currentLength += edge.GetPixelLength();
                if (currentLength > this.renderPathCounter) {
                    currentLength -= edge.GetPixelLength();
                    break;
                }
            }
            
            if (i >= this.renderPath.length - 1) {
                i = 0;
                if (this.renderPathWithEdges) {
                    i = 1;
				}
                
				this.renderPathCounter = 0;
                currentLength = 0;
                this.renderPathLoops += 1;
            }
            
            let edge = null;
            let currentVertexId = this.renderPath[i];
            if (this.renderPathWithEdges) {
                edge = this.graph.FindEdgeById(this.renderPath[i]);
                currentVertexId = this.renderPath[i - 1];
            } else if (this.renderMinPath) {
                edge = this.graph.FindEdgeMin(this.renderPath[i], this.renderPath[i + 1]);
            } else {
                edge = this.graph.FindEdge(this.renderPath[i], this.renderPath[i + 1]);
            }
            
            let progress = (this.renderPathCounter - currentLength) / edge.GetPixelLength();
            
            this.RedrawEdgeProgress(context, edge, edge.vertex1.id == currentVertexId ? progress : 1.0 - progress);

            this.renderPathCounter += movePixelStep;
            
            context.restore();
        }
    }
    
    if (this.renderPathLoops >= 5) {
        this.stopRenderTimer();
    }
}

Application.prototype._redrawGraphInWindow = function() {
    let context = this.canvas.getContext('2d');
	
    context.save();
    
		context.scale(this.canvasScale, this.canvasScale);
		context.translate(this.canvasPosition.x, this.canvasPosition.y);
		
		this._RedrawGraph(context, this.canvasPosition, this.backgroundCommonStyle, true);

    context.restore();
    
    return context;
}

Application.prototype._OffscreenRedrawGraph = function() {
    let bbox = this.graph.getGraphBBox();
    let canvas = document.createElement('canvas');
    canvas.width  = bbox.size().x;
    canvas.height = bbox.size().y;
    let context = canvas.getContext('2d');
    
    context.save();

    context.translate(bbox.minPoint.inverse().x, bbox.minPoint.inverse().y);
    
    this._RedrawGraph(context, bbox.minPoint.inverse(), this.backgroundCommonStyle, false);
    
    context.restore();
    
    return canvas;
}

Application.prototype.updateRenderPathLength = function() {
    this.renderPathLength = 0;
    this.renderPathCounter = 0;
    if (this.renderPath.length > 1) {
        for (let i = 0; i < this.renderPath.length - 1; i++) {
            let edge = null;
            if (this.renderPathWithEdges) {
                edge = this.graph.FindEdgeById(this.renderPath[i + 1]);
                i++;
            } else {
                edge = this.graph.FindEdge(this.renderPath[i], this.renderPath[i + 1]);
            }

            this.renderPathLength += edge.GetPixelLength();
        }
    }
}

Application.prototype.startRenderTimer = function() {
    this.updateRenderPathLength();
    this.renderTimer = window.setInterval(function(){globalApplication.redrawGraphTimer();}, 50);
    this.isTimerRender = true;
    this.renderPathLoops = 0;
}

Application.prototype.stopRenderTimer = function() {
    if (this.isTimerRender) {
        window.clearInterval(this.renderTimer);
        this.isTimerRender = false;
        this.renderPathLoops = 0;
    }
}

Application.prototype.setRenderPath = function(renderPath, renderMinPath) {
    this.renderPath    = renderPath;
    this.renderMinPath = renderMinPath;
    this.renderPathWithEdges = false;
    
    if (this.renderPath.length > 0) {
        this.startRenderTimer();
    } else {
        this.stopRenderTimer();
    }
}

Application.prototype.setRenderPathWithEdges = function(renderPath) {
    this.renderPath    = renderPath;
    this.renderMinPath = false;
    this.renderPathWithEdges = true;
    
    if (this.renderPath.length > 0) {
        this.startRenderTimer();
    } else {
        this.stopRenderTimer();
    }
}

Application.prototype.GetBaseArcDrawer = function(context, edge) {
    let arcDrawer = new EdgeDrawer(context);
    
    if (edge.model.type == EdgeModels.cruvled) {
        arcDrawer = new CurvedArcDrawer(context, edge.model);
    }
    
    return arcDrawer;
}

// Application.prototype.UpdateEdgeCurrentStyle = function(edge, ForceCommonStyle, ForceSelectedStyle) {
// }

Application.prototype.RedrawEdge = function(context, edge) {
    let arcDrawer       = this.GetBaseArcDrawer(context, edge);
	arcDrawer.draw(edge, this.handler.GetSelectedGroup(edge));
}

Application.prototype.RedrawEdges = function(context) {
    for (i = 0; i < this.graph.edges.length; i ++) {
        this.RedrawEdge(context, this.graph.edges[i]);
    }
}

Application.prototype.RedrawNodes = function(context) {
	this.graph.vertices.forEach(v => {
		this.vertexDrawer.draw(v, this.handler.GetSelectedGroup(v));
	})
}


Application.prototype.updateMessage = function() {
	this.document.querySelector('#message').innerHTML = this.handler.GetMessage(); 
}

Application.prototype.CanvasOnMouseMove  = function(e) {
	// X,Y position.
	let pos = this.getMousePos(this.canvas, e);

	this.handler.MouseMove(pos);
	if (this.handler.IsNeedRedraw()) {
		this.handler.RestRedraw();
		this.redrawGraph();
	}
}

Application.prototype.CanvasOnMouseDown = function(e) {
    // Skip non left button.
    if(e.which !== 1) return;

    let pos = this.getMousePos(this.canvas, e); /// provide this canvas and event

	this.handler.MouseDown(pos);
	if (this.handler.IsNeedRedraw()) {
		this.handler.RestRedraw();
		this.redrawGraph();
	}

    // this.updateMessage();
}

Application.prototype.CanvasOnMouseUp = function(e) {
    // Skip non left button.
    if(e.which !== 1) return;

	this.dragObject = -1;
	let pos = this.getMousePos(this.canvas, e);

	this.handler.MouseUp(pos);
	if (this.handler.IsNeedRedraw()) {
		this.handler.RestRedraw();
		this.redrawGraph();
	}
}

Application.prototype.multCanvasScale = function(factor) {
    let oldRealWidth = this.GetRealWidth();
    let oldRealHeight = this.GetRealHeight();
    
    this.canvasScale *= factor;
    
    this.canvasPosition = this.canvasPosition.add(new Point((this.GetRealWidth()  - oldRealWidth) / 2.0,
                                                            (this.GetRealHeight() - oldRealHeight) / 2.0));
    
    this.redrawGraph();
}

Application.prototype.setCanvasScale = function(factor) {
    let oldRealWidth = this.GetRealWidth();
    let oldRealHeight = this.GetRealHeight();
    
    this.canvasScale = factor;
    
    this.canvasPosition = this.canvasPosition.add(new Point((this.GetRealWidth()  - oldRealWidth) / 2.0,
                                                            (this.GetRealHeight() - oldRealHeight) / 2.0));
    
    this.redrawGraph();
}

Application.prototype.onCanvasMove = function(point) {
    this.canvasPosition = this.canvasPosition.add(point.multiply(1 / this.canvasScale));
    this.redrawGraph();
}

Application.prototype.AddNewVertex = function(x,y) {
	return this.graph.AddNewVertex(x,y);
}

Application.prototype.AddNewEdge = function(edge, replaceIfExists) {
	return this.graph.AddNewEdge(edge, replaceIfExists);
}

Application.prototype.CreateNewGraph = function(x, y) {
    let app = this;
	app.graph.AddNewVertex(x,y);
	app.redrawGraph();
}

Application.prototype.CreateNewGraphEx = function(x, y,) {
    return this.graph.AddNewVertex(x, y);
}

Application.prototype.CreateNewArc = function(v1, v2,  replaceIfExist, label, mark) {
	let edge = this.AddNewEdge(new Edge(v1, v2, label, mark), replaceIfExist);
    this.graph.FixEdgeCurved(edge);
    return edge;
}

Application.prototype.DeleteEdge = function(edgeObject) {
    let v1 = edgeObject.v1;
    let v2 = edgeObject.v2;
    
    let hasPair = this.graph.hasPair(edgeObject);
    
	this.graph.DeleteEdge(edgeObject);
    
    // Make line for pair.
    if (hasPair) {
        let pairEdges = this.FindAllEdges(v2.id, v1.id);
        
        if (pairEdges.length == 1 && pairEdges[0].model.default)
            pairEdges[0].model.type = EdgeModels.line;
    }
}

Application.prototype.DeleteVertex = function(graphObject) {
	this.graph.DeleteVertex(graphObject);
}

Application.prototype.DeleteObject = function(object) {
	if (object instanceof Vertex) {
		this.DeleteVertex(object);
	} else if (object instanceof Edge) {
		this.DeleteEdge(object);
	}
}

Application.prototype.IsCorrectObject = function(object) {
	return (object instanceof Vertex) || 
           (object instanceof Edge);
}

Application.prototype.FindVertex = function(id) {
	return this.graph.FindVertex(id);
}

Application.prototype.FindEdge = function(id1, id2) {
	return this.graph.FindEdge(id1, id2);
}

Application.prototype.FindEdgeAny = function(id1, id2) {
	return this.graph.FindEdgeAny(id1, id2);
}

Application.prototype.FindAllEdges = function(id1, id2) {
	return this.graph.FindAllEdges(id1, id2);
}

Application.prototype.SetHandlerMode = function(mode) {
	switch(mode) {
		case "default": {
			this.handler = new DefaultHandler(this);
			break;
		}

		case "addGraph": {
			this.handler = new AddGraphHandler(this);
			break;
		}

		case "addArc": {
			this.handler = new ConnectionGraphHandler(this);
			break;
		}

		case "delete": {
			this.handler = new DeleteGraphHandler(this);
			break;
		}

		case "deleteAll": {
			let removeAll = new DeleteAllHandler(this);
			removeAll.clear();
			break;
		}

		case "connectedComponent": {
			this.handler = new ConnectedComponentGraphHandler(this);
			break;
		}

		case "graphUndo": {
			!this.IsUndoStackEmpty() && this.Undo();
			break;
		}

		default: {
			break;
		}
	}
    
    this.setRenderPath([]);
	this.updateMessage();
	this.redrawGraph();
}

Application.prototype.onLoad = function() {
    this.canvas = this.document.getElementById('canvas');

    this.handler = new AddGraphHandler(this);

    this.updateMessage();
    this.redrawGraph();
}

Application.prototype.NeedRedraw = function() {
	this.redrawGraph();
}
                          
Application.prototype.LoadGraphFromString = function (str) {
	this.graph = this.loader.loadGraph(str);    
	this.AutoAdjustViewport();
    this.updateMessage();
    this.redrawGraph();   
}

Application.prototype.GetNewGraphName = function() {
    return this.GetNewName();
}

Application.prototype.GetNewName = function() {
    let name = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    for (let i = 0; i < this.graphNameLength; i++ ) {
        name += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return name;
}

Application.prototype.GetGraphName = function() {
    return this.savedGraphName;
}

Application.prototype.SetDefaultHandler = function() {
	restButtons ('Default');
	this.SetHandlerMode("default");
}
                                                    
Application.prototype.GetRealWidth = function () {
    return this.canvas.width / this.canvasScale;
}
                          
Application.prototype.GetRealHeight = function () {
    return this.canvas.height / this.canvasScale;
}
                          
Application.prototype.SetDefaultTransformations = function() {
    this.canvasScale = 1.0;
    this.canvasPosition = new Point(0, 0);
}

Application.prototype.AutoAdjustViewport = function()
{
    graphBBox  = this.graph.getGraphBBox();
    bboxCenter = graphBBox.center();
    bboxSize   = graphBBox.size();
                          
    if (bboxSize.length() > 0) {
        // Setup size
        if (bboxSize.x > this.GetRealWidth() || bboxSize.y > this.GetRealHeight()) {
            this.canvasScale = Math.min(this.GetRealWidth() / bboxSize.x, this.GetRealHeight() / bboxSize.y);
        }
                          
        // Setup position.
        if (graphBBox.minPoint.x < 0.0 || graphBBox.minPoint.y < 0.0 ||
            graphBBox.maxPoint.x > this.GetRealWidth() || graphBBox.maxPoint.y > this.GetRealHeight())
        {
            // Move center.
            this.canvasPosition  = graphBBox.minPoint.inverse();
        }
    }
}
                          
Application.prototype.OnAutoAdjustViewport = function() {
    this.SetDefaultTransformations();
    this.AutoAdjustViewport();
    this.redrawGraph();
}
    
Application.prototype.IsGraphFitOnViewport = function() {
    res = true;
    graphBBox  = this.graph.getGraphBBox();
    let canvasWidth  = this.GetRealWidth();
    let canvasHeight = this.GetRealHeight();
    let canvasPositionInverse = this.canvasPosition.inverse();

    return (Math.floor(canvasPositionInverse.x) <= Math.floor(graphBBox.minPoint.x) &&
        Math.floor(canvasPositionInverse.y) <= Math.floor(graphBBox.minPoint.y) && Math.floor(canvasPositionInverse.x + canvasWidth) >= Math.floor(graphBBox.maxPoint.x)
        && Math.floor(canvasPositionInverse.y + canvasHeight) >= Math.floor(graphBBox.maxPoint.y));
}

Application.prototype.PushToStack = function(actionName) {
    var object        = {};
    object.actionName = actionName;
    object.graphSave  = this.graph.save();    
    
    this.undoStack.push(object);

    while (this.undoStack.length > this.maxUndoStackSize) {
        this.undoStack.shift();
    }
}

Application.prototype.Undo = function() {
    if (this.IsUndoStackEmpty())
        return;
    
    let state  = this.undoStack.pop();

	this.graph = this.loader.loadGraph(state.graphSave)
    this.redrawGraph();  
}

Application.prototype.ClearUndoStack = function() {
    this.undoStack = [];
}

Application.prototype.IsUndoStackEmpty = function() {
    return (this.undoStack.length <= 0);
}

Application.prototype.setBackgroundStyle = function (style) {
	this.backgroundDrawer.setStyle(style);
	this.redrawGraph();
}

Application.prototype.setDarkMode = function() {
	this.backgroundDrawer.setStyle(darkBackgroundStyle);
	baseEdgeStyle = darkEdgeStyle;
	this.redrawGraph();
}

Application.prototype.setLightMode = function () {
	this.backgroundDrawer.setStyle(lightBackgroundStyle);
	baseEdgeStyle = lightEdgeStyle;
	this.redrawGraph();
}

Application.prototype.GetAvalibleCruvledValue = function(neighbourEdges, originalEdge) {
    return this.graph.GetAvalibleCruvledValue(neighbourEdges, originalEdge);
}


Application.prototype._RedrawGraph = function(context, backgroundPosition) {    
    this.backgroundDrawer.draw(
        Math.max(this.canvas.width, this.GetRealWidth()), 
        Math.max(this.canvas.height, this.GetRealHeight()), 
        backgroundPosition, 
        this.canvasScale);
    
    this.RedrawEdges(context);
    this.RedrawNodes(context);
}

Application.prototype.GetSelectedVertexes = function() {
	return this.graph.vertices.find(v => this.handler.GetSelectedGroup(v))
}

Application.prototype.GetSelectedEdges = function() {
	return this.graph.edges.find(edge => this.handler.GetSelectedGroup(edge))
}

Application.prototype.makePiece = function (){
	const newGraph = {
		name: "_main",
		id: -1,
		start: this.graph.vertices.find(v => v.type === 'start').id,
		finish: this.graph.vertices.filter(v => v.type === 'finish').map(v => v.id),
		vertices: this.graph.vertices.map(v => {
			return({
				name: v.text,
				id: v.id,
				edges: this.graph.edges.filter(edge => 
					edge.v1.id === v.id
				).map(edge => ({
					to: edge.v2.id,
					label: edge.label,
					mark: edge.mark
				}))
			})
		})
	}

	return newGraph;
}
;

var DisableEmscripted = false;

var application = new Application(document, window);

var isIe = (navigator.userAgent.toLowerCase().indexOf("msie") != -1 
           || navigator.userAgent.toLowerCase().indexOf("trident") != -1);

var buttonsList = ['AddGraph', 'ConnectGraphs', 'DeleteObject', 'Default'];
var g_ctrlPressed = false;

function restButtons (me) {
    var needSetDefault = false;
	for (var i = 0; i < buttonsList.length; i ++) {
		if (buttonsList[i] != me) {
			document.getElementById(buttonsList[i]).className = "button";
		} else {
			if (document.getElementById(buttonsList[i]).className != "button") {
				needSetDefault = true;	
			}
		}
	}
	if (needSetDefault) {
		document.getElementById(buttonsList[i]).className = "button button_primary";
	} else {
		document.getElementById(me).className = "button button_primary";
	}
}

var single = 0;

function resizeCanvas() {
  var canvas    = document.querySelector('#canvas');
  canvas.width  = document.querySelector('#canvasSection').offsetWidth;
  canvas.height = Math.min(800, window.innerHeight * 0.5);
  application.redrawGraph();
}

function touchHandler(event) {
    var touches = event.changedTouches,
        first = touches[0],
        type = "";
    switch(event.type) {
        case "touchstart": type = "mousedown"; break;
        case "touchmove":  type ="mousemove"; break;        
        case "touchend":   type ="mouseup"; break;
        default: return;
    }

	closeModal();
	
    var simulatedEvent = document.createEvent("MouseEvent");
    simulatedEvent.initMouseEvent(type, true, true, window, 1, 
                              first.screenX, first.screenY, 
                              first.clientX, first.clientY, false, 
                              false, false, false, 0/*left*/, null);

	first.target.dispatchEvent(simulatedEvent);
    event.preventDefault();
}

function preLoadPage() {
	loadTexts();
	application.onLoad();
}

function handelImportGraph(files) {
    var graphFileToLoad = files[0];
    var fileReader = new FileReader();

    fileReader.onload = function(fileLoadedEvent){
        var textFromFileLoaded = fileLoadedEvent.target.result;
        application.LoadGraphFromString(textFromFileLoaded);
        ImportGraphFiles.value = "";
    };

    fileReader.readAsText(graphFileToLoad, "UTF-8");
}

function postLoadPage() {   
	application.canvas.onmousemove = function (e) {
			return application.CanvasOnMouseMove(e);
		};

	application.canvas.onmousedown = function (e) {
			return application.CanvasOnMouseDown(e);
		};
		
	application.canvas.onmouseup   = function (e) {
			return application.CanvasOnMouseUp(e);
		}
    
    application.canvas.onmousewheel = function (e) {
        var e = window.event || e; // old IE support
        var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
        if (delta > 0) {
            application.multCanvasScale(1.3);
        }
        else {
            application.multCanvasScale(1.0 / 1.3);
        }
    }
    
    function getCharCode(event) {
      if (event.which == null) { // IE
        return event.keyCode;
      }

      if (event.which != 0 && event.charCode != 0) { // все кроме IE
        return event.which; // остальные
      }

      return null; // спец. символ
    }
    	
	document.querySelector('#Default').onclick = function () {
		restButtons ('Default');
		application.SetHandlerMode("default");
		document.querySelector('#Default').className = "button button_primary";			
	}		
		
	document.querySelector('#AddGraph').onclick = function () {
		restButtons ('AddGraph');
		application.SetHandlerMode(document.querySelector('#AddGraph').className != "" ? "addGraph" : "default");
	}
	
	document.querySelector('#ConnectGraphs').onclick = function () {
		restButtons ('ConnectGraphs');
		application.SetHandlerMode(document.querySelector('#ConnectGraphs').className != "" ? "addArc" : "default");
	}	
	
	document.querySelector('#DeleteObject').onclick = function () {
		restButtons ('DeleteObject');
		application.SetHandlerMode(document.querySelector('#DeleteObject').className != "" ? "delete" : "default");
	}

	document.querySelector('#DeleteAll').onclick = function () {
		application.SetHandlerMode("deleteAll");
	}


	document.querySelector('#NewGraph').onclick = function () {
		application.SetHandlerMode("deleteAll");
	}
    
    document.querySelector('#Zoom100').onclick = function ()
    {
        
        application.setCanvasScale(1.0);
    }
    
    document.querySelector('#Zoom50').onclick = function ()
    {
        
        application.setCanvasScale(50 / 100);
    }
    
    document.querySelector('#Zoom25').onclick = function ()
    {
        
        application.setCanvasScale(25 / 100);
    }
  
    document.querySelector('#ZoomFit').onclick = function () {
        
        application.OnAutoAdjustViewport();
    }
    
    document.querySelector('#ZoomIn').onclick = function () {
        
        application.multCanvasScale(1.5);
    }
    
    document.querySelector('#ZoomOut').onclick = function () {
        
        application.multCanvasScale(1.0 / 1.5);
    }
    
    document.querySelector('#MoveWorspace').onclick = function () {
        
        restButtons ('Default');
        application.SetHandlerMode("default");
        document.querySelector('#Default').className = "button button_primary";
    }

    document.querySelector('#GraphUndo').onclick = function () {
        
        application.SetHandlerMode("graphUndo");
    }    
    
    document.querySelector('#ExportGraph').onclick = function () {
        
        
        var graphAsString  = application.graph.save();
        var savedGraphName = application.GetNewGraphName();
        
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(graphAsString));
        element.setAttribute('download', "graph_" + savedGraphName + ".json");

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }
    
    document.querySelector('#ImportGraph').onclick = function () {
        if (ImportGraphFiles) {
            ImportGraphFiles.click();
        }
    }
}

window.onload = function () {

	window.onresize = function(event) {
			resizeCanvas();
		}

    document.querySelector('#canvas').addEventListener("touchstart", touchHandler, true);
    document.querySelector('#canvas').addEventListener("touchmove", touchHandler, true);
    document.querySelector('#canvas').addEventListener("touchend", touchHandler, true);
    document.querySelector('#canvas').addEventListener("touchcancel", touchHandler, true);
};

Array.prototype.swap = function (x,y) {
  var b = this[x];
  this[x] = this[y];
  this[y] = b;
  return this;
}
;
class Reader {
	constructor() {
		this.dependencies_cpp = "";
		this.tabCounter = 0;
		this.tabShift   = ""
		this.tab = '  ';
	}

	outOpen() {
		this.dependencies_cpp = "#include \"../include/Dependencies.h\"\n\n";
	}
	
	outClose() {
		this.stateNames.forEach((it, i) => {
			
			this.stateName_h += this.tab + it + ',\n';
			this.stateName_cpp += this.tab + '{' +  it + ', "' + it + ((i != this.stateNames.length - 1) ? '"},\n' : '"}\n};');
		})

		this.stateName_h += this.tab +"ERROR,\n" + this.tab +"EMPTY_STR,\n" + this.tab + "FILE_END\n};\n";
    	this.stateName_h += "\nextern std::map<STATE_NAME, std::string> mapStateName;\n";
    	this.stateName_h += "\n#endif";
    	this.dependencies_h += "\nextern std::map<STATE_NAME, Graph> graphs;\n\n#endif";
	}

	getTabs() {
		return new Array(this.tabCounter).fill(this.tab).join('');
	}

	// upperCase(str) { // ???
	// 	return str.toUpperCase();
	// }

	// getState(stateName) {
	// 	let str = stateName;
	// 	if(stateName.indexOf('_') == 0) {
	// 		str = stateName.slice(1).toUpperCase();
	// 	} else {
	// 		str = this.upperGraphNames.slice(-1) + '_' + stateName.toUpperCase();
	// 	}

	// 	if(this.stateNames.indexOf(str) == -1) {
	// 		this.stateNames.push(str);
	// 	}

	// 	return str;
	// }

	readMark(mark) {
		if(mark.type == "") {
			this.dependencies_cpp += this.getTabs() + "Mark(),\n";
			return;
		}

		const dir = mark.type == '(' ? "OPEN" : "CLOSE";
		if(mark.id != "") {
			this.dependencies_cpp += this.getTabs() + "Mark(\n";
			this.tabCounter++;
			this.dependencies_cpp += this.getTabs() + dir + ",\n";
			this.dependencies_cpp += this.getTabs() + '"' + mark.id + '"\n'; 
			this.tabCounter--;
			this.dependencies_cpp += this.getTabs() + "),\n";
		} else {
			this.dependencies_cpp += this.getTabs() + "Mark(" + dir+ "),\n";
		}
	}

	readTransition(transition) {

		const {to, label, mark}= {...transition};

		this.dependencies_cpp += this.getTabs() + this.getState(to) + ",\n";
		this.dependencies_cpp += this.getTabs() + "Transition(\n";
		this.tabCounter++;
		this.readMark(mark);
		
		this.dependencies_cpp += this.getTabs() + "{\n";
    	this.tabCounter++;

		this.dependencies_cpp += this.getTabs() + "\"" + label + "\"\n";

		this.tabCounter--;
		this.dependencies_cpp += this.getTabs() + "}\n";

		this.tabCounter--;
		this.dependencies_cpp += this.getTabs() + ")\n";
	}

	readState(state) {
		const {name, transitions} = {...state};
		const stateName = this.getState(name);
		this.dependencies_cpp += this.getTabs() + stateName + ",\n" + this.getTabs() + "State(\n";
		this.tabCounter++;

		if(transitions.length > 0) {
			this.dependencies_cpp += this.getTabs() + "{\n";
			this.tabCounter++;

			transitions.forEach((item, i) => {
				this.dependencies_cpp += this.getTabs() + "{\n";
				this.tabCounter++;
				this.readTransition(item);
				this.tabCounter--;
				this.dependencies_cpp += this.getTabs() + (i != transitions.length  -1 ? "},\n\n" : "}\n");
			})

			this.tabCounter--;
			this.dependencies_cpp += this.getTabs() + "}\n";
		}
		this.tabCounter--;
		this.dependencies_cpp += this.getTabs() + ")\n";
	}

	readGraph(graph) {
		const {name, start, end, states} = {...graph};

		if(name.indexOf('_') == 0) {
			this.graphNames.push(name);
			this.upperGraphNames.push(name.slice(1).toUpperCase());
			
			this.stateNames.push(name.slice(1).toUpperCase());
		} else {
			return ["","","",""];
		}


		this.dependencies_h += "extern Graph " + name + ";\n";
    	this.dependencies_cpp += "Graph " + name + "(\n";

		this.tabCounter++;

		this.dependencies_cpp += this.getTabs() + this.getState(start) + ",\n";

		this.dependencies_cpp += this.getTabs() + "{\n";
    	this.tabCounter++;

		end.forEach((item, i) => {
			this.dependencies_cpp += this.getTabs() + this.getState(item);
			this.dependencies_cpp += (i != end.length - 1 ? ",\n" : "\n");
		})

		this.tabCounter--;
    	this.dependencies_cpp += this.getTabs() + "},\n\n";

		this.dependencies_cpp += this.getTabs() + "{\n";
    	this.tabCounter++;

		const nonEmptyStates = states.filter(state => {
			return state.transitions.length > 0;
		})
		
		nonEmptyStates.forEach((item, i) => {

			this.dependencies_cpp += this.getTabs() + "{\n";
			this.tabCounter++;

			this.readState(item);

			this.tabCounter--;
			this.dependencies_cpp += this.getTabs() + (i != nonEmptyStates.length - 1 ? "},\n\n" : "}\n");
		
		})

		this.tabCounter--;
		this.dependencies_cpp += this.getTabs() + "}\n";
		
		this.tabCounter--;
		this.dependencies_cpp += this.getTabs() + ");\n\n";
	}

	parseJson(graph) {
		this.outOpen();

		this.readGraph(graph);

		this.dependencies_cpp += "std::map<STATE_NAME, Graph> graphs =\n";
		this.tabCounter++;

		this.dependencies_cpp  += this.getTabs() + "{\n";
		this.tabCounter++;

		this.graphNames.forEach((it,i) => {
			this.dependencies_cpp += this.getTabs() + "{\n";
			this.tabCounter++;
			this.dependencies_cpp += this.getTabs() + this.getState(it) + ",\n";
			this.dependencies_cpp += this.getTabs() + it + "\n";
			this.tabCounter--;
			this.dependencies_cpp += this.getTabs() + (i != this.graphNames.length - 1) ? "},\n\n" : "}\n";
		})

		this.tabCounter--;
		this.dependencies_cpp += this.getTabs() + "};\n\n";

		this.outClose();
	}

	makeFiles(obj) {
		let res = "#include \"../include/Dependencies.h\"\n\nstd::vector<LGraph> _graphs = { LGraph(\n"; 
		
		const {name, start, id, finish, vertices} = {...obj};

		res += `\t"${name}", ${id}, {${start}}, {${finish.join(',')}}, { Vertex(\n`;

		for(let i = 0; i < vertices.length; i++) {
			const v = vertices[i];
			res +=`\t\t"${v.name}", ${v.id}, {\n`;
			for(let j = 0; j < v.edges.length; j++) {
				const edge = v.edges[j];
				res += `\t\t\tEdge(${edge.to}, "${edge.label}", {`;
				res += edge.mark.map(m => {
						switch(m.type) {
							case "(": 
								return(`Mark(OPEN,"${m.id}")`);
							case ")":
								return(`Mark(CLOSE,"${m.id}")`)
							default:
								return(`Mark()`);
						}
					}).join(",");
				res += j == v.edges.length - 1 ? `})\n` : `}),\n`
			}
			res += `\t\t`;
			res += i == vertices.length - 1 ? `})\n` : `}), Vertex(\n`
		}

		res += `\t})\n};`;
		
		return res;
	}
};
const downloadBtn = document.querySelector('#DownloadParser');

class MyFile {
	constructor(name, value){
		this.name = name;
		this.value = value;
	}
}

class MyMap {
	constructor(base = "", files = [], children = []){
		this.base = base,
		this.files = files,
		this.children = children;
	}
}

const gitRequest = async (path) => {
	return await fetch(path).then(resp => resp.text());			
}

const parse = async (data, path) => {
	const newMap = new MyMap(data.folder);
	let myPath = path + data.folder + '/';
	const files = await Promise.all(
		data.files.map(async (file) => {
			return await gitRequest(myPath + file)
		})
	);
	
	newMap.files = data.files.map((file, i) => {
		return new MyFile(file, files[i])
	})

	newMap.children = await Promise.all(
		data.children.map( async (children) => {
			return await parse(children, myPath);
		})
	)
	
	return newMap;
}

const getFilesMap = async () => {
	return await fetch('https://raw.githubusercontent.com/enkeess/parsgen-test/main/road-map.json')
		.then(resp => resp.text())
		.then(text => JSON.parse(text))
		.then(async ({data, base}) => {
			return await parse(data, base);
		})
}

const res = getFilesMap();
let zip = new JSZip();

const addToZip = ({base, files, children}) => {
	files.forEach(({name, value}) => {
		zip.folder(base).file(name, value);
	})

	children.forEach(children => addToZip(children));
}

const makeZip = () => {
	try {
		const transform = new Transform(application.graph);
		// вычисляем пути до конечных вершин и циклы
		transform.findWayToFinish();
		// Проверяем на пустые циклы 
		transform.checkEmptyCycle();
		// подсчитываем директы для каждого ребра
		transform.calcDirect();
		// проверяем критерий
		transform.checkDirect();
		// генерируем файл конфига
		const file = transform.makeFile();
		// добавляем файлы в архив
		res.then(filesMap => {
			addToZip(filesMap);
		})
		.then(() => {	
			zip.folder("src").file("Dependencies.cpp", file);
			zip.generateAsync({type: "blob"})
			.then(content => {
				saveAs(content, "parser_build.zip");
			})
		})		
	}
	catch (e) {
		// application.mess
		let message = "";
		if(e.type) {
			message += e.type;

			message += ": " + e.payload;

			this.document.querySelector('#message').innerHTML = message;
		} 

		console.log(e);
	}
}

downloadBtn.addEventListener('click', makeZip);

class Transform {
	constructor(graph) {
		this.graph = new Graph();

		this.graph.vertices = [...graph.vertices];
		this.graph.edges = [...graph.edges];
		this.graph.uidGraph = graph.uidGraph;
		this.graph.uidEdge = graph.uidEdge;

		this.emptyEdges    = this.graph.edges.filter(edge => edge.label == "" && !edge.mark);

		this.simpleCycle   =  this.graph.edges.filter(edge => edge.v1.id == edge.v2.id);
		this.normalEdge    =  this.graph.edges.filter(edge => edge.v1.id != edge.v2.id);
		
		this.cycles = [];
		this.ways = [];
	}

	makeAdjacencyList = function () {
		const newGraph = {
			name: "_main",
			id: 0,
			start: this.graph.vertices.find(v => v.type === 'start').id,
			finish: this.graph.vertices.filter(v => v.type === 'finish').map(v => v.id),
			vertices: this.graph.vertices.map(v => {
				return({
					name: v.text,
					id: v.id,
					edges: this.graph.edges.filter(edge => 
						edge.v1.id === v.id
					).map(edge => ({
						id: edge.id,
						to: edge.v2.id,
						label: edge.label,
						mark: edge.mark,
						direct: edge.direct
					}))
				})
			})
		}

		return newGraph;
	}

	checkEmptyCycle = function() {
		this.cycles.forEach(item => {
			if(item.edgeTrace.every(edge => edge.label == "" && !edge.mark)) {
				throw ({
					type: "EMPTY_CYCLE_ERROR",
					payload: item.trace.join("->") + "->" + item.trace[0]
				})
			}

			if(item.edgeTrace.every(edge => edge.label == "")) {
				const stack = item.edgeTrace.map(edge => edge.mark).filter(m => m);
				if(this.isEmptyBracketSystem(stack)) {
					throw({
						type: "EMPTY_CYCLE_ERROR_EMPTY_BRACKET_TRACE",
						payload: item.trace.join("->") + "->" + item.trace[0]
					})
				}
			}
		})
	}

	isEmptyBracketSystem = function(stack) {
		let myStack = [...stack];

		if(stack.length % 2 == 0) { // как минимум скобок четное кол-во
			
			for(let j = 0; j < stack.length / 2; j++) {
				console.log("J: " + j);
				for(let i = 0; i < myStack.length - 1; i++) {
					if( myStack[i].id == myStack[i + 1].id && 
						myStack[i].type == "(" &&
						myStack[i + 1].type == ")"
					) {
						myStack = [...myStack.slice(0,i), ...myStack.slice(i+2)];
						break;
					}
				}

				if(myStack.length >= 2) {
					if(	myStack[0].id == myStack[myStack.length - 1].id && 
						myStack[0].type == ")" &&
						myStack[myStack.length - 1].type == "(") 
					{
						myStack = myStack.slice(1, -1);
					}
				}
				
			}
		}

		return myStack.length == 0;
	}

	calcDirect = function() {
		this.hasCalcDirect = [];

		this.cyclesEdges = new Set(this.cycles.filter(item => item.edgeTrace.length > 1).reduce((res, item) => {
			return [...res, ...item.edgeTrace.reduce((res, edge) => {
				return [...res, edge]
			}, [])]
		}, []));

		this.hasCalcDirect = this.graph.edges.filter(edge => edge.label != "" || edge.v1.id == edge.v2.id).map(edge => {
			return({
				...edge,
				direct: [{
					label: edge.label,
					mark: edge.mark
				}]
			})
		});

		let emptyEdgesCalc = [];
		this.graph.edges.forEach(edge => {
			if(!this.hasCalcDirect.find(e => e.id == edge.id)) {
				emptyEdgesCalc.push({
					...edge,
					direct: this.calcDirFor(edge, edge.v1.id)
				})
			}
		})

		this.hasCalcDirect.push(...emptyEdgesCalc);

		this.graph.edges = this.hasCalcDirect;
	}

	calcDirFor = function(edge, v1Id) {
		let direct = [];
		const nextEdges = this.graph.edges.filter(e => e.v1.id == edge.v2.id && edge.v2.id != v1Id); 

		if(nextEdges.length == 0) {
			if(edge.v2.id != v1Id) {
				direct = [{
					label: edge.label,
					mark: edge.mark
				}]
			}
		}

		nextEdges.forEach(e => {
			let hasCacl = this.hasCalcDirect.find(edge => e.id == edge.id);

			if(!hasCacl) {
				direct.push(...this.calcDirFor(e, v1Id).map(item => {
					return({
						label: item.label,
						mark: edge.mark ? edge.mark : item.mark
					})
				}));
			} else {
				direct.push(...hasCacl.direct.map(item => {
					return({
						label: item.label,
						mark: edge.mark ? edge.mark : item.mark
					})
				}))
			}
		})

		return direct;
	}

	checkDirect = function() {
		const graph = this.makeAdjacencyList();

		graph.vertices.forEach((v) => {
			const {edges} = {...v};
			for(let i = 0; i < edges.length; i++) {
				for(let j = i + 1; j < edges.length; j++) {
					const direct1 = edges[i].direct;
					const direct2 = edges[j].direct;

					for(let a = 0; a < direct1.length; a++) {
						for(let b = 0; b < direct2.length; b++) {
							if(direct1[a].label == direct2[b].label || ( 
								   direct1[a].label.startsWith(direct2[b].label) &&
								   direct2[b].label.length > 0
							   ) || (
								   direct2[b].label.startsWith(direct1[a].label) &&
								   direct1[a].label.length > 0
								)
							) {
								const m1 = !direct1[a].mark ? {type: "", id:""} : direct1[a].mark;
								const m2 = !direct2[b].mark ? {type: "", id:""} : direct2[b].mark;

								if(
								   m1.id == m2.id &&
								   m1.type == "(" ||
								   m2.type == "(" ||
								   m1.type == m2.type
								) {
									let payload = "";

									const v1 = graph.vertices.filter(v => edges[i].to == v.id)[0];
									const v2 = graph.vertices.filter(v => edges[j].to == v.id)[0];

									payload = v.name + '->' + v1.name + " & "
											+ v.name + '->' + v2.name;

									throw ({
										type: "DIRECT_ERROR",
										payload
									})
								}
							}
						}
					}
				}
			}
		})
	}

	findWayToFinish = () => {
		this.ways = [];
		this.cycles = [];

		this.simpleCycles = this.graph.edges.filter(edge => edge.v1.id == edge.v2.id);
		this.normalEdge   = this.graph.edges.filter(edge => edge.v1.id != edge.v2.id);

		this.checkedVertex = [];
		this.makeGraph = this.makeAdjacencyList();
	
		this.makeGraph.vertices.forEach(v => {
			v.edges.forEach(edge => {
				if(edge.to != v.id) {
					if(v.id == this.makeGraph.start) {
						this.ways = [...this.ways, ...this.findWayFrom(edge.to, [v.name], this.makeGraph.finish, [edge])]
					} else {
						this.findWayFrom(edge.to, [v.name], [v.id], [edge])
					}
				}
			});

			this.checkedVertex.push(v.name);
		});		

		this.simpleCycles.forEach((edge) => {
			this.cycles.push( { 
				trace: [edge.v1.text],
				edgeTrace: [edge]
			});
		})

		if(this.ways.length == 0) {
			throw ({
				type: "FINISH_ERROR",
				payload: "there is no successful path to the finish vertex"
			})
		}
	}

	// плохая функция с побочным эффектом
	findWayFrom = function(id, trace, finish, edgeTrace) {
		const v = this.makeGraph.vertices.find(v => v.id == id);

		if(this.checkedVertex.indexOf(v.name) != -1) {
			return [];
		}

		const newTrace = [...trace, v.name];

		let res = []
		if(finish.indexOf(id) != -1) {
			res.push({
				trace : newTrace,
				edgeTrace
			})
		} 

		v.edges.forEach(edge => {
			if(edge.to != v.id) {
				const v2 = this.makeGraph.vertices.find(v => v.id == edge.to);

				if(newTrace[0] == v2.name) {
					this.cycles.push({
						trace: newTrace, //  без замыкающего элемента
						edgeTrace: [...edgeTrace, edge]
					});
				} else {
					if(newTrace.indexOf(v2.name) == -1) {
						res = [...res, ...this.findWayFrom(v2.id, newTrace, finish, [...edgeTrace, edge])];
					}
				}
			}
		})
		
		return res;
	}

	makeFile() {	
		const {name, start, id, finish, vertices} = {...this.makeAdjacencyList()};

		let res = "#include \"../include/Dependencies.h\"\n\nstd::vector<LGraph> _graphs = { LGraph(\n"; 
		res += `\t"${name}", ${id}, {${start}}, {${finish.join(',')}}, { Vertex(\n`;

		for(let i = 0; i < vertices.length; i++) {
			const v = vertices[i];
			res +=`\t\t"${v.name}", ${v.id}, {\n`;
			for(let j = 0; j < v.edges.length; j++) {
				const edge = v.edges[j];

				res += `\t\t\tEdge(${edge.to}, "${edge.label}", `;
				res += this.writeMark(edge.mark) + ", {\n";
			
				res += edge.direct.map(dir => {
					return `\t\t\t\tDirect("${dir.label}", ${this.writeMark(dir.mark)})`;
				}).join(",\n");
	
				res += `\n\t\t\t`;
				res += j == v.edges.length - 1 ? `})\n` : `}),\n`
			}
			res += `\t\t`;
						
			res += i == vertices.length - 1 ? `})\n` : `}), Vertex(\n`
		}

		res += `\t})\n};`;
		return res;
	}

	writeMark(mark) {
		const m = mark ? mark : {type: "", id: ""}

		switch(m.type) {
			case "(": 
				return(`Mark(OPEN,"${m.id}")`);
			case ")":
				return(`Mark(CLOSE,"${m.id}")`)
			default:
				return(`Mark()`);
		}
	}
};
window.addEventListener('DOMContentLoaded', () => {


	if (typeof preLoadPage == 'function') {
		preLoadPage();
	}
	if (typeof postLoadPage == 'function') {
		postLoadPage();
		resizeCanvas();
	}

	/*==================== DARK LIGHT THEME ====================*/ 

	const themeButton = document.getElementById('theme-button'),
		darkTheme = 'dark-theme',
		iconTheme = 'uil-sun';

	const selectedTheme = localStorage.getItem('selected-theme');
	const selectedIcon = localStorage.getItem('selected-icon');

	const getCurrentTheme = () => document.body.classList.contains(darkTheme) ? 'dark' : 'light';
	const getCurrentIcon = () => themeButton.classList.contains(iconTheme) ? 'uil-moon' : 'uil-sun';

	if(selectedTheme) {
		document.body.classList[selectedTheme === 'dark' ? 'add' : 'remove'](darkTheme)
		themeButton.classList[selectedIcon === 'uil-moon' ? 'add' : 'remove'](iconTheme)
		selectedTheme === "dark" ? application.setDarkMode() : application.setLightMode();
	}

	themeButton.addEventListener('click', () => {
		document.body.classList.toggle(darkTheme)
		themeButton.classList.toggle(iconTheme)
		getCurrentTheme() === "dark" ? application.setDarkMode() : application.setLightMode();
		localStorage.setItem('selected-theme', getCurrentTheme());
		localStorage.setItem('selected-icon', getCurrentIcon());
	})	

	document.querySelectorAll('.dropdown').forEach(drop => {	
		const dropBtn = drop.querySelector('.dropdown__button');
		const droplist = drop.querySelector('.dropdown__list');

		dropBtn.addEventListener('click', (e) => {
			closeModal();
			openModal(e, droplist)
		});
		
		droplist.querySelectorAll('li').forEach(item => {
			item.addEventListener('click', closeModal);
		})
	})
});

;
define(["exports","./Cartographic-1bbcab04","./Cartesian4-034d54d5","./Check-3aa71481","./when-515d5295","./Math-5e38123d","./RuntimeError-350acae3","./WebGLConstants-77a84876"],(function(t,e,n,r,a,o,u,i){"use strict";function f(t,e,n,r,o,u,i,f,c){this[0]=a.e(t,0),this[1]=a.e(r,0),this[2]=a.e(i,0),this[3]=a.e(e,0),this[4]=a.e(o,0),this[5]=a.e(f,0),this[6]=a.e(n,0),this[7]=a.e(u,0),this[8]=a.e(c,0)}f.packedLength=9,f.pack=function(t,e,n){return r.n.typeOf.object("value",t),r.n.defined("array",e),n=a.e(n,0),e[n++]=t[0],e[n++]=t[1],e[n++]=t[2],e[n++]=t[3],e[n++]=t[4],e[n++]=t[5],e[n++]=t[6],e[n++]=t[7],e[n++]=t[8],e},f.unpack=function(t,e,n){return r.n.defined("array",t),e=a.e(e,0),a.t(n)||(n=new f),n[0]=t[e++],n[1]=t[e++],n[2]=t[e++],n[3]=t[e++],n[4]=t[e++],n[5]=t[e++],n[6]=t[e++],n[7]=t[e++],n[8]=t[e++],n},f.clone=function(t,e){if(a.t(t))return a.t(e)?(e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e[4]=t[4],e[5]=t[5],e[6]=t[6],e[7]=t[7],e[8]=t[8],e):new f(t[0],t[3],t[6],t[1],t[4],t[7],t[2],t[5],t[8])},f.fromArray=function(t,e,n){return r.n.defined("array",t),e=a.e(e,0),a.t(n)||(n=new f),n[0]=t[e],n[1]=t[e+1],n[2]=t[e+2],n[3]=t[e+3],n[4]=t[e+4],n[5]=t[e+5],n[6]=t[e+6],n[7]=t[e+7],n[8]=t[e+8],n},f.fromColumnMajorArray=function(t,e){return r.n.defined("values",t),f.clone(t,e)},f.fromRowMajorArray=function(t,e){return r.n.defined("values",t),a.t(e)?(e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],e):new f(t[0],t[1],t[2],t[3],t[4],t[5],t[6],t[7],t[8])},f.fromQuaternion=function(t,e){r.n.typeOf.object("quaternion",t);var n=t.x*t.x,o=t.x*t.y,u=t.x*t.z,i=t.x*t.w,c=t.y*t.y,s=t.y*t.z,y=t.y*t.w,l=t.z*t.z,O=t.z*t.w,p=t.w*t.w,b=n-c-l+p,m=2*(o-O),h=2*(u+y),j=2*(o+O),x=-n+c-l+p,M=2*(s-i),d=2*(u-y),g=2*(s+i),v=-n-c+l+p;return a.t(e)?(e[0]=b,e[1]=j,e[2]=d,e[3]=m,e[4]=x,e[5]=g,e[6]=h,e[7]=M,e[8]=v,e):new f(b,m,h,j,x,M,d,g,v)},f.fromHeadingPitchRoll=function(t,e){r.n.typeOf.object("headingPitchRoll",t);var n=Math.cos(-t.pitch),o=Math.cos(-t.heading),u=Math.cos(t.roll),i=Math.sin(-t.pitch),c=Math.sin(-t.heading),s=Math.sin(t.roll),y=n*o,l=-u*c+s*i*o,O=s*c+u*i*o,p=n*c,b=u*o+s*i*c,m=-s*o+u*i*c,h=-i,j=s*n,x=u*n;return a.t(e)?(e[0]=y,e[1]=p,e[2]=h,e[3]=l,e[4]=b,e[5]=j,e[6]=O,e[7]=m,e[8]=x,e):new f(y,l,O,p,b,m,h,j,x)},f.fromScale=function(t,e){return r.n.typeOf.object("scale",t),a.t(e)?(e[0]=t.x,e[1]=0,e[2]=0,e[3]=0,e[4]=t.y,e[5]=0,e[6]=0,e[7]=0,e[8]=t.z,e):new f(t.x,0,0,0,t.y,0,0,0,t.z)},f.fromUniformScale=function(t,e){return r.n.typeOf.number("scale",t),a.t(e)?(e[0]=t,e[1]=0,e[2]=0,e[3]=0,e[4]=t,e[5]=0,e[6]=0,e[7]=0,e[8]=t,e):new f(t,0,0,0,t,0,0,0,t)},f.fromCrossProduct=function(t,e){return r.n.typeOf.object("vector",t),a.t(e)?(e[0]=0,e[1]=t.z,e[2]=-t.y,e[3]=-t.z,e[4]=0,e[5]=t.x,e[6]=t.y,e[7]=-t.x,e[8]=0,e):new f(0,-t.z,t.y,t.z,0,-t.x,-t.y,t.x,0)},f.fromRotationX=function(t,e){r.n.typeOf.number("angle",t);var n=Math.cos(t),o=Math.sin(t);return a.t(e)?(e[0]=1,e[1]=0,e[2]=0,e[3]=0,e[4]=n,e[5]=o,e[6]=0,e[7]=-o,e[8]=n,e):new f(1,0,0,0,n,-o,0,o,n)},f.fromRotationY=function(t,e){r.n.typeOf.number("angle",t);var n=Math.cos(t),o=Math.sin(t);return a.t(e)?(e[0]=n,e[1]=0,e[2]=-o,e[3]=0,e[4]=1,e[5]=0,e[6]=o,e[7]=0,e[8]=n,e):new f(n,0,o,0,1,0,-o,0,n)},f.fromRotationZ=function(t,e){r.n.typeOf.number("angle",t);var n=Math.cos(t),o=Math.sin(t);return a.t(e)?(e[0]=n,e[1]=o,e[2]=0,e[3]=-o,e[4]=n,e[5]=0,e[6]=0,e[7]=0,e[8]=1,e):new f(n,-o,0,o,n,0,0,0,1)},f.toArray=function(t,e){return r.n.typeOf.object("matrix",t),a.t(e)?(e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e[4]=t[4],e[5]=t[5],e[6]=t[6],e[7]=t[7],e[8]=t[8],e):[t[0],t[1],t[2],t[3],t[4],t[5],t[6],t[7],t[8]]},f.getElementIndex=function(t,e){return r.n.typeOf.number.greaterThanOrEquals("row",e,0),r.n.typeOf.number.lessThanOrEquals("row",e,2),r.n.typeOf.number.greaterThanOrEquals("column",t,0),r.n.typeOf.number.lessThanOrEquals("column",t,2),3*t+e},f.getColumn=function(t,e,n){r.n.typeOf.object("matrix",t),r.n.typeOf.number.greaterThanOrEquals("index",e,0),r.n.typeOf.number.lessThanOrEquals("index",e,2),r.n.typeOf.object("result",n);var a=3*e,o=t[a],u=t[a+1],i=t[a+2];return n.x=o,n.y=u,n.z=i,n},f.setColumn=function(t,e,n,a){r.n.typeOf.object("matrix",t),r.n.typeOf.number.greaterThanOrEquals("index",e,0),r.n.typeOf.number.lessThanOrEquals("index",e,2),r.n.typeOf.object("cartesian",n),r.n.typeOf.object("result",a);var o=3*e;return(a=f.clone(t,a))[o]=n.x,a[o+1]=n.y,a[o+2]=n.z,a},f.getRow=function(t,e,n){r.n.typeOf.object("matrix",t),r.n.typeOf.number.greaterThanOrEquals("index",e,0),r.n.typeOf.number.lessThanOrEquals("index",e,2),r.n.typeOf.object("result",n);var a=t[e],o=t[e+3],u=t[e+6];return n.x=a,n.y=o,n.z=u,n},f.setRow=function(t,e,n,a){return r.n.typeOf.object("matrix",t),r.n.typeOf.number.greaterThanOrEquals("index",e,0),r.n.typeOf.number.lessThanOrEquals("index",e,2),r.n.typeOf.object("cartesian",n),r.n.typeOf.object("result",a),(a=f.clone(t,a))[e]=n.x,a[e+3]=n.y,a[e+6]=n.z,a};var c=new e.a;f.getScale=function(t,n){return r.n.typeOf.object("matrix",t),r.n.typeOf.object("result",n),n.x=e.a.magnitude(e.a.fromElements(t[0],t[1],t[2],c)),n.y=e.a.magnitude(e.a.fromElements(t[3],t[4],t[5],c)),n.z=e.a.magnitude(e.a.fromElements(t[6],t[7],t[8],c)),n};var s=new e.a;f.getMaximumScale=function(t){return f.getScale(t,s),e.a.maximumComponent(s)},f.multiply=function(t,e,n){r.n.typeOf.object("left",t),r.n.typeOf.object("right",e),r.n.typeOf.object("result",n);var a=t[0]*e[0]+t[3]*e[1]+t[6]*e[2],o=t[1]*e[0]+t[4]*e[1]+t[7]*e[2],u=t[2]*e[0]+t[5]*e[1]+t[8]*e[2],i=t[0]*e[3]+t[3]*e[4]+t[6]*e[5],f=t[1]*e[3]+t[4]*e[4]+t[7]*e[5],c=t[2]*e[3]+t[5]*e[4]+t[8]*e[5],s=t[0]*e[6]+t[3]*e[7]+t[6]*e[8],y=t[1]*e[6]+t[4]*e[7]+t[7]*e[8],l=t[2]*e[6]+t[5]*e[7]+t[8]*e[8];return n[0]=a,n[1]=o,n[2]=u,n[3]=i,n[4]=f,n[5]=c,n[6]=s,n[7]=y,n[8]=l,n},f.add=function(t,e,n){return r.n.typeOf.object("left",t),r.n.typeOf.object("right",e),r.n.typeOf.object("result",n),n[0]=t[0]+e[0],n[1]=t[1]+e[1],n[2]=t[2]+e[2],n[3]=t[3]+e[3],n[4]=t[4]+e[4],n[5]=t[5]+e[5],n[6]=t[6]+e[6],n[7]=t[7]+e[7],n[8]=t[8]+e[8],n},f.subtract=function(t,e,n){return r.n.typeOf.object("left",t),r.n.typeOf.object("right",e),r.n.typeOf.object("result",n),n[0]=t[0]-e[0],n[1]=t[1]-e[1],n[2]=t[2]-e[2],n[3]=t[3]-e[3],n[4]=t[4]-e[4],n[5]=t[5]-e[5],n[6]=t[6]-e[6],n[7]=t[7]-e[7],n[8]=t[8]-e[8],n},f.multiplyByVector=function(t,e,n){r.n.typeOf.object("matrix",t),r.n.typeOf.object("cartesian",e),r.n.typeOf.object("result",n);var a=e.x,o=e.y,u=e.z,i=t[0]*a+t[3]*o+t[6]*u,f=t[1]*a+t[4]*o+t[7]*u,c=t[2]*a+t[5]*o+t[8]*u;return n.x=i,n.y=f,n.z=c,n},f.multiplyByScalar=function(t,e,n){return r.n.typeOf.object("matrix",t),r.n.typeOf.number("scalar",e),r.n.typeOf.object("result",n),n[0]=t[0]*e,n[1]=t[1]*e,n[2]=t[2]*e,n[3]=t[3]*e,n[4]=t[4]*e,n[5]=t[5]*e,n[6]=t[6]*e,n[7]=t[7]*e,n[8]=t[8]*e,n},f.multiplyByScale=function(t,e,n){return r.n.typeOf.object("matrix",t),r.n.typeOf.object("scale",e),r.n.typeOf.object("result",n),n[0]=t[0]*e.x,n[1]=t[1]*e.x,n[2]=t[2]*e.x,n[3]=t[3]*e.y,n[4]=t[4]*e.y,n[5]=t[5]*e.y,n[6]=t[6]*e.z,n[7]=t[7]*e.z,n[8]=t[8]*e.z,n},f.negate=function(t,e){return r.n.typeOf.object("matrix",t),r.n.typeOf.object("result",e),e[0]=-t[0],e[1]=-t[1],e[2]=-t[2],e[3]=-t[3],e[4]=-t[4],e[5]=-t[5],e[6]=-t[6],e[7]=-t[7],e[8]=-t[8],e},f.transpose=function(t,e){r.n.typeOf.object("matrix",t),r.n.typeOf.object("result",e);var n=t[0],a=t[3],o=t[6],u=t[1],i=t[4],f=t[7],c=t[2],s=t[5],y=t[8];return e[0]=n,e[1]=a,e[2]=o,e[3]=u,e[4]=i,e[5]=f,e[6]=c,e[7]=s,e[8]=y,e};var y=new e.a(1,1,1);f.getRotation=function(t,n){r.n.typeOf.object("matrix",t),r.n.typeOf.object("result",n);var a=e.a.divideComponents(y,f.getScale(t,s),s);return n=f.multiplyByScale(t,a,n)};var l=[1,0,0],O=[2,2,1];function p(t){for(var e=0,n=0;n<3;++n){var r=t[f.getElementIndex(O[n],l[n])];e+=2*r*r}return Math.sqrt(e)}function b(t,e){for(var n=o.n.EPSILON15,r=0,a=1,u=0;u<3;++u){var i=Math.abs(t[f.getElementIndex(O[u],l[u])]);i>r&&(a=u,r=i)}var c=1,s=0,y=l[a],p=O[a];if(Math.abs(t[f.getElementIndex(p,y)])>n){var b,m=(t[f.getElementIndex(p,p)]-t[f.getElementIndex(y,y)])/2/t[f.getElementIndex(p,y)];s=(b=m<0?-1/(-m+Math.sqrt(1+m*m)):1/(m+Math.sqrt(1+m*m)))*(c=1/Math.sqrt(1+b*b))}return(e=f.clone(f.IDENTITY,e))[f.getElementIndex(y,y)]=e[f.getElementIndex(p,p)]=c,e[f.getElementIndex(p,y)]=s,e[f.getElementIndex(y,p)]=-s,e}var m=new f,h=new f;function j(t,e,n,r,o,u,i,f,c,s,y,l,O,p,b,m){this[0]=a.e(t,0),this[1]=a.e(o,0),this[2]=a.e(c,0),this[3]=a.e(O,0),this[4]=a.e(e,0),this[5]=a.e(u,0),this[6]=a.e(s,0),this[7]=a.e(p,0),this[8]=a.e(n,0),this[9]=a.e(i,0),this[10]=a.e(y,0),this[11]=a.e(b,0),this[12]=a.e(r,0),this[13]=a.e(f,0),this[14]=a.e(l,0),this[15]=a.e(m,0)}f.computeEigenDecomposition=function(t,e){r.n.typeOf.object("matrix",t);var n=o.n.EPSILON20,u=0,i=0;a.t(e)||(e={});for(var c=e.unitary=f.clone(f.IDENTITY,e.unitary),s=e.diagonal=f.clone(t,e.diagonal),y=n*function(t){for(var e=0,n=0;n<9;++n){var r=t[n];e+=r*r}return Math.sqrt(e)}(s);i<10&&p(s)>y;)b(s,m),f.transpose(m,h),f.multiply(s,m,s),f.multiply(h,s,s),f.multiply(c,m,c),++u>2&&(++i,u=0);return e},f.abs=function(t,e){return r.n.typeOf.object("matrix",t),r.n.typeOf.object("result",e),e[0]=Math.abs(t[0]),e[1]=Math.abs(t[1]),e[2]=Math.abs(t[2]),e[3]=Math.abs(t[3]),e[4]=Math.abs(t[4]),e[5]=Math.abs(t[5]),e[6]=Math.abs(t[6]),e[7]=Math.abs(t[7]),e[8]=Math.abs(t[8]),e},f.determinant=function(t){r.n.typeOf.object("matrix",t);var e=t[0],n=t[3],a=t[6],o=t[1],u=t[4],i=t[7],f=t[2],c=t[5],s=t[8];return e*(u*s-c*i)+o*(c*a-n*s)+f*(n*i-u*a)},f.inverse=function(t,e){r.n.typeOf.object("matrix",t),r.n.typeOf.object("result",e);var n=t[0],a=t[1],u=t[2],i=t[3],c=t[4],s=t[5],y=t[6],l=t[7],O=t[8],p=f.determinant(t);if(Math.abs(p)<=o.n.EPSILON15)throw new r.t("matrix is not invertible");e[0]=c*O-l*s,e[1]=l*u-a*O,e[2]=a*s-c*u,e[3]=y*s-i*O,e[4]=n*O-y*u,e[5]=i*u-n*s,e[6]=i*l-y*c,e[7]=y*a-n*l,e[8]=n*c-i*a;var b=1/p;return f.multiplyByScalar(e,b,e)},f.equals=function(t,e){return t===e||a.t(t)&&a.t(e)&&t[0]===e[0]&&t[1]===e[1]&&t[2]===e[2]&&t[3]===e[3]&&t[4]===e[4]&&t[5]===e[5]&&t[6]===e[6]&&t[7]===e[7]&&t[8]===e[8]},f.equalsEpsilon=function(t,e,n){return r.n.typeOf.number("epsilon",n),t===e||a.t(t)&&a.t(e)&&Math.abs(t[0]-e[0])<=n&&Math.abs(t[1]-e[1])<=n&&Math.abs(t[2]-e[2])<=n&&Math.abs(t[3]-e[3])<=n&&Math.abs(t[4]-e[4])<=n&&Math.abs(t[5]-e[5])<=n&&Math.abs(t[6]-e[6])<=n&&Math.abs(t[7]-e[7])<=n&&Math.abs(t[8]-e[8])<=n},f.IDENTITY=Object.freeze(new f(1,0,0,0,1,0,0,0,1)),f.ZERO=Object.freeze(new f(0,0,0,0,0,0,0,0,0)),f.COLUMN0ROW0=0,f.COLUMN0ROW1=1,f.COLUMN0ROW2=2,f.COLUMN1ROW0=3,f.COLUMN1ROW1=4,f.COLUMN1ROW2=5,f.COLUMN2ROW0=6,f.COLUMN2ROW1=7,f.COLUMN2ROW2=8,Object.defineProperties(f.prototype,{length:{get:function(){return f.packedLength}}}),f.prototype.clone=function(t){return f.clone(this,t)},f.prototype.equals=function(t){return f.equals(this,t)},f.equalsArray=function(t,e,n){return t[0]===e[n]&&t[1]===e[n+1]&&t[2]===e[n+2]&&t[3]===e[n+3]&&t[4]===e[n+4]&&t[5]===e[n+5]&&t[6]===e[n+6]&&t[7]===e[n+7]&&t[8]===e[n+8]},f.prototype.equalsEpsilon=function(t,e){return f.equalsEpsilon(this,t,e)},f.prototype.toString=function(){return"("+this[0]+", "+this[3]+", "+this[6]+")\n("+this[1]+", "+this[4]+", "+this[7]+")\n("+this[2]+", "+this[5]+", "+this[8]+")"},j.packedLength=16,j.pack=function(t,e,n){return r.n.typeOf.object("value",t),r.n.defined("array",e),n=a.e(n,0),e[n++]=t[0],e[n++]=t[1],e[n++]=t[2],e[n++]=t[3],e[n++]=t[4],e[n++]=t[5],e[n++]=t[6],e[n++]=t[7],e[n++]=t[8],e[n++]=t[9],e[n++]=t[10],e[n++]=t[11],e[n++]=t[12],e[n++]=t[13],e[n++]=t[14],e[n]=t[15],e},j.unpack=function(t,e,n){return r.n.defined("array",t),e=a.e(e,0),a.t(n)||(n=new j),n[0]=t[e++],n[1]=t[e++],n[2]=t[e++],n[3]=t[e++],n[4]=t[e++],n[5]=t[e++],n[6]=t[e++],n[7]=t[e++],n[8]=t[e++],n[9]=t[e++],n[10]=t[e++],n[11]=t[e++],n[12]=t[e++],n[13]=t[e++],n[14]=t[e++],n[15]=t[e],n},j.clone=function(t,e){if(a.t(t))return a.t(e)?(e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e[4]=t[4],e[5]=t[5],e[6]=t[6],e[7]=t[7],e[8]=t[8],e[9]=t[9],e[10]=t[10],e[11]=t[11],e[12]=t[12],e[13]=t[13],e[14]=t[14],e[15]=t[15],e):new j(t[0],t[4],t[8],t[12],t[1],t[5],t[9],t[13],t[2],t[6],t[10],t[14],t[3],t[7],t[11],t[15])},j.fromArray=j.unpack,j.fromColumnMajorArray=function(t,e){return r.n.defined("values",t),j.clone(t,e)},j.fromRowMajorArray=function(t,e){return r.n.defined("values",t),a.t(e)?(e[0]=t[0],e[1]=t[4],e[2]=t[8],e[3]=t[12],e[4]=t[1],e[5]=t[5],e[6]=t[9],e[7]=t[13],e[8]=t[2],e[9]=t[6],e[10]=t[10],e[11]=t[14],e[12]=t[3],e[13]=t[7],e[14]=t[11],e[15]=t[15],e):new j(t[0],t[1],t[2],t[3],t[4],t[5],t[6],t[7],t[8],t[9],t[10],t[11],t[12],t[13],t[14],t[15])},j.fromRotationTranslation=function(t,n,o){return r.n.typeOf.object("rotation",t),n=a.e(n,e.a.ZERO),a.t(o)?(o[0]=t[0],o[1]=t[1],o[2]=t[2],o[3]=0,o[4]=t[3],o[5]=t[4],o[6]=t[5],o[7]=0,o[8]=t[6],o[9]=t[7],o[10]=t[8],o[11]=0,o[12]=n.x,o[13]=n.y,o[14]=n.z,o[15]=1,o):new j(t[0],t[3],t[6],n.x,t[1],t[4],t[7],n.y,t[2],t[5],t[8],n.z,0,0,0,1)},j.fromTranslationQuaternionRotationScale=function(t,e,n,o){r.n.typeOf.object("translation",t),r.n.typeOf.object("rotation",e),r.n.typeOf.object("scale",n),a.t(o)||(o=new j);var u=n.x,i=n.y,f=n.z,c=e.x*e.x,s=e.x*e.y,y=e.x*e.z,l=e.x*e.w,O=e.y*e.y,p=e.y*e.z,b=e.y*e.w,m=e.z*e.z,h=e.z*e.w,x=e.w*e.w,M=c-O-m+x,d=2*(s-h),g=2*(y+b),v=2*(s+h),E=-c+O-m+x,w=2*(p-l),T=2*(y-b),z=2*(p+l),R=-c-O+m+x;return o[0]=M*u,o[1]=v*u,o[2]=T*u,o[3]=0,o[4]=d*i,o[5]=E*i,o[6]=z*i,o[7]=0,o[8]=g*f,o[9]=w*f,o[10]=R*f,o[11]=0,o[12]=t.x,o[13]=t.y,o[14]=t.z,o[15]=1,o},j.fromTranslationRotationScale=function(t,e){return r.n.typeOf.object("translationRotationScale",t),j.fromTranslationQuaternionRotationScale(t.translation,t.rotation,t.scale,e)},j.fromTranslation=function(t,e){return r.n.typeOf.object("translation",t),j.fromRotationTranslation(f.IDENTITY,t,e)},j.fromScale=function(t,e){return r.n.typeOf.object("scale",t),a.t(e)?(e[0]=t.x,e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=t.y,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[10]=t.z,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,e):new j(t.x,0,0,0,0,t.y,0,0,0,0,t.z,0,0,0,0,1)},j.fromUniformScale=function(t,e){return r.n.typeOf.number("scale",t),a.t(e)?(e[0]=t,e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=t,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[10]=t,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,e):new j(t,0,0,0,0,t,0,0,0,0,t,0,0,0,0,1)};var x=new e.a,M=new e.a,d=new e.a;j.fromCamera=function(t,n){r.n.typeOf.object("camera",t);var o=t.position,u=t.direction,i=t.up;r.n.typeOf.object("camera.position",o),r.n.typeOf.object("camera.direction",u),r.n.typeOf.object("camera.up",i),e.a.normalize(u,x),e.a.normalize(e.a.cross(x,i,M),M),e.a.normalize(e.a.cross(M,x,d),d);var f=M.x,c=M.y,s=M.z,y=x.x,l=x.y,O=x.z,p=d.x,b=d.y,m=d.z,h=o.x,g=o.y,v=o.z,E=f*-h+c*-g+s*-v,w=p*-h+b*-g+m*-v,T=y*h+l*g+O*v;return a.t(n)?(n[0]=f,n[1]=p,n[2]=-y,n[3]=0,n[4]=c,n[5]=b,n[6]=-l,n[7]=0,n[8]=s,n[9]=m,n[10]=-O,n[11]=0,n[12]=E,n[13]=w,n[14]=T,n[15]=1,n):new j(f,c,s,E,p,b,m,w,-y,-l,-O,T,0,0,0,1)},j.computePerspectiveFieldOfView=function(t,e,n,a,o){r.n.typeOf.number.greaterThan("fovY",t,0),r.n.typeOf.number.lessThan("fovY",t,Math.PI),r.n.typeOf.number.greaterThan("near",n,0),r.n.typeOf.number.greaterThan("far",a,0),r.n.typeOf.object("result",o);var u=1/Math.tan(.5*t),i=u/e,f=(a+n)/(n-a),c=2*a*n/(n-a);return o[0]=i,o[1]=0,o[2]=0,o[3]=0,o[4]=0,o[5]=u,o[6]=0,o[7]=0,o[8]=0,o[9]=0,o[10]=f,o[11]=-1,o[12]=0,o[13]=0,o[14]=c,o[15]=0,o},j.computeOrthographicOffCenter=function(t,e,n,a,o,u,i){r.n.typeOf.number("left",t),r.n.typeOf.number("right",e),r.n.typeOf.number("bottom",n),r.n.typeOf.number("top",a),r.n.typeOf.number("near",o),r.n.typeOf.number("far",u),r.n.typeOf.object("result",i);var f=1/(e-t),c=1/(a-n),s=1/(u-o),y=-(e+t)*f,l=-(a+n)*c,O=-(u+o)*s;return f*=2,c*=2,s*=-2,i[0]=f,i[1]=0,i[2]=0,i[3]=0,i[4]=0,i[5]=c,i[6]=0,i[7]=0,i[8]=0,i[9]=0,i[10]=s,i[11]=0,i[12]=y,i[13]=l,i[14]=O,i[15]=1,i},j.computePerspectiveOffCenter=function(t,e,n,a,o,u,i){r.n.typeOf.number("left",t),r.n.typeOf.number("right",e),r.n.typeOf.number("bottom",n),r.n.typeOf.number("top",a),r.n.typeOf.number("near",o),r.n.typeOf.number("far",u),r.n.typeOf.object("result",i);var f=2*o/(e-t),c=2*o/(a-n),s=(e+t)/(e-t),y=(a+n)/(a-n),l=-(u+o)/(u-o),O=-2*u*o/(u-o);return i[0]=f,i[1]=0,i[2]=0,i[3]=0,i[4]=0,i[5]=c,i[6]=0,i[7]=0,i[8]=s,i[9]=y,i[10]=l,i[11]=-1,i[12]=0,i[13]=0,i[14]=O,i[15]=0,i},j.computeInfinitePerspectiveOffCenter=function(t,e,n,a,o,u){r.n.typeOf.number("left",t),r.n.typeOf.number("right",e),r.n.typeOf.number("bottom",n),r.n.typeOf.number("top",a),r.n.typeOf.number("near",o),r.n.typeOf.object("result",u);var i=2*o/(e-t),f=2*o/(a-n),c=(e+t)/(e-t),s=(a+n)/(a-n),y=-2*o;return u[0]=i,u[1]=0,u[2]=0,u[3]=0,u[4]=0,u[5]=f,u[6]=0,u[7]=0,u[8]=c,u[9]=s,u[10]=-1,u[11]=-1,u[12]=0,u[13]=0,u[14]=y,u[15]=0,u},j.computeViewportTransformation=function(t,e,n,o){r.n.typeOf.object("result",o),t=a.e(t,a.e.EMPTY_OBJECT);var u=a.e(t.x,0),i=a.e(t.y,0),f=a.e(t.width,0),c=a.e(t.height,0);e=a.e(e,0);var s=.5*f,y=.5*c,l=.5*((n=a.e(n,1))-e),O=s,p=y,b=l,m=u+s,h=i+y,j=e+l;return o[0]=O,o[1]=0,o[2]=0,o[3]=0,o[4]=0,o[5]=p,o[6]=0,o[7]=0,o[8]=0,o[9]=0,o[10]=b,o[11]=0,o[12]=m,o[13]=h,o[14]=j,o[15]=1,o},j.computeView=function(t,n,a,o,u){return r.n.typeOf.object("position",t),r.n.typeOf.object("direction",n),r.n.typeOf.object("up",a),r.n.typeOf.object("right",o),r.n.typeOf.object("result",u),u[0]=o.x,u[1]=a.x,u[2]=-n.x,u[3]=0,u[4]=o.y,u[5]=a.y,u[6]=-n.y,u[7]=0,u[8]=o.z,u[9]=a.z,u[10]=-n.z,u[11]=0,u[12]=-e.a.dot(o,t),u[13]=-e.a.dot(a,t),u[14]=e.a.dot(n,t),u[15]=1,u},j.toArray=function(t,e){return r.n.typeOf.object("matrix",t),a.t(e)?(e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e[4]=t[4],e[5]=t[5],e[6]=t[6],e[7]=t[7],e[8]=t[8],e[9]=t[9],e[10]=t[10],e[11]=t[11],e[12]=t[12],e[13]=t[13],e[14]=t[14],e[15]=t[15],e):[t[0],t[1],t[2],t[3],t[4],t[5],t[6],t[7],t[8],t[9],t[10],t[11],t[12],t[13],t[14],t[15]]},j.getElementIndex=function(t,e){return r.n.typeOf.number.greaterThanOrEquals("row",e,0),r.n.typeOf.number.lessThanOrEquals("row",e,3),r.n.typeOf.number.greaterThanOrEquals("column",t,0),r.n.typeOf.number.lessThanOrEquals("column",t,3),4*t+e},j.getColumn=function(t,e,n){r.n.typeOf.object("matrix",t),r.n.typeOf.number.greaterThanOrEquals("index",e,0),r.n.typeOf.number.lessThanOrEquals("index",e,3),r.n.typeOf.object("result",n);var a=4*e,o=t[a],u=t[a+1],i=t[a+2],f=t[a+3];return n.x=o,n.y=u,n.z=i,n.w=f,n},j.setColumn=function(t,e,n,a){r.n.typeOf.object("matrix",t),r.n.typeOf.number.greaterThanOrEquals("index",e,0),r.n.typeOf.number.lessThanOrEquals("index",e,3),r.n.typeOf.object("cartesian",n),r.n.typeOf.object("result",a);var o=4*e;return(a=j.clone(t,a))[o]=n.x,a[o+1]=n.y,a[o+2]=n.z,a[o+3]=n.w,a},j.setTranslation=function(t,e,n){return r.n.typeOf.object("matrix",t),r.n.typeOf.object("translation",e),r.n.typeOf.object("result",n),n[0]=t[0],n[1]=t[1],n[2]=t[2],n[3]=t[3],n[4]=t[4],n[5]=t[5],n[6]=t[6],n[7]=t[7],n[8]=t[8],n[9]=t[9],n[10]=t[10],n[11]=t[11],n[12]=e.x,n[13]=e.y,n[14]=e.z,n[15]=t[15],n};var g=new e.a;j.setScale=function(t,n,a){r.n.typeOf.object("matrix",t),r.n.typeOf.object("scale",n),r.n.typeOf.object("result",a);var o=j.getScale(t,g),u=e.a.divideComponents(n,o,g);return j.multiplyByScale(t,u,a)},j.getRow=function(t,e,n){r.n.typeOf.object("matrix",t),r.n.typeOf.number.greaterThanOrEquals("index",e,0),r.n.typeOf.number.lessThanOrEquals("index",e,3),r.n.typeOf.object("result",n);var a=t[e],o=t[e+4],u=t[e+8],i=t[e+12];return n.x=a,n.y=o,n.z=u,n.w=i,n},j.setRow=function(t,e,n,a){return r.n.typeOf.object("matrix",t),r.n.typeOf.number.greaterThanOrEquals("index",e,0),r.n.typeOf.number.lessThanOrEquals("index",e,3),r.n.typeOf.object("cartesian",n),r.n.typeOf.object("result",a),(a=j.clone(t,a))[e]=n.x,a[e+4]=n.y,a[e+8]=n.z,a[e+12]=n.w,a};var v=new e.a;j.getScale=function(t,n){return r.n.typeOf.object("matrix",t),r.n.typeOf.object("result",n),n.x=e.a.magnitude(e.a.fromElements(t[0],t[1],t[2],v)),n.y=e.a.magnitude(e.a.fromElements(t[4],t[5],t[6],v)),n.z=e.a.magnitude(e.a.fromElements(t[8],t[9],t[10],v)),n};var E=new e.a;j.getMaximumScale=function(t){return j.getScale(t,E),e.a.maximumComponent(E)},j.multiply=function(t,e,n){r.n.typeOf.object("left",t),r.n.typeOf.object("right",e),r.n.typeOf.object("result",n);var a=t[0],o=t[1],u=t[2],i=t[3],f=t[4],c=t[5],s=t[6],y=t[7],l=t[8],O=t[9],p=t[10],b=t[11],m=t[12],h=t[13],j=t[14],x=t[15],M=e[0],d=e[1],g=e[2],v=e[3],E=e[4],w=e[5],T=e[6],z=e[7],R=e[8],N=e[9],I=e[10],L=e[11],S=e[12],q=e[13],C=e[14],P=e[15],U=a*M+f*d+l*g+m*v,W=o*M+c*d+O*g+h*v,A=u*M+s*d+p*g+j*v,B=i*M+y*d+b*g+x*v,_=a*E+f*w+l*T+m*z,k=o*E+c*w+O*T+h*z,G=u*E+s*w+p*T+j*z,Y=i*E+y*w+b*T+x*z,V=a*R+f*N+l*I+m*L,D=o*R+c*N+O*I+h*L,F=u*R+s*N+p*I+j*L,Z=i*R+y*N+b*I+x*L,Q=a*S+f*q+l*C+m*P,H=o*S+c*q+O*C+h*P,J=u*S+s*q+p*C+j*P,X=i*S+y*q+b*C+x*P;return n[0]=U,n[1]=W,n[2]=A,n[3]=B,n[4]=_,n[5]=k,n[6]=G,n[7]=Y,n[8]=V,n[9]=D,n[10]=F,n[11]=Z,n[12]=Q,n[13]=H,n[14]=J,n[15]=X,n},j.add=function(t,e,n){return r.n.typeOf.object("left",t),r.n.typeOf.object("right",e),r.n.typeOf.object("result",n),n[0]=t[0]+e[0],n[1]=t[1]+e[1],n[2]=t[2]+e[2],n[3]=t[3]+e[3],n[4]=t[4]+e[4],n[5]=t[5]+e[5],n[6]=t[6]+e[6],n[7]=t[7]+e[7],n[8]=t[8]+e[8],n[9]=t[9]+e[9],n[10]=t[10]+e[10],n[11]=t[11]+e[11],n[12]=t[12]+e[12],n[13]=t[13]+e[13],n[14]=t[14]+e[14],n[15]=t[15]+e[15],n},j.subtract=function(t,e,n){return r.n.typeOf.object("left",t),r.n.typeOf.object("right",e),r.n.typeOf.object("result",n),n[0]=t[0]-e[0],n[1]=t[1]-e[1],n[2]=t[2]-e[2],n[3]=t[3]-e[3],n[4]=t[4]-e[4],n[5]=t[5]-e[5],n[6]=t[6]-e[6],n[7]=t[7]-e[7],n[8]=t[8]-e[8],n[9]=t[9]-e[9],n[10]=t[10]-e[10],n[11]=t[11]-e[11],n[12]=t[12]-e[12],n[13]=t[13]-e[13],n[14]=t[14]-e[14],n[15]=t[15]-e[15],n},j.multiplyTransformation=function(t,e,n){r.n.typeOf.object("left",t),r.n.typeOf.object("right",e),r.n.typeOf.object("result",n);var a=t[0],o=t[1],u=t[2],i=t[4],f=t[5],c=t[6],s=t[8],y=t[9],l=t[10],O=t[12],p=t[13],b=t[14],m=e[0],h=e[1],j=e[2],x=e[4],M=e[5],d=e[6],g=e[8],v=e[9],E=e[10],w=e[12],T=e[13],z=e[14],R=a*m+i*h+s*j,N=o*m+f*h+y*j,I=u*m+c*h+l*j,L=a*x+i*M+s*d,S=o*x+f*M+y*d,q=u*x+c*M+l*d,C=a*g+i*v+s*E,P=o*g+f*v+y*E,U=u*g+c*v+l*E,W=a*w+i*T+s*z+O,A=o*w+f*T+y*z+p,B=u*w+c*T+l*z+b;return n[0]=R,n[1]=N,n[2]=I,n[3]=0,n[4]=L,n[5]=S,n[6]=q,n[7]=0,n[8]=C,n[9]=P,n[10]=U,n[11]=0,n[12]=W,n[13]=A,n[14]=B,n[15]=1,n},j.multiplyByMatrix3=function(t,e,n){r.n.typeOf.object("matrix",t),r.n.typeOf.object("rotation",e),r.n.typeOf.object("result",n);var a=t[0],o=t[1],u=t[2],i=t[4],f=t[5],c=t[6],s=t[8],y=t[9],l=t[10],O=e[0],p=e[1],b=e[2],m=e[3],h=e[4],j=e[5],x=e[6],M=e[7],d=e[8],g=a*O+i*p+s*b,v=o*O+f*p+y*b,E=u*O+c*p+l*b,w=a*m+i*h+s*j,T=o*m+f*h+y*j,z=u*m+c*h+l*j,R=a*x+i*M+s*d,N=o*x+f*M+y*d,I=u*x+c*M+l*d;return n[0]=g,n[1]=v,n[2]=E,n[3]=0,n[4]=w,n[5]=T,n[6]=z,n[7]=0,n[8]=R,n[9]=N,n[10]=I,n[11]=0,n[12]=t[12],n[13]=t[13],n[14]=t[14],n[15]=t[15],n},j.multiplyByTranslation=function(t,e,n){r.n.typeOf.object("matrix",t),r.n.typeOf.object("translation",e),r.n.typeOf.object("result",n);var a=e.x,o=e.y,u=e.z,i=a*t[0]+o*t[4]+u*t[8]+t[12],f=a*t[1]+o*t[5]+u*t[9]+t[13],c=a*t[2]+o*t[6]+u*t[10]+t[14];return n[0]=t[0],n[1]=t[1],n[2]=t[2],n[3]=t[3],n[4]=t[4],n[5]=t[5],n[6]=t[6],n[7]=t[7],n[8]=t[8],n[9]=t[9],n[10]=t[10],n[11]=t[11],n[12]=i,n[13]=f,n[14]=c,n[15]=t[15],n};var w=new e.a;j.multiplyByUniformScale=function(t,e,n){return r.n.typeOf.object("matrix",t),r.n.typeOf.number("scale",e),r.n.typeOf.object("result",n),w.x=e,w.y=e,w.z=e,j.multiplyByScale(t,w,n)},j.multiplyByScale=function(t,e,n){r.n.typeOf.object("matrix",t),r.n.typeOf.object("scale",e),r.n.typeOf.object("result",n);var a=e.x,o=e.y,u=e.z;return 1===a&&1===o&&1===u?j.clone(t,n):(n[0]=a*t[0],n[1]=a*t[1],n[2]=a*t[2],n[3]=0,n[4]=o*t[4],n[5]=o*t[5],n[6]=o*t[6],n[7]=0,n[8]=u*t[8],n[9]=u*t[9],n[10]=u*t[10],n[11]=0,n[12]=t[12],n[13]=t[13],n[14]=t[14],n[15]=1,n)},j.multiplyByVector=function(t,e,n){r.n.typeOf.object("matrix",t),r.n.typeOf.object("cartesian",e),r.n.typeOf.object("result",n);var a=e.x,o=e.y,u=e.z,i=e.w,f=t[0]*a+t[4]*o+t[8]*u+t[12]*i,c=t[1]*a+t[5]*o+t[9]*u+t[13]*i,s=t[2]*a+t[6]*o+t[10]*u+t[14]*i,y=t[3]*a+t[7]*o+t[11]*u+t[15]*i;return n.x=f,n.y=c,n.z=s,n.w=y,n},j.multiplyByPointAsVector=function(t,e,n){r.n.typeOf.object("matrix",t),r.n.typeOf.object("cartesian",e),r.n.typeOf.object("result",n);var a=e.x,o=e.y,u=e.z,i=t[0]*a+t[4]*o+t[8]*u,f=t[1]*a+t[5]*o+t[9]*u,c=t[2]*a+t[6]*o+t[10]*u;return n.x=i,n.y=f,n.z=c,n},j.multiplyByPoint=function(t,e,n){r.n.typeOf.object("matrix",t),r.n.typeOf.object("cartesian",e),r.n.typeOf.object("result",n);var a=e.x,o=e.y,u=e.z,i=t[0]*a+t[4]*o+t[8]*u+t[12],f=t[1]*a+t[5]*o+t[9]*u+t[13],c=t[2]*a+t[6]*o+t[10]*u+t[14];return n.x=i,n.y=f,n.z=c,n},j.multiplyByScalar=function(t,e,n){return r.n.typeOf.object("matrix",t),r.n.typeOf.number("scalar",e),r.n.typeOf.object("result",n),n[0]=t[0]*e,n[1]=t[1]*e,n[2]=t[2]*e,n[3]=t[3]*e,n[4]=t[4]*e,n[5]=t[5]*e,n[6]=t[6]*e,n[7]=t[7]*e,n[8]=t[8]*e,n[9]=t[9]*e,n[10]=t[10]*e,n[11]=t[11]*e,n[12]=t[12]*e,n[13]=t[13]*e,n[14]=t[14]*e,n[15]=t[15]*e,n},j.multiplyByPlane=function(t,a,o){r.n.typeOf.object("matrix",t),r.n.typeOf.object("plane",a),r.n.typeOf.object("result",o);var u=new j,i=new j;j.inverse(t,u),j.transpose(u,i);var f=new n.a(a.normal.x,a.normal.y,a.normal.z,a.distance);j.multiplyByVector(i,f,f),o.normal.x=f.x,o.normal.y=f.y,o.normal.z=f.z;var c=e.a.magnitude(o.normal);return e.a.normalize(o.normal,o.normal),o.distance=f.w/c,o},j.negate=function(t,e){return r.n.typeOf.object("matrix",t),r.n.typeOf.object("result",e),e[0]=-t[0],e[1]=-t[1],e[2]=-t[2],e[3]=-t[3],e[4]=-t[4],e[5]=-t[5],e[6]=-t[6],e[7]=-t[7],e[8]=-t[8],e[9]=-t[9],e[10]=-t[10],e[11]=-t[11],e[12]=-t[12],e[13]=-t[13],e[14]=-t[14],e[15]=-t[15],e},j.transpose=function(t,e){r.n.typeOf.object("matrix",t),r.n.typeOf.object("result",e);var n=t[1],a=t[2],o=t[3],u=t[6],i=t[7],f=t[11];return e[0]=t[0],e[1]=t[4],e[2]=t[8],e[3]=t[12],e[4]=n,e[5]=t[5],e[6]=t[9],e[7]=t[13],e[8]=a,e[9]=u,e[10]=t[10],e[11]=t[14],e[12]=o,e[13]=i,e[14]=f,e[15]=t[15],e},j.abs=function(t,e){return r.n.typeOf.object("matrix",t),r.n.typeOf.object("result",e),e[0]=Math.abs(t[0]),e[1]=Math.abs(t[1]),e[2]=Math.abs(t[2]),e[3]=Math.abs(t[3]),e[4]=Math.abs(t[4]),e[5]=Math.abs(t[5]),e[6]=Math.abs(t[6]),e[7]=Math.abs(t[7]),e[8]=Math.abs(t[8]),e[9]=Math.abs(t[9]),e[10]=Math.abs(t[10]),e[11]=Math.abs(t[11]),e[12]=Math.abs(t[12]),e[13]=Math.abs(t[13]),e[14]=Math.abs(t[14]),e[15]=Math.abs(t[15]),e},j.equals=function(t,e){return t===e||a.t(t)&&a.t(e)&&t[12]===e[12]&&t[13]===e[13]&&t[14]===e[14]&&t[0]===e[0]&&t[1]===e[1]&&t[2]===e[2]&&t[4]===e[4]&&t[5]===e[5]&&t[6]===e[6]&&t[8]===e[8]&&t[9]===e[9]&&t[10]===e[10]&&t[3]===e[3]&&t[7]===e[7]&&t[11]===e[11]&&t[15]===e[15]},j.equalsEpsilon=function(t,e,n){return r.n.typeOf.number("epsilon",n),t===e||a.t(t)&&a.t(e)&&Math.abs(t[0]-e[0])<=n&&Math.abs(t[1]-e[1])<=n&&Math.abs(t[2]-e[2])<=n&&Math.abs(t[3]-e[3])<=n&&Math.abs(t[4]-e[4])<=n&&Math.abs(t[5]-e[5])<=n&&Math.abs(t[6]-e[6])<=n&&Math.abs(t[7]-e[7])<=n&&Math.abs(t[8]-e[8])<=n&&Math.abs(t[9]-e[9])<=n&&Math.abs(t[10]-e[10])<=n&&Math.abs(t[11]-e[11])<=n&&Math.abs(t[12]-e[12])<=n&&Math.abs(t[13]-e[13])<=n&&Math.abs(t[14]-e[14])<=n&&Math.abs(t[15]-e[15])<=n},j.getTranslation=function(t,e){return r.n.typeOf.object("matrix",t),r.n.typeOf.object("result",e),e.x=t[12],e.y=t[13],e.z=t[14],e},j.getMatrix3=function(t,e){return r.n.typeOf.object("matrix",t),r.n.typeOf.object("result",e),e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[4],e[4]=t[5],e[5]=t[6],e[6]=t[8],e[7]=t[9],e[8]=t[10],e},j.getRotation=function(t,e){return r.n.typeOf.object("matrix",t),r.n.typeOf.object("result",e),e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[4],e[4]=t[5],e[5]=t[6],e[6]=t[8],e[7]=t[9],e[8]=t[10],e};var T=new f,z=new f,R=new n.a,N=new n.a(0,0,0,1);j.inverse=function(t,e){r.n.typeOf.object("matrix",t),r.n.typeOf.object("result",e);var a=t[0],i=t[4],c=t[8],s=t[12],y=t[1],l=t[5],O=t[9],p=t[13],b=t[2],m=t[6],h=t[10],x=t[14],M=t[3],d=t[7],g=t[11],v=t[15],E=h*v,w=x*g,I=m*v,L=x*d,S=m*g,q=h*d,C=b*v,P=x*M,U=b*g,W=h*M,A=b*d,B=m*M,_=E*l+L*O+S*p-(w*l+I*O+q*p),k=w*y+C*O+W*p-(E*y+P*O+U*p),G=I*y+P*l+A*p-(L*y+C*l+B*p),Y=q*y+U*l+B*O-(S*y+W*l+A*O),V=w*i+I*c+q*s-(E*i+L*c+S*s),D=E*a+P*c+U*s-(w*a+C*c+W*s),F=L*a+C*i+B*s-(I*a+P*i+A*s),Z=S*a+W*i+A*c-(q*a+U*i+B*c),Q=(E=c*p)*d+(L=s*l)*g+(S=i*O)*v-((w=s*O)*d+(I=i*p)*g+(q=c*l)*v),H=w*M+(C=a*p)*g+(W=c*y)*v-(E*M+(P=s*y)*g+(U=a*O)*v),J=I*M+P*d+(A=a*l)*v-(L*M+C*d+(B=i*y)*v),X=q*M+U*d+B*g-(S*M+W*d+A*g),K=I*h+q*x+w*m-(S*x+E*m+L*h),$=U*x+E*b+P*h-(C*h+W*x+w*b),tt=C*m+B*x+L*b-(A*x+I*b+P*m),et=A*h+S*b+W*m-(U*m+B*h+q*b),nt=a*_+i*k+c*G+s*Y;if(Math.abs(nt)<o.n.EPSILON21){if(f.equalsEpsilon(j.getRotation(t,T),z,o.n.EPSILON5)&&n.a.equals(j.getRow(t,3,R),N))return e[0]=0,e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=0,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[10]=0,e[11]=0,e[12]=-t[12],e[13]=-t[13],e[14]=-t[14],e[15]=1,e;throw new u.t("matrix is not invertible because its determinate is zero.")}return nt=1/nt,e[0]=_*nt,e[1]=k*nt,e[2]=G*nt,e[3]=Y*nt,e[4]=V*nt,e[5]=D*nt,e[6]=F*nt,e[7]=Z*nt,e[8]=Q*nt,e[9]=H*nt,e[10]=J*nt,e[11]=X*nt,e[12]=K*nt,e[13]=$*nt,e[14]=tt*nt,e[15]=et*nt,e},j.inverseTransformation=function(t,e){r.n.typeOf.object("matrix",t),r.n.typeOf.object("result",e);var n=t[0],a=t[1],o=t[2],u=t[4],i=t[5],f=t[6],c=t[8],s=t[9],y=t[10],l=t[12],O=t[13],p=t[14],b=-n*l-a*O-o*p,m=-u*l-i*O-f*p,h=-c*l-s*O-y*p;return e[0]=n,e[1]=u,e[2]=c,e[3]=0,e[4]=a,e[5]=i,e[6]=s,e[7]=0,e[8]=o,e[9]=f,e[10]=y,e[11]=0,e[12]=b,e[13]=m,e[14]=h,e[15]=1,e},j.IDENTITY=Object.freeze(new j(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1)),j.ZERO=Object.freeze(new j(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0)),j.COLUMN0ROW0=0,j.COLUMN0ROW1=1,j.COLUMN0ROW2=2,j.COLUMN0ROW3=3,j.COLUMN1ROW0=4,j.COLUMN1ROW1=5,j.COLUMN1ROW2=6,j.COLUMN1ROW3=7,j.COLUMN2ROW0=8,j.COLUMN2ROW1=9,j.COLUMN2ROW2=10,j.COLUMN2ROW3=11,j.COLUMN3ROW0=12,j.COLUMN3ROW1=13,j.COLUMN3ROW2=14,j.COLUMN3ROW3=15,Object.defineProperties(j.prototype,{length:{get:function(){return j.packedLength}}}),j.prototype.clone=function(t){return j.clone(this,t)},j.prototype.equals=function(t){return j.equals(this,t)},j.equalsArray=function(t,e,n){return t[0]===e[n]&&t[1]===e[n+1]&&t[2]===e[n+2]&&t[3]===e[n+3]&&t[4]===e[n+4]&&t[5]===e[n+5]&&t[6]===e[n+6]&&t[7]===e[n+7]&&t[8]===e[n+8]&&t[9]===e[n+9]&&t[10]===e[n+10]&&t[11]===e[n+11]&&t[12]===e[n+12]&&t[13]===e[n+13]&&t[14]===e[n+14]&&t[15]===e[n+15]},j.prototype.equalsEpsilon=function(t,e){return j.equalsEpsilon(this,t,e)},j.prototype.toString=function(){return"("+this[0]+", "+this[4]+", "+this[8]+", "+this[12]+")\n("+this[1]+", "+this[5]+", "+this[9]+", "+this[13]+")\n("+this[2]+", "+this[6]+", "+this[10]+", "+this[14]+")\n("+this[3]+", "+this[7]+", "+this[11]+", "+this[15]+")"};var I={POINTS:i.t.POINTS,LINES:i.t.LINES,LINE_LOOP:i.t.LINE_LOOP,LINE_STRIP:i.t.LINE_STRIP,TRIANGLES:i.t.TRIANGLES,TRIANGLE_STRIP:i.t.TRIANGLE_STRIP,TRIANGLE_FAN:i.t.TRIANGLE_FAN,validate:function(t){return t===I.POINTS||t===I.LINES||t===I.LINE_LOOP||t===I.LINE_STRIP||t===I.TRIANGLES||t===I.TRIANGLE_STRIP||t===I.TRIANGLE_FAN}},L=Object.freeze(I);t._0x38df4a=L,t.c=j,t.r=f}));
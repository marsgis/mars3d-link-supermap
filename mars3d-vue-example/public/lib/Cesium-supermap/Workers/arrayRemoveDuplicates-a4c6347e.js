define(["exports","./Check-3aa71481","./when-515d5295","./Math-5e38123d"],(function(e,n,t,r){"use strict";var i=r.n.EPSILON10;e.u=function(e,r,f,h){if(n.n.defined("equalsEpsilon",r),t.t(e)){h=t.e(h,i),f=t.e(f,!1);var s,u,l,a=e.length;if(a<2)return e;for(s=1;s<a&&!r(u=e[s-1],l=e[s],h);++s);if(s===a)return f&&r(e[0],e[e.length-1],h)?e.slice(1):e;for(var c=e.slice(0,s);s<a;++s)r(u,l=e[s],h)||(c.push(l),u=l);return f&&c.length>1&&r(c[0],c[c.length-1],h)&&c.shift(),c}}}));
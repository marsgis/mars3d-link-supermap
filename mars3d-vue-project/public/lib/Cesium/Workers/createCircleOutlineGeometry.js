/**
 * @license
 * Cesium - https://github.com/CesiumGS/cesium
 * Version 1.124
 *
 * Copyright 2011-2022 Cesium Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Columbus View (Pat. Pend.)
 *
 * Portions licensed separately.
 * See https://github.com/CesiumGS/cesium/blob/main/LICENSE.md for full licensing details.
 */

import{a as n}from"./chunk-FFJVT5JM.js";import"./chunk-HIRDJ2R5.js";import"./chunk-TP5B32RY.js";import"./chunk-A3VS2OZ2.js";import"./chunk-E2XIHPTZ.js";import"./chunk-T6R736YE.js";import"./chunk-V7TDVUVX.js";import"./chunk-T5JXF4O6.js";import"./chunk-GNTVNTUY.js";import{a as o,d as s}from"./chunk-HWH6BBH6.js";import"./chunk-DW4EQ6YI.js";import"./chunk-6DFUP66D.js";import"./chunk-GVFM5H7M.js";import{a as u}from"./chunk-CJFJKB5V.js";import{b as d}from"./chunk-4BGNE6LH.js";import{e as a}from"./chunk-OX5CTLXY.js";function m(e){e=u(e,u.EMPTY_OBJECT);let r=e.radius;d.typeOf.number("radius",r);let l={center:e.center,semiMajorAxis:r,semiMinorAxis:r,ellipsoid:e.ellipsoid,height:e.height,extrudedHeight:e.extrudedHeight,granularity:e.granularity,numberOfVerticalLines:e.numberOfVerticalLines};this._ellipseGeometry=new n(l),this._workerName="createCircleOutlineGeometry"}m.packedLength=n.packedLength;m.pack=function(e,r,l){return d.typeOf.object("value",e),n.pack(e._ellipseGeometry,r,l)};var p=new n({center:new o,semiMajorAxis:1,semiMinorAxis:1}),i={center:new o,radius:void 0,ellipsoid:s.clone(s.UNIT_SPHERE),height:void 0,extrudedHeight:void 0,granularity:void 0,numberOfVerticalLines:void 0,semiMajorAxis:void 0,semiMinorAxis:void 0};m.unpack=function(e,r,l){let t=n.unpack(e,r,p);return i.center=o.clone(t._center,i.center),i.ellipsoid=s.clone(t._ellipsoid,i.ellipsoid),i.height=t._height,i.extrudedHeight=t._extrudedHeight,i.granularity=t._granularity,i.numberOfVerticalLines=t._numberOfVerticalLines,a(l)?(i.semiMajorAxis=t._semiMajorAxis,i.semiMinorAxis=t._semiMinorAxis,l._ellipseGeometry=new n(i),l):(i.radius=t._semiMajorAxis,new m(i))};m.createGeometry=function(e){return n.createGeometry(e._ellipseGeometry)};var c=m;function f(e,r){return a(r)&&(e=c.unpack(e,r)),e._ellipseGeometry._center=o.clone(e._ellipseGeometry._center),e._ellipseGeometry._ellipsoid=s.clone(e._ellipseGeometry._ellipsoid),c.createGeometry(e)}var E=f;export{E as default};

/**
 * @license
 * Cesium - https://github.com/CesiumGS/cesium
 * Version 1.141.0
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

import{a as f}from"./chunk-FRM2YCDS.js";import"./chunk-ESGQYWWC.js";import"./chunk-DPLTI5HQ.js";import{a as u}from"./chunk-Y7MKUU32.js";import"./chunk-R5O5DVZD.js";import"./chunk-GNV373C3.js";import"./chunk-5WIQWIDU.js";import"./chunk-RLPCZZG4.js";import"./chunk-UIR2RSB2.js";import"./chunk-M6ON6VVV.js";import"./chunk-L6WRMVET.js";import"./chunk-7CH4MFDA.js";import"./chunk-NAOK3KGT.js";import"./chunk-PBVQ42HU.js";import"./chunk-N6EN2BOY.js";import"./chunk-SHV2E5IR.js";import"./chunk-I7E7ZFTX.js";import"./chunk-YJKT47HQ.js";import"./chunk-WIGTKL4L.js";import"./chunk-7WRUK24H.js";import"./chunk-GXMV6G6L.js";import"./chunk-BCBAUFC4.js";import"./chunk-7NLQQSNP.js";import"./chunk-4DV5ZZMP.js";function h(c,d){let e=f.upsampleMesh(c),t=e.vertices.buffer,i=e.indices.buffer,s=e.westIndicesSouthToNorth.buffer,o=e.southIndicesEastToWest.buffer,r=e.eastIndicesNorthToSouth.buffer,n=e.northIndicesWestToEast.buffer;return d.push(t,i,s,o,r,n),{verticesBuffer:t,indicesBuffer:i,vertexCountWithoutSkirts:e.vertexCountWithoutSkirts,indexCountWithoutSkirts:e.indexCountWithoutSkirts,encoding:e.encoding,westIndicesBuffer:s,southIndicesBuffer:o,eastIndicesBuffer:r,northIndicesBuffer:n,minimumHeight:e.minimumHeight,maximumHeight:e.maximumHeight,boundingSphere:e.boundingSphere3D,orientedBoundingBox:e.orientedBoundingBox,horizonOcclusionPoint:e.horizonOcclusionPoint}}var I=u(h);export{I as default};

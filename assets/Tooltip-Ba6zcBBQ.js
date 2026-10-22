import{c as p}from"./BMSSection-CdCqg1f_.js";import{c as f,l as u,b as y}from"./MapGISControls-B2G_uvuV.js";import{r as T}from"./index.nbms.source-BeoRmwUm.js";/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const b=p("Pause",[["rect",{x:"14",y:"4",width:"4",height:"16",rx:"1",key:"zuxfzm"}],["rect",{x:"6",y:"4",width:"4",height:"16",rx:"1",key:"1okwgv"}]]);/**
 * @license lucide-react v0.469.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const g=p("Play",[["polygon",{points:"6 3 20 12 6 21 6 3",key:"1oa8hb"}]]),v=f(function(i,t){const e=new u.Tooltip(i,t.overlayContainer);return y(e,t)},function(i,t,{position:e},r){T.useEffect(function(){const o=t.overlayContainer;if(o==null)return;const{instance:n}=i,a=l=>{l.tooltip===n&&(e!=null&&n.setLatLng(e),n.update(),r(!0))},c=l=>{l.tooltip===n&&r(!1)};return o.on({tooltipopen:a,tooltipclose:c}),o.bindTooltip(n),function(){o.off({tooltipopen:a,tooltipclose:c}),o._map!=null&&o.unbindTooltip()}},[i,t,r,e])});export{b as P,v as T,g as a};

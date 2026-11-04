function i(n,t){const o=URL.createObjectURL(n),a=document.createElement("a");a.href=o,a.download=t,document.body.appendChild(a),a.click(),a.remove(),URL.revokeObjectURL(o)}const c=["id","name","type","road","roadNumber","region","chainage","lat","lng","spanLength","noOfSpans","noOfLanes","noOfPiers","width","material","crossingType","surfaceType","yearBuilt","maintenanceArea","river","conditionRating","lastInspection","nextInspection","inspectionDue","traffic","priorityRank","estimatedReplacementCost"];function s(n){if(n==null)return"";const t=String(n);return t.includes(",")||t.includes('"')||t.includes(`
`)?'"'+t.replace(/"/g,'""')+'"':t}function m(n,t="structures.csv"){const o=c.join(","),a=n.map(r=>c.map(p=>s(r[p])).join(",")),e=[o,...a].join(`
`);i(new Blob([e],{type:"text/csv;charset=utf-8"}),t)}function d(n,t="structures.geojson"){const o={type:"FeatureCollection",features:n.map(e=>({type:"Feature",geometry:{type:"Point",coordinates:[e.lng,e.lat]},properties:{id:e.id,name:e.name,type:e.type,road:e.road,road_number:e.roadNumber,region:e.region,chainage_km:e.chainage,span_m:e.spanLength,n_spans:e.noOfSpans,n_lanes:e.noOfLanes,width_m:e.width,material:e.material,crossing:e.crossingType,surface:e.surfaceType,year_built:e.yearBuilt,condition:e.conditionRating,last_inspection:e.lastInspection,priority_rank:e.priorityRank,traffic:e.traffic,maint_area:e.maintenanceArea,river:e.river}}))},a=new Blob([JSON.stringify(o,null,2)],{type:"application/geo+json"});i(a,t)}const f={1:"ff2222ff",2:"ff4488ff",3:"ff00aaff",4:"ff00ff88",5:"ff00cc44"};function g(n,t="structures.kml"){const o=n.map(e=>{const r=f[e.conditionRating]??"ffffffff";return`  <Placemark>
    <name>${l(e.name)}</name>
    <description><![CDATA[
      <b>Type:</b> ${e.type}<br/>
      <b>Road:</b> ${l(e.road)}<br/>
      <b>Chainage:</b> ${e.chainage} km<br/>
      <b>Region:</b> ${e.region}<br/>
      <b>Year Built:</b> ${e.yearBuilt}<br/>
      <b>Condition:</b> ${e.conditionRating}/5<br/>
      <b>Material:</b> ${e.material}
    ]]></description>
    <Style><IconStyle><color>${r}</color>
      <Icon><href>https://maps.google.com/mapfiles/kml/shapes/placemark_circle.png</href></Icon>
    </IconStyle></Style>
    <Point><coordinates>${e.lng},${e.lat},0</coordinates></Point>
  </Placemark>`}).join(`
`),a=`<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
<Document>
  <name>Data Science Trials Structures</name>
  <description>Personal learning extract - ${n.length} Bridges and Major Culverts</description>
${o}
</Document>
</kml>`;i(new Blob([a],{type:"application/vnd.google-earth.kml+xml"}),t)}function l(n){return n.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}export{g as a,m as b,d};

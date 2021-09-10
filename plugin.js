(()=>{"use strict";const t=class{on(t,e){this._eventHandlers||(this._eventHandlers={}),this._eventHandlers[t]||(this._eventHandlers[t]=[]),this._eventHandlers[t].push(e)}off(t,e){const s=this._eventHandlers&&this._eventHandlers[t];if(s)for(let t=0;t<s.length;t++)s[t]===e&&s.splice(t--,1)}trigger(t,...e){let s;if(this._eventHandlers&&this._eventHandlers[t])return this._eventHandlers[t].forEach((t=>{const i=t.call(this,...e);return s=i,i})),s}};function e(t,e){return Math.trunc(t/e)}const s=Object.prototype.hasOwnProperty;class i extends t{constructor(t,e){super(),this.interval=new Map,this.coords={main:0,prevMain:0,value:1,prevValue:0,caller:"",clicked:!1,altDrag:!0,target:null,mainMax:0},this.temp={},this._settings={className:"slider",orientation:"horizontal",type:"double",stepSize:90,pxPerValue:0,valuePerPx:1,marginLeft:0,marginTop:0,maxValue:1360,minValue:0,maxMinDifference:0,betweenMarkers:40,_minPins:5,mainMax:200,mainMin:0,startPos1:0,startPos2:100,startValue1:810,startValue2:0,valueWidth:0,toolTip:!0,marker:!0,altDrag:!1,built:!1,styles:{progressBarColor:"green",sliderColor:"red",handleColor:"",sliderWidth:200,sliderHeight:5,toolTextColor:"green"}},this._item=e,this.initOptions(t)}initOptions(t={}){Object.keys(t).forEach((e=>{this._settings.styles.hasOwnProperty(e)?this._settings.styles[e]=t[e]:this.temp.hasOwnProperty(e)?this.temp[e]=t[e]:this._settings[e]=t[e]})),this.correctOptions()}correctOptions(){this.coords.altDrag=this._settings.altDrag,this.coords.mainMax=this._settings.mainMax,this._settings.maxMinDifference=this._settings.maxValue-this._settings.minValue;const t=this._settings.maxMinDifference;"horizontal"===this._settings.orientation?this._settings.valuePerPx=t/this._settings.mainMax:"vertical"===this._settings.orientation&&(this._settings.valuePerPx=t/this._settings.styles.sliderHeight),this._settings.pxPerValue=this._settings.mainMax/(t/this._settings.stepSize),this.validateOptions()}validateOptions(){("vertical"===this._settings.orientation&&this._settings.styles.sliderWidth>this._settings.styles.sliderHeight||"horizontal"===this._settings.orientation&&this._settings.styles.sliderWidth<this._settings.styles.sliderHeight)&&([this._settings.styles.sliderWidth,this._settings.styles.sliderHeight]=[this._settings.styles.sliderHeight,this._settings.styles.sliderWidth]),this._settings.maxValue<this._settings.minValue&&([this._settings.maxValue,this._settings.minValue]=[this._settings.minValue,this._settings.maxValue])}validate(t){const e=Object.assign({},t),s=this._settings.mainMax,i=this._settings.mainMin,n=this._settings.maxValue,l=this._settings.minValue;return e.main>=s?e.main=s:e.main<=i&&(e.main=i),e.value>n?e.value=n:e.value<l&&(e.value=l),e}renew(t,s,i){const n=this._settings.pxPerValue;let l=0,a=0;if("vertical"===this._settings.orientation?(l=t.y,a=t.marginTop):"horizontal"===this._settings.orientation&&(l=t.x,a=this._settings.marginLeft),this.coords.caller="model",Object.keys(t).forEach((e=>{this.coords[e]=t[e]})),t.clicked){this.coords.main=l-a;const t=this.validate(this.coords);if(t)return this.trigger("coords changed",t,s,i),t}this.coords.main=l-a,this.coords.value=e(this.coords.main,n)*this._settings.stepSize+this._settings.minValue;const r=this.validate(this.coords);return this.coords.prevMain=this.coords.main,!!r&&(this.trigger("coords changed",r,s,i),r)}calcValue(t,s){let i;"horizontal"===this._settings.orientation?i="marginLeft":"vertical"===this._settings.orientation&&(i="marginTop");return{value:e(s-this._settings[i],this._settings.pxPerValue)*this._settings.stepSize,target:t}}calcMain(t,e){let s,i;s="horizontal"==this._settings.orientation?"sliderWidth":"sliderHeight",i=(t-this._settings.minValue)%this._settings.stepSize==0?t:this._settings.stepSize*Math.round((t-this._settings.minValue)/this._settings.stepSize)+this._settings.minValue;const n=i*this._settings.styles[s]/this._settings.maxMinDifference;this.coords.main=n,this.coords.value=i,this.coords.target=e,this.coords.caller="model";const l=this.validate(this.coords);this.trigger("coords changed",l,this._settings.orientation,this._settings.type)}setOption(t,e){s.call(this._settings,t)&&(this._settings[t]=e,this.trigger("settings changed"))}setOptions(t){this.initOptions(t),this.correctOptions(),this.trigger("settings changed")}getStyles(){return this._settings.styles}getStyle(t){return this._settings.styles[t]}getSetting(t){return this._settings[t]}getSettings(){return this._settings}getItem(){return this._item}}const n=class extends t{constructor(t,e,s){super(),this._elements={_slider:null,_sliderMain:null,_sliderContainer:null,_scale:null,_range:null,_tooltipContainers:[],_handles:[],_tooltips:[],_tooltipsSticks:[],_pins:[]},this._pres=t,this._item=s}implementStyles(t,e){this.initiateOptions(t);if(this._elements._tooltips[0].getBoundingClientRect().left<0){this._elements._sliderContainer.classList.add("slider-container--vertical--corrected");this.fetchHTMLEl("slider-min--vertical",!0).style.left="10px",this._elements._tooltipContainers.forEach((t=>{t.classList.add("tooltipContainer--vertical--corrected")}))}return this.fetchHTMLEl("values",!1).forEach((t=>{t.classList.add("values--corrected")})),{slider:this._elements._slider,range:this._elements._range,handles:this._elements._handles,wrapper:this._elements._sliderMain}}renderElement(t,e=this._item){e.append(t)}getOffsetsAndLimits(t){const{offsetLength:e}=this.temp;return{mainMax:this._elements._sliderMain[e]-this._elements._handles[0][e]/2,mainMin:this._elements._handles[0][e]/2,marginTop:this._elements._slider.getBoundingClientRect().top,marginLeft:this._elements._slider.getBoundingClientRect().left}}fetchHTMLEl(t,e,s=this._item){const i=[...s.querySelectorAll(`.${t}`)];return e?i[0]:i}fetchDivs(t,e){this._elements._sliderMain=this.fetchHTMLEl(`${e}-main`,!0),this._elements._slider=this.fetchHTMLEl(e,!0),this._elements._range=this.fetchHTMLEl(`${e}-range`,!0),this._elements._handles=this.fetchHTMLEl(`${e}-handle--${t}`,!1),this._elements._tooltips=this.fetchHTMLEl("tooltip",!1),this._elements._sliderContainer=this.fetchHTMLEl(`${e}-container`,!0),this._elements._scale=this.fetchHTMLEl(`${e}-marker`,!0),this._elements._tooltipContainers=this.fetchHTMLEl("tooltipContainer",!1),this._elements._pins=this.fetchHTMLEl("jsSlider-clickable",!1);const s=Array.from(this._item.getElementsByClassName("jsSlider-clickable")).map((t=>({div:t,value:t.textContent})));this.divsContainingValues=s,this.valuesFromDivs=s.map((t=>t.value));const{offset:i}=this.temp,n=Array.from(this._item.getElementsByClassName("jsOffset")).map((t=>({div:t,offset:t[i]}))),l=n.map((t=>t.offset));this.pinsCoordinatesItems=n,this.pinsCoordinates=l}initiateOptions(t){Object.keys(t).forEach((e=>{"object"==typeof t[e]&&Object.entries(t[e]).forEach((([t,s])=>{e.toString().includes("slider")?this._elements._slider.style[t]=s:e.toString().includes("progressBar")?this._elements._range.style[t]=s:e.toString().includes("markUp")?this._elements._slider.style[t]=s:e.toString().includes("handle")?this._elements._handles.forEach((e=>{e.style[t]=s})):e.toString().includes("tool")&&this._elements._tooltips.forEach((e=>{e.style[t]=s}))}))}))}refreshCoords(t,e,s){const i=t.clicked,n=t.altDrag;let l,a,r,o=t.value;const{widthOrHeight:h,direction:d}=this.temp;"single"===s?r=this._elements._handles[0]:"double"===s&&(r=t.target);const c=this._elements._range,m=this.fetchHTMLEl("tooltip",!0,r),_=Object.assign({},t);if(i)a=this.reactOnClick(_,e,s),l=a.newLeft;else if(n)a=this.reactOnDrag(_),l=a.newLeft;else{const{newLeft:t,value:e}=this.pinnedDrag(_);l=t,o=e}r.style[d]=l+"px","double"===s?this.rangeInterval():c.style[h]=l+r.offsetWidth/2+"px",i||(r.dataset.value=o,o=function(t){let e;return e=t.toString().length>3?(t/1e3).toFixed(1)+"k":String(t),e}(o),m.textContent=o)}reactOnDrag(t){let e;const s=t.shift||0;const{widthOrHeight:i}=this.temp,n=t.target,l=this._elements._range;0===t.value&&(l.style[i]="0");return t.altDrag?e=t.main-s:e+=n.offsetWidth/2,{newLeft:e,value:undefined}}pinnedDrag(t){let e;const s=this._elements._handles[0].offsetWidth;let{direction:i,margin:n}=this.temp;n=t[n];const l=this.matchHandleAndPin(t.main),a=Number(l.dataset.value);return e=l.getBoundingClientRect()[i]-n-s/2,l.className.includes("slider-min")?e=0:l.className.includes("slider-max")&&(e=t.mainMax-s/2),{newLeft:e,value:a}}reactOnClick(t,e,s){if("double"===s)return!1;const i=this._elements._handles[0],n=i.offsetWidth,l=t.target.parentElement,a=this.valuesFromDivs,r=this._elements._tooltips[0],{widthOrHeight:o,direction:h,margin:d}=this.temp,c=l.getBoundingClientRect()[h]-t[d]-n/2;return i.style[h]=c+"px",this._elements._range.style[o]=c+"px",r.textContent=t.value,a.includes(t.value)&&this.divsContainingValues.forEach((e=>{const s=e;s.value===t.value&&(this.divsContainingValues.forEach((()=>{e.div.style.color=""})),s.div.style.color=String(this.temp.pinTextColor))})),{newLeft:c,pin:l}}rangeInterval(){const t=this._elements._handles[0],e=this._elements._handles[1],{widthOrHeight:s,direction:i}=this.temp,n=parseFloat(t.style[i]);let l;l=e?parseFloat(e.style[i]):null;const a=Math.abs(n-l),r=Math.min(n,l);this._elements._range.style[i]=r+"px",this._elements._range.style[s]=a+t.offsetWidth/2+"px"}showValue(t,e){const s=t.getElementsByClassName("tooltip")[0];t.dataset.value=String(Math.abs(e)),s.textContent=String(Math.abs(e))}matchHandleAndPin(t){const e=this.pinsCoordinatesItems,s=this.pinsCoordinates;let i,n,l=1/0;return s.forEach((e=>{const s=Math.abs(t-Number(e));s<l&&(l=s,i=Number(e))})),e.forEach((t=>{const e=t;return i===e.offset&&(n=e.div,n)})),n}};class l extends t{constructor(t,e){super(),this.pxOptions=["height","width"],this._model=t,this._item=e}getView(t){this._view=t}init(){this._model.validateOptions();const t=this._model.getSetting("orientation");let e;this.temp=this.determineMetrics(t),this.temp.ori=this._model._settings.orientation,this.temp.type=this._model._settings.type,this._model.temp=this.temp,this._view.temp=this.temp,"horizontal"===t?e=this._model.getStyle("sliderWidth"):"vertical"==t&&(e=this._model.getStyle("sliderHeight"));const s=this.convertOptions(this._model.getStyles()),i=this._model.getSettings(),{main:n,container:l}=this.builder.makeSlider(i);if(this._view.renderElement(n),i.marker){const t=this.builder.makeMarker(i,e);l.appendChild(t)}this.fetchDivs(),this._view.implementStyles(s,this._model._settings.orientation),this._model.setOptions(this._view.getOffsetsAndLimits(t)),this._model.setOption("built",!0),this._view.rangeInterval()}firstRefresh(){const{direction:t,ori:e,type:s}=this.temp;let i=this._model._settings.startPos1;const n=this._model._settings.startPos2,l=this._model._settings.startValue1,a=this._model._settings.startValue2;if(0!==l||0!==a)return this.setValue(l,1),void("double"===s&&this.setValue(a,2));const r=i||n,o=this._model.coords;o.caller="model",this._view._elements._handles.forEach((n=>{o.target=n,o.main=r,o.value=this._model.calcValue(n,n.getBoundingClientRect()[t]).value,this.transferData(o,e,s),i=void 0}))}showValue(t){const{direction:e}=this.temp,s=t.getBoundingClientRect()[e],{value:i,target:n}=this._model.calcValue(t,s);this._view.showValue(n,i)}fetchDivs(){const t=this._model._settings.className,e=this._model._settings.orientation;this._view.fetchDivs(e,t)}convertOptions(t){const e={slider:{width:0,height:0},progressBar:{"background-color":""},handle:{"background-color":""},tool:{color:""}};return Object.keys(t).forEach((s=>{if(s.toString().includes("slider")){let i=s.slice(6).toLowerCase();"color"===i&&(i="background-color"),e.slider[i]=t[s],this.pxOptions.includes(i)?e.slider[i]=`${t[s]}px`:e.slider[i]=t[s]}else if(s.toString().includes("progressBar")){let i=s.slice(11).toLowerCase();"color"===i&&(i="background-color"),e.progressBar[i]=t[s],this.pxOptions.includes(i)?e.progressBar[i]=`${t[s]}px`:e.progressBar[i]=t[s]}else if(s.toString().includes("handle")){let i=s.slice(6).toLowerCase();"color"===i&&(i="background-color"),e.handle[i]=t[s],this.pxOptions.includes(i)?e.handle[i]=`${t[s]}px`:e.handle[i]=t[s]}else if(s.toString().includes("tool")){let i=s.slice(4).toLowerCase();"color"===i?i="background-color":"textcolor"===i&&(i="color"),e.tool[i]=t[s],this.pxOptions.includes(i)?e.tool[i]=`${t[s]}px`:e.tool[i]=t[s]}})),e}onMouseDown(){const t=this._view._elements._handles,e=this._view._elements._sliderContainer,s=this._view._elements._slider,i=s.getBoundingClientRect().left,n=s.getBoundingClientRect().top;let l,a,r;this._model.on("coords changed",this.transferData.bind(this)),this._model.on("settings changed",this.renewTemp.bind(this)),t.forEach((t=>{t.ondragstart=()=>!1,t.addEventListener("pointerdown",(t=>{l=this._model._settings.orientation,a=this._model._settings.type,t.preventDefault();const e=t.target,{direction:s,client:o}=this.temp;r=t[o]-e.getBoundingClientRect()[s];const h=e=>{this.transferData({y:e.clientY,x:e.clientX,shift:r,marginLeft:i,clicked:!1,marginTop:n,target:t.target},l,a)},d=t=>{document.removeEventListener("pointermove",h),document.removeEventListener("pointerup",d)};document.addEventListener("pointermove",h),document.addEventListener("pointerup",d)}))})),e.addEventListener("click",(t=>{l=this._model._settings.orientation,a=this._model._settings.type;const e=t.target;if(e.className.includes("jsSlider-clickable")){const s=e.getElementsByClassName("marker-value")[0]||e;this.transferData({y:t.clientY,x:e.getBoundingClientRect().left,value:s.dataset.value,clicked:!0,target:e,marginLeft:i,marginTop:n},l,a)}}))}transferData(t,e,s){const i=Object.assign({},t);"model"!==i.caller?this._model.renew(i,e,s):this._view.refreshCoords(i,e,s)}setValue(t,e){const s=this._view._elements;let i;if(1===e)i=s._handles[0];else if(2===e){if("double"!==this.temp.type)throw new ReferenceError("Can not reference absent handle");i=s._handles[1]}this._model.calcMain(t,i)}determineMetrics(t){let e,s,i,n,l,a;return"horizontal"===t?(e="offsetLeft",s="width",i="left",n="marginLeft",l="clientX",a="offsetWidth"):"vertical"===t&&(e="offsetTop",s="height",i="top",n="marginTop",l="clientY",a="offsetHeight"),{offset:e,offsetLength:a,widthOrHeight:s,direction:i,margin:n,client:l}}getSettings(){return this._model.getSettings()}renewTemp(){Object.keys(this.temp).forEach((t=>{s.call(this._model._settings,t)&&(this.temp[t]=this._model._settings[t])}))}}const a=class{constructor(t){this._view=t.view,this._model=t.model,this.settings=t.settings,this._pres=t.pres}makeSlider(t){const e=this._view._elements,{ori:s,direction:i}=this._pres.temp,n=document.createElement("div");n.classList.add("slider-main");const l=document.createElement("div"),a=document.createElement("div");a.classList.add("slider");const r=document.createElement("div");r.classList.add("slider-range");const o=document.createElement("div");"horizontal"===s?(r.style.width="0px",o.style[i]="0px"):"vertical"===s&&(r.style.height="0px",o.style[i]="0px");const h=document.createElement("div"),d=document.createElement("div");d.className=`tooltipContainer tooltipContainer--${s}`;const c=document.createElement("div");c.className=`tooltipStick tooltipStick--${s}`,d.append(c),this._view._elements._tooltipsSticks.push(c),d.append(h),o.append(d);const m=document.createElement("span");m.className="jsOffset values jsSlider-clickable";const _=document.createElement("span");return _.className="jsOffset values jsSlider-clickable",n.append(m),l.append(a),n.append(l),n.append(_),a.appendChild(r),a.appendChild(o),o.className=`slider-handle slider-handle--${s}`,e._handles.push(o),l.className=`slider-container slider-container--${s}`,h.className=`tooltip tooltip--${s}`,"single"!==t.type&&this.addHandle(o,r,i),m.textContent=String(t.minValue),m.dataset.value=m.textContent,_.textContent=String(t.maxValue),_.dataset.value=_.textContent,m.classList.add(`slider-min--${s}`),_.classList.add(`slider-max--${s}`),n.classList.add(`slider-main--${s}`),{main:n,container:l,slider:a}}makeMarker(t,e){const s=this._pres.temp.ori,i=this._view._elements._handles[0],{margin:n}=this._pres.temp,l=document.createElement("div"),{valuesForMarkers:a,altDrag:r,margin:o}=this.calcPins(t,e),h=a;let d=0;for(let t=0;t<a.length-1;t+=1){const t=document.createElement("div");l.append(t);const e=document.createElement("label");if(e.className=`jsSlider-clickable marker-value marker-value--${s}`,l.classList.add(`slider-marker--${s}`),t.className=`jsOffset marker--major marker--major--${s}`,t.style[n]=o-i.offsetWidth/2+"px",r){const s=h[d];t.dataset.value=s.toString(),e.dataset.value=s.toString(),e.textContent=s.toString(),t.append(e),d+=1}else{const s=h[d];t.dataset.value=s.toString(),e.dataset.value=s.toString(),e.textContent=s.toString(),t.append(e)}}return l.className=`slider-marker slider-marker--${s}`,l}addHandle(t,e,s){let i,n,l;const a=this._view._elements;this._model.setOption("type","double"),t?(i=t,n=e,l=s):(i=a._handles[0],n=a._range);l="horizontal"===this._model.getSettings().orientation?"left":"top";const r=i.cloneNode(!0);r.style[l]="20px";const o=r.getElementsByClassName("tooltipContainer")[0];this._view._elements._tooltipContainers.push(o),i.after(n),n.after(r);const h=this._view.fetchHTMLEl("tooltipStick",!0);a._tooltipsSticks.push(h),a._handles.push(r),this._model._settings.built&&(this._view.rangeInterval(),this._pres.showValue(r))}removeHandle(){const t=this._view._elements;this._model.setOption("type","single");const e=this._pres.temp.ori;"horizontal"===e?t._range.style.left="0px":"vertical"===e&&(t._range.style.top="0px"),t._handles[0].before(t._range),t._handles[1].remove(),t._handles=t._handles.slice(0,1),this._model._settings.built&&this._view.rangeInterval()}calcPins(t,e){let s,i=Math.trunc((t.maxValue-t.minValue)/t.stepSize);e/i<40&&(s=!0,this._model.setOptions({altDrag:s}),i=this._model._settings._minPins);const n=this._model._settings.maxMinDifference,l=this._model._settings.stepSize,a=function(t){if(t>0)return t;throw new Error("can not operate with non-positive numbers")}(Math.round(n/(l*i))),r=[];for(let e=a;e<n/l;e+=a){const s=l*e+t.minValue;r.push(s)}return{valuesForMarkers:r,majorMarkers:i,altDrag:s,margin:e/r.length}}};const r=class{constructor(t,e){this._item=t,this._model=new i(e,t),this._pres=new l(this._model,this._model.getItem()),this._view=new n(this._pres,e,t),this._pres.builder=new a({view:this._view,settings:this._model.getSettings(),model:this._model,pres:this._pres}),this._pres.getView(this._view),this._pres.init(),this._pres.onMouseDown(),this._pres.firstRefresh()}tilt(){"vertical"===this._model.getSettings().orientation?this._model.setOption("orientation","horizontal"):"horizontal"===this._model.getSettings().orientation&&this._model.setOption("orientation","vertical"),this._pres.init(),this._pres.onMouseDown()}scale(t){this._view._elements._scale.style.display=t?"":"none"}bar(t){this._view._elements._range.style.display=t?"":"none"}tip(t){t?this._view._elements._tooltipContainers.forEach((t=>{t.style.display=""})):this._view._elements._tooltipContainers.forEach((t=>{t.style.display="none"}))}range(t){t?"double"!==this._model._settings.type&&(this._model.setOption("type","double"),this._pres.builder.addHandle(),this._pres.onMouseDown()):(this._model.setOption("type","single"),this._pres.builder.removeHandle())}setValue(t,e){this._pres.setValue(t,e)}setLimits(t,e){t&&this._model.setOptions({minValue:t}),e&&this._model.setOptions({maxValue:e}),this._pres.init(),this._pres.onMouseDown()}isRange(){return"double"===this._model._settings.type}setStep(t){this._model.setOption("stepSize",Number(t)),this._pres.init(),this._pres.onMouseDown()}stick(t){t?this._view._elements._tooltipsSticks.forEach((t=>{t.classList.remove("hide")})):this._view._elements._tooltipsSticks.forEach((t=>{t.classList.add("hide")}))}getValue(t){const e=this._view._elements._handles[t-1];return Number(e.dataset.value)}},o=new Map;class h extends ${constructor(t,e){super(),this.tilt=()=>(this.destroy(),this.app.tilt(),this.restore(),this),this.scale=t=>"boolean"!=typeof t?(this.states.scale=!this.states.scale,this.app.scale(this.states.scale),this):(this.states.scale=!this.states.scale,this.app.scale(t),this),this.bar=t=>"boolean"!=typeof t?(this.states.progressBar=!this.states.progressBar,this.app.bar(this.states.progressBar),this):(this.states.progressBar=!this.states.progressBar,this.app.bar(t),this),this.tip=t=>"boolean"!=typeof t?(this.states.tip=!this.states.tip,this.app.tip(this.states.tip),this):(this.states.tip=!this.states.tip,this.app.tip(t),this),this.range=t=>"boolean"!=typeof t?(this.states.range=!this.states.range,this.app.range(this.states.range),this):(this.states.range=!this.states.range,this.app.range(t),this),this.setValue=(t,e)=>(this.app.setValue(t,e),this),this.setLimits=(t,e)=>(this.destroy(),this.app.setLimits(t,e),this.restore(),this),this.isRange=()=>this.app.isRange(),this.setStep=t=>(this.destroy(),this.app.setStep(t),this.restore(),this),this.stick=t=>(this.app.stick(t),this),this.destroy=()=>{this.$item.data("handle1",this.app.getValue(1)),this.isRange()&&this.$item.data("handle2",this.app.getValue(2)),this.$item.html("")},this.restore=()=>0===Object.keys(this.$item.data()).length?this.$item:(this.setValue(this.$item.data("handle1"),1),this.isRange()&&this.setValue(this.$item.data("handle2"),2),!1),this.item=t,this.states={progressBar:"none"!==e._view._elements._range.style.display,range:e.isRange(),orientation:e._model.getSetting("orientation"),scale:e._model.getSetting("marker"),tip:e._model.getSetting("toolTip"),stick:"none"!==e._view._elements._tooltipsSticks[0].style.display},this.app=e,this.$item=$(t)}}$.fn.slider=function(t){const e=new r(this[0],t);return o.set(this[0],{plugin:$(this),app:e}),new h(this[0],e)}})();
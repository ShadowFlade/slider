<<<<<<< HEAD
(()=>{"use strict";const t=class{on(t,e){this._eventHandlers||(this._eventHandlers={}),this._eventHandlers[t]||(this._eventHandlers[t]=[]),this._eventHandlers[t].push(e)}off(t,e){const s=this._eventHandlers&&this._eventHandlers[t];if(s)for(let t=0;t<s.length;t++)s[t]===e&&s.splice(t--,1)}trigger(t,...e){let s;if(this._eventHandlers&&this._eventHandlers[t])return this._eventHandlers[t].forEach((t=>{const i=t.call(this,...e);return s=i,i})),s}};function e(t,e){return Math.trunc(t/e)}const s=Object.prototype.hasOwnProperty;class i extends t{constructor(t,e){super(),this.interval=new Map,this.coords={main:0,prevMain:0,value:1,prevValue:0,caller:"",clicked:!1,altDrag:!0,target:null,mainMax:0},this.temp={},this._settings={className:"slider",orientation:"horizontal",type:"double",stepSize:90,pxPerValue:0,valuePerPx:1,marginLeft:0,marginTop:0,maxValue:1360,minValue:0,maxMinDifference:0,betweenMarkers:40,_minPins:5,mainMax:200,mainMin:0,startPos1:0,startPos2:100,startValue1:810,startValue2:0,valueWidth:0,toolTip:!0,marker:!0,altDrag:!1,built:!1,styles:{progressBarColor:"green",sliderColor:"red",handleColor:"",sliderWidth:200,sliderHeight:5,toolTextColor:"green"}},this._item=e,this.initOptions(t)}initOptions(t={}){Object.keys(t).forEach((e=>{this._settings.styles.hasOwnProperty(e)?this._settings.styles[e]=t[e]:this.temp.hasOwnProperty(e)?this.temp[e]=t[e]:this._settings[e]=t[e]})),this.correctOptions()}correctOptions(){this.coords.altDrag=this._settings.altDrag,this.coords.mainMax=this._settings.mainMax,this._settings.maxMinDifference=this._settings.maxValue-this._settings.minValue;const t=this._settings.maxMinDifference;"horizontal"===this._settings.orientation?this._settings.valuePerPx=t/this._settings.mainMax:"vertical"===this._settings.orientation&&(this._settings.valuePerPx=t/this._settings.styles.sliderHeight),this._settings.pxPerValue=this._settings.mainMax/(t/this._settings.stepSize),this.validateOptions()}validateOptions(){("vertical"===this._settings.orientation&&this._settings.styles.sliderWidth>this._settings.styles.sliderHeight||"horizontal"===this._settings.orientation&&this._settings.styles.sliderWidth<this._settings.styles.sliderHeight)&&([this._settings.styles.sliderWidth,this._settings.styles.sliderHeight]=[this._settings.styles.sliderHeight,this._settings.styles.sliderWidth]),this._settings.maxValue<this._settings.minValue&&([this._settings.maxValue,this._settings.minValue]=[this._settings.minValue,this._settings.maxValue])}validate(t){const e=Object.assign({},t),s=this._settings.mainMax,i=this._settings.mainMin,n=this._settings.maxValue,l=this._settings.minValue;return e.main>=s?e.main=s:e.main<=i&&(e.main=i),e.value>n?e.value=n:e.value<l&&(e.value=l),e}renew(t,s,i){const n=this._settings.pxPerValue;let l=0,a=0;if("vertical"===this._settings.orientation?(l=t.y,a=t.marginTop):"horizontal"===this._settings.orientation&&(l=t.x,a=this._settings.marginLeft),this.coords.caller="model",Object.keys(t).forEach((e=>{this.coords[e]=t[e]})),t.clicked){this.coords.main=l-a;const t=this.validate(this.coords);if(t)return this.trigger("coords changed",t,s,i),t}this.coords.main=l-a,this.coords.value=e(this.coords.main,n)*this._settings.stepSize+this._settings.minValue;const r=this.validate(this.coords);return this.coords.prevMain=this.coords.main,!!r&&(this.trigger("coords changed",r,s,i),r)}calcValue(t,s){let i;"horizontal"===this._settings.orientation?i="marginLeft":"vertical"===this._settings.orientation&&(i="marginTop");return{value:e(s-this._settings[i],this._settings.pxPerValue)*this._settings.stepSize,target:t}}calcMain(t,e){let s,i;s="horizontal"==this._settings.orientation?"sliderWidth":"sliderHeight",i=(t-this._settings.minValue)%this._settings.stepSize==0?t:this._settings.stepSize*Math.round((t-this._settings.minValue)/this._settings.stepSize)+this._settings.minValue;const n=i*this._settings.styles[s]/this._settings.maxMinDifference;this.coords.main=n,this.coords.value=i,this.coords.target=e,this.coords.caller="model";const l=this.validate(this.coords);this.trigger("coords changed",l,this._settings.orientation,this._settings.type)}setOption(t,e){s.call(this._settings,t)&&(this._settings[t]=e,this.trigger("settings changed"))}setOptions(t){this.initOptions(t),this.correctOptions(),this.trigger("settings changed")}getStyles(){return this._settings.styles}getStyle(t){return this._settings.styles[t]}getSetting(t){return this._settings[t]}getSettings(){return this._settings}getItem(){return this._item}}const n=class extends t{constructor(t,e,s){super(),this._elements={_slider:null,_sliderMain:null,_sliderContainer:null,_scale:null,_range:null,_tooltipContainers:[],_handles:[],_tooltips:[],_tooltipsSticks:[],_pins:[]},this._pres=t,this._item=s}implementStyles(t,e){this.initiateOptions(t);if(this._elements._tooltips[0].getBoundingClientRect().left<0){this._elements._sliderContainer.classList.add("slider-container--vertical--corrected");this.fetchHTMLEl("slider-min--vertical",!0).style.left="10px",this._elements._tooltipContainers.forEach((t=>{t.classList.add("tooltipContainer--vertical--corrected")}))}return this.fetchHTMLEl("values",!1).forEach((t=>{t.classList.add("values--corrected")})),{slider:this._elements._slider,range:this._elements._range,handles:this._elements._handles,wrapper:this._elements._sliderMain}}renderElement(t,e=this._item){e.append(t)}getOffsetsAndLimits(t){const{offsetLength:e}=this.temp;return{mainMax:this._elements._sliderMain[e]-this._elements._handles[0][e]/2,mainMin:this._elements._handles[0][e]/2,marginTop:this._elements._slider.getBoundingClientRect().top,marginLeft:this._elements._slider.getBoundingClientRect().left}}fetchHTMLEl(t,e,s=this._item){const i=[...s.querySelectorAll(`.${t}`)];return e?i[0]:i}fetchDivs(t,e){this._elements._sliderMain=this.fetchHTMLEl(`${e}-main`,!0),this._elements._slider=this.fetchHTMLEl(e,!0),this._elements._range=this.fetchHTMLEl(`${e}-range`,!0),this._elements._handles=this.fetchHTMLEl(`${e}-handle--${t}`,!1),this._elements._tooltips=this.fetchHTMLEl("tooltip",!1),this._elements._sliderContainer=this.fetchHTMLEl(`${e}-container`,!0),this._elements._scale=this.fetchHTMLEl(`${e}-marker`,!0),this._elements._tooltipContainers=this.fetchHTMLEl("tooltipContainer",!1),this._elements._pins=this.fetchHTMLEl("jsSlider-clickable",!1);const s=Array.from(this._item.getElementsByClassName("jsSlider-clickable")).map((t=>({div:t,value:t.textContent})));this.divsContainingValues=s,this.valuesFromDivs=s.map((t=>t.value));const{offset:i}=this.temp,n=Array.from(this._item.getElementsByClassName("jsOffset")).map((t=>({div:t,offset:t[i]}))),l=n.map((t=>t.offset));this.pinsCoordinatesItems=n,this.pinsCoordinates=l}initiateOptions(t){Object.keys(t).forEach((e=>{"object"==typeof t[e]&&Object.entries(t[e]).forEach((([t,s])=>{e.toString().includes("slider")?this._elements._slider.style[t]=s:e.toString().includes("progressBar")?this._elements._range.style[t]=s:e.toString().includes("markUp")?this._elements._slider.style[t]=s:e.toString().includes("handle")?this._elements._handles.forEach((e=>{e.style[t]=s})):e.toString().includes("tool")&&this._elements._tooltips.forEach((e=>{e.style[t]=s}))}))}))}refreshCoords(t,e,s){const i=t.clicked,n=t.altDrag;let l,a,r,o=t.value;const{widthOrHeight:h,direction:d}=this.temp;"single"===s?r=this._elements._handles[0]:"double"===s&&(r=t.target);const c=this._elements._range,m=this.fetchHTMLEl("tooltip",!0,r),_=Object.assign({},t);if(i)a=this.reactOnClick(_,e,s),l=a.newLeft;else if(n)a=this.reactOnDrag(_),l=a.newLeft;else{const{newLeft:t,value:e}=this.pinnedDrag(_);l=t,o=e}r.style[d]=l+"px","double"===s?this.rangeInterval():c.style[h]=l+r.offsetWidth/2+"px",i||(r.dataset.value=o,o=function(t){let e;return e=t.toString().length>3?(t/1e3).toFixed(1)+"k":String(t),e}(o),m.textContent=o)}reactOnDrag(t){let e;const s=t.shift||0;const{widthOrHeight:i}=this.temp,n=t.target,l=this._elements._range;0===t.value&&(l.style[i]="0");return t.altDrag?e=t.main-s:e+=n.offsetWidth/2,{newLeft:e,value:undefined}}pinnedDrag(t){let e;const s=this._elements._handles[0].offsetWidth;let{direction:i,margin:n}=this.temp;n=t[n];const l=this.matchHandleAndPin(t.main),a=Number(l.dataset.value);return e=l.getBoundingClientRect()[i]-n-s/2,l.className.includes("slider-min")?e=0:l.className.includes("slider-max")&&(e=t.mainMax-s/2),{newLeft:e,value:a}}reactOnClick(t,e,s){if("double"===s)return!1;const i=this._elements._handles[0],n=i.offsetWidth,l=t.target.parentElement,a=this.valuesFromDivs,r=this._elements._tooltips[0],{widthOrHeight:o,direction:h,margin:d}=this.temp,c=l.getBoundingClientRect()[h]-t[d]-n/2;return i.style[h]=c+"px",this._elements._range.style[o]=c+"px",r.textContent=t.value,a.includes(t.value)&&this.divsContainingValues.forEach((e=>{const s=e;s.value===t.value&&(this.divsContainingValues.forEach((()=>{e.div.style.color=""})),s.div.style.color=String(this.temp.pinTextColor))})),{newLeft:c,pin:l}}rangeInterval(){const t=this._elements._handles[0],e=this._elements._handles[1],{widthOrHeight:s,direction:i}=this.temp,n=parseFloat(t.style[i]);let l;l=e?parseFloat(e.style[i]):null;const a=Math.abs(n-l),r=Math.min(n,l);this._elements._range.style[i]=r+"px",this._elements._range.style[s]=a+t.offsetWidth/2+"px"}showValue(t,e){const s=t.getElementsByClassName("tooltip")[0];t.dataset.value=String(Math.abs(e)),s.textContent=String(Math.abs(e))}matchHandleAndPin(t){const e=this.pinsCoordinatesItems,s=this.pinsCoordinates;let i,n,l=1/0;return s.forEach((e=>{const s=Math.abs(t-Number(e));s<l&&(l=s,i=Number(e))})),e.forEach((t=>{const e=t;return i===e.offset&&(n=e.div,n)})),n}};class l extends t{constructor(t,e){super(),this.pxOptions=["height","width"],this._model=t,this._item=e}getView(t){this._view=t}init(){this._model.validateOptions();const t=this._model.getSetting("orientation");let e;this.temp=this.determineMetrics(t),this.temp.ori=this._model._settings.orientation,this.temp.type=this._model._settings.type,this._model.temp=this.temp,this._view.temp=this.temp,"horizontal"===t?e=this._model.getStyle("sliderWidth"):"vertical"==t&&(e=this._model.getStyle("sliderHeight"));const s=this.convertOptions(this._model.getStyles()),i=this._model.getSettings(),{main:n,container:l}=this.builder.makeSlider(i);if(this._view.renderElement(n),i.marker){const t=this.builder.makeMarker(i,e);l.appendChild(t)}this.fetchDivs(),this._view.implementStyles(s,this._model._settings.orientation),this._model.setOptions(this._view.getOffsetsAndLimits(t)),this._model.setOption("built",!0),this._view.rangeInterval()}firstRefresh(){const{direction:t,ori:e,type:s}=this.temp;let i=this._model._settings.startPos1;const n=this._model._settings.startPos2,l=this._model._settings.startValue1,a=this._model._settings.startValue2;if(0!==l||0!==a)return this.setValue(l,1),void("double"===s&&this.setValue(a,2));const r=i||n,o=this._model.coords;o.caller="model",this._view._elements._handles.forEach((n=>{o.target=n,o.main=r,o.value=this._model.calcValue(n,n.getBoundingClientRect()[t]).value,this.transferData(o,e,s),i=void 0}))}showValue(t){const{direction:e}=this.temp,s=t.getBoundingClientRect()[e],{value:i,target:n}=this._model.calcValue(t,s);this._view.showValue(n,i)}fetchDivs(){const t=this._model._settings.className,e=this._model._settings.orientation;this._view.fetchDivs(e,t)}convertOptions(t){const e={slider:{width:0,height:0},progressBar:{"background-color":""},handle:{"background-color":""},tool:{color:""}};return Object.keys(t).forEach((s=>{if(s.toString().includes("slider")){let i=s.slice(6).toLowerCase();"color"===i&&(i="background-color"),e.slider[i]=t[s],this.pxOptions.includes(i)?e.slider[i]=`${t[s]}px`:e.slider[i]=t[s]}else if(s.toString().includes("progressBar")){let i=s.slice(11).toLowerCase();"color"===i&&(i="background-color"),e.progressBar[i]=t[s],this.pxOptions.includes(i)?e.progressBar[i]=`${t[s]}px`:e.progressBar[i]=t[s]}else if(s.toString().includes("handle")){let i=s.slice(6).toLowerCase();"color"===i&&(i="background-color"),e.handle[i]=t[s],this.pxOptions.includes(i)?e.handle[i]=`${t[s]}px`:e.handle[i]=t[s]}else if(s.toString().includes("tool")){let i=s.slice(4).toLowerCase();"color"===i?i="background-color":"textcolor"===i&&(i="color"),e.tool[i]=t[s],this.pxOptions.includes(i)?e.tool[i]=`${t[s]}px`:e.tool[i]=t[s]}})),e}onMouseDown(){const t=this._view._elements._handles,e=this._view._elements._sliderContainer,s=this._view._elements._slider,i=s.getBoundingClientRect().left,n=s.getBoundingClientRect().top;let l,a,r;this._model.on("coords changed",this.transferData.bind(this)),this._model.on("settings changed",this.renewTemp.bind(this)),t.forEach((t=>{t.ondragstart=()=>!1,t.addEventListener("pointerdown",(e=>{l=this._model._settings.orientation,a=this._model._settings.type,e.preventDefault();const s=e.target,{direction:o,client:h}=this.temp;r=e[h]-s.getBoundingClientRect()[o];const d=e=>{e.target===t&&this.transferData({y:e.clientY,x:e.clientX,shift:r,marginLeft:i,clicked:!1,marginTop:n,target:e.target},l,a)},c=t=>{document.removeEventListener("pointermove",d),document.removeEventListener("pointerup",c)};document.addEventListener("pointermove",d),document.addEventListener("pointerup",c)}))})),e.addEventListener("click",(t=>{l=this._model._settings.orientation,a=this._model._settings.type;const e=t.target;if(e.className.includes("jsSlider-clickable")){const s=e.getElementsByClassName("marker-value")[0]||e;this.transferData({y:t.clientY,x:e.getBoundingClientRect().left,value:s.dataset.value,clicked:!0,target:e,marginLeft:i,marginTop:n},l,a)}}))}transferData(t,e,s){const i=Object.assign({},t);"model"!==i.caller?this._model.renew(i,e,s):this._view.refreshCoords(i,e,s)}setValue(t,e){const s=this._view._elements;let i;if(1===e)i=s._handles[0];else if(2===e){if("double"!==this.temp.type)throw new ReferenceError("Can not reference absent handle");i=s._handles[1]}this._model.calcMain(t,i)}determineMetrics(t){let e,s,i,n,l,a;return"horizontal"===t?(e="offsetLeft",s="width",i="left",n="marginLeft",l="clientX",a="offsetWidth"):"vertical"===t&&(e="offsetTop",s="height",i="top",n="marginTop",l="clientY",a="offsetHeight"),{offset:e,offsetLength:a,widthOrHeight:s,direction:i,margin:n,client:l}}getSettings(){return this._model.getSettings()}renewTemp(){Object.keys(this.temp).forEach((t=>{s.call(this._model._settings,t)&&(this.temp[t]=this._model._settings[t])}))}}const a=class{constructor(t){this._view=t.view,this._model=t.model,this.settings=t.settings,this._pres=t.pres}makeSlider(t){const e=this._view._elements,{ori:s,direction:i}=this._pres.temp,n=document.createElement("div");n.classList.add("slider-main");const l=document.createElement("div"),a=document.createElement("div");a.classList.add("slider");const r=document.createElement("div");r.classList.add("slider-range");const o=document.createElement("div");"horizontal"===s?(r.style.width="0px",o.style[i]="0px"):"vertical"===s&&(r.style.height="0px",o.style[i]="0px");const h=document.createElement("div"),d=document.createElement("div");d.className=`tooltipContainer tooltipContainer--${s}`;const c=document.createElement("div");c.className=`tooltipStick tooltipStick--${s}`,d.append(c),this._view._elements._tooltipsSticks.push(c),d.append(h),o.append(d);const m=document.createElement("span");m.className="jsOffset values jsSlider-clickable";const _=document.createElement("span");return _.className="jsOffset values jsSlider-clickable",n.append(m),l.append(a),n.append(l),n.append(_),a.appendChild(r),a.appendChild(o),o.className=`slider-handle slider-handle--${s}`,e._handles.push(o),l.className=`slider-container slider-container--${s}`,h.className=`tooltip tooltip--${s}`,"single"!==t.type&&this.addHandle(o,r,i),m.textContent=String(t.minValue),m.dataset.value=m.textContent,_.textContent=String(t.maxValue),_.dataset.value=_.textContent,m.classList.add(`slider-min--${s}`),_.classList.add(`slider-max--${s}`),n.classList.add(`slider-main--${s}`),{main:n,container:l,slider:a}}makeMarker(t,e){const s=this._pres.temp.ori,i=this._view._elements._handles[0],{margin:n}=this._pres.temp,l=document.createElement("div"),{valuesForMarkers:a,altDrag:r,margin:o}=this.calcPins(t,e),h=a;let d=0;for(let t=0;t<a.length-1;t+=1){const t=document.createElement("div");l.append(t);const e=document.createElement("label");if(e.className=`jsSlider-clickable marker-value marker-value--${s}`,l.classList.add(`slider-marker--${s}`),t.className=`jsOffset marker--major marker--major--${s}`,t.style[n]=o-i.offsetWidth/2+"px",r){const s=h[d];t.dataset.value=s.toString(),e.dataset.value=s.toString(),e.textContent=s.toString(),t.append(e),d+=1}else{const s=h[d];t.dataset.value=s.toString(),e.dataset.value=s.toString(),e.textContent=s.toString(),t.append(e)}}return l.className=`slider-marker slider-marker--${s}`,l}addHandle(t,e,s){let i,n,l;const a=this._view._elements;this._model.setOption("type","double"),t?(i=t,n=e,l=s):(i=a._handles[0],n=a._range);l="horizontal"===this._model.getSettings().orientation?"left":"top";const r=i.cloneNode(!0);r.style[l]="20px";const o=r.getElementsByClassName("tooltipContainer")[0];this._view._elements._tooltipContainers.push(o),i.after(n),n.after(r);const h=this._view.fetchHTMLEl("tooltipStick",!0);a._tooltipsSticks.push(h),a._handles.push(r),this._model._settings.built&&(this._view.rangeInterval(),this._pres.showValue(r))}removeHandle(){const t=this._view._elements;this._model.setOption("type","single");const e=this._pres.temp.ori;"horizontal"===e?t._range.style.left="0px":"vertical"===e&&(t._range.style.top="0px"),t._handles[0].before(t._range),t._handles[1].remove(),t._handles=t._handles.slice(0,1),this._model._settings.built&&this._view.rangeInterval()}calcPins(t,e){let s,i=Math.trunc((t.maxValue-t.minValue)/t.stepSize);e/i<40&&(s=!0,this._model.setOptions({altDrag:s}),i=this._model._settings._minPins);const n=this._model._settings.maxMinDifference,l=this._model._settings.stepSize,a=function(t){if(t>0)return t;throw new Error("can not operate with non-positive numbers")}(Math.round(n/(l*i))),r=[];for(let e=a;e<n/l;e+=a){const s=l*e+t.minValue;r.push(s)}return{valuesForMarkers:r,majorMarkers:i,altDrag:s,margin:e/r.length}}};const r=class{constructor(t,e){this._item=t,this._model=new i(e,t),this._pres=new l(this._model,this._model.getItem()),this._view=new n(this._pres,e,t),this._pres.builder=new a({view:this._view,settings:this._model.getSettings(),model:this._model,pres:this._pres}),this._pres.getView(this._view),this._pres.init(),this._pres.onMouseDown(),this._pres.firstRefresh()}tilt(){"vertical"===this._model.getSettings().orientation?this._model.setOption("orientation","horizontal"):"horizontal"===this._model.getSettings().orientation&&this._model.setOption("orientation","vertical"),this._pres.init(),this._pres.onMouseDown()}scale(t){this._view._elements._scale.style.display=t?"":"none"}bar(t){this._view._elements._range.style.display=t?"":"none"}tip(t){t?this._view._elements._tooltipContainers.forEach((t=>{t.style.display=""})):this._view._elements._tooltipContainers.forEach((t=>{t.style.display="none"}))}range(t){t?"double"!==this._model._settings.type&&(this._model.setOption("type","double"),this._pres.builder.addHandle(),this._pres.onMouseDown()):(this._model.setOption("type","single"),this._pres.builder.removeHandle())}setValue(t,e){this._pres.setValue(t,e)}setLimits(t,e){t&&this._model.setOptions({minValue:t}),e&&this._model.setOptions({maxValue:e}),this._pres.init(),this._pres.onMouseDown()}isRange(){return"double"===this._model._settings.type}setStep(t){this._model.setOption("stepSize",Number(t)),this._pres.init(),this._pres.onMouseDown()}stick(t){t?this._view._elements._tooltipsSticks.forEach((t=>{t.classList.remove("hide")})):this._view._elements._tooltipsSticks.forEach((t=>{t.classList.add("hide")}))}getValue(t){const e=this._view._elements._handles[t-1];return Number(e.dataset.value)}},o=new Map;class h extends ${constructor(t,e){super(),this.tilt=()=>(this.destroy(),this.app.tilt(),this.restore(),this),this.scale=t=>"boolean"!=typeof t?(this.states.scale=!this.states.scale,this.app.scale(this.states.scale),this):(this.states.scale=!this.states.scale,this.app.scale(t),this),this.bar=t=>"boolean"!=typeof t?(this.states.progressBar=!this.states.progressBar,this.app.bar(this.states.progressBar),this):(this.states.progressBar=!this.states.progressBar,this.app.bar(t),this),this.tip=t=>"boolean"!=typeof t?(this.states.tip=!this.states.tip,this.app.tip(this.states.tip),this):(this.states.tip=!this.states.tip,this.app.tip(t),this),this.range=t=>"boolean"!=typeof t?(this.states.range=!this.states.range,this.app.range(this.states.range),this):(this.states.range=!this.states.range,this.app.range(t),this),this.setValue=(t,e)=>(this.app.setValue(t,e),this),this.setLimits=(t,e)=>(this.destroy(),this.app.setLimits(t,e),this.restore(),this),this.isRange=()=>this.app.isRange(),this.setStep=t=>(this.destroy(),this.app.setStep(t),this.restore(),this),this.stick=t=>(this.app.stick(t),this),this.destroy=()=>{this.$item.data("handle1",this.app.getValue(1)),this.isRange()&&this.$item.data("handle2",this.app.getValue(2)),this.$item.html("")},this.restore=()=>0===Object.keys(this.$item.data()).length?this.$item:(this.setValue(this.$item.data("handle1"),1),this.isRange()&&this.setValue(this.$item.data("handle2"),2),!1),this.item=t,this.states={progressBar:"none"!==e._view._elements._range.style.display,range:e.isRange(),orientation:e._model.getSetting("orientation"),scale:e._model.getSetting("marker"),tip:e._model.getSetting("toolTip"),stick:"none"!==e._view._elements._tooltipsSticks[0].style.display},this.app=e,this.$item=$(t)}}$.fn.slider=function(t){const e=new r(this[0],t);return o.set(this[0],{plugin:$(this),app:e}),new h(this[0],e)}})();
=======
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./ts-src/style.scss":
/*!***************************!*\
  !*** ./ts-src/style.scss ***!
  \***************************/
/***/ (() => {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./ts-src/app.ts":
/*!***********************!*\
  !*** ./ts-src/app.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _model__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./model */ "./ts-src/model.ts");
/* harmony import */ var _view__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./view */ "./ts-src/view.ts");
/* harmony import */ var _pres__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./pres */ "./ts-src/pres.ts");
/* harmony import */ var _presBuilder__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./presBuilder */ "./ts-src/presBuilder.ts");
// import * as $ from 'jquery'




class App {
    constructor(item, options) {
        this._item = item;
        this._model = new _model__WEBPACK_IMPORTED_MODULE_0__.Model(options, item);
        this._pres = new _pres__WEBPACK_IMPORTED_MODULE_2__.Pres(this._model, this._model.getItem());
        this._view = new _view__WEBPACK_IMPORTED_MODULE_1__.default(this._pres, options, item);
        this._pres.builder = new _presBuilder__WEBPACK_IMPORTED_MODULE_3__.default({
            view: this._view,
            settings: this._model.getSettings(),
            model: this._model,
            pres: this._pres,
        });
        this._pres.getView(this._view);
        this._pres.init();
        this._pres.onMouseDown();
        this._pres.firstRefresh();
    }
    tilt() {
        if (this._model.getSettings().orientation === 'vertical') {
            this._model.setOption('orientation', 'horizontal');
            // this.states.ori
        }
        else if (this._model.getSettings().orientation === 'horizontal') {
            this._model.setOption('orientation', 'vertical');
        }
        this._pres.init();
        this._pres.onMouseDown();
    }
    scale(option) {
        if (!option) {
            this._view._elements._scale.style.display = 'none';
        }
        else {
            this._view._elements._scale.style.display = '';
        }
    }
    bar(option) {
        if (!option) {
            this._view._elements._range.style.display = 'none';
        }
        else {
            this._view._elements._range.style.display = '';
        }
    }
    tip(option) {
        if (!option) {
            this._view._elements._tooltipContainers.forEach((item) => {
                // eslint-disable-next-line no-param-reassign
                item.style.display = 'none';
            });
        }
        else {
            this._view._elements._tooltipContainers.forEach((item) => {
                // eslint-disable-next-line no-param-reassign
                item.style.display = '';
            });
        }
    }
    range(option) {
        if (option) {
            if (this._model._settings.type !== 'double') {
                this._model.setOption('type', 'double');
                this._pres.builder.addHandle();
                this._pres.onMouseDown();
            }
        }
        else {
            this._model.setOption('type', 'single');
            this._pres.builder.removeHandle();
        }
    }
    setValue(value, target) {
        this._pres.setValue(value, target);
    }
    setLimits(min, max) {
        if (min) {
            this._model.setOptions({
                minValue: min,
            });
        }
        if (max) {
            this._model.setOptions({
                maxValue: max,
            });
        }
        this._pres.init();
        this._pres.onMouseDown();
    }
    isRange() {
        if (this._model._settings.type === 'double') {
            return true;
        }
        return false;
    }
    setStep(step) {
        this._model.setOption('stepSize', Number(step));
        this._pres.init();
        this._pres.onMouseDown();
    }
    stick(option) {
        if (!option) {
            this._view._elements._tooltipsSticks.forEach((stick) => {
                stick.classList.add('hide');
            });
        }
        else {
            this._view._elements._tooltipsSticks.forEach((stick) => {
                stick.classList.remove('hide');
            });
        }
    }
    getValue(numbOfHandle) {
        const handle = this._view._elements._handles[numbOfHandle - 1];
        const value = Number(handle.dataset.value);
        return value;
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (App);


/***/ }),

/***/ "./ts-src/eventemitter.ts":
/*!********************************!*\
  !*** ./ts-src/eventemitter.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class EventMixin {
    on(eventName, handler) {
        if (!this._eventHandlers)
            this._eventHandlers = {};
        if (!this._eventHandlers[eventName]) {
            this._eventHandlers[eventName] = [];
        }
        this._eventHandlers[eventName].push(handler);
    }
    off(eventName, handler) {
        const handlers = this._eventHandlers && this._eventHandlers[eventName];
        if (!handlers)
            return;
        for (let i = 0; i < handlers.length; i++) {
            if (handlers[i] === handler) {
                handlers.splice(i--, 1);
            }
        }
    }
    // unsubscribe(eventName, callback) {
    //   this.events[eventName] = this.events[eventName].filter(eventCallback => callback !== eventCallback);
    // }
    trigger(eventName, ...args) {
        let x;
        if (!this._eventHandlers || !this._eventHandlers[eventName]) {
            return;
        }
        this._eventHandlers[eventName].forEach((handler) => {
            const result = handler.call(this, ...args);
            x = result;
            return result;
        });
        return x;
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (EventMixin);


/***/ }),

/***/ "./ts-src/model.ts":
/*!*************************!*\
  !*** ./ts-src/model.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Model": () => (/* binding */ Model),
/* harmony export */   "has": () => (/* binding */ has)
/* harmony export */ });
/* harmony import */ var _eventemitter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./eventemitter */ "./ts-src/eventemitter.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ "./ts-src/utils.ts");


const has = Object.prototype.hasOwnProperty;
class Model extends _eventemitter__WEBPACK_IMPORTED_MODULE_0__.default {
    constructor(options, item) {
        super();
        this.interval = new Map();
        this.coords = {
            main: 0,
            prevMain: 0,
            value: 1,
            prevValue: 0,
            caller: '',
            clicked: false,
            altDrag: true,
            target: null,
            mainMax: 0,
        };
        this.temp = {};
        this._settings = {
            className: 'slider',
            orientation: 'horizontal',
            type: 'double',
            stepSize: 90,
            pxPerValue: 0,
            valuePerPx: 1,
            marginLeft: 0,
            marginTop: 0,
            maxValue: 1360,
            minValue: 0,
            maxMinDifference: 0,
            betweenMarkers: 40,
            _minPins: 5,
            mainMax: 200,
            mainMin: 0,
            startPos1: 0,
            startPos2: 100,
            startValue1: 810,
            startValue2: 0,
            valueWidth: 0,
            toolTip: true,
            marker: true,
            altDrag: false,
            built: false,
            styles: {
                progressBarColor: 'green',
                sliderColor: 'red',
                handleColor: '',
                sliderWidth: 200,
                sliderHeight: 5,
                toolTextColor: 'green',
            },
        };
        this._item = item;
        this.initOptions(options);
    }
    initOptions(options = {}) {
        Object.keys(options).forEach((key) => {
            if (this._settings.styles.hasOwnProperty(key)) {
                this._settings.styles[key] = options[key];
            }
            else if (this.temp.hasOwnProperty(key)) {
                this.temp[key] = options[key];
            }
            else {
                this._settings[key] = options[key];
            }
        });
        this.correctOptions();
    }
    correctOptions() {
        this.coords.altDrag = this._settings.altDrag;
        this.coords.mainMax = this._settings.mainMax;
        this._settings.maxMinDifference =
            this._settings.maxValue - this._settings.minValue;
        const diff = this._settings.maxMinDifference;
        if (this._settings.orientation === 'horizontal') {
            this._settings.valuePerPx = diff / this._settings.mainMax;
        }
        else if (this._settings.orientation === 'vertical') {
            this._settings.valuePerPx = diff / this._settings.styles.sliderHeight;
        }
        this._settings.pxPerValue =
            this._settings.mainMax / (diff / this._settings.stepSize);
        this.validateOptions();
    }
    validateOptions() {
        // fixing user's mistake in input/contradictions in input
        if (this._settings.orientation === 'vertical' &&
            this._settings.styles.sliderWidth > this._settings.styles.sliderHeight) {
            [this._settings.styles.sliderWidth, this._settings.styles.sliderHeight] =
                [this._settings.styles.sliderHeight, this._settings.styles.sliderWidth];
        }
        else if (this._settings.orientation === 'horizontal' &&
            this._settings.styles.sliderWidth < this._settings.styles.sliderHeight) {
            [this._settings.styles.sliderWidth, this._settings.styles.sliderHeight] =
                [this._settings.styles.sliderHeight, this._settings.styles.sliderWidth];
        }
        if (this._settings.maxValue < this._settings.minValue) {
            [this._settings.maxValue, this._settings.minValue] = [
                this._settings.minValue,
                this._settings.maxValue,
            ];
        }
    }
    validate(data) {
        const dataFroValidation = Object.assign({}, data);
        const max = this._settings.mainMax;
        const min = this._settings.mainMin;
        const maxValue = this._settings.maxValue;
        const minValue = this._settings.minValue;
        if (dataFroValidation.main >= max) {
            dataFroValidation.main = max;
        }
        else if (dataFroValidation.main <= min) {
            dataFroValidation.main = min;
        }
        if (dataFroValidation.value > maxValue) {
            dataFroValidation.value = maxValue;
        }
        else if (dataFroValidation.value < minValue) {
            dataFroValidation.value = minValue;
        }
        return dataFroValidation;
    }
    renew(data, ori, type) {
        const pxPerValue = this._settings.pxPerValue;
        let axis = 0;
        let margin = 0;
        if (this._settings.orientation === 'vertical') {
            axis = data.y;
            margin = data.marginTop; // if it was mode.settings.marginTop it would be wrong
        }
        else if (this._settings.orientation === 'horizontal') {
            axis = data.x;
            margin = this._settings.marginLeft;
        }
        this.coords.caller = 'model'; // TODO this shouldnt be here,have to think of a better way
        Object.keys(data).forEach((i) => {
            this.coords[i] = data[i];
        });
        if (data.clicked) {
            this.coords.main = axis - margin;
            const validatedCoords = this.validate(this.coords);
            if (validatedCoords) {
                this.trigger('coords changed', validatedCoords, ori, type);
                return validatedCoords;
            }
        }
        this.coords.main = axis - margin;
        this.coords.value =
            (0,_utils__WEBPACK_IMPORTED_MODULE_1__.divisionFloor)(this.coords.main, pxPerValue) * this._settings.stepSize +
                this._settings.minValue;
        const validatedCoords = this.validate(this.coords);
        this.coords.prevMain = this.coords.main;
        if (validatedCoords) {
            this.trigger('coords changed', validatedCoords, ori, type);
            return validatedCoords;
        }
        return false;
    }
    calcValue(target, offset) {
        let margin;
        if (this._settings.orientation === 'horizontal') {
            margin = 'marginLeft';
        }
        else if (this._settings.orientation === 'vertical') {
            margin = 'marginTop';
        }
        const value = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.divisionFloor)(offset - this._settings[margin], this._settings.pxPerValue) * this._settings.stepSize;
        return {
            value: value,
            target: target,
        };
    }
    calcMain(value, target) {
        let widthOrHeight;
        if (this._settings.orientation == 'horizontal') {
            widthOrHeight = 'sliderWidth';
        }
        else {
            widthOrHeight = 'sliderHeight';
        }
        let nValue;
        if ((value - this._settings.minValue) % this._settings.stepSize === 0) {
            nValue = value;
        }
        else {
            nValue =
                this._settings.stepSize *
                    Math.round((value - this._settings.minValue) / this._settings.stepSize) +
                    this._settings.minValue;
        }
        const main = (nValue * this._settings.styles[widthOrHeight]) /
            this._settings.maxMinDifference;
        this.coords.main = main;
        this.coords.value = nValue;
        this.coords.target = target;
        this.coords.caller = 'model';
        const validatedCoords = this.validate(this.coords);
        // it should not do that(single responsability principle)
        this.trigger('coords changed', validatedCoords, this._settings.orientation, this._settings.type);
    }
    setOption(key, value) {
        if (has.call(this._settings, key)) {
            this._settings[key] = value;
            this.trigger('settings changed');
        }
    }
    setOptions(options) {
        this.initOptions(options);
        this.correctOptions();
        this.trigger('settings changed');
    }
    getStyles() {
        return this._settings.styles;
    }
    getStyle(option) {
        return this._settings.styles[option];
    }
    getSetting(option) {
        return this._settings[option];
    }
    getSettings() {
        return this._settings;
    }
    getItem() {
        return this._item;
    }
}



/***/ }),

/***/ "./ts-src/pres.ts":
/*!************************!*\
  !*** ./ts-src/pres.ts ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Pres": () => (/* binding */ Pres)
/* harmony export */ });
/* harmony import */ var _eventemitter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./eventemitter */ "./ts-src/eventemitter.ts");
/* harmony import */ var _model__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./model */ "./ts-src/model.ts");


class Pres extends _eventemitter__WEBPACK_IMPORTED_MODULE_0__.default {
    constructor(model, item) {
        super();
        this.pxOptions = ['height', 'width'];
        this._model = model;
        this._item = item;
    }
    getView(view) {
        this._view = view;
    }
    init() {
        this._model.validateOptions();
        const orientation = this._model.getSetting('orientation');
        this.temp = this.determineMetrics(orientation);
        this.temp.ori = this._model._settings.orientation;
        this.temp.type = this._model._settings.type;
        this._model.temp = this.temp;
        this._view.temp = this.temp;
        let widthOrHeight;
        if (orientation === 'horizontal') {
            widthOrHeight = this._model.getStyle('sliderWidth');
        }
        else if (orientation == 'vertical') {
            widthOrHeight = this._model.getStyle('sliderHeight');
        }
        const options = this.convertOptions(this._model.getStyles());
        const behavior = this._model.getSettings();
        const { main, container } = this.builder.makeSlider(behavior);
        this._view.renderElement(main);
        if (behavior.marker) {
            const marker = this.builder.makeMarker(behavior, widthOrHeight);
            container.appendChild(marker);
        }
        this.fetchDivs();
        this._view.implementStyles(options, this._model._settings.orientation);
        this._model.setOptions(this._view.getOffsetsAndLimits(orientation));
        this._model.setOption('built', true);
        this._view.rangeInterval();
    }
    firstRefresh() {
        const { direction, ori, type } = this.temp;
        let start1 = this._model._settings.startPos1;
        const start2 = this._model._settings.startPos2;
        const startValue1 = this._model._settings.startValue1;
        const startValue2 = this._model._settings.startValue2;
        if (startValue1 !== 0 || startValue2 !== 0) {
            this.setValue(startValue1, 1);
            if (type === 'double') {
                this.setValue(startValue2, 2);
            }
            return;
        }
        const start = start1 || start2;
        const coords = this._model.coords;
        coords.caller = 'model';
        this._view._elements._handles.forEach((item) => {
            coords.target = item;
            coords.main = start;
            coords.value = this._model.calcValue(item, item.getBoundingClientRect()[direction]).value;
            this.transferData(coords, ori, type); // почему если здесь поставить this._view.refreshCoord, то будет ошибка maximum call stack exceeded
            start1 = undefined;
        });
    }
    showValue(handle) {
        const { direction } = this.temp;
        const offset = handle.getBoundingClientRect()[direction];
        const { value, target } = this._model.calcValue(handle, offset);
        this._view.showValue(target, value);
    }
    fetchDivs() {
        const className = this._model._settings.className;
        const ori = this._model._settings.orientation;
        this._view.fetchDivs(ori, className);
    }
    convertOptions(options) {
        const newOptions = {
            slider: {
                width: 0,
                height: 0,
            },
            progressBar: {
                'background-color': '',
            },
            handle: {
                'background-color': '',
            },
            tool: {
                color: '',
            },
        };
        Object.keys(options).forEach((i) => {
            if (i.toString().includes('slider')) {
                let option = i.slice(6).toLowerCase();
                if (option === 'color') {
                    option = 'background-color';
                }
                newOptions.slider[option] = options[i];
                if (this.pxOptions.includes(option)) {
                    newOptions.slider[option] = `${options[i]}px`;
                }
                else {
                    newOptions.slider[option] = options[i];
                }
            }
            else if (i.toString().includes('progressBar')) {
                let option = i.slice(11).toLowerCase();
                if (option === 'color') {
                    option = 'background-color';
                }
                newOptions.progressBar[option] = options[i];
                if (this.pxOptions.includes(option)) {
                    newOptions.progressBar[option] = `${options[i]}px`;
                }
                else {
                    newOptions.progressBar[option] = options[i];
                }
            }
            else if (i.toString().includes('handle')) {
                let option = i.slice(6).toLowerCase();
                if (option === 'color') {
                    option = 'background-color';
                }
                newOptions.handle[option] = options[i];
                if (this.pxOptions.includes(option)) {
                    newOptions.handle[option] = `${options[i]}px`;
                }
                else {
                    newOptions.handle[option] = options[i];
                }
            }
            else if (i.toString().includes('tool')) {
                let option = i.slice(4).toLowerCase();
                if (option === 'color') {
                    option = 'background-color';
                }
                else if (option === 'textcolor') {
                    option = 'color';
                }
                newOptions.tool[option] = options[i];
                if (this.pxOptions.includes(option)) {
                    newOptions.tool[option] = `${options[i]}px`;
                }
                else {
                    newOptions.tool[option] = options[i];
                }
            }
        });
        return newOptions;
    }
    onMouseDown() {
        const handles = this._view._elements._handles;
        const container = this._view._elements._sliderContainer;
        const slider = this._view._elements._slider;
        const marginLeft = slider.getBoundingClientRect().left; // TODO should take from model?
        const marginTop = slider.getBoundingClientRect().top;
        let ori;
        let type;
        let shift;
        this._model.on('coords changed', this.transferData.bind(this));
        this._model.on('settings changed', this.renewTemp.bind(this));
        handles.forEach((handle) => {
            handle.ondragstart = () => {
                return false;
            };
            handle.addEventListener('pointerdown', (event) => {
                ori = this._model._settings.orientation;
                type = this._model._settings.type;
                event.preventDefault();
                const target = event.target;
                const { direction, client } = this.temp;
                shift = event[client] - target.getBoundingClientRect()[direction];
                const mouseMove = (e) => {
                    if (e.target === handle) {
                        console.log('ye');
                        this.transferData({
                            y: e.clientY,
                            x: e.clientX,
                            shift: shift,
                            marginLeft: marginLeft,
                            clicked: false,
                            marginTop: marginTop,
                            target: e.target,
                        }, ori, type);
                    }
                };
                const onMouseUp = (e) => {
                    document.removeEventListener('pointermove', mouseMove);
                    document.removeEventListener('pointerup', onMouseUp);
                };
                document.addEventListener('pointermove', mouseMove);
                document.addEventListener('pointerup', onMouseUp);
            });
        });
        container.addEventListener('click', (event) => {
            ori = this._model._settings.orientation;
            type = this._model._settings.type;
            const target = event.target;
            if (target.className.includes('jsSlider-clickable')) {
                const value = target.getElementsByClassName('marker-value')[0] ||
                    target;
                this.transferData({
                    y: event.clientY,
                    x: target.getBoundingClientRect().left,
                    value: value.dataset.value,
                    clicked: true,
                    target: target,
                    marginLeft: marginLeft,
                    marginTop: marginTop,
                }, ori, type);
            }
        });
    }
    transferData(data, ori, type) {
        const dataForTransfer = Object.assign({}, data);
        if (dataForTransfer.caller === 'model') {
            this._view.refreshCoords(dataForTransfer, ori, type);
            return;
        }
        this._model.renew(dataForTransfer, ori, type);
    }
    setValue(value, target) {
        const viewEls = this._view._elements;
        let handle;
        if (target === 1) {
            handle = viewEls._handles[0];
        }
        else if (target === 2) {
            if (this.temp.type === 'double') {
                handle = viewEls._handles[1];
            }
            else {
                throw new ReferenceError('Can not reference absent handle');
            }
        }
        this._model.calcMain(value, handle);
    }
    determineMetrics(orientation) {
        let offset;
        let widthOrHeight;
        let direction;
        let margin;
        let client;
        let offsetLength;
        if (orientation === 'horizontal') {
            offset = 'offsetLeft';
            widthOrHeight = 'width';
            direction = 'left';
            margin = 'marginLeft';
            client = 'clientX';
            offsetLength = 'offsetWidth';
        }
        else if (orientation === 'vertical') {
            offset = 'offsetTop';
            widthOrHeight = 'height';
            direction = 'top';
            margin = 'marginTop';
            client = 'clientY';
            offsetLength = 'offsetHeight';
        }
        return { offset, offsetLength, widthOrHeight, direction, margin, client };
    }
    getSettings() {
        return this._model.getSettings();
    }
    renewTemp() {
        Object.keys(this.temp).forEach((key) => {
            if (_model__WEBPACK_IMPORTED_MODULE_1__.has.call(this._model._settings, key)) {
                this.temp[key] = this._model._settings[key];
            }
        });
    }
}



/***/ }),

/***/ "./ts-src/presBuilder.ts":
/*!*******************************!*\
  !*** ./ts-src/presBuilder.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./ts-src/utils.ts");

class PresBuilder {
    constructor(items) {
        this._view = items.view;
        this._model = items.model;
        this.settings = items.settings;
        this._pres = items.pres;
    }
    makeSlider(behavior) {
        const viewEls = this._view._elements;
        const { ori, direction } = this._pres.temp;
        const main = document.createElement('div');
        main.classList.add('slider-main');
        const container = document.createElement('div');
        const slider = document.createElement('div');
        slider.classList.add('slider');
        const range = document.createElement('div');
        range.classList.add('slider-range');
        const handle = document.createElement('div');
        if (ori === 'horizontal') {
            range.style.width = '0px';
            handle.style[direction] = '0px';
        }
        else if (ori === 'vertical') {
            range.style.height = '0px';
            handle.style[direction] = '0px';
        }
        const tool = document.createElement('div');
        const tooltipContainer = document.createElement('div');
        tooltipContainer.className = `tooltipContainer tooltipContainer--${ori}`;
        const tooltipStick = document.createElement('div');
        tooltipStick.className = `tooltipStick tooltipStick--${ori}`;
        tooltipContainer.append(tooltipStick);
        this._view._elements._tooltipsSticks.push(tooltipStick);
        tooltipContainer.append(tool);
        handle.append(tooltipContainer);
        const min = document.createElement('span');
        min.className = 'jsOffset values jsSlider-clickable';
        const max = document.createElement('span');
        max.className = 'jsOffset values jsSlider-clickable';
        main.append(min);
        container.append(slider);
        main.append(container);
        main.append(max);
        slider.appendChild(range);
        slider.appendChild(handle);
        handle.className = `slider-handle slider-handle--${ori}`;
        viewEls._handles.push(handle);
        container.className = `slider-container slider-container--${ori}`;
        tool.className = `tooltip tooltip--${ori}`;
        if (behavior.type !== 'single') {
            this.addHandle(handle, range, direction);
        }
        min.textContent = String(behavior.minValue);
        min.dataset.value = min.textContent;
        max.textContent = String(behavior.maxValue);
        max.dataset.value = max.textContent;
        min.classList.add(`slider-min--${ori}`);
        max.classList.add(`slider-max--${ori}`);
        main.classList.add(`slider-main--${ori}`);
        return { main: main, container, slider };
    }
    makeMarker(behavior, widthOrHeight) {
        const orientation = this._pres.temp.ori;
        const handle1 = this._view._elements._handles[0];
        const { margin: marginCss } = this._pres.temp;
        const markerDiv = document.createElement('div');
        const { valuesForMarkers, altDrag, margin } = this.calcPins(behavior, widthOrHeight);
        const listOfValues = valuesForMarkers;
        let j = 0;
        for (let i = 0; i < valuesForMarkers.length - 1; i += 1) {
            const majorMarker = document.createElement('div');
            markerDiv.append(majorMarker);
            const markerValue = document.createElement('label');
            markerValue.className = `jsSlider-clickable marker-value marker-value--${orientation}`;
            markerDiv.classList.add(`slider-marker--${orientation}`);
            majorMarker.className = `jsOffset marker--major marker--major--${orientation}`;
            if (i === 0) {
                majorMarker.style[marginCss] = margin - handle1.offsetWidth / 2 + 'px';
            }
            else {
                majorMarker.style[marginCss] = margin - handle1.offsetWidth / 2 + 'px';
            }
            if (!altDrag) {
                const value = listOfValues[j];
                majorMarker.dataset.value = value.toString();
                markerValue.dataset.value = value.toString();
                markerValue.textContent = value.toString();
                majorMarker.append(markerValue);
            }
            else {
                const value = listOfValues[j];
                majorMarker.dataset.value = value.toString();
                markerValue.dataset.value = value.toString();
                markerValue.textContent = value.toString();
                majorMarker.append(markerValue);
                j += 1;
            }
        }
        markerDiv.className = `slider-marker slider-marker--${orientation}`;
        return markerDiv;
    }
    addHandle(handl, rang, directio) {
        let handle;
        let range;
        let direction;
        const viewEls = this._view._elements;
        this._model.setOption('type', 'double');
        if (!handl) {
            handle = viewEls._handles[0];
            range = viewEls._range;
        }
        else {
            handle = handl;
            range = rang;
            direction = directio;
        }
        const behavior = this._model.getSettings();
        if (behavior.orientation === 'horizontal') {
            direction = 'left';
        }
        else {
            direction = 'top';
        }
        const handleCLone = handle.cloneNode(true);
        handleCLone.style[direction] = '20px';
        const tooltipContainer = handleCLone.getElementsByClassName('tooltipContainer')[0];
        this._view._elements._tooltipContainers.push(tooltipContainer);
        handle.after(range);
        range.after(handleCLone);
        const stick = this._view.fetchHTMLEl('tooltipStick', true);
        viewEls._tooltipsSticks.push(stick);
        viewEls._handles.push(handleCLone);
        if (this._model._settings.built) {
            this._view.rangeInterval();
            this._pres.showValue(handleCLone);
        }
    }
    removeHandle() {
        const viewEls = this._view._elements;
        this._model.setOption('type', 'single');
        const orient = this._pres.temp.ori;
        if (orient === 'horizontal') {
            viewEls._range.style.left = '0px';
        }
        else if (orient === 'vertical') {
            viewEls._range.style.top = '0px';
        }
        viewEls._handles[0].before(viewEls._range);
        viewEls._handles[1].remove();
        viewEls._handles = viewEls._handles.slice(0, 1);
        if (this._model._settings.built) {
            this._view.rangeInterval();
        }
    }
    calcPins(behavior, widthOrHeight) {
        let altDrag;
        let majorMarkers = Math.trunc((behavior.maxValue - behavior.minValue) / behavior.stepSize);
        // 40px between pins is the optimal number,if it is smaller,we make it 40
        if (widthOrHeight / majorMarkers < 40) {
            altDrag = true;
            this._model.setOptions({
                altDrag: altDrag,
            });
            majorMarkers = this._model._settings._minPins;
        }
        const diff = this._model._settings.maxMinDifference;
        const ss = this._model._settings.stepSize;
        // console.log(
        //   '🚀 ~ PresBuilder ~ calcPins ~ n',
        //   Math.trunc(diff / (ss * majorMarkers)),
        //   diff,
        //   ss,
        //   majorMarkers
        // );
        const n = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.checkForZero)(Math.round(diff / (ss * majorMarkers))); // каждый n-ый элемент из возможныъ value будет помещен на scale
        const valuesForMarkers = [];
        for (let i = n; i < diff / ss; i += n) {
            const value = ss * i + behavior.minValue;
            valuesForMarkers.push(value);
        }
        const margin = widthOrHeight / valuesForMarkers.length;
        return { valuesForMarkers, majorMarkers, altDrag, margin };
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (PresBuilder);


/***/ }),

/***/ "./ts-src/utils.ts":
/*!*************************!*\
  !*** ./ts-src/utils.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "elemsDiff": () => (/* binding */ elemsDiff),
/* harmony export */   "checkForZero": () => (/* binding */ checkForZero),
/* harmony export */   "shortenValue": () => (/* binding */ shortenValue),
/* harmony export */   "divisionFloor": () => (/* binding */ divisionFloor)
/* harmony export */ });
function elemsDiff(arr) {
    const res = [];
    for (let i = 0; i < arr.length - 1; i += 1) {
        const result = +arr[i + 1] - +arr[i];
        res.push(result);
    }
    return res;
}
function checkForZero(number) {
    if (number > 0) {
        return number;
    }
    throw new Error('can not operate with non-positive numbers');
}
// shortens value to format  e.g.'1.3k'
function shortenValue(x) {
    let value;
    if (x.toString().length > 3) {
        value = (x / 1000).toFixed(1) + 'k';
    }
    else {
        value = String(x);
    }
    return value;
}
function divisionFloor(x, y) {
    const result = Math.trunc(x / y);
    return result;
}



/***/ }),

/***/ "./ts-src/view.ts":
/*!************************!*\
  !*** ./ts-src/view.ts ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _eventemitter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./eventemitter */ "./ts-src/eventemitter.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ "./ts-src/utils.ts");


class View extends _eventemitter__WEBPACK_IMPORTED_MODULE_0__.default {
    constructor(pres, options, item) {
        super();
        this._elements = {
            _slider: null,
            _sliderMain: null,
            _sliderContainer: null,
            _scale: null,
            _range: null,
            _tooltipContainers: [],
            _handles: [],
            _tooltips: [],
            _tooltipsSticks: [],
            _pins: [],
        };
        this._pres = pres;
        this._item = item;
    }
    implementStyles(options, pos) {
        this.initiateOptions(options);
        // this.temp.orientation = pos;
        const tooltipLeftOffset = this._elements._tooltips[0].getBoundingClientRect().left;
        if (tooltipLeftOffset < 0) {
            this._elements._sliderContainer.classList.add('slider-container--vertical--corrected');
            const min = this.fetchHTMLEl('slider-min--vertical', true);
            min.style.left = '10px';
            this._elements._tooltipContainers.forEach((item) => {
                item.classList.add('tooltipContainer--vertical--corrected');
            });
        }
        const valuesDivs = this.fetchHTMLEl('values', false);
        valuesDivs.forEach((div) => {
            div.classList.add('values--corrected');
        });
        return {
            slider: this._elements._slider,
            range: this._elements._range,
            handles: this._elements._handles,
            wrapper: this._elements._sliderMain,
        };
    }
    renderElement(element, where = this._item) {
        where.append(element);
    }
    getOffsetsAndLimits(ori) {
        const { offsetLength } = this.temp;
        const mainMax = this._elements._sliderMain[offsetLength] -
            this._elements._handles[0][offsetLength] / 2;
        const mainMin = this._elements._handles[0][offsetLength] / 2;
        const marginTop = this._elements._slider.getBoundingClientRect().top;
        const marginLeft = this._elements._slider.getBoundingClientRect().left;
        return {
            mainMax,
            mainMin,
            marginTop,
            marginLeft,
        };
    }
    fetchHTMLEl(className, single, elem = this._item) {
        const items = elem.querySelectorAll(`.${className}`);
        const nodes = [...items];
        if (single) {
            return nodes[0];
        }
        return nodes;
    }
    fetchDivs(orientation, defClassName) {
        this._elements._sliderMain = this.fetchHTMLEl(`${defClassName}-main`, true);
        this._elements._slider = this.fetchHTMLEl(defClassName, true);
        this._elements._range = this.fetchHTMLEl(`${defClassName}-range`, true);
        this._elements._handles = this.fetchHTMLEl(`${defClassName}-handle--${orientation}`, false);
        this._elements._tooltips = this.fetchHTMLEl(`tooltip`, false);
        this._elements._sliderContainer = this.fetchHTMLEl(`${defClassName}-container`, true);
        this._elements._scale = this.fetchHTMLEl(`${defClassName}-marker`, true);
        this._elements._tooltipContainers = this.fetchHTMLEl('tooltipContainer', false);
        this._elements._pins = this.fetchHTMLEl('jsSlider-clickable', false);
        // TODO Array.from
        const divsContainingValues = Array.from(this._item.getElementsByClassName('jsSlider-clickable')).map((item) => {
            return {
                div: item,
                value: item.textContent,
            };
        });
        this.divsContainingValues = divsContainingValues;
        this.valuesFromDivs = divsContainingValues.map((item) => item.value);
        // console.log(this.temp);
        const { offset } = this.temp;
        const pinsCoordinatesItems = Array.from(
        // TODO Array.from
        this._item.getElementsByClassName('jsOffset')).map((item) => {
            return { div: item, offset: item[offset] };
        });
        const pinsCoordinates = pinsCoordinatesItems.map((item) => {
            return item.offset;
        });
        this.pinsCoordinatesItems = pinsCoordinatesItems;
        this.pinsCoordinates = pinsCoordinates;
    }
    initiateOptions(options) {
        Object.keys(options).forEach((option) => {
            if (typeof options[option] === 'object') {
                Object.entries(options[option]).forEach(([i, j]) => {
                    if (option.toString().includes('slider')) {
                        this._elements._slider.style[i] = j;
                    }
                    else if (option.toString().includes('progressBar')) {
                        this._elements._range.style[i] = j;
                    }
                    else if (option.toString().includes('markUp')) {
                        this._elements._slider.style[i] = j;
                    }
                    else if (option.toString().includes('handle')) {
                        this._elements._handles.forEach((handle) => {
                            handle.style[i] = j;
                        });
                    }
                    else if (option.toString().includes('tool')) {
                        this._elements._tooltips.forEach((tool) => {
                            tool.style[i] = j;
                        });
                    }
                });
            }
        });
    }
    refreshCoords(data, ori, type) {
        const isClickedOnPin = data.clicked;
        const isNormallyDragged = data.altDrag;
        let newLeft;
        let coordsForUse;
        let handle;
        let value = data.value;
        const { widthOrHeight, direction } = this.temp;
        if (type === 'single') {
            handle = this._elements._handles[0];
        }
        else if (type === 'double') {
            handle = data.target;
        }
        const range = this._elements._range;
        const toolTip = this.fetchHTMLEl(`tooltip`, true, handle);
        const newCoords = Object.assign({}, data);
        if (isClickedOnPin) {
            coordsForUse = this.reactOnClick(newCoords, ori, type);
            newLeft = coordsForUse.newLeft;
        }
        else if (isNormallyDragged) {
            coordsForUse = this.reactOnDrag(newCoords);
            newLeft = coordsForUse.newLeft;
        }
        else {
            const { newLeft: nl, value: v } = this.pinnedDrag(newCoords);
            newLeft = nl;
            value = v;
        }
        handle.style[direction] = newLeft + 'px';
        if (type === 'double') {
            this.rangeInterval();
        }
        else {
            range.style[widthOrHeight] = newLeft + handle.offsetWidth / 2 + 'px';
        }
        if (!isClickedOnPin) {
            handle.dataset.value = value;
            value = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.shortenValue)(value);
            toolTip.textContent = value;
        }
    }
    reactOnDrag(data) {
        let newLeft;
        const shift = data.shift || 0;
        let value;
        const { widthOrHeight } = this.temp;
        const handle = data.target;
        const range = this._elements._range;
        if (data.value === 0) {
            range.style[widthOrHeight] = '0';
        }
        const isNormallyDragged = data.altDrag;
        if (isNormallyDragged) {
            newLeft = data.main - shift;
        }
        else {
            newLeft += handle.offsetWidth / 2;
        }
        return {
            newLeft,
            value,
        };
    }
    pinnedDrag(data) {
        let newLeft;
        const handleWidth = this._elements._handles[0].offsetWidth;
        // eslint-disable-next-line prefer-const
        let { direction, margin } = this.temp;
        margin = data[margin];
        const pin = this.matchHandleAndPin(data.main);
        const value = Number(pin.dataset.value);
        const pinCoords = pin.getBoundingClientRect()[direction];
        newLeft = pinCoords - margin - handleWidth / 2;
        if (pin.className.includes('slider-min')) {
            newLeft = 0;
        }
        else if (pin.className.includes('slider-max')) {
            newLeft = data.mainMax - handleWidth / 2;
        }
        return { newLeft, value };
    }
    reactOnClick(data, ori, type) {
        if (type === 'double') {
            return false;
        }
        const handle = this._elements._handles[0];
        const handleWidth = handle.offsetWidth;
        const pin = data.target.parentElement;
        const pinPointsValues = this.valuesFromDivs;
        const toolTip = this._elements._tooltips[0];
        const { widthOrHeight, direction, margin } = this.temp;
        const pinCoords = pin.getBoundingClientRect()[direction];
        const newLeft = pinCoords - data[margin] - handleWidth / 2;
        handle.style[direction] = newLeft + 'px';
        this._elements._range.style[widthOrHeight] = newLeft + 'px';
        toolTip.textContent = data.value;
        if (pinPointsValues.includes(data.value)) {
            this.divsContainingValues.forEach((i) => {
                const item = i;
                if (item.value === data.value) {
                    this.divsContainingValues.forEach(() => {
                        const item2 = i;
                        item2.div.style.color = '';
                    });
                    item.div.style.color = String(this.temp.pinTextColor);
                }
            });
        }
        return { newLeft, pin };
    }
    rangeInterval() {
        const handle1 = this._elements._handles[0];
        const handle2 = this._elements._handles[1];
        const { widthOrHeight, direction } = this.temp;
        const minOffset = parseFloat(handle1.style[direction]);
        let maxOffset;
        if (handle2) {
            maxOffset = parseFloat(handle2.style[direction]); // only works if style.left is in pxs
        }
        else {
            maxOffset = null;
        }
        const length = Math.abs(minOffset - maxOffset);
        const handleOffset = Math.min(minOffset, maxOffset);
        this._elements._range.style[direction] = handleOffset + 'px';
        this._elements._range.style[widthOrHeight] =
            length + handle1.offsetWidth / 2 + 'px';
    }
    showValue(target, value) {
        const tool = target.getElementsByClassName('tooltip')[0];
        target.dataset.value = String(Math.abs(value));
        tool.textContent = String(Math.abs(value));
    }
    matchHandleAndPin(main) {
        const offsets = this.pinsCoordinatesItems;
        const offsetsNums = this.pinsCoordinates;
        let minDiff = Infinity;
        let pinOffset;
        offsetsNums.forEach((offset) => {
            const leastDiff = Math.abs(main - Number(offset));
            if (leastDiff < minDiff) {
                minDiff = leastDiff;
                pinOffset = Number(offset);
            }
        });
        let pin;
        offsets.forEach((i) => {
            const item = i;
            if (pinOffset === item.offset) {
                pin = item.div;
                return pin;
            }
            return false;
        });
        return pin;
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (View);


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!*********************************!*\
  !*** ./ts-src/jquery.slider.ts ***!
  \*********************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./app */ "./ts-src/app.ts");
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./style.scss */ "./ts-src/style.scss");
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_style_scss__WEBPACK_IMPORTED_MODULE_1__);


// eslint-disable-next-line @typescript-eslint/no-explicit-any
const plugins = new Map();
class Plugin extends $ {
    constructor(HTMLElement, app) {
        super();
        this.tilt = () => {
            this.destroy();
            this.app.tilt();
            this.restore();
            return this;
        };
        this.scale = (option) => {
            if (typeof option !== 'boolean') {
                this.states.scale = !this.states.scale;
                this.app.scale(this.states.scale);
                return this;
            }
            this.states.scale = !this.states.scale;
            this.app.scale(option);
            return this;
        };
        this.bar = (option) => {
            if (typeof option !== 'boolean') {
                this.states.progressBar = !this.states.progressBar;
                this.app.bar(this.states.progressBar);
                return this;
            }
            this.states.progressBar = !this.states.progressBar;
            this.app.bar(option);
            return this;
        };
        this.tip = (option) => {
            if (typeof option !== 'boolean') {
                this.states.tip = !this.states.tip;
                this.app.tip(this.states.tip);
                return this;
            }
            this.states.tip = !this.states.tip;
            this.app.tip(option);
            return this;
        };
        this.range = (option) => {
            if (typeof option !== 'boolean') {
                this.states.range = !this.states.range;
                this.app.range(this.states.range);
                return this;
            }
            this.states.range = !this.states.range;
            this.app.range(option);
            return this;
        };
        this.setValue = (value, number) => {
            this.app.setValue(value, number);
            return this;
        };
        this.setLimits = (min, max) => {
            this.destroy();
            this.app.setLimits(min, max);
            this.restore();
            return this;
        };
        this.isRange = () => {
            return this.app.isRange();
        };
        this.setStep = (value) => {
            this.destroy();
            this.app.setStep(value);
            this.restore();
            return this;
        };
        this.stick = (option) => {
            this.app.stick(option);
            return this;
        };
        this.destroy = () => {
            this.$item.data('handle1', this.app.getValue(1));
            if (this.isRange()) {
                this.$item.data('handle2', this.app.getValue(2));
            }
            this.$item.html('');
        };
        this.restore = () => {
            if (Object.keys(this.$item.data()).length === 0) {
                return this.$item;
            }
            this.setValue(this.$item.data('handle1'), 1);
            if (this.isRange()) {
                this.setValue(this.$item.data('handle2'), 2);
            }
            return false;
        };
        this.item = HTMLElement;
        this.states = {
            progressBar: app._view._elements._range.style.display !== 'none',
            range: app.isRange(),
            orientation: app._model.getSetting('orientation'),
            scale: app._model.getSetting('marker'),
            tip: app._model.getSetting('toolTip'),
            stick: app._view._elements._tooltipsSticks[0].style.display !== 'none',
        };
        this.app = app;
        this.$item = $(HTMLElement);
    }
}
$.fn.slider = function slider(options) {
    const app = new _app__WEBPACK_IMPORTED_MODULE_0__.default(this[0], options);
    plugins.set(this[0], { plugin: $(this), app: app });
    return new Plugin(this[0], app);
};
const data = {
    className: 'slider',
    orientation: 'horizontal',
    type: 'single',
    stepSize: 90,
    maxValue: 400,
    minValue: 0,
    toolTip: true,
    marker: true,
    progressBarColor: 'brown',
    sliderColor: 'red',
    sliderWidth: 5,
    sliderHeight: 200,
    pinTextColor: 'green',
    toolTextColor: 'red',
};
// $('#slider').slider(data);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Plugin);

})();

/******/ })()
;
//# sourceMappingURL=plugin.js.map
>>>>>>> 17edb721cdb2ae18983f684e1fedbbcbc565ebb3

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */


function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

function language(hass) {
    const code = (hass?.language || hass?.locale?.language || "en")
        .toLowerCase()
        .replace(/_/g, "-")
        .split("-")[0];
    return ["nb", "no", "nn"].includes(code) ? "nb" : "en";
}
/** Preserve regional formatting independently of the translated dictionary. */
function formattingLocale(hass) {
    const code = (hass?.language || hass?.locale?.language || "en")
        .toLowerCase().replace(/_/g, "-").replace(/^(no|nn)(?=-|$)/, "nb");
    try {
        return Intl.getCanonicalLocales(code)[0] || "en";
    }
    catch {
        return "en";
    }
}
const en = {
    "No day enabled": "No day enabled",
    "Time for School entity": "Time for School entity",
    "Name (optional)": "Name (optional)",
    Appearance: "Appearance",
    Default: "Default",
    Bubble: "Bubble",
    "Lights are blinking and screens are off · since": "Lights are blinking and screens are off · since",
    "No upcoming alert": "No upcoming alert",
    "Time for school!": "Time for school!",
    "Time for school": "Time for school",
    "Weekly schedule": "Weekly schedule",
    "This week": "This week",
    "Close settings": "Close settings",
    "Blink interval": "Blink interval",
    "Alert is off": "Alert is off",
    "Blink count": "Blink count",
    Configure: "Configure",
    "Skip next": "Skip next",
    "(not set)": "(not set)",
    "Turns off": "Turns off",
    "Test now": "Test now",
    Tomorrow: "Tomorrow",
    settings: "settings",
    Enabled: "Enabled",
    Blinks: "Blinks",
    Today: "Today",
    "Next:": "Next:",
    Stop: "Stop",
    Started: "Started",
    h: "h",
    in: "in",
    ago: "ago",
    "Entity not found": "Entity not found",
    "Define an entity": "Define an entity",
    Time: "Time",
    "Action failed": "Action failed",
    Monday: "Monday",
    Tuesday: "Tuesday",
    Wednesday: "Wednesday",
    Thursday: "Thursday",
    Friday: "Friday",
    Saturday: "Saturday",
    Sunday: "Sunday",
    Off: "Off",
    Armed: "Armed",
    "Time to go!": "Time to go!",
    Unavailable: "Unavailable",
    Unknown: "Unknown",
};
const nb = {
    "No day enabled": "Ingen dager aktivert",
    "Time for School entity": "Tid for skolen-enhet",
    "Name (optional)": "Navn (valgfritt)",
    Appearance: "Utseende",
    Default: "Standard",
    Bubble: "Boble",
    "Lights are blinking and screens are off · since": "Lysene blinker og skjermene er av · siden",
    "No upcoming alert": "Ingen kommende varsling",
    "Time for school!": "Tid for skolen!",
    "Time for school": "Tid for skolen",
    "Weekly schedule": "Ukeplan",
    "This week": "Denne uka",
    "Close settings": "Lukk innstillinger",
    "Blink interval": "Blinkintervall",
    "Alert is off": "Varsling er slått av",
    "Blink count": "Antall blink",
    Configure: "Konfigurer",
    "Skip next": "Hopp over neste",
    "(not set)": "(ikke angitt)",
    "Turns off": "Slår av",
    "Test now": "Test nå",
    Tomorrow: "I morgen",
    settings: "innstillinger",
    Enabled: "Aktivert",
    Blinks: "Blinker",
    Today: "I dag",
    "Next:": "Neste:",
    Stop: "Stopp",
    Started: "Startet",
    h: "t",
    in: "om",
    ago: "siden",
    "Entity not found": "Fant ikke enheten",
    "Define an entity": "Du må angi en enhet",
    Time: "Tid",
    "Action failed": "Handlingen mislyktes",
    Monday: "Mandag",
    Tuesday: "Tirsdag",
    Wednesday: "Onsdag",
    Thursday: "Torsdag",
    Friday: "Fredag",
    Saturday: "Lørdag",
    Sunday: "Søndag",
    Off: "Av",
    Armed: "Aktivert",
    "Time to go!": "På tide å gå!",
    Unavailable: "Utilgjengelig",
    Unknown: "Ukjent",
};
function localize(hass, key) {
    return (language(hass) === "nb" ? nb : en)[key];
}

/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$3=globalThis,e$4=t$3.ShadowRoot&&(void 0===t$3.ShadyCSS||t$3.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s$2=Symbol(),o$4=new WeakMap;let n$3 = class n{constructor(t,e,o){if(this._$cssResult$=true,o!==s$2)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e;}get styleSheet(){let t=this.o;const s=this.t;if(e$4&&void 0===t){const e=void 0!==s&&1===s.length;e&&(t=o$4.get(s)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&o$4.set(s,t));}return t}toString(){return this.cssText}};const r$4=t=>new n$3("string"==typeof t?t:t+"",void 0,s$2),i$4=(t,...e)=>{const o=1===t.length?t[0]:e.reduce(((e,s,o)=>e+(t=>{if(true===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[o+1]),t[0]);return new n$3(o,t,s$2)},S$1=(s,o)=>{if(e$4)s.adoptedStyleSheets=o.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet));else for(const e of o){const o=document.createElement("style"),n=t$3.litNonce;void 0!==n&&o.setAttribute("nonce",n),o.textContent=e.cssText,s.appendChild(o);}},c$2=e$4?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return r$4(e)})(t):t;

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:i$3,defineProperty:e$3,getOwnPropertyDescriptor:h$1,getOwnPropertyNames:r$3,getOwnPropertySymbols:o$3,getPrototypeOf:n$2}=Object,a$1=globalThis,c$1=a$1.trustedTypes,l$2=c$1?c$1.emptyScript:"",p$1=a$1.reactiveElementPolyfillSupport,d$1=(t,s)=>t,u$2={toAttribute(t,s){switch(s){case Boolean:t=t?l$2:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t);}return t},fromAttribute(t,s){let i=t;switch(s){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t);}catch(t){i=null;}}return i}},f$2=(t,s)=>!i$3(t,s),b$1={attribute:true,type:String,converter:u$2,reflect:false,useDefault:false,hasChanged:f$2};Symbol.metadata??=Symbol("metadata"),a$1.litPropertyMetadata??=new WeakMap;let y$1 = class y extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t);}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,s=b$1){if(s.state&&(s.attribute=false),this._$Ei(),this.prototype.hasOwnProperty(t)&&((s=Object.create(s)).wrapped=true),this.elementProperties.set(t,s),!s.noAccessor){const i=Symbol(),h=this.getPropertyDescriptor(t,i,s);void 0!==h&&e$3(this.prototype,t,h);}}static getPropertyDescriptor(t,s,i){const{get:e,set:r}=h$1(this.prototype,t)??{get(){return this[s]},set(t){this[s]=t;}};return {get:e,set(s){const h=e?.call(this);r?.call(this,s),this.requestUpdate(t,h,i);},configurable:true,enumerable:true}}static getPropertyOptions(t){return this.elementProperties.get(t)??b$1}static _$Ei(){if(this.hasOwnProperty(d$1("elementProperties")))return;const t=n$2(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties);}static finalize(){if(this.hasOwnProperty(d$1("finalized")))return;if(this.finalized=true,this._$Ei(),this.hasOwnProperty(d$1("properties"))){const t=this.properties,s=[...r$3(t),...o$3(t)];for(const i of s)this.createProperty(i,t[i]);}const t=this[Symbol.metadata];if(null!==t){const s=litPropertyMetadata.get(t);if(void 0!==s)for(const[t,i]of s)this.elementProperties.set(t,i);}this._$Eh=new Map;for(const[t,s]of this.elementProperties){const i=this._$Eu(t,s);void 0!==i&&this._$Eh.set(i,t);}this.elementStyles=this.finalizeStyles(this.styles);}static finalizeStyles(s){const i=[];if(Array.isArray(s)){const e=new Set(s.flat(1/0).reverse());for(const s of e)i.unshift(c$2(s));}else void 0!==s&&i.push(c$2(s));return i}static _$Eu(t,s){const i=s.attribute;return  false===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=false,this.hasUpdated=false,this._$Em=null,this._$Ev();}_$Ev(){this._$ES=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach((t=>t(this)));}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.();}removeController(t){this._$EO?.delete(t);}_$E_(){const t=new Map,s=this.constructor.elementProperties;for(const i of s.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t);}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return S$1(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(true),this._$EO?.forEach((t=>t.hostConnected?.()));}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach((t=>t.hostDisconnected?.()));}attributeChangedCallback(t,s,i){this._$AK(t,i);}_$ET(t,s){const i=this.constructor.elementProperties.get(t),e=this.constructor._$Eu(t,i);if(void 0!==e&&true===i.reflect){const h=(void 0!==i.converter?.toAttribute?i.converter:u$2).toAttribute(s,i.type);this._$Em=t,null==h?this.removeAttribute(e):this.setAttribute(e,h),this._$Em=null;}}_$AK(t,s){const i=this.constructor,e=i._$Eh.get(t);if(void 0!==e&&this._$Em!==e){const t=i.getPropertyOptions(e),h="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:u$2;this._$Em=e;const r=h.fromAttribute(s,t.type);this[e]=r??this._$Ej?.get(e)??r,this._$Em=null;}}requestUpdate(t,s,i){if(void 0!==t){const e=this.constructor,h=this[t];if(i??=e.getPropertyOptions(t),!((i.hasChanged??f$2)(h,s)||i.useDefault&&i.reflect&&h===this._$Ej?.get(t)&&!this.hasAttribute(e._$Eu(t,i))))return;this.C(t,s,i);} false===this.isUpdatePending&&(this._$ES=this._$EP());}C(t,s,{useDefault:i,reflect:e,wrapped:h},r){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??s??this[t]),true!==h||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||i||(s=void 0),this._$AL.set(t,s)),true===e&&this._$Em!==t&&(this._$Eq??=new Set).add(t));}async _$EP(){this.isUpdatePending=true;try{await this._$ES;}catch(t){Promise.reject(t);}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,s]of this._$Ep)this[t]=s;this._$Ep=void 0;}const t=this.constructor.elementProperties;if(t.size>0)for(const[s,i]of t){const{wrapped:t}=i,e=this[s];true!==t||this._$AL.has(s)||void 0===e||this.C(s,void 0,i,e);}}let t=false;const s=this._$AL;try{t=this.shouldUpdate(s),t?(this.willUpdate(s),this._$EO?.forEach((t=>t.hostUpdate?.())),this.update(s)):this._$EM();}catch(s){throw t=false,this._$EM(),s}t&&this._$AE(s);}willUpdate(t){}_$AE(t){this._$EO?.forEach((t=>t.hostUpdated?.())),this.hasUpdated||(this.hasUpdated=true,this.firstUpdated(t)),this.updated(t);}_$EM(){this._$AL=new Map,this.isUpdatePending=false;}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return  true}update(t){this._$Eq&&=this._$Eq.forEach((t=>this._$ET(t,this[t]))),this._$EM();}updated(t){}firstUpdated(t){}};y$1.elementStyles=[],y$1.shadowRootOptions={mode:"open"},y$1[d$1("elementProperties")]=new Map,y$1[d$1("finalized")]=new Map,p$1?.({ReactiveElement:y$1}),(a$1.reactiveElementVersions??=[]).push("2.1.1");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$2=globalThis,i$2=t$2.trustedTypes,s$1=i$2?i$2.createPolicy("lit-html",{createHTML:t=>t}):void 0,e$2="$lit$",h=`lit$${Math.random().toFixed(9).slice(2)}$`,o$2="?"+h,n$1=`<${o$2}>`,r$2=document,l$1=()=>r$2.createComment(""),c=t=>null===t||"object"!=typeof t&&"function"!=typeof t,a=Array.isArray,u$1=t=>a(t)||"function"==typeof t?.[Symbol.iterator],d="[ \t\n\f\r]",f$1=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,v=/-->/g,_=/>/g,m$1=RegExp(`>|${d}(?:([^\\s"'>=/]+)(${d}*=${d}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),p=/'/g,g=/"/g,$=/^(?:script|style|textarea|title)$/i,y=t=>(i,...s)=>({_$litType$:t,strings:i,values:s}),x=y(1),b=y(2),T=Symbol.for("lit-noChange"),E=Symbol.for("lit-nothing"),A=new WeakMap,C=r$2.createTreeWalker(r$2,129);function P(t,i){if(!a(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==s$1?s$1.createHTML(i):i}const V=(t,i)=>{const s=t.length-1,o=[];let r,l=2===i?"<svg>":3===i?"<math>":"",c=f$1;for(let i=0;i<s;i++){const s=t[i];let a,u,d=-1,y=0;for(;y<s.length&&(c.lastIndex=y,u=c.exec(s),null!==u);)y=c.lastIndex,c===f$1?"!--"===u[1]?c=v:void 0!==u[1]?c=_:void 0!==u[2]?($.test(u[2])&&(r=RegExp("</"+u[2],"g")),c=m$1):void 0!==u[3]&&(c=m$1):c===m$1?">"===u[0]?(c=r??f$1,d=-1):void 0===u[1]?d=-2:(d=c.lastIndex-u[2].length,a=u[1],c=void 0===u[3]?m$1:'"'===u[3]?g:p):c===g||c===p?c=m$1:c===v||c===_?c=f$1:(c=m$1,r=void 0);const x=c===m$1&&t[i+1].startsWith("/>")?" ":"";l+=c===f$1?s+n$1:d>=0?(o.push(a),s.slice(0,d)+e$2+s.slice(d)+h+x):s+h+(-2===d?i:x);}return [P(t,l+(t[s]||"<?>")+(2===i?"</svg>":3===i?"</math>":"")),o]};class N{constructor({strings:t,_$litType$:s},n){let r;this.parts=[];let c=0,a=0;const u=t.length-1,d=this.parts,[f,v]=V(t,s);if(this.el=N.createElement(f,n),C.currentNode=this.el.content,2===s||3===s){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes);}for(;null!==(r=C.nextNode())&&d.length<u;){if(1===r.nodeType){if(r.hasAttributes())for(const t of r.getAttributeNames())if(t.endsWith(e$2)){const i=v[a++],s=r.getAttribute(t).split(h),e=/([.?@])?(.*)/.exec(i);d.push({type:1,index:c,name:e[2],strings:s,ctor:"."===e[1]?H:"?"===e[1]?I:"@"===e[1]?L:k}),r.removeAttribute(t);}else t.startsWith(h)&&(d.push({type:6,index:c}),r.removeAttribute(t));if($.test(r.tagName)){const t=r.textContent.split(h),s=t.length-1;if(s>0){r.textContent=i$2?i$2.emptyScript:"";for(let i=0;i<s;i++)r.append(t[i],l$1()),C.nextNode(),d.push({type:2,index:++c});r.append(t[s],l$1());}}}else if(8===r.nodeType)if(r.data===o$2)d.push({type:2,index:c});else {let t=-1;for(;-1!==(t=r.data.indexOf(h,t+1));)d.push({type:7,index:c}),t+=h.length-1;}c++;}}static createElement(t,i){const s=r$2.createElement("template");return s.innerHTML=t,s}}function S(t,i,s=t,e){if(i===T)return i;let h=void 0!==e?s._$Co?.[e]:s._$Cl;const o=c(i)?void 0:i._$litDirective$;return h?.constructor!==o&&(h?._$AO?.(false),void 0===o?h=void 0:(h=new o(t),h._$AT(t,s,e)),void 0!==e?(s._$Co??=[])[e]=h:s._$Cl=h),void 0!==h&&(i=S(t,h._$AS(t,i.values),h,e)),i}class M{constructor(t,i){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=i;}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:i},parts:s}=this._$AD,e=(t?.creationScope??r$2).importNode(i,true);C.currentNode=e;let h=C.nextNode(),o=0,n=0,l=s[0];for(;void 0!==l;){if(o===l.index){let i;2===l.type?i=new R(h,h.nextSibling,this,t):1===l.type?i=new l.ctor(h,l.name,l.strings,this,t):6===l.type&&(i=new z(h,this,t)),this._$AV.push(i),l=s[++n];}o!==l?.index&&(h=C.nextNode(),o++);}return C.currentNode=r$2,e}p(t){let i=0;for(const s of this._$AV) void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,i),i+=s.strings.length-2):s._$AI(t[i])),i++;}}class R{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,i,s,e){this.type=2,this._$AH=E,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=s,this.options=e,this._$Cv=e?.isConnected??true;}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return void 0!==i&&11===t?.nodeType&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=S(this,t,i),c(t)?t===E||null==t||""===t?(this._$AH!==E&&this._$AR(),this._$AH=E):t!==this._$AH&&t!==T&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):u$1(t)?this.k(t):this._(t);}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t));}_(t){this._$AH!==E&&c(this._$AH)?this._$AA.nextSibling.data=t:this.T(r$2.createTextNode(t)),this._$AH=t;}$(t){const{values:i,_$litType$:s}=t,e="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=N.createElement(P(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===e)this._$AH.p(i);else {const t=new M(e,this),s=t.u(this.options);t.p(i),this.T(s),this._$AH=t;}}_$AC(t){let i=A.get(t.strings);return void 0===i&&A.set(t.strings,i=new N(t)),i}k(t){a(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let s,e=0;for(const h of t)e===i.length?i.push(s=new R(this.O(l$1()),this.O(l$1()),this,this.options)):s=i[e],s._$AI(h),e++;e<i.length&&(this._$AR(s&&s._$AB.nextSibling,e),i.length=e);}_$AR(t=this._$AA.nextSibling,i){for(this._$AP?.(false,true,i);t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i;}}setConnected(t){ void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t));}}class k{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,i,s,e,h){this.type=1,this._$AH=E,this._$AN=void 0,this.element=t,this.name=i,this._$AM=e,this.options=h,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=E;}_$AI(t,i=this,s,e){const h=this.strings;let o=false;if(void 0===h)t=S(this,t,i,0),o=!c(t)||t!==this._$AH&&t!==T,o&&(this._$AH=t);else {const e=t;let n,r;for(t=h[0],n=0;n<h.length-1;n++)r=S(this,e[s+n],i,n),r===T&&(r=this._$AH[n]),o||=!c(r)||r!==this._$AH[n],r===E?t=E:t!==E&&(t+=(r??"")+h[n+1]),this._$AH[n]=r;}o&&!e&&this.j(t);}j(t){t===E?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"");}}class H extends k{constructor(){super(...arguments),this.type=3;}j(t){this.element[this.name]=t===E?void 0:t;}}class I extends k{constructor(){super(...arguments),this.type=4;}j(t){this.element.toggleAttribute(this.name,!!t&&t!==E);}}class L extends k{constructor(t,i,s,e,h){super(t,i,s,e,h),this.type=5;}_$AI(t,i=this){if((t=S(this,t,i,0)??E)===T)return;const s=this._$AH,e=t===E&&s!==E||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,h=t!==E&&(s===E||e);e&&this.element.removeEventListener(this.name,this,s),h&&this.element.addEventListener(this.name,this,t),this._$AH=t;}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t);}}class z{constructor(t,i,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=s;}get _$AU(){return this._$AM._$AU}_$AI(t){S(this,t);}}const j=t$2.litHtmlPolyfillSupport;j?.(N,R),(t$2.litHtmlVersions??=[]).push("3.3.1");const B=(t,i,s)=>{const e=s?.renderBefore??i;let h=e._$litPart$;if(void 0===h){const t=s?.renderBefore??null;e._$litPart$=h=new R(i.insertBefore(l$1(),t),t,void 0,s??{});}return h._$AI(t),h};

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const s=globalThis;let i$1 = class i extends y$1{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0;}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const r=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=B(r,this.renderRoot,this.renderOptions);}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(true);}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(false);}render(){return T}};i$1._$litElement$=true,i$1["finalized"]=true,s.litElementHydrateSupport?.({LitElement:i$1});const o$1=s.litElementPolyfillSupport;o$1?.({LitElement:i$1});(s.litElementVersions??=[]).push("4.2.1");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$1=t=>(e,o)=>{ void 0!==o?o.addInitializer((()=>{customElements.define(t,e);})):customElements.define(t,e);};

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const o={attribute:true,type:String,converter:u$2,reflect:false,hasChanged:f$2},r$1=(t=o,e,r)=>{const{kind:n,metadata:i}=r;let s=globalThis.litPropertyMetadata.get(i);if(void 0===s&&globalThis.litPropertyMetadata.set(i,s=new Map),"setter"===n&&((t=Object.create(t)).wrapped=true),s.set(r.name,t),"accessor"===n){const{name:o}=r;return {set(r){const n=e.get.call(this);e.set.call(this,r),this.requestUpdate(o,n,t);},init(e){return void 0!==e&&this.C(o,void 0,t,e),e}}}if("setter"===n){const{name:o}=r;return function(r){const n=this[o];e.call(this,r),this.requestUpdate(o,n,t);}}throw Error("Unsupported decorator location: "+n)};function n(t){return (e,o)=>"object"==typeof o?r$1(t,e,o):((t,e,o)=>{const r=e.hasOwnProperty(o);return e.constructor.createProperty(o,t),r?Object.getOwnPropertyDescriptor(e,o):void 0})(t,e,o)}

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function r(r){return n({...r,state:true,attribute:false})}

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t={ATTRIBUTE:1,PROPERTY:3,BOOLEAN_ATTRIBUTE:4},e$1=t=>(...e)=>({_$litDirective$:t,values:e});class i{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,i){this._$Ct=t,this._$AM=e,this._$Ci=i;}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}}

/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const e=e$1(class extends i{constructor(t$1){if(super(t$1),t$1.type!==t.ATTRIBUTE||"class"!==t$1.name||t$1.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(t){return " "+Object.keys(t).filter((s=>t[s])).join(" ")+" "}update(s,[i]){if(void 0===this.st){this.st=new Set,void 0!==s.strings&&(this.nt=new Set(s.strings.join(" ").split(/\s/).filter((t=>""!==t))));for(const t in i)i[t]&&!this.nt?.has(t)&&this.st.add(t);return this.render(i)}const r=s.element.classList;for(const t of this.st)t in i||(r.remove(t),this.st.delete(t));for(const t in i){const s=!!i[t];s===this.st.has(t)||this.nt?.has(t)||(s?(r.add(t),this.st.add(t)):(r.remove(t),this.st.delete(t)));}return T}});

/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const f=o=>void 0===o.strings,u={},m=(o,t=u)=>o._$AH=t;

/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const l=e$1(class extends i{constructor(r){if(super(r),r.type!==t.PROPERTY&&r.type!==t.ATTRIBUTE&&r.type!==t.BOOLEAN_ATTRIBUTE)throw Error("The `live` directive is not allowed on child or event bindings");if(!f(r))throw Error("`live` bindings can only contain a single expression")}render(r){return r}update(i,[t$1]){if(t$1===T||t$1===E)return t$1;const o=i.element,l=i.name;if(i.type===t.PROPERTY){if(t$1===o[l])return T}else if(i.type===t.BOOLEAN_ATTRIBUTE){if(!!t$1===o.hasAttribute(l))return T}else if(i.type===t.ATTRIBUTE&&o.getAttribute(l)===t$1+"")return T;return m(i),t$1}});

const paths = {
    school: b `<path d="M22 10 12 5 2 10l10 5 10-5z"></path><path d="M6 12v5c3 2 9 2 12 0v-5"></path>`,
    bellRing: b `<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path><path d="M4 2C2.8 3.7 2 5.7 2 8M22 8c0-2.3-.8-4.3-2-6"></path>`,
    bellOff: b `<path d="M8.7 3A6 6 0 0 1 18 8c0 2 .2 3.6.6 5M17 17H3s3-2 3-9c0-.6.1-1.2.3-1.7M10.3 21a1.94 1.94 0 0 0 3.4 0M2 2l20 20"></path>`,
    alert: b `<circle cx="12" cy="12" r="9"></circle><path d="M12 8v4.5M12 16h.01"></path>`,
    cog: b `<circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"></path>`,
    close: b `<path d="M18 6 6 18M6 6l12 12"></path>`,
    power: b `<path d="M12 3v9"></path><path d="M18.4 6.6a9 9 0 1 1-12.8 0"></path>`,
    skip: b `<path d="m5 5 9 7-9 7V5zM19 5v14"></path>`,
    calendar: b `<rect x="3" y="5" width="18" height="16" rx="2"></rect><path d="M16 3v4M8 3v4M3 10h18"></path>`,
    bulb: b `<path d="M9 18h6M10 22h4"></path><path d="M15 14c.2-1 .7-1.7 1.5-2.5A5 5 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.8.8 1.3 1.5 1.5 2.5"></path>`,
    timer: b `<path d="M10 2h4M12 14l3-3"></path><circle cx="12" cy="14" r="8"></circle>`,
    screenOff: b `<rect x="3" y="4" width="18" height="13" rx="2"></rect><path d="M8 21h8M4 3l16 16"></path>`,
    play: b `<circle cx="12" cy="12" r="9"></circle><path d="m10 8.5 5 3.5-5 3.5v-7z"></path>`,
    stop: b `<rect x="6" y="6" width="12" height="12" rx="2"></rect>`,
    check: b `<path d="M20 6 9 17l-5-5"></path>`,
};
/** Stroke icons in currentColor; decorative, the text beside them carries meaning.
 *  Kept on one line so no whitespace leaks into a button's textContent. */
const icon = (name, cls = "i") => x `<svg class=${cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]}</svg>`;

/* "Bubble night" family style, shared in spirit with the House State, Water
   Guard and Access Control cards. Tokens live on :host so the settings dialog,
   which sits outside ha-card, carries them as well. */
const styles = i$4 `
  :host {
    display: block;
    width: 100%;
    box-sizing: border-box;
    color: var(--primary-text-color);
    --tfs-text: var(--primary-text-color, #1b1b1a);
    --tfs-muted: var(--secondary-text-color, #5b5a55);
    --tfs-armed: var(--success-color, #2e7d32);
    --tfs-go: var(--orange-color, #ea580c);
    --tfs-skip: var(--warning-color, #f59e0b);
    --tfs-neutral: var(--disabled-text-color, #8a8984);
    --tfs-accent: var(--primary-color, #03a9f4);
    --tfs-error: var(--error-color, #c62828);
    --tfs-surface: var(--ha-card-background, var(--card-background-color, #fff));
    --tfs-pill: var(--secondary-background-color, #f3f2ee);
    --tfs-radius: 20px;
    --tfs-tile: 16px;
  }
  :host([data-appearance="bubble"]) {
    --tfs-surface: var(
      --bubble-main-background-color,
      var(--ha-card-background, var(--card-background-color, #fff))
    );
    --tfs-pill: var(
      --bubble-secondary-background-color,
      var(--secondary-background-color, #f3f2ee)
    );
    --tfs-radius: var(--bubble-border-radius, 32px);
    --tfs-tile: var(--bubble-sub-button-border-radius, 22px);
  }
  * {
    box-sizing: border-box;
  }
  ha-card {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 16px;
    border-radius: var(--ha-card-border-radius, 16px);
    background: var(--tfs-surface);
    --sev: var(--tfs-neutral);
  }
  :host([data-appearance="bubble"]) ha-card {
    border: var(--bubble-border, none);
    border-radius: var(--bubble-border-radius, 32px);
    box-shadow: var(--bubble-box-shadow, var(--ha-card-box-shadow));
  }
  ha-card.is-armed {
    --sev: var(--tfs-armed);
  }
  ha-card.is-armed.skipping {
    --sev: var(--tfs-skip);
  }
  ha-card.is-alerting {
    --sev: var(--tfs-go);
  }

  .i {
    width: 22px;
    height: 22px;
    flex-shrink: 0;
  }
  .i.s {
    width: 18px;
    height: 18px;
  }
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
  }

  /* Title line with the Configure cog. */
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding-left: 8px;
  }
  .title {
    font-size: 17px;
    font-weight: 700;
    color: var(--tfs-muted);
    min-width: 0;
    overflow-wrap: anywhere;
  }
  .icon-button {
    flex: 0 0 44px;
    width: 44px;
    height: 44px;
    padding: 0;
    display: grid;
    place-items: center;
    border: 0;
    border-radius: 50%;
    color: var(--tfs-muted);
    background: var(--tfs-pill);
    cursor: pointer;
  }
  .icon-button:hover {
    color: var(--tfs-text);
  }

  /* Hero: status, the next alert time, context. */
  .circ {
    flex: 0 0 44px;
    width: 44px;
    height: 44px;
    border-radius: var(--bubble-icon-border-radius, 50%);
    display: grid;
    place-items: center;
    color: color-mix(in srgb, var(--sev) 75%, var(--tfs-text));
    background: color-mix(in srgb, var(--sev) 20%, transparent);
  }
  .circ.big {
    flex-basis: 52px;
    width: 52px;
    height: 52px;
  }
  .hero {
    display: flex;
    gap: 14px;
    align-items: center;
    padding: 14px;
    border-radius: var(--tfs-radius);
    background: var(--tfs-pill);
  }
  .hero-text {
    min-width: 0;
    flex: 1;
  }
  .status {
    font-size: 13px;
    font-weight: 600;
    color: color-mix(in srgb, var(--sev) 65%, var(--tfs-text));
  }
  .current {
    font-size: 32px;
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: -0.01em;
    font-variant-numeric: tabular-nums;
    overflow-wrap: anywhere;
  }
  .current.words {
    font-size: 24px;
  }
  .current.none {
    color: var(--tfs-muted);
  }
  .context {
    font-size: 13px;
    color: var(--tfs-muted);
    overflow-wrap: anywhere;
  }

  /* Alert takeover: amber, not red, because it is a reminder, not an emergency. */
  .alert {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 16px;
    border-radius: var(--tfs-radius);
    color: #fff;
    background: color-mix(in srgb, var(--tfs-go) 62%, #000);
  }
  .alert-head {
    display: flex;
    align-items: center;
    gap: 14px;
  }
  .alert .circ {
    color: color-mix(in srgb, var(--tfs-go) 70%, #000);
    background: #fff;
    animation: tfs-pulse 1.4s ease-in-out infinite;
  }
  .alert .status {
    color: rgb(255 255 255 / 0.85);
  }
  .hero-title {
    display: block;
    font-size: 28px;
    font-weight: 800;
    line-height: 1.1;
  }
  .hero-sub {
    display: block;
    font-size: 13px;
    color: rgb(255 255 255 / 0.85);
    overflow-wrap: anywhere;
  }
  .targets {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .target-line {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px;
  }
  .target-label {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 600;
    margin-right: 2px;
  }
  .chip {
    display: inline-flex;
    align-items: center;
    min-height: 32px;
    padding: 0 12px;
    border-radius: 16px;
    font-size: 14px;
    font-weight: 600;
    background: rgb(0 0 0 / 0.22);
    overflow-wrap: anywhere;
  }
  button.stop {
    min-height: 56px;
    border: 0;
    border-radius: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    font: inherit;
    font-size: 17px;
    font-weight: 800;
    color: color-mix(in srgb, var(--tfs-go) 62%, #000);
    background: #fff;
    cursor: pointer;
  }
  .alert button:focus-visible {
    outline-color: #fff;
  }

  /* Everyday controls. */
  .settings {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .toggles {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .pill {
    flex: 1 1 120px;
    min-width: 0;
    min-height: 48px;
    border: 0;
    border-radius: 24px;
    padding: 4px 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    font: inherit;
    font-weight: 600;
    color: var(--tfs-text);
    background: var(--tfs-pill);
    cursor: pointer;
    text-align: left;
  }
  .pill-text {
    display: flex;
    flex-direction: column;
    min-width: 0;
    line-height: 1.2;
  }
  .pill small {
    font-size: 12px;
    font-weight: 600;
    opacity: 0.85;
  }
  .pill.on {
    --pill-accent: var(--tfs-armed);
    color: color-mix(in srgb, var(--pill-accent) 65%, var(--tfs-text));
    background: color-mix(in srgb, var(--pill-accent) 22%, var(--tfs-pill));
  }
  .pill.skip.on {
    --pill-accent: var(--tfs-skip);
  }
  .pill.pending,
  .day.pending {
    animation: tfs-breathe 1.2s ease-in-out infinite;
  }

  /* This week at a glance. */
  .week-strip {
    list-style: none;
    margin: 0;
    padding: 6px;
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    gap: 4px;
    border-radius: var(--tfs-radius);
    background: var(--tfs-pill);
  }
  .wd {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    padding: 8px 2px;
    border-radius: var(--tfs-tile);
    min-width: 0;
    text-align: center;
  }
  .wd-name {
    font-size: 12px;
    font-weight: 600;
    color: var(--tfs-muted);
    text-transform: capitalize;
  }
  .wd-time {
    font-size: 14px;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    overflow-wrap: anywhere;
  }
  .wd.off .wd-time {
    color: var(--tfs-neutral);
    font-weight: 600;
  }
  .wd.today {
    box-shadow: inset 0 0 0 1.5px color-mix(in srgb, var(--tfs-text) 18%, transparent);
  }
  .wd.next {
    color: color-mix(in srgb, var(--sev) 65%, var(--tfs-text));
    background: color-mix(in srgb, var(--sev) 22%, transparent);
  }
  .wd.next .wd-name {
    color: inherit;
  }
  .wd.skipped .wd-time {
    text-decoration: line-through;
    color: var(--tfs-muted);
  }
  .dim {
    opacity: 0.55;
  }

  button:disabled,
  input:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
  button:focus-visible,
  input:focus-visible {
    outline: 2px solid var(--tfs-accent);
    outline-offset: 2px;
  }
  .error {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 6px 8px;
    color: var(--tfs-error);
    overflow-wrap: anywhere;
  }

  /* Configure dialog. */
  dialog {
    box-sizing: border-box;
    width: min(520px, calc(100vw - 24px));
    max-height: calc(100dvh - 32px);
    padding: 20px;
    border: 0;
    border-radius: 24px;
    color: var(--tfs-text);
    background: var(--tfs-surface);
    box-shadow: 0 16px 60px #0006;
    overflow: auto;
  }
  :host([data-appearance="bubble"]) dialog {
    border: var(--bubble-border, none);
    border-radius: var(--bubble-border-radius, 32px);
  }
  dialog[open] {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  dialog::backdrop {
    background: #0007;
  }
  .dialog-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding-left: 4px;
  }
  .dialog-header h2 {
    margin: 0;
    font-size: 20px;
    font-weight: 800;
    overflow-wrap: anywhere;
  }
  .section {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .label {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0 6px;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--tfs-muted);
  }
  .label .value {
    margin-left: auto;
    font-size: 15px;
    letter-spacing: 0;
    text-transform: none;
    color: var(--tfs-text);
    font-variant-numeric: tabular-nums;
  }
  .day {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 6px;
    border-radius: var(--tfs-radius);
    background: var(--tfs-pill);
  }
  .day-toggle {
    flex: 0 0 44px;
    width: 44px;
    height: 44px;
    padding: 0;
    display: grid;
    place-items: center;
    border: 0;
    border-radius: 50%;
    color: var(--tfs-muted);
    background: color-mix(in srgb, var(--tfs-text) 8%, transparent);
    cursor: pointer;
  }
  .day-toggle[aria-checked="true"] {
    color: #fff;
    background: color-mix(in srgb, var(--tfs-armed) 62%, #000);
  }
  .day-name {
    flex: 1;
    min-width: 0;
    font-weight: 700;
    overflow-wrap: anywhere;
  }
  .day.off .day-name {
    color: var(--tfs-muted);
    font-weight: 600;
  }
  .time-input {
    flex: 0 0 auto;
    min-height: 44px;
    padding: 0 14px;
    border: 0;
    border-radius: 22px;
    font: inherit;
    font-size: 17px;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    color: var(--tfs-text);
    background: color-mix(in srgb, var(--tfs-text) 8%, transparent);
    color-scheme: inherit;
  }
  .slider-field {
    padding: 12px 10px 6px;
    border-radius: var(--tfs-radius);
    background: var(--tfs-pill);
  }
  .slider-field .label {
    padding: 0 6px;
  }
  .slider-field ha-slider {
    display: block;
    width: 100%;
  }
  .sliders {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6px;
  }
  ha-selector {
    display: block;
    min-width: 0;
  }
  .footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    flex-wrap: wrap;
    padding: 6px 6px 6px 14px;
    border-radius: var(--tfs-radius);
    background: var(--tfs-pill);
  }
  .footer-note {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: var(--tfs-muted);
    min-width: 0;
  }
  .text-button {
    min-height: 44px;
    padding: 0 16px;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    border: 0;
    border-radius: 22px;
    font: inherit;
    font-weight: 700;
    color: var(--tfs-text);
    background: color-mix(in srgb, var(--tfs-text) 8%, transparent);
    cursor: pointer;
  }

  @keyframes tfs-pulse {
    0%,
    100% {
      box-shadow: 0 0 0 0 rgb(255 255 255 / 0.5);
    }
    50% {
      box-shadow: 0 0 0 10px rgb(255 255 255 / 0);
    }
  }
  @keyframes tfs-breathe {
    50% {
      opacity: 0.55;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .alert .circ,
    .pill.pending,
    .day.pending {
      animation: none;
    }
  }
  @media (max-width: 400px) {
    ha-card {
      padding: 12px;
    }
    .current {
      font-size: 26px;
    }
    .hero-title {
      font-size: 24px;
    }
    .week-strip {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }
    .sliders {
      grid-template-columns: 1fr;
    }
    dialog {
      padding: 14px;
    }
  }
`;

let TimeForSchoolCardEditor = class TimeForSchoolCardEditor extends i$1 {
    _t(key) { return localize(this.hass, key); }
    setConfig(config) {
        this._config = { appearance: "default", ...config };
    }
    _valueChanged(ev) {
        ev.stopPropagation();
        if (!this._config)
            return;
        const value = { ...ev.detail.value };
        if (value.name === "")
            delete value.name;
        const newConfig = { ...this._config, ...value };
        if (!("name" in value))
            delete newConfig.name;
        this.dispatchEvent(new CustomEvent("config-changed", {
            detail: { config: newConfig },
            bubbles: true,
            composed: true
        }));
    }
    render() {
        if (!this.hass || !this._config)
            return x ``;
        const SCHEMA = [
            {
                name: "appearance",
                selector: {
                    select: {
                        mode: "dropdown",
                        options: [
                            { value: "default", label: this._t("Default") },
                            { value: "bubble", label: this._t("Bubble") }
                        ]
                    }
                }
            },
            {
                name: "entity",
                required: true,
                selector: { entity: { integration: "time_for_school", domain: "sensor" } }
            },
            { name: "name", selector: { text: {} } }
        ];
        const LABELS = {
            appearance: this._t("Appearance"),
            entity: this._t("Time for School entity"),
            name: this._t("Name (optional)")
        };
        return x `
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${SCHEMA}
        .computeLabel=${(s) => LABELS[s.name] ?? s.name}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `;
    }
};
TimeForSchoolCardEditor.styles = i$4 `
    ha-form {
      display: block;
      padding: 8px 0;
    }
  `;
__decorate([
    n({ attribute: false })
], TimeForSchoolCardEditor.prototype, "hass", void 0);
__decorate([
    r()
], TimeForSchoolCardEditor.prototype, "_config", void 0);
TimeForSchoolCardEditor = __decorate([
    t$1("lovelace-time-for-school-editor")
], TimeForSchoolCardEditor);

const WEEKDAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
const WEEKDAY_LABELS = {
    mon: "Monday",
    tue: "Tuesday",
    wed: "Wednesday",
    thu: "Thursday",
    fri: "Friday",
    sat: "Saturday",
    sun: "Sunday"
};
const STATE_LABELS = {
    disarmed: "Off",
    armed: "Armed",
    alerting: "Time to go!",
    unavailable: "Unavailable",
    unknown: "Unknown"
};
const STATE_ICONS = {
    disarmed: "bellOff",
    armed: "school",
    alerting: "bellRing"
};
/** JavaScript Date.getDay() index to the integration's weekday keys. */
const JS_DAY_KEYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
let TimeForSchoolCard = class TimeForSchoolCard extends i$1 {
    constructor() {
        super(...arguments);
        this._draft = {};
        this._busy = null;
    }
    _t(key) { return localize(this.hass, key); }
    setConfig(config) {
        if (!config.entity) {
            throw new Error(this._t("Define an entity") + ": lovelace-time-for-school-card");
        }
        this._config = config;
        this.setAttribute("data-appearance", config.appearance === "bubble" ? "bubble" : "default");
    }
    getCardSize() {
        return 3;
    }
    static getConfigElement() {
        return document.createElement("lovelace-time-for-school-editor");
    }
    static getStubConfig(hass) {
        const found = hass
            ? Object.values(hass.states).find((s) => s.entity_id.startsWith("sensor.") &&
                "schedule" in s.attributes &&
                "blink_count" in s.attributes)
            : undefined;
        return { type: "custom:lovelace-time-for-school-card", entity: found?.entity_id ?? "" };
    }
    connectedCallback() {
        super.connectedCallback();
        this._tick = window.setInterval(() => this.requestUpdate(), 30000);
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        if (this._tick)
            window.clearInterval(this._tick);
    }
    // ---------------------------------------------------------------- helpers
    _entity() {
        return this.hass?.states?.[this._config?.entity];
    }
    _lang() {
        return formattingLocale(this.hass);
    }
    _fmtTime(value) {
        if (!value)
            return "";
        const d = new Date(value);
        if (Number.isNaN(d.getTime()))
            return String(value);
        return d.toLocaleTimeString(this._lang(), { hour: "2-digit", minute: "2-digit" });
    }
    _fmtDay(value) {
        if (!value)
            return "";
        const d = new Date(value);
        if (Number.isNaN(d.getTime()))
            return "";
        const now = new Date();
        const startOf = (x) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
        const dayDiff = Math.round((startOf(d) - startOf(now)) / 86400000);
        if (dayDiff === 0)
            return this._t("Today");
        if (dayDiff === 1)
            return this._t("Tomorrow");
        return d.toLocaleDateString(this._lang(), { weekday: "short" });
    }
    _fmtRelative(value) {
        if (!value)
            return "";
        const diffMin = Math.round((new Date(value).getTime() - Date.now()) / 60000);
        if (Number.isNaN(diffMin))
            return "";
        const abs = Math.abs(diffMin);
        const h = Math.floor(abs / 60);
        const m = abs % 60;
        const span = h ? (m ? `${h} ${this._t("h")} ${m} min` : `${h} ${this._t("h")}`) : `${m} min`;
        return diffMin >= 0 ? `${this._t("in")} ${span}` : `${span} ${this._t("ago")}`;
    }
    /** Locale-aware clock for an "HH:MM" schedule time; keeps the raw value if malformed. */
    _fmtClock(value) {
        const [h, m] = value.split(":").map(Number);
        if (!Number.isInteger(h) || !Number.isInteger(m))
            return value;
        const d = new Date(2024, 0, 1, h, m);
        return d.toLocaleTimeString(this._lang(), { hour: "2-digit", minute: "2-digit" });
    }
    _shortDay(index) {
        // 1 January 2024 was a Monday.
        return new Date(2024, 0, 1 + index).toLocaleDateString(this._lang(), { weekday: "short" });
    }
    _dayKey(value) {
        if (!value)
            return null;
        const d = new Date(value);
        return Number.isNaN(d.getTime()) ? null : JS_DAY_KEYS[d.getDay()];
    }
    _normalizeTime(value) {
        if (!value)
            return "07:45";
        const s = String(value);
        return s.length >= 5 && s.indexOf(":") === 2 ? s.slice(0, 5) : "07:45";
    }
    _toast(message) {
        this.dispatchEvent(new CustomEvent("hass-notification", { detail: { message }, bubbles: true, composed: true }));
    }
    async _call(service, data = {}, label = service) {
        this._busy = label;
        try {
            await this.hass.callService("time_for_school", service, {
                entity_id: this._config.entity,
                ...data
            });
        }
        catch (err) {
            const msg = err?.message || err?.error || String(err);
            this._toast(`${this._t("Time for school")}: ${this._t("Action failed")} (${msg})`);
        }
        finally {
            this._busy = null;
        }
    }
    _set(partial, label = "set_config") {
        return this._call("set_config", partial, label);
    }
    _name(entityId) {
        return this.hass?.states?.[entityId]?.attributes?.friendly_name || entityId;
    }
    _setDay(day, partial) {
        return this._call("set_day", { day, ...partial }, `day-${day}`);
    }
    _openSettings() {
        this.renderRoot.querySelector("dialog")?.showModal();
    }
    _closeSettings() {
        this.renderRoot.querySelector("dialog")?.close();
    }
    _sliderInput(key, ev) {
        this._draft = { ...this._draft, [key]: Number(ev.target.value) };
    }
    async _sliderChange(key, ev) {
        await this._set({ [key]: Number(ev.target.value) });
        const draft = { ...this._draft };
        delete draft[key];
        this._draft = draft;
    }
    // ---------------------------------------------------------------- render
    render() {
        const stateObj = this._entity();
        if (!stateObj) {
            return x `
        <ha-card>
          <div class="error">
            ${icon("alert")}
            <span>${this._t("Entity not found")}: ${this._config?.entity || this._t("(not set)")}</span>
          </div>
        </ha-card>
      `;
        }
        const a = stateObj.attributes;
        const st = stateObj.state;
        const alerting = st === "alerting";
        // Actions stay off while the entity reports no data.
        const available = st !== "unavailable" && st !== "unknown";
        const enabled = Boolean(a.enabled);
        const skipNext = Boolean(a.skip_next);
        const schedule = a.schedule ?? {};
        const blinkCount = this._draft.blink_count ?? Number(a.blink_count ?? 5);
        const blinkInterval = this._draft.blink_interval ?? Number(a.blink_interval ?? 1);
        const nextFire = a.next_fire ?? null;
        const skippedFire = a.skipped_fire ?? null;
        const runStarted = a.run_started ?? null;
        const offEntities = Array.isArray(a.off_entities) ? a.off_entities : [];
        const blinkLights = Array.isArray(a.blink_lights) ? a.blink_lights : [];
        const title = this._config.name || a.friendly_name || this._t("Time for school");
        const statusLabel = STATE_LABELS[st] ? this._t(STATE_LABELS[st]) : st;
        return x `
      <ha-card class=${e({ [`is-${st}`]: true, skipping: skipNext })}>
        <div class="header">
          <div class="title">${title}</div>
          <button class="icon-button" type="button" title=${this._t("Configure")} aria-label=${this._t("Configure")}
            aria-haspopup="dialog" @click=${this._openSettings}>${icon("cog")}</button>
        </div>

        ${alerting
            ? this._renderAlert(statusLabel, runStarted, offEntities, blinkLights)
            : this._renderHero(st, statusLabel, nextFire)}

        <div class="settings">
          <div class="toggles">
            ${this._renderToggle("enabled", "power", this._t("Enabled"), enabled, !available)}
            ${this._renderToggle("skip_next", "skip", this._t("Skip next"), skipNext, !available || !enabled, skipNext && skippedFire ? `${this._fmtDay(skippedFire)} ${this._fmtTime(skippedFire)}` : "")}
          </div>
          ${this._renderWeekStrip(schedule, enabled, alerting ? null : nextFire, skipNext ? skippedFire : null)}
        </div>
      </ha-card>

      <dialog aria-labelledby="settings-title" @click=${(e) => {
            if (e.target !== e.currentTarget)
                return;
            const rect = e.currentTarget.getBoundingClientRect();
            if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) {
                this._closeSettings();
            }
        }}>
        <div class="dialog-header">
          <h2 id="settings-title">${title} ${this._t("settings")}</h2>
          <button class="icon-button" type="button" title=${this._t("Close settings")} aria-label=${this._t("Close settings")}
            autofocus @click=${this._closeSettings}>${icon("close")}</button>
        </div>
        <div class="settings">
          <section class="section week">
            <span class="label">${icon("calendar", "i s")}${this._t("Weekly schedule")}</span>
            ${WEEKDAYS.map((day) => {
            const d = schedule[day] ?? { enabled: false, time: "07:45" };
            const dayLabel = this._t(WEEKDAY_LABELS[day]);
            const pending = this._busy === `day-${day}`;
            return x `
                <div class=${e({ day: true, off: !d.enabled, dim: !enabled, pending })} data-day=${day}>
                  <button
                    class="day-toggle"
                    type="button"
                    role="switch"
                    aria-checked=${d.enabled ? "true" : "false"}
                    aria-label=${`${dayLabel} ${this._t("Enabled")}`}
                    ?disabled=${pending || !available}
                    @click=${() => this._setDay(day, { enabled: !d.enabled })}
                  >${d.enabled ? icon("check", "i s") : E}</button>
                  <span class="day-name">${dayLabel}</span>
                  <input
                    class="time-input"
                    type="time"
                    aria-label=${`${dayLabel} ${this._t("Time")}`}
                    .value=${l(this._normalizeTime(d.time))}
                    ?disabled=${!d.enabled || pending || !available}
                    @change=${(e) => this._setDay(day, { time: e.target.value })}
                  />
                </div>
              `;
        })}
          </section>

          <div class="sliders">
            ${this._renderSlider("bulb", this._t("Blink count"), "blink_count", blinkCount, 1, 20, 1, `${blinkCount}×`, !available)}
            ${this._renderSlider("timer", this._t("Blink interval"), "blink_interval", blinkInterval, 0.2, 5, 0.1, `${blinkInterval.toLocaleString(this._lang(), { minimumFractionDigits: 1, maximumFractionDigits: 1 })} s`, !available)}
          </div>

          <section class="section">
            <span class="label">${icon("screenOff", "i s")}${this._t("Turns off")}</span>
            ${this._renderTargets("off_entities", offEntities, ["media_player", "switch", "light", "fan", "remote", "input_boolean"], !available)}
          </section>
          <section class="section">
            <span class="label">${icon("bulb", "i s")}${this._t("Blinks")}</span>
            ${this._renderTargets("blink_lights", blinkLights, ["light"], !available)}
          </section>
        </div>

        <div class="footer">
          <span class="footer-note">
            ${nextFire && !alerting
            ? x `${icon("bellRing", "i s")}
                  ${this._t("Next:")} ${this._fmtDay(nextFire)} ${this._fmtTime(nextFire)}`
            : enabled
                ? alerting
                    ? E
                    : x `${icon("bellOff", "i s")} ${this._t("No day enabled")}`
                : x `${icon("bellOff", "i s")} ${this._t("Alert is off")}`}
          </span>
          <button
            class="text-button"
            type="button"
            ?disabled=${this._busy === "trigger_now" || !available}
            @click=${() => {
            this._closeSettings();
            return this._call("trigger_now");
        }}
          >${icon("play", "i s")}<span>${this._t("Test now")}</span></button>
        </div>
      </dialog>
    `;
    }
    _renderHero(st, statusLabel, nextFire) {
        let headline;
        let context = "";
        let kind = "words";
        if (st === "armed" && nextFire) {
            headline = this._fmtTime(nextFire);
            context = `${this._fmtDay(nextFire)} · ${this._fmtRelative(nextFire)}`;
            kind = "time";
        }
        else if (st === "armed") {
            headline = this._t("No upcoming alert");
        }
        else if (st === "disarmed") {
            headline = this._t("Alert is off");
        }
        else {
            headline = "--:--";
            kind = "none";
        }
        return x `
      <div class="hero">
        <div class="circ big">${icon(STATE_ICONS[st] ?? "alert")}</div>
        <div class="hero-text">
          <div class="status">${statusLabel}</div>
          <div class=${e({ current: true, words: kind === "words", none: kind === "none" })}>${headline}</div>
          ${context ? x `<div class="context">${context}</div>` : E}
        </div>
      </div>
    `;
    }
    _renderAlert(statusLabel, runStarted, offEntities, blinkLights) {
        const line = (iconName, label, ids) => ids.length
            ? x `<div class="target-line">
            <span class="target-label">${icon(iconName, "i s")}${label}</span>
            ${ids.map((id) => x `<span class="chip">${this._name(id)}</span>`)}
          </div>`
            : E;
        return x `
      <div class="alert">
        <div class="alert-head">
          <div class="circ big">${icon("bellRing")}</div>
          <div class="hero-text">
            <div class="status">${statusLabel}</div>
            <span class="hero-title">${this._t("Time for school!")}</span>
            <span class="hero-sub">${this._t("Lights are blinking and screens are off · since")} ${this._fmtTime(runStarted)}</span>
          </div>
        </div>
        ${blinkLights.length || offEntities.length
            ? x `<div class="targets">
              ${line("bulb", this._t("Blinks"), blinkLights)}
              ${line("screenOff", this._t("Turns off"), offEntities)}
            </div>`
            : E}
        <button class="stop" type="button" ?disabled=${this._busy === "stop"} @click=${() => this._call("stop")}
          >${icon("stop")}<span>${this._t("Stop")}</span></button>
      </div>
    `;
    }
    _renderToggle(key, iconName, label, checked, disabled, detail = "") {
        const busyLabel = `toggle-${key}`;
        const pending = this._busy === busyLabel;
        return x `
      <button
        class=${e({ pill: true, skip: key === "skip_next", on: checked, pending })}
        type="button"
        role="switch"
        aria-checked=${checked ? "true" : "false"}
        aria-busy=${pending ? "true" : "false"}
        data-toggle=${key}
        ?disabled=${disabled || pending}
        @click=${() => this._set({ [key]: !checked }, busyLabel)}
      >${icon(iconName)}<span class="pill-text"><span>${label}</span>${detail ? x `<small>${detail}</small>` : E}</span></button>
    `;
    }
    _renderWeekStrip(schedule, enabled, nextFire, skippedFire) {
        const nextKey = this._dayKey(nextFire);
        const skipKey = this._dayKey(skippedFire);
        const todayKey = JS_DAY_KEYS[new Date().getDay()];
        return x `
      <ul class=${e({ "week-strip": true, dim: !enabled })} aria-label=${this._t("This week")}>
        ${WEEKDAYS.map((day, index) => {
            const d = schedule[day];
            const on = Boolean(d?.enabled);
            return x `
            <li class=${e({ wd: true, off: !on, today: day === todayKey, next: on && day === nextKey, skipped: on && day === skipKey })}
              data-day=${day}>
              <span class="wd-name" aria-hidden="true">${this._shortDay(index)}</span>
              <span class="sr-only">${this._t(WEEKDAY_LABELS[day])}</span>
              <span class="wd-time">${on
                ? this._fmtClock(this._normalizeTime(d.time))
                : x `<span aria-hidden="true">–</span><span class="sr-only">${this._t("Off")}</span>`}</span>
            </li>
          `;
        })}
      </ul>
    `;
    }
    _renderSlider(iconName, label, key, value, min, max, step, display, disabled) {
        return x `
      <div class="field slider-field">
        <span class="label">
          ${icon(iconName, "i s")}${label}
          <span class="value">${display}</span>
        </span>
        <ha-slider
          min=${min}
          max=${max}
          step=${step}
          .value=${value}
          .disabled=${disabled}
          @input=${(e) => this._sliderInput(key, e)}
          @change=${(e) => this._sliderChange(key, e)}
        ></ha-slider>
      </div>
    `;
    }
    _renderTargets(key, value, domains, disabled) {
        return x `
      <ha-selector
        .hass=${this.hass}
        .selector=${{ entity: { multiple: true, domain: domains } }}
        .value=${value}
        .label=${key === "off_entities" ? this._t("Turns off") : this._t("Blinks")}
        .disabled=${this._busy !== null || disabled}
        @value-changed=${(ev) => {
            ev.stopPropagation();
            const selected = ev.detail.value ?? [];
            if (Array.isArray(selected) && selected.every((item) => typeof item === "string")) {
                void this._set({ [key]: selected });
            }
        }}
      ></ha-selector>
    `;
    }
};
TimeForSchoolCard.styles = styles;
__decorate([
    n({ attribute: false })
], TimeForSchoolCard.prototype, "hass", void 0);
__decorate([
    r()
], TimeForSchoolCard.prototype, "_config", void 0);
__decorate([
    r()
], TimeForSchoolCard.prototype, "_draft", void 0);
__decorate([
    r()
], TimeForSchoolCard.prototype, "_busy", void 0);
TimeForSchoolCard = __decorate([
    t$1("lovelace-time-for-school-card")
], TimeForSchoolCard);
window.customCards = window.customCards || [];
window.customCards.push({
    type: "lovelace-time-for-school-card",
    name: "Time for School Card",
    description: "Weekly 'time to leave for school' alert: schedule per weekday, blink settings, stop.",
    preview: true
});

export { TimeForSchoolCard };
//# sourceMappingURL=lovelace-time-for-school.js.map

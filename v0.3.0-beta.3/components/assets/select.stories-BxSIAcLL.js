import{v as Me}from"./v4-CtRu48qb.js";import{d as he,w as q,o as f,b as m,m as D,F as Ae,B as Be,y as _e,n as A,t as Oe,f as K,s as Ce,l as p,G as Ne,x as Le,e as ze,u as We,p as Z,g as ee,T as qe,k as h,A as Ke}from"./vue.esm-bundler-Cs-mJWlm.js";import{_ as te}from"./DsIcon-C5sMU4Mg.js";import{v as Ye,p as je}from"./error-tooltip-CV4LXMxl.js";import"./pdf-render.util-P7DRlDqo.js";import"./_commonjsHelpers-Bx2EM-6T.js";const Fe={class:"panel"},$e={class:"panel-scroll"},Ue=["disabled","onClick"],Ge={key:0,class:"panel-empty"},xe=he({__name:"DsSelectPanel",props:{options:{default:()=>[]},activeIndex:{default:-1},width:{default:0}},emits:["optionSelected"],setup(e,{emit:a}){const l=e,s=a,c=p([]);q(()=>l.activeIndex,r=>{r>=0&&setTimeout(()=>{var i;return(i=c.value[r])==null?void 0:i.scrollIntoView({block:"nearest"})})},{immediate:!0});function u(r){r.disabled||s("optionSelected",r.value)}return(r,i)=>(f(),m("div",{class:"ds-select-panel",style:Ce({position:"fixed",minWidth:`${e.width}px`,maxWidth:e.width?`${e.width}px`:void 0})},[D("div",Fe,[D("div",$e,[(f(!0),m(Ae,null,Be(e.options,(o,v)=>(f(),m("button",{key:v,ref_for:!0,ref_key:"optionEls",ref:c,class:A(["panel-option",{"panel-option--disabled":o.disabled,"panel-option--active":v===e.activeIndex}]),type:"button",disabled:o.disabled,onMousedown:i[0]||(i[0]=_e(()=>{},["prevent"])),onClick:d=>u(o)},Oe(o.label),43,Ue))),128)),e.options.length===0?(f(),m("div",Ge,"無符合結果")):K("",!0)]),i[1]||(i[1]=D("div",{class:"panel-inset-border"},null,-1))])],4))}});xe.__docgenInfo={exportName:"default",displayName:"DsSelectPanel",description:"",tags:{},props:[{name:"options",required:!1,type:{name:"Array",elements:[{name:"SelectOption"}]},defaultValue:{func:!1,value:"() => []"}},{name:"activeIndex",required:!1,type:{name:"number"},defaultValue:{func:!1,value:"-1"}},{name:"width",description:"min-width／max-width 對齊觸發框寬度（px）；0 表示還沒量到，不設寬度",required:!1,type:{name:"number"},defaultValue:{func:!1,value:"0"}}],events:[{name:"optionSelected",type:{names:["unknown"]}}],sourceFiles:["/home/runner/work/mendesky-ds-vue/mendesky-ds-vue/src/components/select/DsSelectPanel.vue"]};const Xe={class:"ds-select"},He={class:"select-box"},Je=["tabindex","aria-expanded","aria-disabled"],Qe=["placeholder","value","disabled"],Ze={class:"select-suffix"};function et(e,a){if(e===a)return!0;if(e.length!==a.length)return!1;for(let l=0;l<e.length;l++)if(e[l].value!==a[l].value||e[l].label!==a[l].label||e[l].disabled!==a[l].disabled)return!1;return!0}const Y=he({__name:"DsSelect",props:{modelValue:{default:void 0},options:{default:()=>[]},placeholder:{default:"請選擇"},errorMessage:{default:""},size:{default:"M"},errorPosition:{default:"bottom"},searchable:{type:Boolean,default:!1},clearable:{type:Boolean,default:!1},disabled:{type:Boolean,default:!1}},emits:["update:modelValue"],setup(e,{expose:a,emit:l}){const s=e,c=l,u=Ne(s.options??[]);q(()=>s.options,t=>{const n=t??[];et(u.value,n)||(u.value=n)});const r=p(s.modelValue??null);q(()=>s.modelValue,t=>r.value=t??null);const i=h(()=>s.disabled),o=p(!1),v=p(""),d=p(-1),_=p(!1),S=p(0),g=p(null),b=p(null),w=p(null),F=p(null),C=h(()=>{var t;return((t=u.value.find(n=>n.value===r.value))==null?void 0:t.label)??""}),k=h(()=>r.value!==null&&r.value!==void 0),Te=h(()=>!!s.errorMessage),Ee=h(()=>o.value?v.value:C.value),De=h(()=>o.value&&C.value||s.placeholder),T=h(()=>{const t=v.value.trim().toLowerCase();return t?u.value.filter(n=>n.label.toLowerCase().includes(t)):u.value}),N=()=>s.searchable?b.value:w.value;function L(t){r.value=t,c("update:modelValue",t)}function ke(t){t.preventDefault(),t.stopPropagation(),L(null)}function Ve(t){t.stopPropagation()}function Pe(){i.value||(o.value?y():O())}function $(){_.value=!0}function U(){_.value=!1}function Re(t){v.value=t.target.value,o.value||O(),d.value=-1}function G(t){var n;switch(t.key){case"ArrowDown":t.preventDefault(),o.value?X(1):(O(),d.value===-1&&(d.value=0));break;case"ArrowUp":t.preventDefault(),o.value?X(-1):(O(),d.value===-1&&(d.value=T.value.length-1));break;case"Enter":case" ":o.value?(t.preventDefault(),t.stopPropagation(),H()):i.value||(t.preventDefault(),t.stopPropagation(),O(),d.value===-1&&(d.value=0));break;case"Tab":o.value&&H();break;case"Escape":o.value&&t.stopPropagation(),y(),(n=N())==null||n.blur();break}}function X(t){var Q;const n=T.value;if(n.length===0)return;const E=d.value;let x=E===-1?t===1?0:n.length-1:(E+t+n.length)%n.length,J=0;for(;(Q=n[x])!=null&&Q.disabled&&J<n.length;)x=(x+t+n.length)%n.length,J++;d.value=x}function H(){const t=d.value,n=T.value;t>=0&&t<n.length&&!n[t].disabled&&L(n[t].value),y()}function Ie(t){var n;L(t),y(),(n=N())==null||n.focus()}let z=null;function O(){var t;o.value||i.value||!g.value||(S.value=g.value.getBoundingClientRect().width,d.value=T.value.findIndex(n=>n.value===r.value),o.value=!0,(t=N())==null||t.focus(),Ke(()=>{var E;const n=(E=F.value)==null?void 0:E.$el;!o.value||!n||!g.value||(z=je.attach(g.value,n,{placement:"bottom-start",gap:4,trackScroll:!0,scrollContainerStrategy:"document",closeOnClickOutside:!0,closeOnEscape:!1,onClose:x=>{x!=="manual"&&y()}}))}))}function y(){if(!o.value)return;const t=z;z=null,t==null||t.detach(),v.value="",d.value=-1,o.value=!1}return Le(y),a({open:O,close:y}),(t,n)=>(f(),m("span",Xe,[ze((f(),m("div",{ref_key:"triggerWrap",ref:g,class:A(["select-wrap",{"select-wrap--m":e.size==="M","select-wrap--s":e.size==="S","select-wrap--open":o.value,"select-wrap--focused":_.value&&!o.value&&!i.value,"select-wrap--actived":k.value&&!o.value,"select-wrap--error":Te.value,"select-wrap--disabled":i.value}]),onClick:Pe,onPointerdown:Ve},[D("div",He,[e.searchable?(f(),m("input",{key:1,ref_key:"triggerInput",ref:b,class:"select-field",type:"text",autocomplete:"off",placeholder:De.value,value:Ee.value,disabled:i.value,onFocus:$,onBlur:U,onInput:Re,onKeydown:G},null,40,Qe)):(f(),m("div",{key:0,ref_key:"triggerDiv",ref:w,class:A(["select-field select-field--readonly",{"select-field--placeholder":!k.value}]),tabindex:i.value?void 0:0,role:"combobox","aria-expanded":o.value,"aria-disabled":i.value||void 0,onFocus:$,onBlur:U,onKeydown:G},Oe(k.value?C.value:e.placeholder),43,Je)),D("div",Ze,[e.clearable&&k.value&&!i.value?(f(),m("button",{key:0,type:"button",class:"select-clear","data-testid":"select-clear",tabindex:"-1","aria-label":"清除",onMousedown:ke,onClick:n[0]||(n[0]=_e(()=>{},["stop"]))},[Z(te,{name:"No-X-Cancel",size:"16"})],32)):K("",!0),Z(te,{name:"DownArrow",size:"16",class:A(["select-arrow",{"select-arrow--open":o.value}]),style:{color:"var(--text/disabled)"}},null,8,["class"])])])],34)),[[We(Ye),{message:e.errorMessage,position:e.errorPosition,disabled:i.value}]]),(f(),ee(qe,{to:"body"},[o.value?(f(),ee(xe,{key:0,ref_key:"panel",ref:F,options:T.value,"active-index":d.value,width:S.value,onOptionSelected:Ie},null,8,["options","active-index","width"])):K("",!0)]))]))}});Y.__docgenInfo={exportName:"default",displayName:"DsSelect",description:"",tags:{},expose:[{name:"open"},{name:"close"}],props:[{name:"modelValue",required:!1,type:{name:"unknown"},defaultValue:{func:!1,value:"undefined"}},{name:"options",required:!1,type:{name:"Array",elements:[{name:"SelectOption"}]},defaultValue:{func:!1,value:"() => []"}},{name:"placeholder",required:!1,type:{name:"string"},defaultValue:{func:!1,value:"'請選擇'"}},{name:"errorMessage",required:!1,type:{name:"string"},defaultValue:{func:!1,value:"''"}},{name:"size",required:!1,type:{name:"union",elements:[{name:'"S"'},{name:'"M"'},{name:'"L"'}]},defaultValue:{func:!1,value:"'M'"}},{name:"errorPosition",required:!1,type:{name:"union",elements:[{name:'"top"'},{name:'"bottom"'}]},defaultValue:{func:!1,value:"'bottom'"}},{name:"searchable",description:"可輸入文字過濾選項（會叫出手機鍵盤，需要時才開）",required:!1,type:{name:"boolean"},defaultValue:{func:!1,value:"false"}},{name:"clearable",required:!1,type:{name:"boolean"},defaultValue:{func:!1,value:"false"}},{name:"disabled",required:!1,type:{name:"boolean"},defaultValue:{func:!1,value:"false"}}],events:[{name:"update:modelValue",type:{names:["unknown"]}}],sourceFiles:["/home/runner/work/mendesky-ds-vue/mendesky-ds-vue/src/components/select/DsSelect.vue"]};const{addons:tt}=__STORYBOOK_MODULE_PREVIEW_API__,{ImplicitActionsDuringRendering:at}=__STORYBOOK_MODULE_CORE_EVENTS_PREVIEW_ERRORS__,{global:ae}=__STORYBOOK_MODULE_GLOBAL__;var lt=Object.defineProperty,nt=(e,a)=>{for(var l in a)lt(e,l,{get:a[l],enumerable:!0})},st="storybook/actions",ot=`${st}/action-event`,rt={depth:10,clearOnStoryChange:!0,limit:50},Se=(e,a)=>{let l=Object.getPrototypeOf(e);return!l||a(l)?l:Se(l,a)},it=e=>!!(typeof e=="object"&&e&&Se(e,a=>/^Synthetic(?:Base)?Event$/.test(a.constructor.name))&&typeof e.persist=="function"),ut=e=>{if(it(e)){let a=Object.create(e.constructor.prototype,Object.getOwnPropertyDescriptors(e));a.persist();let l=Object.getOwnPropertyDescriptor(a,"view"),s=l==null?void 0:l.value;return typeof s=="object"&&(s==null?void 0:s.constructor.name)==="Window"&&Object.defineProperty(a,"view",{...l,value:Object.create(s.constructor.prototype)}),a}return e},ct=()=>typeof crypto=="object"&&typeof crypto.getRandomValues=="function"?Me():Date.now().toString(36)+Math.random().toString(36).substring(2);function j(e,a={}){let l={...rt,...a},s=function(...c){var _,S;if(a.implicit){let g=(_="__STORYBOOK_PREVIEW__"in ae?ae.__STORYBOOK_PREVIEW__:void 0)==null?void 0:_.storyRenders.find(b=>b.phase==="playing"||b.phase==="rendering");if(g){let b=!((S=globalThis==null?void 0:globalThis.FEATURES)!=null&&S.disallowImplicitActionsInRenderV8),w=new at({phase:g.phase,name:e,deprecated:b});if(b)console.warn(w);else throw w}}let u=tt.getChannel(),r=ct(),i=5,o=c.map(ut),v=c.length>1?o:o[0],d={id:r,count:0,data:{name:e,args:v},options:{...l,maxDepth:i+(l.depth||3),allowFunction:l.allowFunction||!1}};u.emit(ot,d)};return s.isAction=!0,s.implicit=a.implicit,s}const{definePreview:wt}=__STORYBOOK_MODULE_PREVIEW_API__,{global:W}=__STORYBOOK_MODULE_GLOBAL__;var dt={};nt(dt,{argsEnhancers:()=>vt,loaders:()=>gt});var we=(e,a)=>typeof a[e]>"u"&&!(e in a),pt=e=>{let{initialArgs:a,argTypes:l,id:s,parameters:{actions:c}}=e;if(!c||c.disable||!c.argTypesRegex||!l)return{};let u=new RegExp(c.argTypesRegex);return Object.entries(l).filter(([r])=>!!u.test(r)).reduce((r,[i,o])=>(we(i,a)&&(r[i]=j(i,{implicit:!0,id:s})),r),{})},ft=e=>{let{initialArgs:a,argTypes:l,parameters:{actions:s}}=e;return s!=null&&s.disable||!l?{}:Object.entries(l).filter(([c,u])=>!!u.action).reduce((c,[u,r])=>(we(u,a)&&(c[u]=j(typeof r.action=="string"?r.action:u)),c),{})},vt=[ft,pt],le=!1,mt=e=>{let{parameters:{actions:a}}=e;if(!(a!=null&&a.disable)&&!le&&"__STORYBOOK_TEST_ON_MOCK_CALL__"in W&&typeof W.__STORYBOOK_TEST_ON_MOCK_CALL__=="function"){let l=W.__STORYBOOK_TEST_ON_MOCK_CALL__;l((s,c)=>{let u=s.getMockName();u!=="spy"&&(!/^next\/.*::/.test(u)||["next/router::useRouter()","next/navigation::useRouter()","next/navigation::redirect","next/cache::","next/headers::cookies().set","next/headers::cookies().delete","next/headers::headers().set","next/headers::headers().delete"].some(r=>u.startsWith(r)))&&j(u)(c)}),le=!0}},gt=[mt];const B=[{value:"公司",label:"公司"},{value:"學校",label:"學校"},{value:"個人工作室",label:"個人工作室（自由工作者、接案者等）"},{value:"非營利組織",label:"非營利組織"},{value:"政府機關",label:"政府機關"},{value:"其他",label:"其他"}],bt=[{value:"active",label:"啟用中"},{value:"pending",label:"審核中"},{value:"draft",label:"草稿"}],Tt={title:"表單元件/Select",id:"select",component:Y,tags:["autodocs"],argTypes:{options:{description:"下拉選單的選項清單，每項含 value 與 label",control:{type:"object"}},placeholder:{description:"Placeholder 提示文字（尚未選擇時顯示）",control:{type:"text"},table:{defaultValue:{summary:"請選擇"}}},errorMessage:{description:"錯誤訊息；有值時顯示錯誤樣式",control:{type:"text"},table:{defaultValue:{summary:""}}}},args:{options:B,placeholder:"請選擇組織類型",errorMessage:""}},V={name:"預設",args:{options:B,placeholder:"請選擇組織類型",errorMessage:""}},P={name:"錯誤狀態",args:{options:B,placeholder:"請選擇組織類型",errorMessage:"請選擇組織類型"}},R={name:"互動示範（顯示已選值）",render:()=>({template:`
      <div style="padding:16px; max-width:360px;">
        <p style="font-size:13px;color:#686868;margin-bottom:12px;">
          從下拉選單選擇組織類型，選取結果將顯示於下方：
        </p>
        <DsSelect
          :options="options"
          placeholder="請選擇組織類型"
          v-model="selectedValue"
        ></DsSelect>
        <div style="margin-top:12px;font-size:13px;">
          <span style="color:#686868;">目前選取值：</span>
          <strong>{{ selectedValue ?? '（未選取）' }}</strong>
        </div>
        <hr style="margin:16px 0;border:none;border-top:1px solid #e7e7e7;">
        <p style="font-size:13px;color:#686868;margin-bottom:12px;">目前狀態：</p>
        <DsSelect
          :options="statusOptions"
          placeholder="請選擇目前狀態"
          v-model="selectedStatus"
        ></DsSelect>
        <div style="margin-top:12px;font-size:13px;">
          <span style="color:#686868;">目前選取值：</span>
          <strong>{{ selectedStatus ?? '（未選取）' }}</strong>
        </div>
      </div>
    `,setup:()=>({options:B,statusOptions:bt,selectedValue:p(null),selectedStatus:p(null)}),components:{DsSelect:Y}})},I={name:"含禁用選項",args:{options:[{value:"免費版",label:"免費版"},{value:"團隊版",label:"團隊版",disabled:!0},{value:"企業版",label:"企業版",disabled:!0},{value:"個人進階版",label:"個人進階版"}],placeholder:"請選擇使用等級",errorMessage:""}},M={name:"多選項（可搜尋過濾，顯示 5.5 個）",args:{options:["台北市","新北市","桃園市","台中市","台南市","高雄市","基隆市","新竹市","嘉義市","新竹縣","苗栗縣","彰化縣","南投縣","雲林縣","嘉義縣","屏東縣","宜蘭縣","花蓮縣","台東縣","澎湖縣","金門縣","連江縣"].map(e=>({value:e,label:e})),placeholder:"請選擇縣市",errorMessage:""}};var ne,se,oe;V.parameters={...V.parameters,docs:{...(ne=V.parameters)==null?void 0:ne.docs,source:{originalSource:`{
  name: '預設',
  args: {
    options: ORG_TYPE_OPTIONS,
    placeholder: '請選擇組織類型',
    errorMessage: ''
  }
}`,...(oe=(se=V.parameters)==null?void 0:se.docs)==null?void 0:oe.source}}};var re,ie,ue;P.parameters={...P.parameters,docs:{...(re=P.parameters)==null?void 0:re.docs,source:{originalSource:`{
  name: '錯誤狀態',
  args: {
    options: ORG_TYPE_OPTIONS,
    placeholder: '請選擇組織類型',
    errorMessage: '請選擇組織類型'
  }
}`,...(ue=(ie=P.parameters)==null?void 0:ie.docs)==null?void 0:ue.source}}};var ce,de,pe;R.parameters={...R.parameters,docs:{...(ce=R.parameters)==null?void 0:ce.docs,source:{originalSource:`{
  name: '互動示範（顯示已選值）',
  render: () => ({
    template: \`
      <div style="padding:16px; max-width:360px;">
        <p style="font-size:13px;color:#686868;margin-bottom:12px;">
          從下拉選單選擇組織類型，選取結果將顯示於下方：
        </p>
        <DsSelect
          :options="options"
          placeholder="請選擇組織類型"
          v-model="selectedValue"
        ></DsSelect>
        <div style="margin-top:12px;font-size:13px;">
          <span style="color:#686868;">目前選取值：</span>
          <strong>{{ selectedValue ?? '（未選取）' }}</strong>
        </div>
        <hr style="margin:16px 0;border:none;border-top:1px solid #e7e7e7;">
        <p style="font-size:13px;color:#686868;margin-bottom:12px;">目前狀態：</p>
        <DsSelect
          :options="statusOptions"
          placeholder="請選擇目前狀態"
          v-model="selectedStatus"
        ></DsSelect>
        <div style="margin-top:12px;font-size:13px;">
          <span style="color:#686868;">目前選取值：</span>
          <strong>{{ selectedStatus ?? '（未選取）' }}</strong>
        </div>
      </div>
    \`,
    setup: () => ({
      options: ORG_TYPE_OPTIONS,
      statusOptions: STATUS_OPTIONS,
      selectedValue: ref<string | null>(null),
      selectedStatus: ref<string | null>(null)
    }),
    components: {
      DsSelect
    }
  })
}`,...(pe=(de=R.parameters)==null?void 0:de.docs)==null?void 0:pe.source}}};var fe,ve,me;I.parameters={...I.parameters,docs:{...(fe=I.parameters)==null?void 0:fe.docs,source:{originalSource:`{
  name: '含禁用選項',
  args: {
    // 某些條件下（例如個人帳號）只開放部分等級，其餘選項照樣列出但禁用
    options: [{
      value: '免費版',
      label: '免費版'
    }, {
      value: '團隊版',
      label: '團隊版',
      disabled: true
    }, {
      value: '企業版',
      label: '企業版',
      disabled: true
    }, {
      value: '個人進階版',
      label: '個人進階版'
    }],
    placeholder: '請選擇使用等級',
    errorMessage: ''
  }
}`,...(me=(ve=I.parameters)==null?void 0:ve.docs)==null?void 0:me.source}}};var ge,be,ye;M.parameters={...M.parameters,docs:{...(ge=M.parameters)==null?void 0:ge.docs,source:{originalSource:`{
  name: '多選項（可搜尋過濾，顯示 5.5 個）',
  args: {
    options: ['台北市', '新北市', '桃園市', '台中市', '台南市', '高雄市', '基隆市', '新竹市', '嘉義市', '新竹縣', '苗栗縣', '彰化縣', '南投縣', '雲林縣', '嘉義縣', '屏東縣', '宜蘭縣', '花蓮縣', '台東縣', '澎湖縣', '金門縣', '連江縣'].map(name => ({
      value: name,
      label: name
    })),
    placeholder: '請選擇縣市',
    errorMessage: ''
  }
}`,...(ye=(be=M.parameters)==null?void 0:be.docs)==null?void 0:ye.source}}};const Et=["Default","WithError","Interactive","DisabledOption","ManyOptions"];export{V as Default,I as DisabledOption,R as Interactive,M as ManyOptions,P as WithError,Et as __namedExportsOrder,Tt as default};

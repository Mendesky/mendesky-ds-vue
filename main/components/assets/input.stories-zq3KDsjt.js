import{d as le,k as x,w as re,b as i,e as oe,u as ie,n as de,p as z,q as M,f as L,l as D,m as d}from"./vue.esm-bundler-5TFJMEal.js";import{_ as S}from"./DsIcon-BVjnUJzX.js";import{v as ue}from"./error-tooltip-jmix1WaF.js";import"./pdf-render.util-P7DRlDqo.js";import"./_commonjsHelpers-Bx2EM-6T.js";const pe={class:"ds-input"},ce={class:"input-box"},me=["type","inputmode","placeholder","disabled","readonly","value"],fe={class:"input-suffix"},y=le({__name:"DsInput",props:{size:{default:"M"},placeholder:{default:"Placeholder"},errorMessage:{default:""},errorPosition:{default:"bottom"},disabled:{type:Boolean,default:!1},readonly:{type:Boolean,default:!1},initialValue:{default:""},type:{default:"text"},inputMode:{default:"text"},sanitize:{default:"none"}},emits:["valueChange","blur"],setup(a,{emit:Q}){const e=a,h=Q,s=x(e.initialValue??""),o=x(!1),l=x(!1);re(()=>e.initialValue,n=>{s.value=n??""});const U=D(()=>e.type==="password"?o.value?"text":"password":e.type),I=D(()=>s.value.length>0),Y=D(()=>({[`input-wrap--${e.size.toLowerCase()}`]:!0,"input-wrap--disabled":e.disabled,"input-wrap--readonly":e.readonly&&!e.disabled,"input-wrap--error":!e.disabled&&!!e.errorMessage,"input-wrap--focus":!e.disabled&&!e.errorMessage&&l.value,"input-wrap--actived":!e.disabled&&!e.errorMessage&&!l.value&&I.value}));function Z(){o.value=!o.value}function ee(n){const r=n.target;let t=r.value;if(e.sanitize==="digits"){const w=r.selectionStart??t.length,ne=(t.slice(0,w).match(/\D/g)??[]).length,b=t.replace(/\D/g,"");if(b!==t){r.value=b;const V=Math.max(0,w-ne);r.setSelectionRange(V,V)}t=b}s.value=t,h("valueChange",t)}function ae(){l.value=!0}function te(){l.value=!1,h("blur",s.value)}function se(n){n.preventDefault(),s.value="",h("valueChange","")}return(n,r)=>(d(),i("span",pe,[oe((d(),i("div",{class:de(["input-wrap",Y.value])},[z("div",ce,[z("input",{class:"input-field",type:U.value,inputmode:a.inputMode,placeholder:a.placeholder,disabled:a.disabled,readonly:a.readonly,value:s.value,onInput:ee,onFocus:ae,onBlur:te},null,40,me),z("div",fe,[a.type==="password"?(d(),i("button",{key:0,class:"input-eye",type:"button",tabindex:"-1","aria-label":"切換密碼顯示",onClick:Z},[M(S,{name:o.value?"eye-off":"eye",size:"16"},null,8,["name"])])):L("",!0),l.value&&I.value&&a.type!=="password"&&!a.readonly?(d(),i("button",{key:1,class:"input-clear",type:"button",tabindex:"-1","aria-label":"清除",onMousedown:se},[M(S,{name:"No-X-Cancel",size:"16"})],32)):L("",!0)])])],2)),[[ie(ue),{message:a.errorMessage,position:a.errorPosition,disabled:a.disabled}]])]))}});y.__docgenInfo={exportName:"default",displayName:"DsInput",description:"",tags:{},props:[{name:"size",required:!1,type:{name:"InputSize"},defaultValue:{func:!1,value:"'M'"}},{name:"placeholder",required:!1,type:{name:"string"},defaultValue:{func:!1,value:"'Placeholder'"}},{name:"errorMessage",description:"錯誤訊息；有值時切換為錯誤狀態",required:!1,type:{name:"string"},defaultValue:{func:!1,value:"''"}},{name:"errorPosition",description:"錯誤提示顯示方向",required:!1,type:{name:"union",elements:[{name:'"top"'},{name:'"bottom"'}]},defaultValue:{func:!1,value:"'bottom'"}},{name:"disabled",required:!1,type:{name:"boolean"},defaultValue:{func:!1,value:"false"}},{name:"readonly",description:"唯讀：不可編輯，但文字維持正常色、可聚焦選取（展示型欄位用，如分享連結）",required:!1,type:{name:"boolean"},defaultValue:{func:!1,value:"false"}},{name:"initialValue",description:"預填值；外部可透過它設定初始值或同步更新",required:!1,type:{name:"string"},defaultValue:{func:!1,value:"''"}},{name:"type",description:"input type（text / date / email / number / password 等）",required:!1,type:{name:"string"},defaultValue:{func:!1,value:"'text'"}},{name:"inputMode",description:"行動裝置鍵盤型態（透傳至原生 inputmode）",required:!1,type:{name:"InputMode"},defaultValue:{func:!1,value:"'text'"}},{name:"sanitize",description:"輸入時自動過濾；'digits' = 只保留數字（含貼上）",required:!1,type:{name:"InputSanitize"},defaultValue:{func:!1,value:"'none'"}}],events:[{name:"valueChange",type:{names:["string"]}},{name:"blur",type:{names:["string"]}}],sourceFiles:["/home/runner/work/mendesky-ds-vue/mendesky-ds-vue/src/components/input/DsInput.vue"]};const xe={title:"表單元件/Input",id:"input",component:y,tags:["autodocs"],argTypes:{size:{control:"select",options:["S","M","L"],description:"輸入框尺寸",table:{defaultValue:{summary:"L"}}},placeholder:{control:"text",description:"Placeholder 文字",table:{defaultValue:{summary:"Placeholder"}}},type:{control:"select",options:["text","date","email","number","password","tel"],description:"HTML input type",table:{defaultValue:{summary:"text"}}},initialValue:{control:"text",description:"預填值；外部可透過此 Input 同步更新欄位內容"},errorMessage:{control:"text",description:"錯誤訊息（有值時切換 error 狀態）"},disabled:{control:"boolean",table:{defaultValue:{summary:"false"}}},onValueChange:{action:"valueChange"}}},u={args:{size:"L",placeholder:"請輸入文字",disabled:!1}},p={render:()=>({template:`
      <div style="display:flex;flex-direction:column;gap:12px;width:300px;padding:16px;">
        <DsInput size="S" placeholder="S size"></DsInput>
        <DsInput size="M" placeholder="M size"></DsInput>
        <DsInput size="L" placeholder="L size"></DsInput>
      </div>
    `,components:{DsInput:y}})},c={args:{size:"L",placeholder:"請輸入統一編號",errorMessage:"格式錯誤，請輸入 8 位數字"}},m={args:{size:"L",placeholder:"不可輸入",disabled:!0}},f={args:{size:"L",initialValue:"89789944",placeholder:"請輸入統一編號"}},v={args:{size:"L",type:"date"}},g={render:()=>({template:`
      <div style="display:flex;flex-direction:column;gap:12px;width:300px;padding:16px;">
        <div>
          <div style="font-size:11px;color:#939393;margin-bottom:4px;">Normal</div>
          <DsInput size="L" placeholder="Placeholder"></DsInput>
        </div>
        <div>
          <div style="font-size:11px;color:#939393;margin-bottom:4px;">Error</div>
          <DsInput size="L" placeholder="Placeholder" errorMessage="此欄位為必填"></DsInput>
        </div>
        <div>
          <div style="font-size:11px;color:#939393;margin-bottom:4px;">Disabled</div>
          <DsInput size="L" placeholder="不可輸入" :disabled="true"></DsInput>
        </div>
      </div>
    `,components:{DsInput:y}})};var P,C,q;u.parameters={...u.parameters,docs:{...(P=u.parameters)==null?void 0:P.docs,source:{originalSource:`{
  args: {
    size: 'L',
    placeholder: '請輸入文字',
    disabled: false
  }
}`,...(q=(C=u.parameters)==null?void 0:C.docs)==null?void 0:q.source}}};var k,E,N;p.parameters={...p.parameters,docs:{...(k=p.parameters)==null?void 0:k.docs,source:{originalSource:`{
  render: () => ({
    template: \`
      <div style="display:flex;flex-direction:column;gap:12px;width:300px;padding:16px;">
        <DsInput size="S" placeholder="S size"></DsInput>
        <DsInput size="M" placeholder="M size"></DsInput>
        <DsInput size="L" placeholder="L size"></DsInput>
      </div>
    \`,
    components: {
      DsInput
    }
  })
}`,...(N=(E=p.parameters)==null?void 0:E.docs)==null?void 0:N.source}}};var B,T,A;c.parameters={...c.parameters,docs:{...(B=c.parameters)==null?void 0:B.docs,source:{originalSource:`{
  args: {
    size: 'L',
    placeholder: '請輸入統一編號',
    errorMessage: '格式錯誤，請輸入 8 位數字'
  }
}`,...(A=(T=c.parameters)==null?void 0:T.docs)==null?void 0:A.source}}};var F,W,$;m.parameters={...m.parameters,docs:{...(F=m.parameters)==null?void 0:F.docs,source:{originalSource:`{
  args: {
    size: 'L',
    placeholder: '不可輸入',
    disabled: true
  }
}`,...($=(W=m.parameters)==null?void 0:W.docs)==null?void 0:$.source}}};var H,O,R;f.parameters={...f.parameters,docs:{...(H=f.parameters)==null?void 0:H.docs,source:{originalSource:`{
  args: {
    size: 'L',
    initialValue: '89789944',
    placeholder: '請輸入統一編號'
  }
}`,...(R=(O=f.parameters)==null?void 0:O.docs)==null?void 0:R.source}}};var X,_,j;v.parameters={...v.parameters,docs:{...(X=v.parameters)==null?void 0:X.docs,source:{originalSource:`{
  args: {
    size: 'L',
    type: 'date'
  }
}`,...(j=(_=v.parameters)==null?void 0:_.docs)==null?void 0:j.source}}};var G,J,K;g.parameters={...g.parameters,docs:{...(G=g.parameters)==null?void 0:G.docs,source:{originalSource:`{
  render: () => ({
    template: \`
      <div style="display:flex;flex-direction:column;gap:12px;width:300px;padding:16px;">
        <div>
          <div style="font-size:11px;color:#939393;margin-bottom:4px;">Normal</div>
          <DsInput size="L" placeholder="Placeholder"></DsInput>
        </div>
        <div>
          <div style="font-size:11px;color:#939393;margin-bottom:4px;">Error</div>
          <DsInput size="L" placeholder="Placeholder" errorMessage="此欄位為必填"></DsInput>
        </div>
        <div>
          <div style="font-size:11px;color:#939393;margin-bottom:4px;">Disabled</div>
          <DsInput size="L" placeholder="不可輸入" :disabled="true"></DsInput>
        </div>
      </div>
    \`,
    components: {
      DsInput
    }
  })
}`,...(K=(J=g.parameters)==null?void 0:J.docs)==null?void 0:K.source}}};const ze=["Default","AllSizes","WithError","Disabled","Prefilled","DateType","AllStates"];export{p as AllSizes,g as AllStates,v as DateType,u as Default,m as Disabled,f as Prefilled,c as WithError,ze as __namedExportsOrder,xe as default};

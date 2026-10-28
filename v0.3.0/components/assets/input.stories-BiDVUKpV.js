import{d as Ie,s as ze,k as L,w as we,o as Le,b as c,e as Ve,u as Ce,n as Me,p as V,q as E,f as T,v as Fe,l as n,m}from"./vue.esm-bundler-DVoz-rLG.js";import{_ as k}from"./DsIcon-C3x7LW03.js";import{v as Pe}from"./error-tooltip-DEw11E6z.js";import{F as Se,_ as de}from"./DsField-BcEmzkhU.js";import"./pdf-render.util-P7DRlDqo.js";import"./_commonjsHelpers-Bx2EM-6T.js";import"./DsLabel-CYtuSUCF.js";const qe={class:"ds-input"},Ee={class:"input-box"},Te=["id","name","autocomplete","aria-label","aria-labelledby","aria-required","type","inputmode","placeholder","disabled","readonly","value"],ke={class:"input-suffix"},Ne=["aria-pressed"],Ae="Placeholder",o=Ie({__name:"DsInput",props:{size:{default:"M"},placeholder:{default:Ae},errorMessage:{default:""},errorPosition:{default:"bottom"},disabled:{type:Boolean,default:!1},readonly:{type:Boolean,default:!1},initialValue:{default:""},type:{default:"text"},inputMode:{default:"text"},sanitize:{default:"none"},ariaLabel:{default:""},autocomplete:{default:""},name:{default:""},inputId:{default:""}},emits:["valueChange","blur","passwordVisibilityChange"],setup(a,{emit:ue}){var F,P;const e=a,p=ue,z=Fe(Se,null),s=z&&((P=(F=ze())==null?void 0:F.parent)==null?void 0:P.uid)===z.ownerUid?z:null,l=L(e.initialValue??""),r=L(!1),d=L(!1);we(()=>e.initialValue,i=>{l.value=i??""});const pe=n(()=>e.type==="password"?r.value?"text":"password":e.type),C=n(()=>l.value.length>0),ce=n(()=>({[`input-wrap--${e.size.toLowerCase()}`]:!0,"input-wrap--disabled":e.disabled,"input-wrap--readonly":e.readonly&&!e.disabled,"input-wrap--error":!e.disabled&&!!e.errorMessage,"input-wrap--focus":!e.disabled&&!e.errorMessage&&d.value,"input-wrap--actived":!e.disabled&&!e.errorMessage&&!d.value&&C.value}));function me(){r.value=!r.value,p("passwordVisibilityChange",r.value)}const M=n(()=>(e.ariaLabel??"").trim()),fe=n(()=>M.value||!(s!=null&&s.labelText.value)?void 0:s.labelId),ve=n(()=>s!=null&&s.required.value?"true":void 0),ge=n(()=>(e.inputId??"").trim());Le(()=>{});function ye(i){const u=i.target;let t=u.value;if(e.sanitize==="digits"){const S=u.selectionStart??t.length,xe=(t.slice(0,S).match(/\D/g)??[]).length,w=t.replace(/\D/g,"");if(w!==t){u.value=w;const q=Math.max(0,S-xe);u.setSelectionRange(q,q)}t=w}l.value=t,p("valueChange",t)}function be(){d.value=!0}function he(){d.value=!1,p("blur",l.value)}function De(i){i.preventDefault(),l.value="",p("valueChange","")}return(i,u)=>(m(),c("span",qe,[Ve((m(),c("div",{class:Me(["input-wrap",ce.value])},[V("div",Ee,[V("input",{class:"input-field",id:ge.value||void 0,name:a.name||void 0,autocomplete:a.autocomplete||void 0,"aria-label":M.value||void 0,"aria-labelledby":fe.value,"aria-required":ve.value,type:pe.value,inputmode:a.inputMode,placeholder:a.placeholder,disabled:a.disabled,readonly:a.readonly,value:l.value,onInput:ye,onFocus:be,onBlur:he},null,40,Te),V("div",ke,[a.type==="password"?(m(),c("button",{key:0,class:"input-eye",type:"button","aria-label":"顯示密碼","aria-pressed":r.value?"true":"false",onClick:me},[E(k,{name:r.value?"eye-off":"eye",size:"16"},null,8,["name"])],8,Ne)):T("",!0),d.value&&C.value&&a.type!=="password"&&!a.readonly?(m(),c("button",{key:1,class:"input-clear",type:"button",tabindex:"-1","aria-label":"清除",onMousedown:De},[E(k,{name:"No-X-Cancel",size:"16"})],32)):T("",!0)])])],2)),[[Ce(Pe),{message:a.errorMessage,position:a.errorPosition,disabled:a.disabled}]])]))}});o.__docgenInfo={exportName:"default",displayName:"DsInput",description:"",tags:{},props:[{name:"size",required:!1,type:{name:"InputSize"},defaultValue:{func:!1,value:"'M'"}},{name:"placeholder",required:!1,type:{name:"string"},defaultValue:{func:!1,value:"DEFAULT_PLACEHOLDER"}},{name:"errorMessage",description:"錯誤訊息；有值時切換為錯誤狀態",required:!1,type:{name:"string"},defaultValue:{func:!1,value:"''"}},{name:"errorPosition",description:"錯誤提示顯示方向",required:!1,type:{name:"union",elements:[{name:'"top"'},{name:'"bottom"'}]},defaultValue:{func:!1,value:"'bottom'"}},{name:"disabled",required:!1,type:{name:"boolean"},defaultValue:{func:!1,value:"false"}},{name:"readonly",description:"唯讀：不可編輯，但文字維持正常色、可聚焦選取（展示型欄位用，如分享連結）",required:!1,type:{name:"boolean"},defaultValue:{func:!1,value:"false"}},{name:"initialValue",description:"預填值；外部可透過它設定初始值或同步更新",required:!1,type:{name:"string"},defaultValue:{func:!1,value:"''"}},{name:"type",description:"input type（text / date / email / number / password 等）",required:!1,type:{name:"string"},defaultValue:{func:!1,value:"'text'"}},{name:"inputMode",description:"行動裝置鍵盤型態（透傳至原生 inputmode）",required:!1,type:{name:"InputMode"},defaultValue:{func:!1,value:"'text'"}},{name:"sanitize",description:"輸入時自動過濾；'digits' = 只保留數字（含貼上）",required:!1,type:{name:"InputSanitize"},defaultValue:{func:!1,value:"'none'"}},{name:"ariaLabel",description:`報讀軟體念的名稱，落在內層 input 的 aria-label。
直接寫在有標題的 DsField 裡不用設（會念欄位標題）；沒有欄位標題、或包在別的元件裡時才設。設了就只念它，不念欄位標題。`,required:!1,type:{name:"string"},defaultValue:{func:!1,value:"''"}},{name:"autocomplete",description:"透傳到內層 input 的 autocomplete（如 username、current-password、new-password、off）；空字串不輸出",required:!1,type:{name:"string"},defaultValue:{func:!1,value:"''"}},{name:"name",description:"透傳到內層 input 的 name；空字串不輸出",required:!1,type:{name:"string"},defaultValue:{func:!1,value:"''"}},{name:"inputId",description:`內層 input 的 id，給外面自己寫的 label for 指向。
不叫 id：寫在 DsInput 上的 id 會落在外框上，指向它的 label 連不到輸入框。`,required:!1,type:{name:"string"},defaultValue:{func:!1,value:"''"}}],events:[{name:"valueChange",type:{names:["string"]}},{name:"blur",type:{names:["string"]}},{name:"passwordVisibilityChange",type:{names:["boolean"]},description:"按眼睛按鈕切換密碼顯示時發出；true＝切成明文"}],sourceFiles:["/home/runner/work/mendesky-ds-vue/mendesky-ds-vue/src/components/input/DsInput.vue"]};const We={title:"表單元件/Input",id:"input",component:o,tags:["autodocs"],argTypes:{size:{control:"select",options:["S","M","L"],description:"輸入框尺寸",table:{defaultValue:{summary:"L"}}},placeholder:{control:"text",description:"Placeholder 文字",table:{defaultValue:{summary:"Placeholder"}}},type:{control:"select",options:["text","date","email","number","password","tel"],description:"HTML input type",table:{defaultValue:{summary:"text"}}},initialValue:{control:"text",description:"預填值；外部可透過此 Input 同步更新欄位內容"},errorMessage:{control:"text",description:"錯誤訊息（有值時切換 error 狀態）"},disabled:{control:"boolean",table:{defaultValue:{summary:"false"}}},onValueChange:{action:"valueChange"},onPasswordVisibilityChange:{action:"passwordVisibilityChange"}}},f={args:{size:"L",placeholder:"請輸入文字",disabled:!1}},v={render:()=>({template:`
      <div style="display:flex;flex-direction:column;gap:12px;width:300px;padding:16px;">
        <DsInput size="S" placeholder="S size"></DsInput>
        <DsInput size="M" placeholder="M size"></DsInput>
        <DsInput size="L" placeholder="L size"></DsInput>
      </div>
    `,components:{DsInput:o}})},g={args:{size:"L",placeholder:"請輸入統一編號",errorMessage:"格式錯誤，請輸入 8 位數字"}},y={args:{size:"L",placeholder:"不可輸入",disabled:!0}},b={args:{size:"L",initialValue:"89789944",placeholder:"請輸入統一編號"}},h={args:{size:"L",type:"date"}},D={render:()=>({template:`
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
    `,components:{DsInput:o}})},x={render:()=>({components:{DsField:de,DsInput:o},template:`
      <div style="display:flex;flex-direction:column;gap:16px;width:300px;padding:16px;">
        <DsField label="聯絡人姓氏" :required="true">
          <DsInput size="L" placeholder="請輸入姓氏" />
        </DsField>
        <DsInput size="L" ariaLabel="分享連結" initialValue="https://example.com/s/abc123" :readonly="true" />
      </div>
    `})},I={render:a=>({components:{DsField:de,DsInput:o},setup:()=>({args:a}),template:`
      <div style="display:flex;flex-direction:column;gap:16px;width:300px;padding:16px;">
        <DsField label="帳號">
          <DsInput size="L" autocomplete="username" placeholder="請輸入帳號" />
        </DsField>
        <DsField label="密碼">
          <DsInput size="L" type="password" autocomplete="current-password" placeholder="請輸入密碼"
                   @password-visibility-change="args.onPasswordVisibilityChange" />
        </DsField>
      </div>
    `})};var N,A,B;f.parameters={...f.parameters,docs:{...(N=f.parameters)==null?void 0:N.docs,source:{originalSource:`{
  args: {
    size: 'L',
    placeholder: '請輸入文字',
    disabled: false
  }
}`,...(B=(A=f.parameters)==null?void 0:A.docs)==null?void 0:B.source}}};var _,O,R;v.parameters={...v.parameters,docs:{...(_=v.parameters)==null?void 0:_.docs,source:{originalSource:`{
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
}`,...(R=(O=v.parameters)==null?void 0:O.docs)==null?void 0:R.source}}};var H,U,$;g.parameters={...g.parameters,docs:{...(H=g.parameters)==null?void 0:H.docs,source:{originalSource:`{
  args: {
    size: 'L',
    placeholder: '請輸入統一編號',
    errorMessage: '格式錯誤，請輸入 8 位數字'
  }
}`,...($=(U=g.parameters)==null?void 0:U.docs)==null?void 0:$.source}}};var W,X,j;y.parameters={...y.parameters,docs:{...(W=y.parameters)==null?void 0:W.docs,source:{originalSource:`{
  args: {
    size: 'L',
    placeholder: '不可輸入',
    disabled: true
  }
}`,...(j=(X=y.parameters)==null?void 0:X.docs)==null?void 0:j.source}}};var G,J,K;b.parameters={...b.parameters,docs:{...(G=b.parameters)==null?void 0:G.docs,source:{originalSource:`{
  args: {
    size: 'L',
    initialValue: '89789944',
    placeholder: '請輸入統一編號'
  }
}`,...(K=(J=b.parameters)==null?void 0:J.docs)==null?void 0:K.source}}};var Q,Y,Z;h.parameters={...h.parameters,docs:{...(Q=h.parameters)==null?void 0:Q.docs,source:{originalSource:`{
  args: {
    size: 'L',
    type: 'date'
  }
}`,...(Z=(Y=h.parameters)==null?void 0:Y.docs)==null?void 0:Z.source}}};var ee,ae,se;D.parameters={...D.parameters,docs:{...(ee=D.parameters)==null?void 0:ee.docs,source:{originalSource:`{
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
}`,...(se=(ae=D.parameters)==null?void 0:ae.docs)==null?void 0:se.source}}};var te,ne,le;x.parameters={...x.parameters,docs:{...(te=x.parameters)==null?void 0:te.docs,source:{originalSource:`{
  render: () => ({
    components: {
      DsField,
      DsInput
    },
    template: \`
      <div style="display:flex;flex-direction:column;gap:16px;width:300px;padding:16px;">
        <DsField label="聯絡人姓氏" :required="true">
          <DsInput size="L" placeholder="請輸入姓氏" />
        </DsField>
        <DsInput size="L" ariaLabel="分享連結" initialValue="https://example.com/s/abc123" :readonly="true" />
      </div>
    \`
  })
}`,...(le=(ne=x.parameters)==null?void 0:ne.docs)==null?void 0:le.source}}};var re,ie,oe;I.parameters={...I.parameters,docs:{...(re=I.parameters)==null?void 0:re.docs,source:{originalSource:`{
  render: args => ({
    components: {
      DsField,
      DsInput
    },
    setup: () => ({
      args
    }),
    template: \`
      <div style="display:flex;flex-direction:column;gap:16px;width:300px;padding:16px;">
        <DsField label="帳號">
          <DsInput size="L" autocomplete="username" placeholder="請輸入帳號" />
        </DsField>
        <DsField label="密碼">
          <DsInput size="L" type="password" autocomplete="current-password" placeholder="請輸入密碼"
                   @password-visibility-change="args.onPasswordVisibilityChange" />
        </DsField>
      </div>
    \`
  })
}`,...(oe=(ie=I.parameters)==null?void 0:ie.docs)==null?void 0:oe.source}}};const Xe=["Default","AllSizes","WithError","Disabled","Prefilled","DateType","AllStates","InField","Password"];export{v as AllSizes,D as AllStates,h as DateType,f as Default,y as Disabled,x as InField,I as Password,b as Prefilled,g as WithError,Xe as __namedExportsOrder,We as default};

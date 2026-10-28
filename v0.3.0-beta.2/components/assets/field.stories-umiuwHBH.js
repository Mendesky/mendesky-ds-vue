import{d as I,b as o,p,n as m,t as f,f as c,g as k,j as h,m as a}from"./vue.esm-bundler-5TFJMEal.js";import{_ as V}from"./DsLabel-B1bm0bGc.js";import"./DsIcon-BVjnUJzX.js";import"./pdf-render.util-P7DRlDqo.js";import"./_commonjsHelpers-Bx2EM-6T.js";const z={class:"ds-field"},L={class:"field-wrap"},P={key:0,class:"field-hint"},U={class:"field-action"},s=I({__name:"DsField",props:{label:{default:""},required:{type:Boolean,default:!1},hint:{default:""},emphasis:{type:Boolean,default:!1}},setup(e){return(u,Y)=>(a(),o("span",z,[p("div",L,[e.label?(a(),o("div",{key:0,class:m(["field-header",{"field-header--emphasis":e.emphasis}])},[p("span",{class:m(["field-label",{"field-label--emphasis":e.emphasis}])},f(e.label),3),e.hint?(a(),o("span",P,f(e.hint),1)):c("",!0),e.required?(a(),k(V,{key:1,color:"SoftBlue",size:"XXS",text:"必填"})):c("",!0),p("span",U,[h(u.$slots,"action")])],2)):c("",!0),h(u.$slots,"default")])]))}});s.__docgenInfo={exportName:"default",displayName:"DsField",description:"",tags:{},props:[{name:"label",description:"欄位標題文字；不傳則不顯示標題列",required:!1,type:{name:"string"},defaultValue:{func:!1,value:"''"}},{name:"required",description:"顯示「必填」標記",required:!1,type:{name:"boolean"},defaultValue:{func:!1,value:"false"}},{name:"hint",description:"標題後方的灰字補充說明（如「（每週寄送、每月寄送）」）",required:!1,type:{name:"string"},defaultValue:{func:!1,value:"''"}},{name:"emphasis",description:"強調樣式：標題加粗 + 標題色 + 下方分隔線；用於唯讀展示區塊",required:!1,type:{name:"boolean"},defaultValue:{func:!1,value:"false"}}],slots:[{name:"action"},{name:"default"}],sourceFiles:["/home/runner/work/mendesky-ds-vue/mendesky-ds-vue/src/components/field/DsField.vue"]};const l="width:100%;padding:8px 12px;border:1px solid #d0d0d0;border-radius:6px;font-size:14px;outline:none;box-sizing:border-box;",X={title:"表單元件/Field",id:"field",component:s,tags:["autodocs"],argTypes:{label:{control:"text",description:"欄位標題文字；空字串時不顯示 label row",table:{defaultValue:{summary:""}}},required:{control:"boolean",description:"顯示「必填」badge（優先於 optional）",table:{defaultValue:{summary:"false"}}},emphasis:{control:"boolean",description:"強調樣式：label 加粗 + 標題色 + 下方分隔線；用於唯讀展示區塊",table:{defaultValue:{summary:"false"}}}}},i={render:()=>({template:`
      <div style="width:320px;padding:24px;">
        <DsField label="姓名">
          <input style="${l}" placeholder="請輸入姓名" />
        </DsField>
      </div>
    `,components:{DsField:s}})},t={render:()=>({template:`
      <div style="width:320px;padding:24px;">
        <DsField label="編號" :required="true">
          <input style="${l}" placeholder="請輸入編號" />
        </DsField>
      </div>
    `,components:{DsField:s}})},n={render:()=>({template:`
      <div style="width:320px;padding:24px;">
        <DsField label="備註" :optional="true">
          <input style="${l}" placeholder="選填備註內容" />
        </DsField>
      </div>
    `,components:{DsField:s}})},d={render:()=>({template:`
      <div style="width:360px;padding:24px;display:flex;flex-direction:column;gap:16px;">
        <DsField label="收件人" :emphasis="true">
          <div style="padding:8px 0;font-size:14px;color:#333;">王小明</div>
        </DsField>
        <DsField label="說明" :emphasis="true" :required="true">
          <div style="padding:8px 0;font-size:14px;color:#333;white-space:pre-wrap;">本次申請用於更新聯絡資料，送出後會寄送確認信到您的信箱。</div>
        </DsField>
      </div>
    `,components:{DsField:s}})},r={render:()=>({template:`
      <div style="width:360px;padding:24px;display:flex;flex-direction:column;gap:16px;">
        <DsField label="顯示名稱" :required="true">
          <input style="${l}" placeholder="請輸入顯示名稱" />
        </DsField>
        <DsField label="開始日期" :required="true">
          <input style="${l}" type="date" />
        </DsField>
        <DsField label="電子郵件" :optional="true">
          <input style="${l}" type="email" placeholder="example@mail.com" />
        </DsField>
        <DsField label="備註">
          <input style="${l}" placeholder="其他補充說明" />
        </DsField>
      </div>
    `,components:{DsField:s}})};var x,y,D;i.parameters={...i.parameters,docs:{...(x=i.parameters)==null?void 0:x.docs,source:{originalSource:`{
  render: () => ({
    template: \`
      <div style="width:320px;padding:24px;">
        <DsField label="姓名">
          <input style="\${INPUT_STYLE}" placeholder="請輸入姓名" />
        </DsField>
      </div>
    \`,
    components: {
      DsField
    }
  })
}`,...(D=(y=i.parameters)==null?void 0:y.docs)==null?void 0:D.source}}};var F,b,v;t.parameters={...t.parameters,docs:{...(F=t.parameters)==null?void 0:F.docs,source:{originalSource:`{
  render: () => ({
    template: \`
      <div style="width:320px;padding:24px;">
        <DsField label="編號" :required="true">
          <input style="\${INPUT_STYLE}" placeholder="請輸入編號" />
        </DsField>
      </div>
    \`,
    components: {
      DsField
    }
  })
}`,...(v=(b=t.parameters)==null?void 0:b.docs)==null?void 0:v.source}}};var g,q,w;n.parameters={...n.parameters,docs:{...(g=n.parameters)==null?void 0:g.docs,source:{originalSource:`{
  render: () => ({
    template: \`
      <div style="width:320px;padding:24px;">
        <DsField label="備註" :optional="true">
          <input style="\${INPUT_STYLE}" placeholder="選填備註內容" />
        </DsField>
      </div>
    \`,
    components: {
      DsField
    }
  })
}`,...(w=(q=n.parameters)==null?void 0:q.docs)==null?void 0:w.source}}};var S,T,$;d.parameters={...d.parameters,docs:{...(S=d.parameters)==null?void 0:S.docs,source:{originalSource:`{
  render: () => ({
    template: \`
      <div style="width:360px;padding:24px;display:flex;flex-direction:column;gap:16px;">
        <DsField label="收件人" :emphasis="true">
          <div style="padding:8px 0;font-size:14px;color:#333;">王小明</div>
        </DsField>
        <DsField label="說明" :emphasis="true" :required="true">
          <div style="padding:8px 0;font-size:14px;color:#333;white-space:pre-wrap;">本次申請用於更新聯絡資料，送出後會寄送確認信到您的信箱。</div>
        </DsField>
      </div>
    \`,
    components: {
      DsField
    }
  })
}`,...($=(T=d.parameters)==null?void 0:T.docs)==null?void 0:$.source}}};var _,E,N;r.parameters={...r.parameters,docs:{...(_=r.parameters)==null?void 0:_.docs,source:{originalSource:`{
  render: () => ({
    template: \`
      <div style="width:360px;padding:24px;display:flex;flex-direction:column;gap:16px;">
        <DsField label="顯示名稱" :required="true">
          <input style="\${INPUT_STYLE}" placeholder="請輸入顯示名稱" />
        </DsField>
        <DsField label="開始日期" :required="true">
          <input style="\${INPUT_STYLE}" type="date" />
        </DsField>
        <DsField label="電子郵件" :optional="true">
          <input style="\${INPUT_STYLE}" type="email" placeholder="example@mail.com" />
        </DsField>
        <DsField label="備註">
          <input style="\${INPUT_STYLE}" placeholder="其他補充說明" />
        </DsField>
      </div>
    \`,
    components: {
      DsField
    }
  })
}`,...(N=(E=r.parameters)==null?void 0:E.docs)==null?void 0:N.source}}};const j=["Default","Required","Optional","Emphasis","WithInput"];export{i as Default,d as Emphasis,n as Optional,t as Required,r as WithInput,j as __namedExportsOrder,X as default};

import{_ as l}from"./DsField-BROG5Z7H.js";import"./vue.esm-bundler-SU9fAcLV.js";import"./DsLabel-CE3n2uP2.js";import"./DsIcon-CCN_QnEA.js";import"./pdf-render.util-P7DRlDqo.js";import"./_commonjsHelpers-Bx2EM-6T.js";const e="width:100%;padding:8px 12px;border:1px solid #d0d0d0;border-radius:6px;font-size:14px;outline:none;box-sizing:border-box;",q={title:"表單元件/Field",id:"field",component:l,tags:["autodocs"],argTypes:{label:{control:"text",description:"欄位標題文字；空字串時不顯示 label row",table:{defaultValue:{summary:""}}},required:{control:"boolean",description:"顯示「必填」badge（優先於 optional）",table:{defaultValue:{summary:"false"}}},emphasis:{control:"boolean",description:"強調樣式：label 加粗 + 標題色 + 下方分隔線；用於唯讀展示區塊",table:{defaultValue:{summary:"false"}}}}},i={render:()=>({template:`
      <div style="width:320px;padding:24px;">
        <DsField label="姓名">
          <input style="${e}" placeholder="請輸入姓名" />
        </DsField>
      </div>
    `,components:{DsField:l}})},d={render:()=>({template:`
      <div style="width:320px;padding:24px;">
        <DsField label="編號" :required="true">
          <input style="${e}" placeholder="請輸入編號" />
        </DsField>
      </div>
    `,components:{DsField:l}})},n={render:()=>({template:`
      <div style="width:320px;padding:24px;">
        <DsField label="備註" :optional="true">
          <input style="${e}" placeholder="選填備註內容" />
        </DsField>
      </div>
    `,components:{DsField:l}})},t={render:()=>({template:`
      <div style="width:360px;padding:24px;display:flex;flex-direction:column;gap:16px;">
        <DsField label="收件人" :emphasis="true">
          <div style="padding:8px 0;font-size:14px;color:#333;">王小明</div>
        </DsField>
        <DsField label="說明" :emphasis="true" :required="true">
          <div style="padding:8px 0;font-size:14px;color:#333;white-space:pre-wrap;">本次申請用於更新聯絡資料，送出後會寄送確認信到您的信箱。</div>
        </DsField>
      </div>
    `,components:{DsField:l}})},s={render:()=>({template:`
      <div style="width:360px;padding:24px;display:flex;flex-direction:column;gap:16px;">
        <DsField label="顯示名稱" :required="true">
          <input style="${e}" placeholder="請輸入顯示名稱" />
        </DsField>
        <DsField label="開始日期" :required="true">
          <input style="${e}" type="date" />
        </DsField>
        <DsField label="電子郵件" :optional="true">
          <input style="${e}" type="email" placeholder="example@mail.com" />
        </DsField>
        <DsField label="備註">
          <input style="${e}" placeholder="其他補充說明" />
        </DsField>
      </div>
    `,components:{DsField:l}})};var r,p,a;i.parameters={...i.parameters,docs:{...(r=i.parameters)==null?void 0:r.docs,source:{originalSource:`{
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
}`,...(a=(p=i.parameters)==null?void 0:p.docs)==null?void 0:a.source}}};var o,c,u;d.parameters={...d.parameters,docs:{...(o=d.parameters)==null?void 0:o.docs,source:{originalSource:`{
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
}`,...(u=(c=d.parameters)==null?void 0:c.docs)==null?void 0:u.source}}};var m,x,D;n.parameters={...n.parameters,docs:{...(m=n.parameters)==null?void 0:m.docs,source:{originalSource:`{
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
}`,...(D=(x=n.parameters)==null?void 0:x.docs)==null?void 0:D.source}}};var F,y,h;t.parameters={...t.parameters,docs:{...(F=t.parameters)==null?void 0:F.docs,source:{originalSource:`{
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
}`,...(h=(y=t.parameters)==null?void 0:y.docs)==null?void 0:h.source}}};var b,g,v;s.parameters={...s.parameters,docs:{...(b=s.parameters)==null?void 0:b.docs,source:{originalSource:`{
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
}`,...(v=(g=s.parameters)==null?void 0:g.docs)==null?void 0:v.source}}};const E=["Default","Required","Optional","Emphasis","WithInput"];export{i as Default,t as Emphasis,n as Optional,d as Required,s as WithInput,E as __namedExportsOrder,q as default};

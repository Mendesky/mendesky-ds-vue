import{_ as e,I as z}from"./DsIcon-C5sMU4Mg.js";import"./vue.esm-bundler-Cs-mJWlm.js";import"./pdf-render.util-P7DRlDqo.js";import"./_commonjsHelpers-Bx2EM-6T.js";const u=Object.keys(z),S={title:"展示元件/Icon",id:"icon",component:e,tags:["autodocs"],argTypes:{name:{control:"select",options:u,description:"Icon 名稱（對應 ICON_REGISTRY）"},size:{control:"select",options:["12","16","24","32","36","48"],description:"正方形尺寸（px）",table:{defaultValue:{summary:"24"}}}}},n={args:{name:"Plus",size:"24"},render:i=>({setup:()=>i,template:`
      <DsIcon :name="name" :size="size" style="color:#3a9ccd;"></DsIcon>
    `,components:{DsIcon:e}})},s={render:()=>({template:`
      <div style="display:flex;gap:16px;align-items:center;padding:12px;">
        <div style="text-align:center;">
          <DsIcon name="Plus" size="12" style="color:#3a9ccd;"></DsIcon>
          <div style="font-size:10px;color:#686868;margin-top:4px;">12px</div>
        </div>
        <div style="text-align:center;">
          <DsIcon name="Plus" size="16" style="color:#3a9ccd;"></DsIcon>
          <div style="font-size:10px;color:#686868;margin-top:4px;">16px</div>
        </div>
        <div style="text-align:center;">
          <DsIcon name="Plus" size="24" style="color:#3a9ccd;"></DsIcon>
          <div style="font-size:10px;color:#686868;margin-top:4px;">24px</div>
        </div>
        <div style="text-align:center;">
          <DsIcon name="Plus" size="32" style="color:#3a9ccd;"></DsIcon>
          <div style="font-size:10px;color:#686868;margin-top:4px;">32px</div>
        </div>
        <div style="text-align:center;">
          <DsIcon name="Plus" size="36" style="color:#3a9ccd;"></DsIcon>
          <div style="font-size:10px;color:#686868;margin-top:4px;">36px</div>
        </div>
        <div style="text-align:center;">
          <DsIcon name="Plus" size="48" style="color:#3a9ccd;"></DsIcon>
          <div style="font-size:10px;color:#686868;margin-top:4px;">48px</div>
        </div>
      </div>
    `,components:{DsIcon:e}})},o={render:()=>({template:`
      <div style="display:flex;gap:16px;align-items:center;padding:12px;flex-wrap:wrap;">
        <div style="text-align:center;">
          <DsIcon name="Plus" size="24" style="color:#3a9ccd;"></DsIcon>
          <div style="font-size:11px;color:#686868;margin-top:4px;">#3a9ccd</div>
        </div>
        <div style="text-align:center;">
          <DsIcon name="Plus" size="24" style="color:#74ae3e;"></DsIcon>
          <div style="font-size:11px;color:#686868;margin-top:4px;">#74ae3e</div>
        </div>
        <div style="text-align:center;">
          <DsIcon name="Plus" size="24" style="color:#cc5252;"></DsIcon>
          <div style="font-size:11px;color:#686868;margin-top:4px;">#cc5252</div>
        </div>
        <div style="text-align:center;">
          <DsIcon name="Plus" size="24" style="color:#686868;"></DsIcon>
          <div style="font-size:11px;color:#686868;margin-top:4px;">#686868</div>
        </div>
        <div style="text-align:center;background:#1c1c2e;padding:8px;border-radius:6px;">
          <DsIcon name="Plus" size="24" style="color:white;"></DsIcon>
          <div style="font-size:11px;color:#939393;margin-top:4px;">white</div>
        </div>
      </div>
    `,components:{DsIcon:e}})},t={render:()=>({template:`<div style="display:flex;flex-wrap:wrap;gap:8px;padding:16px;">${Object.keys(z).map(c=>`
        <div style="display:flex;flex-direction:column;align-items:center;gap:4px;padding:8px;border:1px solid #f0f0f0;border-radius:6px;min-width:72px;">
          <app-icon name="${c}" size="24" style="color:#3a9ccd;"></app-icon>
          <div style="font-size:10px;color:#686868;text-align:center;word-break:break-all;">${c}</div>
        </div>`).join("")}</div>`,components:{DsIcon:e}})};var l,a,r;n.parameters={...n.parameters,docs:{...(l=n.parameters)==null?void 0:l.docs,source:{originalSource:`{
  args: {
    name: 'Plus',
    size: '24'
  },
  render: args => ({
    setup: () => args,
    template: \`
      <DsIcon :name="name" :size="size" style="color:#3a9ccd;"></DsIcon>
    \`,
    components: {
      DsIcon
    }
  })
}`,...(r=(a=n.parameters)==null?void 0:a.docs)==null?void 0:r.source}}};var d,p,x;s.parameters={...s.parameters,docs:{...(d=s.parameters)==null?void 0:d.docs,source:{originalSource:`{
  render: () => ({
    template: \`
      <div style="display:flex;gap:16px;align-items:center;padding:12px;">
        <div style="text-align:center;">
          <DsIcon name="Plus" size="12" style="color:#3a9ccd;"></DsIcon>
          <div style="font-size:10px;color:#686868;margin-top:4px;">12px</div>
        </div>
        <div style="text-align:center;">
          <DsIcon name="Plus" size="16" style="color:#3a9ccd;"></DsIcon>
          <div style="font-size:10px;color:#686868;margin-top:4px;">16px</div>
        </div>
        <div style="text-align:center;">
          <DsIcon name="Plus" size="24" style="color:#3a9ccd;"></DsIcon>
          <div style="font-size:10px;color:#686868;margin-top:4px;">24px</div>
        </div>
        <div style="text-align:center;">
          <DsIcon name="Plus" size="32" style="color:#3a9ccd;"></DsIcon>
          <div style="font-size:10px;color:#686868;margin-top:4px;">32px</div>
        </div>
        <div style="text-align:center;">
          <DsIcon name="Plus" size="36" style="color:#3a9ccd;"></DsIcon>
          <div style="font-size:10px;color:#686868;margin-top:4px;">36px</div>
        </div>
        <div style="text-align:center;">
          <DsIcon name="Plus" size="48" style="color:#3a9ccd;"></DsIcon>
          <div style="font-size:10px;color:#686868;margin-top:4px;">48px</div>
        </div>
      </div>
    \`,
    components: {
      DsIcon
    }
  })
}`,...(x=(p=s.parameters)==null?void 0:p.docs)==null?void 0:x.source}}};var m,v,y;o.parameters={...o.parameters,docs:{...(m=o.parameters)==null?void 0:m.docs,source:{originalSource:`{
  render: () => ({
    template: \`
      <div style="display:flex;gap:16px;align-items:center;padding:12px;flex-wrap:wrap;">
        <div style="text-align:center;">
          <DsIcon name="Plus" size="24" style="color:#3a9ccd;"></DsIcon>
          <div style="font-size:11px;color:#686868;margin-top:4px;">#3a9ccd</div>
        </div>
        <div style="text-align:center;">
          <DsIcon name="Plus" size="24" style="color:#74ae3e;"></DsIcon>
          <div style="font-size:11px;color:#686868;margin-top:4px;">#74ae3e</div>
        </div>
        <div style="text-align:center;">
          <DsIcon name="Plus" size="24" style="color:#cc5252;"></DsIcon>
          <div style="font-size:11px;color:#686868;margin-top:4px;">#cc5252</div>
        </div>
        <div style="text-align:center;">
          <DsIcon name="Plus" size="24" style="color:#686868;"></DsIcon>
          <div style="font-size:11px;color:#686868;margin-top:4px;">#686868</div>
        </div>
        <div style="text-align:center;background:#1c1c2e;padding:8px;border-radius:6px;">
          <DsIcon name="Plus" size="24" style="color:white;"></DsIcon>
          <div style="font-size:11px;color:#939393;margin-top:4px;">white</div>
        </div>
      </div>
    \`,
    components: {
      DsIcon
    }
  })
}`,...(y=(v=o.parameters)==null?void 0:v.docs)==null?void 0:y.source}}};var g,I,D;t.parameters={...t.parameters,docs:{...(g=t.parameters)==null?void 0:g.docs,source:{originalSource:`{
  render: () => {
    const names = Object.keys(ICON_REGISTRY);
    const items = names.map(n => \`
        <div style="display:flex;flex-direction:column;align-items:center;gap:4px;padding:8px;border:1px solid #f0f0f0;border-radius:6px;min-width:72px;">
          <app-icon name="\${n}" size="24" style="color:#3a9ccd;"></app-icon>
          <div style="font-size:10px;color:#686868;text-align:center;word-break:break-all;">\${n}</div>
        </div>\`).join('');
    return {
      template: \`<div style="display:flex;flex-wrap:wrap;gap:8px;padding:16px;">\${items}</div>\`,
      components: {
        DsIcon
      }
    };
  }
}`,...(D=(I=t.parameters)==null?void 0:I.docs)==null?void 0:D.source}}};const h=["Default","AllSizes","ColorInheritance","IconGallery"];export{s as AllSizes,o as ColorInheritance,n as Default,t as IconGallery,h as __namedExportsOrder,S as default};

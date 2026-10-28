import{_ as Me}from"./DsButton-BwMSnzFT.js";import{I as Le}from"./DsIcon-CCN_QnEA.js";import"./vue.esm-bundler-SU9fAcLV.js";import"./DsLabel-CE3n2uP2.js";import"./error-tooltip-DLWNUAc8.js";import"./pdf-render.util-P7DRlDqo.js";import"./_commonjsHelpers-Bx2EM-6T.js";const z=["",...Object.keys(Le)],Pe={title:"互動元件/Button",id:"button",component:Me,tags:["autodocs"],argTypes:{variant:{control:"select",options:["filled","tonal","outlined","ghost","elevated"],description:"按鈕外觀",table:{defaultValue:{summary:"filled"}}},color:{control:"select",options:["primary","success","danger","neutral"],description:"顏色語意（elevated 不需指定）",table:{defaultValue:{summary:"primary"}}},size:{control:"select",options:["XXS","XS","S","M","L"],description:"尺寸：XXS=17px / XS=24px / S=28px / M=32px / L=40px",table:{defaultValue:{summary:"M"}}},text:{control:"text",description:"按鈕文字"},leftIcon:{control:"select",options:z,description:"icon registry 名稱（左側），空字串 = 不顯示"},rightIcon:{control:"select",options:z,description:"icon registry 名稱（右側），空字串 = 不顯示"},leftLabel:{control:"object",description:"leftIcon 之後的 DsLabel（null = 隱藏）。格式：{ text, color, size? }"},centerLabel:{control:"object",description:"leftLabel 之後的第二個 DsLabel（null = 隱藏）"},rightLabel:{control:"object",description:"文字之後的 DsLabel（null = 隱藏）。格式：{ text, color, size? }"},disabled:{control:"boolean",table:{defaultValue:{summary:"false"}}},fullWidth:{control:"boolean",table:{defaultValue:{summary:"false"}}},onBtnClick:{action:"btnClick"}}},e={args:{variant:"filled",color:"primary",size:"M",text:"確認",disabled:!1,fullWidth:!1}},r={args:{variant:"filled",color:"primary",size:"M",text:"實心藍"}},t={args:{variant:"tonal",color:"primary",size:"M",text:"漸層藍"}},a={args:{variant:"tonal",color:"neutral",size:"S",text:"同上方地址"}},o={args:{variant:"outlined",color:"primary",size:"M",text:"外框藍"}},s={args:{variant:"ghost",color:"primary",size:"M",text:"透明藍"}},n={args:{variant:"elevated",size:"M",text:"浮起"}},i={args:{variant:"filled",color:"success",size:"M",text:"成功 / 確認"}},l={args:{variant:"filled",color:"danger",size:"M",text:"危險 / 刪除"}},c={args:{variant:"filled",color:"neutral",size:"M",text:"次要操作"}},p={render:()=>({template:`
      <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
        <DsButton variant="filled" color="primary" size="XXS" text="XXS 17px"></DsButton>
        <DsButton variant="filled" color="primary" size="XS"  text="XS 24px"></DsButton>
        <DsButton variant="filled" color="primary" size="S"   text="S 28px"></DsButton>
        <DsButton variant="filled" color="primary" size="M"   text="M 32px"></DsButton>
        <DsButton variant="filled" color="primary" size="L"   text="L 40px"></DsButton>
      </div>
    `,components:{DsButton:Me}})},d={args:{variant:"filled",color:"primary",size:"M",text:"新增項目",leftIcon:"Plus"}},m={args:{variant:"outlined",color:"primary",size:"M",text:"展開",rightIcon:"DownArrow"}},u={args:{variant:"tonal",color:"primary",size:"M",text:"篩選",leftIcon:"Filter",rightIcon:"DownArrow"}},f={args:{variant:"outlined",color:"primary",size:"M",leftIcon:"Filter",text:"篩選",leftLabel:{text:"3",color:"SoftBlue"}}},g={args:{variant:"tonal",color:"primary",size:"M",text:"儲存",rightLabel:{text:"⌘S",color:"GreyOutline"}}},x={args:{variant:"outlined",color:"primary",size:"M",leftIcon:"Briefcase",leftLabel:{text:"NEW",color:"Red"},centerLabel:{text:"5",color:"SoftBlue"},text:"我的項目",rightLabel:{text:"全部",color:"GreyOutline"}}},y={args:{variant:"filled",color:"primary",size:"M",text:"不可操作",disabled:!0}},v={args:{variant:"filled",color:"primary",size:"M",text:"撐滿父容器",fullWidth:!0},decorators:[()=>({template:'<div style="width:320px;"><story /></div>'})]};var S,b,h;e.parameters={...e.parameters,docs:{...(S=e.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    variant: 'filled',
    color: 'primary',
    size: 'M',
    text: '確認',
    disabled: false,
    fullWidth: false
  }
}`,...(h=(b=e.parameters)==null?void 0:b.docs)==null?void 0:h.source}}};var M,L,B;r.parameters={...r.parameters,docs:{...(M=r.parameters)==null?void 0:M.docs,source:{originalSource:`{
  args: {
    variant: 'filled',
    color: 'primary',
    size: 'M',
    text: '實心藍'
  }
}`,...(B=(L=r.parameters)==null?void 0:L.docs)==null?void 0:B.source}}};var D,I,W;t.parameters={...t.parameters,docs:{...(D=t.parameters)==null?void 0:D.docs,source:{originalSource:`{
  args: {
    variant: 'tonal',
    color: 'primary',
    size: 'M',
    text: '漸層藍'
  }
}`,...(W=(I=t.parameters)==null?void 0:I.docs)==null?void 0:W.source}}};var X,w,F;a.parameters={...a.parameters,docs:{...(X=a.parameters)==null?void 0:X.docs,source:{originalSource:`{
  args: {
    variant: 'tonal',
    color: 'neutral',
    size: 'S',
    text: '同上方地址'
  }
}`,...(F=(w=a.parameters)==null?void 0:w.docs)==null?void 0:F.source}}};var P,O,A;o.parameters={...o.parameters,docs:{...(P=o.parameters)==null?void 0:P.docs,source:{originalSource:`{
  args: {
    variant: 'outlined',
    color: 'primary',
    size: 'M',
    text: '外框藍'
  }
}`,...(A=(O=o.parameters)==null?void 0:O.docs)==null?void 0:A.source}}};var C,N,R;s.parameters={...s.parameters,docs:{...(C=s.parameters)==null?void 0:C.docs,source:{originalSource:`{
  args: {
    variant: 'ghost',
    color: 'primary',
    size: 'M',
    text: '透明藍'
  }
}`,...(R=(N=s.parameters)==null?void 0:N.docs)==null?void 0:R.source}}};var G,E,T;n.parameters={...n.parameters,docs:{...(G=n.parameters)==null?void 0:G.docs,source:{originalSource:`{
  args: {
    variant: 'elevated',
    size: 'M',
    text: '浮起'
  }
}`,...(T=(E=n.parameters)==null?void 0:E.docs)==null?void 0:T.source}}};var _,V,j;i.parameters={...i.parameters,docs:{...(_=i.parameters)==null?void 0:_.docs,source:{originalSource:`{
  args: {
    variant: 'filled',
    color: 'success',
    size: 'M',
    text: '成功 / 確認'
  }
}`,...(j=(V=i.parameters)==null?void 0:V.docs)==null?void 0:j.source}}};var k,Y,q;l.parameters={...l.parameters,docs:{...(k=l.parameters)==null?void 0:k.docs,source:{originalSource:`{
  args: {
    variant: 'filled',
    color: 'danger',
    size: 'M',
    text: '危險 / 刪除'
  }
}`,...(q=(Y=l.parameters)==null?void 0:Y.docs)==null?void 0:q.source}}};var H,J,K;c.parameters={...c.parameters,docs:{...(H=c.parameters)==null?void 0:H.docs,source:{originalSource:`{
  args: {
    variant: 'filled',
    color: 'neutral',
    size: 'M',
    text: '次要操作'
  }
}`,...(K=(J=c.parameters)==null?void 0:J.docs)==null?void 0:K.source}}};var Q,U,Z;p.parameters={...p.parameters,docs:{...(Q=p.parameters)==null?void 0:Q.docs,source:{originalSource:`{
  render: () => ({
    template: \`
      <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
        <DsButton variant="filled" color="primary" size="XXS" text="XXS 17px"></DsButton>
        <DsButton variant="filled" color="primary" size="XS"  text="XS 24px"></DsButton>
        <DsButton variant="filled" color="primary" size="S"   text="S 28px"></DsButton>
        <DsButton variant="filled" color="primary" size="M"   text="M 32px"></DsButton>
        <DsButton variant="filled" color="primary" size="L"   text="L 40px"></DsButton>
      </div>
    \`,
    components: {
      DsButton
    }
  })
}`,...(Z=(U=p.parameters)==null?void 0:U.docs)==null?void 0:Z.source}}};var $,ee,re;d.parameters={...d.parameters,docs:{...($=d.parameters)==null?void 0:$.docs,source:{originalSource:`{
  args: {
    variant: 'filled',
    color: 'primary',
    size: 'M',
    text: '新增項目',
    leftIcon: 'Plus'
  }
}`,...(re=(ee=d.parameters)==null?void 0:ee.docs)==null?void 0:re.source}}};var te,ae,oe;m.parameters={...m.parameters,docs:{...(te=m.parameters)==null?void 0:te.docs,source:{originalSource:`{
  args: {
    variant: 'outlined',
    color: 'primary',
    size: 'M',
    text: '展開',
    rightIcon: 'DownArrow'
  }
}`,...(oe=(ae=m.parameters)==null?void 0:ae.docs)==null?void 0:oe.source}}};var se,ne,ie;u.parameters={...u.parameters,docs:{...(se=u.parameters)==null?void 0:se.docs,source:{originalSource:`{
  args: {
    variant: 'tonal',
    color: 'primary',
    size: 'M',
    text: '篩選',
    leftIcon: 'Filter',
    rightIcon: 'DownArrow'
  }
}`,...(ie=(ne=u.parameters)==null?void 0:ne.docs)==null?void 0:ie.source}}};var le,ce,pe;f.parameters={...f.parameters,docs:{...(le=f.parameters)==null?void 0:le.docs,source:{originalSource:`{
  args: {
    variant: 'outlined',
    color: 'primary',
    size: 'M',
    leftIcon: 'Filter',
    text: '篩選',
    leftLabel: {
      text: '3',
      color: 'SoftBlue'
    } satisfies BtnLabelConfig
  }
}`,...(pe=(ce=f.parameters)==null?void 0:ce.docs)==null?void 0:pe.source}}};var de,me,ue;g.parameters={...g.parameters,docs:{...(de=g.parameters)==null?void 0:de.docs,source:{originalSource:`{
  args: {
    variant: 'tonal',
    color: 'primary',
    size: 'M',
    text: '儲存',
    rightLabel: {
      text: '⌘S',
      color: 'GreyOutline'
    } satisfies BtnLabelConfig
  }
}`,...(ue=(me=g.parameters)==null?void 0:me.docs)==null?void 0:ue.source}}};var fe,ge,xe;x.parameters={...x.parameters,docs:{...(fe=x.parameters)==null?void 0:fe.docs,source:{originalSource:`{
  args: {
    variant: 'outlined',
    color: 'primary',
    size: 'M',
    leftIcon: 'Briefcase',
    leftLabel: {
      text: 'NEW',
      color: 'Red'
    } satisfies BtnLabelConfig,
    centerLabel: {
      text: '5',
      color: 'SoftBlue'
    } satisfies BtnLabelConfig,
    text: '我的項目',
    rightLabel: {
      text: '全部',
      color: 'GreyOutline'
    } satisfies BtnLabelConfig
  }
}`,...(xe=(ge=x.parameters)==null?void 0:ge.docs)==null?void 0:xe.source}}};var ye,ve,ze;y.parameters={...y.parameters,docs:{...(ye=y.parameters)==null?void 0:ye.docs,source:{originalSource:`{
  args: {
    variant: 'filled',
    color: 'primary',
    size: 'M',
    text: '不可操作',
    disabled: true
  }
}`,...(ze=(ve=y.parameters)==null?void 0:ve.docs)==null?void 0:ze.source}}};var Se,be,he;v.parameters={...v.parameters,docs:{...(Se=v.parameters)==null?void 0:Se.docs,source:{originalSource:`{
  args: {
    variant: 'filled',
    color: 'primary',
    size: 'M',
    text: '撐滿父容器',
    fullWidth: true
  },
  decorators: [() => ({
    template: '<div style="width:320px;"><story /></div>'
  })]
}`,...(he=(be=v.parameters)==null?void 0:be.docs)==null?void 0:he.source}}};const Oe=["Default","FilledPrimary","TonalPrimary","TonalNeutral","OutlinedPrimary","GhostPrimary","Elevated","FilledSuccess","FilledDanger","FilledNeutral","AllSizes","WithLeftIcon","WithRightIcon","WithBothIcons","WithLeftLabel","WithRightLabel","WithAllLabels","Disabled","FullWidth"];export{p as AllSizes,e as Default,y as Disabled,n as Elevated,l as FilledDanger,c as FilledNeutral,r as FilledPrimary,i as FilledSuccess,v as FullWidth,s as GhostPrimary,o as OutlinedPrimary,a as TonalNeutral,t as TonalPrimary,x as WithAllLabels,u as WithBothIcons,d as WithLeftIcon,f as WithLeftLabel,m as WithRightIcon,g as WithRightLabel,Oe as __namedExportsOrder,Pe as default};

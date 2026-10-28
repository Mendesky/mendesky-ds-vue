import{d as Z,k as f,w as k,b as v,p as j,q as H,t as J,f as K,n as Q,l as d,m as y,r as R}from"./vue.esm-bundler-5TFJMEal.js";import{_ as U}from"./DsIcon-BVjnUJzX.js";import"./pdf-render.util-P7DRlDqo.js";import"./_commonjsHelpers-Bx2EM-6T.js";const X={class:"ds-checkbox"},ee=["aria-checked","aria-label","disabled"],ae={key:0,class:"checkbox__label"},c=Z({__name:"DsCheckbox",props:{checked:{type:Boolean,default:!1},modelValue:{type:Boolean,default:void 0},indeterminate:{type:Boolean,default:!1},size:{default:"m"},label:{default:""},ariaLabel:{default:""},disabled:{type:Boolean,default:!1}},emits:["checkedChange","update:modelValue"],setup(e,{emit:l}){const o={s:"20",m:"24",l:"28"},W={off:"CheckBox",on:"CheckBoxOn",mixed:"CheckBoxMixed"},s=e,C=l,n=f(!!(s.modelValue??s.checked)),i=f(!!s.indeterminate);k(()=>s.checked,a=>n.value=!!a),k(()=>s.modelValue,a=>{a!==void 0&&(n.value=!!a)}),k(()=>s.indeterminate,a=>i.value=!!a);const t=d(()=>i.value?"mixed":n.value?"on":"off"),Y=d(()=>t.value==="mixed"?"mixed":t.value==="on"?"true":"false"),w=d(()=>W[t.value]),G=d(()=>o[s.size]??o.m);function F(){if(s.disabled)return;const a=i.value||!n.value;i.value=!1,n.value=a,C("update:modelValue",a),C("checkedChange",a)}return(a,le)=>(y(),v("span",X,[j("button",{type:"button",role:"checkbox",class:Q(["checkbox",{"checkbox--on":t.value==="on","checkbox--mixed":t.value==="mixed","checkbox--labeled":!!e.label}]),"aria-checked":Y.value,"aria-label":e.label?void 0:e.ariaLabel||void 0,disabled:e.disabled,onClick:F},[H(U,{class:"checkbox__icon",name:w.value,size:G.value},null,8,["name","size"]),e.label?(y(),v("span",ae,J(e.label),1)):K("",!0)],10,ee)]))}});c.__docgenInfo={exportName:"default",displayName:"DsCheckbox",description:"",tags:{},props:[{name:"checked",description:"全有",required:!1,type:{name:"boolean"},defaultValue:{func:!1,value:"false"}},{name:"modelValue",description:"v-model 的值（跟 checked 擇一使用）",required:!1,type:{name:"boolean"},defaultValue:{func:!1,value:"undefined"}},{name:"indeterminate",description:"部分；為 true 時優先顯示「部分」，不管 checked 是什麼",required:!1,type:{name:"boolean"},defaultValue:{func:!1,value:"false"}},{name:"size",required:!1,type:{name:"CheckboxSize"},defaultValue:{func:!1,value:"'m'"}},{name:"label",description:"框右邊的文字；點文字也算點勾選框。可省略",required:!1,type:{name:"string"},defaultValue:{func:!1,value:"''"}},{name:"ariaLabel",description:"沒有 label 時一定要給，讀螢幕軟體才唸得出這是什麼",required:!1,type:{name:"string"},defaultValue:{func:!1,value:"''"}},{name:"disabled",required:!1,type:{name:"boolean"},defaultValue:{func:!1,value:"false"}}],events:[{name:"checkedChange",type:{names:["boolean"]},description:"使用者點擊後的新值（部分被點一律是 true）"},{name:"update:modelValue",type:{names:["boolean"]}}],sourceFiles:["/home/runner/work/mendesky-ds-vue/mendesky-ds-vue/src/components/checkbox/DsCheckbox.vue"]};const x="font-size:11px;color:#686868;",oe={title:"互動元件/Checkbox",id:"checkbox",component:c,tags:["autodocs"],argTypes:{checked:{control:"boolean",description:"全有",table:{defaultValue:{summary:"false"}}},indeterminate:{control:"boolean",description:"部分；為 true 時優先顯示「部分」，不管 checked 是什麼",table:{defaultValue:{summary:"false"}}},size:{control:"select",options:["s","m","l"],description:"s（框約 16.7px）／m（框 20px）／l（框約 23.3px）",table:{defaultValue:{summary:"m"}}},label:{control:"text",description:"框右邊的文字；點文字也算點勾選框。可省略"},ariaLabel:{control:"text",description:"沒有 label 時一定要給，讀螢幕軟體才唸得出這是什麼"},disabled:{control:"boolean",description:"停用",table:{defaultValue:{summary:"false"}}},onCheckedChange:{action:"checkedChange"}}},r={name:"預設",args:{checked:!1,indeterminate:!1,size:"m",label:"使用者管理",ariaLabel:"",disabled:!1}},m={name:"三種狀態",render:()=>({template:`
      <div style="display:flex;gap:32px;align-items:flex-start;">
        <div style="display:flex;flex-direction:column;align-items:center;gap:6px;">
          <DsCheckbox :checked="false" ariaLabel="沒有"></DsCheckbox>
          <span style="${x}">沒有</span>
        </div>
        <div style="display:flex;flex-direction:column;align-items:center;gap:6px;">
          <DsCheckbox :checked="true" ariaLabel="全有"></DsCheckbox>
          <span style="${x}">全有</span>
        </div>
        <div style="display:flex;flex-direction:column;align-items:center;gap:6px;">
          <DsCheckbox :indeterminate="true" ariaLabel="部分"></DsCheckbox>
          <span style="${x}">部分（只能由呼叫端給）</span>
        </div>
      </div>
    `,components:{DsCheckbox:c}})},p={name:"尺寸",render:()=>({template:`
      <div style="display:flex;gap:32px;align-items:center;">
        <DsCheckbox size="s" :checked="true" label="s"></DsCheckbox>
        <DsCheckbox size="m" :checked="true" label="m（預設）"></DsCheckbox>
        <DsCheckbox size="l" :checked="true" label="l"></DsCheckbox>
      </div>
    `,components:{DsCheckbox:c}})},h={name:"停用",render:()=>({template:`
      <div style="display:flex;gap:32px;align-items:center;">
        <DsCheckbox :disabled="true" :checked="false" label="沒有"></DsCheckbox>
        <DsCheckbox :disabled="true" :checked="true" label="全有"></DsCheckbox>
        <DsCheckbox :disabled="true" :indeterminate="true" label="部分"></DsCheckbox>
      </div>
    `,components:{DsCheckbox:c}})},u={name:"v-model 雙向綁定",render:()=>({setup:()=>({selected:f(!1)}),template:`
      <div style="display:flex;flex-direction:column;gap:12px;align-items:flex-start;">
        <DsCheckbox size="s" v-model="selected" ariaLabel="選取這一列"></DsCheckbox>
        <span style="font-size:12px;color:#686868;">目前值：{{ selected }}</span>
      </div>
    `,components:{DsCheckbox:c}})},b={name:"分類列（部分勾選）",render:()=>{const e=R([{label:"選項一",checked:!0},{label:"選項二",checked:!1},{label:"選項三",checked:!1}]);return{setup:()=>({items:e,allChecked:()=>e.every(l=>l.checked),someChecked:()=>e.some(l=>l.checked)&&!e.every(l=>l.checked),toggleAll:l=>e.forEach(o=>o.checked=l)}),template:`
        <div style="display:flex;flex-direction:column;gap:8px;">
          <DsCheckbox
            label="全選"
            :checked="allChecked()"
            :indeterminate="someChecked()"
            @checked-change="toggleAll($event)">
          </DsCheckbox>
          <div style="display:flex;flex-direction:column;gap:8px;padding-left:28px;">
            <DsCheckbox
              v-for="item in items"
              :key="item.label"
              size="s"
              :label="item.label"
              :checked="item.checked"
              @checked-change="item.checked = $event">
            </DsCheckbox>
          </div>
        </div>
      `,components:{DsCheckbox:c}}}};var g,D,z;r.parameters={...r.parameters,docs:{...(g=r.parameters)==null?void 0:g.docs,source:{originalSource:`{
  name: '預設',
  args: {
    checked: false,
    indeterminate: false,
    size: 'm',
    label: '使用者管理',
    ariaLabel: '',
    disabled: false
  }
}`,...(z=(D=r.parameters)==null?void 0:D.docs)==null?void 0:z.source}}};var V,L,S;m.parameters={...m.parameters,docs:{...(V=m.parameters)==null?void 0:V.docs,source:{originalSource:`{
  name: '三種狀態',
  render: () => ({
    template: \`
      <div style="display:flex;gap:32px;align-items:flex-start;">
        <div style="display:flex;flex-direction:column;align-items:center;gap:6px;">
          <DsCheckbox :checked="false" ariaLabel="沒有"></DsCheckbox>
          <span style="\${CAPTION_STYLE}">沒有</span>
        </div>
        <div style="display:flex;flex-direction:column;align-items:center;gap:6px;">
          <DsCheckbox :checked="true" ariaLabel="全有"></DsCheckbox>
          <span style="\${CAPTION_STYLE}">全有</span>
        </div>
        <div style="display:flex;flex-direction:column;align-items:center;gap:6px;">
          <DsCheckbox :indeterminate="true" ariaLabel="部分"></DsCheckbox>
          <span style="\${CAPTION_STYLE}">部分（只能由呼叫端給）</span>
        </div>
      </div>
    \`,
    components: {
      DsCheckbox
    }
  })
}`,...(S=(L=m.parameters)==null?void 0:L.docs)==null?void 0:S.source}}};var _,N,A;p.parameters={...p.parameters,docs:{...(_=p.parameters)==null?void 0:_.docs,source:{originalSource:`{
  name: '尺寸',
  render: () => ({
    template: \`
      <div style="display:flex;gap:32px;align-items:center;">
        <DsCheckbox size="s" :checked="true" label="s"></DsCheckbox>
        <DsCheckbox size="m" :checked="true" label="m（預設）"></DsCheckbox>
        <DsCheckbox size="l" :checked="true" label="l"></DsCheckbox>
      </div>
    \`,
    components: {
      DsCheckbox
    }
  })
}`,...(A=(N=p.parameters)==null?void 0:N.docs)==null?void 0:A.source}}};var $,B,E;h.parameters={...h.parameters,docs:{...($=h.parameters)==null?void 0:$.docs,source:{originalSource:`{
  name: '停用',
  render: () => ({
    template: \`
      <div style="display:flex;gap:32px;align-items:center;">
        <DsCheckbox :disabled="true" :checked="false" label="沒有"></DsCheckbox>
        <DsCheckbox :disabled="true" :checked="true" label="全有"></DsCheckbox>
        <DsCheckbox :disabled="true" :indeterminate="true" label="部分"></DsCheckbox>
      </div>
    \`,
    components: {
      DsCheckbox
    }
  })
}`,...(E=(B=h.parameters)==null?void 0:B.docs)==null?void 0:E.source}}};var I,T,q;u.parameters={...u.parameters,docs:{...(I=u.parameters)==null?void 0:I.docs,source:{originalSource:`{
  name: 'v-model 雙向綁定',
  render: () => ({
    setup: () => ({
      selected: ref(false)
    }),
    template: \`
      <div style="display:flex;flex-direction:column;gap:12px;align-items:flex-start;">
        <DsCheckbox size="s" v-model="selected" ariaLabel="選取這一列"></DsCheckbox>
        <span style="font-size:12px;color:#686868;">目前值：{{ selected }}</span>
      </div>
    \`,
    components: {
      DsCheckbox
    }
  })
}`,...(q=(T=u.parameters)==null?void 0:T.docs)==null?void 0:q.source}}};var O,M,P;b.parameters={...b.parameters,docs:{...(O=b.parameters)==null?void 0:O.docs,source:{originalSource:`{
  name: '分類列（部分勾選）',
  render: () => {
    const items = reactive([{
      label: '選項一',
      checked: true
    }, {
      label: '選項二',
      checked: false
    }, {
      label: '選項三',
      checked: false
    }]);
    return {
      setup: () => ({
        items,
        allChecked: () => items.every(i => i.checked),
        someChecked: () => items.some(i => i.checked) && !items.every(i => i.checked),
        toggleAll: (v: boolean) => items.forEach(i => i.checked = v)
      }),
      template: \`
        <div style="display:flex;flex-direction:column;gap:8px;">
          <DsCheckbox
            label="全選"
            :checked="allChecked()"
            :indeterminate="someChecked()"
            @checked-change="toggleAll($event)">
          </DsCheckbox>
          <div style="display:flex;flex-direction:column;gap:8px;padding-left:28px;">
            <DsCheckbox
              v-for="item in items"
              :key="item.label"
              size="s"
              :label="item.label"
              :checked="item.checked"
              @checked-change="item.checked = $event">
            </DsCheckbox>
          </div>
        </div>
      \`,
      components: {
        DsCheckbox
      }
    };
  }
}`,...(P=(M=b.parameters)==null?void 0:M.docs)==null?void 0:P.source}}};const ie=["Default","AllStates","Sizes","Disabled","WithNgModel","GroupWithChildren"];export{m as AllStates,r as Default,h as Disabled,b as GroupWithChildren,p as Sizes,u as WithNgModel,ie as __namedExportsOrder,oe as default};

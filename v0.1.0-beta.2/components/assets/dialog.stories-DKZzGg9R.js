import{d as F,w as W,v as j,x as P,g as p,m as n,b as R,n as C,t as V,f as g,y as U,z as G,T as J,l as k,A as Q,o as f}from"./vue.esm-bundler-Cs-mJWlm.js";import{_ as T}from"./DsButton-NnG-2w75.js";import{m as v}from"./error-tooltip-CV4LXMxl.js";import"./DsIcon-C5sMU4Mg.js";import"./pdf-render.util-P7DRlDqo.js";import"./_commonjsHelpers-Bx2EM-6T.js";import"./DsLabel-BH4aTDPi.js";const X=["a[href]","area[href]","button","input","select","textarea","iframe","[tabindex]",'[contenteditable=""]','[contenteditable="true"]'].join(",");function Y(e){return e.disabled||e.tabIndex<0||e instanceof HTMLInputElement&&e.type==="hidden"?!1:e.getClientRects().length>0&&getComputedStyle(e).visibility!=="hidden"}function B(e){return Array.from(e.querySelectorAll(X)).filter(Y)}function Z(e){let c=null;const d=a=>{if(a.key!=="Tab")return;const l=B(e);if(l.length===0){a.preventDefault();return}const s=l[0],u=l[l.length-1],r=document.activeElement;a.shiftKey&&(r===s||!e.contains(r))?(a.preventDefault(),u.focus()):!a.shiftKey&&(r===u||!e.contains(r))&&(a.preventDefault(),s.focus())};return{activate(){var a;c=document.activeElement instanceof HTMLElement?document.activeElement:null,e.addEventListener("keydown",d),(a=B(e)[0])==null||a.focus()},deactivate(){e.removeEventListener("keydown",d),c&&document.contains(c)&&c.focus(),c=null}}}const _={class:"dialog-wrapper"},ee={class:"dialog-header-section"},ne={class:"dialog-header-row"},ae={class:"dialog-header-title"},te={class:"dialog-content"},oe={class:"dialog-actions"};let re=0;const D=F({inheritAttrs:!1,__name:"DsDialog",props:{isOpen:{type:Boolean,default:!1},header:{default:"Header"},content:{default:"Content"},propClass:{default:"Warning"},confirmText:{default:"確認封存"},confirmIcon:{default:"Trash-Del"},showCancel:{type:Boolean,default:!0},cancelText:{default:"取消並關閉"},loading:{type:Boolean,default:!1}},emits:["cancel","confirm"],setup(e,{emit:c}){const d=e,a=c,l=k(!1),s=k(!1),u=k(null);let r,o=null;const m=`dialog-${++re}`;function w(i){i.key==="Escape"&&d.isOpen&&v.isTopmost(m)&&(i.preventDefault(),a("cancel"))}return W(()=>d.isOpen,i=>{i?(r&&clearTimeout(r),l.value=!0,s.value=!1,v.register(m)):l.value&&(v.unregister(m),s.value=!0,r=setTimeout(()=>{l.value=!1,s.value=!1},250))},{immediate:!0}),W(u,i=>{i?(o=Z(i),Q(()=>o==null?void 0:o.activate())):(o==null||o.deactivate(),o=null)}),j(()=>document.addEventListener("keydown",w)),P(()=>{document.removeEventListener("keydown",w),r&&clearTimeout(r),v.unregister(m),o==null||o.deactivate()}),(i,t)=>(f(),p(J,{to:"body"},[n("span",G({class:"ds-dialog"},i.$attrs),[l.value?(f(),R("div",{key:0,class:C(["dialog-overlay",{"dialog-overlay--leaving":s.value}]),onClick:t[3]||(t[3]=U(()=>{},["stop"]))},[n("div",{class:C(["dialog-backdrop",{"dialog-backdrop--leaving":s.value}])},null,2),n("div",{ref_key:"cardEl",ref:u,class:C(["dialog-card",{"dialog-card--leaving":s.value}]),role:"dialog","aria-modal":"true"},[n("div",_,[n("div",ee,[n("div",ne,[t[4]||(t[4]=n("span",{class:"dialog-header-icon"},[n("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none"},[n("circle",{cx:"12",cy:"12",r:"10",stroke:"currentColor","stroke-width":"1.5"}),n("path",{d:"M12 8.5v1.5",stroke:"currentColor","stroke-width":"1.5","stroke-linecap":"round"}),n("path",{d:"M12 12.5v4",stroke:"currentColor","stroke-width":"1.5","stroke-linecap":"round"})])],-1)),n("span",ae,V(e.header),1)]),t[5]||(t[5]=n("div",{class:"dialog-divider"},null,-1))]),n("div",te,V(e.content),1),n("div",oe,[e.showCancel?(f(),p(T,{key:0,variant:"elevated",text:e.cancelText,"full-width":!0,style:{flex:"1"},onBtnClick:t[0]||(t[0]=O=>a("cancel"))},null,8,["text"])):g("",!0),e.propClass==="Warning"?(f(),p(T,{key:1,text:e.confirmText,variant:"filled",color:"danger","left-icon":e.confirmIcon,"full-width":!0,loading:e.loading,style:{flex:"1"},onBtnClick:t[1]||(t[1]=O=>a("confirm"))},null,8,["text","left-icon","loading"])):g("",!0),e.propClass==="Normal"?(f(),p(T,{key:2,text:e.confirmText,variant:"filled",color:"primary","full-width":!0,loading:e.loading,style:{flex:"1"},onBtnClick:t[2]||(t[2]=O=>a("confirm"))},null,8,["text","loading"])):g("",!0)])])],2)],2)):g("",!0)],16)]))}});D.__docgenInfo={exportName:"default",displayName:"DsDialog",description:"",tags:{},props:[{name:"isOpen",required:!1,type:{name:"boolean"},defaultValue:{func:!1,value:"false"}},{name:"header",required:!1,type:{name:"string"},defaultValue:{func:!1,value:"'Header'"}},{name:"content",required:!1,type:{name:"string"},defaultValue:{func:!1,value:"'Content'"}},{name:"propClass",required:!1,type:{name:"union",elements:[{name:'"Warning"'},{name:'"Normal"'}]},defaultValue:{func:!1,value:"'Warning'"}},{name:"confirmText",required:!1,type:{name:"string"},defaultValue:{func:!1,value:"'確認封存'"}},{name:"confirmIcon",description:"Warning 確認鈕的左側圖示；非刪除的確認傳 '' 拿掉圖示（仍保留紅色）",required:!1,type:{name:"string"},defaultValue:{func:!1,value:"'Trash-Del'"}},{name:"showCancel",required:!1,type:{name:"boolean"},defaultValue:{func:!1,value:"true"}},{name:"cancelText",description:"取消（次要）按鈕文字",required:!1,type:{name:"string"},defaultValue:{func:!1,value:"'取消並關閉'"}},{name:"loading",required:!1,type:{name:"boolean"},defaultValue:{func:!1,value:"false"}}],events:[{name:"cancel"},{name:"confirm"}],sourceFiles:["/home/runner/work/mendesky-ds-vue/mendesky-ds-vue/src/components/dialog/DsDialog.vue"]};const me={title:"浮層元件/Dialog",id:"dialog",component:D,decorators:[()=>({template:'<div class="dialog-story"><story /></div>'})],tags:["autodocs"],argTypes:{isOpen:{control:"boolean",description:"控制 dialog 顯示 / 隱藏",table:{defaultValue:{summary:"false"}}},header:{control:"text",description:"Dialog 標題文字",table:{defaultValue:{summary:"Header"}}},content:{control:"text",description:"Dialog 內文說明",table:{defaultValue:{summary:"Content"}}},propClass:{control:"select",options:["Warning","Normal"],description:"樣式語意：Warning 紅色確認鍵 / Normal 藍色確認鍵",table:{defaultValue:{summary:"Warning"}}},confirmText:{control:"text",description:"確認按鈕文字",table:{defaultValue:{summary:"確認封存"}}},onCancel:{action:"cancel"},onConfirm:{action:"confirm"}}},y={args:{isOpen:!1,header:"刪除聯絡窗口資料",content:"此動作無法復原，請確認是否刪除該位聯絡窗口資料",propClass:"Warning",confirmText:"確認刪除"}},x={args:{isOpen:!0,header:"刪除聯絡窗口資料",content:"此動作無法復原，請確認是否刪除該位聯絡窗口資料",propClass:"Warning",confirmText:"確認刪除"}},h={args:{isOpen:!0,header:"放棄設定？",content:"目前填寫的內容尚未儲存，放棄後將不會保留。",propClass:"Normal",confirmText:"放棄"}},b={render:()=>({template:`
      <div style="padding:24px;">
        <button
          @click="open = !open"
          style="padding:8px 16px;background:#1976d2;color:#fff;border:none;border-radius:6px;cursor:pointer;">
          {{ open ? '關閉 Dialog' : '開啟 Dialog' }}
        </button>
        <DsDialog
          :isOpen="open"
          header="永久刪除無法回復"
          content="此操作將永久刪除此則備註，無法撤回，是否繼續？"
          propClass="Warning"
          confirmText="確認刪除"
          @cancel="open = false"
          @confirm="open = false">
        </DsDialog>
      </div>
    `,setup:()=>({open:k(!1)}),components:{DsDialog:D}})};var E,N,q;y.parameters={...y.parameters,docs:{...(E=y.parameters)==null?void 0:E.docs,source:{originalSource:`{
  args: {
    isOpen: false,
    header: '刪除聯絡窗口資料',
    content: '此動作無法復原，請確認是否刪除該位聯絡窗口資料',
    propClass: 'Warning',
    confirmText: '確認刪除'
  }
}`,...(q=(N=y.parameters)==null?void 0:N.docs)==null?void 0:q.source}}};var I,S,L;x.parameters={...x.parameters,docs:{...(I=x.parameters)==null?void 0:I.docs,source:{originalSource:`{
  args: {
    isOpen: true,
    header: '刪除聯絡窗口資料',
    content: '此動作無法復原，請確認是否刪除該位聯絡窗口資料',
    propClass: 'Warning',
    confirmText: '確認刪除'
  }
}`,...(L=(S=x.parameters)==null?void 0:S.docs)==null?void 0:L.source}}};var A,M,$;h.parameters={...h.parameters,docs:{...(A=h.parameters)==null?void 0:A.docs,source:{originalSource:`{
  args: {
    isOpen: true,
    header: '放棄設定？',
    content: '目前填寫的內容尚未儲存，放棄後將不會保留。',
    propClass: 'Normal',
    confirmText: '放棄'
  }
}`,...($=(M=h.parameters)==null?void 0:M.docs)==null?void 0:$.source}}};var H,K,z;b.parameters={...b.parameters,docs:{...(H=b.parameters)==null?void 0:H.docs,source:{originalSource:`{
  render: () => ({
    template: \`
      <div style="padding:24px;">
        <button
          @click="open = !open"
          style="padding:8px 16px;background:#1976d2;color:#fff;border:none;border-radius:6px;cursor:pointer;">
          {{ open ? '關閉 Dialog' : '開啟 Dialog' }}
        </button>
        <DsDialog
          :isOpen="open"
          header="永久刪除無法回復"
          content="此操作將永久刪除此則備註，無法撤回，是否繼續？"
          propClass="Warning"
          confirmText="確認刪除"
          @cancel="open = false"
          @confirm="open = false">
        </DsDialog>
      </div>
    \`,
    setup: () => ({
      open: ref(false)
    }),
    components: {
      DsDialog
    }
  })
}`,...(z=(K=b.parameters)==null?void 0:K.docs)==null?void 0:z.source}}};const pe=["WarningClosed","WarningOpen","NormalOpen","Interactive"];export{b as Interactive,h as NormalOpen,y as WarningClosed,x as WarningOpen,pe as __namedExportsOrder,me as default};

AUI.add("aui-diagram-builder-connector",function(h){var N=h.Lang,r=N.isArray,u=N.isBoolean,C=N.isObject,f=N.isString,n=h.Array,L=function(A){return(A*A*A);},K=function(A){return(3*A*A*(1-A));},J=function(A){return(3*A*(1-A)*(1-A));},H=function(A){return((1-A)*(1-A)*(1-A));},k=function(R,Q,P,T,S){var A=Q[0]*L(R)+T[0]*K(R)+S[0]*J(R)+P[0]*H(R);var U=Q[1]*L(R)+T[1]*K(R)+S[1]*J(R)+P[1]*H(R);return[A,U];},E=function(A){return(A instanceof h.Graphic);},c=function(A){return A*180/Math.PI;},g=function(A){return A===0?0:(A<0?-1:1);},z="anchor",F="arrowPoints",O="builder",D="click",w="color",p="connector",s="diagramNode",y="fill",x="graphic",I="lazyDraw",b="mouseenter",i="mouseleave",v="name",m="p1",l="p2",d="path",t="selected",q="shape",a="shapeArrow",o="shapeArrowHover",G="shapeArrowSelected",B="shapeHover",j="shapeSelected",e="stroke",M="visible";h.PolygonUtil={ARROW_POINTS:[[-12,-6],[-8,0],[-12,6],[6,0]],drawArrow:function(Q,R,T,P,S,U){var A=this;var V=Math.atan2(S-T,P-R);Q.moveTo(P,S);P=P-5*Math.cos(V);S=S-5*Math.sin(V);A.drawPolygon(Q,A.translatePoints(A.rotatePoints(U||A.ARROW_POINTS,V),P,S));},drawPolygon:function(P,Q){var A=this;P.moveTo(Q[0][0],Q[0][1]);n.each(Q,function(S,R){if(R>0){P.lineTo(Q[R][0],Q[R][1]);}});P.lineTo(Q[0][0],Q[0][1]);},translatePoints:function(Q,P,S){var A=this;var R=[];n.each(Q,function(U,T){R.push([Q[T][0]+P,Q[T][1]+S]);});return R;},rotatePoints:function(P,R){var A=this;var Q=[];n.each(P,function(T,S){Q.push(A.rotatePoint(R,P[S][0],P[S][1]));});return Q;},rotatePoint:function(P,A,Q){return[(A*Math.cos(P))-(Q*Math.sin(P)),(A*Math.sin(P))+(Q*Math.cos(P))];}};h.Connector=h.Base.create("line",h.Base,[],{SERIALIZABLE_ATTRS:[w,I,v,j,B,m,l],shape:null,shapeArrow:null,initializer:function(Q){var A=this;var P=A.get(I);A.after({p1Change:A.draw,p2Change:A.draw,selectedChange:A._afterSelectedChange});A._initShapes();if(!P){A.draw();}A._uiSetSelected(A.get(t),!P);},destroy:function(){var A=this;A.shape.destroy();},draw:function(){var ah=this;var R=ah.shape;var A=ah.shapeArrow;var Q=ah.get(m),P=ah.get(l),ad=ah.getCoordinate(Q),ac=ah.getCoordinate(P),af=ad[0],T=ad[1],ae=ac[0],S=ac[1],Z=Math.max(Math.abs(af-ae)/2,10),X=Math.max(Math.abs(T-S)/2,10),W=null,Y=8,ag=c(Math.atan2(S-T,ae-af)),U=Math.round(Math.abs(ag)/(360/Y));if(g(ag)<0){W=[[af+Z,T,ae-Z,S,ae,S],[af+Z,T,ae,T-X,ae,S],[af,T-X,ae,T-X,ae,S],[af-Z,T,ae,T-X,ae,S],[af-Z,T,ae+Z,S,ae,S]];}else{W=[[af+Z,T,ae-Z,S,ae,S],[af+Z,T,ae,T+X,ae,S],[af,T+X,ae,T+X,ae,S],[af-Z,T,ae,T+X,ae,S],[af-Z,T,ae+Z,S,ae,S]];}var V=W[U];R.clear();R.moveTo(af,T);R.curveTo.apply(R,V);R.end();var ab=k(0,[af,T],[ae,S],[V[0],V[1]],[V[2],V[3]]),aa=k(0.025,[af,T],[ae,S],[V[0],V[1]],[V[2],V[3]]);A.clear();h.PolygonUtil.drawArrow(A,aa[0],aa[1],ab[0],ab[1],ah.get(F));A.end();return ah;},getCoordinate:function(Q){var A=this;var P=A.get(x).getXY();return[Q[0]-P[0],Q[1]-P[1]];},getProperties:function(){var A=this;var P=A.getPropertyModel();n.each(P,function(Q){Q.value=A.get(Q.attributeName);});return P;},getPropertyModel:function(){var P=this;var Q=P.get(z);var A=Q?Q.get(s).getStrings():{};return[{attributeName:v,editor:new h.TextCellEditor({validator:{rules:{value:{required:true}}}}),name:A[v]}];},hide:function(){var A=this;A.shape.set(M,false);A.shapeArrow.set(M,false);return A;},show:function(){var A=this;A.shape.set(M,true);A.shapeArrow.set(M,true);return A;},toJSON:function(){var A=this;var P={};n.each(A.SERIALIZABLE_ATTRS,function(Q){P[Q]=A.get(Q);});return P;},_afterSelectedChange:function(P){var A=this;A._uiSetSelected(P.newVal);},_initShapes:function(){var A=this;var P=A.shape=A.get(x).addShape(A.get(q));var Q=A.shapeArrow=A.get(x).addShape(A.get(a));P.on(D,h.bind(A._onShapeClick,A));P.on(b,h.bind(A._onShapeMouseEnter,A));P.on(i,h.bind(A._onShapeMouseLeave,A));Q.on(D,h.bind(A._onShapeClick,A));},_onShapeClick:function(R){var A=this;var P=A.get(O);var Q=A.get(t);if(P){if(R.hasModifier()){P.closeEditProperties();}else{P.unselectConnectors();if(Q){P.closeEditProperties();}else{P.editConnector(A);}}}A.set(t,!Q);},_onShapeMouseEnter:function(R){var A=this;if(!A.get(t)){var Q=A.get(B);var P=A.get(o);if(Q){A._updateShape(A.shape,Q);}if(P){A._updateShape(A.shapeArrow,P);}}},_onShapeMouseLeave:function(P){var A=this;if(!A.get(t)){A._updateShape(A.shape,A.get(q));A._updateShape(A.shapeArrow,A.get(a));}},_setShape:function(P){var A=this;return h.merge({type:d,stroke:{color:A.get(w),weight:2,opacity:1}},P);},_setShapeArrow:function(P){var A=this;return h.merge({type:d,fill:{color:A.get(w),opacity:1},stroke:{color:A.get(w),weight:2,opacity:1}},P);},_uiSetSelected:function(Q,P){var A=this;A._updateShape(A.shape,Q?A.get(j):A.get(q),P);A._updateShape(A.shapeArrow,Q?A.get(G):A.get(a),P);},_updateShape:function(Q,R,P){var A=this;if(R.hasOwnProperty(y)){Q.set(y,R[y]);}if(R.hasOwnProperty(e)){Q.set(e,R[e]);}if(P!==false){A.draw();}}},{ATTRS:{arrowPoints:{value:h.PolygonUtil.ARROW_POINTS},builder:{},color:{value:"#27aae1",validator:f},graphic:{validator:E},lazyDraw:{value:false,validator:u},name:{valueFn:function(){var A=this;return p+(++h.Env._uidx);},validator:f},p1:{value:[0,0],validator:r},p2:{value:[0,0],validator:r},selected:{value:false,validator:u},shape:{value:null,setter:"_setShape"},shapeArrow:{value:null,setter:"_setShapeArrow"},shapeArrowHover:{value:{fill:{color:"#ffd700"},stroke:{color:"#ffd700",weight:5,opacity:0.8}}},shapeArrowSelected:{value:{fill:{color:"#ff6600"},stroke:{color:"#ff6600",weight:5,opacity:0.8}}},shapeHover:{value:{stroke:{color:"#ffd700",weight:5,opacity:0.8}}},shapeSelected:{value:{stroke:{color:"#ff6600",weight:5,opacity:0.8}}},transition:{value:{},validator:C},value:[0,0],validator:r},p2:{}});},"@VERSION@",{requires:["aui-base","arraylist-add","arraylist-filter","json","graphics","dd"],skinnable:true});
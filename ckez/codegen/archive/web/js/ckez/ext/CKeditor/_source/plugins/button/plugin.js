CKEDITOR.plugins.add("button",{beforeInit:function(a){a.ui.addHandler(CKEDITOR.UI_BUTTON,CKEDITOR.ui.button.handler)}});CKEDITOR.UI_BUTTON="button";CKEDITOR.ui.button=function(a){CKEDITOR.tools.extend(this,a,{title:a.label,className:a.className||(a.command&&"cke_button_"+a.command)||"",click:a.click||function(b){b.execCommand(a.command)}});this._={}};CKEDITOR.ui.button.handler={create:function(a){return new CKEDITOR.ui.button(a)}};(function(){CKEDITOR.ui.button.prototype={render:function(h,d){var i=CKEDITOR.env,c=this._.id=CKEDITOR.tools.getNextId(),e="",f=this.command,a;this._.editor=h;var l={id:c,button:this,editor:h,focus:function(){var n=CKEDITOR.document.getById(c);n.focus()},execute:function(){this.button.click(h)}};var j=CKEDITOR.tools.addFunction(function(n){if(l.onkey){n=new CKEDITOR.dom.event(n);return(l.onkey(l,n.getKeystroke())!==false)}});var b=CKEDITOR.tools.addFunction(function(n){var o;if(l.onfocus){o=(l.onfocus(l,new CKEDITOR.dom.event(n))!==false)}if(CKEDITOR.env.gecko&&CKEDITOR.env.version<10900){n.preventBubble()}return o});l.clickFn=a=CKEDITOR.tools.addFunction(l.execute,l);if(this.modes){var k={};function m(){var o=h.mode;if(o){var n=this.modes[o]?k[o]!=undefined?k[o]:CKEDITOR.TRISTATE_OFF:CKEDITOR.TRISTATE_DISABLED;this.setState(h.readOnly&&!this.readOnly?CKEDITOR.TRISTATE_DISABLED:n)}}h.on("beforeModeUnload",function(){if(h.mode&&this._.state!=CKEDITOR.TRISTATE_DISABLED){k[h.mode]=this._.state}},this);h.on("mode",m,this);!this.readOnly&&h.on("readOnly",m,this)}else{if(f){f=h.getCommand(f);if(f){f.on("state",function(){this.setState(f.state)},this);e+="cke_"+(f.state==CKEDITOR.TRISTATE_ON?"on":f.state==CKEDITOR.TRISTATE_DISABLED?"disabled":"off")}}}if(!f){e+="cke_off"}if(this.className){e+=" "+this.className}d.push('<span class="cke_button'+(this.icon&&this.icon.indexOf(".png")==-1?" cke_noalphafix":"")+'">','<a id="',c,'" class="',e,'"',i.gecko&&i.version>=10900&&!i.hc?"":'" href="javascript:void(\''+(this.title||"").replace("'","")+"')\"",' title="',this.title,'" tabindex="-1" hidefocus="true" role="button" aria-labelledby="'+c+'_label"'+(this.hasArrow?' aria-haspopup="true"':""));if(i.opera||(i.gecko&&i.mac)){d.push(' onkeypress="return false;"')}if(i.gecko){d.push(' onblur="this.style.cssText = this.style.cssText;"')}d.push(' onkeydown="return CKEDITOR.tools.callFunction(',j,', event);" onfocus="return CKEDITOR.tools.callFunction(',b,', event);" onclick="CKEDITOR.tools.callFunction(',a,', this); return false;"><span class="cke_icon"');if(this.icon){var g=(this.iconOffset||0)*-16;d.push(' style="background-image:url(',CKEDITOR.getUrl(this.icon),");background-position:0 "+g+'px;"')}d.push('>&nbsp;</span><span id="',c,'_label" class="cke_label">',this.label,"</span>");if(this.hasArrow){d.push('<span class="cke_buttonarrow">'+(CKEDITOR.env.hc?"&#9660;":"&nbsp;")+"</span>")}d.push("</a>","</span>");if(this.onRender){this.onRender()}return l},setState:function(b){if(this._.state==b){return false}this._.state=b;var a=CKEDITOR.document.getById(this._.id);if(a){a.setState(b);b==CKEDITOR.TRISTATE_DISABLED?a.setAttribute("aria-disabled",true):a.removeAttribute("aria-disabled");b==CKEDITOR.TRISTATE_ON?a.setAttribute("aria-pressed",true):a.removeAttribute("aria-pressed");return true}else{return false}}}})();CKEDITOR.ui.prototype.addButton=function(a,b){this.add(a,CKEDITOR.UI_BUTTON,b)};
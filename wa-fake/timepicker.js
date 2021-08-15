$.widget("wx.timepicker",{_create:function(){this.timepicker=$('<div class="timepicker"><div class="clock"><div class="unit hour bubble">Hr</div><div class="unit minute bubble">Min</div><div class="face"><div class="time-bubbles"></div><div class="minute hand"></div><div class="hour hand"></div></div><div class="meridiem am bubble">AM</div><div class="meridiem pm bubble">PM</div></div><div class="done">Time Picker</div></div>').hide().insertAfter(this.element),this.hour=0,this.minute=0,this.meridiem=0,this.display=0,this.isOpen=!1;var i=this;this.element.prop("autocomplete",!1),i._parseInput()&&i._refreshAll(),this.timepicker.find(".unit.minute").on("click",function(){i._buildMinutes()}),this.timepicker.find(".unit.hour").on("click",function(){i._buildHours()}),this.timepicker.on("click",".time.hour",function(){i.hour=$(this).data("value"),i._buildMinutes(),i._refreshAll()}),this.timepicker.on("click",".time.minute",function(){i.minute=$(this).data("value"),i._refreshAll()}),this.element.on("focus click",function(){i._open()}),this.timepicker.on("mousedown",function(i){return!1}),this.element.on("blur",function(e){i._parseInput(),i._refreshInput(),i._close()}),this.element.on("input",function(){i._parseInput()&&i._refreshClock()}),this.timepicker.find(".done").on("click",function(){i.element.focus(),i._close()}),this.timepicker.find(".meridiem.am").on("click",function(){i.meridiem=0,i._refreshAll()}),this.timepicker.find(".meridiem.pm").on("click",function(){i.meridiem=1,i._refreshAll()})},_open:function(){if(!this.isOpen){var i=this.element.offset();this.timepicker.css({left:i.left+"px",top:i.top+this.element.outerHeight()+"px"}).show(),this.isOpen=!1,this._buildHours()}},_close:function(){this.isOpen&&(this.timepicker.hide(),this.isOpen=!1)},_refreshAll:function(){this._refreshInput(),this._refreshClock()},_refreshInput:function(){var i=0===this.hour?12:this.hour,e=this.minute<10?"0"+this.minute:this.minute;this.element.val(i+":"+e+(this.meridiem?" PM":" AM"))},_refreshClock:function(){var i=this;this.meridiem?(this.timepicker.find(".meridiem.am").removeClass("selected"),this.timepicker.find(".meridiem.pm").addClass("selected")):(this.timepicker.find(".meridiem.pm").removeClass("selected"),this.timepicker.find(".meridiem.am").addClass("selected")),this.timepicker.find(".time.selected").removeClass("selected"),1===this.display?this.timepicker.find(".time.hour").filter(function(){return $(this).data("value")===i.hour}).addClass("selected"):this.timepicker.find(".time.minute").filter(function(){return $(this).data("value")===i.minute}).addClass("selected"),this.timepicker.find(".hand.hour").css("transform","rotate("+this.hour/12*360+"deg)"),this.timepicker.find(".hand.minute").css("transform","rotate("+this.minute/60*360+"deg)")},_parseInput:function(){var i,e=$.trim(this.element.val()),t=!1;return this.hour=0,this.minute=0,this.meridiem=0,e.length>0&&(i=/^(\d{1,2})(?::?(\d{2}))?(?: ?([ap])\.?(?:m\.?)?)?$/i.exec(e))&&(t=!0,this.hour=parseInt(i[1]),this.minute=i[2]?parseInt(i[2]):0,i[3]&&"p"===i[3].toLowerCase()&&(this.meridiem=1)),this.minute>=60&&(this.hour+=Math.floor(this.minute/60),this.minute=this.minute%60),this.hour>=12&&(this.meridiem=1,this.hour=this.hour%12),t},_buildHours:function(){if(1!==this.display){this.display=1;for(var i=this.timepicker.find(".face").width()/2,e=i-22,t=[],s=0;s<12;++s){var n=e*Math.sin(2*Math.PI*(s/12)),r=e*Math.cos(2*Math.PI*(s/12)),h=$("<div>",{class:"time hour bubble"}).text(0==s?12:s).css({marginLeft:n+i-15+"px",marginTop:-r+i-15+"px"}).data("value",s);this.hour===s&&h.addClass("selected"),t.push(h)}this.timepicker.find(".time-bubbles").html(t),this.timepicker.find(".minute.hand").removeClass("selected"),this.timepicker.find(".minute.unit").removeClass("selected"),this.timepicker.find(".hour.hand").addClass("selected").appendTo(this.timepicker.find(".face")),this.timepicker.find(".hour.unit").addClass("selected")}},_buildMinutes:function(){if(2!==this.display){this.display=2;for(var i=this.timepicker.find(".face").width()/2,e=i-22,t=[],s=0;s<60;s+=5){var n=s<10?"0"+s:String(s),r=e*Math.sin(2*Math.PI*(s/60)),h=e*Math.cos(2*Math.PI*(s/60)),d=$("<div>",{class:"time minute bubble"}).text(n).css({marginLeft:r+i-15+"px",marginTop:-h+i-15+"px"}).data("value",s);this.minute===s&&d.addClass("selected"),t.push(d)}this.timepicker.find(".time-bubbles").html(t),this.timepicker.find(".hour.hand").removeClass("selected"),this.timepicker.find(".hour.unit").removeClass("selected"),this.timepicker.find(".minute.hand").addClass("selected").appendTo(this.timepicker.find(".face")),this.timepicker.find(".minute.unit").addClass("selected")}}}),$("#input").timepicker(),window.onload=function(){document.getElementById("input").click()};
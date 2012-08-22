/*
- add a battle log and capture statistics during battle

*/
var _rin = {
	getCharacter: function(name) { return _rin.vars.characters[name]; },
	getCurrentMap: function() { return _rin.vars.currentMap; },
	path: function(type) {
		switch(type) {
			case "characters": return "inc/packs/"+_rin.vars.pack+"/characters"; break;
			case "enemies": return "inc/packs/"+_rin.vars.pack+"/enemies"; break;
		}
	},
	goto: function( state, data ) {
		switch( state ) {
			case "battle": return _rin.states.battle(); break;
			case "dialog": return _rin.states.dialog(); break;
			default: return _rin.states.world(state, {name: data===undefined?"world":data["name"], 
				x:data === undefined ? undefined : data["x"],
				y:data === undefined ? undefined : data["y"]}); break;
		}
	},
	states: {
		title: function() {
		},
		dialog: function() {
			var dialog = new _rin.ui.element("dialog").appendTo("body").attribute("id", "dialog");
			dialog.style({left:"20px",right:"20px",bottom:"20px",height:"188px",border:"1px solid black"});
			return dialog;
		},
		menu: function() {
		},
		battle: function() {
			_rin.controls.disable("world");
			_rin.character.stopNPC();
			$("#html").animate({opacity:0.2}, 300, function(){
				$("#html").animate({opacity:1}, 300, function(){
					$("#html").animate({opacity:0.2}, 300, function(){
				$("#html").css("opacity","1");
				var tile = _rin.getCurrentMap().map.map[_rin.vars.p.main.currentY][_rin.vars.p.main.currentX];
				var battle = new _rin.ui.element("battle","inc/maps/default/battle/"+_rin.getCurrentMap().map.tiles.battle(tile)).appendTo("body");
				$("#world").remove();
				$("#main").remove();
				_rin.vars.state = "battle";
				_rin.functions.addBattleWindow();
				_rin.functions.battleParty();
				_rin.functions.battleEnemies(tile);
				_rin.controls.enable("battle");
			})})});
		},
		world: function(world, data) {
			if(_rin.vars.state != "") _rin.controls.disable(_rin.vars.state);
			_rin.vars.state = "world";
			var world = new _rin.ui.element("world", data["name"]).appendTo("body").style({"position":"absolute",
				"left":parseInt($("html").width()/2-$("#world").width()/2)+"px","top":parseInt($("html").height()/2-$("#world").height()/2)+"px"});
			if( data["x"] !== undefined && data["y"] !== undefined ) {
				_rin.vars.p.main.style({"width":parseInt(_rin.vars.p.main.originalWidth*_rin.vars.p.main.character.scale.world)+"px",
					"height":parseInt(_rin.vars.p.main.originalHeight*_rin.vars.p.main.character.scale.world)+"px"});
					_rin.vars.p.main.place(data["x"],data["y"]);
			}
			$("#html").animate({opacity: 1}, 500, function(){
				_rin.controls.enable("world"); });
			return world;
		},
	},
	battle: {
		results: function() {
			var exp = 0; var gil = 0;
			for( var enemy in _rin.vars.b.enemies ) {	exp += parseInt(_rin.vars.b.enemies[enemy].enemy.stats.exp);
				gil += parseInt(_rin.vars.b.enemies[enemy].enemy.drops.gil); }
			_rin.battle.toast("Victory !!");
			_rin.vars.q.queue = [function(){ _rin.battle.toast("Gained "+exp+" exp.");
				for( var char = _rin.vars.party.length-1; char >= 0; char-- ) { !(_rin.vars.party[char].dead)
					_rin.character.giveEXP( _rin.vars.party[char], exp ); } }, function(){
						_rin.battle.toast("Acquired "+gil+" gil."); _rin.character.giveGil(gil); } ];
			_rin.vars.q.timer =  setTimeout(function(){_rin.vars.q.done = true;},1000);
		},
		endBattle: function() {
			if(_rin.vars.b.end) {
				_rin.vars.b.end = false;
				_rin.controls.disable("battle");
				$("#html").animate({opacity: 0}, 500, function(){
					clearTimeout(_rin.vars.q.timer); _rin.vars.q.timer = null;
					_rin.vars.b.end = false; _rin.vars.b.acting = false; _rin.vars.b.action = ""; _rin.vars.b.recentDamage = 0; _rin.vars.b.enemies = [];
					_rin.vars.q.queue = [];
					_rin.vars.turns = [];
					_rin.vars.takingTurn = false;
					_rin.vars.choosing = false;
					_rin.vars.currentMenuIndex = 0;
					_rin.vars.currentTargetIndex = 0;
					_rin.vars.currentAction = "";
					_rin.vars.waiting = [];
					$("#main").remove();
					$("#battle").remove();
					_rin.goto("world", {name: _rin.getCurrentMap().map.name, x:_rin.vars.p.main.currentX, y:_rin.vars.p.main.currentY } );
				});
			}
		},
		toastQueue: function(){
			if(_rin.vars.q.queue.length != 0) {
				_rin.vars.q.done = false;
				_rin.vars.q.queue[0].call();
				_rin.vars.q.queue.splice(0,1);
				_rin.vars.q.timer = setTimeout(function(){_rin.vars.q.done = true;},1000);
			} else _rin.vars.q.timer = setTimeout(function(){ _rin.battle.endBattle(); }, 500);
		},
		toast: function(string) { _rin.vars.b.toast = string; var toast = new _rin.ui.element("window","battle_toast"); },
		processDamage: function(char, amount, color) {
			_rin.battle.displayDamage(char, amount, color);
			char.currentHP = Math.max(0, char.currentHP-amount);
			if(char.type=="character") {
				$(".currenthp")[char.index].innerHTML = char.currentHP;
				if(parseInt(char.currentHP * 100 / char.maxHP) < 35) {
					$(".currenthp")[char.index].style.color = 'yellow';
					_rin.vars.party[char.index].sprite("kneel");
					_rin.vars.party[char.index].critical = true;
				}
			}
			if(char.currentHP == 0) _rin.battle.kill(char);
		},
		victory: function() {
			_rin.vars.b.end = true;
			for( var char in _rin.vars.party) {
				clearInterval(_rin.vars.party[char].atb);
				if(!_rin.vars.party[char].dead) _rin.vars.party[char].sprite("victory");
			}
			$("#battle_command").remove();
			_rin.battle.results();
		},
		gameOver: function() {
			_rin.vars.end = true;
			for( var enemy in _rin.vars.b.enemies) {
				clearInterval(_rin.vars.b.enemies[enemy].atb);
			}
			_rin.battle.toast("Party defeated.");
			_rin.vars.q.queue = [function(){ window.location = './index.html'; }];
			_rin.vars.q.timer =  setTimeout(function(){_rin.vars.q.done = true;},1000);
		},
		kill: function(char) {
			if(char.type=="character") {
				$(".currenthp")[char.index].style.color = 'red';
				_rin.vars.party[char.index].dead = true;
				_rin.vars.party[char.index].critical = false;
				_rin.vars.party[char.index].sprite("ko");
				_rin.character.clearATB(_rin.vars.party[char.index]);
				var alive = false;
				for(var i in _rin.vars.party) {
					if(!_rin.vars.party[i].dead) alive = true;
				}
				for(var turn in _rin.vars.turns){ if(_rin.vars.turns[turn].name == char.name) _rin.vars.turns.splice(turn,1); }
				if(char.index == _rin.vars.takingTurn) {
					$("#battle_command").remove();
					_rin.vars.takingTurn = false;
					setTimeout(function(){ _rin.character.processWaiting(); },500);
				}
				if(!alive) _rin.battle.gameOver();
			}
			else {
				clearInterval(_rin.vars.b.enemies[char.index].atb);
				_rin.vars.b.enemies[char.index].dead = true;
				$($(".enemy")[char.index]).animate({opacity:0},200,function(){ $($(".enemy")[char.index]).attr("alt", "dead"); });
			}
		},
		displayDamage: function(char, amount, color) {
			var damage = document.createElement("div");
			damage.setAttribute("style", "position: absolute;font-size:20px;top:"+($(char.element).position().top+char.originalHeight/2)+"px;\
				left:"+$(char.element).position().left+"px;color:"+color+";text-shadow: black 0.1em 0.1em 0.2em;");
			damage.setAttribute("id","damage");
			damage.innerHTML = amount;
			$("#battle")[0].appendChild(damage);
			$("#damage").animate({top:$("#damage").position().top-20},200,function(){
				$("#damage").animate({top:$("#damage").position().top+20},200,function(){
					$("#damage").remove();
				});
			});
		},
		lowerHP: function(char,amount) {
		},
		action: function() {
			switch(_rin.vars.turns[0].b.action) {
				case "attack":
					if( _rin.vars.turns[0].type == "character" ) {
						if($($(".enemy")[_rin.vars.turns[0].b.target]).is("[alt='dead']")) {
							if($(".enemy").not("[alt='dead']").length != 0) {_rin.vars.turns[0].b.target = $($(".enemy").not("[alt='dead']")[0]).index();}
						}
					}
					else if( _rin.vars.party[_rin.vars.turns[0].b.target].currentHP == 0) {
						var found = false;
						for(var i in _rin.vars.party) {
							if((_rin.vars.party[i].currentHP.toString()=="0")===false) { found = true; _rin.vars.turns[0].b.target = i; break; }
						}
						if( !found ) _rin.battle.gameOver();
					}
					_rin.battle.toast("attack");
					var pos = _rin.vars.turns[0].type=="enemy"?$(_rin.vars.party[_rin.vars.turns[0].b.target].element).position():
						$(_rin.vars.b.enemies[_rin.vars.turns[0].b.target].element).position();
					var width = _rin.vars.turns[0].type=="enemy"?$(_rin.vars.party[_rin.vars.turns[0].b.target].element).width():
						$(_rin.vars.b.enemies[_rin.vars.turns[0].b.target].element).width();
					var height = _rin.vars.turns[0].type=="enemy"?$(_rin.vars.party[_rin.vars.turns[0].b.target].element).height():
						$(_rin.vars.b.enemies[_rin.vars.turns[0].b.target].element).height();
					if(_rin.vars.turns[0].type=="enemy") _rin.vars.party[_rin.vars.turns[0].b.target].sprite("hit");
					setTimeout(function(){
						$("#battle").append('<img id="attack" src="inc/packs/default/skills/attack_1.gif" style="position: absolute;\
							top:'+pos.top+'px;left:'+pos.left+'px;width:'+width+'px;height:'+height+'px" />');
						setTimeout(function(){
							$("#attack").attr("src", "inc/packs/default/skills/attack_2.gif");
							if(_rin.vars.turns[0].type == "enemy") {
								var str = _rin.vars.turns[0].enemy.stats.str;
								var def = _rin.vars.party[_rin.vars.turns[0].b.target].character.stats.def;
								_rin.vars.recentDamage = Math.max(0, parseInt(str * 0.8) - parseInt(def * 0.5));
								_rin.vars.recentDamage = Math.floor( Math.random()*_rin.vars.recentDamage)+_rin.vars.recentDamage+(Math.floor(str*0.2));
								_rin.battle.processDamage(_rin.vars.party[_rin.vars.turns[0].b.target],_rin.vars.recentDamage, "#eeeeee");
							}
							else {
								var str = _rin.vars.turns[0].character.stats.str;
								var def = _rin.vars.b.enemies[_rin.vars.turns[0].b.target].enemy.stats.def;
								_rin.vars.recentDamage = Math.max(0, parseInt(str * 0.8) - parseInt(def * 0.5));
								_rin.vars.recentDamage = Math.floor( Math.random()*_rin.vars.recentDamage)+_rin.vars.recentDamage+(Math.floor(str*0.2));
								_rin.battle.processDamage(_rin.vars.b.enemies[_rin.vars.turns[0].b.target],_rin.vars.recentDamage, "#eeeeee");
							}
							setTimeout(function(){
								$("#attack").attr("src", "inc/packs/default/skills/attack_3.gif");
								setTimeout(function(){
									$("#attack").attr("src", "inc/packs/default/skills/attack_4.gif");
									setTimeout(function(){
										if(_rin.vars.turns[0].type == "enemy") {
											if(!_rin.vars.party[_rin.vars.turns[0].b.target].critical &&
												!_rin.vars.party[_rin.vars.turns[0].b.target].dead) _rin.vars.party[_rin.vars.turns[0].b.target].sprite("battle");
											if(_rin.vars.takingTurn !== false && _rin.vars.turns[0].type == "enemy") {
												if(_rin.vars.party[_rin.vars.takingTurn].name == _rin.vars.party[_rin.vars.turns[0].b.target].name) {
													if(!_rin.vars.party[_rin.vars.turns[0].b.target].dead) {
														_rin.vars.party[_rin.vars.turns[0].b.target].sprite("turn");
													}
												}
											}
										}
										$("#attack").remove();
										setTimeout(function(){
											$("#battle_toast").remove();
											setTimeout(function(){
												if( $(".enemy").not("[alt='dead']").length == 0) return _rin.battle.victory();
												else if(!_rin.vars.b.end) _rin.battle.finishTurn();
												else { _rin.vars.turns = []; _rin.vars.waiting = []; }
											}, 500);
										}, 500);
									}, 150);
								}, 150);
							}, 150);
						}, 150);
					}, 150);
					break;
			}
		},
		restartATB: function(type, index) {
			if(type == "character") {
				_rin.vars.party[index].atbCurrent = 0;
				$(_rin.vars.party[index].atbElement).css({"background-color":"#eeeeee","width":_rin.vars.party[index].atbCurrent+"%"});
				_rin.vars.party[index].atb = setInterval( function(){_rin.character.progressATB(_rin.vars.party[index], index)},
					parseInt( parseInt( 5000 - (_rin.vars.party[index].character.stats.agi * 25) ) / 100*_rin.vars.battleSpeed) );
			} else {
				if(_rin.vars.b.enemies !== undefined) {
					_rin.vars.b.enemies[index].atbCurrent = 0;
					_rin.vars.b.enemies[index].atb = setInterval( function(){_rin.enemy.progressATB(_rin.vars.b.enemies[index] , index)},
					parseInt( parseInt( 5000 - (_rin.vars.b.enemies[index].enemy.stats.agi * 25) ) / 85*_rin.vars.battleSpeed) );
				}
			}
		},
		addTurn: function() {
			_rin.vars.party[_rin.vars.takingTurn].b.action = _rin.vars.currentAction;
			_rin.vars.party[_rin.vars.takingTurn].b.target = _rin.vars.currentTargetIndex;
			_rin.vars.turns.push(_rin.vars.party[_rin.vars.takingTurn]);
			_rin.vars.party[_rin.vars.takingTurn].sprite("act");
			_rin.vars.takingTurn = false;
			_rin.vars.choosing = false;
			$("#battle_command").remove();
			$("#target").remove();
			setTimeout(function(){ _rin.character.processWaiting(); },500);
			_rin.battle.processTurns();
		},
		processTurns: function() {
			if( !_rin.vars.end && _rin.vars.b.acting===false && _rin.vars.turns.length > 0 ) {
				if(_rin.vars.turns[0].dead===true) { _rin.vars.turns.splice(0,1); _rin.battle.processTurns(); }
				else {
					_rin.vars.b.acting = true;
					_rin.battle.action();
				}
			}
		},
		finishTurn: function() {
			if(_rin.vars.turns[0].type == "character")
				if(_rin.vars.turns[0].dead) _rin.vars.turns[0].sprite("ko");
				else if(_rin.vars.turns[0].critical) _rin.vars.turns[0].sprite("kneel");
				else _rin.vars.turns[0].sprite("battle");
			var temp = _rin.vars.turns[0];
			_rin.vars.turns.splice(0,1);
			_rin.vars.b.acting = false;
			_rin.battle.processTurns();
			if(!temp.dead) _rin.battle.restartATB(temp.type, temp.index);
		},
		skip: function() {
			_rin.vars.waiting.push(_rin.vars.party[_rin.vars.takingTurn]);
			if(_rin.vars.party[_rin.vars.takingTurn].critical) _rin.vars.party[_rin.vars.takingTurn].sprite("kneel");
			else _rin.vars.party[_rin.vars.takingTurn].sprite("battle");
			_rin.vars.takingTurn = false;
			$("#battle_command").remove();
			setTimeout( function(){ _rin.character.processWaiting(); }, 100);
		},
		moveTargetUp: function() {
			while($($(".enemy")[_rin.vars.currentTargetIndex-1]).attr("alt") == "dead" || _rin.vars.currentTargetIndex-1 == -1)
				if(_rin.vars.currentTargetIndex-1 == -1) _rin.vars.currentTargetIndex = $(".enemy").length;
				else _rin.vars.currentTargetIndex--;
			_rin.battle.moveTargetTo(_rin.vars.currentTargetIndex-1);
		},
		moveTargetDown: function() {
			while($($(".enemy")[_rin.vars.currentTargetIndex+1]).attr("alt") == "dead"||_rin.vars.currentTargetIndex+1==$(".enemy").length)
				if(_rin.vars.currentTargetIndex+1 == $(".enemy").length) _rin.vars.currentTargetIndex = -1;
				else _rin.vars.currentTargetIndex++;
			_rin.battle.moveTargetTo(_rin.vars.currentTargetIndex+1);
		},
		acquireTarget: function() {
			$("#cursor").attr("src","inc/packs/default/ui/cursor_right_b.gif");
			_rin.battle.moveTargetTo(_rin.vars.party[_rin.vars.takingTurn].memory.target);
		},
		cancelTarget: function() {
			$("#cursor").attr("src","inc/packs/default/ui/cursor_right.gif");
			$("#target").remove();
			_rin.vars.choosing = false;
		},
		moveTargetTo: function(index) {
			if( $($(".enemy")[index]).attr("alt") != "dead" && $($(".enemy")[index]).length) {
				if($("#target").length == 0)
					$("#battle").append('<img id="target" style="position: absolute; width: 40px; height: 24px;\
						left: '+($($(".enemy")[index]).position().left+$($(".enemy")[index]).width()+5)+'px; \
						top:'+($($(".enemy")[index]).position().top+13)+'px;" \
						src="inc/packs/default/ui/cursor_left_1.gif" />');
				else $("#target").css({left:($($(".enemy")[index]).position().left+$($(".enemy")[index]).width()+5)+"px",
						top:($($(".enemy")[index]).position().top+13)+"px"});
				_rin.vars.currentTargetIndex = index;
				_rin.vars.party[_rin.vars.takingTurn].memory.target = index;
			} else {
				if( $($(".enemy").not("[alt='dead']")[0]).length != 0 ) {
					index = $($(".enemy").not("[alt='dead']")[0]).index(); _rin.battle.moveTargetTo(index);
				}
			}
		},
		downListener: function(ev) {
			switch(ev.keyCode) {
				case _rin.controls.UP_ARROW:
					if( !_rin.vars.choosing) _rin.ui.menu.moveUp("commands");
					else if(_rin.vars.choosing && $("#target").length) _rin.battle.moveTargetUp();
					break;
				case _rin.controls.DOWN_ARROW:
					if( !_rin.vars.choosing) _rin.ui.menu.moveDown("commands");
					else if(_rin.vars.choosing && $("#target").length) _rin.battle.moveTargetDown();
					break;
				case _rin.controls.START: case _rin.controls.CONFIRM:
					if(_rin.vars.q.done) { $("#battle_toast").remove(); _rin.vars.q.timer = null; setTimeout(function(){_rin.battle.toastQueue();},500); }
					else if(_rin.vars.q.timer) {
						if($("#battle_toast").length) {
							clearTimeout(_rin.vars.q.timer);
							_rin.vars.q.timer = null;
							$("#battle_toast").remove(); setTimeout(function(){_rin.battle.toastQueue();},500);
						}
					}
					else if(!_rin.vars.choosing) _rin.ui.menu.activate("commands");
					else if(_rin.vars.choosing) _rin.battle.addTurn();
					break;
				case _rin.controls.SELECT:
					//$("#battle_window").css("display", "none");
					break;
				case _rin.controls.SKIP:
					if( !_rin.vars.choosing && !(_rin.vars.takingTurn === false)) _rin.battle.skip();
					break;
				case _rin.controls.CANCEL:
					if( _rin.vars.choosing && $("#target").length ) _rin.battle.cancelTarget();
					break;
			}
		},
		upListener: function(ev) {
			switch(ev.keyCode) {
				case _rin.controls.SELECT:
					//$("#battle_window").css("display", "block");
					break;
			}
		}
	},
	ui: {
		menu: {
			activate: function(menu) {
				if(document.getElementById(menu) !== null) {
					switch( $($("#"+menu).children("li")[_rin.vars.currentMenuIndex]).children()[0].innerHTML.toLowerCase() ){
						case "attack":
							_rin.vars.choosing = true;
							_rin.vars.currentAction = "attack";
							_rin.battle.acquireTarget();
							break;
					}
				}
			},
			moveUp: function(menu) {
				if(document.getElementById(menu) !== null) {
					_rin.ui.menu.moveTo(menu, _rin.vars.currentMenuIndex-1);
				}
			},
			moveDown: function(menu) {
				if(document.getElementById(menu) !== null) {
					_rin.ui.menu.moveTo(menu, _rin.vars.currentMenuIndex+1);
				}
			},
			moveTo: function(menu, index) {
				if(index == $("#"+menu).children("li").length) index = 0;
				else if(index == -1) index = $("#"+menu).children("li").length-1;
				if(index < $("#"+menu).children("li").length && index != -1) {
					if( $("#"+menu).children("#cursor").length == 0 )
						$("#"+menu).append('<img id="cursor" style="position: absolute; width: 40px; height: 24px;\
							left: '+($($("#"+menu).children("li")[index]).position().left-47)+'px; \
							top:'+($($("#"+menu).children("li")[index]).position().top+13)+'px;" \
							src="inc/packs/default/ui/cursor_right.gif" />');
					else $("#"+menu).children("#cursor").css({left:($($("#"+menu).children("li")[index]).position().left-47)+"px",
						top:($($("#"+menu).children("li")[index]).position().top+13)+"px"});
					_rin.vars.currentMenuIndex = index;
					_rin.vars.party[_rin.vars.takingTurn].memory.battle = index;
				}
			}
		},
		element: function(type,data) {
			this.appendTo = function(tar) { return _rin.functions.appendTo(this, tar); };
			this.append = function(d) { return _rin.functions.append(this, d); };
			this.style = function(t, d) { return _rin.style(this, t, d); };
			this.attribute = function(t, d) { return _rin.attribute(this, t, d); };
			switch( type ) {
				case "battle_menu":
					var command = new _rin.ui.element("window","battle_command");
					$("#battle_command").append('<ul id="commands"></ul>');
					_rin.vars.party[data].sprite("turn");
					for(var i in _rin.vars.party[data].character.commands) {
						$("#commands").append('<li><label>'+_rin.vars.party[data].character.commands[i]+'</label></li>');
					}
					_rin.ui.menu.moveTo("commands", _rin.vars.party[data].memory.battle);
					break;
				case "window":
					this.element = document.createElement("div");
					switch(data) {
						case "battle":
							this.style({"position":"absolute","left":"10px","right":"10px","bottom":"10px","height":"175px",
								"z-index":"10","min-width":"750px"});
							this.attribute("id","battle_window").appendTo("#battle");
							var character_window = document.createElement("div");
							character_window.setAttribute("style","position: absolute; left: 250px; right: 0px; top: 0px; bottom: 0px; \
								background-color: rgba(0,0,255,0.5); border-radius: 10px; box-shadow: inset 0px 0px 2px 5px white;");
							character_window.setAttribute("id", "character_window");
							document.getElementById("battle_window").appendChild(character_window);
							var character_area = document.createElement("div");
							character_area.setAttribute("style","position: absolute; width: 300px; right: 10px; top: 10px; bottom: 10px;");
							character_area.setAttribute("id","character_area");
							document.getElementById("character_window").appendChild(character_area);
							var enemy_window = document.createElement("div");
							enemy_window.setAttribute("style","position: absolute; left: 0px; width: 255px; top: 0px; bottom: 0px; \
								background-color: rgba(0,0,255,0.5); border-radius: 10px; box-shadow: inset 0px 0px 2px 5px white;");
							enemy_window.setAttribute("id","enemy_window");
							document.getElementById("battle_window").appendChild(enemy_window);
							break;
						case "battle_character":
							this.style({"font-size":"15px","border":"1px solid rgba(0,0,0,0)","margin":"3px","padding-left":"3px"});
							this.append('<label class="name" style="width: 110px;">name</label>');
							this.append('<label class="currenthp" style="text-align: right; width: 50px;">0000</label>');
							this.append('<label class="maxhp" style="width: 50px;">/0000</label>');
							this.append('<label class="atb" style="width:70px;height:10px;border-radius:5px;box-shadow:inset 0px 0px 1px 2px white;"></label>');
							this.appendTo("#character_area");
							break;
						case "battle_enemies":
							this.style({"position":"absolute","left":"0px","top":"0px","height":"100px","width":"200px","background-color":"white"});
							this.appendTo("#battle_window");
							break;
						case "battle_toast":
							this.style({"position":"absolute","top":"10px", "left":"30px","right":"30px","padding":"10px","text-align":"center","font-size":"20px",
								"background-color":"rgba(0,0,255,0.8)","border-radius":"10px","box-shadow":"inset 0px 0px 2px 5px white"});
							this.attribute("id", "battle_toast");
							this.element.innerHTML = _rin.vars.b.toast;
							this.appendTo("#battle");
							break;
						case "battle_command":
							this.style({"position":"absolute","left":"175px","width":"250px","top":"0px","bottom":"0px",
								"background-color":"rgba(0,0,255,0.8)","border-radius":"10px","box-shadow":"inset 0px 0px 2px 5px white"});
							this.attribute("id","battle_command");
							this.appendTo("#battle_window");
							break;
					}
					break;
				case "tile":
					this.element = document.createElement("div");
					this.attribute({class:"tile",alt:data});
					break;
				case "enemy":
					this.enemy = _enemies[data["name"]];
					this.currentHP = this.enemy.stats.hp.substring(0, this.enemy.stats.hp.indexOf("/"));
					this.maxHP = this.enemy.stats.hp.substring(this.enemy.stats.hp.indexOf("/")+1);
					this.name = data["name"];
					this.type = "enemy";
					this.dead = false;
					this.speed = 1;
					this.b = { target: "", action: "", timer: "" };
					this.afterload = data["afterload"] || "";
					this.sprite = function(data) { return _rin.enemy.sprite(this,data); };
					this.element = document.createElement("img");
					this.element.onload = (function(i){return function() { _rin.character.setOriginals(i); }}(this));
					this.sprite("right_1");
					this.attribute("class","enemy");
					this.style({position:"absolute",left:"0px",top:"0px"});
					break;
				case "battle":
					if( document.getElementById("battle") !== null ) document.body.removeChild(document.getElementById("battle"));
					this.element = document.createElement("div");
					this.attribute("id", "battle");
					this.style("position","absolute");
					this.append('<img src="'+data+'" style="width: 100%; height: 100%; position: absolute; top: 0px; left: 0px; z-index: -10;" />');
					break;
				case "world":
					if( document.getElementById("world") !== null ) document.body.removeChild(document.getElementById("world"));
					this.element = document.createElement("canvas");
					this.element.setAttribute("id","world");
					this.ctx = this.element.getContext('2d');
					this.map = _maps[data];
					_rin.vars.currentMap = this;
					_rin.functions.fillMap( this );
					break;
				case "dialog":
					this.currentString = ">empty";
					this.currentIndex = 0;
					this.speed = 50;
					this.speak = function( string ) { return _rin.functions.speak( this, string ); };
					this.write = function() { console.log(this); return _rin.functions.write( this ); };
					if( document.getElementById("dialog") !== null ) document.body.removeChild(document.getElementById("dialog"));
					this.element = document.createElement("div");
					this.textTarget = this.element.appendChild( document.createElement("p") );
					break;
				case "character":
					this.name = data["n"];
					this.type = "character";
					this.walkSpeed = 10;
					this.memory = { menu: 0, battle: 0, target: 0 };
					this.speed = 1;
					this.critical = false;
					this.dead = false;
					this.b = { target: "", action: "", timer: "" };
					this.isMoving = false;
					this.move = function(dir) { return _rin.character.move(this, dir); };
					this.place = function(x,y) { return _rin.character.place(this, x, y); };
					this.main = function() { return _rin.character.main(this); };
					this.addToParty = function() { return _rin.character.addToParty(this); };
					this.sprite = function(data) { return _rin.character.sprite(this,data); };
					this.character = _characters[data["n"]];
					this.currentHP = this.character.stats.hp.substring(0, this.character.stats.hp.indexOf("/"));
					this.maxHP = this.character.stats.hp.substring(this.character.stats.hp.indexOf("/")+1);
					this.element = document.createElement("img");
					this.afterload = data["afterload"] || "";
					if(this.afterload != "") this.element.onload = (function(i){return function() { _rin.character.setOriginals(i); }}(this));
					this.sprite("right_1");
					this.element.setAttribute("alt", "");
					break;
			}
		},
		effects: {
		}
	},
	enemy: {
		sprite: function(enemy,data) {
			if(enemy.attribute("src") != _rin.path("enemies")+"/"+enemy.name+"/"+data+".gif")
				enemy.attribute("src", _rin.path("enemies")+"/"+enemy.name+"/"+data+".gif");
			return enemy;
		},
		startATB: function(enemy, index) {
			enemy.atbCurrent = parseInt(Math.ceil(enemy.enemy.stats.agi / 1.3) * 0.7);
			enemy.atbCurrent = Math.floor( Math.random()*enemy.atbCurrent+10 )+enemy.atbCurrent;
			enemy.atb = setInterval( function(){_rin.enemy.progressATB(enemy, index)},
				parseInt( parseInt( 5000 - (enemy.enemy.stats.agi * 25) ) / 100*_rin.vars.battleSpeed) );
		},
		progressATB: function(enemy, index) {
			if(enemy==undefined || _rin.vars.end) return;
			if(Math.ceil(enemy.atbCurrent+1) >= 90) {
				enemy.b.action = "attack";
				enemy.b.target = Math.floor( Math.random()*_rin.vars.party.length );
				_rin.vars.turns.push(enemy);
				clearInterval(enemy.atb);
				_rin.battle.processTurns();
			} else enemy.atbCurrent++;
		},
	},
	character: {
		create: function( name,type ) {
			var character = new _rin.ui.element("character", {n: name, afterload: type != undefined ? type["afterload"] == undefined ? "" : type["afterload"]:""});
			if(type==undefined || type["type"] =="character") _rin.vars.characters[name] = character;
			else if(type["type"]=="npc") _rin.vars.npcs[name] = character;
			return character;
		},
		giveGil: function(amount) { _rin.vars.gil = parseInt(_rin.vars.gil + amount); },
		giveEXP: function(char, amount) {
			var exp = char.character.stats.exp;
			char.character.stats.exp = parseInt(parseInt(exp.substring(0,exp.indexOf("/")))+amount)+"/"+exp.substring(exp.indexOf("/")+1);
			var times = 0;
			while(parseInt(char.character.stats.exp.substring(0,char.character.stats.exp.indexOf("/"))) >=
					parseInt(char.character.stats.exp.substring(char.character.stats.exp.indexOf("/")+1))) {
				_rin.vars.q.queue.splice(1+times,0,function(){
					_rin.battle.toast(char.name+" has reached level "+parseInt(char.character.stats.level+1)+"."); _rin.character.levelUp(char); });
				char.character.stats.exp = parseInt(char.character.stats.exp.substring(0,char.character.stats.exp.indexOf("/"))) + "/" +
					parseInt(parseInt(char.character.stats.exp.substring(char.character.stats.exp.indexOf("/")+1)) + 100);
				times++;
			}
		},
		levelUp: function(char) {
			char.character.stats.level++;
		},
		clearATB: function(char) {
			char.atbCurrent = 0;
			clearInterval(char.atb);
			$(char.atbElement).css("width",char.atbCurrent+"%");
		},
		startATB: function(char, index) {
			char.atbCurrent = parseInt(Math.ceil(char.character.stats.agi / 1.5) * 0.7);
			$(char.atbElement).css("width",char.atbCurrent+"%");
			char.atb = setInterval( function(){_rin.character.progressATB(char, index)},
				parseInt( parseInt( 5000 - (char.character.stats.agi * 25) ) / 100*_rin.vars.battleSpeed) );
		},
		progressATB: function(char, index) {
			$(char.atbElement).css("width",Math.ceil(char.atbCurrent+(1*char.speed))+"%");
			if(Math.ceil(char.atbCurrent+1) >= 90) {
				$(char.atbElement).css("background-color","yellow");
				_rin.vars.waiting.push(char);
				clearInterval(char.atb);
				_rin.character.processWaiting();
			} else char.atbCurrent++;
		},
		processWaiting: function() {
			if(_rin.vars.waiting.length > 0 && _rin.vars.takingTurn === false && !_rin.vars.waiting[0].dead) {
				_rin.vars.takingTurn = _rin.vars.waiting[0].index;
				_rin.vars.waiting.splice(0,1);
				var command = new _rin.ui.element("battle_menu", _rin.vars.takingTurn);
			} else if(_rin.vars.waiting.length > 1 && _rin.vars.waiting[0].dead) {
				_rin.vars.waiting.splice(0,1);
				_rin.character.processWaiting();
			}
		},
		setOriginals: function(char) {
			char.element.onload = "";
			var scale = char.type=="character" ? char.character.scale[_rin.vars.state] : char.enemy[_rin.vars.state].scale;
			char.originalWidth = char.element.width;
			char.originalHeight = char.element.height;
			char.style({"width":parseInt(char.originalWidth*scale)+"px","height":parseInt(char.originalHeight*scale)+"px"});;
			if(char.afterload) char.afterload.call(char);
		},
		addToParty: function(char) { char.index = _rin.vars.party.length; _rin.vars.party.push(char); return char; },
		main: function(char) { _rin.vars.p.main = char; char.attribute("id", "main"); return char; },
		sprite: function(char, data) {
			if(char.attribute("src") != _rin.path("characters")+"/"+char.name+"/"+data+".gif")
				char.attribute("src", _rin.path("characters")+"/"+char.name+"/"+data+".gif");
			return char;
		},
		place: function(char, x,y) {
			if(char.element.parentNode == null) char.appendTo("body");
			var tile = $($($("#world").children("nobr")[y]).children()[x]);
			tile = $($("#world svg").children()[(_rin.getCurrentMap().map.map[y].length * y) + (x+1) -1]);
			if(char.name==_rin.vars.p.main.name) {
				_rin.getCurrentMap().style({"left":parseInt($("html").width()/2-(_rin.getCurrentMap().map.tileSize.width/2)-(_rin.getCurrentMap().map.tileSize.width*(x)))+"px",
					"top":parseInt($("html").height()/2-(_rin.getCurrentMap().map.tileSize.height/2)-(_rin.getCurrentMap().map.tileSize.height*(y)))+"px"});
				var newPosX = (_rin.getCurrentMap().map.tileSize.width - parseInt(char.style("width"))) / 2;
				var newPosY = (_rin.getCurrentMap().map.tileSize.height - parseInt(char.style("height"))) / 2;
				//char.style({"left":tile.offset().left+newPosX+"px","top":tile.offset().top+newPosY+"px"});
				char.style({left:$(_rin.getCurrentMap().element).offset().left+(x*_rin.getCurrentMap().map.tileSize.width)+newPosX+"px"});
				char.style({top:$(_rin.getCurrentMap().element).offset().top+(y*_rin.getCurrentMap().map.tileSize.height)+newPosY+"px"});
				char.nextBattle = _rin.getCurrentMap().map.battleStep();
				char.sprite("right_1");
			}
			else {
				tile.append(char.element).css("position", "relative");
				char.style({"top":(tile.height() - parseInt(char.style("height"))) / 2+"px",
					"left":(tile.width() - parseInt(char.style("width"))) / 2+"px"});
			}
			char.currentX = x; char.currentY = y;
			return char;
		},
		randomMove: function(char) {
			if(_rin.vars.state == "battle") return;
			var test = Math.random().toString().substring(2,3);
			if(test == 0 || test == 5) _rin.character.move(char, "up");
			else if(test == 2 || test == 7) _rin.character.move(char, "down");
			else if(test == 8 || test == 3) _rin.character.move(char, "left");
			else if(test == 4 || test == 9) _rin.character.move(char, "right");
			char.ai = setTimeout( function(){ _rin.character.randomMove(char) }, 2000*(Math.random()+2));
		},
		moveUp: function(char) {
			_rin.vars.c.moved++;
			_rin.vars.currentMap.style({top:parseInt(parseInt(_rin.vars.currentMap.style("top"))+1)+"px"});
			if(_rin.vars.c.moved == _rin.vars.currentMap.map.tileSize.height) {
				char.isMoving = false;
				_rin.getCurrentMap().map.checkTriggers(char.currentX, char.currentY);
			} else{ _rin.character.moveUp(char); }
		},
		moveDown: function(char) {
			_rin.vars.c.moved++;
			_rin.vars.currentMap.style({top:parseInt(parseInt(_rin.vars.currentMap.style("top"))-1)+"px"});
			if(_rin.vars.c.moved == _rin.vars.currentMap.map.tileSize.height) {
				char.isMoving = false;
				_rin.getCurrentMap().map.checkTriggers(char.currentX, char.currentY);
			} else{ _rin.character.moveDown(char); }
		},
		moveLeft: function(char) {
			_rin.vars.c.moved++;
			_rin.vars.currentMap.style({left:parseInt(parseInt(_rin.vars.currentMap.style("left"))+1)+"px"});
			if(_rin.vars.c.moved == _rin.vars.currentMap.map.tileSize.width) {
				char.isMoving = false;
				_rin.getCurrentMap().map.checkTriggers(char.currentX, char.currentY);
			} else{ _rin.character.moveLeft(char); }
		},
		moveRight: function(char) {
			_rin.vars.c.moved++;
			_rin.vars.currentMap.style({left:parseInt(parseInt(_rin.vars.currentMap.style("left"))-1)+"px"});
			if(_rin.vars.c.moved == _rin.vars.currentMap.map.tileSize.width) {
				char.isMoving = false;
				_rin.getCurrentMap().map.checkTriggers(char.currentX, char.currentY);
			} else{ _rin.character.moveRight(char); }
		},
		move: function( char, dir ) {			
			switch( dir ) {
				case "random": _rin.character.randomMove(char); break;
				case "up":
					if(_rin.controls.down("UP_ARROW") && char == _rin.vars.p.main) {
						char.sprite("up");
						if( !_rin.getCurrentMap().map.walkCheck(char.currentX, char.currentY-1) ) break;
						if(char.isMoving){ break;}
						char.isMoving = true; char.currentY--; _rin.vars.c.moved = 0;
						//_rin.character.moveUp(char);
						$(_rin.getCurrentMap().element).animate({top:parseInt(_rin.getCurrentMap().style("top")) + _rin.getCurrentMap().map.tileSize.height},
							_rin.getCurrentMap().map.tileSize.height*char.walkSpeed, function(){
							char.isMoving = false;
							_rin.getCurrentMap().map.checkTriggers(char.currentX, char.currentY);
							if(_rin.controls.down("UP_ARROW")) {
								_rin.character.move(char, "up");
							} else if(_rin.controls.none()) char.sprite("up_1");
						});
					} else if(char != _rin.vars.p.main) {
						char.sprite("up");
						if(_rin.getCurrentMap().map.walkCheck(char.currentX, char.currentY-1)) {
							$(char.element).animate({top:parseInt(char.style("top")) - _rin.getCurrentMap().map.tileSize.height},
								{queue:false,duration:_rin.getCurrentMap().map.tileSize.height*char.walkSpeed, complete:function(){
									char.currentY--;
									char.sprite("up_1");
								}});
						} else char.sprite("up_1");
					}
					break;
				case "down":
					if(_rin.controls.down("DOWN_ARROW")&& char == _rin.vars.p.main) {
						char.sprite("down");
						if( !_rin.getCurrentMap().map.walkCheck(char.currentX, char.currentY+1) ) break;
						if(char.isMoving){ break;}
						char.isMoving = true; char.currentY++; _rin.vars.c.moved = 0;
						//_rin.character.moveDown(char);
						$(_rin.getCurrentMap().element).animate({top:parseInt(_rin.getCurrentMap().style("top")) - _rin.getCurrentMap().map.tileSize.height},
							_rin.getCurrentMap().map.tileSize.height*char.walkSpeed, function(){
							char.isMoving = false;
							_rin.getCurrentMap().map.checkTriggers(char.currentX, char.currentY);
							if(_rin.controls.down("DOWN_ARROW")) {
								_rin.character.move(char, "down");
							} else if(_rin.controls.none()) char.sprite("down_1");
						});
					} else if(char != _rin.vars.p.main) {
						char.sprite("down");
						if(_rin.getCurrentMap().map.walkCheck(char.currentX, char.currentY+1)) {
							$(char.element).animate({top:parseInt(char.style("top")) + _rin.getCurrentMap().map.tileSize.height},
								{queue:false, duration:_rin.getCurrentMap().map.tileSize.height*char.walkSpeed, complete:function(){
									char.currentY++;
									char.sprite("down_1");
								}});
						} else char.sprite("down_1");
					}
					break;
				case "left":
					if(_rin.controls.down("LEFT_ARROW")&& char == _rin.vars.p.main) {
						char.sprite("left");
						if( !_rin.getCurrentMap().map.walkCheck(char.currentX-1, char.currentY) ) break;
						if(char.isMoving){ break;}
						char.isMoving = true; char.currentX--; _rin.vars.c.moved = 0;
						//_rin.character.moveLeft(char);
						$(_rin.getCurrentMap().element).animate({left:parseInt(_rin.getCurrentMap().style("left")) + _rin.getCurrentMap().map.tileSize.width},
							_rin.getCurrentMap().map.tileSize.width*char.walkSpeed, function(){
							char.isMoving = false;
							_rin.getCurrentMap().map.checkTriggers(char.currentX, char.currentY);
							if(_rin.controls.down("LEFT_ARROW")) {
								_rin.character.move(char, "left");
							} else if(_rin.controls.none()) char.sprite("left_1");
						});
					} else if(char != _rin.vars.p.main) {
						char.sprite("left");
						if( _rin.getCurrentMap().map.walkCheck(char.currentX-1, char.currentY)) {
							$(char.element).animate({left:parseInt(char.style("left")) - _rin.getCurrentMap().map.tileSize.width},
								{queue:false, duration:_rin.getCurrentMap().map.tileSize.width*char.walkSpeed, complete:function(){
									char.currentX--;
									char.sprite("left_1");
								}});
						} else char.sprite("left_1");
					}
					break;
				case "right":
					if(_rin.controls.down("RIGHT_ARROW")&& char == _rin.vars.p.main) {
						char.sprite("right");
						if( !_rin.getCurrentMap().map.walkCheck(char.currentX+1, char.currentY) ) break;
						if(char.isMoving){ break;}
						char.isMoving = true; char.currentX++; _rin.vars.c.moved = 0;
						//_rin.character.moveRight(char);
						$(_rin.getCurrentMap().element).animate({left:parseInt(_rin.getCurrentMap().style("left")) - _rin.getCurrentMap().map.tileSize.width},
							_rin.getCurrentMap().map.tileSize.width*char.walkSpeed, function(){
							char.isMoving = false;
							_rin.getCurrentMap().map.checkTriggers(char.currentX, char.currentY);
							if(_rin.controls.down("RIGHT_ARROW")) {
								_rin.character.move(char, "right");
							} else if(_rin.controls.none()) char.sprite("right_1");
						});
					} else if(char != _rin.vars.p.main) {
						char.sprite("right");
						if( _rin.getCurrentMap().map.walkCheck(char.currentX+1, char.currentY)) {
							$(char.element).animate({left:parseInt(char.style("left")) + _rin.getCurrentMap().map.tileSize.width},
								{queue:false, duration:_rin.getCurrentMap().map.tileSize.width*char.walkSpeed, complete:function(){
									char.currentX++;
									char.sprite("right_1");
								}});
						} else char.sprite("right_1");
					}
					break;
			}
		},
		stopNPC: function() {
			for(var npc in _rin.vars.npcs) {
				if(_rin.vars.npcs[npc].ai !== undefined){ clearTimeout(_rin.vars.npcs[npc].ai); }
			}
		}
	},
	controls: {
		UP_ARROW: 38, DOWN_ARROW: 40, LEFT_ARROW: 37, RIGHT_ARROW: 39, START: 13, SELECT: 32,
		CANCEL: 90, CONFIRM: 88, MENU: 65, SKIP: 83,
		enabled: false,
		down: function(key) { return _rin.vars.keysDown[_rin.controls[key]] === true; },
		up: function(key) { return _rin.vars.keysDown[_rin.controls[key]] === false; },
		only: function(key) {
			switch(key) {
				case "UP_ARROW": return _rin.controls.up("DOWN_ARROW")&&_rin.controls.up("LEFT_ARROW")&&_rin.controls.up("RIGHT_ARROW")&&_rin.controls.down("UP_ARROW"); break;
				case "DOWN_ARROW": return _rin.controls.down("DOWN_ARROW")&&_rin.controls.up("LEFT_ARROW")&&_rin.controls.up("RIGHT_ARROW")&&_rin.controls.up("UP_ARROW"); break;
				case "LEFT_ARROW": return _rin.controls.up("DOWN_ARROW")&&_rin.controls.down("LEFT_ARROW")&&_rin.controls.up("RIGHT_ARROW")&&_rin.controls.up("UP_ARROW"); break;
				case "RIGHT_ARROW": return _rin.controls.up("DOWN_ARROW")&&_rin.controls.up("LEFT_ARROW")&&_rin.controls.down("RIGHT_ARROW")&&_rin.controls.up("UP_ARROW"); break;
			}
		},
		none: function() {
			return _rin.controls.up("DOWN_ARROW")&&_rin.controls.up("LEFT_ARROW")&&_rin.controls.up("RIGHT_ARROW")&&_rin.controls.up("UP_ARROW");
		},
		enable: function(type) {
			_rin.controls.enabled = true;
			switch(type) {
				case "world":
					document.addEventListener( "keydown", _rin.controls.downListener );
					document.addEventListener( "keyup", _rin.controls.upListener );
					break;
				case "battle":
					document.addEventListener( "keydown", _rin.battle.downListener );
					document.addEventListener( "keyup", _rin.battle.upListener );
					break;
			}
			_rin.vars.keysDown[_rin.controls.UP_ARROW] = false;
			_rin.vars.keysDown[_rin.controls.DOWN_ARROW] = false;
			_rin.vars.keysDown[_rin.controls.LEFT_ARROW] = false;
			_rin.vars.keysDown[_rin.controls.RIGHT_ARROW] = false;
		},
		disable: function(type) {
			_rin.controls.enabled = false;
			switch(type) {
				case "world":
					document.removeEventListener( "keydown", _rin.controls.downListener );
					document.removeEventListener( "keyup", _rin.controls.upListener );
					break;
				case "battle":
					document.removeEventListener( "keydown", _rin.battle.downListener );
					document.removeEventListener( "keyup", _rin.battle.upListener );
					break;
			}
			_rin.vars.keysDown[_rin.controls.UP_ARROW] = false;
			_rin.vars.keysDown[_rin.controls.DOWN_ARROW] = false;
			_rin.vars.keysDown[_rin.controls.LEFT_ARROW] = false;
			_rin.vars.keysDown[_rin.controls.RIGHT_ARROW] = false;
		},
		downListener: function(ev) {
			switch( ev.keyCode ) {
				case _rin.controls.UP_ARROW:
					_rin.vars.keysDown[_rin.controls.UP_ARROW] = true;
					if( _rin.controls.only("UP_ARROW") ) {
						_rin.character.move(_rin.vars.p.main, "up");
					}
					break;
				case _rin.controls.DOWN_ARROW:
					_rin.vars.keysDown[_rin.controls.DOWN_ARROW] = true;
					if( _rin.controls.only("DOWN_ARROW") ) {
						_rin.character.move(_rin.vars.p.main, "down");
					}
					break;
				case _rin.controls.LEFT_ARROW:
					_rin.vars.keysDown[_rin.controls.LEFT_ARROW] = true;
					if( _rin.controls.only("LEFT_ARROW") ) {
						_rin.character.move(_rin.vars.p.main, "left");
					}
					break;
				case _rin.controls.RIGHT_ARROW:
					_rin.vars.keysDown[_rin.controls.RIGHT_ARROW] = true;
					if( _rin.controls.only("RIGHT_ARROW") ) {
						_rin.character.move(_rin.vars.p.main, "right");
					}
					break;
				case _rin.controls.MENU:
					if(!_rin.vars.p.main.isMoving) {
						console.log("goto menu");
					}
					break;
			}
		},
		upListener: function(ev) {
			switch( ev.keyCode ) {
				case _rin.controls.UP_ARROW:
					_rin.vars.keysDown[_rin.controls.UP_ARROW] = false;
					if(!$(_rin.getCurrentMap().element).is(":animated"))
						_rin.vars.p.main.attribute("src", "img/"+_rin.vars.p.main.name+"/up_1.gif");
					break;
				case _rin.controls.DOWN_ARROW:
					_rin.vars.keysDown[_rin.controls.DOWN_ARROW] = false;
					if(!$(_rin.getCurrentMap().element).is(":animated"))
						_rin.vars.p.main.attribute("src", "img/"+_rin.vars.p.main.name+"/down_1.gif");
					break;
				case _rin.controls.LEFT_ARROW:
					_rin.vars.keysDown[_rin.controls.LEFT_ARROW] = false;
					if(!$(_rin.getCurrentMap().element).is(":animated"))
						_rin.vars.p.main.attribute("src", "img/"+_rin.vars.p.main.name+"/left_1.gif");
					break;
				case _rin.controls.RIGHT_ARROW:
					_rin.vars.keysDown[_rin.controls.RIGHT_ARROW] = false;
					if(!$(_rin.getCurrentMap().element).is(":animated"))
						_rin.vars.p.main.attribute("src", "img/"+_rin.vars.p.main.name+"/right_1.gif");
					break;
			}
		}
	},
	functions: {
		append: function(el, d) {
			if( typeof d === "string" ) el.element.innerHTML += d;
			else el.element.appendChild( d );
			return el;
		},
		appendTo: function( el, tar ) {
			if(tar.substring(0,1)=="#") document.getElementById(tar.substring(1)).appendChild(el.element);
			else document.getElementsByTagName(tar)[0].appendChild(el.element);
			return el;
		},
		write: function(el){
			if( el.currentIndex == el.currentString.length ) return el;
			el.textTarget.innerHTML += el.currentString[el.currentIndex];
			el.currentIndex++;
			setTimeout( function(){el.write()}, el.speed );
		},
		speak: function( el, string ) {
			el.currentString = string; el.currentIndex = 0;
			el.write();
			return el;
		},
		fillMap: function( el ) {
			var x = 0; var y = 0; var h = 0;
			for(var i in el.map.map) { h++; }
			//el.style({width:parseInt(el.map.map[0].length*el.map.tileSize.width)+"px",height:parseInt(h*parseInt(el.map.tileSize.height))+"px"});
			//var mapString = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">';
			for( var i in el.map.map ) {
				x = 0;
				for( var j in el.map.map[i] ) {
					if(el.map.map[i][j] != "empty") {
						var img = new Image();
						img.onload = (function(eel, ex, ey) { return function() { eel.ctx.drawImage(this,ex,ey,48,48); } }(el,x,y));
						img.src = 'inc/maps/default/tile/'+el.map.map[i][j]+'.png'
					}
					//if(el.map.map[i][j]!="empty") mapString += '<image image-rendering="optimizeSpeed" x="'+x+'" y="'+y+'" width="'+el.map.tileSize.width+'px" height="'+el.map.tileSize.height+'px" xlink:href="inc/maps/default/tile/'+el.map.map[i][j]+'.png"></image>';
					//else mapString += '<image x="'+x+'" y="'+y+'" width="'+el.map.tileSize.width+'px" height="'+el.map.tileSize.height+'px"></image>';
					x = parseInt(x + parseInt(el.map.tileSize.width));
				}
				y = parseInt(y + el.map.tileSize.height);
				/*var nobr = document.createElement("nobr");
				for( var j in el.map.map[i] ) {
					var tile = new _rin.ui.element("tile", el.map.map[i][j]);
					tile.style({width:el.map.tileSize.width+"px",height:el.map.tileSize.height+"px"});
					if(el.map.map[i][j]!="empty")tile.style({"background-size":"100%","background-image":"url(inc/maps/default/tile/"+el.map.map[i][j]+".png)"});
					if(el.map.map[i][j]!="empty")tile.append('<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><image width="100%" height="100%" xlink:href="inc/maps/default/tile/'+el.map.map[i][j]+'.png"></image></svg>');
					nobr.appendChild(tile.element);
				}
				nobr.appendChild(document.createElement("br"));
				el.append(nobr);*/
			}
			//mapString += '</svg>';
			//el.style({width:x+"px",height:parseInt(y-parseInt(el.map.tileSize.height))+"px"});
			el.element.width = x;
			el.element.height = parseInt(y-parseInt(el.map.tileSize.height));
			console.log(el.element.toDataURL());
			el.ctx.webkitImageSmoothingEnabled = false;
			el.ctx.mozImageSmoothingEnabled = false;
			//el.append(mapString);
		},
		battleParty: function() {
			var current = 150; var currentTop = 3; var currentY = 150;
			for( var char in _rin.vars.party ) {
				_rin.vars.party[char].battle = new _rin.ui.element("window", "battle_character");
				$(_rin.vars.party[char].battle.element).children(".name").text(_rin.vars.party[char].name.toUpperCase());
				$(_rin.vars.party[char].battle.element).children(".currenthp").text(_rin.vars.party[char].currentHP);
				$(_rin.vars.party[char].battle.element).children(".maxhp").text("/"+_rin.vars.party[char].maxHP);
				//$("#battle_window").children().last().text(_rin.vars.party[char].name).css("top",currentTop+"px");
				_rin.vars.party[char].appendTo("#battle").sprite("left").style({
					"width":parseInt(_rin.vars.party[char].originalWidth*_rin.vars.party[char].character.scale.battle)+"px",
					"height":parseInt(_rin.vars.party[char].originalHeight*_rin.vars.party[char].character.scale.battle)+"px",
					right:"-3%","left":""}).style("top",currentY+"px");
				currentY += parseInt(_rin.vars.party[char].style("height"));
				$(_rin.vars.party[char].element).animate({right:5+((parseInt(char)))+"%"},
					{queue:false,duration:current*2,complete:(function(i){
						return function() { _rin.vars.party[i].sprite("battle").attribute("class","char"); }
				}(char))});
				current += 25; currentTop += 58;
			}
		},
		battleEnemies: function(tile) {
			var enemies = _rin.getCurrentMap().map.tiles.enemies(tile);
			_rin.vars.e.amount = Math.floor( Math.random()*5 )+1;
			//var types = Math.min(enemies.length, Math.floor( Math.random()*3 )+1);
			//var used = []; which = 0; current = amount;
			_rin.vars.e.modifier = 0; _rin.vars.e.side = 100; _rin.vars.e.previousHeight = 0; _rin.vars.e.previousWidth = 0;
			//var window = new _rin.ui.element("window", "battle_enemies");
			$("#battle").append('<div id="enemies"></div>');
			for( var i = 0; i < _rin.vars.e.amount; i++ ) {
				var enemy = new _rin.ui.element("enemy",{name: enemies[0], afterload: function(){
					this.style({
						"height":parseInt(this.originalHeight*this.enemy.battle.scale)+"px",
						"width":parseInt(this.originalWidth*this.enemy.battle.scale)+"px"});
					this.appendTo("#enemies").style({left:_rin.vars.e.side+"px", top:150+_rin.vars.e.modifier+"px"});
					$(this.element).animate({opacity:1}, {queue:false, duration:1000, complete:function() {
						var test=true;$(".enemy").each(function(){if($(this).css("opacity")!=1)test=false;});if(test) _rin.functions.battleBegin(); 
					}});
					_rin.vars.e.side = _rin.vars.b.enemies.length % 2 == 0 ? _rin.vars.e.side + Math.max(parseInt(this.style("width")),
						_rin.vars.e.previousWidth) : 100;
					_rin.vars.e.modifier =_rin.vars.b.enemies.length%2==0?_rin.vars.e.modifier:Math.max(parseInt(this.style("height")),
						_rin.vars.e.previousHeight)+_rin.vars.e.modifier;
					_rin.vars.e.previousHeight = parseInt(this.style("height"));
					_rin.vars.e.previousWidth = parseInt(this.style("width"));
					this.index = _rin.vars.b.enemies.length;
					_rin.vars.b.enemies.push(this);
				}});
			}
		},
		addBattleWindow: function() {
			var window = new _rin.ui.element("window", "battle");
		},
		battleBegin: function() {
			console.log("begin");
			for( var char in _rin.vars.party ) {
				var atb = document.createElement("div");
				atb.setAttribute("style","margin: 3px; height:4px; width: 20%; background-color: #eeeeee; border-radius:5px;");
				atb.setAttribute("class","counter");
				_rin.vars.party[char].atbElement = atb;
				$(".atb")[char].appendChild(atb);
				_rin.character.startATB(_rin.vars.party[char], char);
			}
			for( var enemy in _rin.vars.b.enemies ) {
				_rin.enemy.startATB(_rin.vars.b.enemies[enemy]);
			}
		}
	},
	settings: {
	},
	attribute: function(el, t, d) {
		if( typeof t === "string" && typeof d === "undefined" ) return el.element.getAttribute(t) == undefined ? "" : el.element.getAttribute(t);
		else if( typeof t === "string" && typeof d === "string" ) d != "" ? el.element.setAttribute(t, d) : el.element.removeAttribute(t);
		else for( var item in t ) { t[item] != "" ? el.element.setAttribute(item, t[item]) : el.element.removeAttribute(t); }
		return el;
	},
	sleep: function( ms ){ var start = new Date().getTime(); while (new Date().getTime() < start + ms ); },
	style: function(el, t, d) {
		var style = el.element.getAttribute("style") || "";
		if(typeof t === "undefined" && typeof d === "undefined") return style;
		else if(typeof t === "string" && typeof d === "undefined") return style.indexOf(t)!=-1 ?
			new RegExp(t+":(.*?);", "ig").exec(style)[1].replace(/^\s\s*/, '').replace(/\s\s*$/, '') : "";
		else if(typeof d === "undefined") for(var item in t) {
			style = style.replace(new RegExp(item+":.*?;", "ig"), ""); t[item] != "" ? style += item+": "+t[item]+";" : style=style; }
		else if(typeof d === "string" && d == "" ) style = style.replace(new RegExp(t+":.*?;", "ig"), "");
		else { style = style.replace(new RegExp(t+":.*?;", "ig"), ""); d!="" ? style += t+": "+d+";" : style=style; }
		el.element.setAttribute("style", style);
		return el;
	},
	loadPack: function(name, position) {
		position = position || 0;
		switch(position) {
			case 0: var current = "inc/packs/"+name+"/maps.js"; $("#wait").text("loading maps..."); break;
			case 1: var current = "inc/packs/"+name+"/items.js"; $("#wait").text("loading items..."); break;
			case 2: var current = "inc/packs/"+name+"/characters.js"; $("#wait").text("loading characters..."); break;
			case 3: var current = "inc/packs/"+name+"/enemies.js"; $("#wait").text("loading enemies..."); break;
		}
		var head = document.getElementsByTagName('head')[0];
		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = current;
		if(position == 3) { script.onreadystatechange = loaded; script.onload = loaded; _rin.vars.pack = name; }
		else {
			script.onreadystatechange = function(){ _rin.loadPack(name,position+1); };
			script.onload = function(){ _rin.loadPack(name,position+1); };
		}
		head.appendChild(script);
	},
	vars: {
		e: { side: 0, previousWidth: 0, previousHeight: 0, modifier: 0 },
		b: { end: false, acting: false, action: "", recentDamage: 0, enemies: [], toast: "" },
		q: { queue: [], interval: false, done: false, timer: null },
		u: { mouseDown: false, pageX: 0, pageY: 0 },
		p: { main: "" },
		w: { rotationX: 1, rotationY: 0, current: "" },
		c: { moved: 0, movement: "" },
		pack: "",
		battleSpeed: 1.8,
		state: "",
		characters: {},
		gil: 0,
		npcs: {},
		party: [],
		turns: [],
		takingTurn: false,
		choosing: false,
		currentMenuIndex: 0,
		currentTargetIndex: 0,
		currentAction: "",
		waiting: [],
		currentMap: "",
		step: 48,
		keysDown: { },
	},
}

function loaded() {
	//console.log("done");
	$("#wait").remove();
	var celes = _rin.character.create("celes", {afterload: function(){ this.style({position:"absolute"}).addToParty().main(); _rin.goto("world", {name:"world", x:8, y:6});} });
	var terraEsper = _rin.character.create("terra esper", { afterload: function(){ this.style({position:"absolute"}).addToParty() } });
	var shadow = _rin.character.create("shadow", {afterload: function(){ this.style({position:"absolute"}).addToParty() } });
	$(".tile").mouseenter( function(){
		console.log( $(this).index(), $(this).parent().index() );
	});
	//var shadow = _rin.character.create("shadow").addToParty();
	//_rin.goto("battle");
}


function increaseRotation() {
	if(_rin.vars.w.rotationY >= 800) { clearInterval(_rin.vars.q.timer); _rin.vars.w.rotationX = 1; _rin.vars.w.rotationY = 0; }
	else {
		$("#html").css({"-webkit-transform":"scale("+_rin.vars.w.rotationX+") rotateZ("+_rin.vars.w.rotationY+"deg)"});
		_rin.vars.w.rotationX+=0.02;
		_rin.vars.w.rotationY+=5;
	}
}

$(document).ready(function() {
	$("body").append('<div id="wait"></div>');
	_rin.loadPack("default");
	$(document).disableSelection();
});
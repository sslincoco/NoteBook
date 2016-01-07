(function(window,document){

	$(document).ready(function(){
		var _this =$(this);
		var NotebooksCtrl={};
		NotebooksCtrl.category_number = 0;
		NotebooksCtrl.currNote = {};

		var $notebooks=$("#notebooks");
		var $input_new_category = $(".input_new_category");

		$(".addNotebook").on('click',function(){
			console.log('click add new_category');
			$(".input_new_category").show().focus();
		});

		$input_new_category.blur(input_new_categoryBlur);
		$input_new_category.keyup(function(event){
			if (event.keyCode==13) {
				$input_new_category.blur();
			}

		});

		//为notebooks绑定事件
		$(".category_note").on('click',function(){
			NotebooksCtrl.clickCategory_note(this);
		});

		//input_new_category失去焦点时触发事件
		function input_new_categoryBlur(event){
			var $target = $(event.target);
			if (! $target.val()) {
				$target.hide();
			}
			else{
				NotebooksCtrl.addNotebook($target.val());
				$target.val("");
				$target.hide();
			}
		};

		NotebooksCtrl.init = function(){
			NotebooksCtrl.category_number = $("#notebooks .category_note").length;
			$("#notebooks .category_note").each(function(index){
				$(this).attr("data-id",index);
			});
			$("#notebooks .category_note").eq(0).addClass("selectedNote");
			var data_id = $(".selectedNote").attr("data-id");
			$(".note").hide();
			$(".note-list").find('.note[data-id='+data_id+']').show();
			$selected = $(".note-list").find('.note[data-id='+data_id+']').eq(0).addClass("selected");
			NotebooksCtrl.currNote ={
				title: $selected.find("h3").html(),
				content: $selected.find("p").html()
			};
			NotebooksCtrl.showDetail(NotebooksCtrl.currNote);
		};

		//在当前目录下新建笔记
		//这两个缓冲运动可以合并
		var timer=null;
		var speed=0;
		function slowMove(iTarget){
			var state = true;
			if ($(".edit_note").is(":hidden")) {
				$(".edit_note").show();
				state=false;
			}
			clearInterval(timer);
			timer = setInterval(function(){
					var dist = iTarget - $(".edit_note").position().left;
					speed = dist>0 ? Math.ceil(dist/10):Math.floor(dist/10);
					$(".edit_note").css('left',$(".edit_note").position().left+ speed +'px');
					if (dist==0) {
						clearInterval(timer);
						if (state) {
							$(".edit_note").hide();
						}
					}

				},30);
		};

		//点击新建笔记按钮
		$(".addNew").on('click',function(){
			$(".edit_note").show();
			clearInterval(timer);
			timer = setInterval(function(){
					var dist = 0 - $(".edit_note").position().left;
					speed = dist>0 ? Math.ceil(dist/10):Math.floor(dist/10);
					$(".edit_note").css('left',$(".edit_note").position().left+ speed +'px');
				},30);
		});

		//点击取消按钮
		$(".cancel").on('click',function(){
			clearInterval(timer);
			$(".newNote_title").val("");
			$(".newNote_content").html("");
			timer = setInterval(function(){
					var dist = 436- $(".edit_note").position().left;
					speed = dist>0 ? Math.ceil(dist/10):Math.floor(dist/10);
					$(".edit_note").css('left',$(".edit_note").position().left+ speed +'px');
					if (dist==0) {
						clearInterval(timer);
						$(".edit_note").hide();
					}
				},30);
		});

		//点击保存按钮
		$(".save").on('click',function(){
			if ($(".newNote_title").val() || $(".newNote_content").text()) {
				NotebooksCtrl.currNote = {
					title: $(".newNote_title").val() ? $(".newNote_title").val():"无标题",
					content: $(".newNote_content").html()
				};
				var data_id = $(".selectedNote").attr("data-id");
				$(".note-list>li").removeClass("selected");
				var $oli = $('<li class="note selected"><h3>'+ NotebooksCtrl.currNote.title+'</h3><p>'+NotebooksCtrl.currNote.content+'</p></li>');
				$oli.attr("data-id",data_id);
				$(".note-list").prepend($oli);
				$oli.on('click',function(){
					NotebooksCtrl.clickNote($(this));
				});
				NotebooksCtrl.showDetail(NotebooksCtrl.currNote);
			}
			$(".newNote_title").val("");
			$(".newNote_content").html("");
			$(".edit_note").hide();
		});

		//点击笔记时绑定事件
		$(".note").on('click',function(){
			NotebooksCtrl.clickNote($(this));
		});

		//显示选定笔记的具体内容
        NotebooksCtrl.showDetail = function(notedata){
        	$(".note_title>h3").html(notedata.title);
			$(".note_content").html(notedata.content);
        };

        //点击某个笔记时触发事件
		NotebooksCtrl.clickNote = function($note){
			$(".note").removeClass("selected");
			$note.addClass("selected");
			NotebooksCtrl.currNote ={
				title: $note.find("h3").eq(0).html(),
				content: $note.find("p").eq(0).html()
			};
			NotebooksCtrl.showDetail(NotebooksCtrl.currNote);
		};

        //添加新的笔记本
		NotebooksCtrl.addNotebook= function(title){
			var $oli = $('<li class="category_note">'+title+'</li>')
			$notebooks.prepend($oli);
			$notebooks.find(".category_note").each(function(){
				$(this).removeClass("selectedNote");
			});
			$oli.attr("data-id",NotebooksCtrl.category_number).addClass("selectedNote").on('click',function(){
				NotebooksCtrl.clickCategory_note(this);
			});
			NotebooksCtrl.category_number++;
			$(".note").hide();
			NotebooksCtrl.currNote={
				title:"",
				content:""
			};
			NotebooksCtrl.showDetail(NotebooksCtrl.currNote);

			$oli.on('mouseover',function(){
				if ($(this).hasClass("selectedNote")) {
				}
				else{
					$(this).addClass("hoverNote");
				}
			});

			$oli.on('mouseout',function(){
				if ($(this).hasClass("selectedNote")) {
				}
				else{
					$(this).removeClass("hoverNote");
				}	
			});
		};

		//点击删除笔记本事件
		$(".deleteNotebook").on('click', deleteNotebook);

		//删除笔记本事件
		function deleteNotebook(){
			var data_id = $(".selectedNote").attr("data-id");
			console.log(data_id);
			$('.category_note[data-id='+data_id+']').remove();
			$(".category_note").eq(0).addClass("selectedNote");

			//渲染(该部分可重用，简化程序)
			var data_id = $(".selectedNote").attr("data-id");
			$(".note").removeClass("selected").hide();
			$(".note-list").find('.note[data-id='+data_id+']').show();
			if ($(".note-list").find('.note[data-id='+data_id+']').length>0) {
				$selected = $(".note-list").find('.note[data-id='+data_id+']').eq(0);
				$selected.addClass("selected");
				NotebooksCtrl.currNote ={
					title: $selected.find("h3").html(),
					content: $selected.find("p").html()
				};
			}else{
					NotebooksCtrl.currNote ={
						title: "",
						content: ""
					};
			}
			NotebooksCtrl.showDetail(NotebooksCtrl.currNote);
		};


		//点击某个笔记本触发事件
		NotebooksCtrl.clickCategory_note = function(element){
			$notebooks.find(".category_note").each(function(index,element){
				$(this).removeClass("selectedNote");
				$(this).removeClass("hoverNote");
			}); 
			$(element).addClass("selectedNote");

			//渲染
			var data_id = $(".selectedNote").attr("data-id");
			$(".note").removeClass("selected").hide();
			$(".note-list").find('.note[data-id='+data_id+']').show();
			if ($(".note-list").find('.note[data-id='+data_id+']').length>0) {
				$selected = $(".note-list").find('.note[data-id='+data_id+']').eq(0);
				$selected.addClass("selected");
				NotebooksCtrl.currNote ={
					title: $selected.find("h3").html(),
					content: $selected.find("p").html()
				};
			}else{
					NotebooksCtrl.currNote ={
						title: "",
						content: ""
					};
			}
			NotebooksCtrl.showDetail(NotebooksCtrl.currNote);

		};

		//////////初始化
		NotebooksCtrl.init();


	});

})(this,this.document);
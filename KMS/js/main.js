(function(window,document){

	AV.initialize("ChFcpLqSQGnOeO7WGjJx9iXq-gzGzoHsz", "feCyQEOFiQjEXlhnmnl6VR1J");

	$(document).ready(function(){
		var _this =$(this);
		var NotebooksCtrl={};
		NotebooksCtrl.category_number = 0;
		NotebooksCtrl.currNote = {};
		NotebooksCtrl.delNote = null;

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

		//删除-取消事件
		$(".off").on('click',function(){
			$(".gray-overlay").hide();
			$(".deleteConfirm").hide();
		});

		//确定删除事件
		$(".confirm").on('click',function(){
			$(".gray-overlay").hide();
			$(".deleteConfirm").hide();
			NotebooksCtrl.clickdeleteNote(NotebooksCtrl.delNote);
		});

		// 初始化
		NotebooksCtrl.init = function(){
			$(".gray-overlay").hide();
			notebookModel.loadAll(notebookloadAllcallback);
		};
		function notebookloadAllcallback(error,cloudNotebooks){
			if (error) {
               	console.log("error.message");
			}else{
				if (cloudNotebooks.length ==0 || cloudNotebooks.length===undefined) {
					console.log("no notebooks");
					cloudNotebooks=[];
				}else{
					console.log("开始渲染......");
					notebookView.render(cloudNotebooks);
					console.log("渲染结束......");
				}
			}
		};
			
		//在当前目录下新建笔记时，编辑笔记区域的缓冲运动
		var timer=null;
		function slowMove(iTarget){
			if (iTarget >0) {
				$(".newNote_title").val("");
				$(".newNote_content").html("");
			}
			else{
				$(".edit_note").show();
			}
			var speed=0;
			clearInterval(timer);
			timer = setInterval(function(){
					var dist = iTarget - $(".edit_note").position().left;
					speed = dist>0 ? Math.ceil(dist/10):Math.floor(dist/10);
					$(".edit_note").css('left',$(".edit_note").position().left+ speed +'px');
					if (iTarget >0 && dist==0) {
						clearInterval(timer);
						$(".edit_note").hide();
					}
				},30);
		};

		//点击新建笔记按钮
		$(".addNew").on('click',function(){
			slowMove(0);
		});

		//点击取消按钮
		$(".cancel").on('click',function(){
			slowMove(436);
		});

		//点击保存按钮
		$(".save").on('click',function(){
			if ($(".newNote_title").val() || $(".newNote_content").text()) {

				var categoryId = $(".selectedNote").attr("data-id");

				var note={};
				note.categoryId = categoryId;
				note.title = $(".newNote_title").val() ? $(".newNote_title").val():"无标题";
				note.content = $(".newNote_content").text();

				///将markdown语句转换为html格式
				note.title = markdown.toHTML(NotebooksCtrl.htmlProcess(note.title));
      			note.content = markdown.toHTML(NotebooksCtrl.htmlProcess(note.content));
				note.alive =true;

				/////////////////////////
				console.log(note);
				noteModel.add(categoryId,note);

				NotebooksCtrl.currNote = {
					title: note.title,
					content: note.content
				};

				var $selectedCategory = $('.category_note[data-id='+categoryId+']');
				var numberOfNote = parseInt($selectedCategory.attr("numberOfNote"))+1;
				var title = $selectedCategory.attr("notebook-title");
				$selectedCategory.attr("numberOfNote",numberOfNote);
				$selectedCategory.html(title+'('+numberOfNote+')'); 

				/////////////////////////					
		     
				$(".note-list>li").removeClass("selected");
				var $oli = $('<li class="note selected"><h3 class="title"></h3><p class="content"></p><i class="deleteNote btn_pointer" style="display:none;"></i></li>');
				$oli.find(".title").html(note.title);
				$oli.find(".content").html(note.content);
				$oli.attr("categoryId",categoryId);
				$(".note-list").prepend($oli);
				notebookView.renderDetail(NotebooksCtrl.currNote);
				notebookModel.update(categoryId,1);

				//绑定事件
				$oli.on('click',function(){
					NotebooksCtrl.clickNote($(this));
				});
				$oli.on('mouseover',function(){
					$(this).find(".deleteNote").show();
				});

				$oli.on('mouseout',function(){
					$(this).find(".deleteNote").hide();
				});

				$oli.find(".deleteNote").on('click',function(){
					NotebooksCtrl.delNote = $(this).parent();
					$(".gray-overlay").show();
					$(".deleteConfirm .delInfo").html("确定删除吗？");
					$(".deleteConfirm").show();
				});

			}
			$(".newNote_title").val("");
			$(".newNote_content").html("");
			$(".edit_note").hide();
		});

        //点击某个笔记时触发事件
		NotebooksCtrl.clickNote = function($note){
			$(".note").removeClass("selected");
			$note.addClass("selected");

			NotebooksCtrl.currNote ={
				title: $note.find(".title").html(),
				content: $note.find(".content").html()
			};

			notebookView.renderDetail(NotebooksCtrl.currNote);
		};

		//处理输入信息的html语句
		NotebooksCtrl.htmlProcess = function(html){
			// var html = html.replace(/&lt;/g,"<").replace(/&gt;/g,">");
	        var html = html.replace(/<html>/g,'').replace(/<\/html>/g,'').replace(/<\/body>/g,'').replace(/<body>/g,'').replace(/<\/div>/g,'').replace(/<div>/g,'\n').replace(/<br>/g, '');
	        	html = html.replace(/<p>/g,'').replace(/<\/p>/g,'');
	        return html;
	    }
        //添加新的笔记本
		NotebooksCtrl.addNotebook= function(title){
			var $oli = $('<li class="category_note">'+title+'(0)'+'</li>');
			$oli.attr({"notebook-title":title,"numberOfNote":"0"});
			$notebooks.prepend($oli);
			$notebooks.find(".category_note").each(function(){
				$(this).removeClass("selectedNote");
			});
			NotebooksCtrl.category_number++;
			$oli.addClass("selectedNote").on('click',function(){
				NotebooksCtrl.clickCategory_note($(this));
			});
			$(".note-list").html("");
			NotebooksCtrl.currNote={
				title:"",
				content:""
			};
			notebookView.renderDetail(NotebooksCtrl.currNote);

			//在leancloud上保存笔记本数据
			var newNotebook ={
				title:title,
				numberOfNote:0,
				alive:true
			};
			notebookModel.add(newNotebook);

		};

		//点击删除笔记事件
		$(".deleteNote").on('click',function(){
				NotebooksCtrl.delNote = $(this).parent();
				$(".gray-overlay").show();
				console.log("删除笔记："+NotebooksCtrl.delNote.find("h3").html());
				$(".deleteConfirm .delInfo").html("确定删除"+NotebooksCtrl.delNote.find(".title").html()+"吗？");
				$(".deleteConfirm").show();
		});

		//点击删除笔记本事件
		$(".deleteNotebook").on('click', function(){
			NotebooksCtrl.delNote=null;
			$(".gray-overlay").show();
			console.log("删除笔记本："+$(".selectedNote").attr("notebook-title"));
			$(".deleteConfirm .delInfo").html("确定删除"+$(".selectedNote").attr("notebook-title")+"吗？");
			$(".deleteConfirm").show();
		});

		//删除笔记本事件
		function deleteNotebook(){
			var id = $(".selectedNote").attr("data-id");
			$('.category_note[data-id='+id+']').remove();
			notebookModel.remove(id);

			if ($(".category_note").length ==0) {
				$(".note-list").html("");
				NotebooksCtrl.currNote ={
					title: "",
					content: ""
				};
			}else{
				$(".category_note").eq(0).addClass("selectedNote");
				$(".selectedNote").click();
			}
			notebookView.renderDetail(NotebooksCtrl.currNote);
		};

		//点击某个笔记本触发事件
		NotebooksCtrl.clickCategory_note = function($element){
			$notebooks.find(".category_note").each(function(index,element){
				$(this).removeClass("selectedNote");
			}); 
			$element.addClass("selectedNote");
			var data_id = $(".selectedNote").attr("data-id");
			var numberOfNote = parseInt($(".selectedNote").attr("numberOfNote"));
			if (numberOfNote >0) {
				noteModel.load(data_id,loadNotesCallback);
			}else{
				$(".note-list").html("");
				NotebooksCtrl.currNote ={
						title: "",
						content: ""
					};
				notebookView.renderDetail(NotebooksCtrl.currNote);
			}
		};
		function loadNotesCallback(error,notes){
			if (error) {
				console.log(error);
			}else{
				if (notes.length ==0 || notes.length===undefined) {
					notes=[];
				}
				notebookView.renderItem(notes);
			}
		};

		//删除某个笔记
		NotebooksCtrl.clickdeleteNote = function($deleteNote){
			if ($deleteNote) { 

					var categoryId =$deleteNote.attr("categoryId");
					var id = $deleteNote.attr("data-id");
					var $delCategory = $('.category_note[data-id='+categoryId+']');
					var numberOfNote = parseInt($delCategory.attr("numberOfNote"))-1;
					var title = $delCategory.attr("notebook-title");
					$delCategory.attr("numberOfNote",numberOfNote);
					$delCategory.html(title+'('+numberOfNote+')');
					$deleteNote.remove();
					var $note = $('.note[categoryId='+categoryId+']');
					if ($note.length ==0) {
							NotebooksCtrl.currNote ={
								title: "",
								content: ""
							};
					}
					else{
							if ($note.hasClass("selected")){}
							else{
									$note.first().addClass("selected");
									NotebooksCtrl.currNote ={
										title: $note.first().find(".title").html(),
										content: $note.first().find(".content").html()
									};
							}
					}
					notebookView.renderDetail(NotebooksCtrl.currNote);
					//在leancloud上删除数据
					var classname = "C"+categoryId;
					noteModel.remove(classname,id);
					notebookModel.update(categoryId,-1);
			}
			else{
				deleteNotebook();
			}
		};

		//////////初始化
		window.NotebooksCtrl = NotebooksCtrl;
		NotebooksCtrl.init();


	});

})(this,this.document);
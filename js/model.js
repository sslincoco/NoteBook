(function (window, document) {

    /* 从learncloud加载数据，支持对learn cloud上的内容进行增加删除*/
    var Notebook = AV.Object.extend("Notebook");
    window.Notebook = Notebook;
    var notebookModel = {};
    var noteModel = {};
    window.notebookModel = notebookModel;
    window.noteModel = noteModel;
    var notebooks=[];
    var notes=[];

    notebookModel.loadAll = function (callback) {
        var query = new AV.Query(Notebook);
        console.log("开始从leancloud上load数据......");

        // 按照降序排列
        query.equalTo('alive', true);
        query.addDescending('createdAt');
        
        query.find({
            success: function(notebookCollection){
                NotebooksCtrl.category_number = notebookCollection.length;
                for(var i = 0; i < notebookCollection.length; i++) {
                    var notebook={};
                    notebook.title = notebookCollection[i].get('title');
                    notebook.numberOfNote = notebookCollection[i].get('numberOfNote');
                    notebook.id = notebookCollection[i].id;
                    notebooks.push(notebook);
                }
                console.log("笔记数目为"+notebooks.length);
                callback(false,notebooks);
            },
            error: function(error){
                console.log("从leancloud获取数据失败......");
                callback(error,notebooks);
            }
        });
    };

    //在leancloud上增加笔记本信息
    notebookModel.add =function(newNotebook, callback){
            var notebookObj = new Notebook();
            notebookObj.save(newNotebook,{
                success:function(notebookObj){
                    console.log("新建笔记本id为: "+ notebookObj.id);
                    callback(null, notebookObj.id);
                },
                error:function(error){
                    console.log(error);
                    callback(err, newNotebook);
                }
            });

    };

    //在leancloud上删除笔记本信息
    notebookModel.remove = function(id){
        var query = new AV.Query(Notebook);
        query.get(id,{
            success:function(delNotebook){
                console.log("删除笔记本id为: "+delNotebook.id);
                delNotebook.set('alive',false);
                delNotebook.save();
            },
            error:function(error){
                console.log("删除笔记本failed......");
            }
        });

    };
    //添加、删除笔记时所属的笔记本的numberOfNote属性也要修改
    notebookModel.update = function(id,num){
        var query = new AV.Query(Notebook);
        query.get(id,{
            success:function(modNotebook){
                var number = modNotebook.get('numberOfNote');
                number = number +num;
                modNotebook.set('numberOfNote',number);
                modNotebook.save();
            },
            error:function(error){
                console.log("更新笔记本numberOfNote属性failed......");
            }
        });

    };

    //load选中笔记本上的笔记
    noteModel.load = function(classname,callback){
        classname = 'C'+ classname; 
        var query = new AV.Query(classname);

         // 按照降序排列
        query.equalTo('alive', true);
        query.addDescending('createdAt');
        query.find({
            success: function(noteCollection){
                  notes=[];
                for(var i = 0; i < noteCollection.length; i++) {
                    var note={};
                    note.title = noteCollection[i].get('title');
                    note.content = noteCollection[i].get('content');
                    note.categoryId = noteCollection[i].get('categoryId');
                    note.id = noteCollection[i].id;
                    notes.push(note);
                }
                callback(false,notes);
            },
            error: function(error){
                console.log("从leancloud获取数据失败......");
                callback(error,notes);
            }
        });
    
    };
    noteModel.add = function(classname,addnote, callback){
        var notebook_id = classname;
        classname = "C"+classname;
        var Note = AV.Object.extend(classname);
        var noteObj = new Note();
        noteObj.save(addnote,{
            success:function(noteObj){
                console.log("新建笔记保存成功.......");
                callback(null, noteObj.id);
                // $(".note").eq(0).attr("data-id",noteObj.id);
            },
            error:function(error){
                callback(err, addnote);
            }
        });
        ///////////////
        var query = new AV.Query(Notebook);
        query.get(notebook_id,{
            success:function(notebook){
                var number = notebook.get('numberOfNote');
                number++;
                notebook.set('numberOfNote',number);
                notebook.save();
            },
            error:function(error){
                console.log("在leancloud上添加笔记failed......");
            }
        });
    };

    noteModel.remove = function(cclassname,id){
        var query = new AV.Query(cclassname);
        query.get(id,{
            success:function(delNote){
                console.log("删除笔记id为: "+delNote.id);
                delNote.set('alive',false);
                delNote.save();
            },
            error:function(error){
                console.log("删除笔记failed......");
            }
        });

    };
    ///////////
    //为notebooks绑定事件
    $(".category_note").on('click',function(){
         NotebooksCtrl.clickCategory_note($(this));
     });
    //点击笔记时绑定事件
    $(".note").on('click',function(){
        NotebooksCtrl.clickNote($(this));
    });
        

})(this, this.document)
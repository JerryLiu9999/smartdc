var core = {
  "start": function () {
    core.load();
  },
  "install": function () {
    core.load();
  },
  "load": function () {
    app.interface.id = '';
    /*  */
    let context = config.interface.context;
    let url = app.interface.path + '?' + context;
    /*  */
    app.button.popup(context === "popup" ? url : '');
    /*  */
    app.contextmenu.create({
      "id": "tab", 
      "type": "radio", 
      "title": "Open in tab",  
      "contexts": ["action"],
      "checked": context === "tab"
    }, app.error);
    /*  */
    app.contextmenu.create({
      "id": "win", 
      "type": "radio", 
      "title": "Open in win",  
      "contexts": ["action"],
      "checked": context === "win"
    }, app.error);
    /*  */
    app.contextmenu.create({
      "id": "popup", 
      "type": "radio", 
      "contexts": ["action"],
      "title": "Open in popup",  
      "checked": context === "popup"
    }, app.error);
  },
  "action": {
    "storage": function (changes, namespace) {
      /*  */
    },
    "contextmenu": function (e) {
      app.interface.close(config.interface.context);
      config.interface.context = e.menuItemId;
      /*  */
      let context = config.interface.context;
      let url = app.interface.path + '?' + context;
      app.button.popup(context === "popup" ? url : '');
    },
    "button": function () {
      let context = config.interface.context;
      let url = app.interface.path + '?' + context;
      /*  */
      if (context === "popup") app.button.popup(url);
      else {
        if (app.interface.id) {
          if (context === "tab") {
            app.tab.get(app.interface.id, function (tab) {
              if (tab) {
                app.tab.update(app.interface.id, {"active": true});
              } else {
                app.interface.id = '';
                app.tab.open(url);
              }
            });
          }
          /*  */
          if (context === "win") {
            app.window.get(app.interface.id, function (win) {
              if (win) {
                app.window.update(app.interface.id, {"focused": true});
              } else {
                app.interface.id = '';
                app.interface.create();
              }
            });
          }
        } else {
          if (context === "tab") app.tab.open(url);
          if (context === "win") app.interface.create(url);
        }
      }
    }
  }
};

app.window.on.removed(function (e) {
  if (e === app.interface.id) {
    app.interface.id = '';
  }
});

app.on.storage(core.action.storage);
app.button.on.clicked(core.action.button);
app.contextmenu.on.clicked(core.action.contextmenu);

app.on.startup(core.start);
app.on.installed(core.install);
var Todos;

$(document).ready(function(){
  // Define a model
  var Todo = Backbone.Model.extend({
    // Attributes: title, createdAt, complete
    defaults: function() {
      return {
        title: "No title entered",
        createdAt: new Date(),
        complete: false
      };
    },
    // Define a method
    toggle: function() {
      this.save({complete: !this.get("complete")});
    }
  });

  // Define a collection
  var TodoList = Backbone.Collection.extend({
    model: Todo,
    localStorage: new Backbone.LocalStorage('todos'),
    // Returns an array of Objects that match (completed === true); filter returns an Array
    completed: function() {
      return this.filter(function(todo) {
        return todo.get('complete');
      });
    },
    incomplete: function() {
      return this.filter(function(todo) {
        return !todo.get('complete');
      });
    }
  });
  Todos = new TodoList;

  // Define a view for a single todo item
  var TodoView = Backbone.View.extend({
    tagName: 'li',
    // http://underscorejs.org/#template
    template: _.template($('#list-item-template').html()),
    events: {
      'click .checkbox': function() {
        this.model.toggle();
        if(this.model.get('complete')) {
          $('#todo-list').append(this.render().el);
        } else {
          $('#incomplete-todo-list').append(this.render().el);
        }
      }
    },
    render: function() {
      // $el is current element (li)
      this.$el.html(this.template(this.model.toJSON()));
      // Render function should return the view
      return this;
    }
  });
  // Define view to list all todos
  var AppView = Backbone.View.extend({
    el: $('#todoapp'),
    events: {
      "click #button": function() {
        Todos.create({title: this.input.val()});
        this.input.val('');
      }
    },
    initialize: function() {
      this.input = this.$('#new-todo');
      this.counter = this.$('#counter');
      this.listenTo(Todos, 'add', function(todo) {
        var view = new TodoView({model: todo});
        // this.$('#incomplete-todo-list').append(view.render().el);
        if (todo.get('complete')) {
          this.$('#todo-list').append(view.render().el);
        } else {
          this.$('#incomplete-todo-list').append(view.render().el);
        }
      });
      this.listenTo(Todos, 'all', this.render);
      Todos.fetch();
    },
    // Define template to count # complete/incomplete
    counterTemplate: _.template($('#counter-template').html()),
    render: function() {
      var completed = Todos.completed().length;
      var incomplete = Todos.incomplete().length;
      this.counter.html(this.counterTemplate({
        completed: completed,
        incomplete: incomplete
      }));
    }
  });

  var App = new AppView;

});
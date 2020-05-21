/**
 * Step By Step Math Content Type
 */

var H5P = H5P || {};
var ParsonsWidget = require(ParsonsWidget);
/**
 *
 * Step By Step Math Exercises module
 * @param  {H5P.jQuery} $ jQuery used by H5P Core
 * @return {function}   StepByStepMath constructor
 */
H5P.Parsons = (function($, _) {

    function displayErrors(fb) {
        if (fb.errors.length > 0) {
            alert(fb.errors[0]);
        }
    }
    /**
     * StepByStepMath constructor
     * @param       {object} options Object with current data and configurations
     * @param       {integer} id      Unique identifier
     * @constructor
     */
    function Parsons(options, id, data) {
        // Inheritance
        // Question.call(self, 'parsons');
        this.data = data;
        this.options = options;
        this.parsonList = [];
        this.id = id;
        this.content = this.options.content;
        this.$inner = $('<div/>', {
            class: "h5p-inner"
        });

        this.parsonswidget = H5P.ParsonsWidget;

    }

    // // Inheritance
    // Parsons.prototype = Object.create(Question.prototype);
    // Parsons.prototype.constructor = Parsons;
    // var STATE_FINISHED = 'finished';
    // /**
    //  * Toggle buttons dependent of state.
    //  *
    //  * Using CSS-rules to conditionally show/hide using the data-attribute [data-state]
    //  */
    // Parsons.prototype.toggleButtonVisibility = function(state) {
    //     // The show solutions button is hidden if all answers are correct
    //     var allCorrect = (this.getScore() === this.getMaxScore());
    //     if (this.params.behaviour.autoCheck && allCorrect) {
    //         // We are viewing the solutions
    //         state = STATE_FINISHED;
    //     }

    //     if (this.params.behaviour.enableSolutionsButton) {
    //         if (state === STATE_CHECKING && !allCorrect) {
    //             this.showButton('show-solution');
    //         } else {
    //             this.hideButton('show-solution');
    //         }
    //     }

    //     if (this.params.behaviour.enableRetry) {
    //         if ((state === STATE_CHECKING && !allCorrect) || state === STATE_SHOWING_SOLUTION) {
    //             this.showButton('try-again');
    //         } else {
    //             this.hideButton('try-again');
    //         }
    //     }

    //     if (state === STATE_ONGOING) {
    //         this.showButton('check-answer');
    //     } else {
    //         this.hideButton('check-answer');
    //     }

    //     this.trigger('resize');
    // };
    /**
     * Creates and fills container with content
     * @param  {object} $container Container node
     * @return {void}
     */
    Parsons.prototype.attach = function($container) {
        var self = this;


        self.$container = $container;
        $container.addClass('h5p-parsons');
        self.$inner.appendTo($container);
        //add title assignment
        $('<div/>', { "text": this.data.metadata.title, "id": "title" }).appendTo(self.$inner);
        $('<p/>', { html: this.options.assignmentDescription, "id": "taskDescription" }).appendTo(self.$inner);

        for (var j = 0; j < this.content.length; j++) {
            var problem = this.content[j];
            var parson = new H5P.ParsonsWidget({
                'sortableId': 'sortable',
                'trashId': 'sortableTrash',
                'max_wrong_lines': problem.code.max_wrong_lines,
                'feedback_cb': displayErrors
            });
            // this.$parsonswidget = parson.$parsonswidget;
            self.parsonList.push(parson);

            $("<div/>", { "class": "task", "id": "task-" + j }).appendTo(self.$inner);


            var problem_title = problem.problem_title;
            var problem_description = problem.problem_description;
            var num = j + 1;
            $("<h2/>", { "class": "problemTitle", "text": "Question " + num + ": " + problem_title }).appendTo($("#task-" + j));
            $("<p/>", { "class": "problemDescription", "text": problem_description }).appendTo($("#task-" + j));
            $("<p/>", { "class": "language", "id": "language-" + j, "text": problem.code.code_language }).appendTo($("#task-" + j));
            $("#language-" + j).prepend($("<i class= 'fas fa-globe-asia'> language:  </i> "));
            var code_line = problem.code.code_block;
            console.log(code_line);
            parson.init(code_line);
            parson.shuffleLines();
            // $('<div/>', { "id": j + "-" + parson.options.trashId }).appendTo(parson.$parsonswidget);
            // console.log("trashId is: " + parson.options.trashId);
            // $('<div/>', { "id": j + "-" + parson.options.sortableId }).appendTo(parson.$parsonswidget);
            //this.parson = parson;
            parson.$parsonswidget.appendTo($("#task-" + j));

            console.log("append to task :" + j);

            $('<p/>', { 'id': "buttons" }).appendTo($("#task-" + j));
            $('<a/>', { "class": "instance", 'id': "newInstanceLink-" + j, 'text': "New instance" }).appendTo($("#task-" + j).find("#buttons"))
            $('<a/>', { "class": "feedback", 'id': "feedbackLink-" + j, 'text': "Get Feedback" }).appendTo($("#task-" + j).find("#buttons"));


            /*debug for added question length******/
            //console.log(self.parsonList.length);
            parson.$parsonswidget.find("#" + parson.options.trashId).addClass('sortable-code');
            // console.log(parson.code.code_block);
            parson.$parsonswidget.find("#" + parson.options.sortableId).addClass('sortable-code');

            //add test partern
            var btn = document.createElement("div");

            btn.innerHTML = "0";
            btn.id = "btn";
            parson.$parsonswidget.append(btn);

            btn.onclick = function() {
                btn.innerHTML++;
            }

        }


        $(".instance").on('click', function(event) {
            var currentId = $(this).attr('id');
            var currentIndex = currentId.substr(currentId.length - 1);
            event.preventDefault();
            self.parsonList[currentIndex].shuffleLines();
        });
        $(".feedback").on('click', function(event) {
            var currentId = $(this).attr('id');
            var currentIndex = currentId.substr(currentId.length - 1);
            console.log("feedback : " + currentIndex + "is ongoing");
            event.preventDefault();
            var fb = self.parsonList[currentIndex].getFeedback();
            // console.log("here is the feedback")
            console.log(fb.feedback.html);
            if (fb.success) { alert("Good, you solved the assignment!"); }
        });

        //this.$inner.append(parson.$parsonswidget);
        //this.$parsonswidget = parson.$parsonswidget;


        //self.$inner = $container.find(".h5p-parsons");
        //$container.append(this.parson.$parsonswidget);

        // this.$variablecheckgrader = graders.VariableCheckGrader.$VariableCheckGrader;
        //this.$variablecheckgrader.appendTo($graders);
        // console.log(this.$parsonswidget.children());
        // this.$parsonswidget.find("#ul-sortableTrash").find('li').draggable();
        // var that = this.$parsonswidget.find("#ul-sortable");
        // this.$parsonswidget.find("#ul" + this.TrashId).droppable({
        //     drag: function(event, ui) {
        //         $(that).addClass("ui-droppable");
        //     }

        // });

    };
    H5P.Parsons = ParsonsWidget;
    return Parsons;
})(H5P.jQuery, _);
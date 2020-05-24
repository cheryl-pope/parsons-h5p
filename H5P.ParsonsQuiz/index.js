var H5P = H5P || {};

H5P.ParsonsQuiz = (function ($, ParsonsJS)
{
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
    function ParsonsQuiz(options, id, data) {
        // Inheritance
        // Question.call(self, 'parsons');
        this.data = data;
        this.options = options;  // defined in semantics.json
        //this.parsonList = [];
        this.id = id;
        this.quiz = this.options.quiz;
        this.$inner = $('<div/>', {
            class: "h5p-inner"
        });
    }

    /**
     * Creates and fills container with content
     * @param  {object} $container Container node
     * @return {void}
     */

    ParsonsQuiz.prototype.attach = function($container)
    {
        var self = this;

        // set container
        self.$container = $container;
        $container.addClass('h5p-parsons');
        self.$inner.appendTo($container);

        // add quiz title and description
        $('<div/>', { "text": this.data.metadata.title, "id": "title" }).appendTo(self.$inner);
        $('<p/>', { html: this.options.assignmentDescription, "id": "taskDescription" }).appendTo(self.$inner);

        // add each question to quiz
        for (let i = 0; i < this.quiz.length; i++) {
            var problem = this.quiz[i];
            var parsonsjs = new ParsonsJS(i);
            // add each question's container
            self.$inner.append(parsonsjs.$question);

            // create a new parson question
            var problem_title = problem.problem_title;
            var problem_description = problem.problem_description;
            var problemIndex = i + 1;

            // add meta data of the question
            $("<h2/>", { "class": "problemTitle", "text": "Question " + problemIndex + ": " + problem_title }).appendTo(parsonsjs.$question);
            $("<p/>", { "class": "problemDescription", "text": problem_description }).appendTo(parsonsjs.$question);
            $("<p/>", { "class": "codeLanguage", "id": "language-" + i, "text": problem.code.code_language }).appendTo(parsonsjs.$question);
            $("#language-" + i).prepend($("<i class= 'fas fa-globe-asia'> language:  </i> "));
            $("<div/>", { "class": "sortable-code", "id": "sortableTrash" }).appendTo(parsonsjs.$question);
            $("<div/>", { "class": "sortable-code", "id": "sortable" }).appendTo(parsonsjs.$question);

            // question content
            var code_line = problem.code.code_block;
            var parson = new ParsonsJS.ParsonsWidget({
                'sortableId': 'sortable',
                'trashId': 'sortableTrash',
                'max_wrong_lines': problem.code.max_wrong_lines,
                'feedback_cb': displayErrors
            });

            parson.init(code_line);
            parson.shuffleLines();

            // newInstance and feedback buttons
            $("<div/>", { "style": "clear:both;"}).appendTo(parsonsjs.$question);
            parsonsjs.$question.append($("<p/>")
            .append($("<a/>",{"href":"#", "id": "newInstanceLink", "text": "New instance"}))
            .append($("<a/>",{"text":"  "}))
            .append($("<a/>",{"href":"#", "id": "feedbackLink", "text": "Get feedback"})))

            
        }

    }



    return ParsonsQuiz;

})(H5P.jQuery, H5P.ParsonsJS);
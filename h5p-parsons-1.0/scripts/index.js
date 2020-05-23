/**
 * Parsons puzzle Content Type
 */

var H5P = H5P || {};
// var ParsonsWidget = require(ParsonsWidget);
/**
 *
 * Step By Step Math Exercises module
 * @param  {H5P.jQuery} $ jQuery used by H5P Core
 * @return {function}   StepByStepMath constructor
 */
H5P.Parsons = (function($, _, EventDispatcher) {

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
        EventDispatcher.call(this);
        this.data = data;
        var defaults = {
            endGame: {
                showResultPage: true,
                noResultMessage: 'Finished',
                message: 'Your result:',
                oldFeedback: {
                    successGreeting: '',
                    successComment: '',
                    failGreeting: '',
                    failComment: ''
                },
                overallFeedback: [],
                finishButtonText: 'Finish',
                solutionButtonText: 'Show solution',
                retryButtonText: 'Retry',
                showAnimations: false,
                skipButtonText: 'Skip video',
                showSolutionButton: true,
                showRetryButton: true
            },
            override: {},
        };

        this.options = $.extend(true, {}, defaults, options);

        var solutionButtonTemplate = this.options.endGame.showSolutionButton ?
            '    <button type="button" class="h5p-joubelui-button h5p-button qs-solutionbutton"><%= solutionButtonText %></button>' :
            '';
        const retryButtonTemplate = this.options.endGame.showRetryButton ?
            '    <button type="button" class="h5p-joubelui-button h5p-button qs-retrybutton"><%= retryButtonText %></button>' :
            '';
        var resulttemplate =
            '<div class="questionset-results">' +
            '  <div class="greeting"><%= message %></div>' +
            '  <div class="feedback-section">' +
            '    <div class="feedback-scorebar"></div>' +
            '    <div class="feedback-text"></div>' +
            '  </div>' +
            '  <% if (comment) { %>' +
            '  <div class="result-header"><%= comment %></div>' +
            '  <% } %>' +
            '  <% if (resulttext) { %>' +
            '  <div class="result-text"><%= resulttext %></div>' +
            '  <% } %>' +
            '  <div class="buttons">' +
            solutionButtonTemplate +
            retryButtonTemplate +
            '  </div>' +
            '</div>';
        var questionInstances = [];
        var questionOrder;
        // Set overrides for questions
        var override;

        if (options.override.showSolutionButton || options.override.retryButton || options.override.checkButton === false) {
            override = {};
            if (options.override.showSolutionButton) {
                // Force "Show solution" button to be on or off for all interactions
                override.enableSolutionsButton =
                    (options.override.showSolutionButton === 'on' ? true : false);
            }

            if (options.override.retryButton) {
                // Force "Retry" button to be on or off for all interactions
                override.enableRetry =
                    (options.override.retryButton === 'on' ? true : false);
            }

            if (options.override.checkButton === false) {
                // Force "Check" button to be on or off for all interactions
                override.enableCheckButton = options.override.checkButton;
            }
        }
        Data = data || {};

        // Bring question set up to date when resuming
        if (Data.previousState) {
            if (Data.previousState.progress) {
                currentQuestion = Data.previousState.progress;
            }
            questionOrder = Data.previousState.order;
        }
        /**
         * Generates question instances from H5P objects
         *
         * @param  {object} questions H5P content types to be created as instances
         * @return {array} Array of questions instances
         */
        var createQuestionInstancesFromQuestions = function(questions) {
            var result = [];
            // Create question instances from questions
            // Instantiate question instances
            for (var i = 0; i < questions.length; i++) {

                var question;
                // If a previous order exists, use it
                if (questionOrder !== undefined) {
                    question = questions[questionOrder[i]];
                } else {
                    // Use a generic order when initialzing for the first time
                    question = questions[i];
                }

                if (override) {
                    // Extend subcontent with the overrided settings.
                    $.extend(question.options.behaviour, override);
                }

                question.params = question.params || {};
                var hasAnswers = Data.previousState && Data.previousState.answers;
                // var questionInstance = H5P.newRunnable(question, id, undefined, undefined, {
                //     previousState: hasAnswers ? Data.previousState.answers[i] : undefined,
                //     parent: self
                // });
                // questionInstance.on('resize', function() {
                //     up = true;
                //     self.trigger('resize');
                // });
                // result.push(questionInstance);
            }

            return result;
        };

        // Create question instances from questions given by params
        questionInstances = createQuestionInstancesFromQuestions(options.content);
        // // Get total score.
        // var finals = this.getScore();
        // var totals = self.getMaxScore();

        // var success = ((100 * finals / totals) >= optionss.passPercentage);
        var success = ((100 * 2 / 10) >= options.passPercentage);
        this.endTemplate = new EJS({ text: resulttemplate });
        this.eparams = {
            message: this.options.endGame.showResultPage ? this.options.endGame.message : this.options.endGame.noResultMessage,
            comment: this.options.endGame.showResultPage ? (success ? this.options.endGame.oldFeedback.successGreeting : this.options.endGame.oldFeedback.failGreeting) : undefined,
            resulttext: this.options.endGame.showResultPage ? (success ? this.options.endGame.oldFeedback.successComment : this.options.endGame.oldFeedback.failComment) : undefined,
            finishButtonText: this.options.endGame.finishButtonText,
            solutionButtonText: this.options.endGame.solutionButtonText,
            retryButtonText: this.options.endGame.retryButtonText
        };


        this.parsonList = [];
        this.id = id;
        this.content = this.options.content;
        this.$inner = $('<div/>', {
            class: "h5p-inner"
        });

        this.parsonswidget = H5P.ParsonsWidget;

        // // Get current score for questionset.
        // this.getScore = function() {
        //     var score = 0;
        //     for (var i = questionInstances.length - 1; i >= 0; i--) {
        //         score += questionInstances[i].getScore();
        //     }
        //     return score;
        // };

        // // Get total score possible for questionset.
        // this.getMaxScore = function() {
        //     var score = 0;
        //     for (var i = questionInstances.length - 1; i >= 0; i--) {
        //         score += questionInstances[i].getMaxScore();
        //     }
        //     return score;
        // };


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
                'feedback_cb': displayErrors,
                'unittests': unittests,
                'grader': this.parsonswidget._graders.LanguageTranslationGrader,
                toggleTypeHandlers: { abc: ["a", "b", "c"] }
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
            // console.log("i find it");

            // console.log(parson.code.code_block);
            parson.$parsonswidget.find("#" + parson.options.sortableId).addClass('sortable-code');

            //add test partern
            // var btn = document.createElement("div");

            // btn.innerHTML = "0";
            // btn.id = "btn";
            // parson.$parsonswidget.append(btn);

            // btn.onclick = function() {
            //     btn.innerHTML++;
            // }
            this.endTemplate.render(this.eparams).insertAfter(".h5p-inner");

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
})(H5P.jQuery, _, H5P.EventDispatcher);
H5P.Parsons.prototype.constructor = H5P.Parsons;
H5P.Parsons.prototype = Object.create(H5P.EventDispatcher.prototype);
67
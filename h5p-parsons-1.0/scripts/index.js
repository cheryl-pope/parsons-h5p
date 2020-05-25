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
        if (undefined != fb.errors && fb.errors.length > 0) {
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


        var defaults = {
            texts: {
                prevButton: 'Previous question',
                nextButton: 'Next question',
                finishButton: 'Finish',
                textualProgress: 'Question: @current of @total questions',
                jumpToQuestion: 'Question %d of %total',
                questionLabel: 'Question',
                readSpeakerProgress: 'Question @current of @total',
                unansweredText: 'Unanswered',
                answeredText: 'Answered',
                currentQuestionText: 'Current question'
            },
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
            disableBackwardsNavigation: false
        };
        this.options = $.extend(true, {}, defaults, options);
        this.parsonList = [];
        this.timestamp = [];
        this.id = id;
        this.content = this.options.content;
        this.$startQ = $('<button/>', { 'class': "startQuiz", 'text': "start Quiz ?" });
        this.$inner = $('<div/>', {
            class: "h5p-inner"
        });
        this.$endQ = $('<button/>', { 'class': "endQuiz", 'text': "submit Quiz " });


        /* this is the part for get random question to the student */
        this.questionInstances = [];
        this.questionOrder; //Stores order of questions to allow resuming of question set
        /**
         * Randomizes questions in an array and updates an array containing their order
         * @param  {array} problems
         * @return {Object.<array, array>} questionOrdering
         */
        this.randomizeQuestionOrdering = function(questions) {

            // Save the original order of the questions in a multidimensional array [[question0,0],[question1,1]...
            var questionOrdering = questions.map(function(questionInstance, index) {
                return [questionInstance, index];
            });

            // Shuffle the multidimensional array
            questionOrdering = H5P.shuffleArray(questionOrdering);

            // Retrieve question objects from the first index
            questions = [];
            for (var i = 0; i < questionOrdering.length; i++) {
                questions[i] = questionOrdering[i][0];
            }

            // Retrieve the new shuffled order from the second index
            var newOrder = [];
            for (var j = 0; j < questionOrdering.length; j++) {

                // Use a previous order if it exists
                if (data.previousState && data.previousState.questionOrder) {
                    newOrder[j] = questionOrder[questionOrdering[j][1]];
                } else {
                    newOrder[j] = questionOrdering[j][1];
                }
            }

            // Return the questions in their new order *with* their new indexes
            return {
                questions: questions,
                questionOrder: newOrder
            };
        };



        // this.parsonswidget = H5P.ParsonsWidget;

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
        ParsonsWidget = H5P.ParsonsWidget;

        self.$container = $container;
        $container.addClass('h5p-parsons');
        self.$inner.appendTo($container);
        self.$startQ.appendTo($container);
        /** add start timmer */
        self.$inner.hide();
        var startTotal;
        var finishTotal;
        $(".startQuiz").click(function() {
            self.$startQ.hide();
            self.$inner.show();
            startTotal = new Date();
            console.log(startTotal);
        });
        /**end timer */


        /** start shuffle question order */
        // Bring question set up to date when resuming
        if (this.data.previousState) {
            if (this.data.previousState.progress) {
                currentQuestion = this.data.previousState.progress;
            }
            questionOrder = this.data.previousState.order;
        }

        // Create a pool (a subset) of questions if necessary
        if (this.options.poolSize > 0) {

            // If a previous pool exists, recreate it
            if (this.data.previousState && this.data.previousState.poolOrder) {
                poolOrder = this.data.previousState.poolOrder;

                // Recreate the pool from the saved data
                var pool = [];
                for (var i = 0; i < poolOrder.length; i++) {
                    pool[i] = this.options.content[poolOrder[i]];
                }

                // Replace original questions with just the ones in the pool
                this.options.content = pool;
            } else { // Otherwise create a new pool
                // Randomize and get the results
                var poolResult = this.randomizeQuestionOrdering(this.options.content);
                var poolQuestions = poolResult.questions;
                poolOrder = poolResult.questionOrder;

                // Discard extra questions

                poolQuestions = poolQuestions.slice(0, this.options.poolSize);
                poolOrder = poolOrder.slice(0, this.options.poolSize);

                // Replace original questions with just the ones in the pool
                this.options.content = poolQuestions;
            }
        }

        /* end of the part of the randomizarion of question set */
        /**end shuffle order */
        //add title assignment
        $('<div/>', { "text": this.data.metadata.title, "id": "title" }).appendTo(self.$inner);
        $('<p/>', { html: this.options.assignmentDescription, "id": "taskDescription" }).appendTo(self.$inner);
        $('<p/>', { 'class': "timer" }).appendTo(self.$inner);
        for (var j = 0; j < this.options.content.length; j++) {
            var problem = this.options.content[j];
            var parson = new ParsonsWidget({
                'sortableId': 'sortable',
                'trashId': 'sortableTrash',
                'max_wrong_lines': problem.code.max_wrong_lines,
                'feedback_cb': displayErrors,
                // 'vartests': [{ initcode: "min = None\na = 0\nb = 2", code: "", message: "Testing with a = 0 ja b = 2", variables: { min: 0 } },
                //     {
                //         initcode: "min = None\na = 7\nb = 4\n",
                //         code: "",
                //         message: "Testing with a = 7 ja b = 4",
                //         variables: { min: 4 }
                //     }
                // ],
                // 'grader': ParsonsWidget._graders.LanguageTranslationGrader,
                // 'executable_code': "if $$toggle$$ $$toggle::<::>::!=$$ b:\n" +
                //     "min = a\n" +
                //     "else:\n" +
                //     "min = b\n  pass",
                // 'programmingLang': "pseudo"
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
            // $('<div/>', { "class": "unittest", 'id': "unittest" }).insertAfter($("#task-" + j).find("#buttons"));

            /*debug for added question length******/
            //console.log(self.parsonList.length);
            parson.$parsonswidget.find("#" + parson.options.trashId).addClass('sortable-code');
            // console.log(parson.code.code_block);
            parson.$parsonswidget.find("#" + parson.options.sortableId).addClass('sortable-code');



            //submit button to submit the quiz form
            self.$endQ.appendTo(self.$inner);
            $(".endQuiz").click(function() {
                finishTotal = new Date() - startTotal;
                console.log(finishTotal);
            });
            console.log("this is the questionInstances");
            console.log(this.questionInstances);
            //add test partern
            // var btn = document.createElement("div");

            // btn.innerHTML = "0";
            // btn.id = "btn";
            // parson.$parsonswidget.append(btn);

            // btn.onclick = function() {
            //     btn.innerHTML++;
            // }

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
            console.log(fb.feedback);
            // if (fb.success) { alert("Good, you solved the assignment!"); }
            // self.parsonList[currentIndex].$parsonswidget.find("#unittest").html("<h2>Feedback from testing your program:</h2>" + fb.feedback);
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
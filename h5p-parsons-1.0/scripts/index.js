/**
 * Step By Step Math Content Type
 */

var H5P = H5P || {};
var ParsonsWidget = require(ParsonsWidget);
/**
 *
 * Step By Step Math Exercises module
 * @param  {H5P.jQuery} $ jQuery used by H5P Core
 * @return {function}   parsons puzzle constructor
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
            passPercentage: 50,
            texts: {
                finishButton: 'Finish'
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
                solutionButtonText: 'Show solution'
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
        this.$inner = $('<div/>', { 'class': "h5p-inner" });
        this.$endQ = $('<button/>', { 'class': "endQuiz", 'text': "submit Quiz " });
        //score create
        this.score = 0;
        this.Maxscore = 0;

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

        this.endTemplate;

        /**add templates  */
        this.addTemplate = function() {
            // var solutionButtonTemplate = this.options.endGame.showSolutionButton ?
            //     '    <button type="button" class="h5p-joubelui-button h5p-button qs-solutionbutton"><%= solutionButtonText %></button>' :
            //     '';

            // const retryButtonTemplate = this.options.endGame.showRetryButton ?
            //     '    <button type="button" class="h5p-joubelui-button h5p-button qs-retrybutton"><%= retryButtonText %></button>' :
            //     '';
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
                // '  <div class="buttons">' +
                // solutionButtonTemplate +
                // retryButtonTemplate +
                // '  </div>' +
                '</div>';
            this.endTemplate = new EJS({ text: resulttemplate });
        }

        // // Get current score for questionset.
        // this.getScore = function() {
        //     return this.score;
        // };

        // // Get total score possible for questionset.
        // this.getMaxScore = function() {
        //     return this.Maxscore;
        // };
        // Get total score.
        // var finals = this.getScore();
        // var totals = this.getMaxScore();
        this.finals;
        this.totals;
        this.scoreString = "";
        // this.scoreString = H5P.Question.determineOverallFeedback(params.endGame.overallFeedback, finals / totals).replace('@score', finals).replace('@total', totals);
        this.success;
        this.scoreBar;
        this.addTemplate();




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
                    this.questionInstances.push(pool[i]);
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
            var parson = new H5P.ParsonsWidget({
                'sortableId': 'sortable',
                'trashId': 'sortableTrash',
                'max_wrong_lines': problem.code.max_wrong_lines,
                'feedback_cb': displayErrors,
                'vartests': [{ initcode: "min = None\na = 0\nb = 2", code: "", message: "Testing with a = 0 ja b = 2", variables: { min: 0 } },
                    {
                        initcode: "min = None\na = 7\nb = 4\n",
                        code: "",
                        message: "Testing with a = 7 ja b = 4",
                        variables: { min: 4 }
                    }
                ],
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
            this.Maxscore += 1;
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




            // console.log("this is the questionInstances");
            // console.log(this.questionInstances);
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
            if (self.parsonList[currentIndex].correct == true) {
                self.score += 1;
                // console.log(self.score);

            }

            // console.log("here is the feedback")
            console.log(fb.feedback);
            // if (fb.success) { alert("Good, you solved the assignment!"); }
            // self.parsonList[currentIndex].$parsonswidget.find("#unittest").html("<h2>Feedback from testing your program:</h2>" + fb.feedback);
        });

        //submit button to submit the quiz form
        self.$endQ.appendTo(self.$inner);
        $(".endQuiz").click(function() {
            finishTotal = new Date() - startTotal;
            console.log(finishTotal);
            /**attach result page */
            // Trigger finished event.
            self.finals = self.score;
            self.totals = self.Maxscore;
            self.success = ((100 * self.finals / self.totals) >= self.options.passPercentage);

            console.log(self.success);
            self.scoreString = H5P.Question.determineOverallFeedback(self.options.endGame.overallFeedback, self.finals / self.totals);

            self.displayResults();
            self.trigger('resize');
            /**end attach result page */
        });
        /**start display result setting */
        self.displayResults = function() {
            this.triggerXAPICompleted(this.finals, this.totals, this.success);

            var eparams = {
                message: this.options.endGame.showResultPage ? this.options.endGame.message : this.options.endGame.noResultMessage,
                comment: this.options.endGame.showResultPage ? (this.success ? this.options.endGame.oldFeedback.successGreeting : this.options.endGame.oldFeedback.failGreeting) : undefined,
                resulttext: this.options.endGame.showResultPage ? (this.success ? this.options.endGame.oldFeedback.successComment : this.options.endGame.oldFeedback.failComment) : undefined,
                finishButtonText: this.options.endGame.finishButtonText,
            };

            // Show result page.
            this.$container.children().hide();
            this.$container.append(this.endTemplate.render(eparams));

            if (this.options.endGame.showResultPage) {
                scoreBar = this.scoreBar;
                if (scoreBar === undefined) {
                    scoreBar = H5P.JoubelUI.createScoreBar(this.totals);
                }
                scoreBar.appendTo($('.feedback-scorebar', this.$container));
                $('.feedback-text', this.$container).html(this.scoreString);

                // Announce that the question set is complete
                setTimeout(function() {
                    console.log(self.totals);
                    console.log(self.finals);
                    $('.qs-progress-announcer', this.$container)
                        .html(eparams.message + '.' +
                            this.scoreString + '.' +
                            eparams.comment + '.' +
                            eparams.resulttext)
                        .show().focus();
                    scoreBar.setMaxScore(self.totals);
                    scoreBar.setScore(self.finals);
                }, 0);
            } else {
                console.log(self.totals);
                console.log(self.finals);
                // Remove buttons and feedback section
                $('.qs-solutionbutton, .qs-retrybutton, .feedback-section', this.$container).remove();
            }

            this.trigger('resize');
        };
        /**end display result setting */



    };
    H5P.Parsons = ParsonsWidget;
    return Parsons;
})(H5P.jQuery, _);
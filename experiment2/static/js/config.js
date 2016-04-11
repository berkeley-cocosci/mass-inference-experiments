/* config.js
 * 
 * This file contains the code necessary to load the configuration
 * for the experiment.
 */

// Enum-like object mapping experiment phase names to ids, in the
// order that the phases should be presented.
var EXPERIMENT = Object.freeze({
    pretest: 0,
    experimentA: 1,
    experimentB: 2,
    experimentC: 3,
    posttest: 4,
    length: 5
});

// Enum-like object mapping trial phase names to ids, in the order
// that the phases should be presented.
var TRIAL = Object.freeze({
    prestim: 0,
    stim: 1,
    fall_response: 2,
    prefeedback: 3,
    feedback: 4,
    mass_response: 5,
    length: 6
});

// The phases in which we will ask the "fall?" question
var FALL_PHASES = [
    EXPERIMENT.pretest,
    EXPERIMENT.experimentA,
    EXPERIMENT.experimentB,
    EXPERIMENT.posttest
];

// The phases in which we will ask the "mass?" question
var MASS_PHASES = [EXPERIMENT.experimentC];
// The trials on which we will ask the "mass?" question
var MASS_TRIALS = [0, 1, 2, 3, 5, 8, 13, 19];

// Enum-like object for representing key names.
var KEYS = new Object();
KEYS[TRIAL.prestim] = {
    67: ""  // c
};
KEYS[TRIAL.stim] = {};
KEYS[TRIAL.fall_response] = {
    49: 1,  // 1
    50: 2,  // 2
    51: 3,  // 3
    52: 4,  // 4
    53: 5,  // 5
    54: 6,  // 6
    55: 7,  // 7
};
KEYS[TRIAL.prefeedback] = {
    67: ""  // c
};
KEYS[TRIAL.feedback] = {};
KEYS[TRIAL.mass_response] = {
    48: 0,  // 0
    49: 1,  // 1
};

// Object to hold the experiment configuration. It takes as parameters
// the numeric codes representing the experimental condition and
// whether the trials are counterbalanced.
var Config = function (condition, counterbalance) {

    // These are the condition and counterbalancing ids
    this.condition = condition;
    this.counterbalance = counterbalance;

    // Paths to stimuli, depending on experiment phase
    this.resource_paths = null;
    // Whether debug information should be printed out
    this.debug = false;
    // The amount of time to fade HTML elements in/out
    this.fade = 200;
    // List of trial information object for each experiment phase
    this.trials = new Object();

    // Lists of pages and examples for each instruction page.  We know
    // the list of pages we want to display a priori.
    this.instructions = new Object();
    this.instructions[EXPERIMENT.pretest] = {
        pages: ["instructions-pretest-1",
                "instructions-pretest-2",
                "instructions-pretest-3"]
    };
    this.instructions[EXPERIMENT.experimentA] = {
        pages: ["instructions-experimentA"]
    };
    this.instructions[EXPERIMENT.experimentB] = {
        pages: ["instructions-experimentB"],
        examples: [null]
    };
    this.instructions[EXPERIMENT.experimentC] = {
        pages: ["instructions-experimentC"],
    };
    this.instructions[EXPERIMENT.posttest] = {
        pages: ["instructions-posttest"],
        examples: [null]
    };

    // The list of all the HTML pages that need to be loaded
    this.pages = [
        "trial.html", 
        "submit.html"
    ];

    this.get_path = function (experiment_phase) {
        return "/static/stimuli/" + 
            this.resource_paths[experiment_phase] + 
            "-cb" + this.counterbalance + "/";
    };

    // Parse the JSON object that we've requested and load it into the
    // configuration
    this.parse_config = function (data) {
        this.trials[EXPERIMENT.pretest] = _.shuffle(data["pretest"]);
        this.trials[EXPERIMENT.experimentA] = _.shuffle(data["experimentA"]);
        this.trials[EXPERIMENT.experimentB] = _.shuffle(data["experimentB"]);
        this.trials[EXPERIMENT.experimentC] = _.shuffle(data["experimentC"]);
        this.trials[EXPERIMENT.posttest] = _.shuffle(data["posttest"]);

        this.instructions[EXPERIMENT.pretest].examples = [
            data.unstable_example,
            data.stable_example,
            null
        ];
        
        this.instructions[EXPERIMENT.experimentA].examples = [
            data.mass_example
        ];

        this.instructions[EXPERIMENT.experimentC].examples = [
            data.experimentC[0]
        ];
    };

    // Load the condition name from the server
    this.load_condition = function () {
        var that = this;
        $.ajax({
            dataType: "json",
            url: "/static/json/conditions.json",
            async: false,
            success: function (data) {
                if (that.debug) {
                    console.log("Got list of conditions");
                }
                that.resource_paths = new Object();
                for (key in data[that.condition]) {
                    that.resource_paths[EXPERIMENT[key]] = data[that.condition][key];
                }
            }
        });
    };

    // Load the experiment configuration from the server
    this.load_config = function () {
        var that = this;
        $.ajax({
            dataType: "json",
            url: "/static/json/" + this.condition + 
                "-cb" + this.counterbalance + ".json",
            async: false,
            success: function (data) { 
                if (that.debug) {
                    console.log("Got configuration data");
                }
                that.parse_config(data);
            }
        });
    };

    // Request from the server configuration information for this run
    // of the experiment
    this.load_condition();
    this.load_config();
};

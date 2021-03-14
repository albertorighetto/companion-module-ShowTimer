var tcp           = require('../../tcp');
var instance_skel = require('../../instance_skel');
var actions       = require('./actions');
var feedback      = require('./feedback');
var presets       = require('./presets');

var debug;
var log;
var lineEndings;

class instance extends instance_skel {
	/**
	* Create an instance.
	*
	* @param {EventEmitter} system - the brains of the operation
	* @param {string} id - the instance ID
	* @param {Object} config - saved user configuration parameters
	* @since 1.1.0
	*/
	constructor(system, id, config) {
		super(system, id, config);
		var self = this;

		Object.assign(this, {...actions,...feedback,...presets});

		this.lineEndings = '';
		this.feedbackstate = {
			time: '00:00:00',
			state: 'STOPPED',
			mode: 'TIMER',
		};

		self.actions(); // export actions
		return self;
	}
	/**
	 * Setup the actions.
	 *
	 * @param {EventEmitter} system - the brains of the operation
	 * @access public
	 * @since 1.1.0
	 */
	actions(system) {
		this.setActions(this.getActions());
	}
	/**
	 * Creates the configuration fields for web config.
	 *
	 * @returns {Array} the config fields
	 * @access public
	 * @since 1.1.0
	 */
	config_fields() {
		return [
			{
				type: 'text',
				id: 'info',
				label: 'Information',
				width: 12,
				value: 'ShowTimer control'
			},
			{
				type: 'textinput',
				id: 'host',
				label: 'Target IP',
				width: 6,
				regex: this.REGEX_IP
			},
			{
				type: 'textinput',
				id: 'port',
				label: 'Target Port',
				width: 2,
				default: 5555,
				regex: this.REGEX_PORT
			}
		]
	}
	/**
	 * Executes the provided action.
	 *
	 * @param {Object} action - the action to be executed
	 * @access public
	 * @since 1.0.0
	 */
	action(action) {
		var id = action.action;
		var opt = action.options;
		var cmd;

		//console.log(JSON.stringify(action));

		switch (id){
			case 'customCommand':
				cmd = opt.command;
				break;

			default:
				if(Object.keys(opt).length == 0) {
					// Action has no options, create JSON string with action name and a value
					cmd = `{"${id}":true}`;
				} else {
					// Send options as JSON string
					cmd = JSON.stringify(opt);
				}
				break;
		}

		if (cmd !== undefined) {
			debug('sending ', cmd, 'to', this.config.host);
			if (this.currentStatus != this.STATUS_OK) {
				this.init_tcp(function() {
					this.socket.send(cmd + this.lineEndings);
				});
			} else {
				this.socket.send(cmd + this.lineEndings);
			}
		}
	}
	/**
	 * Clean up the instance before it is destroyed.
	 *
	 * @access public
	 * @since 1.1.0
	 */
	destroy() {

		if (this.timer) {
			clearInterval(this.timer);
			delete this.timer;
		}

		if (this.socket !== undefined) {
			this.socket.destroy();
		}
		debug("destroy", this.id);
	}
	/**
	 * Main initialization function called once the module
	 * is OK to start doing things.
	 *
	 * @access public
	 * @since 1.1.0
	 */
	init() {
		debug = this.debug;
		log = this.log;

		this.initPresets();
		this.init_tcp();
	}
	/**
	 * INTERNAL: use setup data to initalize the tcp socket object.
	 *
	 * @access protected
	 * @since 1.0.0
	 */
	init_tcp() {
		if (this.socket !== undefined) {
			this.socket.destroy();
			delete this.socket;
		}

		this.status(this.STATE_WARNING, 'Connecting');

		if (this.config.host) {
			this.socket = new tcp(this.config.host, this.config.port);

			this.socket.on('status_change', (status, message) => {
				this.status(status, message);
			});

			this.socket.on('error', (err) => {
				this.debug("Network error", err);
				this.status(this.STATE_ERROR, err);
				this.log('error',"Network error: " + err.message);
			});

			this.socket.on('connect', () => {
				this.status(this.STATE_OK);
				this.debug("Connected");
				this.feedbackstate = {
					time: '00:00:00',
					state: 'STOPPED',
					mode: 'TIMER'
				};

				this.socket.send("GAS");
				this.socket.receivebuffer = '';
			});

			// separate buffered stream into lines with responses
			this.socket.on('data', (chunk) => {
				var i = 0, line = '', offset = 0;

				this.socket.receivebuffer += chunk;

				while ( (i = this.socket.receivebuffer.indexOf('\n', offset)) !== -1) {
					line = this.socket.receivebuffer.substr(offset, i - offset);
					offset = i + 1;
					this.socket.emit('receiveline', line.toString());
				}
				this.socket.receivebuffer = this.socket.receivebuffer.substr(offset);
			});

			this.socket.on('receiveline', (data) => {
				var info = data.toString();
				if (info.startsWith("GAS:")) {
					this.lineEndings = "";
					this.initFeedbacks();
					this.initVariables();

					this.checkFeedbacks('state_color');
					this.checkFeedbacks('mode_color');
					this.checkFeedbacks('message_on');
					this.updateState();
					this.updateMode();

					// Include feedback variables
					this.initPresets(true);

					info = info.substring(4);
					info = info.split(',');
					//this.feedbackstate.;
					//this.feedbackstate.display = info[1];
					this.setVariable('seconds', info[0]);
					this.setVariable('display', info[1]);
				} else if (info.startsWith("CT:")) {
					info = info.substring(3);
					info = info.split(',');
					this.setVariable('seconds', info[0]);
					this.setVariable('display', info[1]);
				}
			});

			this.socket.on('end', () => {
				debug('Disconnected, ok');
				this.socket.destroy();
				delete this.socket;
			});
		}
	}
	/**
	 * INTERNAL: initialize feedbacks.
	 *
	 * @access protected
	 * @since 1.1.0
	 */
	initFeedbacks() {
		// feedbacks
		var feedbacks = this.getFeedbacks();

		this.setFeedbackDefinitions(feedbacks);
	}
	/**
	 * INTERNAL: initialize presets.
	 *
	 * @access protected
	 * @since 1.1.0
	 */
	initPresets (updates) {
		var presets = this.getPresets(updates);

		this.setPresetDefinitions(presets);
	}
	/**
	 * Process an updated configuration array.
	 *
	 * @param {Object} config - the new configuration
	 * @access public
	 * @since 1.1.0
	 */
	updateConfig (config) {
		var resetConnection = false;

		if (this.config.host != config.host)
		{
			resetConnection = true;
		}

		this.config = config;
		this.initPresets();
		if (resetConnection === true || this.socket === undefined) {
			this.init_tcp();
		}
	}
	/**
	 * INTERNAL: initialize variables.
	 *
	 * @access protected
	 * @since 1.1.0
	 */
	initVariables() {

		var variables = [
			{
				label: 'State of timer (Running, Paused, Stopped)',
				name: 'state'
			},
			{
				label: 'Current text on display',
				name: 'display'
			},
			{
				label: 'Current time in seconds',
				name: 'seconds'
			}
		];

		this.updateTime();
		this.setVariableDefinitions(variables);
	}

	updateTime() {
		var info = this.feedbackstate.time.split(':');

		this.setVariable('time', this.feedbackstate.time);
		this.setVariable('time_hm', info[0] + ':' + info[1]);

		this.setVariable('time_h', info[0]);
		this.setVariable('time_m', info[1]);
		this.setVariable('time_s', info[2]);
	}

	updateState() {
		var states = {
			'PLAYING': 'Running',
			'PAUSED': 'Paused',
			'STOPPED': 'Stopped'
		};

		this.setVariable('state', states[this.feedbackstate.state]);
	}

	updateMode() {
		this.setVariable('mode', this.feedbackstate.mode);
	}

}

exports = module.exports = instance;

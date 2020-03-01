var tcp           = require('../../tcp');
var instance_skel = require('../../instance_skel');
var debug;
var log;

function instance(system, id, config) {
	var self = this;

	// super-constructor
	instance_skel.apply(this, arguments);

	self.actions(); // export actions
	self.init_presets();

	return self;
}

instance.prototype.updateConfig = function(config) {
	var self = this;
	self.init_presets();

	if (self.socket !== undefined) {
		self.socket.destroy();
		delete self.socket;
	}

	self.config = config;

	self.init_tcp();
};

instance.prototype.init = function() {
	var self = this;

	debug = self.debug;
	log = self.log;
	self.init_presets();

	self.init_tcp();
};

instance.prototype.init_tcp = function() {
	var self = this;

	if (self.socket !== undefined) {
		self.socket.destroy();
		delete self.socket;
	}

	self.status(self.STATE_WARNING, 'Connecting');

	if (self.config.host) {
		self.socket = new tcp(self.config.host, self.config.port);

		self.socket.on('status_change', function (status, message) {
			self.status(status, message);
		});

		self.socket.on('error', function (err) {
			debug("Network error", err);
			self.status(self.STATE_ERROR, err);
			self.log('error',"Network error: " + err.message);
		});

		self.socket.on('connect', function () {
			self.status(self.STATE_OK);
			debug("Connected");
		})

		self.socket.on('data', function (data) {});
	}
};


// Return config fields for web config
instance.prototype.config_fields = function () {
	var self = this;

	return [
		{
			type: 'text',
			id: 'info',
			label: 'Information',
			width: 12,
			value: '<strong>If you are using this plugin</strong>, then it would probably mean that you are using some software that has not been supported yet, and we would therefore really appreciate if you went ahead and made a module request for it here:<br /><br />https://github.com/bitfocus/companion-module-requests/issues<br /><br />In that way, more people will get to benefit from this in the future, thanks.'	
		},
		{
			type: 'textinput',
			id: 'host',
			label: 'Target IP',
			width: 6,
			regex: self.REGEX_IP
		},
		{
			type: 'textinput',
			id: 'port',
			label: 'Target Port',
			width: 2,
			default: 5555,
			regex: self.REGEX_PORT
        }
	]
};

// When module gets deleted
instance.prototype.destroy = function() {
	var self = this;

	if (self.socket !== undefined) {
		self.socket.destroy();
	}

	debug("destroy", self.id);;
};

instance.prototype.init_presets = function () {
	var self = this;
	var presets = [];

	self.setPresetDefinitions(presets);
}

instance.prototype.actions = function(system) {
	var self = this;

	self.system.emit('instance_actions', self.id, {
		'Start': {label: 'start countdown'},
		'Pause': { label: 'pause countdown'},
		'Reset': { label: 'reset countdown'},
		'newCountdown': {
			label: 'reset countdown with new duration',
			options: [
				{
					type: 'textinput',
					id: 'id_newCountdownM',
					label: 'New duration (minutes):',
					default: '5',
					regex: '/([0-9]+)/'
				}
			]
		},
		'customCommand': {
			label: 'send custom command',
			options: [
				{
					type: 'textinput',
					id: 'id_customCommand',
					label: 'Command:',
					default: '',
					width: 6
				}
			]
		}
	});
}

instance.prototype.action = function(action) {
	var self = this;
	var cmd;

	switch(action.action) {

		case 'customCommand':
			cmd = action.options.id_customCommand;
			break;
			
		case 'Start':
			cmd = 'S';
			break;
		
		case 'Pause':
			cmd = 'P';
			break;
		
		case 'Reset':
			cmd = 'R';
			break;
			
		case 'newCountdown':
			cmd = 'N' + action.options.id_newCountdownM + "mP";
			break;

	}

	if (cmd !== undefined) {

		debug('sending ',cmd," to ",self.config.host);

		if (self.socket !== undefined && self.socket.connected) {
			self.socket.send(cmd);
		}
		else {
			debug('Socket not connected :(');
		}
	}
}

instance_skel.extendedBy(instance);
exports = module.exports = instance;
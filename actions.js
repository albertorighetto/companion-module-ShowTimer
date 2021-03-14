module.exports = {

	/**
	* Get the available actions.
	*
	* @returns {Object[]} the available actions
	* @access public
	* @since 1.1.0
	*/

	getActions() {
		// By default, actions without an option will be sent as a JSON string {"action":true}
		// By default, actions with options will be sent a JSON string of the options {"optionid1":"value","optionid2":"value"}
		// This greatly simplifies code management

		var actions = {};

		actions['start'] = {label: 'Start'},
		actions['pause'] = {label: 'Pause'},
		actions['reset'] = {label: 'Reset'},
		actions['newCountdown'] = {
			label: 'New countdown',
			options: [
				{
					type: 'textinput',
					id: 'hours',
					label: 'Hours:',
					default: '0',
					regex: '/([0-9]+)/'
				},{
					type: 'textinput',
					id: 'minutes',
					label: 'Minutes:',
					default: '5',
					regex: '/([0-9]+)/'
				},{
					type: 'textinput',
					id: 'seconds',
					label: 'Seconds:',
					default: '0',
					regex: '/([0-9]+)/'
				}
			]
		},
		actions['addTime'] = {
			label: 'Add time',
			options: [
				{
					type: 'textinput',
					id: 'addhours',
					label: 'Hours:',
					default: '0',
					regex: '/-?([0-9]+)/'
				},{
					type: 'textinput',
					id: 'addminutes',
					label: 'Minutes:',
					default: '5',
					regex: '/-?([0-9]+)/'
				},{
					type: 'textinput',
					id: 'addseconds',
					label: 'Seconds:',
					default: '0',
					regex: '/-?([0-9]+)/'
				}
			]
		},
		actions['timeFormat'] = {
			label: 'Time format',
			options: [
				{
					type: 'dropdown',
					id: 'timeformat',
					label: 'Format:',
					default: 'MS',
					choices: [
						{ id: 'HMS', label: 'hours:minutes:seconds'},
						{ id: 'MS', label: 'minutes:seconds'},
						{ id: 'HM', label: 'hours:minutes'},
						{ id: 'S', label: 'seconds'}
					]
				}
			]
		},
		actions['countUp'] = {
			label: 'Count up on overtime',
			options: [
				{
					type: 'dropdown',
					id: 'countup',
					label: 'Count up:',
					default: 'on',
					choices: [
						{ id: 'on', label: 'On'},
						{ id: 'off', label: 'Off'}
					]
				}
			]
		},
		actions['blink'] = {
			label: 'Blink on overtime',
			options: [
				{
					type: 'dropdown',
					id: 'blink',
					label: 'Blink on overtime:',
					default: 'on',
					choices: [
						{ id: 'on', label: 'On'},
						{ id: 'off', label: 'Off'}
					]
				}
			]
		},
		actions['customCommand'] = {
			label: 'Custom command',
			options: [
				{
					type: 'textinput',
					id: 'command',
					label: 'Command:',
					default: '{}'
				}
			]
		}

		return actions;
	}
}

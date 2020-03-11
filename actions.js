module.exports = {

	/**
	* Get the available actions.
	*
	* @returns {Object[]} the available actions
	* @access public
	* @since 1.1.0
	*/

	getActions() {
		var actions = {};
		
		
		actions['Start'] = {label: 'start'},
		actions['Pause'] = { label: 'pause'},
		actions['Reset'] = { label: 'reset'},
		actions['newCountdown'] = {
			label: 'new countdown',
			options: [
				{
					type: 'textinput',
					id: 'id_newCountdownH',
					label: 'Hours:',
					default: '0',
					regex: '/([0-9]+)/'
				},{
					type: 'textinput',
					id: 'id_newCountdownM',
					label: 'Minutes:',
					default: '5',
					regex: '/([0-9]+)/'
				},{
					type: 'textinput',
					id: 'id_newCountdownS',
					label: 'Seconds:',
					default: '0',
					regex: '/([0-9]+)/'
				}
			]
		},
		actions['addTime'] = {
			label: 'add time',
			options: [
				{
					type: 'textinput',
					id: 'id_addH',
					label: 'Hours:',
					default: '0',
					regex: '/-?([0-9]+)/'
				},{
					type: 'textinput',
					id: 'id_addM',
					label: 'Minutes:',
					default: '5',
					regex: '/-?([0-9]+)/'
				},{
					type: 'textinput',
					id: 'id_addS',
					label: 'Seconds:',
					default: '0',
					regex: '/-?([0-9]+)/'
				}
			]
		},
		actions['format'] = {
			label: 'time format',
			options: [
				{
					type: 'dropdown',
					id: 'id_format',
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
			label: 'count up on overtime',
			options: [
				{
					type: 'dropdown',
					id: 'id_countUp',
					label: 'Count up:',
					default: 'ON',
					choices: [
						{ id: 'ON', label: 'On'},
						{ id: 'OFF', label: 'Off'}
					]
				}
			]
		},
		actions['minus'] = {
			label: 'minus on overtime',
			options: [
				{
					type: 'dropdown',
					id: 'id_minus',
					label: 'Show minus sign on overtime:',
					default: 'ON',
					choices: [
						{ id: 'ON', label: 'On'},
						{ id: 'OFF', label: 'Off'}
					]
				}
			]
		},
		actions['hide'] = {
			label: 'hide text',
			options: [
				{
					type: 'dropdown',
					id: 'id_hide',
					label: 'Text visibility:',
					default: 'ON',
					choices: [
						{ id: 'ON', label: 'Visible'},
						{ id: 'OFF', label: 'Hidden'}
					]
				}
			]
		},
		actions['blink'] = {
			label: 'blink on overtime',
			options: [
				{
					type: 'dropdown',
					id: 'id_blink',
					label: 'Blink:',
					default: 'ON',
					choices: [
						{ id: 'ON', label: 'On'},
						{ id: 'OFF', label: 'Off'}
					]
				}
			]
		},
		actions['customCommand'] = {
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

		return actions;
	}
}

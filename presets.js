module.exports = {

		/**
		* Get the available presets.
		*
		* @returns {Object[]} the available feedbacks
		* @access public
		* @since 1.1.0
		*/

		getPresets(updates) {
			var presets = [];

			presets.push({
				category: 'Control',
				label: 'Start',
				bank: {
					style: 'text',
					text: '⏵',
					size: '44',
					color: this.rgb(255, 255, 255),
					bgcolor: this.rgb(0, 204, 0)
				},
				actions: [{
					action: 'Start'
				}]
			});
			
			presets.push({
				category: 'Control',
				label: 'Pause',
				bank: {
					style: 'text',
					text: '⏸',
					size: '44',
					color: this.rgb(0, 0, 0),
					bgcolor: this.rgb(255, 255, 0)
				},
				actions: [{
					action: 'Pause'
				}]
			});
			
			presets.push({
				category: 'Control',
				label: 'Reset',
				bank: {
					style: 'text',
					text: '↺',
					size: '44',
					color: this.rgb(255, 255, 255),
					bgcolor: this.rgb(255, 0, 0)
				},
				actions: [{
					action: 'Reset'
				}]
			});
			
			presets.push({
				category: 'Style',
				label: 'Hide timer',
				bank: {
					style: 'text',
					text: 'Hide timer',
					size: 'auto',
					color: this.rgb(255, 255, 255),
					bgcolor: this.rgb(0, 0, 0),
					latch: true
				},
				actions: [{
					action: 'hide',
					options: {
						id_hide: 'OFF'
          }
				}],
				release_actions: [{
					action: 'hide',
					options: {
						id_hide: 'ON'
          }
				}]
			});
			
			presets.push({
				category: 'Style',
				label: 'Stop at 0',
				bank: {
					style: 'text',
					text: 'Stop at 0',
					size: 'auto',
					color: this.rgb(255, 255, 255),
					bgcolor: this.rgb(0, 0, 0),
					latch: true
				},
				actions: [{
					action: 'countUp',
					options: {
						id_countUp: 'OFF'
          }
				}],
				release_actions: [{
					action: 'countUp',
					options: {
						id_countUp: 'ON'
          }
				}]
			});
			
			presets.push({
				category: 'Style',
				label: 'Blink',
				bank: {
					style: 'text',
					text: 'Blink',
					size: 'auto',
					color: this.rgb(255, 255, 255),
					bgcolor: this.rgb(0, 0, 0),
					latch: true
				},
				actions: [{
					action: 'blink',
					options: {
						id_blink: 'ON'
          }
				}],
				release_actions: [{
					action: 'blink',
					options: {
						id_blink: 'OFF'
          }
				}]
			});
			
			presets.push({
				category: 'Style',
				label: 'Hide minus',
				bank: {
					style: 'text',
					text: 'Hide minus',
					size: 'auto',
					color: this.rgb(255, 255, 255),
					bgcolor: this.rgb(0, 0, 0),
					latch: true
				},
				actions: [{
					action: 'minus',
					options: {
						id_minus: 'OFF'
          }
				}],
				release_actions: [{
					action: 'minus',
					options: {
						id_minus: 'ON'
          }
				}]
			});
			
			presets.push({
				category: 'Time format',
				label: 'Format H:MM:SS',
				bank: {
					style: 'text',
					text: 'Format\\nH:MM:SS',
					size: 'auto',
					color: this.rgb(255, 255, 255),
					bgcolor: this.rgb(0, 0, 0),
				},
				actions: [{
					action: 'format',
					options: {
						id_format: 'HMS'
          }
				}]
			});
			
			presets.push({
				category: 'Time format',
				label: 'Format MM:SS',
				bank: {
					style: 'text',
					text: 'Format\\nMM:SS',
					size: 'auto',
					color: this.rgb(255, 255, 255),
					bgcolor: this.rgb(0, 0, 0),
				},
				actions: [{
					action: 'format',
					options: {
						id_format: 'MS'
          }
				}]
			});
			
			presets.push({
				category: 'Time format',
				label: 'Format H:MM',
				bank: {
					style: 'text',
					text: 'Format\\nH:MM',
					size: 'auto',
					color: this.rgb(255, 255, 255),
					bgcolor: this.rgb(0, 0, 0),
				},
				actions: [{
					action: 'format',
					options: {
						id_format: 'HM'
          }
				}]
			});
			
			presets.push({
				category: 'Time format',
				label: 'Format SS',
				bank: {
					style: 'text',
					text: 'Format\\nSS',
					size: 'auto',
					color: this.rgb(255, 255, 255),
					bgcolor: this.rgb(0, 0, 0),
				},
				actions: [{
					action: 'format',
					options: {
						id_format: 'S'
          }
				}]
			});

			if (updates) {
				// Show timer
				presets.push({
					category: 'Misc',
					label: 'Current displayed time',
					bank: {
						style: 'text',
						text: 'Current:\\n$(label:display) ',
						size: 'auto',
						color: this.rgb(255,255,255),
						bgcolor: this.rgb(0,0,0)
					}
				});
			}
			return presets;
		}
};

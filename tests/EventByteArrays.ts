const ByteArrays = {
	TEXT:						[0x00, 0xFF, 0x01, 0x04, 0x42, 0x61, 0x73, 0x73],
	COPYRIGHT:					[0x00, 0xFF, 0x02, 0x1E, 0xA9, 0x20, 0x32, 0x30, 0x30, 0x39, 0x20, 0x4B, 0x61, 0x6C, 0x69, 0x6F, 0x70, 0x61, 0x20, 0x50, 0x75, 0x62, 0x6C, 0x69, 0x73, 0x68, 0x69, 0x6E, 0x67, 0x2C, 0x20, 0x4C, 0x4C, 0x43],
	TRACK_NAME:					[0x00, 0xFF, 0x03, 0x04, 0x42, 0x61, 0x73, 0x73],
	INSTRUMENT_NAME:			[0x00, 0xFF, 0x04, 0x04, 0x42, 0x61, 0x73, 0x73],
	LYRIC:						[0x00, 0xFF, 0x05, 0x03, 0x6C, 0x61, 0x2D],
	MARKER:						[0x00, 0xFF, 0x06, 0x05, 0x56, 0x65, 0x72, 0x73, 0x65],
	CUE_POINT:					[0x00, 0xFF, 0x07, 0x04, 0x53, 0x6F, 0x6C, 0x6F],
	SET_TEMPO:					[0x00, 0xFF, 0x51, 0x03, 0x07, 0xA1, 0x20],
	SMTPE_OFFSET:				[0x00, 0xFF, 0x54, 0x05, 0x01, 0x00, 0x00, 0x00, 0x00],
	SEQUENCE_NUMBER:			[0x00, 0xFF, 0x00, 0x02, 0x00, 0x02],
	END_OF_TRACK:				[0x00, 0xFF, 0x2F, 0x00],
	CHANNEL_PREFIX:				[0x00, 0xFF, 0x20, 0x01, 0x02],
	PORT_PREFIX:				[0x00, 0xFF, 0x21, 0x01, 0x03],
	KEY_SIGNATURE:				[0x00, 0xFF, 0x59, 0x02, 0x04, 0x00],
	TIME_SIGNATURE:				[0x00, 0xFF, 0x58, 0x04, 0x04, 0x02, 0x18, 0x08],
	SEQUENCER_SPECIFIC:			[0x00, 0xFF, 0x7F, 0x04, 0x41, 0x04, 0x01, 0x56],

	SYSEX:						[0x00, 0xF0, 0x41, 0x01, 0x34, 0xF7],

	NOTE_ON:					[0x00, 0x92, 0x3D, 0x78],
	NOTE_OFF:					[0x00, 0x83, 0x3E, 0x78],
	AFTERTOUCH:					[0x00, 0xA4, 0x3F, 0x79],
	CONTROLLER:					[0x00, 0xB6, 0x07, 0x10],
	PROGRAM_CHANGE:				[0x00, 0xC6, 0x07],
	CHANNEL_AFTERTOUCH:			[0x00, 0xD6, 0x35],
	PITCH_WHEEL:				[0x00, 0xE3, 0x54, 0x39],

	RUNNING_C_MAJOR_TRIAD:		[0x00, 0x90, 0x3C, 0x7F, 
								 0x00, 0x40, 0x7F, 
								 0x00, 0x43, 0x7F],

	INVALID_TEXT:				[0x00, 0xFF, 0x01, 0x04, 0x42, 0x61, 0x73],
	INVALID_META_EVENT_TYPE:	[0x00, 0xFF, 0x88, 0x01, 0x00]
};

export default ByteArrays;
import ReadStream from "../../streams/ReadStream";
import { StatusBytes } from "../../streams/StatusBytes";
import WriteStream from "../../streams/WriteStream";
import ControlEvent, { ControlEventType } from "./ControlEvent";

export enum NamedControllerType
{
	BANK_SELECT_COARSE                  = 0x00,
	MODULATION_WHEEL_COARSE             = 0x01,
	BREATH_CONTROLLER_COARSE            = 0x02,
	FOOT_CONTROLLER_COARSE              = 0x04,
	PORTAMENTO_TIME_COARSE              = 0x05,
	DATA_ENTRY_COARSE                   = 0x06,
	CHANNEL_VOLUME_COARSE               = 0x07,
	BALANCE_COARSE                      = 0x08,
	PAN_COARSE                          = 0x0A,
	EXPRESSION_COARSE2                  = 0x0B,
	EFFECT_CONTROL_1_COARSE             = 0x0C,
	EFFECT_CONTROL_2_COARSE             = 0x0D,
	GENERAL_PURPOSE_CONTROLLER_1_COARSE = 0x10,
	GENERAL_PURPOSE_CONTROLLER_2_COARSE = 0x11,
	GENERAL_PURPOSE_CONTROLLER_3_COARSE = 0x12,
	GENERAL_PURPOSE_CONTROLLER_4_COARSE = 0x13,
	BANK_SELECT_FINE                    = 0x20,
	MODULATION_WHEEL_FINE               = 0x21,
	BREATH_CONTROLLER_FINE              = 0x22,
	FOOT_CONTROLLER_FINE                = 0x24,
	PORTAMENTO_TIME_FINE                = 0x25,
	DATA_ENTRY_FINE                     = 0x26,
	CHANNEL_VOLUME_FINE                 = 0x27,
	BALANCE_FINE                        = 0x28,
	PAN_FINE                            = 0x2A,
	EXPRESSION_FINE2                    = 0x2B,
	EFFECT_CONTROL_1_FINE               = 0x2C,
	EFFECT_CONTROL_2_FINE               = 0x2D,
	HOLD_PEDAL_1                        = 0x40,
	PORTAMENTO_PEDAL                    = 0x41,
	SOSTENUTO_PEDAL                     = 0x42,
	SOFT_PEDAL                          = 0x43,
	LEGATO_PEDAL                        = 0x44,
	HOLD_PEDAL_2                        = 0x45,
	SOUND_CONTROLLER_1                  = 0x46,
	SOUND_CONTROLLER_2                  = 0x47,
	SOUND_CONTROLLER_3                  = 0x48,
	SOUND_CONTROLLER_4                  = 0x49,
	SOUND_CONTROLLER_5                  = 0x4A,
	SOUND_CONTROLLER_6                  = 0x4B,
	SOUND_CONTROLLER_7                  = 0x4C,
	SOUND_CONTROLLER_8                  = 0x4D,
	SOUND_CONTROLLER_9                  = 0x4E,
	SOUND_CONTROLLER_10                 = 0x4F,
	GENERAL_PURPOSE_CONTROLLER_5        = 0x50,
	GENERAL_PURPOSE_CONTROLLER_6        = 0x51,
	GENERAL_PURPOSE_CONTROLLER_7        = 0x52,
	GENERAL_PURPOSE_CONTROLLER_8        = 0x53,
	PORTAMENTO_CONTROL                  = 0x54,
	HIGH_RESOLUTION_VELOCITY_PREFIX     = 0x58,
	EFFECT_1_DEPTH                      = 0x5B,
	EFFECT_2_DEPTH                      = 0x5C,
	EFFECT_3_DEPTH                      = 0x5D,
	EFFECT_4_DEPTH                      = 0x5E,
	EFFECT_5_DEPTH                      = 0x5F,
	DATA_BUTTON_INCREMENT               = 0x60,
	DATA_BUTTON_DECREMENT               = 0x61,
	NON_REGISTERED_PARAMETER_COARSE     = 0x62,
	NON_REGISTERED_PARAMETER_FINE       = 0x63,
	REGISTERED_PARAMETER_COARSE         = 0x64,
	REGISTERED_PARAMETER_FINE           = 0x65,
	ALL_SOUND_OFF                       = 0x78,
	ALL_CONTROLLERS_OFF                 = 0x79,
	LOCAL_CONTROL                       = 0x7A,
	ALL_NOTES_OFF                       = 0x7B,
	OMNI_MODE_OFF                       = 0x7C,
	OMNI_MODE_ON                        = 0x7D,
	MONO_OPERATION_AND_ALL_NOTES_OFF    = 0x7E,
	POLY_OPERATION_AND_ALL_NOTES_OFF    = 0x7F
};

type UndefinedControllerType =
	0x03 |
	0x09 |
	0x0E | 0x0F |
	0x14 | 0x15 | 0x16 | 0x17 | 0x18 | 0x19 | 0x1A | 0x1B | 0x1C | 0x1D | 0x1E | 0x1F |
	0x55 | 0x56 | 0x57 |
	0x59 | 0x5A |
	0x66 | 0x67 | 0x68 | 0x69 | 0x6A | 0x6B | 0x6C | 0x6D | 0x6E | 0x6F |
	0x70 | 0x71 | 0x72 | 0x73 | 0x74 | 0x75 | 0x76 | 0x77;

// NB: Don't break older code that wants to use ControllerType.WHATEVER instead of NamedControllerType.
export type ControllerType = NamedControllerType | UndefinedControllerType;
export const ControllerType = NamedControllerType;

export default class ControllerEvent extends ControlEvent
{
	controller: ControllerType = ControllerType.BANK_SELECT_COARSE;
	value: number = 0;

	constructor(delta?: number, channel?: number, value?: number)
	{
		super(delta, channel);

		if(value)
			this.value = value;
	}

	readBytes(stream: ReadStream): void
	{
		this.controller = stream.readByte();
		this.value = stream.readByte();
	}

	writeBytes(stream: WriteStream, status?: StatusBytes): void
	{
		super.writeBytes(stream, status);

		stream.writeByte(this.controller);
		stream.writeByte(this.value);
	}

	protected getTypeHibyte(): number
	{
		return ControlEventType.CONTROLLER;
	}
}

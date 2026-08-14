import ControllerEvent, { NamedControllerType } from "../control/ControllerEvent";

type PitchBendRangeEvents = readonly [
    ControllerEvent<NamedControllerType.REGISTERED_PARAMETER_FINE, 0x7F>,
    ControllerEvent<NamedControllerType.REGISTERED_PARAMETER_COARSE, 0x7F>,
    ControllerEvent<NamedControllerType.DATA_ENTRY_COARSE>,
    ControllerEvent<NamedControllerType.REGISTERED_PARAMETER_FINE, 0>,
    ControllerEvent<NamedControllerType.REGISTERED_PARAMETER_COARSE, 0>,
];

type PitchBendRangeWithCentsEvents = readonly [
    ControllerEvent<NamedControllerType.REGISTERED_PARAMETER_FINE, 0x7F>,
    ControllerEvent<NamedControllerType.REGISTERED_PARAMETER_COARSE, 0x7F>,
    ControllerEvent<NamedControllerType.DATA_ENTRY_COARSE>,
    ControllerEvent<NamedControllerType.DATA_ENTRY_FINE>,
    ControllerEvent<NamedControllerType.REGISTERED_PARAMETER_FINE, 0>,
    ControllerEvent<NamedControllerType.REGISTERED_PARAMETER_COARSE, 0>,
];

export default class PitchBendRangeEventsFactory
{
    static create(channel: number, semitones: number, cents: number = 0): PitchBendRangeEvents | PitchBendRangeWithCentsEvents
    {
        const head = [
            new ControllerEvent(0, channel, NamedControllerType.REGISTERED_PARAMETER_FINE, 0x7F),
            new ControllerEvent(0, channel, NamedControllerType.REGISTERED_PARAMETER_COARSE, 0x7F),
            new ControllerEvent(0, channel, NamedControllerType.DATA_ENTRY_COARSE, semitones),
        ] as const;

        const tail = [
            new ControllerEvent(0, channel, NamedControllerType.REGISTERED_PARAMETER_FINE, 0),
            new ControllerEvent(0, channel, NamedControllerType.REGISTERED_PARAMETER_COARSE, 0),
        ] as const;

        if(cents)
            return [...head, new ControllerEvent(0, channel, NamedControllerType.DATA_ENTRY_FINE, cents), ...tail];

        return [...head, ...tail];
    }
}

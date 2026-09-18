import { useControl } from 'react-map-gl/mapbox';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { useEffect } from 'react';

export default function DrawControl(props) {
    const draw = useControl(
        () => new MapboxDraw(props),
        ({map}) => {
            map.on('draw.create', props.onCreate)
            map.on('draw.update', props.onUpdate)
            map.on('draw.delete', props.onDelete)
            map.on('draw.selectionchange', props.onSelectionChange)
        },
        ({map}) => {
            map.off('draw.create', props.onCreate)
            map.off('draw.update', props.onUpdate)
            map.off('draw.delete', props.onDelete)
            map.off('draw.selectionchange', props.onSelectionChange)
        },
        {
            position: props.position
        }
    )

    useEffect(() => {
        if (props.onControlCreated && draw) {
            props.onControlCreated(draw);
        }
    }, [draw, props.onControlCreated]);

    return null;
}
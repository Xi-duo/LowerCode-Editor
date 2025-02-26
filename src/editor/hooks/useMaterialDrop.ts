import { useDrop } from "react-dnd";
import { useComponentConfigStore } from "../stores/component-config";
import { useComponentsStore } from "../stores/components";

export function useMaterailDrop(accept: string[], id: number) {
  const { addComponent } = useComponentsStore();
  const { componentConfig } = useComponentConfigStore();

  const [{ canDrop }, drop] = useDrop(() => ({
    accept,
    drop: (item: { type: string }, monitor) => {
      console.log(monitor);

      const didDrop = monitor.didDrop()
      if (didDrop) {
        return;
      }

      // const props = componentConfig[item.type].defaultProps;
      const config = componentConfig[item.type]

      addComponent({
        id: new Date().getTime(),
        name: item.type,
        desc: config.desc,
        props:config.defaultProps,
        styles:{
        }
      }, id)
    },
    collect: (monitor) => ({
      canDrop: monitor.canDrop(),
    }),
  }));

  return { canDrop, drop }
}
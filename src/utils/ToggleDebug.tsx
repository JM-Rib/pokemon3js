import { useControls } from 'leva'
import {Debug} from "@react-three/cannon";
function ToggleDebug({ children }) {
    const debugRendererVisible = useControls('Debug Renderer', { visible: false })

    return <>{debugRendererVisible.visible ? <Debug>{children}</Debug> : <>{children}</>}</>
}
export default ToggleDebug;

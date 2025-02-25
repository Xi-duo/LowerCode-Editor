import { Allotment } from "allotment";
import 'allotment/dist/style.css';
import { EditArea } from "./components/EditArea";
import { Materail } from "./components/Material/Material";
import { Setting } from "./components/Setting";

export default function ReactPlayground() {
    return <div className='h-[100vh] flex flex-col'>
        <div className='h-[60px] flex items-center border-b-[1px] border-[#000]'>
           Header
        </div>
        <Allotment>
            <Allotment.Pane preferredSize={240} maxSize={300} minSize={200}>
                <Materail/>
            </Allotment.Pane>
            <Allotment.Pane>
                <EditArea/>
            </Allotment.Pane>
            <Allotment.Pane preferredSize={300} maxSize={500} minSize={300}>
                <Setting/>
            </Allotment.Pane>
        </Allotment>
    </div>
}
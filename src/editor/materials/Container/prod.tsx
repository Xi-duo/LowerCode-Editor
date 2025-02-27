import { CommonComponentProps } from '../../interface';

const Container = ({ children, styles }: CommonComponentProps) => {

    return (
        <div 
            style={styles}
            className={`p-[20px]`}
        >{children}</div>
    )
}

export default Container;
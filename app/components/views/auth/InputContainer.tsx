import { FC, PropsWithChildren } from "react"

interface Props {
    label: string;
}

const InputContainer: FC<PropsWithChildren<Props>> = ({ children, label }) => {
    return (
        <div>
            <label className="font-bold">{label}</label>
            <div className="mt-2">
                {children}
            </div>

        </div>
    )
}

export default InputContainer
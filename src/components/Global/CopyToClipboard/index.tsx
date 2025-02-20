import styles from "./_styles.module.scss";
import { useEffect, useState } from "react"
import { toast } from "react-toastify";
import { Check, Copy } from "src/assets/icons/icons"

const CopyToClipboard =(props: {value: string, iconOnly?: boolean})=> {
    const [copied, setCopied] = useState(false);
    useEffect(()=> {
        let timeout: NodeJS.Timeout;
        if (copied) {
            timeout = setTimeout(()=> setCopied(false), 5000);
        }

        return ()=> clearTimeout(timeout);
    }, [copied])

    const handleCopy = () => {
        if (!props.value?.length) {
            toast.info("Nothing to Copy!");
            return;
        }
        
        navigator.clipboard.writeText(props.value)
        .then(()=> setCopied(true))
        .catch((err)=> {
            console.error('Failed to copy: ', err);
        })
    }

    return (
        <div className={props.iconOnly? styles.iconOnly : styles.copyContainer} onClick={handleCopy}>
        {!copied? <Copy /> : <Check />} {props.iconOnly? null : copied? <p className={styles.copied}> Copied!</p> : <p>Copy</p>}
        </div>
    )
}

export default CopyToClipboard;
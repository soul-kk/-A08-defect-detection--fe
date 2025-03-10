import Header from "./header"
import ChatBot from "./chatbot";
import styles from '../style/statistics.module.css';


export default function Statistics() {
    return (
        <div className={styles.indexContainer}>
            <Header />
            <div className={styles.mainContainer}>
                <ChatBot />
            </div>
        </div>
    );
}


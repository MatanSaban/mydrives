import Link from "next/link";
import Hero from "../components/HeroComp/Hero";
import styles from "./index.module.scss";
import { useRouter } from "next/router";
export default function Home(props) {
    
    const router = useRouter();

	const content = () => {
		return (
            <div style={{ textAlign: "center" }}>
                <h3>אינך מחובר</h3>
                <p>בגלל שאינך מחובר לאתר, אנחנו לא יכולים לדעת מי אתה :)</p>
                <div style={{ display: "flex" }}>
                    <div style={{ margin: "0 20px" }}>
                        <h4>אם יש לך חשבון, בוא נתחבר אליו</h4>
                        <button onClick={() => props.handlePopup(false)}><Link href={"/login"}>התחברות</Link></button>
                    </div>
                    <div style={{ margin: "0 20px" }}>
                        <h4>אין לך חשבון? בוא תצטרף!</h4>
                        <button onClick={() => props.handlePopup(false)}><Link href={"/register"}>הרשמה</Link></button>
                    </div>
                </div>
            </div>
        );
	};

    return (
        <div className={styles.wrapper}>
            <Hero title="ברוכים הבאים למחשבון ההסעות שלי" />
            <div className={styles.content}>
                <p>
                    מחשבון ההסעות שלי יעזור לך לחשב, לתכנן ולעקוב אחר כל הנסיעות
                    שלך,
                    <br />
                    על מנת לייצר סדר ומעקב ברור לגבי זמנים, קילומטראז&apos;,
                    וכמובן הכסף שמגיע לך!
                </p>
            </div>
            <button onClick={() => {props?.isLoggedIn ? router.push('/my-drives') : props.handlePopup(true, content());}}>התחל עכשיו</button>
        </div>
    );
}

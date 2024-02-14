import { useState } from "react";
import styles from "./QuestionCard.module.css";
import { BsChevronUp, BsChevronDown } from "react-icons/bs";

export default function QuestionCard({ question }) {
  const [answerOn, setAnswerOn] = useState(false);
  return (
    <div className={styles.questionCard}>
      <div
        onClick={() => {
          setAnswerOn((prev) => !prev);
        }}
        className={styles.title}
      >
        <span className={answerOn ? `${styles.onTitle}` : ``}>
          {question.title}
        </span>
        {answerOn ? <BsChevronUp size={16} /> : <BsChevronDown size={16} />}
      </div>
      {answerOn && (
        <div className={styles.answer}>
          <span>{question.answer}</span>
        </div>
      )}
    </div>
  );
}

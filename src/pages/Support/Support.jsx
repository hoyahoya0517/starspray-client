import { useEffect, useState } from "react";
import styles from "./Support.module.css";
import { useDispatch } from "react-redux";
import { navOff } from "../../redux/redux";
import { sendMoon } from "../../api/auth";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { mongoGetQuestions } from "../../api/question";
import QuestionCard from "../../components/QuestionCard/QuestionCard";

export default function Support() {
  const {
    isLoading,
    data: questions,
    isError,
  } = useQuery({
    queryKey: ["questions"],
    queryFn: async () => {
      const data = await mongoGetQuestions();
      return data;
    },
    staleTime: 1000 * 60 * 60,
  });
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [paymentId, setPaymentId] = useState("");
  const [moon, setMoon] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const handleName = (e) => {
    setName(e.target.value);
  };
  const handleEmail = (e) => {
    setEmail(e.target.value);
  };
  const handlePaymentId = (e) => {
    setPaymentId(e.target.value);
  };
  const handleMoon = (e) => {
    setMoon(e.target.value);
  };
  const handleForm = async (e) => {
    setError(false);
    e.preventDefault();
    try {
      await sendMoon(name, email, paymentId, moon);
      setName("");
      setEmail("");
      setPaymentId("");
      setMoon("");
      setErrorMessage("문의 내용이 접수되었습니다");
      return setError(true);
    } catch (error) {
      const message = error.message;
      setErrorMessage(message);
      return setError(true);
    }
  };
  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError(false);
        setErrorMessage("");
      }, 3000);
    }
  }, [error]);
  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(navOff());
  }, []);
  if (isLoading) {
    return <div className={styles.support}></div>;
  }
  return (
    <div className={styles.support}>
      <div className={styles.left}>
        <div className={styles.supportWrap}>
          <div className={styles.title}>
            <span>문의 하기</span>
          </div>
          <form onSubmit={handleForm}>
            <div className={styles.mainInput}>
              <div>
                <label htmlFor="name">Name*</label>
                <input
                  value={name}
                  onChange={handleName}
                  maxLength="10"
                  type="name"
                  id="name"
                />
              </div>
              <div>
                <label htmlFor="email">Email*</label>
                <input
                  value={email}
                  onChange={handleEmail}
                  maxLength="40"
                  type="email"
                  id="email"
                />
              </div>
              <div>
                <label htmlFor="paymentId">주문번호*</label>
                <input
                  value={paymentId}
                  onChange={handlePaymentId}
                  placeholder="#으로 시작하는 주문번호를 적어주세요."
                  maxLength="13"
                  type="paymentId"
                  id="paymentId"
                />
              </div>
              <div>
                <label htmlFor="moon">문의내용*</label>
                <textarea
                  value={moon}
                  onChange={handleMoon}
                  id="moon"
                ></textarea>
              </div>
            </div>
            <div className={styles.mainButton}>
              <button type="submit">확인</button>
              {error && (
                <motion.div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    fontSize: "2.5rem",
                    zIndex: "2",
                    color: "#fff54f",
                    position: "fixed",
                    top: "-20%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                  animate={{ top: "20%", left: "50%" }}
                  transition={{
                    duration: 0.5,
                  }}
                >
                  <span>{errorMessage}</span>
                </motion.div>
              )}
            </div>
          </form>
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.questionWrap}>
          <div className={styles.title}>
            <span>자주 하는 질문</span>
          </div>
          <div className={styles.question}>
            {questions &&
              questions.map((question) => (
                <QuestionCard question={question} key={question.id} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

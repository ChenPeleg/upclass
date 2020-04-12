import React from "react";
import Answer from "../../components/Question/Answer/Answer";
import styles from "./Question.module.scss";
import QuestionText from "../../components/QuestionText/QuestionText";
import SubmitButton from "../../components/SubmitButton/SubmitButton";

const question = (props) => {
  return (
    <div className={styles.questionWrapper}>
      <div className={styles.questionOptions} onClick={props.click}>
        <QuestionText q_num={props.q_num} q_text={props.q_ask} />

        {props.q_Ans_obj.map((a) => {
          const key = "Q" + props.q_num + a.number;

          return (
            <Answer
              content={a.content}
              key={key}
              num={a.number}
              answerHandler={props.answerHandler}
              isChosen={props.chosenAnswer === a.number ? true : false}
              marked_Answer={props.marked_Answer}
              next_unanswered_q={props.next_unanswered_q}
            />
          );
        })}

        <SubmitButton
          disableButton={
            !(props.chosenAnswer || props.Question_Object.type === "info")
          }
          submitHandler={props.submitHandler}
        >
          {props.Question_Object.type === "info" ? "Continue" : "Submit"}
        </SubmitButton>
      </div>
    </div>
  );
};
export default question;

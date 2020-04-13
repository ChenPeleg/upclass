import React, { useState, useEffect } from "react";
import Answer from "../../components/Answer/Answer";
import QuestionText from "../../components/QuestionText/QuestionText";
import SubmitButton from "../../components/SubmitButton/SubmitButton";
import QuestionWrapper from "../../components/QuestionWrapper/QuestionWrapper";

const TIME_AFTER_ANSWER = 2000;

const createAnswerObject = (answers) =>
  answers.map((a) => {
    return { content: a, number: 1 + answers.indexOf(a) };
  });
const reorderAnswers = (answers) => {
  const wasReorderCompletely = (arr1, arr2) => {
    for (let i = 1; i < arr1.length; i++) {
      if (arr1[i].number === arr2[i].number) {
        return false;
      }
      return true;
    }
  };
  let newAnswersObject = [...answers];
  newAnswersObject.sort(() => Math.random() - 0.5);
  return wasReorderCompletely(newAnswersObject, answers)
    ? newAnswersObject
    : reorderAnswers(answers);
};

const Question = (props) => {
  const [chosenAnswer, setChosenAnswer] = useState(false);
  const [markInAnswer, setMarkInAnswer] = useState(false);
  const [answersArray, setanswersArray] = useState(
    createAnswerObject(props.Question_Object.answers)
  );
  useEffect(() => {
    setanswersArray(createAnswerObject(props.Question_Object.answers));

    if (props.next_unanswered_q > props.q_num) {
      setChosenAnswer(+props.Question_Object.solution);
      setMarkInAnswer("RIGHT");
    } else {
      setChosenAnswer(false);
      setMarkInAnswer(false);
    }
  }, [props.Question_Object, props.q_num, props.next_unanswered_q]);

  const wasAnswered = props.q_num < props.next_unanswered_q;
  const isInfo = props.Question_Object.type === "info";

  const setAnswerHandler = (event, num) => {
    if (wasAnswered) return;
    setChosenAnswer(num);
  };
  const submitHandler = (event) => {
    const isCorrect = chosenAnswer === +props.Question_Object.solution;
    if (wasAnswered && !isInfo) {
      return;
    } else if (isInfo) {
      props.nextQuestionHandler();
      return;
    } else if (isCorrect) {
      setMarkInAnswer("RIGHT");
      setTimeout(
        () => {
          props.nextQuestionHandler();
          setMarkInAnswer(false);
          setChosenAnswer(false);
        },
        false ? 2 : TIME_AFTER_ANSWER
      );
    } else {
      setMarkInAnswer("WRONG");
      setTimeout(() => {
        setanswersArray(reorderAnswers(answersArray));
        setChosenAnswer(false);
        setMarkInAnswer(false);
      }, TIME_AFTER_ANSWER);
    }
  };
  return (
    <QuestionWrapper>
      <QuestionText>
        {props.q_num}. {props.Question_Object.text}
      </QuestionText>
      {answersArray.map((a) => (
        <Answer
          content={a.content}
          key={"Q" + props.q_num + a.number}
          num={a.number}
          isChosen={chosenAnswer === a.number ? true : false}
          chooseAnswerHandler={setAnswerHandler}
          marked_Answer={markInAnswer}
        />
      ))}
      <br></br>
      <SubmitButton
        disableButton={
          (!(chosenAnswer && !markInAnswer) || markInAnswer) && !isInfo
        }
        submitHandler={submitHandler}
      >
        {isInfo ? "Continue" : "Submit"}
      </SubmitButton>
    </QuestionWrapper>
  );
};
export default Question;

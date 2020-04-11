import React, { Component } from "react";
import Question from "../../components/Question/Question";
import allquestions from "./allquestions";
import AdvanceContext from "../../context/advance-context";
import ProgressBar from "../../components/ProgressBar/ProgressBar";

// import
class Qpanel extends Component {
  TIME_AFTER_ANSWER = 1500;
  answerHandler = (event, num) => {
    if (this.state.next_unanswered_q > this.state.question_number) {
      return;
    }
    this.setState({ ...this.state, chosenAnswer: num, marked_Answer: false });
  };
  submitHandler = (event) => {
    const num = this.state.chosenAnswer;
    const oldNumber = this.state.question_number;
    if (this.state.next_unanswered_q > oldNumber) {
      return;
    }

    if (num === +allquestions.questions[oldNumber].solution) {
      this.setState({ ...this.state, marked_Answer: "RIGHT" });
      const new_q_number = this.state.question_number + 1;
      setTimeout(() => {
        this.setState({
          ...this.state,
          marked_Answer: false,
          chosenAnswer: false,
          question_number: new_q_number,
          next_unanswered_q: new_q_number,
          current_question: allquestions.questions[new_q_number],
          current_question_ask: allquestions.questions[new_q_number].ask,
          current_answer_obj: this.createAnswerObject(
            allquestions.questions[new_q_number].answers
          ),
        });
      }, this.TIME_AFTER_ANSWER);
    } else {
      this.setState({ ...this.state, marked_Answer: "WRONG" });

      setTimeout(() => {
        const new_ans_array = [...this.state.current_answer_obj].sort(
          () => Math.random() - 0.5
        );
        this.setState({
          ...this.state,
          marked_Answer: false,
          current_answer_obj: new_ans_array,
          chosenAnswer: false,
        });
      }, this.TIME_AFTER_ANSWER);
    }
  };
  viewHandler = (event, number) => {
    let returnToLast = false;
    if (this.state.next_unanswered_q < +number + 1) {
      return;
    } else if (this.state.next_unanswered_q === +number + 1) {
      returnToLast = true;
    }
    console.log("clicked " + number, "was in " + this.state.question_view);
    const question_to_view = +number + 1;

    this.setState({
      ...this.state,
      marked_Answer: returnToLast ? false : "RIGHT",
      chosenAnswer: returnToLast
        ? false
        : +allquestions.questions[question_to_view].solution,
      question_number: question_to_view,
      current_question: allquestions.questions[question_to_view],
      current_question_ask: allquestions.questions[question_to_view].ask,
      current_answer_obj: this.createAnswerObject(
        allquestions.questions[question_to_view].answers
      ),
    });
  };
  createAnswerObject = (answers) =>
    answers.map((a) => {
      return { content: a, number: 1 + answers.indexOf(a) };
    });

  num = 1;
  state = {
    question_number: this.num,
    question_view: this.num,
    chosenAnswer: false,
    current_question: allquestions.questions[this.num],
    current_question_ask: allquestions.questions[this.num].ask,
    current_answer_obj: this.createAnswerObject(
      allquestions.questions[this.num].answers
    ),
    marked_Answer: false, // WRONG, RIGHT
    next_unanswered_q: 1,
  };

  render() {
    return (
      <AdvanceContext.Provider
        value={{
          q_number: this.state.question_number,
          total_q: Object.keys(allquestions.questions).length,
          q_next: this.state.next_unanswered_q,
        }}
      >
        <ProgressBar viewHandler={this.viewHandler} />
        <Question
          q_num={this.state.question_number}
          q_ask={this.state.current_question_ask}
          q_Ans_obj={this.state.current_answer_obj}
          answerHandler={this.answerHandler}
          submitHandler={this.submitHandler}
          chosenAnswer={this.state.chosenAnswer}
          marked_Answer={this.state.marked_Answer}
          next_unanswered_q={this.state.next_unanswered_q}
        />
      </AdvanceContext.Provider>
    );
  }
}
export default Qpanel;

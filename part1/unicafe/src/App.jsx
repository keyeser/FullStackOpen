import React, { useState } from 'react';

// Button component handles the functionality of each feedback submission button
const Button = ({ handleClick, text }) => {
  return <button onClick={handleClick}>{text}</button>;
};

// StatisticLine component for displaying a single statistic
const StatisticLine = ({ text, value }) => {
  return (
    <p>
      {text}: {value}
    </p>
  );
};

const Statistics = ({ good, neutral, bad }) => {
  const totalFeedback = good + neutral + bad;
  const averageScore = ((good - bad) / totalFeedback) || 0;
  const positiveFeedbackPercentage = (good / totalFeedback) * 100 || 0;

  return (
    <div>
      <h2>Statistics</h2>
      <StatisticLine text="Good" value={good} />
      <StatisticLine text="Neutral" value={neutral} />
      <StatisticLine text="Bad" value={bad} />
      <StatisticLine text="Total feedback" value={totalFeedback} />
      <StatisticLine text="Average score" value={averageScore.toFixed(2)} />
      <StatisticLine
        text="Positive feedback percentage"
        value={positiveFeedbackPercentage.toFixed(2) + '%'}
      />
    </div>
  );
};

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  const [feedbackGiven, setFeedbackGiven] = useState(false);

  const handleGoodClick = () => {
    setGood(good + 1);
    setFeedbackGiven(true);
  };
  const handleNeutralClick = () => {
    setNeutral(neutral + 1);
    setFeedbackGiven(true);
  };
  const handleBadClick = () => {
    setBad(bad + 1);
    setFeedbackGiven(true);
  };

  return (
    <div>
      <h2>Give feedback</h2>
      <Button handleClick={handleGoodClick} text="Good" />
      <Button handleClick={handleNeutralClick} text="Neutral" />
      <Button handleClick={handleBadClick} text="Bad" />

      <h2>Feedback counts</h2>
      <p>Good: {good}</p>
      <p>Neutral: {neutral}</p>
      <p>Bad: {bad}</p>

      {/* Render the Statistics component only if feedback has been given */}
      {feedbackGiven && <Statistics good={good} neutral={neutral} bad={bad} />}
    </div>
  );
};

export default App;

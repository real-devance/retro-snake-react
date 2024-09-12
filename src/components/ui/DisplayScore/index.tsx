interface DisplayScoreProps {
  score: number;
  scoreName: string;
}

function DisplayScore({ score, scoreName }: DisplayScoreProps) {
  return (
    <div className="text-center">
      {/* Display score value */}
      <p className="font-primary text-2xl md:text-4xl leading-none">{score}</p>
      {/* Display score name */}
      <p className="font-secondary text-lg tracking-wider leading-none">{scoreName}</p>
    </div>
  );
}

export default DisplayScore;
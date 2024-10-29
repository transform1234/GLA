import React from "react";

type Props = {
  name: string;
};

const Home: React.FC<Props> = ({ name }) => {
  return (
    <div>
      <h1>Hello {name}!</h1>
    </div>
  );
};

export default Home;

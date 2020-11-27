import * as React from 'react';

import { Section } from './styles';

const List = ({ children }) => {
  const [expanded, setExpanded] = React.useState(true);

  const handlePress = () => setExpanded(!expanded);

  return <Section>{children}</Section>;
};

export default List;

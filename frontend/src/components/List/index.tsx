import * as React from 'react';

import { Section } from './styles';

const List = ({ children, title }) => {
  const [expanded, setExpanded] = React.useState(true);

  const handlePress = () => setExpanded(!expanded);

  return <Section title={title}>{children}</Section>;
};

export default List;

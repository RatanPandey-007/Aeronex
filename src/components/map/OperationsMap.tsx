import React from 'react';
import { TacticalMapLibre, TacticalMapProps } from './TacticalMapLibre';

export type OperationsMapProps = TacticalMapProps;

export const OperationsMap: React.FC<OperationsMapProps> = (props) => {
  return <TacticalMapLibre {...props} />;
};

export default OperationsMap;
